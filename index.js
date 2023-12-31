import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "./Models/UserModel.js";
import Post from "./Models/PostModel.js";
import Comment from "./Models/commentModel.js";
import Community from "./Models/communitesModel.js";

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.CONNECTION_STRING);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));


app.get("/user", async (req, res) => {
    const token = req.headers.Authorization;
    const userData = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({id: userData.id});
    if(user !== null){
        res.status(200).json({user});
    }
    else{
        res.status(400).json({msg: "user not found"});
    }
})

app.get("/posts", async (req, res) => {
    const category = req.query.category;
    const posts = await Post.find({$or: [{author: category.toLocaleLowerCase()}, {category: category.toLocaleLowerCase()}]});
    res.send(posts);
})

app.post("/register", async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    
    try {
        const userExists = await User.findOne({ username: username });
        if (userExists === null) {
            if (password !== confirmPassword) {
                res.status(401).json({ mssg: "Both the passwords should match, try again!" });
            }
            else if(password === ""){
                res.status(406).json({ mssg: "password cannot be empty, try again!" });
            }
            else {
                bcrypt.hash(password, 10, async (err, hash) => {
                    const newUser = new User({
                        id: uuidv4(),
                        username: username,
                        password: hash
                    })
                    newUser.save()
                        .then(newUser => {
                            jwt.sign({ id: newUser._id }, process.env.SECRET, (err, token) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500);
                                }
                                else {
                                    res.status(201).cookie('token', token).json(newUser);
                                }
                            })
                        })
                })
            }
        }
        else{
            res.status(400).json({mssg: "User already exists with the email provided"});
        }
    } catch (err) {
        res.status(500).json({ mssg: "There was an error, please try again" });
    }
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    try {
        const user = await User.findOne({username: username});
        console.log(user);
        if (user !== null) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result == true) {
                    res.status(200).json({ mssg: "authorized" });
                }
                else {
                    res.status(401).json({ mssg: "The password you entered is incorrect!" });
                }
            })
        }
        else {
            res.status(400).json({ mssg: "Cannot find username, try signing up first!" });
        }
    }
    catch (err) {
        res.status(500).json({ mssg: "There was some error in the server, try after sometime." });
    }
})

app.get("/communities", async (req, res) => {
    const communities = await Community.find();
    res.json(communities);
})

app.get("/logout", (req, res) => {
    
})

app.use((err, req, res, next) => {
    res.status(500).json({ msg: "Something went wrong with the server" });
})

app.listen(PORT, () => {
    console.log(`Server is runing on Port ${PORT}`);
})