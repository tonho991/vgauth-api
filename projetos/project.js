const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/info/:id', (req, res, next) =>{
  const id = req.params.id;
  const {users, project_id, name} = projectInfo(id);
  
  res.status(200).send({
    project_id: id,
    status: 200,
    info:{
      usuarios: users,
      id: project_id,
      nome: name
    }
  });
});

router.get('/delete/:id', (req, res, next) =>{
  var id = req.params.id;
  var path = getPathProject(id);
  fs.unlink(path, function(err){
    if(err){
      res.status(201).send({
        info:{
          status: 'falha ao deletar ao projeto.'
        }
      });
    }
    res.status(200).send({
      info:{
        status: 'deletado'
      }
    });
  });
});



function projectInfo(_id){
  const list = JSON.parse(fs.readFileSync('./dados/projetos.json', 'utf-8'));
  
  for(var i = 0; i < list.length; i++){
    if(list[i].project_id === _id){
      const users = JSON.parse(fs.readFileSync(list[i].project_path, 'utf-8'));
      const info = {
        users: users.length,
        project_id: list[i].project_id,
        name: list[i].name
      };
      return info;
      break;
    }
  }
  return null;
}


function getPathProject(_id){
  const list = JSON.parse(fs.readFileSync('./dados/projetos.json', 'utf-8'));
  for(var i = 0; i < list.length; i++){
    if(list[i].project_id === _id){
      return path.join(__dirname, list[i].project_path);
      break;
    }
  }
  return null;
}
module.exports = router;