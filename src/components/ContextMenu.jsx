import {useRef, useEffect } from "react";

const ContextMenu = ({ isOpen, onToggle, onEdit, onRun, onDelete, onStatistics }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onToggle(null);
      }
    };
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="absolute top-2 right-1" ref={menuRef}>
      <div className="relative">
      <button
        onClick={onToggle}
        className="text-xl font-bold w-4 text-center hover:bg-gray-200 rounded-full"
      >
        &#8942;
      </button>

      {isOpen && (
        <div className="absolute right-2 top-6 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-lg">
          <button
            className="block w-full text-left px-4 py-1 hover:bg-gray-100"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="block w-full text-left px-4 py-1 hover:bg-gray-100"
            onClick={onRun}
          >
            Run
          </button>
          <button
            className="block w-full text-left px-4 py-1 hover:bg-gray-100"
            onClick={onStatistics}
          >
            Statistics
          </button>
          <button
            className="block w-full text-left px-4 py-1 hover:bg-red-100 text-red-600"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default ContextMenu;
