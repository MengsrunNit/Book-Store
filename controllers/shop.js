const Product = require("../models/product");
const Cart = require("../models/cart");

// Get all product Function
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
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
  Product.findByPk(productId).then((product) => {
    res.render("shop/product-detail", {
      prod: product,
      pageTitle: product.title,
      path: "/product/",
    });
  });
};

// Get index Function
exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
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
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: [],
      });
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// Delete Cart Product
exports.postCartDeleteProduct = (req, res, next) => {
  const prodID = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodID } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
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
