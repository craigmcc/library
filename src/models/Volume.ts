// Volume --------------------------------------------------------------------

// Physical or electronic published unit, written by one or more Authors,
// and containing one or more Stories.

// External Modules ----------------------------------------------------------

import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

//import Author from "./Author";
//import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
//import Story from "./Story";
//import VolumeStory from "./VolumeStory";
import {validateLibraryId, validateVolumeNameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "volumes",
    timestamps: false,
    validate: {
        isLibraryIdValid: async function(this: Volume): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                (`name: Name '${this.name}' is already in use in this Library`);
            }
        },
        isVolumeNameUnique: async function(this: Volume): Promise<void> {
            if (!(await validateVolumeNameUnique(this))) {
                throw new BadRequest
                    (`name: Name '${this.name}' is already in use in this Library`);
            }
        },
    },
    version: false,
})
export class Volume extends Model<Volume> {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER
    })
    // Primary key for this Volume
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
    // Is this Volume active?
    active!: boolean;

/*
    @BelongsToMany(() => Author, () => AuthorVolume)
    authors!: Array<Author & {AuthorVolume: AuthorVolume}>;
*/

    @Column({
        allowNull: true,
        field: "copyright",
        type: DataType.STRING
    })
    // Copyright year for this Volume
    copyright?: string;

    @Column({
        allowNull: true,
        field: "google_id",
        type: DataType.STRING,
    })
    // Google Books ID for this Volume
    googleId?: string;

    @Column({
        allowNull: true,
        field: "isbn",
        type: DataType.STRING
    })
    // ISBN ID for this Volume
    isbn?: string;

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
    // Library ID that owns this Volume
    libraryId!: number;

    @Column({
        allowNull: true,
        field: "location",
        type: DataType.STRING,
    })
    // Physical location of this Volume
    location?: string;

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
    // Unique (within Library) name of this Volume
    name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.STRING
    })
    // General notes about this Volume
    notes?: string;

    @Column({
        allowNull: false,
        defaultValue: false,
        field: "read",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "read: Is required"
            }
        }
    })
    // Has this Volume been read?
    read!: boolean;

/*
    @BelongsToMany(() => Story, () => VolumeStory)
    stories!: Array<Story & {VolumeStory: VolumeStory}>;
*/

    @Column({
        allowNull: false,
        field: "type",
        type: DataType.STRING,
    })
    type!: string;



}

export default Volume;
