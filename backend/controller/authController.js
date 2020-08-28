const User = require('../models/userSchema')
const Blog = require('../models/blog')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const { errorHandler } = require('../helpers/dbErrorHandlers')
const _ = require('lodash')
const {OAuth2Client} = require('google-auth-library')
//sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);

exports.preSignup = (req, res) => {
    const {name , email , password} = req.body

    User.findOne({ email: email }).exec((err , user) => {
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }

        const token = jwt.sign({name , email , password}, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' })

        const emailData = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Activate your account with this link',
            html: `
                <h4>Activate your Account using this link</h4>
                <p>This link will only be valid for 10min.</p>
                <p>${process.env.CLIENT_URL}/auth/account/activation/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>https://seoblog.com</p>
            `
        };

        sgMail.send(emailData).then(sent => {
            return res.json({
                message: `Activation link has been sent to ${email}`
            })
        })
    })
}

// exports.signup = (req, res) =>{
//     User.findOne({email: req.body.email}).exec((err, user) =>{
//         if(user){
//             return res.status(400).json({
//                 error: 'Email is taken'
//             })
//         }

//         const {name , email , password} = req.body
//         let username = shortId.generate()
//         let profile =  `${process.env.CLIENT_URL}/profile/${username}`

//         let newUser = new User({name , email , password , profile , username})
//         newUser.save((err , success) => {
//             if(err){
//                 return res.status(400).json({
//                     error: 'unexpected error occered please try again'
//                 })
//             }
//             res.json({
//                 message: 'signup success! please sign in.'
//             })
//         })

//     })
// }

exports.signup = (req , res) => {
    const token = req.body.token
    if(token){
        jwt.verify(token , process.env.JWT_ACCOUNT_ACTIVATION , function(err , decoded){
            if(err){
                return res.status(401).json({
                    error: 'Link has expired! please try again'
                })
            }

            const {name , email , password} = jwt.decode(token)
            let username = shortId.generate()
            let profile =  `${process.env.CLIENT_URL}/profile/${username}`
            let newUser = new User({name , email , password , profile , username})
            newUser.save((err , success) => {
                if(err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                res.json({
                    message: 'signup success! please sign in.'
                })
            })
        })
    } else {
        return res.status(400).json({
            error: 'something went wrong please try again'
        })
    }
}

exports.signin = (req , res) =>{
    const { email , password } = req.body
    //check if user exist 
    User.findOne({email}).exec((err , user) =>{
        if(err || !user){
            return res.status(400).json({
                error: 'user and password doesnt match!'
            })
        }
          //authenticate
            if(!user.authenticate(password)){
                return res.status(400).json({
                    error: 'user and password doesnt match!'
            })
        }
        //generate a token and send to client
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' })
        
        res.cookie('token', token, {expiresIn: '1d'})
        const {_id , username , name , email , role} = user
        return res.json({
            token,
            user: {_id , username , name , email , role}
        });
    });
}; 

exports.signout = (req , res) =>{
    res.clearCookie('token');
    res.json({
        message: 'signout successfull'
    });
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
});

exports.authMiddleware = (req , res , next) => {
    const authUserId = req.user._id
    User.findById({_id : authUserId}).exec((err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error: 'User not found!'
            })
        }
        req.profile = user
        next()
    })
}

exports.adminMiddleware = (req , res , next) => {
    const adminUserId = req.user._id
    User.findById({_id : adminUserId}).exec((err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error: 'User not found!'
            })  
            }

            if(user.role !== 1) {
                return res.status(400).json({
                    error: 'Admin resource. Access denied!'
                })
            }

            req.profile = user
            next()
    })
}

exports.canUpdateAndDelete = (req , res, next) => {
    const slug = req.params.slug.toLowerCase()

    Blog.findOne({slug}).exec((err , user) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        let authUser = user.postedBy._id.toString() === req.profile._id.toString()

        if(!authUser) {
            return res.status(400).json({
                error: 'Your not Authenticated'
            })
        } 
        next();
    })

}

exports.forgotPassword = (req , res) => {
    const {email} = req.body

    User.findOne({email} , (err , user) => {
        if(err || !user) {
            return res.status(401).json({
                error: 'User not found'
            })
        }
        const token = jwt.sign({_id: user._id} , process.env.JWT_RESET_PASSWORD , { expiresIn: '1m'})

        //email

        const emailData = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Reset Password Link For Blog App Website',
            html: `
                <h4>Reset your Password using this link , this link will expir 10 min.:</h4>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>https://seoblog.com</p>
            `
        };

        // reset link to db
       return user.updateOne({resetPasswordLink: token} , (err , success) => {
           if(err) {
               return res.status(400).json({
                   error: errorHandler(err)
               })
           } else {
            sgMail.send(emailData).then(sent => {
                return res.json({
                    message: `Email is successfully sent to ${email} , Follow the instructions and the link will expire in 10min.`
                });
            }).catch(err => console.log(err))
           }
       })
    })

}

exports.resetPassword = (req , res) => {
    const {resetPasswordLink , newPassword} = req.body
    
    if(resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD , function(err , user){
            if(err) {
                return res.status(401).json({
                    error: 'Link expired! Please try again'
                })
            }
            User.findOne({resetPasswordLink} , (err , user) => {
                if(err || !user){
                    return res.status(401).json({
                        error: 'something went wrong please try again'
                    })
                } 

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }

                user = _.extend(user, updatedFields)
                user.save((err, result) => {
                    if(err){
                        return res.status(400).json({
                            error: errorHandler(err)
                        })
                    }
                    res.json({
                        message: 'Your Password has been Changed Successfully!!!'
                    })
                })
            })
        })
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.googleLogin = (req , res) => {

    const idToken = req.body.tokenId
    client.verifyIdToken({idToken , audience: process.env.GOOGLE_CLIENT_ID })
    .then(response => {
        const {email_verified , email , jti ,name} = response.payload
        if(email_verified){
            User.findOne({email}).exec((err , user) => {
                if(user){
                    const token = jwt.sign({_id: user._id} , process.env.JWT_SECRET , { expiresIn: '1d'})
                    res.cookie('token' , token , { expiresIn: '1d'})
                    const {_id , email , name , role, username} = user
                    return res.json({token , user: {_id , email , name , role, username}})
                } else {
                    let username = shortId.generate()
                    let profile =  `${process.env.CLIENT_URL}/profile/${username}`
                    let password = jti

                    user = new User({name , email , password , username , password})
                    user.save((err , data) => {
                        if(err){
                            return res.status(400).json({
                                error : errorHandler(err)
                            })
                        }
                        const token = jwt.sign({_id: data._id} , process.env.JWT_SECRET , { expiresIn: '1d'})
                    res.cookie('token' , token , { expiresIn: '1d'})
                    const {_id , email , name , role, username} = data
                    return res.json({token , user: {_id , email , name , role, username}})
                    })
                }
            })
        } else {
            return res.status(400).json({
                error : 'Google Login Failed. Please try again'
            })
        }
    }
    )

}