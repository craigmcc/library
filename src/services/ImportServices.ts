// ImportServices ------------------------------------------------------------

// Services for importing CSV file(s) of previously recorded books from a
// Google Drive spreadsheet.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";

// Public Objects ------------------------------------------------------------

import Library from "../models/Library";
import {NotFound} from "../util/http-errors";

class ImportServices {

    // Retrieve or create and retrieve the specified Author
    public findAuthor = async (libraryId: number, firstName: string, lastName: string): Promise<Object> => {
        const author = await Author.findOne({
            where: {
                firstName: firstName,
                lastName: lastName,
                libraryId: libraryId
            }
        });
        if (author) {
            return author;
        }
        const inserted = await Author.create({
            firstName: firstName,
            lastName: lastName,
            libraryId: libraryId,
        });
        return inserted;
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

