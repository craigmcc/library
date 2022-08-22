// LoggedInUser ---------------------------------------------------------------

// Display information about the logged in user (if any)

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

// Internal Modules ----------------------------------------------------------

import LoginContext from "./LoginContext";
import LoginForm from "./LoginForm";
import {HandleCredentials} from "../../types";

// Component Details ---------------------------------------------------------

export const LoggedInUser = () => {

    const loginContext = useContext(LoginContext);

    const [showCredentials, setShowCredentials] = useState<boolean>(false);

    useEffect(() => {
        // Trigger rerender when loggedIn state changes
    }, [loginContext.data.loggedIn]);

    const handleLogin: HandleCredentials = async (credentials) => {
        try {
            await loginContext.handleLogin(credentials);
            setShowCredentials(false);
        } catch (error) {
            alert("Login Error: " + (error as Error).message);
        }
    }

    const onHide = () => {
        setShowCredentials(false);
    }

    const onShow = () => {
        setShowCredentials(true);
    }

    return (
        <>
            <div className="form-inline">
                {(loginContext.data.loggedIn) ? (
                    <Button
                        onClick={loginContext.handleLogout}
                        size="sm"
                        type="button"
                        variant="outline-dark"
                    >
                        Log Out
                    </Button>
                ) : (
                    <Button
                        onClick={onShow}
                        size="sm"
                        type="button"
                        variant="outline-dark"
                    >
                        Log In
                    </Button>
                )}
                <input
                    className="ms-2"
                    disabled
                    id="loggedInUsername"
                    value={loginContext.data.username ? loginContext.data.username : "-----"}
                />
            </div>

            <Modal
                animation={false}
                backdrop="static"
                centered
                dialogClassName="modal-50w"
                onHide={onHide}
                show={showCredentials}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Enter Login Credentials</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm autoFocus handleLogin={handleLogin}/>
                </Modal.Body>
            </Modal>

        </>
    )

}

export default LoggedInUser;
