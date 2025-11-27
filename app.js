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
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/users");

// add admin route and shop route 
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");


app.use(express.static(path.join(rootDir, "public"))); // CSS static access

//middleware 
app.use((req,res, next) =>{
  User.findById("6916c4bc8a3898af1f1b0939")
  .then(user =>{
    if(!user){
      console.log("User not found");
      return next();
    }
    req.user = new User(user.name, user.email, user.cart, user._id);
    console.log("hello")
    next();
  })
  .catch(err => console.log(err));
});


app.use("/admin", adminRoute);
app.use(shopRoute);




app.use(errorController.error404);

const server = http.createServer(app);

// mongoConnect(() => {  
//   console.log("Connected to MongoDB");
//   app.listen(3000);
// });


mongoConnect(() => {  
 
  console.log("Connected to MongoDB");

  const port = process.env.PORT || 3000; // <-- Important for Railway

  // Option 1: use app.listen
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
  });
});

