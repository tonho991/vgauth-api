const express = require('express');

const router = express.Router();

const fs = require('fs')

//ERROR EMAIL NOT FOUND
router.get('/', (req, res, next)=>{
  res.status(200).send({
    error: 'email invalido'
  });
});



//Criar conta 
router.get('/:email/:senha',(req, res, next)=>{
  var email_r = req.params.email;
  var senha_r = req.params.senha;
  var uid = uuid();
  var apiKey = getApiKey();
  
  const raw = fs.readFileSync('./dados/dados.json', 'utf-8');
  const json = JSON.parse(raw);
  const dados_user = [{
    email: email_r,
    senha: senha_r,
    uid: uid,
    apiKey: apiKey,
    verified: 'false'
  }];
  const toWrite = JSON.stringify(json.concat(dados_user));
  
  if(contem(email_r)){
  res.status(200).send({
      info:{
        email: email_r,
        senha: senha_r,
        status: 'conta ja cadastrada.'
      }
    });
  }else if(senha_r.length < 6){
    res.status(200).send({
      info:{
        email: email_r,
        senha: senha_r,
        status: 'senha muito curta. pelo menos mais de 6 caracteres'
      }
    });
  }else if(email_r.indexOf('@') > -1 && email_r.indexOf('.com') > -1){
    fs.writeFileSync('./dados/dados.json', toWrite);
    res.status(200).send({
      info: {
        email: email_r,
        senha: senha_r,
        uid: uid,
        apiKey: apiKey,
        verified: 'false'
      }
    });
  }else{
    res.status(201).send({
      info:{
        email: email_r,
        senha: senha_r,
        status: "email invalido"
      }
    });
  }
  
});


//verificar se não tem email na lista
function contem(email_user){
  const data = fs.readFileSync('./dados/dados.json', 'utf-8');
  var json = JSON.parse(data);
  
  for(var i = 0; i < json.length; i++){
    if(json[i].email === email_user){
      return true;
    }
  }    
  return false ;
}


//gerar uid
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//gerar chave de api
function getApiKey() {
  return 'VGyxxx-xxxxx-xxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
module.exports = router;