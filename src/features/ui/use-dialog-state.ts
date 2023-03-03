import { useState } from "react";

interface UseDialogStateResult {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

export function useDialogState(): UseDialogStateResult {
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
