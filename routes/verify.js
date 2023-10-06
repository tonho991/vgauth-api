const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json());


router.post('/send', (req, res, next) =>{
  const {data} = req.body;
  const {user, uid, id} = JSON.parse(data);
  
  var code = getRndInteger(1000, 9999);
  
  var p_name = getProjectInfo(id);
 
  const json = JSON.parse(fs.readFileSync('./dados/verifications.json'));
  const new_json = [{
    email: user,
    code: `${code}`,
    id: id,
    uid: uid
  }];
  
  var toWrite = JSON.stringify(json.concat(new_json));
  var url = `http://localhost:3000/veri/verification/${uid}/${code}`
  
  fs.writeFileSync('./dados/verifications.json', toWrite )
  
  sendEmail(user, p_name, code, url);
    res.status(200).send({
      info:{
        status: 'um email foi enviado para a verificação de seu email! verifique sua caixa de entrada.',
        code: `${code}`
      }
    });
  
  
  
});

router.get('/verification/:uid/:code/', (req, res, next) =>{
  var uid = req.params.uid;
  var code = req.params.code;
  
  res.set('Content-Type', 'text/html');
  var checked = false;
  var site1 = fs.readFileSync('./sites/veri.html')
  var site2 = fs.readFileSync('./sites/err.html')

  
  const list = JSON.parse(fs.readFileSync('./dados/verifications.json'));

  var position = 0;
  for(var i = 0; i < list.length; i++){
    if(list[i].uid === uid && list[i].code === code){
      
      position = i;
      checked = true;
     
    }
  }
  
  const list1 = JSON.stringify(list.splice(0,position));
  
  fs.writeFileSync('./dados/verifications.json', list1)
  
  
  
  if(checked){
   res.send(Buffer.from(site1));
  } else {
   res.send(Buffer.from(site2));
  }
  
});


function print(_str){
  console.log(_str)
}

function verify(_uid, _code){
  const list = JSON.parse(fs.readFileSync('./dados/verifications.json'));
  for(var i = 0; i < list.length; i++){
    if(list[i].uid === _uid && list[i].code === _code){
      return true;
      delete list[i]
      print(JSON.stringify(list)); 
      break;
    }
  }
  return false;
}




function checkEmailExist(_path, _email){
  const list = JSON.parse(fs.readFileSync(_path));
  for(var i = 0; i < list.length; i++){
    if(list[i].email === _email){
      return true;
    }
  }
  return false;
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



function getProjectInfo(_id){
  const list = JSON.parse(fs.readFileSync('./dados/projetos.json'));
  for(var i = 0; i < list.length; i++){
    return list[i].name
    
  }
  return null;
}

function sendEmail(_email, _name,  _number, _url){
   var transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth:{
    user: "naoresponda426@gmail.com",
    pass: "naoresponda123"
  },
  tls:{
    rejectUnauthorized: false
  }
});

async function run(){
  const mailSent = await transport.sendMail({
    html: `
    <h2> Verfique seu email</h2> 
    <br> 
    entre na url para verificar seu email:
    <a href="${_url}"> Verificar</a>
    <br><br> 
    se não for você que solicitou esse código, ignore esse email.
    `,
    
    subject:'Verficação de email',
    from: `${_name} <naoresponda426@gmail.com>`,
    to: _email
  });
  console.log('enviado')
}
run();

}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

module.exports = router;