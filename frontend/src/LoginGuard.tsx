import React from 'react';
import './App.css';
import { Navigate } from "react-router-dom";

const LoginGuard = (props: { children: JSX.Element }): JSX.Element => {
    const loggedIn = !!localStorage.getItem('auth');

    return (
        loggedIn ? props.children : <Navigate to="/login" />
    );
}

export default LoginGuard;
