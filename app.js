const express = require('express')
const app = express();

app.get('/', (req,res)=>{
    res.send('testing end point...')
})

app.listen(5050, ()=>{
    console.log('server is listening');
})