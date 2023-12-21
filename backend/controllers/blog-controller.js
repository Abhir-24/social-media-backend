import mongoose from "mongoose";
import Blog from "../models/blog";
import User from "../models/user";
import user from "../models/user";

export const getAllBlogs = async (req,res,next) => {
    let blogs;

    try {
        blogs = await Blog.find()
    } catch(err) {
        console.log(err)
    }

    if(!blogs) {
        return res.status(404).json({message: "No blogs found!"})
    }

    return res.status(200).json({blogs})
}

export const addBlog = async (req,res,next) => {
    const {title, description, image, user} = req.body

    let curUser

    try {
        curUser = await User.findById(user)
    } catch(err) {
        console.log(err);
    }

    if(!curUser) {
        return res.status(400).json({message: "User does not exist"})
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    })

    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await blog.save({session})
        await curUser.save({session})
        await session.commitTransaction()
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: err})
    }

    return res.status(200).json({message: blog})

    return res.status(200).json({blog})
}

export const updateBlog = async (req,res,next) => {
    const blogId = req.params.id
    const {title, description} = req.body
    let blog

    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })
    } catch (err) {
        console.log(err);
    }

    if(!blog) {
        return res.status(500).json({message: "Unable to update the blog"})
    }

    return res.status(200).json({blog})
}

export const getBlogById = async (req,res,next) => {
    const blogId = req.params.id

    let blog

    try {
        blog = await Blog.findById(blogId)
    } catch(err) {
        console.log(err)
    }

    if(!blog) {
        return res.status(404).json({message: "Blog not Found"})
    }
    return res.status(200).json({blog})
}

export const deleteBlog = async (req,res,next) => {
    const blogId = req.params.id

    let blog

    try {
        blog = await Blog.findByIdAndDelete(blogId).populate('user')
        await blog.user.blogs.pull(blog)
        await blog.user.save()
    } catch(err) {
        console.log(err)
    }

    if(!blog) {
        return res.status(500).json({message: "Unable to delete Blog"})
    }
    return res.status(200).json({message: "Successfully Deleted!"})
}

export const getBlogByUser = async (req,res,next) => {
    const userId = req.params.id

    let userBlogs

    try {
        userBlogs = await User.findById(userId).populate("blogs")
    } catch(err) {
        console.log(err) 
    }

    if(!userBlogs) {
        return res.status(404).json({message: "Unable to find Blog"})
    }
    return res.status(200).json({blogs: userBlogs})
}