// Library -------------------------------------------------------------------

// Model for an overall collection of authors, series, stories, and volumes.

// External Modules ----------------------------------------------------------

import {
    Column,
    DataType,
    HasMany, Model,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

//import Author from "./Author";
//import Story from "./Story";
import User from "./User";
import {
    validateLibraryNameUnique
} from "../util/async-validators";
import {BadRequest} from "../util/http-errors";

// Public Modules ------------------------------------------------------------

@Table({
    modelName: "library",
    tableName: "libraries",
    validate: {
        isNameUnique: async function(this: Library): Promise<void> {
            if (!(await validateLibraryNameUnique(this))) {
                throw new BadRequest
                    (`name: Name ${this.name} is already in use`);
            }
        }
    }
})
export class Library extends Model {

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

//    @HasMany(() => Author)
//    authors!: Author[];

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.STRING,
        unique: true,
        validate: {
            notNull: {
                msg: "name: Is required"
            },
        }
    })
    name!: string;

    @Column({
        allowNull: true,
        type: DataType.STRING
    })
    notes?: string;

    @Column({
        allowNull: false,
        field: "scope",
        type: DataType.STRING,
        unique: true,
        validate: {
            notNull: {
                msg: "scope: Is required"
            }
        }
    })
    scope!: string;

//    @HasMany(() => Series)
//    series!: Series[];

//    @HasMany(() => Story)
//    stories!: Story[];

    @HasMany(() => User)
    users!: User[];

//    @HasMany(() => Volume)
//    volumes!: Volume[];

}

export default Library;
