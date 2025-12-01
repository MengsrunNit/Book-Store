const Product = require("../models/product");
const Cart = require("../models/cart");
const { getDb } = require("../util/database");

// Get all product Function
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
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
  Product.findById(productId).then((product) => {
    res.render("shop/cart", {
      product: product,
      pageTitle: product.title,
      path: "/cart",
    });
  });
};

// Get index Function
exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
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
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
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
    .deleteItemFromCart(prodId)
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
  console.log("my order");
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
