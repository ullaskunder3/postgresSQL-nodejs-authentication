const express = require('express')
const app = express();

app.set('view engine', 'ejs')

app.get('/', (req,res)=>{
    res.redirect('/landingpage')
})
app.get('/landingpage', (req,res)=>{
    res.render('landingpage')
})
app.get('/login', (req,res)=>{
    res.render('login')
})
app.get('/register', (req,res)=>{
    res.render('register')
})

app.listen(5050, ()=>{
    console.log('server is listening');
})