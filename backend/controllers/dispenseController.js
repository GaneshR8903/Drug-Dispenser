const DispenseUpdate = require("../models/DispenseUpdate");
const Availability = require("../models/Availability");

const addDispenseRecord = async (req, res) => {
    try {
      const { patientID, patientName, dispensedMedicines, staffName } = req.body;
  
      // Create a new dispense record
      const newDispense = new DispenseUpdate({
        patientID,
        patientName,
        dispensedMedicines,
        staffName,
      });
  
      await newDispense.save();
  
      // Reduce stock for each dispensed medicine
      for (let medicine in dispensedMedicines) {
        const quantityToReduce = dispensedMedicines[medicine];
  
        const stock = await Availability.findOne({ medicineName: medicine });
  
        if (!stock) {
          return res.status(400).json({ message: `Medicine ${medicine} not found in stock` });
        }
  
        if (stock.stockCount < quantityToReduce) {
          return res.status(400).json({ message: `Insufficient stock for ${medicine}` });
        }
  
        await Availability.updateOne(
          { medicineName: medicine },
          { $inc: { stockCount: -quantityToReduce } }
        );
      }
  
      res.status(201).json({ message: "Dispense record saved and stock updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error processing dispense record", error });
    }
  };

module.exports = { addDispenseRecord };
