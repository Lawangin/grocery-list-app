import React, {useContext, useState} from 'react';

import Card from './UI/Card';
import './Auth.css';
import {AuthContext} from "../context/auth-context";

const Auth = props => {
    const authContext = useContext(AuthContext);

    const [userEmail, setUserEmail] = useState({value: ''});
    const [userPassword, setUserPassword] = useState({value: ''});

    const inputEmailHandler = (event) => {
        setUserEmail({value: event.target.value});
    };

    const inputPasswordHandler = event => {
        setUserPassword({value: event.target.value});
    };

    const loginHandler = (email, password) => {
        authContext.login(email, password);
    };

    const signupHandler = (email, password) => {
        authContext.signup(email, password);
        // console.log(email);
        // console.log(password);

    };

    return (
        <div className="auth">
            <Card>
                <h2>You are not authenticated!</h2>
                <p>Please log in to continue.</p>
                <form onSubmit={event => {
                    event.preventDefault();
                    signupHandler(userEmail.value, userPassword.value);
                }}>
                    <input type="email" placeholder="E-Mail" value={userEmail.value} onChange={(event) => inputEmailHandler(event)}/>
                    <input type="password" placeholder="Password" value={userPassword.value}
                           onChange={(event) => inputPasswordHandler(event)}/>
                    <button onClick={event => {
                        event.preventDefault();
                        loginHandler(userEmail.value, userPassword.value);
                    }}>Log In</button>
                    <button >Sign up</button>
                </form>
            </Card>
        </div>
    );
};

export default Auth;
