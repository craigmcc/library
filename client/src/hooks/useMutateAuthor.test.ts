// useMutateAuthor.test ------------------------------------------------------

// Unit tests for useMutateAuthor.

// External Modules ----------------------------------------------------------

import {act, renderHook, waitFor} from "@testing-library/react";

// Internal Modules ----------------------------------------------------------

import useMutateAuthor, {Props} from "./useMutateAuthor";
import Author from "../models/Author";
import User from "../models/User";
import MockAuthorServices from "../test/services/MockAuthorServices";
import MockLibraryServices from "../test/services/MockLibraryServices";
import MockUserServices from "../test/services/MockUserServices";
import * as SeedData from "../test/SeedData";
import * as Wrapper from "../test/Wrapper";
import {Forbidden} from "../util/HttpErrors";

// Test Infrastructure -------------------------------------------------------

// Default props for useMutateAuthor calls
const BASE_PROPS: Partial<Props> = {
    alertPopup: false,
}

// Test Methods --------------------------------------------------------------

describe("insert()", () => {

    // Mock handlers do not enforce requireXxxxx middleware
    xit("should fail with valid data (regular)", async () => {

        const USER = MockUserServices.exact(SeedData.USER_USERNAME_REGULAR);
        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ZERO_NAME);
        const PROPS: Props = {
            ...BASE_PROPS,
        }

        const AUTHOR = new Author({
            active: true,
            firstName: "New First Name",
            lastName: "New Last Name",
            libraryId: LIBRARY.id,
        });

        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.libraryContext({children}, USER, LIBRARY);
        }
        const {result} = renderHook(() => useMutateAuthor(PROPS), { wrapper });
        try {
            let output = new Author();
            await act(async () => {
                output = await result.current.insert(AUTHOR);
            });
            expect("Should have thrown Forbidden").toEqual("");
        } catch (anError) {
            console.log("anError", anError);
            expect(anError).toBeInstanceOf(Forbidden);

        }

    })

    it("should succeed with valid data (admin)", async () => {

        const USER = MockUserServices.exact(SeedData.USER_USERNAME_ADMIN);
        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ONE_NAME);
        const PROPS: Props = {
            ...BASE_PROPS,
        }

        const AUTHOR = new Author({
            active: true,
            firstName: "New First Name",
            lastName: "New Last Name",
            libraryId: LIBRARY.id,
        });

        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.libraryContext({children}, USER, LIBRARY);
        }
        const {result} = renderHook(() => useMutateAuthor(PROPS), { wrapper });
        let output = new Author();
        await act(async () => {
            output = await result.current.insert(AUTHOR);
        });

        expect(output.id).toBeDefined();
        expect(output.active).toEqual(AUTHOR.active);
        expect(output.firstName).toEqual(AUTHOR.firstName);
        expect(output.lastName).toEqual(AUTHOR.lastName);
        expect(output.libraryId).toEqual(AUTHOR.libraryId);

    })

    it("should succeed with valid data (superuser)", async () => {

        const USER = MockUserServices.exact(SeedData.USER_USERNAME_SUPERUSER);
        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_TWO_NAME);
        const PROPS: Props = {
            ...BASE_PROPS,
        }

        const AUTHOR = new Author({
            active: true,
            firstName: "New First Name",
            lastName: "New Last Name",
            libraryId: LIBRARY.id,
        });

        // @ts-ignore
        const wrapper = ({children}) => {
            return Wrapper.libraryContext({children}, USER, LIBRARY);
        }
        const {result} = renderHook(() => useMutateAuthor(PROPS), { wrapper });
        let output = new Author();
        await act(async () => {
            output = await result.current.insert(AUTHOR);
        });

        expect(output.id).toBeDefined();
        expect(output.active).toEqual(AUTHOR.active);
        expect(output.firstName).toEqual(AUTHOR.firstName);
        expect(output.lastName).toEqual(AUTHOR.lastName);
        expect(output.libraryId).toEqual(AUTHOR.libraryId);

    })

})
