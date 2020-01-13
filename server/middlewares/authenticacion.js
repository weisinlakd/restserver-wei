const jwt = require('jsonwebtoken');

// =======================
// Verificar Token
//========================

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token , process.env.SEED , (err, decoded) => {
        if (err) return res.status(401).json({ok:false,err: {message: "token invalido"}});
        console.log(decoded);
        req.usuario = decoded.usuario;
        next();
    } );


    

    
}

// =======================
// Verificar Admin_Role
//========================

let verificarAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario);
    // console.log(usuario.role);
    // console.log(usuario.google)

    if (usuario.role === 'ADMIN_ROLE') {
        console.log('es admin');
        
        next();
    } else return res.status(401).json({ok:false,err: {message: "no es administrador"}});

    
    

    
}

module.exports = {verificarToken, verificarAdmin_Role};