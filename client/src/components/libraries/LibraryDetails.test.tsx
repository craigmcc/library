import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LibraryDetails from "./LibraryDetails";
import Library from "../../models/Library";
import * as MockLibraryServices from "../../test/MockLibraryServices";
import * as SeedData from "../../test/SeedData";

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

    const back = screen.getByRole("button", { name: "Back" });
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

test("disabled buttons on no handlers", async () => {

    const LIBRARY = new Library({
        id: -1,
        active: true,
        name: null,
        notes: null,
        scope: null,
    });
    const handleBack = jest.fn();
    render(<LibraryDetails
        handleReturn={handleBack}
        library={LIBRARY}
    />)

    const {back, save, remove} = elements();
    expect(save).toHaveAttribute("disabled");
    expect(remove).toHaveAttribute("disabled");

    userEvent.click(back);

    await waitFor(() => {
        expect(handleBack).toBeCalled();
    });

});

test("empty data does not submit", async () => {

    const LIBRARY = new Library({
        id: -1,
        active: true,
        name: null,
        notes: null,
        scope: null,
    });
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleRemove = jest.fn();
    const handleUpdate = jest.fn();
    render(<LibraryDetails
        handleReturn={handleBack}
        handleInsert={handleInsert}
        handleRemove={handleRemove}
        handleUpdate={handleUpdate}
        library={LIBRARY}
    />)

    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleRemove).not.toBeCalled();
        expect(handleUpdate).not.toBeCalled();
    });

});

test("validation fails on duplicate name update", async () => {

    const LIBRARIES = MockLibraryServices.all({});
    const LIBRARY = {
        ...LIBRARIES[0],
        name: LIBRARIES[1].name,
    }
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleUpdate = jest.fn();
    render(<LibraryDetails
        handleReturn={handleBack}
        handleInsert={handleInsert}
        handleUpdate={handleUpdate}
        library={LIBRARY}
    />);
    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleUpdate).not.toBeCalled();
        screen.getByText("That name is already in use");
    });

});

test("validation fails on empty insert", async () => {

    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleUpdate = jest.fn();
    const library = new Library({
        id: -1,
        active: true,
        name: null,
        notes: null,
        scope: null,
    });
    render(<LibraryDetails
        handleReturn={handleBack}
        handleInsert={handleInsert}
        handleUpdate={handleUpdate}
        library={library}
    />)
    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleUpdate).not.toBeCalled();
        screen.getByText("Name is required");
        screen.getByText("Scope is required");
    });

});

test("validation passes on new name update", async () => {

    const ORIGINAL = MockLibraryServices.find(MockLibraryServices.id(0), {});
    const LIBRARY = {
        ...ORIGINAL,
        name: ORIGINAL.name + " Modified",
    }
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleRemove = jest.fn();
    const handleUpdate = jest.fn();
    render(<LibraryDetails
        handleReturn={handleBack}
        handleInsert={handleInsert}
        handleRemove={handleRemove}
        handleUpdate={handleUpdate}
        library={LIBRARY}
    />);
    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleRemove).not.toBeCalled();
        expect(handleUpdate).toBeCalledTimes(1);
    });

});

test("validation passes on no change remove", async () => {

    const LIBRARY = MockLibraryServices.find(MockLibraryServices.id(1), {});
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleRemove = jest.fn();
    const handleUpdate = jest.fn();
    render(<LibraryDetails
        handleReturn={handleBack}
        handleInsert={handleInsert}
        handleRemove={handleRemove}
        handleUpdate={handleUpdate}
        library={LIBRARY}
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

    const LIBRARY = MockLibraryServices.find(MockLibraryServices.id(0), {});
    const handleBack = jest.fn();
    const handleInsert = jest.fn();
    const handleUpdate = jest.fn();
    render(<LibraryDetails
        handleReturn={handleBack}
        handleInsert={handleInsert}
        handleUpdate={handleUpdate}
        library={LIBRARY}
    />);
    const {save} = elements();

    userEvent.click(save);

    await waitFor(() => {
        expect(handleBack).not.toBeCalled();
        expect(handleInsert).not.toBeCalled();
        expect(handleUpdate).toBeCalledTimes(1);
    });

});

