require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", "templates");

const rootDir = require("./util/path");
app.use(bodyParser.urlencoded({ extended: false }));
const errorController = require("./controllers/error");
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require('mongoose');
const User = require('./models/users');

// add admin route and shop route
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoutes = require('./routes/auth');

app.use(express.static(path.join(rootDir, "public"))); // CSS static access

app.use((req, res, next) => {
  User.findById('69573eb519408dc1c742c79f')
  .then(user =>{
    req.user = user; 
    next();
  })
  .catch(err => console.log(err));
});

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoutes);

app.use(errorController.error404);

const server = http.createServer(app);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    return User.findOne();
  })
  .then(user => {
    if (!user) {
      const newUser = new User({
        name: 'Mengsrun',
        email: 'nitmengsrun@gmail.com',
        cart: {
          items: []
        }
      });
      return newUser.save();
    }
  })
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
