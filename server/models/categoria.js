const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');




let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    nombre: {
        type: String,
        required: true,
        unique: [true, 'Ya existe categoria con ese nombre'],
    },

    estado: {
        type: Boolean,
        default:true
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
    }

})


categoriaSchema.plugin(uniqueValidator, {message:'{PATH} debe ser unico'});



module.exports = mongoose.model('Categoria', categoriaSchema);