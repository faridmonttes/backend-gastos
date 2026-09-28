const express = require("express");
const auth = require("../middleware/auth");
const Expense = require("../models/Expense");
const router = express.Router();
//Crear un gasto
router.post("/new", auth, async (req, res) => {
  const { title, amount, date, category } = req.body;
  try {
    const expense = new Expense({
      title,
      amount,
      date: date || Date.now(),
      category,
      user: req.user.id,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;

//Listar los gastos del usuario
router.get("/list", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).populate({
      path: "category",
      select: "name",
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un gasto
router.put("/:id", auth, async (req, res) => {
  const { title, amount, date, category } = req.body;
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, amount, date, category },
      { new: true, runValidators: true }
    );
    if (!expense)
      return res.status(404).json({ error: "Gasto no encontrado" });
    res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un gasto
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense)
      return res.status(404).json({ error: "Gasto no encontrado" });
    res.status(200).json({ message: "Gasto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;