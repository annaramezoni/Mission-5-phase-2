import { Link } from "react-router";
export default function Home() {
  return (
    <div>
      <h1>Welcome Home</h1>

      <Link to="/journey-hub">Go to Journey Hub</Link>
    </div>
  );
}
