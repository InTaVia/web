import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import type { ChangeEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectZoomToTimeRange, setZoomToTimeRange } from '@/features/timeline/timeline.slice';

export function ZoomRangeToggle(): JSX.Element {
  const dispatch = useAppDispatch();
  const zoomToTimeRange = useAppSelector(selectZoomToTimeRange);

  function onZoomToDataChange(event: ChangeEvent<HTMLInputElement>, checked: boolean) {
    dispatch(setZoomToTimeRange(checked));
  }

  return (
    <Box sx={{ padding: 2 }}>
      <FormControlLabel
        control={<Switch checked={zoomToTimeRange} onChange={onZoomToDataChange} />}
        label="Zoom to data time range"
      />
    </Box>
  );
}
