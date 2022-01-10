import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginForm from "./LoginForm";

const elements = (): {
    // Fields
    username: HTMLElement,
    password: HTMLElement,
    // Buttons
    login: HTMLElement,
} => {

    const username = screen.getByLabelText("Username:");
    expect(username).toBeInTheDocument();
    const password = screen.getByLabelText("Password:");
    expect(password).toBeInTheDocument();

    const login = screen.getByRole("button", { name: "Log In" });
    expect(login).toBeInTheDocument();

    return {
        username,
        password,
        login,
    };

}

test("invalid data does not submit", async () => {

    const handleCredentials = jest.fn();
    render(<LoginForm handleLogin={handleCredentials}/>);
    const {login} = elements();

    userEvent.click(login);

    await waitFor(() => {
        expect(handleCredentials).not.toBeCalled();
    })

});

test("valid data with enter after last field", async () => {

    const VALID_USERNAME = "myusername";
    const VALID_PASSWORD = "mypassword";
    const handleCredentials = jest.fn();
    render(<LoginForm handleLogin={handleCredentials}/>);
    const {username, password} = elements();

    userEvent.type(username, VALID_USERNAME);
    userEvent.type(password, VALID_PASSWORD + "{enter}");

    await waitFor(() => {
        expect(handleCredentials).toHaveBeenCalledWith({
            username: VALID_USERNAME,
            password: VALID_PASSWORD,
        })
    })

});

test("valid data with submit button", async () => {

    const VALID_USERNAME = "myusername";
    const VALID_PASSWORD = "mypassword";
    const handleCredentials = jest.fn();
    render(<LoginForm handleLogin={handleCredentials}/>);
    const {username, password, login} = elements();

    userEvent.type(username, VALID_USERNAME);
    userEvent.type(password, VALID_PASSWORD);
    userEvent.click(login);

    await waitFor(() => {
        expect(handleCredentials).toHaveBeenCalledWith({
            username: VALID_USERNAME,
            password: VALID_PASSWORD,
        });
    });

});

