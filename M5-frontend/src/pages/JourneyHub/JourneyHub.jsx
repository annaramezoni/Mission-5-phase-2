import { Link } from "react-router";

export default function JourneyHub() {
  return (
    <div>
      <h1>Journey Hub</h1>

      <nav>
        <Link to="/journey-hub/compare">Compare Prices</Link>

        <Link to="/journey-hub/station-details">Station Details</Link>

        <Link to="/journey-hub/stations">Station Results</Link>
      </nav>
    </div>
  );
}
