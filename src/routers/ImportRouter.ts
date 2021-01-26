// ImportRouter --------------------------------------------------------------

// Process CSV files to be imported into the specified Library

// External Modules ----------------------------------------------------------

import csv from "csvtojson";
import CSVError from "csvtojson/v2/CSVError";
import { Request, Response, Router } from "express";

// Internal Modules ----------------------------------------------------------

import { requireNotProduction } from "../oauth/MyMiddleware";
import ImportServices from "../services/ImportServices";
import logger from "../util/server-logger";
import Library from "../models/Library";

// Public Objects ------------------------------------------------------------

export class Problem extends Error {
    constructor(issue: string, resolution: string, row: any, fatal: boolean = false) {
        super(issue);
        this.issue = issue;
        this.resolution = resolution;
        this.row = row;
        this.fatal = fatal ? fatal : false
    }
    fatal: boolean;
    issue: string;
    resolution: string;
    row: any;
}

const ImportRouter = Router({
    strict: true
});

ImportRouter.use(requireNotProduction);

ImportRouter.post("/books",
    async (req: Request, res: Response) => {

        // Find the library for which we are importing books
        let library: Library = await ImportServices.findLibrary("Test Library");
        logger.info({
            context: "ImportBooks.library",
            library: library
        });

        // Accumulators and flags
        let currentAuthor: Object = {};     // TODO - use Author model when available
        let currentFirstName = "";
        let currentLastName = "";
        const problems: Problem[] = [];     // reported problems
        let authorsIn = 0;
        let rowsIn = 0;

        // Overall processing of the CSV request body
        await csv({
            noheader: false,
            headers: [
                "lastName",
                "firstName",
                "title",
                "year",
                "box",
                "read",
                "series",
                "ord",
                "notes"
            ]
        })
            .fromString(req.body)
            .subscribe(

                // Handle the next row from the CSV file
                async (row: any, index: number) => {

                    // Insert or retrieve author when name changes
                    if (!row.firstName) {
                        row.firstName = "";
                    }
                    if (!row.lastName) {
                        row.lastName = "";
                    }
                    if ((currentFirstName !== row.firstName) ||
                        (currentLastName !== row.lastName)) {
                        authorsIn++;
                        currentFirstName = row.firstName;
                        currentLastName = row.lastName;
                        currentAuthor = await ImportServices.findAuthor
                            (library.id, currentFirstName, currentLastName);
                        logger.info({
                            context: "ImportBooks.author",
                            author: currentAuthor,
                        });
                    }

                    // Process this row
                    // TODO

                    rowsIn++;

                },

                (error: CSVError) => {
                    logger.error({
                        context: "ImportRouter.books",
                        msg: error.message,
                        error: error
                    });
                    res.status(400).send({
                        problem: "CSV parsing error has occurred",
                        error: error,
                    });

                },

                () => {
                    const results = {
                        counts: {
                            authorsIn: authorsIn,
                            rowsIn: rowsIn
                        },
                        problems: problems
                    }
                    res.status(200).send(results);
                }

            );

    });

export default ImportRouter;
