const express = require('express');
const routes = express.Router();
const { signup, googleLogin, preSignup , signin, signout, requireSignin , forgotPassword , resetPassword } = require('../controller/authController')

//validators
const { runValidation } = require('../validators')
const { userSignupValidator, userSigninValidator , forgotPasswordValidator , resetPasswordValidator } = require('../validators/authValidator')

routes.post('/pre-signup', userSignupValidator , runValidation , preSignup)
routes.post('/signup' , signup)
routes.post('/signin' , userSigninValidator, runValidation, signin)
routes.get('/signout' , signout)
routes.put('/forgot-password' , forgotPasswordValidator , runValidation , forgotPassword)
routes.put('/reset-password' , resetPasswordValidator , runValidation , resetPassword)

//google login

routes.post('/google-login' , googleLogin)

module.exports = routes;