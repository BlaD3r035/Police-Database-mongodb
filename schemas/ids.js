const mongoose = require('mongoose');
// Create a schema for ids This is the document that contains all information about a person.
// In this case, I will use it to get names, age, userId, etc. 
const documentSchema = new mongoose.Schema({
    userId:{type: String, required:true},
    username:{type: String, required:true},
    name:{type: String, required:true},
    lastname:{type: String, required:true},
    sex:{type: String, required:true},
    age:{type: String, required:true},
    height:{type: String, required:true},
    placeofbirth:{type: String, required:true},
    birthdate:{type: String, required:true},
    userroblox:{type: String, required:true},
    blood:{type:String,required:true},
    avatarUrl:{type: String, required:true},
    documentId:{type:Number, required:true},
    documentindex:{type:Number, required:true},
});
const Ids = mongoose.model('id', documentSchema);

module.exports = Ids;