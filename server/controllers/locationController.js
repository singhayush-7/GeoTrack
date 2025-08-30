import Location from "../models/Location.js";

 

export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find()
      .populate("userId", "name");  
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const createLocation = async (req, res) => {
  try {
    const { latitude, longitude, speed, heading } = req.body;
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res
        .status(400)
        .json({ error: "latitude & longitude must be numbers" });
    }

    const doc = await Location.create({
      userId: req.user.id,
      latitude,
      longitude,
      speed: typeof speed === "number" ? speed : undefined,
      heading: typeof heading === "number" ? heading : undefined,
    });

 
    const populatedDoc = await doc.populate("userId", "name email");

    res.status(201).json(populatedDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
export const getMyHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "200", 10), 1000);
    const history = await Location.find({ userId: req.user.id })
      .populate("userId", "name email")  
      .sort({ timestamp: 1 })
      .limit(limit);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
export const getUserHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "200", 10), 1000);
    const { userId } = req.params;
    const history = await Location.find({ userId })
      .populate("userId", "name email")    
      .sort({ timestamp: 1 })
      .limit(limit);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
