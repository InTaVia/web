import type { Renderable } from "react-hot-toast";
import RHT from "react-hot-toast";

const _t = RHT.error;
type ToastId = ReturnType<typeof _t>;

const toastColors = {
	regular: "text-intavia-gray-900 bg-white",
	success: "text-intavia-green-900 bg-intavia-green-50",
	accent: "text-intavia-brand-900 bg-intavia-brand-50",
	warning: "text-intavia-red-900 bg-intavia-red-50",
};

interface FullToastOptions {
	id?: ToastId;
	color: keyof typeof toastColors;
	className: string;
}

const defaultToastOptions: Omit<FullToastOptions, "id"> = {
	color: "regular",
	className: "",
};

export function toast(content: Renderable, options: Partial<FullToastOptions> = {}): ToastId {
	const fullOptions: FullToastOptions = {
		...defaultToastOptions,
		...options,
	};
	const { id, color, className } = fullOptions;
	const classNames = `rounded-lg px-5 py-2.5 shadow-md ${className} ${toastColors[color]}`;

	return RHT.custom(<div className={classNames}>{content}</div>, { id });
}

export function promise<T>(
	promiseValue: Promise<T>,
	{
		loading = "Loading...",
		success = "Success",
		error = "Error",
	}: {
		loading: Renderable;
		success: Renderable;
		error: Renderable;
	},
	options: Partial<Omit<FullToastOptions, "color" | "id">> = {},
): ToastId {
	const id = toast(loading, options);
	void promiseValue
		.then(() => {
			return toast(success, { ...options, id, color: "success" });
		})
		.catch(() => {
			return toast(error, { ...options, id, color: "warning" });
		});

	return id;
}

export function close(id: ToastId) {
	RHT.dismiss(id);
}
