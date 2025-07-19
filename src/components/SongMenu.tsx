import React, { useRef, useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

interface SongMenuProps {
  children: React.ReactNode;
  onOpen?: () => void;
}

const SongMenu: React.FC<SongMenuProps> = ({ children, onOpen }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        className="p-1 hover:bg-gray-700 rounded"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
          if (onOpen) onOpen();
        }}
        title="Song Menu"
      >
        <MoreHorizontal className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-gray-900 rounded shadow-lg z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default SongMenu;
