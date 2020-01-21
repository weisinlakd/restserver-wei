const express = require ('express');

const fs = require ('fs');

const { verificarTokenImg } = require('./../middlewares/authenticacion');

let app = express();

const path = require('path')


app.get('/imagen/:tipo/:img', verificarTokenImg , (req, res) => {


    let tipo = req.params.tipo;
    let img = req.params.img;

    let tipoOk = ["usuarios" , "productos"]
    

    tipoOk = tipoOk.find(tipos => tipos === tipo);

    if (!tipoOk){
        console.log("hola")
        return res.status(404).json({ok: false, err: {message: "la dirección no es correcta"}});
    }

    let pathImg = path.resolve( __dirname , `../../uploads/${tipo}/${img}`);


    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {

        let noImagePath = path.resolve( __dirname, '../assets/no-image.jpg');

        res.sendFile(noImagePath);
    }
})



module.exports = app;
