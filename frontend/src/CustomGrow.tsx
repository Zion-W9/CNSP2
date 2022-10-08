import React, { useEffect, useState } from 'react';
import { Grow } from '@mui/material';
import { GrowProps } from '@mui/material/Grow/Grow';

export type CustomTransitionProps = GrowProps & {
  delay?: number
};

const CustomGrow = (props: CustomTransitionProps) => {
  const [isIn, setIsIn] = useState<boolean>(props.delay ? false : props.in as boolean);

  useEffect(() => {
    if (props.delay && props.in) {
      setTimeout(() => setIsIn(true), props.delay);
    } else {
      setIsIn(props.in as boolean);
    }
  }, [props.in]);

  return (
    <Grow {...props} in={isIn} />
  );
};

export default CustomGrow;