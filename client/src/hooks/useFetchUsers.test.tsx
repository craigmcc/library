// useFetchUsers.test --------------------------------------------------------

// Unit tests for useFetchUsers.

// External Modules ----------------------------------------------------------

import {waitFor} from "@testing-library/react";
import {renderHook} from "@testing-library/react-hooks";

// Internal Modules ----------------------------------------------------------

import useFetchUsers from "./useFetchUsers";
import * as MockUserServices from "../test/MockUserServices";
import * as SeedData from "../test/SeedData";
import * as Wrapper from "../test/Wrapper";

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

        const user = MockUserServices.exact(SeedData.USER_USERNAME_ADMIN)
        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.loginContext({children}, user);
        };
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
            return Wrapper.loginContext({children}, null);
        };
        const {result} = renderHook(() => useFetchUsers(PROPS), { wrapper })

        await waitFor(() => {
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.users).not.toBeNull();
            expect(result.current.users.length).toBe(0);
        });

    })

})

