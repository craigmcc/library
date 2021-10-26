// AuthorVolume.ts ------------------------------------------------------------

// Model for many-to-many relationship between Authors and Volumes.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript"

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Volume from "./Volume";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "authors_volumes",
    timestamps: false,
    version: false,
})
class AuthorVolume extends Model<AuthorVolume> {

    @BelongsTo(() => Author)
    author!: Author;

    @Column({
        allowNull: false,
        field: "author_id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Author)
    // ID of the source Author of this relationship
    authorId!: number;

    @Column({
        allowNull: true,
        field: "principal",
        type: DataType.BOOLEAN,
    })
    // Is this a principal Author for this Volume?
    principal?: boolean;

    @BelongsTo(() => Volume)
    volume!: Volume;

    @Column({
        allowNull: false,
        field: "volume_id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Volume)
    // ID of the destination Volume of this relationship
    volumeId!: number;

}

export default AuthorVolume;
