require("dotenv").config();

const http = require("http");
const path = require("path");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
// Import session store
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const rootDir = require("./util/path");
const User = require("./models/users");

// Routes
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// -------------------------
// View engine
// -------------------------
app.set("view engine", "ejs");
app.set("views", "templates");

// -------------------------
// Session store
// -------------------------
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (err) => {
  console.error("Session store error:", err);
});

// -------------------------
// Global middleware
// -------------------------
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

// Sessions must come before anything that reads/writes req.session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// Template locals (after session)
app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.isLoggedIn;
  res.locals.path = req.path;
  next();
});

// Attach user to request (after session)
app.use((req, res, next) => {
  if (!req.session.user?._id) return next();

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next(); // user deleted?
      req.user = user;
      next();
    })
    .catch((err) => next(err)); // let express handle it
});

// -------------------------
// Routes
// -------------------------
app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoutes);

// -------------------------
// Errors
// -------------------------
app.use(errorController.error404);

// Optional centralized error handler (recommended)
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).render("500", { pageTitle: "Error" });
// });

// -------------------------
// DB + server start
// -------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
