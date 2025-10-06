require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", "templates");

const sequelize = require("./util/database");
const User = require("./models/users");
const Product = require("./models/product");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

const rootDir = require("./util/path");
app.use(bodyParser.urlencoded({ extended: false }));
const errorController = require("./controllers/error");

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

app.use(express.static(path.join(rootDir, "public"))); // CSS static access

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoute);
app.use("/", shopRoute);

app.use(errorController.error404);

const server = http.createServer(app);

sequelize
  .sync() // {force: true} to drop the table and re-create it
  .then((result) => {
    // fixed : return the user from findByPk
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "Max@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    server.listen(3000);
    console.log("Server running at http://localhost:3000");
  })
  .catch((err) => {
    console.log(err);
  });
