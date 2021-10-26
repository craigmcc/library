// SeriesStory.ts ------------------------------------------------------------

// Model for many-to-many relationship between Seriess and Stories.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript"

// Internal Modules ----------------------------------------------------------

import Series from "./Series";
import Story from "./Story";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "series_stories",
    timestamps: false,
    version: false,
})
class SeriesStory extends Model<SeriesStory> {

    @Column({
        allowNull: true,
        field: "ordinal",
        type: DataType.INTEGER
    })
    // Ordinal position of this Story in this Series
    ordinal?: number;

    @BelongsTo(() => Series)
    series!: Series;

    @Column({
        allowNull: false,
        field: "series_id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Series)
    // ID of the source Series of this relationship
    seriesId!: number;

    @BelongsTo(() => Story)
    story!: Story;

    @Column({
        allowNull: false,
        field: "story_id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Story)
    // ID of the destination Story of this relationship
    storyId!: number;

}

export default SeriesStory;
