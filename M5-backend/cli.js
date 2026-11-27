#!/usr/bin/env node
// Z Journey Hub team CLI – manage station data from the terminal.
// Run from /server:  npm run cli <command> [args]
require("dotenv").config();
const mongoose = require("mongoose");
const Station = require("./models/Station");

const FUELS = ["z91", "zxPremium", "diesel"];
const SERVICES = ["carwash", "ev", "lpg", "coffee"];
const CHCH_CENTRE = [172.6362, -43.5321]; // [lng, lat]

const HELP = `
Z Journey Hub CLI

  npm run cli list [fuel]                  All stations, cheapest first (default z91)
  npm run cli show <station>               Full details for one station
  npm run cli find <service>               Stations with a service (${SERVICES.join(", ")})
  npm run cli near <km> [fuel]             Stations within km of Christchurch centre
  npm run cli price <station> <fuel> <$>   Update a price (use "null" for Not listed)
  npm run cli help                         Show this help

  <station> can be the number (1) or full name ("Z Station 1")
  fuel = ${FUELS.join(" | ")}

Examples
  npm run cli list diesel
  npm run cli show 4
  npm run cli price 1 z91 2.69
  npm run cli near 10 zxPremium
`;

const money = (n) => (n == null ? "Not listed" : `$${n.toFixed(2)}`);
const hours = (h) => (h?.open24_7 ? "24/7" : `Until ${h?.closesAt ?? "?"}`);

// Accepts "1", "Z Station 1" or "z station 1"
const findStation = async (input) => {
  if (!input) throw new Error("Please give a station number or name");
  const name = /^\d+$/.test(input) ? `Z Station ${input}` : input;
  const station = await Station.findOne({
    name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
  });
  if (!station) throw new Error(`No station called "${name}"`);
  return station;
};

const checkFuel = (fuel) => {
  if (!FUELS.includes(fuel)) throw new Error(`Fuel must be one of: ${FUELS.join(", ")}`);
  return fuel;
};

const commands = {
  async list(fuel = "z91") {
    checkFuel(fuel);
    const stations = await Station.find().lean();
    stations.sort((a, b) => (a.prices[fuel] ?? Infinity) - (b.prices[fuel] ?? Infinity));
    console.log(`\nAll stations – ${fuel}, cheapest first\n`);
    console.table(
      stations.map((s) => ({
        Name: s.name,
        [fuel]: money(s.prices[fuel]),
        Open: hours(s.hours),
        Services: s.services.join(", ") || "-",
      }))
    );
  },

  async show(input) {
    const s = await findStation(input);
    console.log(`\n${s.name}  (${s._id})`);
    console.log(`${s.address}, ${s.city} · ${hours(s.hours)}`);
    console.log(`Location: [${s.location.coordinates.join(", ")}]`);
    console.table({
      Z91: money(s.prices.z91),
      "ZX Premium": money(s.prices.zxPremium),
      Diesel: money(s.prices.diesel),
    });
    console.log(`Services: ${s.services.join(", ") || "none"}`);
    console.log(`Prices updated: ${s.pricesUpdatedAt.toLocaleString("en-NZ")}`);
  },

  async find(service) {
    if (!SERVICES.includes(service)) {
      throw new Error(`Service must be one of: ${SERVICES.join(", ")}`);
    }
    const stations = await Station.find({ services: service }).lean();
    console.log(`\n${stations.length} station(s) with ${service}\n`);
    console.table(stations.map((s) => ({ Name: s.name, Z91: money(s.prices.z91), Open: hours(s.hours) })));
  },

  async near(km = "10", fuel = "z91") {
    const distance = Number(km);
    if (!Number.isFinite(distance) || distance <= 0) throw new Error("km must be a positive number");
    const f = checkFuel(fuel);
    const stations = await Station.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: CHCH_CENTRE },
          distanceField: "distanceM",
          maxDistance: distance * 1000,
          query: { [`prices.${f}`]: { $ne: null } },
        },
      },
      { $sort: { [`prices.${f}`]: 1 } },
      { $project: { name: 1, price: `$prices.${f}`, distanceKm: { $round: [{ $divide: ["$distanceM", 1000] }, 1] } } },
    ]);
    console.log(`\n${stations.length} station(s) selling ${f} within ${distance} km of Christchurch centre\n`);
    console.table(stations.map((s) => ({ Name: s.name, Price: money(s.price), "Distance (km)": s.distanceKm })));
  },

  async price(input, fuel, value) {
    checkFuel(fuel);
    if (value === undefined) throw new Error("Please give a price, e.g. 2.69 (or null)");
    const newPrice = value.toLowerCase() === "null" ? null : Number(value);
    if (newPrice !== null && (!Number.isFinite(newPrice) || newPrice <= 0 || newPrice > 10)) {
      throw new Error("Price must be a number between 0 and 10, or null");
    }
    const s = await findStation(input);
    const old = s.prices[fuel];
    s.prices[fuel] = newPrice;
    s.pricesUpdatedAt = new Date();
    await s.save();
    console.log(`\n✔ ${s.name} ${fuel}: ${money(old)} → ${money(newPrice)}`);
  },

  help() {
    console.log(HELP);
  },
};

const run = async () => {
  const [cmd = "help", ...args] = process.argv.slice(2);
  const command = commands[cmd];

  if (!command) {
    console.error(`Unknown command "${cmd}"`);
    console.log(HELP);
    process.exit(1);
  }
  if (cmd === "help") return command();

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing – copy .env.example to .env first");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    await command(...args);
  } catch (error) {
    console.error(`\n✖ ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
