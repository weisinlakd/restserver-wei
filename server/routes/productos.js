const express = require('express');
const Producto = require('../models/producto');
const  middleware = require('../middlewares/authenticacion');
const app = express();


// get *

app.get('/producto', (req, res) => {

    let desde = parseInt(req.query.desde) || 0;
    let limite = parseInt(req.query.limite) || 0;

    Producto.find({estado: true})
        .skip(desde)
        .limit(limite)
        .populate('usuario' , 'nombre email')
        .populate('categoria' , 'nombre')
        .exec( (err, productos) => {

            if (err) return res.status(400).json({ok:false,err});
        
            Producto.countDocuments({estado:true}, (err, conteo) => {
                if (err) return res.status(400).json({ok:false,err});

                if (!conteo) return res.status(404).json({ok:false,err:{message: "no hay productos"}});

                res.json({
                    ok: true,
                    productos,
                    conteo
                })
            })
            
        })


})

//get by id

app.get('/producto/:id', (req, res) => {
    
    let id = req.params.id;

    Producto.findById({_id: id})
        .sort('nombre')
        .populate('usuario' , 'nombre email')
        .populate('categoria' , 'nombre')
        .exec( (err, producto) => {
            
            if (err) return res.status(400).json({ ok:false, err });

            if (!producto || producto.estado === false) return res.status(404).json({ok:false,err:{message: "no hay producto con ese id"}});

            res.json({
                ok: true,
                producto,
            })
            
            
        })

})


// 

app.get('/producto/buscar/:busqueda', (req, res) => {
    
    let busqueda = req.params.busqueda;
    let regex = RegExp(busqueda , 'i');

    Producto.find({nombre: regex, estado: true})
        .sort('nombre')
        .populate('usuario' , 'nombre email')
        .populate('categoria' , 'nombre')
        .exec( (err, productos) => {
            
            if (err) return res.status(400).json({ ok:false, err });

            Producto.countDocuments({estado:true}, (err, conteo) => {
                if (err) return res.status(400).json({ok:false,err});

                if (!conteo) return res.status(404).json({ok:false,err:{message: "no hay productos"}});

                res.json({
                    ok: true,
                    productos,
                    conteo
                })
            })
            
            
        })

})

//  crear producto

app.post('/producto', middleware.verificarToken,  (req, res) => {

    let nombre = req.body.nombre;
    let precioUni = req.body.precioUni;
    let descripcion = req.body.descripcion;
    let categoria = req.body.categoria;
    let usuario = req.usuario._id;

    producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        categoria,
        usuario
    });

    producto.save( (err, productoDB) =>{
            
        if (err) return res.status(400).json({ok:false,err});
        
        res.json({
            ok: true,
            productoDB,

        })
    })

})

// modificar Producto

app.put('/producto/:id', middleware.verificarToken ,  (req, res) => {

    let id = req.params.id;

    let datos = req.body;


    Producto.findByIdAndUpdate({_id: id} , datos , { new:true , runValidators: true, context:'query'} , (err, resultado) => {

        if (err) return res.status(400).json({ok:false,err});

        if (!resultado) return res.status(404).json({ok:false,err:{message: "no hay producto con ese id"}});

        res.json({
            ok:true,
            resultado
        })

    })

    

})


// borrar Producto (baja logica)

app.delete('/producto/:id', [ middleware.verificarToken , middleware.verificarAdmin_Role ],(req, res) => {
    

    let id = req.params.id;

    Producto.findByIdAndUpdate(id , { estado: false, disponible: false } , { new:true , runValidators: true, context:'query'} , (err, resultado) => {

        if (err) return res.status(400).json({ok:false,err});

        if (!resultado) return res.status(404).json({ok:false,err:{message: "no hay producto con ese id"}});

        res.json({
            ok:true,
            resultado
        })

    })

})




module.exports = app;