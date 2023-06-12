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
        active: input.active ? input.active : undefined,
        name: input.name ? input.name : undefined,
        notes: input.notes ? input.notes : undefined,
        scope: input.scope ? input.scope : undefined,
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
