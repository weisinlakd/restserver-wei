const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const app = express();
const path = require('path');
const fs = require('fs');


app.use(fileUpload({createParentPath: true}));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;    
    let id = req.params.id;
    let tipoOk = ["usuarios" , "productos"]

    tipoOk = tipoOk.find(tipos => tipos === tipo);

    if (!tipoOk){
        console.log("hola")
        return res.status(404).json({ok: false, err: {message: "la dirección no es correcta"}})
    }


    if (!req.files || Object.keys(req.files).length === 0) {
        
        return res.status(400).json({ok: false, err: {message: "no se subió un archivo"}});

    }

    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    // console.log(archivo);

    let ext = ['jpg', 'jpeg', 'gif' , 'png'];

    let archivoExt = archivo.name.split('.');
    archivoExt = archivoExt[archivoExt.length-1];

    ext = ext.find(ext => ext === archivoExt);

    // console.log(ext)

    if (ext){
    // Use the mv() method to place the file somewhere on your server

        let nombre = `${id}-${ new Date().getMilliseconds()}.${ext}`
        let ruta = path.resolve( __dirname , `${process.env.RUTA_IMG}`);


        
        archivo.mv(`${ruta}/${tipo}/${nombre}`, (err) => {


            if (err){
                return res.status(500).json({
                    ok: false, 
                    message: 'primer if',
                    pathMio: `${ruta}/${tipo}/${nombre}`,
                    err
                })
            }

            if (tipo == 'usuarios') {
                imagenUsuario(id , res , nombre);
            } else {
                imagenProducto(id , res , nombre);
            }
            

        });


    } else {
        return res.status(500).json({
            ok: false, err: {
                message: "la extensión no es valida"
            }
        });
    }
});




function imagenUsuario(id, res, nombre) {


    Usuario.findById({_id: id} , (err, usuarioDB) => {

        if (err){
            borrarArchivo(nombre, 'usuarios');
            return res.status(500).json({ok: false,  message: 'segundo if', err});
        }
        
        if (!usuarioDB){
            borrarArchivo(nombre, 'usuarios');
            return res.status(500).json({ok: false,  message: 'tercer if', err})
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombre;

        usuarioDB.save(
            (err, usuarioDB) => {

                if (err)
                    return res.status(500).json({ok: false, err});
                
                    res.json({
                        ok: true, 
                        usuario: usuarioDB, 
                        img: nombre
                    });
            }
        )
        

    })
}

function imagenProducto(id, res, nombre) {


    Producto.findById({_id: id} , (err, productoDB) => {

        if (err){
            borrarArchivo(nombre, 'productos');
            return res.status(500).json({ok: false,  message: 'cuarto if', err});
        }
        
        if (!productoDB){
            borrarArchivo(nombre, 'productos');
            return res.status(500).json({ok: false,  message: 'quinto if', err})
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombre;

        productoDB.save(
            (err, productoDB) => {

                if (err)
                    return res.status(500).json({ok: false, err});
                
                    res.json({
                        ok: true, 
                        producto: productoDB, 
                        img: nombre
                    });
            }
        )
        

    })
}






function borrarArchivo (nombre, tipo) {

    let rutaImg = path.resolve( __dirname , `${process.env.RUTA_IMG}/${tipo}/${nombre}`);

    // console.log(rutaImg)
    if (fs.existsSync(rutaImg)) {
        console.log("borrar img");
        fs.unlinkSync(rutaImg);
    }

}

module.exports = app;