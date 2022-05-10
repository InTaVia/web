import { useEffect, useState } from 'react';

import { PersonShape } from '@/features/visual-querying/PersonShape';

export function VisualQuerying(): JSX.Element {
  const [svgViewBox, setSvgViewBox] = useState('0 0 0 0');

  useEffect(() => {
    const newSvgViewBox = `${-window.innerWidth / 2} ${-window.innerHeight / 2} ${
      window.innerWidth
    } ${window.innerHeight}`;
    setSvgViewBox(newSvgViewBox);
  }, []);

  return (
    <div className="visual-querying-wrapper">
      <svg width="100%" height="100%" viewBox={svgViewBox}>
        <PersonShape />
      </svg>
    </div>
  );
}
