// useFetchUsers.test --------------------------------------------------------

// Unit tests for useFetchUsers.

// External Modules ----------------------------------------------------------

import {waitFor} from "@testing-library/react";
import {renderHook} from "@testing-library/react-hooks";

// Internal Modules ----------------------------------------------------------

import useFetchUsers from "./useFetchUsers";
import LoginContext, {State} from "../components/login/LoginContext";
import * as SeedData from "../test/SeedData";

// Test Infrastructure -------------------------------------------------------

// Default props for useFetchUsers() calls
const PROPS = {
    active: false,
    alertPopup: false,
    currentPage: 1,
    pageSize: 10,
}

// Test Methods --------------------------------------------------------------

describe("When logged in", () => {

    it("should return all users", async () => {

        // @ts-ignore
        const wrapper = ({children}) => {
            return (
                <LoginContext.Provider value={LOGGED_IN_STATE}>
                    {children}
                </LoginContext.Provider>
            )
        }
        const {result} = renderHook(() => useFetchUsers(PROPS), { wrapper });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.users).not.toBeNull();
            expect(result.current.users.length).toBe(SeedData.USERS.length);
        });

    })

})

describe("When logged out", () => {

    it("should return no users", async () => {

        // @ts-ignore
        const wrapper = ({children}) => {
            return (
                <LoginContext.Provider value={LOGGED_OUT_STATE}>
                    {children}
                </LoginContext.Provider>
            )
        }
        const {result} = renderHook(() => useFetchUsers(PROPS), { wrapper })

        await waitFor(() => {
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.users).not.toBeNull();
            expect(result.current.users.length).toBe(0);
        });

    })

})

// Private Methods -----------------------------------------------------------

const LOGGED_IN_STATE: State = {
    data: {
        accessToken: "accesstoken",
        expires: new Date(),
        loggedIn: true,
        refreshToken: "refreshtoken",
        scope: "test:admin",
        username: "username",
    },
    handleLogin: jest.fn(),
    handleLogout: jest.fn(),
    validateLibrary: jest.fn(),
    validateScope: jest.fn(),
}

const LOGGED_OUT_STATE: State = {
    data: {
        accessToken: null,
        expires: null,
        loggedIn: false,
        refreshToken: null,
        scope: null,
        username: null,
    },
    handleLogin: jest.fn(),
    handleLogout: jest.fn(),
    validateLibrary: jest.fn(),
    validateScope: jest.fn(),
}

