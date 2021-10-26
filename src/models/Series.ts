// Series --------------------------------------------------------------------

// A named and ordered list of Stories in the same timeline.

// External Modules ----------------------------------------------------------

import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

//import Author from "./Author";
//import AuthorSeries from "./AuthorSeries";
import Library from "./Library";
import SeriesStory from "./SeriesStory";
import Story from "./Story";
import {validateLibraryId, validateSeriesNameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "series",
    timestamps: false,
    validate: {
        isLibraryIdValid: async function(this: Series): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                    (`libraryId: Missing Library ${this.libraryId}`);
            }
        },
        isNameUnique: async function(this: Series): Promise<void> {
            if (!(await validateSeriesNameUnique(this))) {
                throw new BadRequest
                    (`name: Name '${this.name}' is already in use in this Library`);
            }
        },
    },
    version: false,
})
export class Series extends Model<Series> {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER
    })
    // Primary key for this Series
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
    // Is this Series active?
    active!: boolean;

    /*
        @BelongsToMany(() => Author, () => AuthorSeries)
        authors!: Array<Author & {AuthorSeries: AuthorSeries}>;
    */

    @Column({
        allowNull: true,
        field: "copyright",
        type: DataType.STRING
    })
    // Copyright year for this Series
    copyright?: string;

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
    // Library ID that owns this Series
    libraryId!: number;

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.STRING,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "name: Is required"
            },
        }
    })
    // Unique (within Library) name of this Series
    name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.STRING
    })
    // General notes about this Series
    notes?: string;

    @BelongsToMany(() => Story, () => SeriesStory)
    stories!: Array<Story & {SeriesStory: SeriesStory}>;

}

export default Series;
