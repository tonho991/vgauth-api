const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json())

 router.post('/', (req, res, next) =>{
  const {data} = req.body;
  const {apiKey, project} = JSON.parse(data);
  const idP = id();
  var email_user = getEmail(apiKey);
  
  const json = JSON.parse(fs.readFileSync('./dados/projetos.json', 'utf-8'));
  
  const dados_project = [{
     key: apiKey,
     name: project,
     project_id: idP,
     project_path: `./projetos/${project}.json`,
     email: email_user
  }];

  const toWrite = JSON.stringify(json.concat(dados_project));
  
 if(contemP(project)){
    res.status(200).send({
      info: 'projeto ja criado tente outro nome'
    });
  }else if(checkUser(apiKey)){
   res.status(201).send({
     info: 'chave de api invalida.'
   });
  }else{
    newProject(project);
    res.status(200).send({
      info: 'projeto criado com sucesso.',
      project_info:{
        apiKey: apiKey,
        name: project,
        project_id: idP
      }
    });
    
    fs.writeFileSync('./dados/projetos.json', toWrite);
  }

  
 });

function getEmail(_key){
  const list = JSON.parse(fs.readFileSync('./dados/dados.json'));
  for(var i = 0; i < list.length; i++){
    if(list[i].apiKey === _key){
      return list[i].email;
    }
  }
  return null;
}

function newProject(_name) {
  fs.writeFile(`./projetos/${_name}.json`, '[]', function (err) {
    if (err) return console.log(err);
    console.log('File is created successfully.');
  });
}
function contemP(_name){
  const list = JSON.parse(fs.readFileSync('./dados/projetos.json', 'utf-8'))
  for(var i = 0; i < list.length; i++){
    if(list[i].name === _name){
      return true;
    }
  }
  return false;
}

function checkUser(_key){
  const list = JSON.parse(fs.readFileSync('./dados/dados.json', 'utf-8'));
  for(var i = 0; i < list.length; i++){
    if(list[i].apiKey === _key){
      return false;
    }
  }
  return true;
}
function id (){
  return 'yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = router;