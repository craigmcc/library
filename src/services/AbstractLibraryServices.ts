// AbstractLibraryServices ---------------------------------------------------

// Abstract base class for Services implementations that support associations
// from a Library to other corresponding models.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Library from "../models/Library";
import {NotFound} from "../util/http-errors";

// Public Objects ------------------------------------------------------------

abstract class AbstractLibraryServices {

    /**
     * Return the Library for the specified libraryId, or throw
     * a NotFound error.
     */
    public async lookupLibrary(libraryId: number): Promise<Library> {
        const library = await Library.findByPk(libraryId);
        if (library) {
            return library;
        } else {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AbstractLibraryServices.lookupLibrary"
            );
        }
    }

}

export default AbstractLibraryServices;
