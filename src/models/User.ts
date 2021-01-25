// User ----------------------------------------------------------------------

// User authenticated via @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import RefreshToken from "./RefreshToken";
import Library from "./Library";
import {
    validateLibraryId,
    validateUserUsernameUnique
} from "../util/async-validators";
import { validateLevel } from "../util/application-validators";
import { BadRequest } from "../util/http-errors";

// Public Modules ------------------------------------------------------------

@Table({
    modelName: "user",
    tableName: "users",
    timestamps: false,
    validate: {
        isLibraryIdValid: async function(this: User): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                    (`libraryId: Invalid libraryId ${this.libraryId}`);
            }
        },
        isUsernameUnique: async function(this: User): Promise<void> {
            if (!(await validateUserUsernameUnique(this))) {
                throw new BadRequest
                    (`username: Username '${this.username}' "
                         + "is already in use`);
            }
        },
    },
    version: false,
})
export class User extends Model {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER,
    })
    id!: number;

    @HasMany(() => AccessToken)
    accessTokens!: AccessToken[];

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

    @Column({
        allowNull: false,
        defaultValue: "info",
        field: "level",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "level: Is required"
            },
            isValidLevel: function(value: string): void {
                if (value) {
                    if (!validateLevel(value)) {
                        throw new BadRequest
                        (`level: Invalid level ${value}`);
                    }
                }
            }
        }
    })
    level!: string;

    @BelongsTo(() => Library)
    library!: Library;

    @ForeignKey(() => Library)
    @Column({
        allowNull: false,
        field: "library_id",
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "libraryId: Is required"
            }
        }
    })
    libraryId!: number;

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "name: Is required"
            }
        }
    })
    name!: string;

    @Column({
        allowNull: false,
        field: "password",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "password: Is required"
            }
        },
    })
    password!: string;

    @HasMany(() => RefreshToken)
    refreshTokens!: RefreshToken[];

    @Column({
        allowNull: false,
        field: "scope",
        type: DataType.STRING,
    })
    scope!: string;

    @Column({
        allowNull: false,
        field: "username",
        type: DataType.STRING,
        unique: "uniqueUsername",
        validate: {
            notNull: {
                msg: "username: Is required"
            }
        }
    })
    username!: string;

}

export default User;
