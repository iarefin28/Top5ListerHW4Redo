import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'
import { Button } from "@mui/material";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { Alert } from "@mui/material";
import RegisterScreen from "../components/RegisterScreen";

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    OPEN_MODAL: "OPEN_MODAL",
    CLOSE_MODAL: "CLOSE_MODAL"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        isModalOpen: false,
        error: ""
    });
    const history = useHistory();
    

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    error: ""
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isModalOpen: false,
                    error: ""
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isModalOpen: false,
                    error: ""
                });
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isModalOpen: false,
                    error: ""
                });
            }
            case AuthActionType.OPEN_MODAL: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isModalOpen: true,
                    error: payload.error
                })
            }
            case AuthActionType.CLOSE_MODAL: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isModalOpen: false,
                    error: ""
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.closeModal = async function(){
        authReducer({
            type: AuthActionType.CLOSE_MODAL,
            payload: {

            }
        })
    }

    auth.registerUser = async function(userData, store) {
        console.log(auth.isModalOpen);
        try{
            const response = await api.registerUser(userData);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                    user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        } catch(err) {
            authReducer({
                type: AuthActionType.OPEN_MODAL,
                payload: {
                    error: err.response.data.errorMessage
                }
            })
        }
    }

    auth.loginUser = async function(userData, store) {
        try{
            const response = await api.loginUser(userData); 

            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                
                history.push("/");
                store.loadIdNamePairs();
            }
            
        } catch (err) {
            authReducer({
                type: AuthActionType.OPEN_MODAL,
                payload: {
                    error: err.response.data.errorMessage
                }
            })
        }
    }

    auth.logoutUser = async function(userData, store){
        try{
            const response = await api.logoutUser(userData); 

            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGOUT_USER,
                    payload: {
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
            
        } catch (err) {
    
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };