// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Internal Modules
import {reset} from "./test/services/MockDatabase";
import {server} from "./test/server";

// Get rid of "The current testing environment is not configured to support act(...)" messages
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Configure mock service workers
beforeAll(() => server.listen());
beforeEach(() => reset());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
