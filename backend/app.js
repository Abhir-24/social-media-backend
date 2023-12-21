import express from "express";
import mongoose from "mongoose";
import router from "./routes/users";
import blogRouter from "./routes/blogs";

const app = express()

app.use(express.json())
app.use("/api/user",router)
app.use("/api/blog",blogRouter)

mongoose.connect("mongodb+srv://admin:admin123@cluster0.lkah0st.mongodb.net/blog-app?retryWrites=true&w=majority")
.then(() => app.listen(5000))
.then(() => console.log("connected"))
.catch(err => console.log(err))

