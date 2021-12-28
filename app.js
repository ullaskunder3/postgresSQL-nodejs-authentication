const express = require('express')
const app = express();

const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const { pool } = require('./db_config');

const initilizePassport = require('./passport_config');
initilizePassport(passport)

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/'))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.get('/', (req,res)=>{
    res.redirect('/main')
})
app.get('/main', (req,res)=>{
    res.render('main')
})
app.get('/users/register', isUserAuthenticated, (req,res)=>{
    res.render('register')
})
app.get('/users/login', isUserAuthenticated, (req,res)=>{
    res.render('login')
})
app.get('/users/profile', chackUserAuthenticated, (req,res)=>{
    res.render('profile', {user: req.user.name})
})
app.get('/users/logout', (req, res)=>{
    req.logOut();
    req.flash('Success_message', 'You have logged out successfully')
    res.redirect('/main');
})
app.post('/users/register', async (req, res)=>{
    let {name, email, password, password2} = req.body;
    console.log({
        name, password, email 
    });
    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({message: 'please enter all the fields'})
    }
    if(password.length < 5){
        errors.push({message: 'password should atlest 6 character long '})
    }
    if (password !== password2) {
        errors.push({ message: 'password do not match' })
    }
    if (errors.length > 0) {
        res.render('register', { errors })
    }
    else {
        hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);
        pool.query(
            `SELECT * FROM users
            WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log(results.rows);
                if(results.rows.length > 0){
                    errors.push({message: 'email is already register'})
                    res.render('register', {errors})
                }else{
                    pool.query(
                        `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`, [name, email, hashedPassword],
                        (err, results)=>{
                            if(err){
                                throw err
                            }
                            console.log(results.rows);
                            req.flash('success_message', 'You are now registered. Please Log in');
                            res.redirect('/users/login');
                        }
                    )
                }
            }
        )
    }
})
app.post('/users/login', passport.authenticate('local', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true
}))
function isUserAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    next();
}
function chackUserAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login')
}
app.listen(5050, () => {
    console.log('server is listening');
})