const
express        = require('express'),
router         = express.Router(),
mongoose        = require('mongoose'),

Product         = require('../models/products');

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        // console.log("docs", docs)
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json( response )
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
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
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
            res.status(200).json({ 
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/products/'
                }
             })
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
        updateOps[ops.propName] = ops.propValue;
    }
    Product.updateOne({_id: id}, { $set: updateOps })
    // Product.update({_id: id}, { $set: {name: req.body.newName, price: req.body.newPrice}})
    .exec()
    .then(result => res.status(200).json({ 
        message: 'Product updated',
        request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + id
        }
    }))
    .catch(error => console.log("ERROR:::;;"))
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })  
    .exec()
    .then(result => res.status(200).json({
        message: 'Product deleted',
        request: {
            type: 'POST',
            url: 'http://localhost:3000/products/',
            body: { name: 'String', price: 'Number'}
        }
    }))
    .catch(err => {
        console.log("err::::::::::::", err)
        res.status(500).json({ error: err })
    })
})

module.exports = router;