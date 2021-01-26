// LibraryVolumeServices -----------------------------------------------------

// Services implementation for Library -> Volume models.

// External Modules ----------------------------------------------------------

import { FindOptions, Op } from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractLibraryServices from "./AbstractLibraryServices";
import Volume from "../models/Volume";
import Library from "../models/Library";
import { BadRequest, NotFound, ServerError } from "../util/http-errors";
import { appendPagination } from "../util/query-parameters";
import { VOLUME_ORDER } from "../util/sort-orders";

const VOLUMES_FIELD = "volumes";

// Public Objects ------------------------------------------------------------

class LibraryVolumeServices extends AbstractLibraryServices {

    // Public Methods --------------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Volume[]> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            order: VOLUME_ORDER,
        }, query);
        const results = await library.$get(VOLUMES_FIELD, options);
        return results;
    }

    public async exact(
        libraryId: number, name: string, query?: any
    ): Promise<Volume> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            where: {
                name: name,
            },
        }, query);
        const results = await library.$get(VOLUMES_FIELD, options);
        if (results.length < 1) {
            throw new NotFound(
                `name: Missing Volume '${name}'`,
                "LibraryVolumeServices.exact"
            );
        }
        return results[0];
    }

    public async find(
        libraryId: number, volumeId: number, query?: any
    ): Promise<Volume> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            where: {
                id: volumeId,
            },
        }, query);
        const results = await library.$get(VOLUMES_FIELD, options);
        if (results.length < 1) {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                "LibraryVolumeServices.find"
            );
        }
        return results[0];
    }

    public async insert(libraryId: number, volume: Volume): Promise<Volume> {
        const library = await this.lookupLibrary(libraryId);
        volume.libraryId = libraryId; // No cheating
        const result = await Volume.create(volume, {
            fields: fields
        });
        return result;
    }

    public async name(
        libraryId: number, name: string, query?: any
    ): Promise<Volume[]> {
        const library = await this.lookupLibrary(libraryId);
        const options = this.appendQuery({
            order: VOLUME_ORDER,
            where: {
                name: {[Op.iLike]: '%{name}%'},
            }
        })
        const results = await library.$get(VOLUMES_FIELD, options);
        return results;
    }

    public async remove(libraryId: number, volumeId: number): Promise<Volume> {
        const library = await this.lookupLibrary(libraryId);
        const removed = await Volume.findByPk(volumeId);
        if (!removed) {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                "LibraryVolumeServices.remove"
            );
        }
        if (removed.libraryId !== library.id) { // No cheating
            throw new BadRequest(
                `volumeId: Volume ${volumeId} does not belong to this Library`,
                "LibraryVolumeServices.remove"
            );
        }
        const count = await Volume.destroy({
            where: { id: volumeId }
        });
        if (count < 1) {
            throw new NotFound(
                `volumeId: Cannot remove Volume ${volumeId}`,
                "LibraryVolumeServices.remove"
            );
        }
        return removed;
    }

    public async update(
        libraryId: number, volumeId: number, volume: Volume
    ): Promise<Volume> {
        const library = await this.lookupLibrary(libraryId);
        const updated = await Volume.findByPk(volumeId);
        if (!updated) {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                "LibraryVolumeServices.update"
            );
        }
        if (updated.libraryId !== library.id) { // No cheating
            throw new BadRequest(
                `volumeId: Volume ${volumeId} does not belong to this Library`,
                "LibraryVolumeServices.update"
            );
        }
        volume.id = volumeId;
        const [count, dummy] = await Volume.update(volume, {
            fields: fieldsWithId,
            where: { id: volumeId }
        });
        if (count !== 1) {
            throw new ServerError(
                `volumeId: Cannot update Volume ${volumeId}`,
                "LibraryVolumeServices.update"
            );
        }
        const result = await Volume.findByPk(volumeId);
        if (result) {
            return result;
        } else {
            throw new ServerError(
                `volumeId: Cannot reload Volume ${volumeId}`,
                "LibraryVolumeServices.update"
            );
        }
    }

    // Private Methods --------------------------------------------------------

    private appendQuery(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPagination(options, query);
        let include = [];
        if ("" === query.withLibrary) {
            include.push(Library);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

}

export default new LibraryVolumeServices();

// Private Objects -----------------------------------------------------------

const fields: string[] = [
    "isbn",
    "libraryId",
    "location",
    "media",
    "name",
    "notes",
    "read",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
