import React from "react";
import {render, screen/*, waitFor*/} from "@testing-library/react";
//import userEvent from "@testing-library/user-event";

import LibraryOptions from "./LibraryOptions";
//import Library from "../../models/Library";
//import * as MockLibraryServices from "../../test/MockLibraryServices";

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
    const rows = screen.getAllByRole("row"); // NOTE - just finds the one in <thead>
    // NOTE - We really only want the rows inside <tbody>
    // NOTE - Should be SeedData.LIBRARIES.length of them
    // NOTE - Need to mock authentication to see actual data
    const searchBar = screen.getByLabelText("Search For Libraries:");
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

test("disabled buttons on no handlers", async () => {

    render(<LibraryOptions/>);

    const {activeOnly,// rows, searchBar,
        add0, add1, pageNext, pageNumber, pagePrevious}
        = elements();

    expect(activeOnly).not.toBeChecked();

    expect(add0).toBeDisabled();
    expect(add1).toBeDisabled();
    expect(pageNext).toBeDisabled();
    expect(pageNumber).toBeDisabled();
    expect(pagePrevious).toBeDisabled();

});

/*
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
*/

/*
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
*/

/*
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
*/

/*
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
*/

/*
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
*/

/*
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
*/

