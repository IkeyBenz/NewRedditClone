const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

// Middleware
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./handlebarsHelpers')
}));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-parser')());
app.use(methodOverride('_method'));
app.use(require('./middleware/checkAuth'));
app.use(express.static('public'));

// Controllers
require('./controllers/users')(app);
require('./controllers/posts')(app);
require('./controllers/comments')(app);

app.listen(PORT, function () {
    require('./data/database');
    console.log(`Running Reddit2 on ${PORT}`);
});