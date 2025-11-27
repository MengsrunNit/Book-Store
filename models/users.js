const { get } = require("../routes/shop");

const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectId;


class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart ? cart : { items: [] };
    this._id = id;

  }

// addToCart(product) {
//   const cartProductIndex = this.cart.items.findIndex(cp => {
//     return cp.productId.toString() === product._id.toString();
//   });
//   let newQuantity = 1;
//   const updatedCartItems = [...this.cart.items];

//   if (cartProductIndex >= 0) {
//     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//     updatedCartItems[cartProductIndex].quantity = newQuantity;
//   } else {
//     updatedCartItems.push({
//       productId: new ObjectId(product._id),
//       quantity: newQuantity
//     });
//   }
//   const updatedCart = { items: updatedCartItems };
//   const db = getDb();
//   return db
//     .collection('users')
//     .updateOne(
//       { _id: new ObjectId(this._id) },
//       { $set: { cart: updatedCart } }
//     );
// }

// getCart() {
//   const db = getDb();
//   const productIds = this.cart.items.map(i => {
//     return i.productId;
//   });
//   return db
//     .collection('products')
//     .find({ _id: { $in: productIds } })
//     .toArray()
//     .then(products => {
//       return products.map(p => {
//         return {
//           ...p,
//           quantity: this.cart.items.find(i => {
//             return i.productId.toString() === p._id.toString();
//           }).quantity
//         };
//       });
//     });
// }

deleteItemFromCart(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  const db = getDb();
  return db
    .collection('users')
    .updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: { items: updatedCartItems } } }
    );
}

  save() {
  const db = getDb();
  // insert the user in 
  return db.collection("users").insertOne(this)

}

  addToCart(product) {
    // Ensure cart items exist
    if (!this.cart.items) {
      this.cart.items = [];
    }

    const cartProductIndex = this.cart.items.findIndex(cp => {
      // Check if cp and cp.productId exist before accessing toString
      return cp && cp.productId && cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

    getCart(){
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    }); 
    return db.collection('products')
    .find({_id: {$in :productIds}})
    .toArray()
    .then(products => {
      return products.map(p =>{
        return {...p, quantity: this.cart.items.find(i => {
          return i.productId.toString() === p._id.toString();
        }).quantity};
      })
  });
  }


  static findById(userId) {
  const db = getDb();
  return db.collection("users").findOne({ _id: new ObjectId(userId) });
}
}

module.exports = User;