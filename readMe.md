# Book-Store Application

A full-stack Node.js web application designed for managing an online book inventory and shopping experience. This project demonstrates a classic **Model-View-Controller (MVC)** architecture using **Express.js** for the backend and **MongoDB** for data persistence.

## 🛠 Technology Stack

### Core
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Templating Engine:** EJS (Embedded JavaScript)
- **CSS:** Custom CSS with a responsive grid layout

### Database & Storage
- **Database:** MongoDB (NoSQL)
- **Driver:** Native MongoDB Driver for Node.js
- **Data Modeling:** Custom Class-based Models (No Mongoose)

### DevOps
- **Containerization:** Docker (Node 18 Alpine image)
- **Environment Management:** dotenv

## 🏗 Architecture

The project follows a strict **MVC (Model-View-Controller)** design pattern to ensure separation of concerns:

### 1. Models (`/models`)
Handles direct interaction with the MongoDB database.
- **Product Model:** Manages product data (Title, Price, Image, Description). Supports CRUD operations directly via MongoDB collections.
- **User Model:** Manages user data and contains the **Shopping Cart logic**.
  - *Technical Note:* The Cart is implemented as an **embedded document** within the User document in MongoDB, rather than a separate relational table. This optimizes read performance for user sessions.

### 2. Views (`/templates`)
Server-side rendered HTML using **EJS**.
- **Includes:** Reusable components like Navigation (`navigation.ejs`) and Head (`head.ejs`).
- **Shop:** Views for product lists, details, and the shopping cart.
- **Admin:** Forms for adding and editing products.

### 3. Controllers (`/controllers`)
Contains the business logic connecting Routes to Models and Views.
- **Admin Controller:** Handles product creation, updates, and deletion.
- **Shop Controller:** Handles fetching products, managing cart additions, and rendering the storefront.

### 4. Routes (`/routes`)
Defines the HTTP endpoints.
- `/admin/*`: Protected routes for product management.
- `/`: Public routes for browsing and shopping.

## 📂 Project Structure

```text
├── controllers/    # Business logic (Admin, Shop, Error)
├── data/           # JSON data (Legacy/Backup)
├── models/         # Database interaction classes (User, Product)
├── public/         # Static assets (CSS, Images)
├── routes/         # Express route definitions
├── templates/      # EJS View templates
├── util/           # Utilities (Database connection, Path helpers)
├── app.js          # Application entry point & Middleware config
└── Dockerfile      # Docker configuration