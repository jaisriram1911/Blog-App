const express = require('express');
const routes = express.Router();
const { create , read , list , remove } = require('../controller/tagController')
const {  adminMiddleware, requireSignin } = require('../controller/authController')

//validators
const { runValidation } = require('../validators')
const { tagCreateValidator } = require('../validators/tagValidator');

routes.post('/tag' , tagCreateValidator , runValidation ,requireSignin , adminMiddleware , create)
routes.get('/tags' , list)
routes.get('/tag/:slug' , read)
routes.delete('/tag/:slug' , requireSignin , adminMiddleware ,remove)

module.exports = routes;