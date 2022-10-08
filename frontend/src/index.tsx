import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom';
import './index.css';
import LoginGuard from './LoginGuard';
import LoginView from './LoginView';
import TodoApp from './TodoApp';

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: '#8ec5fc'
    },
    secondary: {
      main: '#e0c3fc'
    }
  },
  shape: {
    borderRadius: 10
  },
  typography: {
    fontFamily: 'Nunito'
  }
});

const Root = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <LoginGuard>
          <TodoApp />
        </LoginGuard>
      )
    },
    {
      path: '/login',
      element: (
        <LoginView />
      )
    }
  ]);

  return (
    <ThemeProvider theme={darkTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <Root />
);