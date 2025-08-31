const Product = require('../models/product'); 
const Cart = require('../models/cart'); 


exports.getProducts = async (req, res, next) =>{
  try{
    const products = await Product.findAll(); 
    res.render('shop/product-list',{
    prods: products,
    pageTitle: 'All Products',
    path: '/'
    })
  } 
catch(err){
    console.log(err);
    next(err);
  }
}

exports.getProduct = (req, res, next)=>{
  const productId = req.params.productId;
  Product.findByPk(productId).then(product =>{
    res.render('shop/product-detail', {
      prod: product, 
      pageTitle: product.title,
      path: '/product/',
    })
  });
}

exports.getIndex = async (req, res, next) =>{
  try{
    const products = await Product.findAll();
    res.render('shop/index',{
    prods: products,
    pageTitle: 'Shop',
    path: '/product'});
    }catch(err){
      console.log(err);
      next(err);
    } 
  }


exports.getCart = (req, res, next)=>{
  let cart = [];
  Cart.getProduct(prod =>{
    console.log(typeof prod.products)
    console.log(prod)
    Product.findAll().then(products =>{
      for (product of products){
        const cartProduct = prod.products.find(prod => prod.id === product.id);
        if (cartProduct){
          cart.push({productData: product, qty:cartProduct.qty});
          console.log(cart)
        }
      }
      res.render('shop/cart', {
        path: '/cart', 
        pageTitle : 'Your Cart', 
        products: cart
      })
    })
    .then(err=>{
      console.log(err);
  })
  });
}

exports.postCart = (req, res, next)=>{
  const productId = req.body.productId; 
  Product.findByPk(productId).then(product => {
    Cart.addProduct(productId, product.price, ()=>{
      res.redirect('/cart');
    });
  });
  
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};
exports.getCheckout = (req, res, next)=>{
  res.render('shop/checkout'), {
    path : 'checkout', 
    pageTitle : 'Checkout',
  }
}





