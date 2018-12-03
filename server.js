const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
require('dotenv').config();

// Middleware
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.use(require('./middleware/checkAuth'));
app.use(express.static('public'));

// Controllers
app.use(require('./controllers/users'));
require('./controllers/posts')(app);
require('./controllers/comments')(app);

app.listen(5000, function () {
    require('./data/database');
    console.log('Running Reddit2 on 5000')
});