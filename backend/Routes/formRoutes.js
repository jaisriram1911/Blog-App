const express = require('express');
const routes = express.Router();
const { contactForm , authorContactForm } = require('../controller/formController')

//validators
const { runValidation } = require('../validators')
const { contactCreateValidator } = require('../validators/form');

routes.post('/contact' , contactCreateValidator , runValidation , contactForm)
routes.post('/contact-form-author' , contactCreateValidator , runValidation , authorContactForm)

module.exports = routes;