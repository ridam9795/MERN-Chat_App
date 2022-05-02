const asyncHandler = require("express-async-handler")
const res = require("express/lib/response")
const User = require("../models/userModel")
const generateToken = require('../config/generateToken')
const crypto = require("crypto");
const Token = require('../models/token')
const sendEmail = require('../util/sendEmail')


const registerUser=asyncHandler (async (req,res)=>{
  const {name,email,password,pic }=req.body
  if(!name || !email || !password){
      res.status(400)
      throw new Error("Please Enter all the fields")
  }
  const userExists=await User.findOne({email})
  if(userExists){
      res.status(400);
      throw new Error("User already exists")
  }
  const user = await User.create({
      name,
      email,
      password,
      pic
  });
  if (user) {
const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
}).save();
    const url = `${process.env.BASE_URL}api/user/${user._id}/verify/${token.token}`;
 //   console.log("url, ",url)
    await sendEmail(user.email, "Verify Email", url);
    res.status(201).send({
          message:"An email sent to your accout please verify"
        })
      

  }else{
      res.status(400);
      throw new Error("Failed to create the User");
  }
})


const authUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    
  const user = await User.findOne({ email })
//   if (!user.verified) {
//     const token = await new Token({
// 			userId: user._id,
// 			token: crypto.randomBytes(32).toString("hex"),
// }).save();
//     const url = `${process.env.BASE_URL}api/user/${user._id}/verify/${token.token}`;
//     console.log("url, ",url)
//     await sendEmail(user.email, "Verify Your Email Please", url);
//     res.status(201).send({
//           message:"An email sent to your accout please verify"
//     })
    
//   }
    if (user && (await user.matchPassword(password)) && user.verified) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          verified:user.verified,
          pic: user.pic,
          token: generateToken(user._id),
        });
    } else if (!user.verified) { 
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
    
      }
      const url = `${process.env.BASE_URL}api/user/${user._id}/verify/${token.token}`;
				await sendEmail(user.email, "Please Verify Your Email", url);

			return res
				.status(400)
				.send({ message: "An Email sent to your account , please verify" });
		
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
      }
     
    
})

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const verifyEmail = asyncHandler(async (req, res) => {
    try {
    const user = await User.findOne({ _id: req.params.id });
  
    //if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
   if (!token) return res.status(400).send({ message: "Invalid link" });
    await User.updateOne({ _id: user._id } ,{verified: true });
        const user2 = await User.findOne({ _id: user._id });


    await token.remove();

   res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
module.exports={registerUser,authUser,allUsers,verifyEmail};