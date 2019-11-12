import React, { useState } from 'react';
import axios from 'axios';

export const AuthContext = React.createContext({
    isAuth: false,
    token: null,
    id: null,
    login: () => {},
    signup: () => {}
});

const AuthContextProvider = props => {
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const [ hasToken, setHasToken ] = useState(null);
    const [ hasId, setHasId ] = useState(null);

    const API_KEY = 'AIzaSyC9bzs4yo-3V2X8DbIzQCmYcg6C4kwBOnQ';

    const loginHandler = (email, password) => {
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

        axios.post(url, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                setHasToken(response.data.idToken);
                setHasId(response.data.localId);
            })
            .then(res => setIsAuthenticated(true))
            .catch(err => console.log(err));
    };

    const signupHandler = (email, password) => {
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

        axios.post(url, authData)
            .then(response => {
                setHasToken(response.data.idToken);
                setHasId(response.data.localId);
            })
            .then(() => {
                alert('Sign Up successful!')
            })

            .catch(err => console.log(err));
    };

    return (
        <AuthContext.Provider value={{
            login: loginHandler,
            isAuth: isAuthenticated,
            signup: signupHandler ,
            token: hasToken,
            id: hasId
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;