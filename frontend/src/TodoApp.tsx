import React, { useState } from 'react';
import './App.css';
import { Box, Checkbox, Fab, Grow, IconButton, InputAdornment, Paper, TextField, Typography, useTheme } from '@mui/material';
import { css } from '@emotion/css';
import Main from './Main';
import { TransitionGroup } from 'react-transition-group';
import CustomGrow from './CustomGrow';
import { Add, Delete } from '@mui/icons-material';

type TodoItem = {
  id: number,
  todo: string,
  done: boolean
};

const TodoApp = (): JSX.Element => {
  const theme = useTheme();
  const styles = {

  };
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: 0,
      todo: 'hello world!',
      done: true
    },
    {
      id: 1,
      todo: 'hello world!',
      done: true
    },
    {
      id: 2,
      todo: 'hello world!',
      done: true
    }
  ]);
  const [username, password] = atob(localStorage.getItem('auth') as string).split(':');

  return (
    <Main>
      <Paper sx={{
        position: 'relative',
        padding: '2em 2em',
        paddingBottom: '3em',
        margin: 2
      }}>
        <Box sx={{}}>
          <Typography variant="h3" color="primary">
            secureTODO
          </Typography>
          <Typography variant="h5" color="textSecondary">
            welcome, {username}!
          </Typography>
        </Box>
        <TransitionGroup>
          {todos.map((td, i) => (
            <CustomGrow timeout={500} key={i}>
              <TextField
                value={td.todo}
                fullWidth
                sx={{
                  marginTop: 2
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <Delete />
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <Checkbox />
                    </InputAdornment>
                  )
                }}
              />
            </CustomGrow>
          ))}
        </TransitionGroup>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'absolute',
            top: 'calc(100% - 2em)',
            right: theme.spacing(4)
          }}
        >
          <Add />
        </Fab>
      </Paper>
    </Main>
  );
}

export default TodoApp;
