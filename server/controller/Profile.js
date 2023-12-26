const User = require("../model/User");
require("dotenv").config();

const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_ID,
    pass: process.env.PASSWORD,
  },
});

exports.getProfile = (req, res, next) => {
  console.log(req.userId);
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 400;
        throw error;
      }

      res.status(200).json({
        message: "user found",
        userData: {
          name: user.name,
          email: user.email,
          location: user.location || "",
          bio: user.bio || "",
          website: user.website || "",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.sendOtp = (req, res, next) => {
  const email = req.body.email;
  const min = 12456;
  const max = 98985;
  const randomOTP = Math.floor(Math.random() * (max - min + 1)) + min;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const err = new Error("invalid user");
        err.statusCode = 404;
        throw err;
      }
      user.otp = randomOTP;
      return user.save();
    })
    .then((response) => {
      const mailOption = {
        from: process.env.USER_ID,
        to: email,
        subject: "BlogSpot OTP",
        html: `<html><body style="width : 95%; text-align:center;   display: flex;
                justify-content: center;
                align-items: center; margin : auto ; background-color :#000000d9;padding : 15px ;">
                
                <div style="width : 95% ;height : 90%; text-align : center; margin : 12px auto ; background-color : #0c0921; padding:1rem">
                <h1 style="color : green">Hi Your Api limit is end. We call a new api . please add more api</h1>
                  <h2 style="margin:12px , color : orange "> Your OTP - ${randomOTP} </h2>
                </div>
                
                </body></html>`,
      };
      return transporter.sendMail(mailOption);
    })
    .then((result) => {
      res.status(200).json({ message: "otp send" });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.exitProfile = (req, res, next) => {
  const data = req.body;

  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("invalid user");
        error.statusCode = 404;
        throw error;
      }

      if (Number(data.otp) === user.otp || !data.isOtp) {
        user.name = data.name;
        user.email = data.email;
        user.website = data.website;
        user.bio = data.bio;
        user.location = data.location;

        return user.save();
      } else {
        const error = new Error("invalid otp");
        error.statusCode = 404;
        throw error;
      }
    })
    .then((result) => {
      res.status(201).json({
        message: "profile update",
        userData: {
          name: result.name,
          email: result.email,
          location: result.location || "",
          bio: result.bio || "",
          website: result.website || "",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};