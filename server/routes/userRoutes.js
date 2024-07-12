const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      res.send({
        success: false,
        message: "User Already Exists",
      });
      res.json("User Exists")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      success: true,
      message: "You've successfully signed up, please login now!",
    });
    res.json("Succesfully Resgistered")
  } catch (error) {
    res.send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.send({
        success: false,
        message: "User Does not exist , please register",
      });
      res.json("User Does Not Exist")
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      res.send({
        success: false,
        message: "Invalid Password",
      });
      res.json("Invalid Password")
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "You've successfully logged in!",
      token: token,
    });
    res.json("Successfully Logged in")
  } catch (error) {
    console.error(error);
  }
});

/*

// router.get("/get-current-user", authMiddleware, async (req, res) => {
//   const user = await User.findById(req.body.userId).select("-password");

//   res.send({
//     success: true,
//     message: 'You are authorized to go to the protected route!',
//     data: user
//    })
// });

*/

router.get("/get-current-user", authMiddleware , async(req, res) => {

    try{

        const user = await User.findById(req.body.userId).select('-password')
        res.send({
            success: true,
            message: 'You are authorized to go to the protected route!',
            data: user
        })
    }catch (err){
        res.send({
            success : false,
            message : 'not authorized'
        })
        console.log(err)
    }
})
module.exports = router;