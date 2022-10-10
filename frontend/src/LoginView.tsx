import React, { useState } from 'react';
import { Alert, Box, Button, Grow, Paper, TextField, Typography } from '@mui/material';
import { css } from '@emotion/css';
import Main from './Main';
import { fetchBackend, getBackendUrl } from './util/backend';
import { useNavigate } from 'react-router-dom';

const TodoApp = (): JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const tryLogin = async () => {
    try {
      await fetchBackend('/login', false, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      // login succeeded
      localStorage.setItem('auth', btoa(`${username}:${password}`));
      navigate('/');
    }
    catch {
      setError('Login failed!');
    }
  };

  return (
    <Main>
      <Grow in={true} timeout={1000}>
        <Paper sx={{ padding: 4, margin: 2 }}>
          <Typography color="primary" variant="h4">
            Authentication.
          </Typography>
          <Typography color="textSecondary">
            In order to use secureTODO, you need to log in first.
          </Typography>
          <Box sx={{ marginBottom: 4 }} />
          {!!error &&
            <Alert severity="error" variant="outlined" sx={{ marginBottom: 4 }}>
              {error}
            </Alert>
          }
          <TextField
            label="username"
            fullWidth
            sx={{ marginBottom: 2 }}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            label="password"
            fullWidth
            sx={{ marginBottom: 2 }}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            disabled={!username.length || !password.length}
            onClick={tryLogin}
          >
            Login
          </Button>
        </Paper>
      </Grow>
    </Main>
  );
}

export default TodoApp;
