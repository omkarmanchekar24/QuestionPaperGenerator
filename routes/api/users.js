const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const { cloudinary } = require("../../utils/cloudinary");

//Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load User Model
const User = require("../../models/User");

//@route    api/users/test
//@desc     Tests users route
//@access   Public
router.get("/test", (req, res) => res.send({ msg: "Users works!" }));

//@route    POST api/users/register
//@desc     Register user
//@access   Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

//@route    api/users/login
//@desc     Generate token
//@access   Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find by user email
  User.findOne({ email }).then((user) => {
    //Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //User Matched

        const payload = {
          id: user.id,
          name: user.name,
          cloudinary: user.cloudinary,
        }; // Create JWT Payload

        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        errors.password = "Password is incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route    api/users/current
//@desc     Return current user
//@access   Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

router.patch(
  "/uploadpicture",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const fileStr = req.body.data;

      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "ml_default",
      });

      if (uploadResponse) {
        User.findByIdAndUpdate(
          req.user.id,
          {
            cloudinary: uploadResponse,
          },
          { new: true },
          (err, doc) => {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json(doc);
            }
          }
        );
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: "Something went wrong" });
    }
  }
);

router.patch(
  "/removepicture",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user_id = req.user.id;
    const public_id = req.body.public_id;

    User.findByIdAndUpdate(
      user_id,
      {
        cloudinary: null,
      },
      { new: true }
    )
      .then((user) => {
        //delete cloudinary image
        cloudinary.uploader.destroy(public_id, (error, result) => {
          if (error) {
            //add task to queue
          }
        });
        return res.status(200).json(user);
      })
      .catch((err) => {
        res.status(400).json({ message: "Something went wrong!!" });
      });
  }
);

module.exports = router;
