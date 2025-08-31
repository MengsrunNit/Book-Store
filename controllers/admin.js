const Product = require('../models/product'); 

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    });
  };
  
  exports.postAddProduct = async (req, res, next) => {
    try{

    const title = req.body.title; 
    const imageUrl = req.body.imageUrl; 
    const price = req.body.price; 
    const description = req.body.description; 

    const product = Product.build({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    });

    await product.save();
    console.log('Product added:', product); 
    res.redirect('/');
    }
    catch(err){
      console.log(err);
      next(err);
    }
    
  };

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.editMode; 
    console.log("Edit Mode:", editMode); 
    if (!editMode){
      return res.redirect('/');
    }
    const productId = req.params.productId; 
    Product.findByPk(productId).then(product =>{
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
    const products = Product.findAll().then(products=>{
        res.render('admin/products', {
          prods: products,
          pageTitle: 'admin Product',
          path: '/admin/products',
        });
      })
  }

  exports.postDeleteProduct = (req, res, next) =>{
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('/admin/products')
  }

  exports.postEditProduct = (req, res, next)=>{
    const productId = req.body.productId;
    const updatedTitle = req.body.title; 
    const updatedImageUrl = req.body.imageUrl; 
    const updatedPrice = req.body.price; 
    const updatedDesc = req.body.description; 

    Product.findByPk(productId).then(product =>{  
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save();
    })
    .then(result =>{
      console.log('Updated Product!');
      res.redirect('/admin/products');
    })
    .catch(err=>{console.log(err);
    });
  } 
  