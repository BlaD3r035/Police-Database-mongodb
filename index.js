
const express = require('express')
const app= express()

require("dotenv").config(); 
const mongoose = require('mongoose')
const ejs = require('ejs')
const path = require('path')
//db conect
const connectDB = require('./db/db');
connectDB()

//public and views
app.use(express.static('public'))
app.set('view engine','ejs')
app.set('views', path.join(__dirname,'./views'))

//middlewarte
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes (in this case I going to set all routes with /v1 before route,  if you want to use all routes in the main domain just use  / or someting else)
const routes = require('./routes/router')
app.use('/v1',routes)
const getId = require('./routes/getId')
app.use('/v1',getId)
const get_database_user_data = require('./routes/get_database_user_data')
app.use('/v1',get_database_user_data)
const add_ticket = require('./routes/add_ticket')
app.use('/v1',add_ticket)
const add_record = require('./routes/add_record')
app.use('/v1',add_record)

//listen
app.listen(process.env.PORT,()=>{
    console.log('server started')
})