// useFetchLibraries.test ----------------------------------------------------

// Unit tests for useFetchLibraries.

// External Modules ----------------------------------------------------------

import {renderHook, waitFor} from "@testing-library/react";

// Internal Modules ----------------------------------------------------------

import useFetchLibraries, {Props} from "./useFetchLibraries";
import MockUserServices from "../test/services/MockUserServices";
import * as SeedData from "../test/SeedData";
import * as Wrapper from "../test/Wrapper";

// Test Infrastructure -------------------------------------------------------

// Default props for useFetchUsers() calls
const BASE_PROPS: Props = {
    active: false,
    alertPopup: false,
    currentPage: 1,
    pageSize: 10,
}

// Test Methods --------------------------------------------------------------

describe("When logged in", () => {

    it("should return active Libraries", async () => {

        const USER = MockUserServices.exact(SeedData.USER_USERNAME_ADMIN);
        const PROPS: Props = {
            ...BASE_PROPS,
            active: true,
        }
        let actives: number = 0;
        SeedData.LIBRARIES.forEach(library => {
            if (library.active) {
                actives++;
            }
        })

        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.loginContext({children}, USER);
        }
        const {result} = renderHook(() => useFetchLibraries(PROPS), { wrapper });

    })

    it("should return all Libraries", async () => {

        const USER = MockUserServices.exact(SeedData.USER_USERNAME_ADMIN);
        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.loginContext({children}, USER);
        }
        const {result} = renderHook(() => useFetchLibraries(BASE_PROPS), { wrapper });

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
        const {result} = renderHook(() => useFetchLibraries(BASE_PROPS), { wrapper });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.libraries).not.toBeNull();
            expect(result.current.libraries.length).toBe(0);
        })

    })

})

