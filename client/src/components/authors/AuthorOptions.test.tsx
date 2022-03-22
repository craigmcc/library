// AuthorOptions.test --------------------------------------------------------

// Unit tests for AuthorOptions.

import React from "react";
import {act, render, screen, waitFor} from "@testing-library/react";

// Internal Modules -----------------------------------------------------------

import AuthorOptions, {Props} from "./AuthorOptions";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import Author from "../../models/Author";
import Library from "../../models/Library";
import User from "../../models/User";
import * as MockAuthorServices from "../../test/MockAuthorServices";
import * as MockLibraryServices from "../../test/MockLibraryServices";
import * as MockUserServices from "../../test/MockUserServices";
import * as SeedData from "../../test/SeedData";
import * as State from "../../test/State";

// Test Infrastructure -------------------------------------------------------

const BASE_PROPS: Props = {
    handleAdd: jest.fn(),
    handleEdit: jest.fn(),
    parent: new Library(),
}

type Elements = {
    // Fields
    activeOnly: HTMLElement,
    rows: HTMLElement[],
    searchBar: HTMLElement,
    // Buttons
    add0: HTMLElement,
    add1: HTMLElement,
    pageNext: HTMLElement,
    pageNumber: HTMLElement,
    pagePrevious: HTMLElement,
}

const elements = function (): Elements {

    const activeOnly = screen.getByLabelText("Active Authors Only?");
    expect(activeOnly).toBeInTheDocument();
    expect(activeOnly).not.toHaveAccessibleDescription("checked");
    const rows = screen.getAllByRole("row");  // Includes header rows
    const searchBar = screen.getByLabelText("Search For Authors:");
    expect(searchBar).toBeInTheDocument();

    const adds = screen.getAllByRole("button", { name:"Add" });
    const pageNext = screen.getByRole("button", { name: ">" });
    expect(pageNext).toBeInTheDocument();
    const pageNumber = screen.getByRole("button", { name: "1" });
    expect(pageNumber).toBeInTheDocument();
    const pagePrevious = screen.getByRole("button", { name: "<" });
    expect(pagePrevious).toBeInTheDocument();

    return {

        activeOnly: activeOnly,
        rows: rows,
        searchBar: searchBar,

        add0: adds[0],
        add1: adds[1],
        pageNext: pageNext,
        pageNumber: pageNumber,
        pagePrevious: pagePrevious,
    };

}

// Test Methods --------------------------------------------------------------

describe("When logged in", () => {

    it("should list all Authors for a Library", async () => {

        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ZERO_NAME);
        const USER = MockUserServices.exact(SeedData.USER_USERNAME_REGULAR);
        const PROPS: Props = {
            ...BASE_PROPS,
            parent: LIBRARY,
        }
        await act(async () => {
            render(
                <LoginContext.Provider value={State.loginContext(USER)}>
                    <LibraryContext.Provider value={State.libraryContext(USER, LIBRARY)}>
                        <AuthorOptions {...PROPS}/>
                    </LibraryContext.Provider>
                </LoginContext.Provider>

            )
        });

        const {activeOnly, rows,// searchBar,
            add0, add1, pageNext, pageNumber, pagePrevious}
            = elements();

        await waitFor(() => {
            expect(activeOnly).not.toBeChecked();
            expect(add0).toBeEnabled();
            expect(add1).toBeEnabled();
            expect(pageNext).toBeDisabled();
            expect(pageNumber).toBeDisabled();
            expect(pagePrevious).toBeDisabled();
            // NOTE - only sees the 2 header rows - expect(rows.length).toBe(SeedData.AUTHORS0.length + 2);  // header rows + all Authors
        });

    })

})

describe("When logged out", () => {

    it("should list no Authors", async () => {

        const LIBRARY: Library | null = null;
        const USER: User | null = null;
        const PROPS: Props = {
            ...BASE_PROPS,
            parent: new Library(), // Does not accept null
        }
        await act(async () => {
            render(
                <LoginContext.Provider value={State.loginContext(USER)}>
                    <LibraryContext.Provider value={State.libraryContext(USER, LIBRARY)}>
                        <AuthorOptions {...BASE_PROPS}/>
                    </LibraryContext.Provider>
                </LoginContext.Provider>

            )
        });

        const {activeOnly, rows,// searchBar,
            add0, add1, pageNext, pageNumber, pagePrevious}
            = elements();

        await waitFor(() => {
            expect(activeOnly).not.toBeChecked();
            expect(add0).toBeDisabled();
            expect(add1).toBeDisabled();
            expect(pageNext).toBeDisabled();
            expect(pageNumber).toBeDisabled();
            expect(pagePrevious).toBeDisabled();
            expect(rows.length).toBe(2);  // The header rows
        })

    })

})