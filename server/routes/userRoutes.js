const express = require("express");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({email : req.body.email})
        if(userExists){
            res.json("User Exists")
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body)
        await newUser.save()
        console.log("ho gaya")
        res.json("User Created")
    } catch (error){
        console.log("nai hua")
        res.json(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email : req.body.email})
        if(!user){
            res.json("User not found")
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            res.json("Invalid Password")
        }
        res.json("Logged In")
    } catch (error){
        res.json(error);
    }
  
});


module.exports = router;