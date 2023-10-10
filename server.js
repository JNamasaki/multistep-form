const express = require('express');
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 5000
const appRoute = require('./routes/route.js');

const app =express();



app.use(express.json());
app.use(cors());

app.use('/api', appRoute);

app.listen(PORT, ()=>{
    console.log('Server is Started...!')
})