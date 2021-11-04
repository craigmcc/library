// LoggedInUser ---------------------------------------------------------------

// Display information about the logged in user (if any)

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {useHistory} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoginContext from "./LoginContext";
import LoginForm from "./LoginForm";
import OAuth from "../../clients/OAuth";
import Credentials from "../../models/Credentials";
import PasswordTokenRequest from "../../models/PasswordTokenRequest";
import TokenResponse from "../../models/TokenResponse";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Component Details ---------------------------------------------------------

export const LoggedInUser = () => {

    const loginContext = useContext(LoginContext);
    const history = useHistory();

    const [showCredentials, setShowCredentials] = useState<boolean>(false);

    useEffect(() => {
        // Just trigger rerender when login or logout occurs
    }, [loginContext.data.loggedIn]);

    const handleLogin = async (credentials: Credentials) => {
        const tokenRequest: PasswordTokenRequest = {
            grant_type: "password",
            password: credentials.password,
            username: credentials.username,
        }
        try {
            logger.info({
                context: "LoggedInUser.handleLogin",
                username: credentials.username,
                password: "*REDACTED*",
            });
            const tokenResponse: TokenResponse =
                (await OAuth.post("/token", tokenRequest)).data;
            setShowCredentials(false);
            loginContext.handleLogin(credentials.username, tokenResponse);
            logger.debug({
                context: "LoggedInUser.handleLogin",
                msg: "Successfully logged in",
                tokenResponse: JSON.stringify(tokenResponse),
            });
        } catch (error) {
            ReportError("LoggedInUser.handleLogin", error, {
                username: credentials.username,
                password: "*REDACTED*",
            });
        }
    }

    const handleLogout = async (): Promise<void> => {
        const accessToken = loginContext.data.accessToken;
        const username = loginContext.data.username;
        try {
            logger.info({
                context: "LoggedInUser.handleLogout",
                username: username,
//                accessToken: accessToken,
            })
            await loginContext.handleLogout();
            history.push("/");
            if (accessToken) {
                await OAuth.delete("/token", {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
            }
        } catch (error) {
            ReportError("LoggedInUser.handleLogout", error, {
                username: username,
//                accessToken: accessToken,
            });
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
            <Form className="align-items-center" id="loggedInUser">
                <Form.Group as={Row} controlId="loggedInUserRow">
                    <Form.Label column htmlFor="loggedInUsername" xs="auto">
                        {(loginContext.data.loggedIn) ? (
                            <Button
                                onClick={handleLogout}
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
                    </Form.Label>
                    <Col xs="auto">
                        <Form.Control
                            id="loggedInUsername"
                            readOnly={true}
                            size="sm"
                            value={loginContext.data.username ? loginContext.data.username : "-----"}
                        />
                    </Col>
                </Form.Group>
            </Form>

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
