import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Checkbox, CircularProgress, Collapse, Fab, Grow, IconButton, InputAdornment, Paper, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import Main from './Main';
import { TransitionGroup } from 'react-transition-group';
import { Add, CheckCircle, Delete, Logout } from '@mui/icons-material';
import AddTodoDialog from './AddTodoDialog';
import { fetchBackend, isTokenExpired } from './util/backend';
import CustomCollapse from './CustomCollapse';
import { useNavigate } from "react-router-dom";

type TodoItem = {
  id: number,
  text: string,
  done: boolean
};

const TodoApp = (): JSX.Element => {
  const theme = useTheme();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [editField, setEditField] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  // number represents state
  // -1 = general loading
  // null = not loading
  // 0 - n = item n is loading
  const [loading, setLoading] = useState<number | null>(-1);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const username = sessionStorage.getItem('user');

  useEffect(() => {
    const initLoad = async () => {
      if (!checkSession()) return;
      try {
        const res = await fetchBackend('/todo', true);
        setTodos(await res.json());
      }
      catch {
        setError('Could not load your todos!');
      }
      setLoading(null);
    };
    initLoad();
  }, []);

  const checkSession = () => {
    const token = sessionStorage.getItem('auth');
    if (!token || isTokenExpired(token)) {
      sessionStorage.removeItem('auth');
      sessionStorage.setItem('error', 'Session expired! Please log in again.');
      navigate('/login');
      return false;
    }
    return true;
  }

  const handleItemAdd = async (todo: string) => {
    setOpenAddDialog(false);
    setError(null);
    if (!checkSession()) return;
    try {
      const res = await fetchBackend('/todo', true, {
        method: 'POST',
        body: JSON.stringify({ todo })
      });
      if (res.status !== 201) {
        throw new Error();
      }
      setTodos(await res.json());
    }
    catch {
      setError('Could not add new item!');
    }
  };

  const handleItemChange = (i: number, value: string) => {
    if (editField !== i) {
      setEditField(i);
    }
    setEditedContent(value);
  };

  const sendItemEdit = async (i: number, item: TodoItem) => {
    setError(null);
    if (!checkSession()) return;
    setLoading(i);
    try {
      const res = await fetchBackend(`/TODO/${item.id}`, true, {
        method: 'PATCH',
        body: JSON.stringify(item)
      });
      if (res.status !== 200) {
        throw new Error();
      }
      setTodos(await res.json());
      setEditField(null);
    }
    catch {
      setError('Could not edit this item!');
    }
    setLoading(null);
  };

  const handleEditConfirm = (i: number) => {
    sendItemEdit(i, {
      id: todos[i].id,
      text: editedContent,
      done: todos[i].done
    });
  };

  const handleDoneChange = (i: number, done: boolean) => {
    sendItemEdit(i, {
      id: todos[i].id,
      text: todos[i].text,
      done: done
    });
  };

  const handleItemDelete = async (i: number, item: TodoItem) => {
    setError(null);
    if (!checkSession()) return;
    setLoading(i);
    try {
      const res = await fetchBackend(`/TODO/${item.id}`, true, {
        method: 'DELETE'
      });
      if (res.status !== 200) {
        throw new Error();
      }
      setTodos(await res.json());
      setEditField(null);
    }
    catch {
      setError('Could not delete this item!');
    }
    setLoading(null);
  };

  const handleLogoutClick = () => {
    sessionStorage.removeItem('auth');
    navigate('/login');
  };

  const loader = (
    <Collapse key="loading" orientation="vertical">
      <Box display="flex" justifyContent="center" marginTop={3}>
        <CircularProgress />
      </Box>
    </Collapse>
  );

  const todoItems = todos.map((td, i) => (
    <CustomCollapse orientation="vertical" timeout={1000} delay={100 * i + 500} key={i}>
      <TextField
        value={editField === i ? editedContent : td.text}
        fullWidth
        sx={{
          marginTop: 2
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {
                editField === i ? (
                  <Tooltip title="Click here to apply your edit.">
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleEditConfirm(i)}
                      disabled={loading === i}
                    >
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton
                    edge="end"
                    disabled={loading === i}
                    onClick={() => handleItemDelete(i, td)}
                  >
                    <Delete />
                  </IconButton>
                )
              }
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              {loading === i ? (
                <CircularProgress size="1em" />
              ) : (
                <Checkbox
                  checked={td.done}
                  onChange={e => handleDoneChange(i, e.target.checked)}
                />
              )}
            </InputAdornment>
          )
        }}
        disabled={loading === i}
        // onBlur={() => setEditField(null)}
        onChange={e => handleItemChange(i, e.target.value)}
      />
    </CustomCollapse>
  ));
  if (todoItems.length === 0) {
    todoItems.push(
      <CustomCollapse orientation="vertical" timeout={1000} delay={0} key="placeholder">
        <Typography color="textSecondary" align="center">
          you have no todos!
        </Typography>
      </CustomCollapse>
    );
  }

  return (
    <Main>
      <Grow timeout={500} in={true}>
        <Paper sx={{
          position: 'relative',
          padding: '2em 2em',
          paddingBottom: '3em',
          margin: 2,
          width: '900px'
        }}>
          <IconButton
            color="primary"
            sx={{
              display: 'flex',
              marginLeft: 'auto !important',
              marginRight: 0
            }}
            onClick={handleLogoutClick}
          >
            <Logout />
          </IconButton>
          <Box>
            <Typography variant="h3" color="primary">
              secureTODO
            </Typography>
            <Typography variant="h5" color="textSecondary">
              welcome, {username}!
            </Typography>
          </Box>
          <Collapse orientation="vertical" in={!!error}>
            <Alert
              severity="error"
              variant="outlined"
              sx={{ marginTop: 2, marginBottom: 1 }}
            >
              {error}
            </Alert>
          </Collapse>
          <TransitionGroup>
            {loading === -1 ? loader : todoItems}
          </TransitionGroup>
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'absolute',
              top: 'calc(100% - 2em)',
              right: theme.spacing(4)
            }}
            onClick={() => setOpenAddDialog(true)}
          >
            <Add />
          </Fab>
        </Paper>
      </Grow>
      <AddTodoDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onConfirm={handleItemAdd}
      />
    </Main>
  );
}

export default TodoApp;
