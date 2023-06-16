const router = require("express").Router();
const User = require("../models/Users");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    name:req.body.name,
    lastname:req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      //CryptoJS is used to encrypt the password
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }); //findOne is a method to find the one data which is matched
    !user && res.status(401).json("Wrong credentials"); //if username not matched

    const hashedPassord = CryptoJS.AES.decrypt(
      //to decrypt the password
      user.password,
      process.env.PASS_SEC
    );
    const Originalpassword = hashedPassord.toString(CryptoJS.enc.Utf8);

    Originalpassword !== req.body.password && res.status(401).json("Wrong cerdentials"); //if password not matched

    const accessToken = jwt.sign( // to authenticate and authorize we use jwt i.e. if admin then give authority of admin else client authorities
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"} // jwt expiration days
    );


const { password, ...others} = user._doc; //here we destructure user so and send only other data except user data to client

    res.status(200).json({...others, accessToken}); // if username and pasword is correct
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
