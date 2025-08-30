import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    speed: { type: Number },     
    heading: { type: Number }, 
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

 
locationSchema.index({ userId: 1, timestamp: -1 });

const Location = mongoose.model("Location", locationSchema);

export default Location;
