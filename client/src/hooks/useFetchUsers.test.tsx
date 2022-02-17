import {act, renderHook} from "@testing-library/react-hooks";

import useFetchUsers from "./useFetchUsers";
import {LoginContextProvider} from "../components/login/LoginContext";
import * as SeedData from "../test/SeedData";
import TestLogin from "../test/TestLogin";
import TestLogout from "../test/TestLogout";

// Default props for useFetchUsers() calls
const PROPS = {
    active: false,
    alertPopup: false,
    currentPage: 1,
    pageSize: 10,
}

// Wrapper for LoginContext around children

xtest("logged in as superuser should return all users", async () => {

    // @ts-ignore
    const wrapper = ({children}) => {
        return (
            <LoginContextProvider>
                <TestLogin scope={SeedData.USER_SCOPE_SUPERUSER}/>
                {children}
                <TestLogout/>
            </LoginContextProvider>
        )
    }
    const {result} = renderHook(() => useFetchUsers(PROPS), { wrapper });

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.users).not.toBeNull();
    expect(result.current.users.length).toBe(SeedData.USERS.length);

});

test("not logged in should return zero users", () => {

    const {result} = renderHook(() => useFetchUsers(PROPS));

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.users).not.toBeNull();
    expect(result.current.users.length).toBe(0);

});

