import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginForm from "./LoginForm";

const elements = (): [
    username: HTMLElement,
    password: HTMLElement,
    button: HTMLElement,
] => {
    const username = screen.getByLabelText("Username:");
    expect(username).toBeInTheDocument();
    expect(username).toHaveValue("");
    const password = screen.getByLabelText("Password:");
    expect(password).toBeInTheDocument();
    expect(password).toHaveValue("");
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    return [username, password, button];
}

test("invalid data does not submit", async () => {

    const handleCredentials = jest.fn();
    render(<LoginForm handleLogin={handleCredentials}/>);
    const [buttonElement] = elements();

    userEvent.click(buttonElement);

    await waitFor(() => {
        expect(handleCredentials).not.toBeCalled();
    })

});

test("valid data with enter after last field", async () => {

    const VALID_USERNAME = "myusername";
    const VALID_PASSWORD = "mypassword";
    const handleCredentials = jest.fn();
    render(<LoginForm handleLogin={handleCredentials}/>);
    const [username, password] = elements();

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
    const [username, password, button] = elements();

    userEvent.type(username, VALID_USERNAME);
    userEvent.type(password, VALID_PASSWORD);
    userEvent.click(button);

    await waitFor(() => {
        expect(handleCredentials).toHaveBeenCalledWith({
            username: VALID_USERNAME,
            password: VALID_PASSWORD,
        });
    });

});

