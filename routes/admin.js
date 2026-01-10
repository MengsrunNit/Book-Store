const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();


const adminController = require('../controllers/admin')

function isAuth(req, res, next) {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
}

router.use(isAuth);


// // admin/add-product 
router.get('/add-product', adminController.getAddProduct);

// //admin /admin/products
router.get('/products', adminController.getProducts)

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);


router.post('/delete-product', adminController.postDeleteProduct);
router.post('/edit-product', adminController.postEditProduct);

module.exports = router;



