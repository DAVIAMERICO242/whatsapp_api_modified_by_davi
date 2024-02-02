const express = require('express');
const auth_routes = express.Router();


const authMiddleware = (req, res, next) => {
    if (req.session.name) {
        // Usuário autenticado, permitir que a solicitação prossiga
        next();
    } else {
        // Usuário não autenticado, redirecionar para a página de login
        res.send('Não Autorizado');
    }
};

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
    console.log('postado')
    if(req.body.senha=='896321574' || req.query.senha=='896321574'){
        console.log('auth')
        res.status(200);
        req.session.name = 'Davi américo'
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
    auth_routes,
    authMiddleware
}