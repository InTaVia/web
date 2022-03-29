import { useState } from 'react';

export function useDrawerState() {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function toggle() {
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
