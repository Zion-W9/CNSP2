import React, { useEffect, useState } from 'react';
import { Collapse, CollapseProps } from '@mui/material';

export type CustomTransitionProps = CollapseProps & {
  delay?: number
};

const CustomCollapse = (props: CustomTransitionProps) => {
  const [isIn, setIsIn] = useState<boolean>(props.delay ? false : props.in as boolean);

  useEffect(() => {
    if (props.delay && props.in) {
      setTimeout(() => setIsIn(true), props.delay);
    } else {
      setIsIn(props.in as boolean);
    }
  }, [props.in]);

  return (
    <Collapse {...props} in={isIn} />
  );
};

export default CustomCollapse;