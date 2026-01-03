const mongose = require('mongoose');
const Schema = mongose.Schema;

const productSchema = new Schema({
    title: {
        type: String, 
        required: true}, 
    price: {
        type: Number,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }, 
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})




module.exports = mongose.model('Product' , productSchema);


// class Product {
//     constructor(title, price, imageUrl, description, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this._id = id ? new ObjectId(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         if (this._id) {
//             // Update only mutable fields
//             const updateDoc = {
//                 title: this.title,
//                 price: this.price,
//                 imageUrl: this.imageUrl,
//                 description: this.description,
//                 userId: this.userId
//             };
//             return db.collection('products').updateOne({ _id: this._id }, { $set: updateDoc });
//         }
//         // Insert new product (MongoDB will add _id automatically)
//         const insertDoc = {
//             title: this.title,
//             price: this.price,
//             imageUrl: this.imageUrl,
//             description: this.description,
//             userId: this.userId
//         };
//         return db.collection('products').insertOne(insertDoc);
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products')
//             .find()
//             .toArray();
//     }

//     static findById(prodId) {
//         const db = getDb();
//         return db.collection('products').find({ _id: new ObjectId(prodId) }).next();
//     }

//     static deleteById(prodId) {
//         const db = getDb();
//         return db.collection('products').deleteOne({ _id: new ObjectId(prodId) });
//     }
// }
