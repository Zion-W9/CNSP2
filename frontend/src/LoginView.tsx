import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Grow, Link, Paper, TextField, Typography } from '@mui/material';
import Main from './Main';
import { fetchBackend } from './util/backend';
import { useNavigate } from 'react-router-dom';

const TodoApp = (props: { register: boolean }): JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // load errors from other parts of the app if we were redirected here
  useEffect(() => {
    if (sessionStorage.getItem('error') !== null) {
      setError(sessionStorage.getItem('error'));
    }
    if (sessionStorage.getItem('user') !== null) {
      setUsername(sessionStorage.getItem('user') ?? '');
    }
  }, []);

  const trySubmit = async () => {
    try {
      const resp = await fetchBackend(props.register ? '/register' : '/login', false, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      if (resp.status !== 200) {
        throw new Error();
      }
      // login succeeded
      sessionStorage.setItem('auth', await resp.text());
      sessionStorage.setItem('user', username);
      navigate('/');
    }
    catch {
      setError(props.register ? 'Registration failed!' : 'Login failed!');
    }
  };

  return (
    <Main>
      <Grow in={true} timeout={1000}>
        <Paper sx={{ padding: 4, margin: 2 }}>
          <Typography color="primary" variant="h4">
            {props.register ? 'Registration.' : 'Authentication.'}
          </Typography>
          <Typography>
            {props.register ? 'Please sign up in order to use secureTODO.' : 'In order to use secureTODO, you need to log in first.'}
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
          <Typography color="textSecondary">
            {props.register ? <>
              Already have an account?{' '}
              <Link href="/login" underline='none'>
                Log in here.
              </Link>
            </> : <>
              Don't have an account?{' '}
              <Link href="/register" underline='none'>
                Register instead.
              </Link></>}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            disabled={!username.length || password.length < 8}
            onClick={trySubmit}
          >
            {props.register ? 'Register' : 'Login'}
          </Button>
        </Paper>
      </Grow>
    </Main>
  );
}

export default TodoApp;
