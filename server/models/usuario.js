const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolValido = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};


let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: [true, 'Ya existe cuenta con ese email'],
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolValido
    },
    estado: {
        type: Boolean,
        default:true
    },
    google: {
        type: Boolean,
        default:false
    }


})

usuarioSchema.methods.toJSON = function () { //para que no salga password en la respuesta

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message:'{PATH} debe ser unico'});



module.exports = mongoose.model('Usuario', usuarioSchema)