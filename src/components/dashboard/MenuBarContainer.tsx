import React, { useState } from "react";
import MenuBarIcon from "./MenuBarIcon";
import MenuBarCompanion from "./MenuBarCompanion";

interface MenuBarContainerProps {
  onGetBriefedNow: () => void;
  onUpdateSchedule: () => void;
  onOpenDashboard: () => void;
}

type StatusType = "active" | "offline" | "dnd";

const MenuBarContainer = ({ 
  onGetBriefedNow, 
  onUpdateSchedule, 
  onOpenDashboard 
}: MenuBarContainerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<StatusType>("active");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleStatusChange = (newStatus: StatusType) => {
    setStatus(newStatus);
  };

  return (
    <>
      <MenuBarIcon 
        onToggleMenu={handleToggle} 
        onStatusChange={handleStatusChange}
        currentStatus={status}
        isMenuOpen={isOpen}
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
