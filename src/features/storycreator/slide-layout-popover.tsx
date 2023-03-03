import type {
	PanelLayout,
	StoryLayout,
	StoryVisOptionData,
} from "@/features/ui/analyse-page-toolbar/layout-popover";
import { layoutOptions, storyLayout } from "@/features/ui/analyse-page-toolbar/layout-popover";
import Button from "@/features/ui/Button";
import Popover from "@/features/ui/Popover";

export interface SlideLayoutButtonProps {
	onLayoutSelected: (layoutKey: PanelLayout) => void;
}

export default function SlideLayoutButton(props: SlideLayoutButtonProps): JSX.Element {
	return (
		<Popover color="accent" size="small" round="pill">
			Slide Layout
			{({ close }) => {
				return (
					<div className="w-90">
						<h3 className="text-lg font-semibold text-intavia-gray-800">Set Your Slide Layout</h3>
						<div className="max-h-54 grid grid-cols-2 gap-1 overflow-y-auto rounded-md p-1 text-gray-800 drop-shadow-2xl">
							{storyLayout.map((option: StoryLayout) => {
								const layout = layoutOptions[option] as StoryVisOptionData;
								return (
									<button
										key={option}
										className="grid grid-cols-[3.6rem_1fr] grid-rows-[1.2rem_2.4rem] gap-1 rounded bg-white p-1 hover:bg-slate-100 active:bg-slate-300"
										onClick={() => {
											props.onLayoutSelected(option);
											close();
										}}
									>
										<svg className="col-1 row-span-full" viewBox="-0.3 -0.3 1.6 1.6">
											{layout.symbol !== undefined && (
												<path
													d={layout.symbol}
													strokeWidth={0.02}
													shapeRendering="crispEdges"
													fill="none"
													stroke="currentColor"
												/>
											)}
											{layout.contentSymbol !== undefined && (
												<path
													d={layout.contentSymbol}
													strokeWidth={0.02}
													shapeRendering="crispEdges"
													fill="rgb(165, 223, 252)"
													stroke="currentColor"
												/>
											)}
										</svg>
										<span className="col-2 row-1 text-left font-semibold">{layout.title}</span>
										<p className="col-2 row-1 text-left font-light">{layout.description ?? ""}</p>
									</button>
								);
							})}
						</div>

						<div className="mt-2 flex">
							<Button
								size="small"
								color="warning"
								round="round"
								onClick={() => {
									return close();
								}}
								className="ml-auto self-end"
							>
								Close
							</Button>
						</div>
					</div>
				);
			}}
		</Popover>
	);
}
