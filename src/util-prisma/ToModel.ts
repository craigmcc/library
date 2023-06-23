// util-prisma/ToModel.ts

/**
 * Utilities to convert arbitrary input into correctly typed model objects.
 *
 * TODO: Having to do this with individual field names is lame, look for choices.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
    Author,
    Library,
    Series,
    Story,
    User,
    Volume,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Convert an arbitrary input into a Author object.
 */
export const AUTHOR = (input: any): Author => {
    const output: Author = {
        id: input.id ? input.id : undefined,
        active: (typeof input.active === "boolean") ? input.active : undefined,
        firstName: (typeof input.firstName === "string") ? input.firstName : undefined,
        lastName: (typeof input.lastName === "string") ? input.lastName : undefined,
        libraryId: (typeof input.libraryId === "number") ? input.libraryId : undefined,
        notes: (typeof input.notes === "string") ? input.notes : undefined,
    };
    return output;
}

/**
 * Convert an array of arbitrary input into an array of Story objects.
 */
export const AUTHORS = (inputs: any[]): Author[] => {
    const outputs: Author[] = [];
    inputs.forEach(input => {
        outputs.push(AUTHOR(input));
    });
    return outputs;
}

/**
 * Convert an arbitrary input into a Library object.
 */
export const LIBRARY = (input: any): Library => {
    const output: Library = {
        id: input.id ? input.id : undefined,
        active: (typeof input.active === "boolean") ? input.active : undefined,
        name: (typeof input.name === "string") ? input.name : undefined,
        notes: (typeof input.notes === "string") ? input.notes : undefined,
        scope: (typeof input.scope === "string") ? input.scope : undefined,
    };
    return output;
}

/**
 * Convert an array of arbitrary input into an array of Library objects.
 */
export const LIBRARIES = (inputs: any[]): Library[] => {
    const outputs: Library[] = [];
    inputs.forEach(input => {
        outputs.push(LIBRARY(input));
    });
    return outputs;
}

/**
 * Convert an arbitrary input into a Series object.
 */
export const SERIES = (input: any): Series => {
    const output: Series = {
        id: input.id ? input.id : undefined,
        active: (typeof input.active === "boolean") ? input.active : undefined,
        copyright: (typeof input.copyright === "string") ? input.string : undefined,
        libraryId: (typeof input.libraryId === "number") ? input.libraryId : undefined,
        name: (typeof input.name === "string") ? input.name : undefined,
        notes: (typeof input.notes === "string") ? input.notes : undefined,
    }
    return output;
}

/**
 * Convert an array of arbitrary input into an array of Series objects.
 */
export const SERIESES = (inputs: any[]): Series[] => {
    const outputs: Series[] = [];
    inputs.forEach(input => {
        outputs.push(SERIES(input));
    });
    return outputs;
}

/**
 * Convert an arbitrary input into a Story object.
 */
export const STORY = (input: any): Story => {
    const output: Story = {
        id: input.id ? input.id : undefined,
        active: (typeof input.active === "boolean") ? input.active : undefined,
        copyright: (typeof input.copyright === "string") ? input.copyright : undefined,
        libraryId: (typeof input.libraryId === "number") ? input.libraryId : undefined,
        name: (typeof input.name === "string") ? input.name : undefined,
        notes: (typeof input.notes === "string") ? input.notes : undefined,
    };
    return output;
}

/**
 * Convert an array of arbitrary input into an array of Story objects.
 */
export const STORIES = (inputs: any[]): Story[] => {
    const outputs: Story[] = [];
    inputs.forEach(input => {
        outputs.push(STORY(input));
    });
    return outputs;
}

/**
 * Convert an arbitrary input into a User object.
 */
export const USER = (input: any): User => {
    const output: User = {
        id: input.id ? input.id : undefined,
        active: (typeof input.active === "boolean") ? input.active : undefined,
        google_books_api_key: (typeof input.google_books_api_key === "string") ? input.google_books_api_key : undefined,
        name: (typeof input.name === "string") ? input.name : undefined,
        password: (typeof input.password === "string") ? input.password : undefined,
        scope: (typeof input.scope === "string") ? input.scope : undefined,
        username: (typeof input.username === "string") ? input.username : undefined,
    }
    return output;
}

/**
 * Convert an array of arbitrary input into an array of User objects.
 */
export const USERS = (inputs: any[]): User[] =>{
    const outputs: User[] = [];
    inputs.forEach(input => {
        outputs.push(USER(input));
    });
    return outputs;
}

/**
 * Convert an arbitrary input into a Volume object.
 */
export const VOLUME = (input: any): Volume => {
    const output: Volume = {
        id: input.id ? input.id : undefined,
        active: (typeof input.active === "boolean") ? input.active : undefined,
        copyright: (typeof input.copyright === "string") ? input.copyright : undefined,
        googleId: (typeof input.goodleId === "string") ? input.googleId : undefined,
        isbn: (typeof input.isbn === "string") ? input.isbn : undefined,
        libraryId: (typeof input.libraryId === "number") ? input.libraryId : undefined,
        location: (typeof input.location === "string") ? input.location : undefined,
        name: (typeof input.name === "string") ? input.name : undefined,
        notes: (typeof input.notes === "string") ? input.notes : undefined,
        read: (typeof input.read === "boolean") ? input.read : undefined,
        type: (typeof input.type === "string") ? input.type : undefined,
    }
    return output;
}

/**
 * Convert an array of arbitrary input into an array of Volume objects.
 */
export const VOLUMES = (inputs: any[]): Volume[] =>{
    const outputs: Volume[] = [];
    inputs.forEach(input => {
        outputs.push(VOLUME(input));
    });
    return outputs;
}

