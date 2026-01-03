const Product = require("../models/product");
const { getDb } = require("../util/database");
const Order = require("../models/order");

// Get all product Function
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Getproduct Function
exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
  .then((product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

// Get index Function
exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/product",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Get cartItem
exports.getCart = async (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user =>{
    console.log(user.cart.items)
    const products = user.cart.items;

    let totalPrice = 0;
    products.forEach(p => {
      totalPrice += Number(p.productId.price) * Number(p.quantity);
    });

    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
      totalPrice: totalPrice
    })
  })
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  if (!productId) {
    console.log("No productId provided");
    return res.redirect("/");
  }
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        console.log("Product not found");
        return res.redirect("/");
      }
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("Added to Cart");
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// Delete Cart Product
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeCartItem(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout"),
    {
      path: "checkout",
      pageTitle: "Checkout",
    };
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then(user=>{
      const products = user.cart.items.map(i => ({
              products: { ...i.productId._doc },
              quantity: i.quantity
            }));
       const order = new Order({
            // user 
            user: {
              name: user.name, 
              userId: user._id
            }, 
            products: products, 
            orderDate: new Date()
        });
        return order.save();
    
  })  .then(result =>{
        return req.user.clearCart();
  })
    .then(() =>{
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      // console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
