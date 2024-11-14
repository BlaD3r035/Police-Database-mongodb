const mongoose = require('mongoose');
// Create a schema for "cedulas." This is the document that contains all information about a person.
// In this case, I will use it to get names, age, userId, etc. btw, this database was created in Spanish, so you may need to adjust the schema according to your requirements and information.
const cedulaSchema = new mongoose.Schema({
    userId:{type: String, required:true},
    username:{type: String, required:true},
    nombreic:{type: String, required:true},
    apellido1ic:{type: String, required:true},
    apellido2ic:{type: String, required:true},
    sexoic:{type: String, required:true},
    lugaredenacimiento:{type: String, required:true},
    fechadenacimiento:{type: String, required:true},
    userroblox:{type: String, required:true},
    tipodesangre:{type:String,required:true},
    avatarUrl:{type: String, required:true},
    documentId:{type:Number, required:true},
    documentindex:{type:Number, required:true},
});
const Cedulas = mongoose.model('cedulas', cedulaSchema);

module.exports = Cedulas;