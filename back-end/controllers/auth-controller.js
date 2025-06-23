import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Verification} from "../models/verification.js";
import sendEmail from "../libs/send-email.js";

const registerUser = async (req, res) => {
    try {
        const {email, password, name} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: `User with email ${email} already exist`});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hashPassword,
            name: name,
        });

        const verifiedToken = jwt.sign({userId: newUser._id, property: "email-verification"}, "MT-1607", {expiresIn: "1h"});

        await Verification.create({
            userId: newUser._id,
            token: verifiedToken,
            expiresAt: new Date(new Date() + 1 * 60 * 60 * 1000),
        })

        //TODO: sent email verification
        const verifiedLink = `${process.env.FE_URL}/verify-email?token=${verifiedToken}`;
        const emailBody = `<p> Click <a href="${verifiedLink}">here</a> to verify your email address.</p>`;
        const emailSubject = "Verify Email PrM";

        const isSendEmail = await sendEmail(email, emailSubject, emailBody);

        if (!isSendEmail) {
            return res.status(400).json({message: `Email ${emailSubject} cannot send`});
        }

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