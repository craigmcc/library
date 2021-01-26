// ImportServices ------------------------------------------------------------

// Services for importing CSV file(s) of previously recorded books from a
// Google Drive spreadsheet.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

import Library from "../models/Library";
import {NotFound} from "../util/http-errors";

class ImportServices {

    // Retrieve or create and retrieve the specified Author
    // TODO - for real when Author model is available
    public findAuthor = async (libraryId: number, firstName: string, lastName: string): Promise<Object> => {
        return { libraryId: libraryId, firstName: firstName, lastName: lastName };
    }

    // Retrieve the Library for which we are importing
    public findLibrary = async (name: string): Promise<Library> => {
        const library = await Library.findOne({
            where: { name: name }
        });
        if (library) {
            return library;
        } else {
            throw new NotFound(
                `name: Missing Library '${name}'`,
                "ImportServices.findLibrary"
            );
        }
    }

}

export default new ImportServices();

