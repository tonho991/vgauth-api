const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json());

//login usuário
router.post('/login', (req, res, next)=>{
  const {data} = req.body;
  const {id, email, senha} = JSON.parse(data);
  var path = getProjectPath(id);
  var uid = getUserUid(email, path);
  
  var veri = getVerification(email, path);
  
  if(!contem(email, senha, path)){
    res.status(201).send({
      info:{
        status:'login invalido, verifique se  o email e senha estao corretos.'
      }
    });
  }else if(!contemId(id)){
   res.status(201).send({
      info:{
        status: 'projeto invalido'
      }
    });
  }else{
  res.status(200).send({
      info:{
        status: 'login concluido',
        email: email,
        senha: senha,
        uid: uid,
        
      }
    });
  }
});

//cadastrar usuário
router.post('/cadastro', (req, res, next)=>{
  const {data} = req.body;
  const {id, email, senha} = JSON.parse(data);
  
  var uid = uuid();
  var path = getProjectPath(id);
  
  const json = JSON.parse(fs.readFileSync(path, 'utf-8'));
  const user_info = [{
    email: email,
    senha: senha,
    uid: uid,
    verificado: "false"
  }];
  const toWrite = JSON.stringify(json.concat(user_info));
  
  if(!contemId(id)){
    res.status(201).send({
      info:{
        status: 'projeto invalido'
      }
    });
  }else if(contem(email, senha, path)){
    res.status(201).send({
      info:{
        status: 'cadastro já realizado com esse email',
        email: email,
        senha: senha
      }
    });
  }else if(senha.length < 6){
    res.status(201).send({
      info:{
        status: 'senha muito curta, pelo menos de 6 caracteres.'
      }
    });
  }else if(email.indexOf('@') > -1 && email.indexOf('.com') > -1){
   fs.writeFileSync(path, toWrite);
    res.status(200).send({
      info:{
        status: 'cadastro concluido',
        email: email,
        senha: senha,
        uid: uid
      }
    });
  }else{
    res.status(201).send({
      info:{
        status: 'tipo de email invalido'
      }
    });
  }
  
});



//funções
function contem(email_user, senha_user, _path){
  const json = JSON.parse(fs.readFileSync(_path, 'utf-8'));
  
  for(var i = 0; i < json.length; i++){
    if(json[i].email === email_user && json[i].senha === senha_user){
      return true;
      break;
    }
  }    
  return false ;
}


function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function getProjectPath(_id){
  const list = JSON.parse(fs.readFileSync('./dados/projetos.json', 'utf-8'));
  for(var i = 0; i < list.length; i++){
    if(list[i].project_id === _id){
      return list[i].project_path;
    }
  }
  return null;
}

function contemId(_id){
  const list = JSON.parse(fs.readFileSync('./dados/projetos.json', 'utf-8'));
  for(var i = 0; i < list.length; i++){
    if(list[i].project_id === _id){
      return true;
    }
  }
  return false;
}

function getUserUid(_email, _path){
  const list = JSON.parse(fs.readFileSync(_path, 'utf-8'));
  for(var i = 0; i < list.length; i++){
    if(list[i].email === _email){
      return list[i].uid;
      break;
    }
  }
  return null;

}

module.exports = router;