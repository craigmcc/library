// Volume --------------------------------------------------------------------

// Volume of content in the specified Library.

// External Modules ----------------------------------------------------------

import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
import {
    validateISBN,
    validateMedia
} from "../util/application-validators";
import {
    validateLibraryId,
    validateVolumeNameUnique,
} from "../util/async-validators";
import { BadRequest } from "../util/http-errors";

// Public Objects ------------------------------------------------------------

@Table({
    modelName: "volume",
    tableName: "volumes",
    timestamps: false,
    validate: {
        isLibraryIdValid: async function(this: Volume): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                    (`libraryId: Invalid libraryId ${this.libraryId}`);
            }
        },
        isVolumeNameUnique: async function(this: Volume): Promise<void> {
            if (!await validateVolumeNameUnique(this)) {
                throw new BadRequest
                    (`name: Volume '${this.name}` +
                     " is already in use within this Library");
            }
        }
    },
    version: false,
})
class Volume extends Model {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    id!: number;

    @BelongsToMany(() => Author, () => AuthorVolume)
    authors!: Author[];

    @Column({
        allowNull: true,
        field: "isbn",
        type: DataType.STRING,
        validate: {
            isValidISBN: function(value: string): void {
                if (value) {
                    if (!validateISBN(value)) {
                        throw new BadRequest(`isbn: Invalid ISBN '${value}`);
                    }
                }
            }
        }
    })
    isbn?: string;

    @Column({
        allowNull: true,
        field: "location",
        type: DataType.STRING,
    })
    location?: boolean;

    @Column({
        allowNull: true,
        field: "media",
        type: DataType.STRING,
        validate: {
            isValidMedia: function(value: string): void {
                if (value) {
                    if (!validateMedia(value)) {
                        throw new BadRequest(`media: Invalid media '${value}`);
                    }
                }
            }
        }
    })
    media?: string;

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "name: Is required"
            }
        }
    })
    name!: string;

    @BelongsTo(() => Library)
    library!: Library;

    @ForeignKey(() => Library)
    @Column({
        allowNull: false,
        field: "library_id",
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "libraryId: Is required"
            }
        }
    })
    libraryId!: number;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.STRING,
    })
    notes?: string;

    @Column({
        allowNull: false,
        defaultValue: false,
        field: "read",
        type: DataType.BOOLEAN,
    })
    read!: boolean;

}

export default Volume;
