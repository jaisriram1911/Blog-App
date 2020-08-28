const Blog = require('../models/blog')
const Category = require('../models/categorySchema')
const Tag = require('../models/tagSchema')
const User = require('../models/userSchema')
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandlers')
const fs = require('fs')
const { smartTrim } = require('../helpers/blogHelper')

exports.create = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req , (err , fields , files) => {
        if(err){
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }
        const { title  , description , body , categories , tags } = fields;
        const {photo} = files

        if(!title || !title.length){
            return res.status(400).json({
                error: 'Title is required'
            })
        }

        if(!description || !description.length){
            return res.status(400).json({
                error: 'Description is required'
            })
        }

        if(!photo ) {
            return res.status(400).json({
                error: 'Cover Photo is required'
            })
        }

        if(!body || body.length < 200){
            return res.status(400).json({
                error: 'Content is too short!'
            })
        }

        if(!categories || categories.length === 0){
            return res.status(400).json({
                error: 'Atleast one Category is required'
            })
        }

        if(!tags || tags.length === 0){
            return res.status(400).json({
                error: 'Atleast one Tag is required'
            })
        }

        let blog = new Blog();
        blog.title = title;
        blog.description = description;
        blog.body = body;
        blog.excerpt = smartTrim(body , 300 , ' ' , '...')
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0 , 200));
        blog.postedBy = req.user._id;

        // categories and tags

        let arrayOfCategories = categories && categories.split(',')
        let arrayOfTags = tags && tags.split(',');

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            blog.photo.data = fs.readFileSync(files.photo.path)
            blog.photo.contentType = files.photo.type
        }
        blog.save((err , success) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            Blog.findByIdAndUpdate(success._id , {$push : {categories: arrayOfCategories}} , {new: true}).exec((err , success) =>{
                if(err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                } else {
                    Blog.findByIdAndUpdate(success._id , {$push: {tags: arrayOfTags}} , {new: true}).exec((err , success) => {
                        if(err){
                            return res.status(400).json({
                                error: errorHandler(err)
                            })
                        } else {
                        res.json(success)    
                        }
                    })
                }
            })
        })
    })
}

// list , listAll .., read , remove , update

exports.list = (req , res) => {
    Blog.find({})
    .populate('categories' , '_id name slug')
    .populate('tags' , '_id name slug')
    .populate('postedBy' , '_id username name')
    .select('_id title description slug excerpt categories tags postedBy createdAt updatedAt')
    .exec((err , data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.listAllCategoriesTags = (req , res) => {
    const limit = req.body.limit ? parseInt(req.body.limit) : 10
    const skip = req.body.skip ? parseInt(req.body.skip) : 0

    let blogs 
    let categories
    let tags

    Blog.find({})
    .populate('categories' , '_id name slug')
    .populate('tags' , '_id name slug')
    .populate('postedBy' , '_id username name profile')
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1})
    .select('_id title description mdesc slug excerpt categories tags postedBy createdAt updatedAt')
    .exec((err , data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        blogs = data //blogs
        //get all categories
        Category.find({}).exec((err , category) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            categories = category // category
            //get all the tags

            Tag.find({}).exec((err , t) => {
                if(err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                tags = t
                //return all the blogs with category and tags

                res.json({blogs , categories , tags , size: blogs.length})
            })
        })
    })

}

exports.read = (req , res) => {
    const slug = req.params.slug.toLowerCase()

    Blog.findOne({slug})
    .populate('categories' , '_id name slug')
    .populate('tags' , '_id name slug')
    .populate('postedBy' , '_id username name')
    .select('_id title description body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
    .exec((err , data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })

}

exports.remove = (req , res) => {
    const slug = req.params.slug.toLowerCase()

    Blog.findOneAndRemove({slug}).exec((err , data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: 'Blog is deleted successfully'
        })
    })
}

exports.update = (req , res) => {
    const slug = req.params.slug.toLowerCase()

    Blog.findOne({slug}).exec((err , oldBlog) => {
        if(err){
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }
        let form = new formidable.IncomingForm();
        form.keepExtensions = true

        form.parse(req , (err , fields , files) => {
            if(err){
                return res.status(400).json({
                    error: 'Image could not upload'
                })
            }
            
            let slugBeforeMerge = oldBlog.slug
            oldBlog = _.merge(oldBlog , fields)
            oldBlog.slug = slugBeforeMerge

            const {body , desc , categories , tags} = fields

            if(body){
                oldBlog.excerpt = smartTrim(body , 320 ,' ', ' ...' );
                oldBlog.mdesc = stripHtml(body.substring( 0 , 160));
            }

            if(categories){
                oldBlog.categories = categories.split(',');
            }

            if(tags){
                oldBlog.tags = tags.split(',');
            }
    
            if(files.photo){
                if(files.photo.size > 1000000){
                    return res.status(400).json({
                        error: 'Image should be less than 1mb in size'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path)
                oldBlog.photo.contentType = files.photo.type
            }
            oldBlog.save((err , success) => {
                if(err){
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                
                res.json(success)
            })
        })

    })

    
}

exports.photo = (req , res) => {
        const slug = req.params.slug.toLowerCase()

        Blog.findOne({slug})
        .select('photo')
        .exec((err , blog ) => {
            if(err || !blog) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.set('Content-Type' , blog.photo.contentType)
            return res.send(blog.photo.data)
        })

}

exports.listRelated = (req , res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 3

    const {_id , categories } = req.body.blog

    Blog.find({_id: {$ne: _id} , categories: {$in : categories} })
    .limit(limit)
    .populate('postedBy' , '_id profile username name')
    .select('title description slug excerpt postedBy updatedAt')
    .exec((err , blogs ) => {
        if(err){
            return res.status(400).json({
                error: 'blog is not found'
            })
        }
        res.json(blogs)
    })
}

exports.listSearch = (req, res) => {
    let {search} = req.query

    if(search) {
        Blog.find({
            $or: [{title: {$regex: search , $options: 'i'}}, {body: {$regex: search , $options: 'i'}}]
        }, (err , blogs) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(blogs)
        }).select('-photo  -body')
    }
}

exports.listByUser = (req, res) => {
    
    let username = req.params.username

    User.findOne({username}).exec((err , user) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        } 
        let userId = user._id

        Blog.find({postedBy: userId})
        .populate('categories' , '_id name slug')
        .populate('tags' , '_id name slug')
        .populate('postedBy' , '_id name username')
        .select('_id title description slug createdAt updatedAt')
        .exec((err , data) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(data)
        }) 
    })

}