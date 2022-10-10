import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';

const AddTodoDialog = (props: {
  open: boolean,
  onClose: () => any
  onConfirm: (todo: string) => any
}): JSX.Element => {
  const theme = useTheme();
  const [todo, setTodo] = useState<string>('');

  useEffect(() => {
    if (props.open) {
      setTodo('');
    }
  }, [props.open])

  return (
    <Dialog open={props.open} fullWidth onClose={props.onClose}>
      <DialogTitle>
        Add a new TODO item
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth placeholder="water the plants..."
          value={todo}
          onChange={e => setTodo(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ color: theme.palette.text.secondary }}
          onClick={props.onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={!todo.length}
          onClick={() => props.onConfirm(todo)}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTodoDialog;
