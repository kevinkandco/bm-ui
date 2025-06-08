
import React, { useState } from "react";
import MenuBarIcon from "./MenuBarIcon";
import MenuBarCompanion from "./MenuBarCompanion";

interface MenuBarContainerProps {
  onGetBriefedNow: () => void;
  onUpdateSchedule: () => void;
  onOpenDashboard: () => void;
}

const MenuBarContainer = ({ 
  onGetBriefedNow, 
  onUpdateSchedule, 
  onOpenDashboard 
}: MenuBarContainerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MenuBarIcon onClick={handleToggle} isActive={isOpen} />
      <MenuBarCompanion
        isOpen={isOpen}
        onClose={handleClose}
        onGetBriefedNow={() => {
          onGetBriefedNow();
          handleClose();
        }}
        onUpdateSchedule={() => {
          onUpdateSchedule();
          handleClose();
        }}
        onOpenDashboard={() => {
          onOpenDashboard();
          handleClose();
        }}
      />
    </>
  );
};

export default MenuBarContainer;
