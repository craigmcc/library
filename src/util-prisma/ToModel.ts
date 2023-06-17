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
    Library,
    Prisma,
    User,
} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

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

