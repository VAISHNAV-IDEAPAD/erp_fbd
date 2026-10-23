import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { searchScreens, getPopularScreens } from "../../config/screensRegistry";
import "../../styles/search.css";

export default function ScreenSearchBar({ autoFocus = false, onNavigate }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Compute matched screens or popular screens
  const hasQuery = query.trim().length > 0;
  const filteredScreens = hasQuery ? searchScreens(query) : getPopularScreens();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(filteredScreens.length > 0 ? 0 : -1);
  }, [query]);

  // Navigate to target screen
  const handleSelectScreen = (screen) => {
    if (!screen || !screen.path) return;
    setIsOpen(false);
    setQuery("");
    navigate(screen.path);
    if (onNavigate) onNavigate(screen);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredScreens.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredScreens.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredScreens.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredScreens.length) % filteredScreens.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredScreens.length > 0) {
        const target = selectedIndex >= 0 && selectedIndex < filteredScreens.length
          ? filteredScreens[selectedIndex]
          : filteredScreens[0];
        handleSelectScreen(target);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Trigger search on button click
  const handleButtonClick = () => {
    if (hasQuery && filteredScreens.length > 0) {
      handleSelectScreen(filteredScreens[0]);
    } else {
      inputRef.current?.focus();
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
    setIsOpen(true);
  };

  // Helper for badge CSS
  const getBadgeClass = (module) => {
    switch (module?.toUpperCase()) {
      case "PM":
        return "screen-badge-pm";
      case "MM":
        return "screen-badge-mm";
      case "SM":
        return "screen-badge-sm";
      case "ADMIN":
        return "screen-badge-admin";
      case "EXPORTS":
        return "screen-badge-exports";
      case "FM":
        return "screen-badge-fm";
      case "REPORTS":
        return "screen-badge-reports";
      default:
        return "screen-badge-default";
    }
  };

  // Highlight query text inside title
  const renderHighlightedTitle = (title, matchText) => {
    if (!matchText || !matchText.trim()) return title;
    const trimmed = matchText.trim();
    const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = title.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === trimmed.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="screen-search-wrapper" ref={containerRef}>
      {/* Pill Search Box matching screenshot */}
      <div className={`screen-search-box ${isOpen ? "has-focus" : ""}`}>
        <input
          ref={inputRef}
          type="text"
          className="screen-search-input"
          placeholder="Search screen..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck="false"
        />

        {hasQuery && (
          <button
            type="button"
            className="screen-search-clear-btn"
            onClick={handleClear}
            title="Clear search"
          >
            <FaTimes />
          </button>
        )}

        <button
          type="button"
          className="screen-search-submit-btn"
          onClick={handleButtonClick}
          title="Search screen"
        >
          <FaSearch style={{ fontSize: "12.5px" }} />
        </button>
      </div>

      {/* Dropdown with search results / quick recommendations */}
      {isOpen && (
        <div className="screen-search-dropdown">
          <div className="screen-search-header">
            <span>
              {hasQuery
                ? `Matching Screens (${filteredScreens.length})`
                : "Popular Screens / Quick Jump"}
            </span>
            {hasQuery && (
              <span style={{ fontSize: "11px", fontWeight: 400, textTransform: "none", color: "#94a3b8" }}>
                Press Enter to open
              </span>
            )}
          </div>

          {filteredScreens.length === 0 ? (
            <div className="screen-search-empty">
              <div className="screen-search-empty-icon">🔍</div>
              <div>No screens found matching "<strong>{query}</strong>"</div>
              <div style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "4px" }}>
                Try searching for "GRN", "Subcontract", "Indent", "Order", "Email", etc.
              </div>
            </div>
          ) : (
            filteredScreens.map((screen, idx) => (
              <div
                key={screen.id}
                className={`screen-search-item ${idx === selectedIndex ? "is-selected" : ""}`}
                onClick={() => handleSelectScreen(screen)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <span className={`screen-search-badge ${getBadgeClass(screen.module)}`}>
                  {screen.module}
                </span>

                <div className="screen-search-details">
                  <div className="screen-search-title">
                    {renderHighlightedTitle(screen.title, query)}
                  </div>
                  <div className="screen-search-category">
                    {screen.module} › {screen.category} &bull; <span style={{ fontFamily: "monospace", opacity: 0.85 }}>{screen.path}</span>
                  </div>
                </div>

                <span className="screen-search-chevron">›</span>
              </div>
            ))
          )}

          <div className="screen-search-footer">
            <span>Use ↑↓ arrows to navigate</span>
            <span>ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
