import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    externalId: String,
    price: Number,
    surface: Number,
    rooms: Number,
    zipCode: Number,
    url: String,
  },
  { timestamps: true },
);
const House = mongoose.model('House', schema);

export default House;
