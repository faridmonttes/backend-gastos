const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth");
router.post("/new", auth, async (req, res) => {
  const name = req.body.name;
  try {
    const existingCategory = await Category.findOne({
      name: name.trim(),
      user: req.user.id,
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Ya existe una categoría con este nombre" });
    }
    const category = new Category({
      name,
      user: req.user.id,
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
});

// Listar las categorias
router.get("/list", auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error });
    console.error(error);
  }
});

// Actualizar una categoría
router.put("/:id", auth, async (req, res) => {
  const name = req.body.name;
  try {
    const existingCategory = await Category.findOne({
      name: name.trim(),
      user: req.user.id,
      _id: { $ne: req.params.id },
    });
    if (existingCategory) {
      return res.status(400).json({
        error: "Ya existe otra categoría con este nombre",
      });
    }
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name },
      { new: true, runValidators: true },
    );
    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error });
    console.error(error);
  }
});

module.exports = router;