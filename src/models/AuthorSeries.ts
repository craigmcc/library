// AuthorSeries.ts ------------------------------------------------------------

// Model for many-to-many relationship between Authors and Series.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript"

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Series from "./Series";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "authors_series",
    timestamps: false,
    version: false,
})
class AuthorSeries extends Model<AuthorSeries> {

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
    // Is this a principal Author for this Series?
    principal?: boolean;

    @BelongsTo(() => Series)
    series!: Series;

    @Column({
        allowNull: false,
        field: "series_id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Series)
    // ID of the destination Series of this relationship
    seriesId!: number;

}

export default AuthorSeries;
