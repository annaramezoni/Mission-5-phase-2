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
        children: [
          {
            path: "compare",
            Component: ComparePrices,
          },
          {
            path: "station-details",
            Component: StationDetais,
          },
          {
            path: "stations",
            Component: StationResults,
          },
        ],
      },
    ],
  },
]);

export default router;
