
const express = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');
const _ = require('underscore');


const app = express();


app.get('/usuario', function (req, res) {

    let desde = parseInt(req.query.desde) || 0;
    let limite = parseInt(req.query.limite) || 0;


    Usuario.find({estado:true}, 'nombre email role estado img google')
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {
                if (err) return res.status(400).json({ok:false,err});

            
                Usuario.countDocuments({estado:true}, (err, conteo) => {
                    if (err) return res.status(400).json({ok:false,err});

                    res.json({
                        ok: true,
                        usuarios,
                        conteo
                    })
                })
                
            }
            
            )

    

});

app.post('/usuario', function (req, res) {

    let body = req.body;
    


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {

        if (err) return res.status(400).json({ok:false,err});

        // usuarioDB.password = null,

        res.json({
            ok:true,
            usuario:usuarioDB});

    })


    
});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','type','img','role','estado'] );

    Usuario.findByIdAndUpdate( id, body, { new:true , runValidators: true, context:'query'}, (err, usuarioDB) => {

        if (err) return res.status(400).json({ok:false,err});

        res.json({
            ok:true,
            usuario: usuarioDB
        });
    })

    
});

app.delete('/usuario/:id', function (req, res) { //baja logica
    
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
    Usuario.findByIdAndUpdate(id, {estado: false}, {new:true}, (err, usuarioEliminado) =>{

        if (err) return res.status(400).json({ok:false,err});

        if (!usuarioEliminado) return res.status(400).json({ok:false,err: { message: 'Usuario no encontrado'}});

        res.json({
            ok: true,
            usuario: usuarioEliminado
        })
    })


});


module.exports = app;