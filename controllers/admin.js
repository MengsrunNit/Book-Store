const Product = require("../models/product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = (req.body.title || "").trim();
  const imageUrl = (req.body.imageUrl || "").trim();
  const priceRaw = req.body.price;
  const description = (req.body.description || "").trim();
  const price = parseFloat(priceRaw);
  const product = new Product({title: title, price: price, imageUrl: imageUrl, description: description, userId: req.user});

  product.save()
    .then(() => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch(next);
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.editMode === "true";
  console.log("Edit Mode:", editMode);
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: true,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "admin Product",
      path: "/admin/products",
    });
  });
};

//exports postDeleteProduct that get the productId from the req.body and then delete that data in the database
exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  console.log("you are in PostDeleteProduct");
  Product.findByIdAndDelete(productId)
  .then(() => {
      console.log("Product Deleted");
      res.redirect("/admin/products");
    })
  .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.postEditProduct = async (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = (req.body.title || "").trim();
  const updatedImageUrl = (req.body.imageUrl || "").trim();
  const updatedPriceRaw = req.body.price;
  const updatedDesc = (req.body.description || "").trim();
  const updatedPrice = parseFloat(updatedPriceRaw);

  Product.findById(productId)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    return product.save();
  })
  .then(result => {
    console.log("Product Updated", result);
    res.redirect("/admin/products");
  })
  .catch(err => {
    console.error("Edit Product Error:", err);
    next(err);
  });
};
