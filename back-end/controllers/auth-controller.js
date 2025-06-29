import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Verification} from "../models/verification.js";
import sendEmail from "../libs/send-email.js";
import aj from "../libs/arcjet.js";

const registerUser = async (req, res) => {
    try {
        const {email, password, name} = req.body;

        const decision = await aj.protect(req, {email}); // Deduct 5 tokens from the bucket
        console.log("Arcjet decision", decision);

        if (decision.isDenied()) {
            res.writeHead(403, {"Content-Type": "application/json"});
            res.end(JSON.stringify({message: "Invalid email address"}));
        }

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

        const verifiedToken = jwt.sign({
            userId: newUser._id,
            key: "email-verification"
        }, `${process.env.JWT_SECRET}`, {expiresIn: "1h"});

        await Verification.create({
            userId: newUser._id,
            token: verifiedToken,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        })

        //TODO: sent email verification
        const verifiedLink = `${process.env.FE_URL}/verify-email?token=${verifiedToken}`;
        const emailBody = `<p> Click <a href="${verifiedLink}">here</a> to verify your email address.</p>`;
        const emailSubject = "Verify Email PrM";

        const isSendEmail = await sendEmail(email, emailSubject, emailBody);

        if (!isSendEmail) {
            return res.status(500).json({message: `Failed send email verification.`});
        }

        res.status(201).json({message: 'Verification email sent to your email. Please check and verify your account'});
    } catch (e) {
        console.log("Registering user", e);
        res.status(500).json({message: "Internal error"});
    }
}
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email}).select("+password");
        if (!user) {
            return res.status(400).json({message: `User with email ${email} does not exist`});
        }

        //TODO: check email is verified
        if (!user.isEmailVerified) {
            const existingVerification = await Verification.findOne({userId: user._id});
            if (existingVerification && existingVerification.expiresAt > new Date()) {
                return res.status(400).json({message: `Email is not verified. Please check and verify your email`});
            } else {
                await Verification.findByIdAndDelete(existingVerification._id);
                const verifiedToken = jwt.sign({
                    userId: user._id,
                    key: "email-verification"
                }, `${process.env.JWT_SECRET}`, {expiresIn: "1h"});
                await Verification.create({
                    userId: user._id,
                    token: verifiedToken,
                    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
                })
                // send email
                const verifiedLink = `${process.env.FE_URL}/verify-email?token=${verifiedToken}`;
                const emailBody = `<p> Click <a href="${verifiedLink}">here</a> to verify your email address.</p>`;
                const emailSubject = "Verify Email PrM";

                const isSendEmail = await sendEmail(email, emailSubject, emailBody);

                if (!isSendEmail) {
                    return res.status(500).json({message: `Failed send email verification.`});
                }

                res.status(201).json({message: 'Verification email sent to your email. Please check and verify your account'});
            }
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(400).json({message: `Password is incorrect`});
        }

        const token = jwt.sign({userId: user._id, key: "login"}, `${process.env.JWT_SECRET}`, {expiresIn: "7d"});
        user.lastLogin = new Date();
        await user.save();
        
        const userData = user.toObject();
        delete userData.password;

        res.status(201).json({message: 'Login successfully.', token, user: userData});
    } catch (e) {
        console.log("Login user", e);
        res.status(500).json({message: "Internal error"});
    }
}

const verifyEmail = async (req, res) => {
    try {
        const {token} = req.body;

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (!payload) {
            return res.status(401).json({message: `Unauthorized`});
        }

        const {userId, key} = payload;
        if (key !== "email-verification") {
            return res.status(401).json({message: `Unauthorized`});
        }

        const verification = await Verification.findOne({
            userId,
            token,
        });

        if (!verification) {
            return res.status(401).json({message: `Unauthorized`});
        }

        const isTokenExpired = verification.expiresAt < new Date();
        if (isTokenExpired) {
            return res.status(401).json({message: `Token expired`});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({message: `Unauthorized`});
        }

        if (user.isEmailVerified) {
            return res.status(401).json({message: `Email verification already exist`});
        }

        user.isEmailVerified = true;
        await user.save();

        await Verification.findByIdAndDelete(verification._id);
        res.status(200).json({message: `Email verified successfully`});
    } catch (e) {
        console.log("Verification email error", e);
        res.status(500).json({message: "Internal error"});
    }
}

export {registerUser, loginUser, verifyEmail};