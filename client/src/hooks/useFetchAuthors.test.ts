// useFetchAuthors.test ------------------------------------------------------

// Unit tests for useFetchAuthors.

// External Modules ----------------------------------------------------------

import {waitFor} from "@testing-library/react";
import {renderHook} from "@testing-library/react-hooks";

// Internal Modules ----------------------------------------------------------

import useFetchAuthors, {Props} from "./useFetchAuthors";
import User from "../models/User";
import * as MockLibraryServices from "../test/MockLibraryServices";
import * as MockUserServices from "../test/MockUserServices";
import * as SeedData from "../test/SeedData";
import * as Wrapper from "../test/Wrapper";

// Test Infrastructure -------------------------------------------------------

// Default props for useFetchAuthors() calls
const BASE_PROPS: Partial<Props> = { // Need to add parent
    active: false,
    alertPopup: false,
    currentPage: 1,
    pageSize: 10,

}

// Test Methods --------------------------------------------------------------

describe("When logged in", () => {

    it("should return active Authors for a Library", async () => {

        const USER = MockUserServices.exact(SeedData.USER_USERNAME_REGULAR);
        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_TWO_NAME);
        const PROPS: Props = {
            ...BASE_PROPS,
            active: true,
            parent: LIBRARY,
        }
        let actives: number = 0;
        SeedData.AUTHORS2.forEach(author => {
            if (author.active) {
                actives++;
            }
        })

        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.libraryContext({children}, USER, LIBRARY);
        }
        const {result} = renderHook(() => useFetchAuthors(PROPS), { wrapper });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.authors).not.toBeNull();
            expect(result.current.authors.length).toBe(actives);
        })

    })

    it("should return all Authors for a Library", async () => {

        const USER = MockUserServices.exact(SeedData.USER_USERNAME_REGULAR);
        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ONE_NAME);
        const PROPS: Props = {
            ...BASE_PROPS,
            parent: LIBRARY,
        }
        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.libraryContext({children}, USER, LIBRARY);
        }
        const {result} = renderHook(() => useFetchAuthors(PROPS), { wrapper });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.authors).not.toBeNull();
            expect(result.current.authors.length).toBe(SeedData.AUTHORS1.length);
        })

    })

})

describe("When logged out", () => {

    it("should return no Authors", async () => {

        const USER: User | null = null;
        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ZERO_NAME);
        const PROPS: Props = {
            ...BASE_PROPS,
            parent: LIBRARY,
        }
        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.loginContext({children}, null);
        }
        const {result} = renderHook(() => useFetchAuthors(PROPS), { wrapper });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBeFalsy();
            expect(result.current.authors).not.toBeNull();
            expect(result.current.authors.length).toBe(0);
        })

    })

})
