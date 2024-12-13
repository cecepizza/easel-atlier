"use client";

import { useEffect } from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // close on keyboard press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      // only add listeners if modal opens
      document.addEventListener("keydown", handleEscape); // add escape key listener
      // prevent scrolling when modal is open
      document.body.style.overflow = "hidden"; // locks scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape); // remove escape key listener
      document.body.style.overflow = "unset"; // unlocks scroll
    };
  }, [isOpen, onClose]); // if dependencies change, re-run effect

  if (!isOpen) return null; // if modal is not open, don't render anything

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* {Backdrop} */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* {Modal Content} */}
      <div className="relative z-10 bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
