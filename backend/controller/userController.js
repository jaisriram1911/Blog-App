const User = require('../models/userSchema')
const Blog = require('../models/blog')
const formidable = require('formidable');
const fs = require('fs')
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandlers')

exports.read = (req , res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
    let username = req.params.username;
    let blogs;
    let user;

    User.findOne({ username }).exec((err, userFromDB) => {
        if (err || !userFromDB) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user = userFromDB;
        let userId = user._id;
        Blog.find({ postedBy: userId })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .limit(10)
            .select('_id title slug mdesc excerpt categories tags postedBy createdAt updatedAt')
            .exec((err, blog) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // blogs = blog
                user.salt = undefined;
                user.hashed_password = undefined;
                res.json({user,blogs : blog});
            });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtension = true;
    form.parse(req , (err , fields , files) => {
        if(err) {
            return res.status(400).json({
                error: 'Photo Could not be Uploaded'
            })
        }

        let user = req.profile
        user = _.extend(user , fields)

        if(fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            })
        }

        if(files.photo){
            if(files.photo.size > 10000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb'
                })
            }
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
        }

        user.save((err , user) => {
            if(err){
                return res.status(400).json({
                    error: 'All fields are required'
                })
            }
            user.photo = undefined;
            user.salt = undefined;
            user.hashed_password = undefined;
            res.json(user);
        })
    })
}

exports.photo = (req, res) => {
    let username = req.params.username

    User.findOne({ username }).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if(user.photo.data){
            res.set('Content-Type' , user.photo.contentType)
            return res.send(user.photo.data)
        }
    })
}