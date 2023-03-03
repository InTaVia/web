import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import type { StoryAnswerList, StoryQuizAnswer } from "@/features/storycreator/contentPane.slice";
import { Input, Button } from "@intavia/ui";

interface StoryQuizAnswerListProps {
	answerList: StoryAnswerList;
	setAnswerListForQuiz: (answers: any) => void;
}

export function StoryQuizAnswerList(props: StoryQuizAnswerListProps): JSX.Element {
	const { answerList, setAnswerListForQuiz } = props;

	const [answers, setAnswers] = useState([...answerList.answers]);

	const onChange = (event: any) => {
		const newAnswers = [...answers];
		const index = parseInt(event.target.name);

		const newAnswer = { ...newAnswers[index] } as StoryQuizAnswer;

		switch (event.target.type) {
			case "checkbox":
				newAnswer.correct = event.target.checked;
				break;
			case "text":
				newAnswer.text = event.target.value;
				break;
			default:
				break;
		}

		newAnswers[index] = newAnswer;
		setAnswers(newAnswers);
		setAnswerListForQuiz(newAnswers);
	};

	const addAnswer = () => {
		// eslint-disable-next-line prefer-const
		let newAnswers = [...answers];
		newAnswers.push({ text: "...", correct: false });
		setAnswers(newAnswers);
		setAnswerListForQuiz(newAnswers);
	};

	const deleteAnswer = (index: number) => {
		// eslint-disable-next-line prefer-const
		let newAnswers = [...answers];
		newAnswers.splice(index, 1);
		setAnswers(newAnswers);
		setAnswerListForQuiz(newAnswers);
	};

	return (
		<div className="grid grid-cols-1 gap-2">
			{answers.map((answer, index: number) => {
				return (
					<div
						style={{ display: "flex" }}
						className="grid grid-cols-[10px,auto,auto] gap-2"
						key={`option${index}`}
					>
						<input
							type="checkbox"
							key={`answer${index + 1}Checkbox`}
							id={`answer${index + 1}Checkbox`}
							name={`${index}`}
							checked={answer.correct}
							onChange={onChange}
						/>
						<Input
							key={`answer${index + 1}`}
							id={`answer${index + 1}`}
							name={`${index}`}
							value={answer.text}
							onChange={onChange}
							className="w-full"
						/>
						<div className="flex items-center">
							<Button
								key={`answer${index + 1}Delete`}
								onClick={() => {
									deleteAnswer(index);
								}}
							>
								<TrashIcon className="h-4 w-4" />
							</Button>
						</div>
					</div>
				);
			})}
			<div className="flex justify-center">
				<Button onClick={addAnswer}>Add Answer</Button>
			</div>
		</div>
	);
}
