const
express        = require('express'),
router         = express.Router(),
mongoose        = require('mongoose'),

Product         = require('../models/products');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handle GET'
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
     .then(result => console.log("result1::::::", result))
     .catch(err => console.log("err::::::::::::", err))
    res.status(201).json({ 
        message: 'Handle POST',
        createdProduct: product
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({ 
            message: 'You discovered a special id',
            id
        })
    } else {
        res.status(200).json({ 
            message: 'You passed a wrong id'
        })
    }
})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    })
})

module.exports = router;