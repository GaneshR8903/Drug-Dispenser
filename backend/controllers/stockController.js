const Stock = require("../models/Stock");
const Availability = require("../models/Availability");

// Add new stock item
const addStock = async (req, res) => {
    try {
        const { batchNo, medicineName, mrp, wholesaleName, stockCount, manufacturingDate, expiryDate, vendorName, vendorAddress, vendorPhoneNo } = req.body;

        // Convert stockCount to a number
        const parsedStockCount = parseInt(stockCount, 10);

        if (isNaN(parsedStockCount)) {
            return res.status(400).json({ message: "Invalid stockCount value" });
        }

        // 1️⃣ Add new stock entry in Stock collection
        const newStock = new Stock({ batchNo, medicineName, mrp, wholesaleName, stockCount: parsedStockCount, manufacturingDate, expiryDate, vendorName, vendorAddress, vendorPhoneNo });
        await newStock.save();

        // 2️⃣ Update or insert in Availability collection
        const existingAvailability = await Availability.findOne({ medicineName });

        if (existingAvailability) {
            // Medicine exists, update stockCount
            existingAvailability.stockCount += parsedStockCount;
            await existingAvailability.save();
        } else {
            // Medicine does not exist, create new entry
            const newAvailability = new Availability({ medicineName, stockCount: parsedStockCount });
            await newAvailability.save();
        }

        res.status(201).json({ message: "Stock added successfully and Availability updated!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding stock", error });
    }
};

const getStock = async (req, res) => {
    try {
        const stocks = await Stock.find().sort({ expiryDate: 1 }); // Sorting by expiryDate (ascending)
        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock data", error });
    }
};

// Fetch stock availability
const getStockAvailability = async (req, res) => {
    try {
      const stockData = await Availability.find().sort({ medicineName: 1 }); // Sort alphabetically
      res.status(200).json(stockData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stock availability", error });
    }
};

const updateStock = async (req, res) => {
    try {
      const { distributedMedicines } = req.body;
  
      for (let medicine in distributedMedicines) {
        await Stock.updateOne(
          { medicineName: medicine },
          { $inc: { stockCount: -distributedMedicines[medicine] } }
        );
      }
  
      res.status(200).json({ message: "Stock updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error updating stock", error });
    }
};

module.exports = { addStock, updateStock, getStockAvailability, getStock };
