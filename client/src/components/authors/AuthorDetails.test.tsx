// AuthorDetails.test --------------------------------------------------------

// Unit tests for AuthorDetails.

// External Modules ----------------------------------------------------------

import React from "react";
import {act, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Internal Modules ----------------------------------------------------------

import AuthorDetails, {Props} from "./AuthorDetails";
import Author from "../../models/Author";
import Library from "../../models/Library";
import * as MockAuthorServices from "../../test/MockAuthorServices";
import * as MockLibraryServices from "../../test/MockLibraryServices";
import * as SeedData from "../../test/SeedData";

// Test Infrastructure -------------------------------------------------------

const elements = (showPrincipal: boolean = false): {
    // Fields
    active: HTMLElement,
    firstName: HTMLElement,
    lastName: HTMLElement,
    notes: HTMLElement,
    principal: HTMLElement | null,
    // Buttons
    back: HTMLElement,
    remove: HTMLElement,
    save: HTMLElement,
} => {

    const active = screen.getByLabelText("Active?");
    expect(active).toBeInTheDocument();
    const firstName = screen.getByLabelText("First Name:");
    expect(firstName).toBeInTheDocument();
    const lastName = screen.getByLabelText("Last Name:");
    expect(lastName).toBeInTheDocument();
    const notes = screen.getByLabelText("Notes:");
    expect(notes).toBeInTheDocument();
    const principal = screen.queryByLabelText("Principal Author?");
    if (showPrincipal) {
        expect(principal).toBeInTheDocument();
    }

    const back = screen.getByRole("button", { name: "Back" });
    expect(back).toBeInTheDocument();
    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toBeInTheDocument();
    const remove = screen.getByRole("button", { name: "Remove" });
    expect(remove).toBeInTheDocument();

    return {
        active,
        firstName,
        lastName,
        notes,
        principal,
        back,
        remove,
        save,
    };

}

// Test Methods --------------------------------------------------------------

describe("Invalid Data", () => {

    it("should fail validation on duplicate name update", async () => {

        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ONE_NAME);
        const AUTHORS = MockAuthorServices.all(LIBRARY.id, {});
        const AUTHOR = {
            ...AUTHORS[0],
            firstName: AUTHORS[1].firstName,
            lastName: AUTHORS[1].lastName,
        }
        const PROPS: Props = {
            author: AUTHOR,
            handleBack: jest.fn(),
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleUpdate: jest.fn(),
            parent: LIBRARY,
        }
        await act(() => {
            render(<AuthorDetails {...PROPS}/>);
        });

        const {save} = elements();
        userEvent.click(save);

        await waitFor(() => {
            expect(PROPS.handleBack).not.toBeCalled();
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleRemove).not.toBeCalled();
            expect(PROPS.handleUpdate).not.toBeCalled();
            screen.getByText("That name is already in use within this Library");
        });

    });

    it("should fail validation on empty insert", async () => {

        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ZERO_NAME);
        const AUTHOR = new Author({
            id: -1,
            active: true,
            firstName: null,
            lastName: null,
            libraryId: LIBRARY.id,
            notes: null,
        });
        const PROPS: Props = {
            author: AUTHOR,
            handleBack: jest.fn(),
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleUpdate: jest.fn(),
            parent: LIBRARY,
        }
        await act(async () => {
            render(<AuthorDetails {...PROPS}/>);
        });

        const {save} = elements();
        userEvent.click(save);

        await waitFor(() => {
            expect(PROPS.handleBack).not.toBeCalled();
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleUpdate).not.toBeCalled();
            screen.getByText("First Name is required");
            screen.getByText("Last Name is required");
        });

    });

    it("should not submit empty data", async () => {

        const AUTHOR = new Author({
            id: -1,
            active: true,
            firstName: null,
            lastName: null,
            libraryId: -1,
            notes: null,
        });
        const PROPS: Props = {
            author: AUTHOR,
            handleBack: jest.fn(),
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleUpdate: jest.fn(),
            parent: new Library(),
        }
        await act(async () => {
            render(<AuthorDetails {...PROPS}/>);
        });

        const {save} = elements();
        userEvent.click(save);

        await waitFor(() => {
            expect(PROPS.handleBack).not.toBeCalled();
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleRemove).not.toBeCalled();
            expect(PROPS.handleUpdate).not.toBeCalled();
        });

    });

})

