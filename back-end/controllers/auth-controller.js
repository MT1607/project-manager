import User from "../models/user.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    try {
        const {email, password, name} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: `User with email ${email} already exist`});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashPassword,
            name: name,
        });
        //TODO: sent email
        res.status(201).json({message: 'Verification email sent to your email. Please check and verify your account'});
    } catch (e) {
        console.log("Registering user", e);
        res.status(500).json({message: "Internal error"});
    }
}
const loginUser = async (req, res) => {
    try {

    } catch (e) {
        console.log("Login user", e);
        res.status(500).json({message: "Internal error"});
    }
}

export {registerUser, loginUser}