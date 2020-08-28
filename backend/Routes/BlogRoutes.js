const express = require('express');
const { Router } = require('express');
const routes = express.Router();
const { create , list , listByUser , listSearch , listAllCategoriesTags , listRelated , read , remove , update , photo } = require('../controller/BlogController')
const {requireSignin , adminMiddleware , canUpdateAndDelete , authMiddleware } = require('../controller/authController')

routes.post('/blog' , requireSignin , adminMiddleware ,create)
routes.get('/blogs' , list)
routes.post('/blogs-categories-tags' , listAllCategoriesTags)
routes.get('/blog/:slug' , read)
routes.delete('/blog/:slug' , requireSignin , adminMiddleware , remove)
routes.put('/blog/:slug' , requireSignin , adminMiddleware , update)

routes.post('/blogs/related' , listRelated)

routes.get('/blog/photo/:slug' , photo)

routes.get('/blogs/search' , listSearch)

// user blog create crud operation routes
routes.post('/user/blog' , requireSignin , authMiddleware ,create)
routes.get('/:username/blogs' , listByUser)
routes.delete('/user/blog/:slug' , requireSignin , authMiddleware , canUpdateAndDelete , remove)
routes.put('/user/blog/:slug' , requireSignin , authMiddleware , canUpdateAndDelete , update)

module.exports = routes;