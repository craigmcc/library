// AuthorStory.ts ------------------------------------------------------------

// Model for many-to-many relationship between Authors and Stories.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript"

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Story from "./Story";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "authors_stories",
    timestamps: false,
    version: false,
})
class AuthorStory extends Model<AuthorStory> {

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
    // Is this a principal Author for this Story?
    principal?: boolean;

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

export default AuthorStory;
