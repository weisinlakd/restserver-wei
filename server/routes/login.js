
const express = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');
// const _ = require('underscore');

const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



const app = express();


app.post('/login', (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    Usuario.findOne({email}, (err, resp) => {

        if (err) return res.status(500).json({ok:false,err});

        if (!resp) return res.status(400).json({ok:false,err: {message: '(usuario) o contraseña incorrectos' + email}});

        bcrypt.compare(password, resp.password, (err, same)=>{
            if (err) return res.status(500).json({ok:false,err});

            if (!same) return res.status(400).json({ok:false,err: {message: 'usuario o (contraseña) incorrectos'}}); //solo para dev; en produccion no indicar si es el email o la pass lo que esta mal!!

            if (same) {

                let token = jwt.sign({
                    usuario: resp
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

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


//google verify

async function verify( token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    
}





app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err=>{
            return res.status(403).json({
                ok:false, err
            })
        });

    


    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=> {

        if (err) return res.status(500).json({ok:false,err: {message: 'chau'}});

        if (usuarioDB){ 

            if (usuarioDB.google === false ){

                if (err) return res.status(400).json({ok:false,err: {message: "debe logearse de forma normal"}});

            } else {

                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

                res.json({
                    ok:true,
                    message: 'logeado como ' + usuarioDB.email,
                    usuario: usuarioDB,
                    token
                })

            }
        } else { //no existe

            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                password: ' googleUser',
                img: googleUser.img,
                google: true
            });


            usuario.save( (err, usuarioDB) =>{
                if (err) return res.status(400).json({ok:false,err: {message: "hola"}});

                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

                res.json({
                    ok:true,
                    message: 'logeado como ' + usuarioDB.email,
                    usuario: usuarioDB,
                    token
                })
            })
        }


    })

})





module.exports = app;