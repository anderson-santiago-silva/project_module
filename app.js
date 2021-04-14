require('dotenv').config();
const express = require("express");
const hbs = require('hbs');

const homeRoutes = require('./routes/home.routes');
const authRoutes = require('./routes/auth.routes');
const petsRoutes = require('./routes/pets.routes');

const sessionConfig = require('./config/session.config');

const app = express();

sessionConfig(app);

require('./config/mongodb.config');

app.use(express.static('public'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/', authRoutes);

app.use((req, res, next) => {
    if (req.session.currentUser) {
        return next();
    }
    res.redirect('/login');
})

app.use('/pets', petsRoutes);

app.use((req, res, next) => {
    res.status(404);
    res.render('not-found', {layout: false });
});

app.use((err, req, res, next) => {
    console.log('ERROR', req.method, req.path, err);

    if (!res.henderSent) {
        res.status(500);
        res.render('error', { layout: false });
    }
});


app.listen(3000, () => console.log('App listening to port 3000'));