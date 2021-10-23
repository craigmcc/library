// Library -------------------------------------------------------------------

// Overall collection of authors, series, stories, and volumes.

// External Modules ----------------------------------------------------------

import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

//import Author from "./Author";
import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
import {validateLibraryScope} from "../util/ApplicationValidators";
import {validateLibraryNameUnique, validateLibraryScopeUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "libraries",
    timestamps: false,
    validate: {
        isNameUnique: async function(this: Library): Promise<void> {
            if (!(await validateLibraryNameUnique(this))) {
                throw new BadRequest
                    (`name: Name '${this.name}' is already in use`);
            }
        },
        isScopeUnique: async function(this: Library): Promise<void> {
            if (!(await validateLibraryScopeUnique(this))) {
                throw new BadRequest
                    (`scope: Scope '${this.scope}' is already in use`);
            }
        },
    },
    version: false,
})
class Library extends Model<Library> {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER
    })
    // Primary key for this Library
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
    // Is this Library active?
    active!: boolean;

/*
    @HasMany(() => Author, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Authors included in this Library
    authors!: Author[];
*/

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.TEXT,
        unique: "uniqueLibraryName",
        validate: {
            notNull: {
                msg: "name: Is required"
            },
        }
    })
    // Globally unique name of this Library
    name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.TEXT
    })
    // General notes about this Library
    notes?: string;

    @Column({
        allowNull: false,
        field: "scope",
        type: DataType.TEXT,
        unique: true,
        validate: {
            isValidScope: function (value: string): void {
                if (!validateLibraryScope(value)) {
                    throw new BadRequest(`scope: Scope '${value}' must not contain spaces`);
                }
            },
            notNull: {
                msg: "scope: Is required"
            },
        }
    })
    // Globally unique scope prefix for this Library
    scope!: string;

    @HasMany(() => Series, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
        // Series included in this Library
    series!: Series[];

    @HasMany(() => Story, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Stories included in this Library
    stories!: Story[];

    @HasMany(() => Volume, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Volumes included in this Library
    volumes!: Volume[];

}

export default Library;
