import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';

import { useAppDispatch } from '../common/store';
import type { TextConstraint } from './visualQuerying.slice';
import { updateText } from './visualQuerying.slice';

interface TextConstraintProps {
  idx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  constraint: TextConstraint;
}

export function TextConstraintView(props: TextConstraintProps): JSX.Element {
  const { x, y, width, height, constraint } = props;

  const dispatch = useAppDispatch();

  const [text, setText] = useState(constraint.text);

  const dimensions = {
    x: x,
    y: y,
    marginTop: height - 32,
    marginLeft: 50,
    width: width,
    height: height,
    boundedWidth: width - 50,
    boundedHeight: height - 100,
  };

  function handleClick() {
    dispatch(
      updateText({
        id: constraint.id,
        text: text,
      }),
    );
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        fill="white"
        stroke="blue"
        strokeWidth={1}
        x="0"
        y="0"
        width={dimensions.width}
        height={dimensions.height}
      />
      <foreignObject width={dimensions.width} height={dimensions.height}>
        <Box autoComplete="off" component="form" name="text_constraint" noValidate>
          <TextField
            label={constraint.type}
            variant="standard"
            value={text}
            onChange={(evt) => {
              return setText(evt.target.value);
            }}
          />
          <Button onClick={handleClick}>Add</Button>
        </Box>
      </foreignObject>
    </g>
  );
}
