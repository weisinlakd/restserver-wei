
const express = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');
// const _ = require('underscore');

const jwt = require('jsonwebtoken');


const app = express();


app.post('/login', (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    Usuario.findOne({email}, (err, resp) => {

        if (err) return res.status(400).json({ok:false,err});

        if (!resp) return res.status(400).json({ok:false,err: {message: '(usuario) o contraseña incorrectos' + email}});

        bcrypt.compare(password, resp.password, (err, same)=>{
            if (err) return res.status(400).json({ok:false,err});

            if (!same) return res.status(400).json({ok:false,err: {message: 'usuario o (contraseña) incorrectos'}}); //solo para dev; en produccion no indicar si es el email o la pass lo que esta mal!!

            if (same) {

                let token = jwt.sign({
                    usuario: resp
                }, process.env.SEED, {expiresIn: 60*60*24*30})

                res.json({
                    ok:true,
                    message: 'logeado como ' + email,
                    usuario: resp,
                    token
                })
            }
        });
        
    })
    

    
})







module.exports = app;