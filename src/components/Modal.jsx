import React from "react";
import { IoCloseOutline } from "react-icons/io5";

const Modal = ({ children, visible, onClose }) => {
  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };
  if (!visible) return null;

  return (
    <div id="container" onClick={handleOnClose} className="fixed inset-0 bg-safe-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-safe-white p-4 w-[80%] md:w-[60%] lg:w-[50%] xl:w-[25%] rounded-2xl">
        <div className="flex justify-end">
          <IoCloseOutline onClick={onClose} className="h-8 w-8 text-primary-gray cursor-pointer transition hover:text-primary-green active:text-secondary-green" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
