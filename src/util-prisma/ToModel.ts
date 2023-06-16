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
