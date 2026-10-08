import React, { useState, useEffect, useRef, useMemo } from "react";
import { Form, Button } from "react-bootstrap";
import { FaPlus, FaTimes } from "react-icons/fa";
import "../../styles/typeaheadDropdown.css";

/**
 * Typeahead / Autocomplete Searchable Dropdown matching JenixCloud / TPCS Fashion ERP
 *
 * @param {string} value - Current input value
 * @param {function} onChange - Called with (textValue, selectedItemObj)
 * @param {Array<string|object>} options - Array of options (strings or { label, value, code, subtext })
 * @param {string} placeholder - Placeholder text
 * @param {boolean} showAddButton - If true, shows the [+] button attached to the right
 * @param {function} onAdd - Called with (value) when [+] button is clicked or Enter is pressed
 * @param {boolean} clearable - If true, shows [x] clear button when input has text
 * @param {string} size - Input size: "sm" (default) or "md"
 * @param {boolean} disabled - Whether input is disabled
 * @param {string} className - Additional CSS class for container
 * @param {string} dropdownWidth - Width for the dropdown menu (default: "min(550px, max(100%, 320px))")
 * @param {number} maxHeight - Max height of dropdown list in px (default: 240)
 */
export default function TypeaheadDropdown({
  value = "",
  onChange,
  options = [],
  placeholder = "Type and select...",
  showAddButton = false,
  onAdd,
  clearable = true,
  size = "sm",
  disabled = false,
  className = "",
  align = "left",
  onSelect,
  dropdownWidth = "min(520px, max(100%, 360px))",
  maxHeight = 240,
  autoSelectOnEnter = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  // Normalize options to [{ label: string, value: any, code?: string, raw: any }]
  const normalizedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.map((opt) => {
      if (typeof opt === "string" || typeof opt === "number") {
        const str = String(opt);
        return { label: str, value: str, raw: opt };
      }
      if (opt && typeof opt === "object") {
        return {
          label: String(opt.label || opt.name || opt.ItemName || opt.SupplierName || opt.value || ""),
          value: opt.value !== undefined ? opt.value : (opt.id || opt.ItemID || opt.SupplierID || opt.label),
          code: opt.code || opt.ItemCode || opt.SupplierCode || "",
          subtext: opt.subtext || opt.category || opt.Category || "",
          raw: opt
        };
      }
      return { label: "", value: "", raw: opt };
    });
  }, [options]);

  // Filter options based on input value
  const filteredOptions = useMemo(() => {
    const search = (value || "").trim().toLowerCase();
    if (!search) {
      return normalizedOptions;
    }
    return normalizedOptions.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(search);
      const matchCode = opt.code && opt.code.toLowerCase().includes(search);
      const matchSub = opt.subtext && opt.subtext.toLowerCase().includes(search);
      return matchLabel || matchCode || matchSub;
    });
  }, [normalizedOptions, value]);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev < filteredOptions.length - 1 ? prev + 1 : 0;
        scrollIntoView(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev > 0 ? prev - 1 : filteredOptions.length - 1;
        scrollIntoView(next);
        return next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && activeIndex >= 0 && activeIndex < filteredOptions.length) {
        handleSelectOption(filteredOptions[activeIndex]);
      } else if (onAdd) {
        onAdd(value);
        setIsOpen(false);
      } else if (isOpen && filteredOptions.length > 0 && autoSelectOnEnter) {
        handleSelectOption(filteredOptions[0]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const scrollIntoView = (index) => {
    if (!menuRef.current) return;
    const items = menuRef.current.querySelectorAll(".typeahead-item");
    if (items[index]) {
      items[index].scrollIntoView({ block: "nearest" });
    }
  };

  const handleSelectOption = (opt) => {
    if (onChange) {
      onChange(opt.label, opt.raw || opt);
    }
    if (onSelect) {
      onSelect(opt.raw || opt, opt.label);
    }
    setIsOpen(false);
    setActiveIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (onChange) {
      onChange(val, null);
    }
    if (!isOpen) {
      setIsOpen(true);
    }
    setActiveIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange("", null);
    }
    setIsOpen(true);
    setActiveIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    if (onAdd) {
      onAdd((value || "").trim());
    }
    setIsOpen(false);
  };

  return (
    <div className={`typeahead-container ${className}`} ref={containerRef}>
      <div className="typeahead-input-group">
        <Form.Control
          ref={inputRef}
          size={size}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="typeahead-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
        />

        {clearable && value && !disabled && (
          <button
            type="button"
            className={`typeahead-clear-btn ${!showAddButton ? "no-add-btn" : ""}`}
            onClick={handleClear}
            title="Clear"
          >
            <FaTimes />
          </button>
        )}

        {showAddButton && (
          <Button
            variant="outline-secondary"
            size={size}
            className="typeahead-btn-add"
            onClick={handleAddClick}
            disabled={disabled}
            title="Add to list"
          >
            <FaPlus />
          </Button>
        )}
      </div>

      {isOpen && !disabled && (
        <ul
          className="typeahead-menu"
          ref={menuRef}
          style={{
            width: dropdownWidth,
            maxHeight: `${maxHeight}px`,
            left: align === "right" ? "auto" : 0,
            right: align === "right" ? 0 : "auto"
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <li
                key={`${opt.value}_${idx}`}
                className={`typeahead-item ${idx === activeIndex ? "active" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevents blur before click
                  handleSelectOption(opt);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className="text-truncate">
                  <span>{opt.label}</span>
                  {opt.subtext && (
                    <span className="small text-muted ms-1" style={{ fontSize: "10.5px" }}>
                      ({opt.subtext})
                    </span>
                  )}
                </div>
                {opt.code && !opt.label.includes(opt.code) && (
                  <span className="typeahead-item-code">[{opt.code}]</span>
                )}
              </li>
            ))
          ) : (
            <li className="typeahead-empty">
              No matching records found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
