//here we going to set the url routes and the session storage
const express = require('express')
const session = require('express-session')
const router= express.Router()
const Cedulas = require('../schemas/cedulas')

//set the session (this case we don't gonna use storage, you may need to set that if you wanna save the sessions )
router.use(session({
    key: 'login_session',
    secret: process.env.SESSION_PASSWORD, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

//functions
function isAuthenticated(req, res, next) {
    if (req.session && req.session.loggedin) {
        return next(); 
    } else {
        
        return res.redirect('/v1/login'); 
    }
}
//routes mngr
router.get('/login', (req, res) => {
    if (req.session.loggedin) {
        return res.redirect('/v1/dashboard');
    }
    res.render('login');
});

router.get('/dashboard',isAuthenticated,(req,res)=>{
    res.render('dashboard',{userdata: req.session.userdata})
})


//check login
router.post('/login', async (req, res) => {
    const { docId, password } = req.body;
    
   const user = await Cedulas.findOne({documentId: docId})
   if(user){
    // in this case, we use 3001 for all passwords,if you wanna use passwords per user, you may need to use a dedicaded schema for users and use e.g argon2 for hash the password
      if(password !=='3001'){
        return res.render('login', {msg:'incorrect password'})
      }
      req.session.loggedin = true;
      req.session.userdata = user;

      return res.redirect('/v1/dashboard')
   }else{
    return res.render('login', {msg:'incorrect user'})
   }

 
});
router.get('/logout', async (req,res)=>{
    req.session.destroy()
    return res.redirect('/v1/login')


})

  module.exports = router