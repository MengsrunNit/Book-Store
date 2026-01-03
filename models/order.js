const mongose = require('mongoose');
const Schema = mongose.Schema; 

const orderSchema = new Schema({
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }, 
        name: {
            type: String, 
            required: true  
        }
    }, 
    products: [
        {
            products: {
                type: Object, 
                required: true
            }, 
            quantity: {
                type: Number,
                required: true
            }
        }
    ], 
    orderDate: {
        type: Date, 
        required: true
    }
})

module.exports = mongose.model('Order', orderSchema);