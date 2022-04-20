import { styled } from '@mui/material/styles';
import type { TooltipProps } from '@mui/material/Tooltip';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Fragment, useState } from 'react';

import { PersonTooltipContents } from '@/features/timeline/PersonTooltipContents';
import type { TimelineElementProps } from '@/features/timeline/TimelineElement';

interface _TimelineElementTooltipProps {
  children: TooltipProps['children'];
}

type TimelineElementTooltipProps = _TimelineElementTooltipProps &
  JSX.IntrinsicAttributes &
  TimelineElementProps;

export function TimelineElementTooltip(props: TimelineElementTooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(<Fragment />);
  const [initialized, setInitialized] = useState(false);

  const { person } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    if (!initialized) {
      const content = (
        <Fragment>
          <PersonTooltipContents person={person} />
        </Fragment>
      );
      setTooltipContent(content);
      setInitialized(true);
    }

    setOpen(true);
  };

  return (
    <CustomTooltip
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      followCursor={true}
      enterDelay={500}
      leaveDelay={100}
      title={tooltipContent}
    >
      {props.children}
    </CustomTooltip>
  );
}

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => {
  return <Tooltip {...props} classes={{ popper: className }} />;
})(({ theme }) => {
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 500,
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, .87)',
      boxShadow: theme.shadows[1],
      border: '1px solid hsl(0, 0%, 80%)',
    },
  };
});
