const Product = require('../models/product'); 
const Cart = require('../models/cart'); 



exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll(products=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/',
    });
  }); 
};

exports.getProduct = (req, res, next)=>{
  const productId = req.params.productId;
  Product.findById(productId, product =>{
    res.render('shop/product-detail', {
      prod: product, 
      pageTitle: product.title,
      path: '/product/',
    })
  });

}

exports.getIndex = (req, res, next)=>{
  const products = Product.fetchAll(products=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/product',
    });
  }); 
};

exports.getCart = (req, res, next)=>{
  let cart = [];
  Cart.getProduct(prod =>{
    console.log(typeof prod.products)
    console.log(prod)
    Product.fetchAll(products =>{
      for (product of products){
        const cartProduct = prod.products.find(prod => prod.id === product.id);
        if(cartProduct){
          console.log(product);
          console.log(cartProduct.qty);
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
    
  })
  
}

exports.postCart = (req, res, next)=>{
  const productId = req.body.productId; 
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price, ()=>{
      res.redirect('/cart');
    });
  });
 
  
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
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





