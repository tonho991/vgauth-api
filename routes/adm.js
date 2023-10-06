const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');


router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json())



router.get("/", (req, res, next) =>{
  res.status(404).send({
    info:{
      status:'erro 404. verifique a url se esta correto'
    }
  });
});

//ADM ROOT
 router.post('/vgapp', (req, res, next) =>{
 
    const {type} = req.body;
    
    const list_users = JSON.parse(fs.readFileSync('./dados/dados.json', 'utf-8'));
    const list_project = JSON.parse(fs.readFileSync('./dados/projetos.json', 'utf-8'));
  
  
    if(type === "get_list_users"){
      res.status(200).send({
        users_list: list_users,
        info: `total de usarios: ${list_users.length}`
      });
    }else if(type === "delete_users"){
      res.status(200).send({
         status: "deletado",
         lista_antiga: list_users
      });
      fs.writeFileSync(path, "[]");
    }else if(type === "get_list_project"){
      res.status(200).send({
        status: 'lista de projetos',
        list: list_project,
        info: `total de projetos: ${list_project.length} `
      });
    }else{
     res.status(404).send({
      info:{
        status:'erro 404. verifique a url se esta correto'
      }
     });
    }  
   });
  

//adm for users
router.post('/project',(req, res, next)=>{
  const {data} = req.body;
  const {type} = JSON.parse(data);
  
  if(type === 'delete_project'){
    const {project_name} = JSON.parse(data);
    var name = project_name;
    
    deleteProject(getProjectPath(name), name);
  }
  
});

function getProjectPath(_name){
  const list = JSON.parse(fs.readFileSync('./dados/projetos.json','utf-8' ));
  for(var i = 0; i < list.length; i++){
    if(list[i].name === _name){
      return list[i].project_path;
    }
  }
  return null;
}

function checkUser(_key){
  const list = JSON.parse(fs.readFileSync('./dados/projetos.json','utf-8' ));
  for(var i = 0; i < list.length; i++){
    if(list[i].key === _key){
      return true;
    }
  }
  return false;
}

function deleteProject(_path, _name) {
  const list = JSON.parse(fs.readFileSync('./dados/projetos.json', 'utf-8'));
  fs.unlink(path.join('/projetos/tonho1.js'), (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("File is deleted.");
});


  for(var i = 0; i < list.length; i++){
    if(list[i].name === _name){
      delete list[i];
      break;
    }
  }
}


module.exports = router;