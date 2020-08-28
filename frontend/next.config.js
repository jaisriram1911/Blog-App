const withCSS = require('@zeit/next-css')

module.exports= withCSS({

    publicRuntimeConfig: {
        APP_NAME: 'SEOBLOG',
        API_DEVELOPMENT: 'http://localhost:8000/api',
        PRODUCTION: false,
        DOMAIN_DEVELOPMENT: 'http://localhost:3000',
        DOMAIN_PRODUCTION: 'http://seoblog.com',
        DISQUS_SHORTNAME: 'blogapp-11',
        GOOGLE_CLIENT_ID: '1025066337481-rnilmjttg5e1fo3t66g0opl7q9nb7mhq.apps.googleusercontent.com'
    }
    
})