import React, { useEffect, useRef, useState } from "react";
import { Navbar, Container } from "react-bootstrap";
import { FaBell, FaCaretDown } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import MegaMenu from "./MegaMenu";
import "../../styles/header.css";

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuLeft, setMenuLeft] = useState(210);

  const headerRef = useRef(null);
  const navItemRefs = useRef({});
  const timeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");

  // Load the active company shown beside the notification bell
  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${process.env.REACT_APP_API_URL || "/api"}/companies`)
      .then((res) => {
        const list = res.data?.data || res.data || [];
        if (!Array.isArray(list) || cancelled) return;
        const active = list.find((c) => c.Status === "Active") || list[0];
        if (active) setCompanyName(active.CompanyName || active.CompanyCode || "");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Compute button position
  const computeOffset = (menuName) => {
    const el = navItemRefs.current[menuName];
    if (el && headerRef.current) {
      const elRect = el.getBoundingClientRect();
      const headerRect = headerRef.current.getBoundingClientRect();
      setMenuLeft(Math.max(16, elRect.left - headerRect.left));
    }
  };

  // Toggle on click
  const toggleMenu = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      computeOffset(menu);
      setActiveMenu(menu);
    }
  };

  // Hover to open
  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    computeOffset(menu);
    setActiveMenu(menu);
  };

  // Graceful close on mouse leave with small delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 220);
  };

  const handleMenuEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(null);
  };

  // Close menu after route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header
      ref={headerRef}
      className="erp-header-wrapper"
      onMouseLeave={handleMouseLeave}
    >
      {/* =====================================
          BLUE TOP HEADER (V-CONNECT INC. REPLICA)
      ====================================== */}
      <Navbar className="erp-header">
        <Container fluid>

          {/* V-CONNECT INC. BRAND LOGO */}
          <Navbar.Brand
            href="/"
            className="erp-logo d-flex align-items-center"
            onClick={closeMenu}
            style={{ textDecoration: "none" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 100 100"
              style={{ marginRight: "7px", fill: "none", stroke: "#38bdf8", strokeWidth: "4.5" }}
            >
              <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(30 50 50)" />
              <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(-30 50 50)" />
              <ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(90 50 50)" />
              <circle cx="50" cy="50" r="4.5" fill="#38bdf8" stroke="none" />
              <circle cx="15" cy="30" r="3.5" fill="#38bdf8" stroke="none" />
              <circle cx="85" cy="70" r="3.5" fill="#38bdf8" stroke="none" />
              <circle cx="50" cy="8" r="3.5" fill="#38bdf8" stroke="none" />
            </svg>
            <span style={{ fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.5px", color: "#38bdf8", fontSize: "21px" }}>V-Connect</span>
            <span style={{ fontWeight: 400, color: "#ffffff", fontSize: "21px", marginLeft: "1px" }}>Inc.</span>
          </Navbar.Brand>

          {/* TOP NAVIGATION TABS */}
          <div className="erp-nav-menu">

            {/* SM */}
            <button
              ref={(el) => (navItemRefs.current["SM"] = el)}
              type="button"
              className={`erp-nav-item ${activeMenu === "SM" ? "erp-nav-active" : ""}`}
              onClick={() => toggleMenu("SM")}
              onMouseEnter={() => handleMouseEnter("SM")}
            >
              <span>SM</span>
              <FaCaretDown style={{ fontSize: "11px", marginLeft: "3px" }} />
            </button>

            {/* MM */}
            <button
              ref={(el) => (navItemRefs.current["MM"] = el)}
              type="button"
              className={`erp-nav-item ${activeMenu === "MM" ? "erp-nav-active" : ""}`}
              onClick={() => toggleMenu("MM")}
              onMouseEnter={() => handleMouseEnter("MM")}
            >
              <span>MM</span>
              <FaCaretDown style={{ fontSize: "11px", marginLeft: "3px" }} />
            </button>

            {/* PM (PRODUCTION MANAGEMENT) */}
            <button
              ref={(el) => (navItemRefs.current["PM"] = el)}
              type="button"
              className={`erp-nav-item ${activeMenu === "PM" ? "erp-nav-active" : ""}`}
              onClick={() => toggleMenu("PM")}
              onMouseEnter={() => handleMouseEnter("PM")}
            >
              <span>PM</span>
              <FaCaretDown style={{ fontSize: "11px", marginLeft: "3px" }} />
            </button>

            {/* EXPORTS */}
            <button
              ref={(el) => (navItemRefs.current["EXPORTS"] = el)}
              type="button"
              className={`erp-nav-item ${activeMenu === "EXPORTS" ? "erp-nav-active" : ""}`}
              onClick={() => toggleMenu("EXPORTS")}
              onMouseEnter={() => handleMouseEnter("EXPORTS")}
            >
              <span>EXPORTS</span>
              <FaCaretDown style={{ fontSize: "11px", marginLeft: "3px" }} />
            </button>

            {/* FM */}
            <button
              ref={(el) => (navItemRefs.current["FM"] = el)}
              type="button"
              className={`erp-nav-item ${activeMenu === "FM" ? "erp-nav-active" : ""}`}
              onClick={() => toggleMenu("FM")}
              onMouseEnter={() => handleMouseEnter("FM")}
            >
              <span>FM</span>
              <FaCaretDown style={{ fontSize: "11px", marginLeft: "3px" }} />
            </button>

            {/* ADMIN */}
            <button
              ref={(el) => (navItemRefs.current["ADMIN"] = el)}
              type="button"
              className={`erp-nav-item ${activeMenu === "ADMIN" ? "erp-nav-active" : ""}`}
              onClick={() => toggleMenu("ADMIN")}
              onMouseEnter={() => handleMouseEnter("ADMIN")}
            >
              <span>ADMIN</span>
              <FaCaretDown style={{ fontSize: "11px", marginLeft: "3px" }} />
            </button>

            {/* NEW */}
            <button
              ref={(el) => (navItemRefs.current["NEW"] = el)}
              type="button"
              className={`erp-nav-item ${activeMenu === "NEW" ? "erp-nav-active" : ""}`}
              onClick={() => toggleMenu("NEW")}
              onMouseEnter={() => handleMouseEnter("NEW")}
            >
              <span>NEW</span>
              <FaCaretDown style={{ fontSize: "11px", marginLeft: "3px" }} />
            </button>

            {/* RECENT */}
            <button
              ref={(el) => (navItemRefs.current["RECENT"] = el)}
              type="button"
              className={`erp-nav-item ${activeMenu === "RECENT" ? "erp-nav-active" : ""}`}
              onClick={() => toggleMenu("RECENT")}
              onMouseEnter={() => handleMouseEnter("RECENT")}
            >
              <span>RECENT</span>
              <FaCaretDown style={{ fontSize: "11px", marginLeft: "3px" }} />
            </button>

            {/* REPORTS */}
            <button
              ref={(el) => (navItemRefs.current["REPORTS"] = el)}
              type="button"
              className={`erp-nav-item ${location.pathname === "/reports" ? "erp-nav-active" : ""}`}
              onClick={() => {
                closeMenu();
                navigate("/reports");
              }}
              onMouseEnter={() => {
                closeMenu();
              }}
            >
              <span>REPORTS</span>
            </button>

          </div>

          {/* RIGHT SIDE BADGES & USER AVATAR */}
          <div className="erp-header-icons d-flex align-items-center">

            <div className="d-none d-md-flex flex-column text-end me-3 text-white">
              <span className="fw-bold" style={{ fontSize: "0.82rem", lineHeight: 1.2 }}>Plot No. 9B</span>
              <span style={{ fontSize: "0.68rem", opacity: 0.85 }}>FY 01-Apr-2026 - 31-Mar-2027</span>
            </div>

            {companyName && (
              <span
                className="fw-bold text-white me-3 d-none d-md-inline-block"
                title="Company"
                style={{
                  fontSize: "0.85rem",
                  padding: "2px 10px",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.18)",
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap"
                }}
              >
                {companyName}
              </span>
            )}

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
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "12px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              9
            </button>

          </div>

        </Container>
      </Navbar>

      {/* =====================================
          MEGA MENU DROPDOWN (CONNECTED UNDER ACTIVE TAB)
      ====================================== */}
      {activeMenu && (
        <MegaMenu
          activeMenu={activeMenu}
          closeMenu={closeMenu}
          leftOffset={menuLeft}
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}

    </header>
  );
}