const express = require('express');
const routes = express.Router();
const { create , read , list , remove } = require('../controller/categoryController')
const {  adminMiddleware, requireSignin } = require('../controller/authController')

//validators
const { runValidation } = require('../validators')
const { categoryCreateValidator } = require('../validators/categoryValidator');

routes.post('/category' , categoryCreateValidator , runValidation ,requireSignin , adminMiddleware , create)
routes.get('/categories' , list)
routes.get('/category/:slug' , read)
routes.delete('/category/:slug' , requireSignin , adminMiddleware ,remove)

module.exports = routes;