describe("No Handlers", () => {

    it("should disable buttons", async () => {

        const AUTHOR = new Author({
            id: -1,
            active: true,
            firstName: null,
            lastName: null,
            libraryId: -1,
            notes: null,
        });
        const PROPS: Props = {
            author: AUTHOR,
            handleBack: jest.fn(),
            parent: new Library(),
        }
        await act(async () => {
            render(<AuthorDetails {...PROPS}/>);
        });

        const {back, save, remove} = elements();
        await waitFor(() => {
            expect(save).toHaveAttribute("disabled");
            expect(remove).toHaveAttribute("disabled");
        })
        userEvent.click(back);

        await waitFor(() => {
            expect(PROPS.handleBack).toBeCalledTimes(1);
        });

    });

})

describe("Valid Data", () => {

    it("should pass validation on name update", async () => {

        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_TWO_NAME);
        const AUTHORS = MockAuthorServices.all(LIBRARY.id, {});
        const AUTHOR = {
            ...AUTHORS[0],
            firstName: "Someone",
            lastName: "Else",
        };
        const PROPS: Props = {
            author: AUTHOR,
            handleBack: jest.fn(),
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleUpdate: jest.fn(),
            parent: new Library(),
        }
        await act(async () => {
            render(<AuthorDetails {...PROPS}/>);
        });

        const {save} = elements();
        userEvent.click(save);

        await waitFor(() => {
            expect(PROPS.handleBack).not.toBeCalled();
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleRemove).not.toBeCalled();
            expect(PROPS.handleUpdate).toBeCalledTimes(1);
        });

    });

    it("should pass validation on name update", async () => {

        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ZERO_NAME);
        const AUTHORS = MockAuthorServices.all(LIBRARY.id, {});
        const AUTHOR = {
            ...AUTHORS[0],
            firstName: "Someone",
            lastName: "Else",
        };
        const PROPS: Props = {
            author: AUTHOR,
            handleBack: jest.fn(),
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleUpdate: jest.fn(),
            parent: new Library(),
        }
        await act(async () => {
            render(<AuthorDetails {...PROPS}/>);
        });

        const {save} = elements();
        userEvent.click(save);

        await waitFor(() => {
            expect(PROPS.handleBack).not.toBeCalled();
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleRemove).not.toBeCalled();
            expect(PROPS.handleUpdate).toBeCalledTimes(1);
        });

    });

    it("should pass validation on no change update", async () => {

        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_TWO_NAME);
        const AUTHORS = MockAuthorServices.all(LIBRARY.id, {});
        const PROPS: Props = {
            author: AUTHORS[2],
            handleBack: jest.fn(),
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleUpdate: jest.fn(),
            parent: LIBRARY,
        }
        await act(async () => {
            render(<AuthorDetails {...PROPS}/>);
        });

        const {save} = elements();
        userEvent.click(save);

        await waitFor(() => {
            expect(PROPS.handleBack).not.toBeCalled();
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleRemove).not.toBeCalled();
            expect(PROPS.handleUpdate).toBeCalledTimes(1);
        })

    });

    it("should pass validation on remove", async () => {

        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ONE_NAME);
        const AUTHORS = MockAuthorServices.all(LIBRARY.id, {});
        const PROPS: Props = {
            author: AUTHORS[1],
            handleBack: jest.fn(),
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleUpdate: jest.fn(),
            parent: LIBRARY,
        }
        await act(async () => {
            render(<AuthorDetails {...PROPS}/>);
        });

        const {remove} = elements();
        userEvent.click(remove);

        await waitFor(() => {
            expect(PROPS.handleBack).not.toBeCalled();
            expect(PROPS.handleInsert).not.toBeCalled();
            // NOTE - not called because of modal - expect(PROPS.handleRemove).toBeCalledTimes(1);
            expect(PROPS.handleUpdate).not.toBeCalled();
        });

    });

})

