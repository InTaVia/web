import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store";

export interface UiWindow {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

export type ComponentName = "dcl" | "stc" | "vas";
export type PaneOrientation = "left" | "right";
export type ModalName = "visualQueryModal";

interface UiState {
	windows: Array<UiWindow>;
	components: {
		dcl: {
			leftPaneOpen: boolean;
			rightPaneOpen: boolean;
		};
		vas: {
			leftPaneOpen: boolean;
			rightPaneOpen: boolean;
		};
		stc: {
			leftPaneOpen: boolean;
			rightPaneOpen: boolean;
		};
	};
	modals: {
		visualQueryModal: {
			isOpen: boolean;
		};
	};
}

const initialState: UiState = {
	windows: [],
	components: {
		dcl: {
			leftPaneOpen: true,
			rightPaneOpen: true,
		},
		vas: {
			leftPaneOpen: true,
			rightPaneOpen: false,
		},
		stc: {
			leftPaneOpen: true,
			rightPaneOpen: true,
		},
	},
	modals: {
		visualQueryModal: {
			isOpen: false,
		},
	},
};

export const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		addWindow: (state, action: PayloadAction<UiWindow>) => {
			const window = action.payload;
			const i = "gridWindow" + state.windows.length;
			state.windows.push({ ...window, i });
		},
		removeWindow: (state, action: PayloadAction<UiWindow>) => {
			const window = action.payload;
			state.windows = state.windows.filter((w) => {
				return w.i !== window.i;
			});
		},
		editWindow: (state, action: PayloadAction<UiWindow>) => {
			const window = action.payload;
			const index = state.windows.findIndex((w) => {
				return w.i === window.i;
			});
			if (index !== -1) {
				state.windows[index] = window;
			}
		},
		setSidePane: (
			state,
			action: PayloadAction<{
				component: ComponentName;
				paneOrientation: PaneOrientation;
				isOpen: boolean;
			}>,
		) => {
			if (Object.prototype.hasOwnProperty.call(state.components, action.payload.component)) {
				if (action.payload.paneOrientation === "left") {
					state.components[action.payload.component].leftPaneOpen = action.payload.isOpen;
				} else {
					state.components[action.payload.component].rightPaneOpen = action.payload.isOpen;
				}
			}
		},
		setModal: (state, action: PayloadAction<{ modal: ModalName; isOpen: boolean }>) => {
			state.modals[action.payload.modal].isOpen = action.payload.isOpen;
		},
	},
});

export const { addWindow, editWindow, removeWindow, setSidePane, setModal } = uiSlice.actions;

export function selectWindows(state: RootState): Array<UiWindow> {
	return state.ui.windows;
}

export const selectPaneOpen = createSelector(
	(state: RootState) => {
		return state.ui;
	},
	(state: RootState, component: ComponentName) => {
		return component;
	},
	(state: RootState, component: ComponentName, orientation: PaneOrientation) => {
		return orientation;
	},
	(uiState, component, orientation) => {
		if (Object.prototype.hasOwnProperty.call(uiState.components, component)) {
			if (orientation === "left") {
				return uiState.components[component].leftPaneOpen;
			} else {
				return uiState.components[component].rightPaneOpen;
			}
		} else {
			console.error("You provided a not accepted.");
			return false;
		}
	},
);

export const selectModalOpen = createSelector(
	(state: RootState) => {
		return state.ui;
	},
	(state: RootState, modal: ModalName) => {
		return modal;
	},
	(uiState, modal) => {
		return uiState.modals[modal].isOpen;
	},
);

export default uiSlice.reducer;
