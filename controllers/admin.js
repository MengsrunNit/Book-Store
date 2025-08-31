const Product = require('../models/product'); 

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    });
  };
  
  exports.postAddProduct = (req, res, next) => {
    const title = req.body.title; 
    const imageUrl = req.body.imageUrl; 
    const price = req.body.price; 
    const description = req.body.description; 
    const product = new Product(title, imageUrl, price, description);

    product.save();
    console.log('Product added:', product); 
    res.redirect('/');
  };

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.editMode; 
    console.log("Edit Mode:", editMode); 
    if (!editMode){
      return res.redirect('/');
    }
    const productId = req.params.productId; 
    Product.findById(productId, product =>{
      if(!product){
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/edit-product',
        editing: true, 
        product: product, 
      });
    })
  };

  exports.getProducts = (req, res, next) =>{
    const products = Product.fetchAll(products=>{
        res.render('admin/products', {
          prods: products,
          pageTitle: 'admin Product',
          path: '/admin/products',
        });
      }); 
  }

  exports.postDeleteProduct = (req, res, next) =>{
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('/admin/products')
  }