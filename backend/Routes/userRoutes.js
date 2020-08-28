const express = require('express');
const routes = express.Router();
const { authMiddleware , adminMiddleware, requireSignin } = require('../controller/authController')
const { read , publicProfile, update , photo} = require('../controller/userController')

routes.get('/profile' , requireSignin , authMiddleware , read)
routes.get('/user/:username' , publicProfile)
routes.put('/user/update' , requireSignin , authMiddleware , update)
routes.get('/user/photo/:username' , photo)

module.exports = routes;