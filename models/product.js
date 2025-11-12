
const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectId;

class Product {
    constructor(title, price, imageUrl, description, id) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        // Only assign _id if provided; don't wrap undefined and don't create a new ObjectId for create path
        this._id = id ? new ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        if (this._id) {
            // Update only mutable fields
            const updateDoc = {
                title: this.title,
                price: this.price,
                imageUrl: this.imageUrl,
                description: this.description,
            };
            return db.collection('products').updateOne({ _id: this._id }, { $set: updateDoc });
        }
        // Insert new product (MongoDB will add _id automatically)
        const insertDoc = {
            title: this.title,
            price: this.price,
            imageUrl: this.imageUrl,
            description: this.description,
        };
        return db.collection('products').insertOne(insertDoc);
    }

    static fetchAll(){
        const db = getDb(); 
        return db.collection('products')
            .find()
            .toArray();
    }

    static findById(prodId){
        const db = getDb();
        return db.collection('products').find({ _id : new ObjectId(prodId) }).next();
    }

    static deleteById(prodId){
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new ObjectId(prodId) });
    }
}



module.exports = Product;