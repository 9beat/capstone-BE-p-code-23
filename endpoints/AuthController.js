import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import models
import UsersModel from "../models/UsersModel.js";

//*####################################################
// TODO<---- IMPROVE__SECURITY__CONTROLS ---->#########
//*####################################################


//^####--USER_REGISTER--###
// register user on db
export const userRegister = async (req, res) => {
  try {
    // get data
    const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

    // encrypt password (genSalt([void]) - random salt)
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new UsersModel({ firstName, lastName, email, password: passwordHash, picturePath, friends, location, occupation, viewedProfile: Math.floor(Math.random() * 5000), impressions: Math.floor(Math.random() * 10_000) });

    // save user
    const registeredUser = await newUser.save();

    // send created user res
    res.status(201).json(registeredUser);
  } catch (err) {
    if (err.code === 11_000) { // duplicate key error
      return (
        res.status(400).json({
        message: "Email already registered."
      }));
    }
    res.status(500).json({
      message: "Internal server error."
    });
  }
}

//^####---USER__LOGIN---####
export const userLogin = async (req, res) => {
  try {
    // user credentials
    const { email, password } = req.body;

    // check user email
    const user = await UsersModel.findOne({ email })
    
    if (!user) {
      return (
        res.status(400).json({
        message: "Wrong username or password."
      }))
    }
    
    // check password
    const pswMatch = await bcrypt.compare(password, user.password)
    
    if (!pswMatch) {
      return ( 
        res.status(400).json({
        message: "Wrong username or password."
      }))
    }
    
    // generate token
    const token = jwt.sign({ 
      id: user._id 
    }, process.env.JWT_SECRET);
    
    // delete temporary password
    user.password = undefined;
    
    // send logged user res
    res.status(200).json({ 
        token, 
        user 
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error."
    });
  }
};

//*####################################################
// TODO<---- IMPROVE__SECURITY__CONTROLS ---->#########
//*####################################################