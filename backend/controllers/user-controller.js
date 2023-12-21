import User from '../models/user'
import bcrypt from 'bcryptjs'

export const getAllUsers = async (req,res,next) => {
    let users;

    try {
        users = await User.find()
    } catch(err) {
        console.log(err)
    }

    if(!users) {
        return res.status(404).json({message: "No users found!"})
    }

    return res.status(200).json({users})
}

export const signup = async (req,res,next) => {
    const {name, email, password} = req.body

    let curUser;

    try {
        curUser = await User.findOne({email})
    } catch(err) {
        console.log(err);
    }

    if(curUser) {
        return res.status(400).json({message: "User already exists!"})
    }

    const hashedPassword = bcrypt.hashSync(password)

    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []
    })

    try {
        await user.save()
    } catch(err) {
        console.log(err)
    }

    return res.status(201).json({user})

}

export const login = async (req,res,next) => {
    const {email, password} = req.body
    let curUser;

    try {
        curUser = await User.findOne({email})
    } catch(err) {
        console.log(err);
    }

    if(!curUser) {
        return res.status(404).json({message: "User Not Found!"})
    }

    const hashedPassword = bcrypt.hashSync(password)

    const passwordCheck = bcrypt.compareSync(password, curUser.password)

    if(!passwordCheck) {
        return res.status(400).json({message: "Password is Incorrect!"})
    }
 
    return res.status(201).json({message: "Login Successful!"})

}