import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@intavia/ui";
import { useState } from "react";

import { ButtonRow } from "@/features/storycreator/ButtonRow";
import styles from "@/features/storycreator/storycreator.module.css";
import type { Story } from "@/features/storycreator/storycreator.slice";
import { StoryGUICreator } from "@/features/storycreator/StoryGUICreator";
import { StoryTextCreator } from "@/features/storycreator/StoryTextCreator";

interface StoryCreatorProps {
	story: Story;
}

export function StoryCreator(props: StoryCreatorProps): JSX.Element {
	const { story } = props;

	const [textMode, setTextMode] = useState(false);

	function toggleTextMode(): void {
		setTextMode(!textMode);
	}

	return (
		<div className={styles["story-editor-wrapper"]}>
			<div className={styles["story-editor-header"]}>
				<div className={styles["story-editor-headline"]}>{story.title}</div>
				<ButtonRow style={{ position: "absolute", top: 0, right: 0 }}>
					<div className={styles["button-row-button"]}>
						<IconButton label="Toggle text mode" onClick={toggleTextMode}>
							<DocumentTextIcon />
						</IconButton>
					</div>
				</ButtonRow>
			</div>
			<div className={styles["story-editor-content"]}>
				{textMode ? <StoryTextCreator story={story} /> : <StoryGUICreator story={story} />}
			</div>
		</div>
	);
}
