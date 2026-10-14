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
            className="erp-logo d-flex align-items-center"
            onClick={closeMenu}
            style={{ textDecoration: "none" }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 100 100"
              style={{ marginRight: "8px", fill: "none", stroke: "#60a5fa", strokeWidth: "5" }}
            >
              <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(30 50 50)" />
              <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(-30 50 50)" />
              <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(90 50 50)" />
              <circle cx="50" cy="50" r="5" fill="#ffffff" stroke="none" />
              <circle cx="16" cy="30" r="4" fill="#93c5fd" stroke="none" />
              <circle cx="84" cy="70" r="4" fill="#93c5fd" stroke="none" />
              <circle cx="50" cy="8" r="4" fill="#93c5fd" stroke="none" />
            </svg>
            <span style={{ fontWeight: 800, letterSpacing: "-0.5px", color: "#ffffff", fontSize: "20px" }}>TPCS</span>
            <span style={{ fontWeight: 400, color: "#ffffff", fontSize: "20px" }}>Fashion</span>
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
              <span className="fw-bold" style={{ fontSize: "0.82rem", lineHeight: 1.2 }}>Plot No. 30</span>
              <span style={{ fontSize: "0.68rem", opacity: 0.85 }}>FY 01-Apr-2026 - 31-Mar-2027</span>
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
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "13px"
              }}
            >
              9
            </button>

          </div>

        </Container>
      </Navbar>

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