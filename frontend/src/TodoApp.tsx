import React, { useEffect, useState } from 'react';
import { Alert, Box, Checkbox, CircularProgress, Collapse, Fab, Grow, IconButton, InputAdornment, Paper, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import Main from './Main';
import { TransitionGroup } from 'react-transition-group';
import { Add, CheckCircle, Delete } from '@mui/icons-material';
import AddTodoDialog from './AddTodoDialog';
import { fetchBackend } from './util/backend';
import CustomCollapse from './CustomCollapse';

type TodoItem = {
  id: number,
  todo: string,
  done: boolean
};

const TodoApp = (): JSX.Element => {
  const theme = useTheme();
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: 0,
      todo: "my first task!",
      done: false
    },
    {
      id: 1,
      todo: "my second task!",
      done: false
    },
    {
      id: 2,
      todo: "my last task!",
      done: true
    }
  ]);
  const [username, password] = atob(localStorage.getItem('auth') as string).split(':');
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [editField, setEditField] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  // number represents state
  // -1 = general loading
  // null = not loading
  // 0 - n = item n is loading
  const [loading, setLoading] = useState<number | null>(-1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initLoad = async () => {
      try {
        // const res = await fetchBackend('/todo', true);
        // setTodos(await res.json());
      }
      catch {
        setError('Could not add new item!');
      }
      setLoading(null);
    };
    initLoad();
  }, []);

  const handleItemAdd = async (todo: string) => {
    setError(null);
    setLoading(-1);
    try {
      const res = await fetchBackend('/todo', true, {
        method: 'POST',
        body: JSON.stringify({ todo })
      });
      setTodos(await res.json());
      setLoading(null);
    }
    catch {
      setError('Could not load your todos!');
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
    setLoading(i);
    try {
      const res = await fetchBackend(`/TODO/${item.id}`, true, {
        method: 'PATCH',
        body: JSON.stringify(item)
      });
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
      todo: editedContent,
      done: todos[i].done
    });
  };

  const handleDoneChange = (i: number, done: boolean) => {
    sendItemEdit(i, {
      id: todos[i].id,
      todo: todos[i].todo,
      done: done
    });
  };

  const handleItemDelete = async (i: number, item: TodoItem) => {
    setError(null);
    setLoading(i);
    try {
      const res = await fetchBackend(`/TODO/${item.id}`, true, {
        method: 'DELETE'
      });
      setTodos(await res.json());
      setEditField(null);
    }
    catch {
      setError('Could not delete this item!');
    }
    setLoading(null);
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
        value={editField === i ? editedContent : td.todo}
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
