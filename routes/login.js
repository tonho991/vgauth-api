const express = require('express');

const router = express.Router();

const fs = require('fs')

//ERROR EMAIL NOT FOUND
router.get('/', (req, res, next)=>{
  res.status(200).send({
    error: 'email invalido'
  });
});


//SET EMAIL
router.post('/', (req, res, next) =>{
  res.status(201).send({
    error:'??'
  });
});


//GET INFO EMAIL
router.get('/:email/:senha',(req, res, next)=>{
  const email_r = req.params.email;
  const senha_r = req.params.senha;
  
  var veri = getVerification(email_r);
  
  if(contem(email_r, senha_r)){
    res.status(200).send({
      
      info:{
        email: email_r,
        senha: senha_r,
        status: "login concluido"
        
      }
    });
    }else{
      res.status(200).send({
        info:{
          email: email_r,
          senha: senha_r,
          status: 'login invalido! verifique o email, ou se a senha esta correta'
        }
      });
    }
});

function contem(email_user, senha_user){
  const c_email = false;
  const data = fs.readFileSync('./dados/dados.json', 'utf-8');
  var json = JSON.parse(data);
 
  for(var i = 0; i < json.length; i++){
    if(json[i].email === email_user && json[i].senha === senha_user){
      return true;
      break;
    }
    
  }
  return c_email;
}

function getVerification(_email){
  const list = json.parse(fs.readFileSync('./dados/dados.json'))
  for(var i = 0; i < list.length; i++){
    if(list[i].email === _email){
      return list[i].verificado;
    }
  }
  return "false";
}

module.exports = router;

