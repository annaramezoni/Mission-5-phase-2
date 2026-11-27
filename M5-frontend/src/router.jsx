import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/Home/Home";
import JourneyHub from "./pages/JourneyHub/JourneyHub";
import ComparePrices from "./pages/ComparePrices/ComparePrices";
import StationDetais from "./pages/StationDetails/StationDetais";
import StationResults from "./pages/StationResults/StationResults";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "journey-hub",
        Component: JourneyHub,
      },

      {
        path: "journey-hub/compare",
        Component: ComparePrices,
      },
      {
        path: "journey-hub/station-details",
        Component: StationDetais,
      },
      {
        path: "journey-hub/stations",
        Component: StationResults,
      },
    ],
  },
]);

export default router;
