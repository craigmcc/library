// Story ---------------------------------------------------------------------

// Individual story or novel, may be a participant in one or more Series,
// published in one or more Volumes, and written by one or more Authors.

// External Modules ----------------------------------------------------------

import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import AuthorStory from "./AuthorStory";
import Library from "./Library";
import Series from "./Series";
import SeriesStory from "./SeriesStory";
import Volume from "./Volume";
import VolumeStory from "./VolumeStory";
import {validateLibraryId, validateStoryNameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "stories",
    timestamps: false,
    validate: {
        isLibraryIdValid: async function(this: Story): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                    (`libraryId: Missing Library ${this.libraryId}`);
            }
        },
        isNameUnique: async function(this: Story): Promise<void> {
            if (!(await validateStoryNameUnique(this))) {
                throw new BadRequest
                    (`name: Name '${this.name}' is already in use in this Library`);
            }
        },
    },
    version: false,
})
export class Story extends Model<Story> {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER
    })
    // Primary key for this Story
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
    // Is this Story active?
    active!: boolean;

    @BelongsToMany(() => Author, () => AuthorStory)
    // Related Authors, present only if Story retrieved with withAuthors
    authors!: Array<Author & {AuthorStory: AuthorStory}>;

    // Join Table contents, present only if Story retrieved with withAuthors
    AuthorStory?: AuthorStory;

    @Column({
        allowNull: true,
        field: "copyright",
        type: DataType.STRING
    })
    // Copyright year for this Story
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
    // Library ID that owns this Story
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
    // Unique (within Library) name of this Story
    name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.STRING
    })
    // General notes about this Story
    notes?: string;

    @BelongsToMany(() => Series, () => SeriesStory)
    // Related Series, present only if Story is retrieved with withSeries
    series!: Array<Series & {SeriesStory: SeriesStory}>;

    // Join Table contents, present only if Story retrieved with withSeries
    SeriesStory?: SeriesStory;

    @BelongsToMany(() => Volume, () => VolumeStory)
    // Related Volumes, present only if Story is retrieved with withVolumes
    volumes!: Array<Volume & {VolumeStory: VolumeStory}>;

    // Join Table contents, present only if Story retrieved with withVolumes
    VolumeStory?: VolumeStory;

}

export default Story;
