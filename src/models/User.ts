// User ----------------------------------------------------------------------

// User that can be authenticated via @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import RefreshToken from "./RefreshToken";
import {validateUserUsernameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "users",
    timestamps: false,
    validate: {
        isUserUsernameUnique: async function (this: User): Promise<void> {
            if (!(await validateUserUsernameUnique(this))) {
                throw new BadRequest
                    (`username: Username '${this.username}' is already in use`);
            }
        }
    },
    version: false,
})
class User extends Model<User> {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER
    })
    // Primary key for this User
    id!: number;

    @HasMany(() => AccessToken, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // AccessTokens owned by this User
    accessTokens!: AccessToken[];

    @Column({
        allowNull: false,
        defaultValue: true,
        field: "active",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "active: Is required",
            }
        }
    })
    // Is this User active?
    active!: boolean;

    @Column({
        allowNull: true,
        field: "google_books_api_key",
        type: DataType.TEXT,
    })
    // API key for this User on Google Books
    googleBooksApiKey!: string;

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "name: Is required",
            }
        }
    })
    // Name (or role) of this User
    name!: string;

    @Column({
        allowNull: false,
        field: "password",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "password: Is required",
            }
        }
    })
    // Login password for this User (hashed in the database)
    password!: string;

    @HasMany(() => RefreshToken, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // RefreshTokens owned by this User
    refreshTokens!: RefreshToken[];

    @Column({
        allowNull: false,
        field: "scope",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "scope: Is required",
            }
        }
    })
    // Scope(s) authorized for this User
    scope!: string;

    @Column({
        allowNull: false,
        field: "username",
        type: DataType.TEXT,
        unique: "uniqueUserUsername",
        validate: {
            notNull: {
                msg: "username: Is required",
            }
        }
    })
    // Login username for this User
    username!: string;

}

export default User;
