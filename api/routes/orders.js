const
express        = require('express'),
router         = express.Router(),
mongooose      = require('mongoose'),

Order           = require('../models/orders'),
Product         = require('../models/products');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        }))
        .catch(error => res.status(500).json({ error }))
})

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) { 
                return res.status(404).json({ message: 'Product not found' });
            }
            const order =  new Order ({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => res.status(201).json({
            message: 'Order created',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        }))
        .catch(error => res.status(500).json({ error }))
})

router.get('/:orderId', (req, res, next) => {
    const _id = req.params.orderId
    Order.findById( _id )
    .populate('product')
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({ error: 'Order not found' }) 
        } else {
            res.status(200).json({
                order,
                request: {
                    type: 'GET',
                    description: 'GET_ALL_ORDERS',
                    url: 'http://localhost:3000/orders/'
                }
            }) 
        }
    })
    .catch(error => res.status(500).json({ error }))
})

router.delete('/:orderId', (req, res, next) => {
    Order.deleteMany({_id: req.params.orderId})
    .exec()
    .then(result => res.status(200).json({
        message: 'Order Deleted',
        request: {
            type: 'POST',
            url: 'http://localhost:3000/orders',
            body: { productId: 'ID', quantity: 'Number'}
        }
    }))
    .catch(error => res.status(500).json({ error }))
})

module.exports = router;