const vienna = {
	longitude: 16.3738,
	latitude: 48.2082,
};

export const mapStyle = {
	positron: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

export const base = {
	initialViewState: {
		...vienna,
		zoom: 4,
	},
	mapStyle: mapStyle.positron,
};
