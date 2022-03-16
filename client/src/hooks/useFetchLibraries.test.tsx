// useFetchLibraries.test ----------------------------------------------------

// Unit tests for useFetchLibraries.

// External Modules ----------------------------------------------------------

import {waitFor} from "@testing-library/react";
import {renderHook} from "@testing-library/react-hooks";

// Internal Modules ----------------------------------------------------------

import useFetchLibraries, {Props} from "./useFetchLibraries";
import * as MockUserServices from "../test/MockUserServices";
import * as SeedData from "../test/SeedData";
import * as Wrapper from "../test/Wrapper";
import useFetchUsers from "./useFetchUsers";

// Test Infrastructure -------------------------------------------------------

// Default props for useFetchUsers() calls
const PROPS: Props = {
    active: false,
    alertPopup: false,
    currentPage: 1,
    pageSize: 10,
}

// Test Methods --------------------------------------------------------------

describe("When logged in", () => {

    it("should return all Libraries", async () => {

        const user = MockUserServices.exact(SeedData.USER_USERNAME_ADMIN);
        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.loginContext({children}, user);
        }
        const {result} = renderHook(() => useFetchLibraries(PROPS), { wrapper });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.libraries).not.toBeNull();
            expect(result.current.libraries.length).toBe(SeedData.LIBRARIES.length);
        })

    })

})

describe("When logged out", () => {

    it("should return no Libraries", async () => {

        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.loginContext({children}, null);
        }
        const {result} = renderHook(() => useFetchLibraries(PROPS), { wrapper });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.libraries).not.toBeNull();
            expect(result.current.libraries.length).toBe(0);
        })

    })

})

