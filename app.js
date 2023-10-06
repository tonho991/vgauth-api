const express = require('express');
const app = express();

const route_login = require('./routes/login');
const route_cadastrar = require('./routes/cadastrar')
const route_adm = require('./routes/adm');
const route_project = require('./routes/create_project');
const route_config_project = require('./projetos/project');
const route_auth = require('./projetos/auth');
const route_verify = require('./routes/verify');

app.use('/login', route_login);
app.use('/cadastro', route_cadastrar)
app.use('/adm', route_adm);
app.use('/new_project', route_project);
app.use('/project', route_config_project);
app.use('/auth', route_auth);
app.use('/veri', route_verify)

app.use((req, res, next) =>{
  res.status(404).send({
    info:{
      status:'erro 404. verifique a url se esta correto'
    }
  });
});


app.use((error,req, res, next)=>{
  res.status(error.status || 500);
  return res.send({
    error: error.message
  });
  console.log(error)
});



module.exports = app;
