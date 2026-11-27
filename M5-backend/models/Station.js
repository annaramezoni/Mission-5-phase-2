const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },     // "Z Station 1"
    address: { type: String, required: true },  // "12 Main Road"
    city: { type: String, required: true },     // "Christchurch"

    // GeoJSON point – [longitude, latitude] (longitude FIRST)
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },

    hours: {
      open24_7: { type: Boolean, default: false },
      closesAt: { type: String, default: null }, // "22:00"
    },

    // null = "Not listed" in the design
    prices: {
      z91: { type: Number, default: null },
      zxPremium: { type: Number, default: null },
      diesel: { type: Number, default: null },
    },
    pricesUpdatedAt: { type: Date, default: Date.now },

    services: [{ type: String, enum: ["carwash", "ev", "lpg", "coffee"] }],
  },
  { timestamps: true }
);

// Needed for "within 5 / 10 / 25 / 50 km" searches
stationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Station", stationSchema);
