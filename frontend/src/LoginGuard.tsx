import React from 'react';
import { Navigate } from "react-router-dom";

const LoginGuard = (props: { children: JSX.Element }): JSX.Element => {
    const loggedIn = !!sessionStorage.getItem('auth');

    return (
        loggedIn ? props.children : <Navigate to="/login" />
    );
}

export default LoginGuard;
