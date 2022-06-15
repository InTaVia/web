import { Button, Paper, TextField } from '@mui/material';
import { useState } from 'react';

import { useAppDispatch } from '@/app/store';
import type { Origin } from '@/features/visual-querying/Origin';
import type { TextConstraint } from '@/features/visual-querying/visualQuerying.slice';
import { updateText } from '@/features/visual-querying/visualQuerying.slice';

interface TextConstraintProps {
  idx: number;
  x: number;
  y: number;
  width: number;
  height: number;
  constraint: TextConstraint;
  origin: Origin;
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
    <foreignObject width={dimensions.width} height={dimensions.height} x={x} y={y}>
      <Paper
        elevation={3}
        sx={{
          margin: '2px',
          width: dimensions.width - 4,
          height: dimensions.height - 4,
          padding: '8px',
        }}
      >
        <TextField
          label={constraint.type}
          variant="standard"
          value={text}
          onChange={(evt) => {
            return setText(evt.target.value);
          }}
        />
        <Button onClick={handleClick}>Add</Button>
      </Paper>
    </foreignObject>
  );
}
