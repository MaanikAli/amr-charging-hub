import mongoose from 'mongoose';

const vehicleTypeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  chargingFee: { type: Number, required: true },
});

export default mongoose.model('VehicleType', vehicleTypeSchema);
