const express = require('express');
const Categoria = require('../models/categoria');
const  middleware = require('../middlewares/authenticacion');
const app = express();


app.get('/categoria', (req, res) => {

    Categoria.find({estado: true})
        .populate('usuario' , 'nombre email')
        .exec( (err, categorias) => {
            if (err) return res.status(400).json({ok:false,err});

        
            Categoria.countDocuments({estado:true}, (err, conteo) => {
                if (err) return res.status(400).json({ok:false,err});

                if (!conteo) return res.status(404).json({ok:false,err:{message: "no hay categorias"}});

                res.json({
                    ok: true,
                    categorias,
                    conteo
                })
            })
            
        })


})


app.get('/categoria/:id', (req, res) => {
    
    let id = req.params.id;

    Categoria.findById({_id: id})
        .sort('nombre')
        .populate('usuario' , 'nombre email')
        .exec( (err, categoria) => {
            
            if (err) return res.status(400).json({ ok:false, err });

            if (!categoria || categoria.estado === false) return res.status(404).json({ok:false,err:{message: "no hay categoria con ese id"}});

            res.json({
                ok: true,
                categoria,
            })
            
            
        })

})


app.post('/categoria', middleware.verificarToken ,  (req, res) => {

    let nombre = req.body.nombre;

     console.log(req.usuario._id, "usuario id");

    
    categoria = new Categoria({nombre: nombre, usuario: req.usuario._id });

    categoria.save( (err, categoriaDB) =>{
        
        if (err) return res.status(400).json({ok:false,err});
        
        res.json({
            ok: true,
            categoriaDB,

        })
    })

        
    


})




app.put('/categoria/:id' , (req, res) => {

    let id = req.params.id;
    let nuevoNombre = req.body;
    

    Categoria.findByIdAndUpdate(id , nuevoNombre , { new:true , runValidators: true, context:'query'} , (err, resultado) => {

        if (err) return res.status(400).json({ok:false,err});

        if (!resultado) return res.status(404).json({ok:false,err:{message: "no hay categoria con ese id"}});

        res.json({
            ok:true,
            resultado
        })

    })
    

})

app.delete('/categoria/:id', [ middleware.verificarToken , middleware.verificarAdmin_Role ],(req, res) => {
    

    let id = req.params.id;

    Categoria.findByIdAndUpdate(id , { estado: false } , { new:true , runValidators: true, context:'query'} , (err, resultado) => {

        if (err) return res.status(400).json({ok:false,err});

        if (!resultado) return res.status(404).json({ok:false,err:{message: "no hay categoria con ese id"}});

        res.json({
            ok:true,
            resultado
        })

    })

})

module.exports = app;