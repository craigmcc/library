// LibraryForm.test ----------------------------------------------------------

// Unit tests for LibraryForm.

// External Modules ----------------------------------------------------------

import React from "react";
import {act, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Internal Modules ----------------------------------------------------------

import LibraryForm, {Props} from "./LibraryForm";
import Library from "../../models/Library";
import MockLibraryServices from "../../test/services/MockLibraryServices";
import * as SeedData from "../../test/SeedData";

// Test Infrastructure -------------------------------------------------------

const elements = (): {
    // Fields
    active: HTMLElement,
    name: HTMLElement,
    notes: HTMLElement,
    scope: HTMLElement,
    // Buttons
    back: HTMLElement,
    remove: HTMLElement,
    save: HTMLElement,
} => {

    const active = screen.getByLabelText("Active?");
    expect(active).toBeInTheDocument();
    const name = screen.getByLabelText("Name:");
    expect(name).toBeInTheDocument();
    const notes = screen.getByLabelText("Notes:");
    expect(notes).toBeInTheDocument();
    const scope = screen.getByLabelText("Scope:");

    const back = screen.getByTestId("back");
    expect(back).toBeInTheDocument();
    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toBeInTheDocument();
    const remove = screen.getByRole("button", { name: "Remove" });
    expect(remove).toBeInTheDocument();

    return {
        active,
        name,
        notes,
        scope,
        back,
        remove,
        save,
    };

}

// Test Methods --------------------------------------------------------------

describe("Invalid Data", () => {

    it("should fail validation on duplicate name update", async () => {

        const LIBRARIES = MockLibraryServices.all();
        const LIBRARY = {
            ...LIBRARIES[0],
            name: LIBRARIES[1].name,
        }
        const PROPS: Props = {
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleReturn: jest.fn(),
            handleUpdate: jest.fn(),
            library: LIBRARY,
        }
        await act(async () => {
            render(<LibraryForm {...PROPS}/>);
        });

        const {save} = elements();
        const client = userEvent.setup();
        await client.click(save);

        await waitFor(() => {
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleRemove).not.toBeCalled();
            expect(PROPS.handleUpdate).not.toBeCalled();
            screen.getByText("That name is already in use");
        });

    });

    it("should fail validation on empty insert", async () => {

        const library = new Library({
            id: -1,
            active: true,
            name: null,
            notes: null,
            scope: null,
        });
        const PROPS: Props = {
            handleInsert: jest.fn(),
            handleReturn: jest.fn(),
            handleUpdate: jest.fn(),
            library: library,
        }
        await act(async () => {
            render(<LibraryForm {...PROPS}/>);
        })

        const {save} = elements();
        const client = userEvent.setup();
        await client.click(save);

        await waitFor(() => {
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleReturn).not.toBeCalled();
            expect(PROPS.handleUpdate).not.toBeCalled();
            screen.getByText("Name is required");
            screen.getByText("Scope is required");
        });

    });

    it("should not submit empty data", async () => {

        const LIBRARY = new Library({
            id: -1,
            active: true,
            name: null,
            notes: null,
            scope: null,
        });
        const PROPS: Props = {
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleReturn: jest.fn(),
            handleUpdate: jest.fn(),
            library: LIBRARY,
        }
        await act(async () => {
            render(<LibraryForm {...PROPS}/>);
        })

        const {save} = elements();
        const client = userEvent.setup();
        await client.click(save);

        await waitFor(() => {
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleRemove).not.toBeCalled();
            expect(PROPS.handleReturn).not.toBeCalled();
            expect(PROPS.handleUpdate).not.toBeCalled();
        });

    });

})

describe("No Handlers", () => {

    it("should disable buttons", async () => {

        const LIBRARY = new Library({
            id: -1,
            active: true,
            name: null,
            notes: null,
            scope: null,
        });
        const PROPS: Props = {
            handleReturn: jest.fn(),
            library: LIBRARY
        }
        await act(async () => {
            render(<LibraryForm {...PROPS}/>);
        })

        const {back, save, remove} = elements();
        await waitFor(() => {
            expect(save).toBeDisabled();
            expect(remove).toBeDisabled();
        })

        const client = userEvent.setup();
        await client.click(back);

        await waitFor(() => {
            expect(PROPS.handleReturn).toBeCalledTimes(1);
        });

    })

})

describe("Valid Data", () => {

    it("should pass validation on insert", async () => {

        const LIBRARY: Library = new Library({
            id: -1,
            name: "Brand New Library",
            scope: "brand",
        });
        const PROPS: Props = {
            handleInsert: jest.fn(),
            handleReturn: jest.fn(),
            library: LIBRARY,
        }
        await act(async () => {
            render(<LibraryForm {...PROPS}/>);
        })

        const {save} = elements();
        const client = userEvent.setup();
        await client.click(save);

        await waitFor(() => {
            expect(PROPS.handleInsert).toBeCalledTimes(1);
            expect(PROPS.handleReturn).not.toBeCalled();
        });

    })

    it("should pass validation on name update", async () => {

        const ORIGINAL = MockLibraryServices.exact(SeedData.LIBRARY_ONE_NAME);
        const LIBRARY = {
            ...ORIGINAL,
            name: ORIGINAL.name + " Modified",
        }
        const PROPS: Props = {
            handleInsert: jest.fn(),
            handleRemove: jest.fn(),
            handleReturn: jest.fn(),
            handleUpdate: jest.fn(),
            library: LIBRARY,
        }
        await act(async () => {
            render(<LibraryForm {...PROPS}/>);
        })

        const {save} = elements();
        const client = userEvent.setup();
        await client.click(save);

        await waitFor(() => {
            expect(PROPS.handleInsert).not.toBeCalled();
            expect(PROPS.handleRemove).not.toBeCalled();
            expect(PROPS.handleReturn).not.toBeCalled();
            expect(PROPS.handleUpdate).toBeCalledTimes(1);
        });

    })

    it("should pass validation on no change update", async () => {

        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_ZERO_NAME);
        const PROPS: Props = {
            handleReturn: jest.fn(),
            handleUpdate: jest.fn(),
            library: LIBRARY,
        }
        await act(async () => {
            render(<LibraryForm {...PROPS}/>);
        })

        const {save} = elements();
        const client = userEvent.setup();
        await client.click(save);

        await waitFor(() => {
            expect(PROPS.handleReturn).not.toBeCalled();
            expect(PROPS.handleUpdate).toBeCalledTimes(1);
        });

    })

    it("should pass validation on remove", async () => {

        const LIBRARY = MockLibraryServices.exact(SeedData.LIBRARY_TWO_NAME);
        const PROPS: Props = {
            handleRemove: jest.fn(),
            handleReturn: jest.fn(),
            library: LIBRARY,
        }
        await act(async () => {
            render(<LibraryForm {...PROPS}/>);
        })

        const {remove} = elements();
        const client = userEvent.setup();
        await client.click(remove);

        await waitFor(() => {
            // NOTE - not called because of modal - expect(PROPS.handleRemove).toBeCalledTimes(1);
            expect(PROPS.handleReturn).not.toBeCalled();
        })

    })

})
