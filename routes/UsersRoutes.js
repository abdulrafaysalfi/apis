const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { default: jwtDecode } = require("jwt-decode");
const Token = require("../models/token");
const User = require("../models/User");
const sendMail = require("../utils/email");
// Get All
router.get("/", (req, res) => {
  User.find((err, result) => {
    if (err) {
      return res.status(404).send(err.message);
    } else {
      return res.status(200).json(result);
    }
  });
});

// GET By ID
router.get("/:id", (req, res) => {
  User.findById(req.params.id, (err, result) => {
    if (err) {
      return res.status(404).send(err.message);
    } else {
      return res.status(200).json(result);
    }
  });
});
router.get("/verify/:id/:token", async (req, res) => {
  const id = req.params.id;
  const decodedToken = jwtDecode(req.params.token);
  const user = await User.findById(id);
  console.log(user);
  console.log(user._id.toString());
  if (user == null) res.status(404).json("Invalid Token/Id");
  console.log("Token : " + req.params.token);
  console.log("D-Token : " + decodedToken["id"]);
  if (decodedToken["id"] === user._id.toString()) {
    User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isVerified: true,
        },
      },
      (err, result) => {
        if (err) {
          return res.status(404).send(err.message);
        } else {
          return res.status(200).json({ status: "Account Activated" });
        }
      }
    );
  }
});

// Register/POST
router.post("/register", async (req, res) => {
  const { name, role, email, password } = req.body;
  const userExist = await User.find({ email: email });
  if (userExist && userExist.length > 0) {
    return res.status(409).json("Email Already Exist");
  } else {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const user = new User({
      name: name,
      role: role,
      email: email,
      password: hashedPassword,
    });
    user.save((err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).send(err.message);
      } else {
        var tokenObj = new Token({
          userId: result._id,
          token: jsonwebtoken.sign(
            { id: result._id },
            process.env.TOKEN_SECRET
          ),
        });
        const html = `<div><em>Dear ${result.name},</em><br>Please Click on the link below to activate your account.<br/><a href='${process.env.BASE_URL}/api/users/verify/${tokenObj.userId}/${tokenObj.token}'><button>Verify Account</button></a><br><br>ARS Team\n${process.env.USER}</div>`;
        sendMail(user.email, "Verify Account", html);
        return res.status(200).json(result);
      }
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { name, role, email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user && user.length === 0) {
    return res.status(404).json("User/Email doesn't exist.");
  } else {
    const validPassword = await bcryptjs.compare(password, user.password);
    if (user && validPassword) {
      if (user.isVerified) {
        const token = await jsonwebtoken.sign(
          user.toJSON(),
          process.env.TOKEN_SECRET,
          { expiresIn: 900000 }
        );
        res.setHeader("auth-token", token);
        res.status(200).json({ token: token });
      } else {
        return res.status(404).json("Account is not activated");
      }
    } else {
      return res.status(404).json("Invalid email or password");
    }
  }
});

// Change Password
router.patch("/:id", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword === newPassword) {
    return res.send("Password can be old password.");
  } else {
    const user = await User.findById(req.params.id);
    if (bcryptjs.compare(oldPassword, user.password)) {
    }
  }
});

// PUT Request
router.put("/:id", async (req, res) => {
  const { name, role, email, password } = req.body;
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  User.updateOne(
    { _id: req.params.id },
    {
      $set: { name: name, role: role, email: email, password: hashedPassword },
    },
    (err, result) => {
      if (err) {
        return res.status(404).send(err.message);
      } else {
        return res.status(200).json(result);
      }
    }
  );
});

// PATCH Request
router.patch("/:id", async (req, res) => {
  const { name, role, email, password } = req.body;
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  User.updateOne(
    { _id: req.params.id },
    {
      $set: { name: name, role: role, email: email, password: hashedPassword },
    },
    (err, result) => {
      if (err) {
        return res.status(404).send(err.message);
      } else {
        return res.status(200).json(result);
      }
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) {
      return res.status(404).send(err.message);
    } else {
      return res.status(200).json(result);
    }
  });
});

module.exports = router;
