import { NavLink } from "react-router";
import styles from "./NavbarBottom.module.css";
export default function NavbarBottom() {
  return (
    <nav className={styles.navBottom}>
      <NavLink
        className={({ isActive }) => (isActive ? styles.active : "")}
        to="/journey-hub"
        end>
        {({ isActive }) => (
          <>
            <img
              src={
                isActive
                  ? "/icons/nav-home-blue.png"
                  : "/icons/nav-home-grey.png"
              }
            />
            Home
          </>
        )}
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? styles.active : "")}
        to="/journey-hub/compare">
        {({ isActive }) => (
          <>
            <img
              src={
                isActive ? "/icons/nav-map-blue.png" : "/icons/nav-map-grey.png"
              }
            />
            Map
          </>
        )}
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? styles.active : "")}
        to="/journey-hub/stations">
        {({ isActive }) => (
          <>
            <img
              src={
                isActive
                  ? "/icons/nav-services-blue.png"
                  : "/icons/nav-services-grey.png"
              }
            />
            Services
          </>
        )}
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? styles.active : "")}
        to="/journey-hub/station-details">
        {({ isActive }) => (
          <>
            <img
              src={
                isActive
                  ? "/icons/nav-price-blue.png"
                  : "/icons/nav-price-grey.png"
              }
            />
            Compare
          </>
        )}
      </NavLink>
    </nav>
  );
}
