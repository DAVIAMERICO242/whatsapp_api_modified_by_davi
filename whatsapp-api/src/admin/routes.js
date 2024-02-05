const express = require('express')
const admin_routes = express.Router()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./databases/whatsapp_robusto.sql')
var users = []
const tokens = []


admin_routes.post('/cadastrar_usuario',(req,res)=>{
    if(req.session.name!=='admin'){
        res.status(404).send('NÃO AUTORIZADO')
    }else{
        if(req.body.user_name && req.body.user_pass){
                new_user = req.body.user_name.trim().replace(/\s+/g, ' ').toUpperCase();
                new_pass = req.body.user_pass;
                const insertUser = `INSERT INTO users (user, pass) VALUES (?, ?);`;
                // Execute the INSERT statement
                db.run(insertUser, [new_user, new_pass], function (err) {
                    if (err) {
                        res.status(404).redirect('/');
                        return console.error(err.message);
                    }
                    res.status(200).redirect('/');
                });
        }else{
            res.status(200).redirect('/')
        }
        }
})

admin_routes.post('/del_user',(req,res)=>{
    if(req.session.name!=='admin'){
        res.status(404).send('NÃO AUTORIZADO')
    }else{
        if(req.body.del_user){
            console.log(req.body.del_user.trim().replace(/\s+/g, ' ').toUpperCase());
            var target_user = req.body.del_user.trim().replace(/\s+/g, ' ').toUpperCase();
            const delUser = `DELETE FROM users WHERE user = ?;`;
            db.run(delUser, [target_user], function (err) {
                if (err) {
                    res.status(404).redirect('/');
                    return console.error(err.message);
                }
                res.status(200).redirect('/');
            });
            
        }
    }
})

admin_routes.post('/del_token',(req,res)=>{
    if(req.session.name!=='admin'){
        res.status(404).send('NÃO AUTORIZADO')
    }else{
        if(req.body.select_token){
            console.log(req.body.select_token.trim().replace(/\s+/g, ' ').toUpperCase());
            var target_token = req.body.select_token.trim().replace(/\s+/g, ' ').toUpperCase();
            const delToken = `DELETE FROM allowed_tokens WHERE token = ?;`;
            db.run(delToken, [target_token], function (err) {
                if (err) {
                    res.status(404).redirect('/');
                    return console.error(err.message);
                }
                res.status(200).redirect('/');
            });
            
        }else{
            res.status(200).redirect('/');
        }
    }
})


admin_routes.post('/cadastrar_token',(req,res)=>{
    if(req.session.name!=='admin'){
        res.status(404).send('NÃO AUTORIZADO')
    }else{
        if(req.body.token){
                new_token = req.body.token.trim().replace(/\s+/g, ' ').toUpperCase();
                const insertToken = `INSERT INTO allowed_tokens (token) VALUES (?);`;
                // Execute the INSERT statement
                db.run(insertToken, [new_token], function (err) {
                    if (err) {
                        res.status(404).redirect('/');
                        return console.error(err.message);
                    }
                    res.status(200).redirect('/');
                });
        }
        }
})

admin_routes.get('/users_and_tokens',(req,res)=>{
    if(req.session.name!=='admin'){
        res.status(404).send('NÃO AUTORIZADO')
    }else{
        const users = []
        const tokens = []
        const selectAllUsers = `SELECT * FROM users;`;
        db.all(selectAllUsers, [], (err, rows) => {
            if (err) {
                res.status(404).redirect('/');
                throw err;
                return
            }

            // Log the results
            rows.forEach((row) => {users.push(row.user);});
            ////////Para não usar promise
            const selectAllTokens = `SELECT * FROM allowed_tokens;`;
            db.all(selectAllTokens, [], (err, rows) => {
                if (err) {
                    res.status(404).redirect('/');
                    throw err;
                }
    
                // Log the results
                rows.forEach((row) => {tokens.push(row.token);});
                res.status(200).json({'user':users,'token':tokens})
            });
        });
        
    }
})



admin_routes.post('/editar_usuario',(req,res)=>{
    if(req.session.name!=='admin'){
        res.status(404).send('NÃO AUTORIZADO')
    }else{
        if(req.body.new_value){
                target_user = req.body.select_user
                target_operation = req.body.action_selector
                new_value = req.body.new_value
                if(req.body.action_selector=='username'){
                    new_value = new_value.trim().replace(/\s+/g, ' ').toUpperCase()
                    console.log('UE')
                    var updateUser = `UPDATE users SET user = ? WHERE user = ?;`;
                }else{
                    console.log('UE')
                    var updateUser = `UPDATE users SET pass = ? WHERE user = ?;`;
                }
                // Execute the INSERT statement
                db.run(updateUser, [new_value, target_user], function (err) {
                    if (err) {
                        res.status(404).redirect('/');
                        return console.error(err.message);
                    }
                    res.status(200).redirect('/');
                });
        }else{
                res.status(200).redirect('/');
        }
        }
})

admin_routes.get('/database',(req,res)=>{//nivel de dev
    if(req.session.name!=='admin'){
        res.status(404).send('NÃO AUTORIZADO')
    }else{
        var users_and_pass = {};
        const selectAllUsers = `SELECT * FROM users;`;
        db.all(selectAllUsers, [], (err, rows) => {
            if (err) {
                res.status(404).redirect('/');
                throw err;
            }

            // Log the results
            rows.forEach((row) => {
                users_and_pass[row.user] = row.pass;
            });
            res.status(200).send(users_and_pass);
        });
    }
})


module.exports = {
    admin_routes
}