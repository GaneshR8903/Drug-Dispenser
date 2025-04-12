const express = require("express");
const { addStock, updateStock,getStockAvailability, getStock } = require("../controllers/stockController");

const router = express.Router();

router.post("/", addStock); // Add new stock
router.get("/", getStock);
router.put("/updateStock", updateStock);
router.get("/stockAvailability", getStockAvailability);

module.exports = router;
