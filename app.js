const express = require('express')
const app = express();

app.set('view engine', 'ejs')

app.use(express.static(__dirname+'/'))

app.get('/', (req,res)=>{
    res.redirect('/landingpage')
})
app.get('/users/landingpage', (req,res)=>{
    res.render('landingpage')
})
app.get('/users/register', (req,res)=>{
    res.render('register')
})
app.get('/users/login', (req,res)=>{
    res.render('login')
})

app.listen(5050, ()=>{
    console.log('server is listening');
})