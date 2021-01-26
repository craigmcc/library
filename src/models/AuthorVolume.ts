// AuthorVolume --------------------------------------------------------------

// Many-to-Many Author - Volume join table.

// External Modules ----------------------------------------------------------

import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Volume from "./Volume";

// Public Objects ------------------------------------------------------------

@Table({
    modelName: "author_volume",
    tableName: "authors_volumes",
    timestamps: false,
    version: false,
})
class AuthorVolume extends Model {

    @ForeignKey(() => Author)
    @Column({
        allowNull: false,
        field: "author_id",
        type: DataType.INTEGER,
        unique: "uniqueJoin",
    })
    author_id!: number;

    @ForeignKey(() => Volume)
    @Column({
        allowNull: false,
        field: "volume_id",
        type: DataType.INTEGER,
        unique: "uniqueJoin",
    })
    volume_id!: number;

}

export default AuthorVolume;
