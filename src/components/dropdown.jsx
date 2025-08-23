// dropdown.jsx (make sure this file extension is .jsx)
import React, { useState, useRef, useEffect } from "react";

function Dropdown({ buttonContent, dropdownContent }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((prev) => !prev)}>
        {buttonContent}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          {dropdownContent}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
