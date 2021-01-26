// Author --------------------------------------------------------------------

// Author of content in the specified Library.

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

import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
import Volume from "./Volume";
import {
    validateAuthorNameUnique,
    validateLibraryId,
} from "../util/async-validators";
import { BadRequest } from "../util/http-errors";

// Public Objects ------------------------------------------------------------

// @ts-ignore
@Table({
    modelName: "author",
    tableName: "authors",
    timestamps: false,
    validate: {
        isLibraryIdValid: async function(this: Author): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                (`libraryId: Invalid libraryId ${this.libraryId}`);
            }
        },
        isAuthorNameUnique: async function(this: Author): Promise<void> {
            if (!await validateAuthorNameUnique(this)) {
                throw new BadRequest
                    (`name: Author '${this.firstName} ${this.lastName}` +
                     " is already in use within this Library");
            }
        }
    },
    version: false,
})
class Author extends Model {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    id!: number;

    @Column({
        allowNull: false,
        defaultValue: true,
        field: "active",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "active: Is required"
            }
        }
    })
    active!: boolean;

    @Column({
        allowNull: false,
        field: "first_name",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "firstName: Is required"
            }
        }
    })
    firstName!: string;

    @Column({
        allowNull: false,
        field: "last_name",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "lastName: Is required"
            }
        }
    })
    lastName!: string;

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

    @BelongsToMany(() => Volume, () => AuthorVolume)
    volumes!: Volume[];

}

export default Author;
