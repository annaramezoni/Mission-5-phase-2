const router = require("express").Router();
const { getCompareOptions, compareStations } = require("../controllers/compareController");

// "/options" must come before any "/:something" route
router.get("/options", getCompareOptions);
router.get("/", compareStations);

module.exports = router;
