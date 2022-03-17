// LibrarySelector.test ------------------------------------------------------

// Unit tests for LibrarySelector.

// External Modules ----------------------------------------------------------

import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";

// Internal Modules ----------------------------------------------------------

import LibrarySelector, {Props} from "./LibrarySelector";
import LibraryContext from "./LibraryContext";
import LoginContext from "../login/LoginContext";
import Library from "../../models/Library";
import User from "../../models/User";
import * as MockLibraryServices from "../../test/MockLibraryServices";
import * as MockUserServices from "../../test/MockUserServices";
import * as SeedData from "../../test/SeedData";
import * as State from "../../test/State";

// Test Infrastructure -------------------------------------------------------

const PROPS: Props = {
    disabled: false,
    handleLibrary: jest.fn(),
    label: "My Library",
    name: "myLibrary"
}

type Elements = {
    // Fields
    select: HTMLElement,
}

const elements = function (): Elements {

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    return {
        select: select,
    }
}

// Test Methods --------------------------------------------------------------

describe("When logged in", function () {

    it("should show the available Libraries with none selected", () => {

        const library: Library | null = null;
        const user = MockUserServices.exact(SeedData.USER_USERNAME_SUPERUSER);
        render(
            <LoginContext.Provider value={State.loginContext(user)}>
                <LibraryContext.Provider value={State.libraryContext(user, library)}>
                    <LibrarySelector {...PROPS}/>
                </LibraryContext.Provider>
            </LoginContext.Provider>
        );

        const {select} = elements();
        expect(select).toHaveValue(String(-1));
        expect(select.childElementCount).toBe(SeedData.LIBRARIES.length + 1);
        expect(PROPS.handleLibrary).not.toBeCalled();

    })

    it("should show the available Libraries with one selected", () => {

        const libraries = MockLibraryServices.all({});
        const INDEX = 1;
        const library = libraries[INDEX];
        const user = MockUserServices.exact(SeedData.USER_USERNAME_REGULAR);
        render(
            <LoginContext.Provider value={State.loginContext(user)}>
                <LibraryContext.Provider value={State.libraryContext(user, library)}>
                    <LibrarySelector {...PROPS}/>
                </LibraryContext.Provider>
            </LoginContext.Provider>
        );

        const {select} = elements();
        expect(select).toHaveValue(String(INDEX));
        expect(select.childElementCount).toBe(SeedData.LIBRARIES.length + 1);
        expect(PROPS.handleLibrary).not.toBeCalled();

    })

    it("should change state when a different option is selected", () => {

        const INDEX = SeedData.LIBRARIES.length - 1; // Last Library in list
        const libraries = MockLibraryServices.all({});
        const library = null;
        const user = MockUserServices.exact(SeedData.USER_USERNAME_REGULAR);
        render(
            <LoginContext.Provider value={State.loginContext(user)}>
                <LibraryContext.Provider value={State.libraryContext(user, library)}>
                    <LibrarySelector {...PROPS}/>
                </LibraryContext.Provider>
            </LoginContext.Provider>
        );

        const {select} = elements();
        expect(select).toHaveValue(String(-1));

        fireEvent.change(select, { target: { value: String(INDEX) } });

        expect(select).toHaveValue(String(INDEX));
        expect(PROPS.handleLibrary).toBeCalledWith(libraries[INDEX]);

    })

})

describe("When logged out", () => {

    it("should show no available libraries", () => {

        const library: Library | null = null;
        const user: User | null = null;
        render(
            <LoginContext.Provider value={State.loginContext(user)}>
                <LibraryContext.Provider value={State.libraryContext(user, library)}>
                    <LibrarySelector {...PROPS}/>
                </LibraryContext.Provider>
            </LoginContext.Provider>
        );

        const {select} = elements();
        expect(select).toHaveValue(String(-1));
        expect(select.childElementCount).toBe(1);
        expect(PROPS.handleLibrary).not.toBeCalled();

    })


})
