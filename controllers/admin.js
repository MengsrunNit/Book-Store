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

  if (!title || !imageUrl || !description || isNaN(price)) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: { title, imageUrl, price: priceRaw, description },
      errorMessage: "All fields are required and price must be a number.",
    });
  }

  try {
    const product = new Product(title, price, imageUrl, description);
    const result = await product.save();
    console.log("Product Created", result?.insertedId || result?.acknowledged);
    res.redirect("/admin/products");
  } catch (err) {
    console.error("Add Product Error:", err);
    next(err);
  }
};

  // req.user
  //   .createProduct({
  //     title: title,
  //     price: price,
  //     imageUrl: imageUrl,
  //     description: description,
  //   })
  //   .then((product) => {
  //     console.log("Product added:", product.title);
  //     res.redirect("/admin/products");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     next(err);
  //   });

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.editMode === "true";
  console.log("Edit Mode:", editMode);
  console.log("hello");
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
    })
  }).catch((err) => {
    console.log(err);
  });
};


exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
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
  Product.deleteById(productId)
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

  if (!productId || !updatedTitle || !updatedImageUrl || !updatedDesc || isNaN(updatedPrice)) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      product: { _id: productId, title: updatedTitle, imageUrl: updatedImageUrl, price: updatedPriceRaw, description: updatedDesc },
      errorMessage: "All fields are required and price must be a number.",
    });
  }

  try {
    const product = new Product(
      updatedTitle,
      updatedPrice,
      updatedImageUrl,
      updatedDesc,
      productId
    );
    const result = await product.save();
    console.log("Product Updated", result?.modifiedCount || result?.acknowledged);
    res.redirect("/admin/products");
  } catch (err) {
    console.error("Edit Product Error:", err);
    next(err);
  }
};
