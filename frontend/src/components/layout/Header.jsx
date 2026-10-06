import { useEffect, useRef, useState } from "react";
import { Navbar, Container } from "react-bootstrap";
import {
  FaBell,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

import MegaMenu from "./MegaMenu";
import "../../styles/header.css";

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);

  const headerRef = useRef(null);
  const location = useLocation();

  // =========================================
  // TOGGLE TOP MENU
  // =========================================

  const toggleMenu = (menu) => {
    setActiveMenu((previous) =>
      previous === menu ? null : menu
    );
  };

  // =========================================
  // CLOSE MENU
  // =========================================

  const closeMenu = () => {
    setActiveMenu(null);
  };

  // =========================================
  // CLOSE MENU AFTER ROUTE CHANGE
  // =========================================

  useEffect(() => {
    setActiveMenu(null);
  }, [location.pathname]);

  // =========================================
  // CLOSE WHEN CLICKING OUTSIDE
  // =========================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="erp-header-wrapper"
    >

      {/* =====================================
          BLUE TOP HEADER
      ====================================== */}

      <Navbar className="erp-header">
        <Container fluid>

          {/* ERP NAME */}

          <Navbar.Brand
            href="/"
            className="erp-logo"
            onClick={closeMenu}
          >
            ERP Fashion
          </Navbar.Brand>


          {/* TOP NAVIGATION */}

          <div className="erp-nav-menu">

            {/* SM */}

            <button
              type="button"
              className={`erp-nav-item ${
                activeMenu === "SM"
                  ? "erp-nav-active"
                  : ""
              }`}
              onClick={() => toggleMenu("SM")}
            >
              <span>SM</span>
              <FaChevronDown />
            </button>


            {/* MM */}

            <button
              type="button"
              className={`erp-nav-item ${
                activeMenu === "MM"
                  ? "erp-nav-active"
                  : ""
              }`}
              onClick={() => toggleMenu("MM")}
            >
              <span>MM</span>
              <FaChevronDown />
            </button>


            {/* PM */}

            <button
              type="button"
              className={`erp-nav-item ${
                activeMenu === "PM"
                  ? "erp-nav-active"
                  : ""
              }`}
              onClick={() => toggleMenu("PM")}
            >
              <span>PM</span>
              <FaChevronDown />
            </button>

            {/* EXPORTS */}

            <button
              type="button"
              className="erp-nav-item"
              onClick={() => toggleMenu("EXPORTS")}
            >
              <span>EXPORTS</span>
              <FaChevronDown />
            </button>

            {/* FM */}

            <button
              type="button"
              className="erp-nav-item"
              onClick={() => toggleMenu("FM")}
            >
              <span>FM</span>
              <FaChevronDown />
            </button>

            {/* ADMIN */}

            <button
              type="button"
              className={`erp-nav-item ${
                activeMenu === "ADMIN"
                  ? "erp-nav-active"
                  : ""
              }`}
              onClick={() => toggleMenu("ADMIN")}
            >
              <span>ADMIN</span>
              <FaChevronDown />
            </button>

            {/* NEW */}

            <button
              type="button"
              className="erp-nav-item"
              onClick={() => toggleMenu("NEW")}
            >
              <span>NEW</span>
              <FaChevronDown />
            </button>

            {/* RECENT */}

            <button
              type="button"
              className="erp-nav-item"
              onClick={() => toggleMenu("RECENT")}
            >
              <span>RECENT</span>
              <FaChevronDown />
            </button>

            {/* REPORTS */}

            <button
              type="button"
              className={`erp-nav-item ${
                activeMenu === "REPORTS"
                  ? "erp-nav-active"
                  : ""
              }`}
              onClick={() => toggleMenu("REPORTS")}
            >
              <span>REPORTS</span>
              <FaChevronDown />
            </button>

          </div>


          {/* RIGHT SIDE ICONS & BRANCH */}

          <div className="erp-header-icons d-flex align-items-center">

            <div className="d-none d-md-flex flex-column text-end me-3 text-white">
              <span className="fw-bold" style={{ fontSize: "0.82rem", lineHeight: 1.2 }}>Plot No. 9B</span>
              <span style={{ fontSize: "0.68rem", opacity: 0.85 }}>01-Apr-2026 - 31-Mar-2027</span>
            </div>

            <div className="position-relative me-2">
              <button
                type="button"
                className="erp-icon-btn"
                title="Notifications"
                onClick={closeMenu}
              >
                <FaBell />
              </button>
              <span className="badge rounded-circle bg-white text-primary position-absolute top-0 start-100 translate-middle shadow-sm" style={{ fontSize: "0.62rem", padding: "3px 5px", transform: "translate(-30%, -10%)" }}>
                9
              </span>
            </div>

            <button
              type="button"
              className="erp-icon-btn"
              title="Profile"
              onClick={closeMenu}
            >
              <FaUserCircle />
            </button>

          </div>

        </Container>
      </Navbar>


      {/* =====================================
          SEARCH BAR
      ====================================== */}

      <div className="erp-search-wrapper">

        <div className="erp-search-box">

          <span className="erp-search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search Menu..."
            className="erp-search-input"
          />

        </div>

      </div>


      {/* =====================================
          MEGA MENU
      ====================================== */}

      {activeMenu && (
        <MegaMenu
          activeMenu={activeMenu}
          closeMenu={closeMenu}
        />
      )}

    </header>
  );
}