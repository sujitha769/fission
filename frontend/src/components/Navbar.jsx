import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className={`navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-left ${isMenuOpen ? "active" : ""}`}>
          <Link to="/events" onClick={closeMenu}>Events</Link>
          <Link to="/create" onClick={closeMenu}>Create Event</Link>
          <Link to="/profile" onClick={closeMenu}>My Events</Link>
        </div>

        <div className="nav-right">
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </>
  );
}

export default Navbar;