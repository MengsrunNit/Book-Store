const http = require('http')
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const path = require('path')

app.set('view engine', 'ejs');
app.set('views', 'templates');

const adminRoute = require('./routes/admin'); 
const shopRoute = require('./routes/shop');

const rootDir = require('./util/path'); 
app.use(bodyParser.urlencoded({ extended: false })); 
const errorController = require('./controllers/error')


app.use(express.static(path.join(rootDir, 'public'))); // CSS static access 


app.use('/admin',adminRoute);
app.use('/',shopRoute); 

app.use(errorController.error404)

const server = http.createServer(app)
server.listen(3000);