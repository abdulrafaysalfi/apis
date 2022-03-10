const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User");
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
        return res.status(404).send(err.message);
      } else {
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
      const token = await jsonwebtoken.sign(
        user.toJSON(),
        process.env.TOKEN_SECRET,
        { expiresIn: 900000 }
      );
      res.setHeader("auth-token", token);
      res.status(200).json({ token: token });
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
