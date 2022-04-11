import Paper from '@mui/material/Paper';
import type { TooltipProps } from '@mui/material/Tooltip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { timeFormat } from 'd3-time-format';
import { Fragment, useState } from 'react';

import { useGetPlaceByIdQuery } from '@/features/common/intavia-api.service';
import type { TimelineElementProps } from '@/features/timeline/TimelineElement';

interface _TimelineElementTooltipProps {
  children: TooltipProps['children'];
}

type TimelineElementTooltipProps = _TimelineElementTooltipProps &
  JSX.IntrinsicAttributes &
  TimelineElementProps;

const dateFmt = timeFormat('%B %_d, %Y');

export function TimelineElementTooltip(props: TimelineElementTooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(<Fragment />);
  const [initialized, setInitialized] = useState(false);
  // XXX
  const _searchResults = useGetPlaceByIdQuery({ id: '414bbe3e-f4b6-4684-a0a1-248ada189850' });

  const { person } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    if (!initialized) {
      // TODO: long-term, it might be interesting to show a subset of the
      // person page component here

      const hist = person.history || [];
      const dobEvt = hist.find((evt) => {
        return evt.type === 'beginning';
      });
      const dodEvt = hist.find((evt) => {
        return evt.type === 'end';
      });

      const content = (() => {
        return (
          <Fragment>
            <Paper>
              <Typography variant="h5">{person.name}</Typography>

              <Typography variant="body2">
                {(function () {
                  if (dobEvt) {
                    return `
                      Born in <b>${dobEvt.placeId}</b> on ${dateFmt(new Date(dobEvt.date ?? 0))}.
                      `;
                  }
                })()}
                {(function () {
                  if (dodEvt) {
                    return `
                      Died in <b>${dodEvt.placeId}</b> on ${dateFmt(new Date(dodEvt.date ?? 0))}.
                      `;
                  }
                })()}
              </Typography>

              <Typography variant="body2">{person.description}</Typography>
            </Paper>
          </Fragment>
        );
      })();
      setTooltipContent(content);
      setInitialized(true);
    }

    setOpen(true);
  };

  return (
    <Tooltip
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      followCursor={true}
      enterDelay={500}
      leaveDelay={100}
      title={tooltipContent}
    >
      {props.children}
    </Tooltip>
  );
}
