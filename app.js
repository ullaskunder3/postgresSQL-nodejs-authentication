const express = require('express')
const bycryt = require('bcrypt');
const app = express();
const {pool} = require('./db_config');

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.use(express.static(__dirname+'/'))

app.get('/', (req,res)=>{
    res.redirect('/main')
})
app.get('/main', (req,res)=>{
    res.render('main')
})
app.get('/users/register', (req,res)=>{
    res.render('register')
})
app.get('/users/login', (req,res)=>{
    res.render('login')
})
app.get('/users/profile', (req,res)=>{
    res.render('profile', {user: 'ullas'})
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
    if(password !== password2){
        errors.push({message: 'password do not match'})
    }
    if(errors.length > 0){
        res.render('register', {errors})
    }else{
        let hashedPass = await bycryt.hash(password, 10);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1,`[email], (err, results)=>{
                if(err){
                    throw err
                }
            }
        )
    }
})

app.listen(5050, ()=>{
    console.log('server is listening');
})