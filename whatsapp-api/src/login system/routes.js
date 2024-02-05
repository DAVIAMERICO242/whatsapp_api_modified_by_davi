const express = require('express');
const auth_routes = express.Router();


auth_routes.get('/',(req,res)=>{
    if(req.session.name){
        console.log('encontrado')
        res.redirect('/api-docs')
    }else{
        console.log('nao encontrado')
        res.render('./login/init')
    }
})

// auth_routes.get('/api-docs',(req,res)=>{
//     if(req.session.name){
//         next()
//     }else{
//         res.redirect('/')
//     }
// })


auth_routes.get('/cadastro',(req,res)=>{//sign up
    res.render('./cadastro/cadastro')
})

auth_routes.post('/autenticar',(req,res)=>{//if auth is ok
    var users_and_pass = {'usuario1':'123456','usuario2':'54321','usuario3':'123456','usuario4':'123'}
    console.log(users_and_pass[req.body.login])
    if(users_and_pass[req.body.login] == req.body.senha){
        console.log('auth')
        res.status(200);
        req.session.name = 'Any Authorized User'
        res.redirect('/');
    }
    else{
        res.status(400).json({auth:false});
        console.log('fail')
    }
})

auth_routes.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

module.exports = {
    auth_routes
}