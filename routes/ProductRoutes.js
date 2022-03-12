const router = require("express").Router();
const upload = require("../utils/upload");
const Product = require("../models/Product");

// Get All
router.get("/", (req, res) => {
  Product.find((err, result) => {
    if (err) {
      return res.status(404).send(err.message);
    } else {
      return res.status(200).json(result);
    }
  });
});

// GET By ID
router.get("/:id", (req, res) => {
  Product.findById(req.params.id, (err, result) => {
    if (err) {
      return res.status(404).send(err.message);
    } else {
      return res.status(200).json(result);
    }
  });
});

// Register/POST
router.post("/", upload.single("productImage"), async (req, res) => {
  const { name, description, price } = req.body;
  const product = new Product({
    name: name,
    description: description,
    image: "/images/" + req.file.filename,
    price: price,
  });
  product.save((err, result) => {
    if (err) {
      return res.status(404).send(err.message);
    } else {
      res.status(200).json(result);
    }
  });
});

// PUT Request
router.put("/:id", upload.single("productImage"), async (req, res) => {
  const { name, description, price } = req.body;

  Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: name,
        description: description,
        image: "/images." + req.file.filename,
        price: price,
      },
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
  Product.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) {
      return res.status(404).send(err.message);
    } else {
      return res.status(200).json(result);
    }
  });
});

module.exports = router;
