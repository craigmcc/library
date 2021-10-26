// Author ---------------------------------------------------------------------

// Contributor to one or more Series, Stories, and/or Volumes.

// External Modules ----------------------------------------------------------

import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AuthorSeries from "./AuthorSeries";
import AuthorStory from "./AuthorStory";
import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
import {validateLibraryId, validateAuthorNameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "authors",
    timestamps: false,
    validate: {
        isLibraryIdValid: async function(this: Author): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                (`libraryId: Missing Library ${this.libraryId}`);
            }
        },
        isNameUnique: async function(this: Author): Promise<void> {
            if (!(await validateAuthorNameUnique(this))) {
                throw new BadRequest
                (`name: Name '${this.firstName} ${this.lastName}' is already in use in this Library`);
            }
        },
    },
    version: false,
})
export class Author extends Model<Author> {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER
    })
    // Primary key for this Author
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
    // Is this Author active?
    active!: boolean;

    // Next three fields in this order to get the unique index correct

    @BelongsTo(() => Library)
    library!: Library;

    @ForeignKey(() => Library)
    @Column({
        allowNull: false,
        field: "library_id",
        type: DataType.INTEGER,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "libraryId: Is required"
            }
        },
    })
    // Library ID that owns this Author
    libraryId!: number;

    @Column({
        allowNull: false,
        field: "last_name",
        type: DataType.STRING,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "lastName: Is required"
            },
        }
    })
    // Unique (within Library) last name of this Author
    lastName!: string;

    @Column({
        allowNull: false,
        field: "first_name",
        type: DataType.STRING,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "firstName: Is required"
            },
        }
    })
    // Unique (within Library) first name of this Author
    firstName!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.STRING
    })
    // General notes about this Author
    notes?: string;

    @BelongsToMany(() => Series, () => AuthorSeries)
    // Related Series, present only if Author is retrieved with withSeries
    series!: Array<Series & {AuthorSeries: AuthorSeries}>;

    // Join Table contents, present only if Author retrieved with withSeries
    AuthorSeries?: AuthorSeries;

    @BelongsToMany(() => Story, () => AuthorStory)
    // Related Stories, present only if Author is retrieved withStories
    stories!: Array<Story & {AuthorStory: AuthorStory}>;

    // Join Table contents, present only if Author retrieved with withStories
    AuthorStory?: AuthorStory;

    @BelongsToMany(() => Volume, () => AuthorVolume)
    volumes!: Array<Volume & {AuthorVolume: AuthorVolume}>;

    // Join Table contents, present only if Author retrieved with withVolumes
    AuthorVolume?: AuthorVolume;

}

export default Author;
