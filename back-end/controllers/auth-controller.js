import { createUser, findUserByEmail, findUserById, updateUser } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Verification } from '../models/verification.js';
import sendEmail from '../libs/send-email.js';
import aj from '../libs/arcjet.js';
import License from '../models/license.js';

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const decision = await aj.protect(req, { email }); // Deduct 5 tokens from the bucket
    console.log('Arcjet decision', decision);

    if (decision.isDenied()) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid email address' }));
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: `User with email ${email} already exist` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser({
      email,
      password: hashPassword,
      name: name,
    });

    const verifiedToken = jwt.sign(
      {
        userId: newUser.$id,
        key: 'email-verification',
      },
      `${process.env.JWT_SECRET}`,
      { expiresIn: '1h' }
    );

    await Verification.create({
      userId: newUser.$id,
      token: verifiedToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    //TODO: sent email verification
    const verifiedLink = `${process.env.FE_URL}/verify-email?token=${verifiedToken}`;
    const emailBody = `<p> Click <a href="${verifiedLink}">here</a> to verify your email address.</p>`;
    const emailSubject = 'Verify Email PrM';

    const isSendEmail = await sendEmail(email, emailSubject, emailBody);

    if (!isSendEmail) {
      return res.status(500).json({ message: `Failed send email verification.` });
    }

    res.status(201).json({
      message: 'Verification email sent to your email. Please check and verify your account',
    });
  } catch (e) {
    console.log('Registering user', e);
    res.status(500).json({ message: 'Internal error' });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: `User with email ${email} does not exist` });
    }

    //TODO: check email is verified
    if (!user.isEmailVerified) {
      const existingVerification = await Verification.findOne({ userId: user.$id });
      if (existingVerification && existingVerification.expiresAt > new Date()) {
        return res
          .status(400)
          .json({ message: `Email is not verified. Please check and verify your email` });
      } else {
        await Verification.findByIdAndDelete(existingVerification.$id);
        const verifiedToken = jwt.sign(
          {
            userId: user.$id,
            key: 'email-verification',
          },
          `${process.env.JWT_SECRET}`,
          { expiresIn: '1h' }
        );
        await Verification.create({
          userId: user.$id,
          token: verifiedToken,
          expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });
        // send email
        const verifiedLink = `${process.env.FE_URL}/verify-email?token=${verifiedToken}`;
        const emailBody = `<p> Click <a href="${verifiedLink}">here</a> to verify your email address.</p>`;
        const emailSubject = 'Verify Email PrM';

        const isSendEmail = await sendEmail(email, emailSubject, emailBody);

        if (!isSendEmail) {
          return res.status(500).json({ message: `Failed send email verification.` });
        }

        res.status(201).json({
          message: 'Verification email sent to your email. Please check and verify your account',
        });
      }
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(400).json({ message: `Password is incorrect` });
    }

    const token = jwt.sign({ userId: user.$id, key: 'login' }, `${process.env.JWT_SECRET}`, {
      expiresIn: '7d',
    });
    await updateUser(user.$id, { lastLogin: new Date() });

    const userData = { ...user };
    delete userData.password;

    res.status(201).json({ message: 'Login successfully.', token, user: userData });
  } catch (e) {
    console.log('Login user', e);
    res.status(500).json({ message: 'Internal error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: `Unauthorized` });
    }

    const { userId, key } = payload;
    if (key !== 'email-verification') {
      return res.status(401).json({ message: `Unauthorized` });
    }

    const verification = await Verification.findByToken(token);

    if (!verification || verification.userId !== userId) {
      return res.status(401).json({ message: `Unauthorized` });
    }

    const isTokenExpired = new Date(verification.expiresAt) < new Date();
    if (isTokenExpired) {
      return res.status(401).json({ message: `Token expired` });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(401).json({ message: `Unauthorized` });
    }

    if (user.isEmailVerified) {
      return res.status(401).json({ message: `Email verification already exist` });
    }

    await updateUser(user.$id, { isEmailVerified: true });

    await Verification.findByIdAndDelete(verification.$id);

    await License.create({
      userId: user.$id,
    });

    res.status(200).json({ message: `Email verified successfully` });
  } catch (e) {
    console.log('Verification email error', e);
    res.status(500).json({ message: 'Internal error' });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: `User not found` });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({ message: `Please verify your email address.` });
    }

    const existingVerification = await Verification.findOne({
      userId: user.$id,
    });

    if (existingVerification && new Date(existingVerification.expiresAt) > new Date()) {
      return res.status(400).json({ message: `Reset password request already send` });
    }

    if (existingVerification && new Date(existingVerification.expiresAt) < new Date()) {
      await Verification.findByIdAndDelete(existingVerification.$id);
    }

    const resetPasswordToken = jwt.sign(
      {
        userId: user.$id,
        key: 'reset-password',
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    await Verification.create({
      userId: user.$id,
      token: resetPasswordToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetPasswordLink = `${process.env.FE_URL}/reset-password?token=${resetPasswordToken}`;
    const emailBody = `<p> Click <a href="${resetPasswordLink}">here</a> to reset your password.</p>`;
    const emailSubject = 'Reset password PrM';

    const isSendEmail = await sendEmail(email, emailSubject, emailBody);

    if (!isSendEmail) {
      return res.status(500).json({ message: `Failed to send email reset password request.` });
    }

    res.status(200).json({ message: 'Reset password request send' });
  } catch (e) {
    console.log('Reset password request', e);
    res.status(500).json({ message: 'Internal error' });
  }
};

const verifyResetPasswordAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ message: `Unauthorized` });
    }

    const { userId, key } = payload;
    if (key !== 'reset-password') {
      return res.status(401).json({ message: `Unauthorized` });
    }

    const verification = await Verification.findByToken(token);
    if (!verification || verification.userId !== userId) {
      return res.status(401).json({ message: `Unauthorized` });
    }

    const isTokenExpires = new Date(verification.expiresAt) > new Date();
    if (!isTokenExpires) {
      return res.status(401).json({ message: `Token expired` });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(401).json({ message: `User not found` });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ message: `Passwords do not match` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await updateUser(user.$id, { password: hashPassword });

    await Verification.findByIdAndDelete(verification.$id);
    res.status(200).json({ message: `Reset password successfully` });
  } catch (e) {
    res.status(500).json({ message: 'Internal error' });
  }
};
export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordAndResetPassword,
};
