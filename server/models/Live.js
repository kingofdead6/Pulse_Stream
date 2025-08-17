import mongoose from 'mongoose';

const liveSchema = mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  isLive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Live = mongoose.model('Live', liveSchema);

export default Live;