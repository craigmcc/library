// VolumeStory.ts ------------------------------------------------------------

// Model for many-to-many relationship between Volumes and Stories.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript"

// Internal Modules ----------------------------------------------------------

import Story from "./Story";
import Volume from "./Volume";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "volumes_stories",
    timestamps: false,
    version: false,
})
class VolumeStory extends Model<VolumeStory> {

    @BelongsTo(() => Volume)
    volume!: Volume;

    @Column({
        allowNull: false,
        field: "volume_id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Volume)
    volumeId!: number;

    @BelongsTo(() => Story)
    story!: Story;

    @Column({
        allowNull: false,
        field: "story_id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Story)
    storyId!: number;

}

export default VolumeStory;
