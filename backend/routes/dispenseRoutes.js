const express = require("express");
const { addDispenseRecord } = require("../controllers/dispenseController");
const router = express.Router();

router.post("/update", addDispenseRecord);

module.exports = router;
