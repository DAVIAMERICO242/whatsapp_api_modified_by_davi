const express = require('express');
const auth_routes = express.Router();


auth_routes.get('/',(req,res)=>{
    console.log(req.session.name)
    if(req.session.name){
        if(req.session.name==='admin'){
            console.log('O USUARIO É ADMIN')
            res.redirect('/admin')

        }else{
            console.log('O USUARIO NAO É ADMIN')
            res.redirect('/api-docs')
        }
    }
    else{
        console.log('nao encontrado')
        res.render('./login/init')
    }
})

auth_routes.get('/admin',(req,res)=>{
    if(req.session.name!=='admin'){
        res.status(404).send('Não autorizado')
    }else{
        res.render('./admin/admin')
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
    var users_and_pass = {'admin':'896321574','usuario1':'123456','usuario2':'54321','usuario3':'123456','usuario4':'123'}
    console.log('LOGIN')
    console.log(req.body.login)
    console.log('SENHA INSERIDA')
    console.log(req.body.senha)
    if(users_and_pass[req.body.login] == req.body.senha){
        console.log('AUTORIZADO EM /AUTENTICAR');
        req.session.name = req.body.login
        res.status(200).redirect('/');
    }
    else{
        console.log('NAO AUTORIZADO EM /AUTENCIAR')
        res.status(400).json({auth:false});
    }
})

auth_routes.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

module.exports = {
    auth_routes
}