// LibraryList.test ----------------------------------------------------------

// Unit tests for LibraryList.

// External Modules -----------------------------------------------------------

import React from "react";
import {act, render, screen, waitFor} from "@testing-library/react";

// Internal Modules -----------------------------------------------------------

import LibraryContext from "./LibraryContext";
import LibraryList, {Props} from "./LibraryList";
import LoginContext from "../login/LoginContext";
import Library from "../../models/Library";
import User from "../../models/User";
import MockUserServices from "../../test/services/MockUserServices";
import * as SeedData from "../../test/SeedData";
import * as State from "../../test/State";

// Test Infrastructure -------------------------------------------------------

const PROPS: Props = {
    handleAdd: jest.fn(),
    handleEdit: jest.fn(),
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

    const activeOnly = screen.getByLabelText("Active Libraries Only?");
    expect(activeOnly).toBeInTheDocument();
    expect(activeOnly).not.toHaveAccessibleDescription("checked");
    const rows = screen.getAllByRole("row");  // Includes header row
    const searchBar = screen.getByLabelText("Search For Libraries:");
    expect(searchBar).toBeInTheDocument();

    const add0 = screen.getByTestId("add0");
    const add1 = screen.getByTestId("add1");
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

        add0: add0,
        add1: add1,
        pageNext: pageNext,
        pageNumber: pageNumber,
        pagePrevious: pagePrevious,
    };

}

// Test Methods --------------------------------------------------------------

describe("When logged in", () => {

    it("should list all Libraries", async () => {

        const LIBRARY: Library | null = null;
        const USER: User | null = MockUserServices.exact(SeedData.USER_USERNAME_REGULAR);
        await act(async () => {
            render(
                <LoginContext.Provider value={State.loginContext(USER)}>
                    <LibraryContext.Provider value={State.libraryContext(USER, LIBRARY)}>
                        <LibraryList {...PROPS}/>
                    </LibraryContext.Provider>
                </LoginContext.Provider>
            )
        })

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
            expect(rows.length).toBe(SeedData.LIBRARIES.length + 1);  // The header row + all Libraries
        })

    })

})

describe("When logged out", () => {

    it("should list no Libraries", async () => {

        const LIBRARY: Library | null = null;
        const USER: User | null = null;
        await act(async () => {
            render(
                <LoginContext.Provider value={State.loginContext(USER)}>
                    <LibraryContext.Provider value={State.libraryContext(USER, LIBRARY)}>
                        <LibraryList {...PROPS}/>
                    </LibraryContext.Provider>
                </LoginContext.Provider>
            )
        })

        const {activeOnly, rows,// searchBar,
            pageNext, pageNumber, pagePrevious}
            = elements();

        await waitFor(() => {
            expect(activeOnly).not.toBeChecked();
//            expect(add0).toBeDisabled();
//            expect(add1).toBeDisabled();
            expect(pageNext).toBeDisabled();
            expect(pageNumber).toBeDisabled();
            expect(pagePrevious).toBeDisabled();
            expect(rows.length).toBe(1);  // The header row
        })

    })

})
