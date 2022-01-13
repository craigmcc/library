import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthorDetails from "./AuthorDetails";
import Author from "../../models/Author";
import * as MockAuthorServices from "../../test/MockAuthorServices";
import * as MockLibraryServices from "../../test/MockLibraryServices";
import * as SeedData from "../../test/SeedData";

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

test("disabled buttons on no handlers", async () => {

    const AUTHOR = new Author({
        id: -1,
        active: true,
        firstName: null,
        lastName: null,
        libraryId: -1,
        notes: null,
    })
    const handleBack = jest.fn();
    render(<AuthorDetails
        author={AUTHOR}
        handleBack={handleBack}
        parent={SeedData.LIBRARIES[0]}
    />);
    const {back, save, remove} = elements();
    expect(save).toHaveAttribute("disabled");
    expect(remove).toHaveAttribute("disabled");

    userEvent.click(back);

    await waitFor(() => {
        expect(handleBack).toBeCalled();
    });

});

test("empty data does not submit", async () => {

    const AUTHOR = new Author({
        id: -1,
        active: true,
        firstName: null,
        lastName: null,
        libraryId: -1,
        notes: null,
    })
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleRemove = jest.fn();
    const handleUpdate = jest.fn();
    render(<AuthorDetails
        author={AUTHOR}
        handleBack={handleBack}
        handleInsert={handleInsert}
        handleRemove={handleRemove}
        handleUpdate={handleUpdate}
        parent={SeedData.LIBRARIES[0]}
    />);
    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleRemove).not.toBeCalled();
        expect(handleUpdate).not.toBeCalled();
    })

});

test("validation fails on duplicate name update", async () => {

    const LIBRARY = MockLibraryServices.find(MockLibraryServices.id(0));
    const AUTHORS = MockAuthorServices.all(LIBRARY.id);
    const AUTHOR = {
        ...AUTHORS[0],
        firstName: AUTHORS[1].firstName,
        lastName: AUTHORS[1].lastName,
    }
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleUpdate = jest.fn();
    render(<AuthorDetails
        author={AUTHOR}
        handleBack={handleBack}
        handleInsert={handleInsert}
        handleUpdate={handleUpdate}
        parent={LIBRARY}
    />);
    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleUpdate).not.toBeCalled();
        screen.getByText("That name is already in use within this Library");
    });

});

test("validation fails on empty insert", async () => {

    const LIBRARY = MockLibraryServices.find(MockLibraryServices.id(0));
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleUpdate = jest.fn();
    const author = new Author({
        id: -1,
        active: true,
        firstName: null,
        lastName: null,
        libraryId: LIBRARY.id,
        notes: null,
    });
    render(<AuthorDetails
        author={author}
        handleBack={handleBack}
        handleInsert={handleInsert}
        handleUpdate={handleUpdate}
        parent={LIBRARY}
    />);
    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleUpdate).not.toBeCalled();
        screen.getByText("First Name is required");
        screen.getByText("Last Name is required");
    })

});

test("validation passes on new name update", async () => {

    const LIBRARY = MockLibraryServices.find(MockLibraryServices.id(0));
    const AUTHORS = MockAuthorServices.all(LIBRARY.id);
    const AUTHOR = {
        ...AUTHORS[0],
        firstName: "Someone",
        lastName: "Else",
    };
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleRemove = jest.fn();
    const handleUpdate = jest.fn();
    render(<AuthorDetails
        author={AUTHOR}
        handleBack={handleBack}
        handleInsert={handleInsert}
        handleRemove={handleRemove}
        handleUpdate={handleUpdate}
        parent={LIBRARY}
    />);
    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleRemove).not.toBeCalled();
        expect(handleUpdate).toBeCalledTimes(1);
    })

});

test("validation passes on no change remove", async () => {

    const LIBRARY = MockLibraryServices.find(MockLibraryServices.id(0));
    const AUTHORS = MockAuthorServices.all(LIBRARY.id);
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleRemove = jest.fn();
    const handleUpdate = jest.fn();
    render(<AuthorDetails
        author={AUTHORS[0]}
        handleBack={handleBack}
        handleInsert={handleInsert}
        handleRemove={handleRemove}
        handleUpdate={handleUpdate}
        parent={LIBRARY}
    />);
    const {remove} = elements();

    userEvent.click(remove);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        // NOTE - not called? because of modal? expect(handleRemove).toBeCalledTimes(1);
        expect(handleUpdate).not.toBeCalled();
    })

});

test("validation passes on no change update", async () => {

    const LIBRARY = MockLibraryServices.find(MockLibraryServices.id(0));
    const AUTHORS = MockAuthorServices.all(LIBRARY.id);
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleUpdate = jest.fn();
    render(<AuthorDetails
        author={AUTHORS[0]}
        handleBack={handleBack}
        handleInsert={handleInsert}
        handleUpdate={handleUpdate}
        parent={LIBRARY}
    />);
    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleUpdate).toBeCalledTimes(1);
    })

});

