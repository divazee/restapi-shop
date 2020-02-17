const 
mongoose      = require('mongoose')

productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
});

module.exports = mongoose.model('Product', productSchema)   