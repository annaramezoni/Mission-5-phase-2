// seed/seed.js
// Loads seed/stations.json into the database named in MONGO_URI.
// Run from /server:
//   npm run seed               -> adds new stations and updates existing ones (matched by name). Deletes nothing.
//   npm run seed -- --reset    -> DELETES every station first, then loads the file. Ask the team before using this.

require("dotenv").config();
const mongoose = require("mongoose");
const Station = require("../models/Station");
const stations = require("./stations.json");

const reset = process.argv.includes("--reset");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to ${mongoose.connection.name}`);

    // 1. Only with --reset: clear all old stations
    if (reset) {
      const { deletedCount } = await Station.deleteMany({});
      console.log(`Reset: deleted ${deletedCount} station(s)`);
    }

    // 2. For each station in the file: update it if the name exists, otherwise add it
    let added = 0;
    let updated = 0;
    for (const station of stations) {
      const result = await Station.updateOne(
        { name: station.name },
        { $set: { ...station, pricesUpdatedAt: new Date() } },
        { upsert: true, runValidators: true }
      );
      if (result.upsertedCount) added++;
      else updated++;
    }

    // 3. Make sure the 2dsphere index exists (needed for "within X km" searches)
    await Station.syncIndexes();

    console.log(`Done: ${added} added, ${updated} updated`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
