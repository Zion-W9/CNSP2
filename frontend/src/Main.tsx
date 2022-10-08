import React from 'react';
import './App.css';
import { Box, useTheme } from '@mui/material';
import { css } from '@emotion/css';

const TodoApp = (props: { children: any }): JSX.Element => {
    const theme = useTheme();
    const styles = {
        bodyContainer: css`
      width: 100vw;
      height: 100vh;
      background-image: linear-gradient(120deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    `
    };

    return (
        <Box className={styles.bodyContainer}>
            {props.children}
        </Box>
    );
}

export default TodoApp;
