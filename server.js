const express = require('express');
require('dotenv').config();
const cors = require('cors');


const appRoute = require('./routes/route.js');

const app =express();


app.use(express.json());
app.use(cors());

app.use('/api', appRoute);

app.listen(5000, ()=>{
    console.log('Server is Started...!')
})