const
express        = require('express'),
router         = express.Router(),
mongoose        = require('mongoose'),

Product         = require('../models/products');

router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log("docs", docs)
        res.status(200).json({ docs })
    })
    .catch(error => {
        console.log("error:::::", error)
        res.status(200).json({ error })
    })
})

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
     .save()
     .then(result => {
        console.log("result1::::::", result);
        res.status(201).json({ 
            message: 'Handle POST',
            createdProduct: result
        })
     })
     .catch(err => {
        console.log("err:::::::::::", err)
        res.status(500).json({ error: err })
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("result2::::::", doc);
        if (doc) {
            res.status(200).json({ doc })
        } else {
            res.status(404).json({ message: "Invalid entry provided for ID" })
        }
    })
    .catch(err => {
        console.log("err::::::::::::", err)
        res.status(500).json({ error: err })
    })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // Product.findByIdAndUpdate(id, req.body, {new: true})
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps })
    // Product.update({_id: id}, { $set: {name: req.body.newName, price: req.body.newPrice}})
    .exec()
    .then(result => res.status(200).json( result ))
    .catch(error => console.log("ERROR:::;;"))
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
    .exec()
    .then(result => res.status(200).json( result ))
    .catch(err => {
        console.log("err::::::::::::", err)
        res.status(500).json({ error: err })
    })
})

module.exports = router;