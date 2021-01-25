// AccessToken ---------------------------------------------------------------

// Model for an access token created via @craigmcc/basic-oauth2-server.

// External Modules ----------------------------------------------------------

import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import User from "./User";
import { validateAccessTokenUnique } from "../util/async-validators";
import { BadRequest } from "../util/http-errors";

// Public Modules ------------------------------------------------------------

@Table({
    modelName: "accessToken",
    tableName: "access_tokens",
    timestamps: false,
    validate: {
        isTokenUnique: async function(this: AccessToken): Promise<void> {
            if (!(await validateAccessTokenUnique(this))) {
                throw new BadRequest
                    (`token: Token '${this.token}' is already in use`);
            }
        }
    },
    version: false,
})
export class AccessToken extends Model {

    @Column({
        allowNull: false,
        autoIncrement: true,
        field: "id",
        primaryKey: true,
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "active: Is required",
            },
        },
    })
    id!: number;

    @Column({
        allowNull: false,
        field: "expires",
        type: DataType.DATE,
        validate: {
            notNull: {
                msg: "expires: Is required"
            }
        }
    })
    expires!: Date;

    @Column({
        allowNull: false,
        comment: "Authorized scopes (space-separated if multiple) for this access token.",
        field: "scope",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "scope: Is required"
            }
        }
    })
    scope!: string;

    @Column({
        allowNull: false,
        comment: "Access token value for this access token",
        field: "token",
        type: DataType.STRING,
        unique: true,
        validate: {
            notNull: {
                msg: "token: Is required"
            }
        }
    })
    token!: string;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        field: "user_id",
        type: DataType.BIGINT,
        validate: {
            notNull: {
                msg: "userId: Is required"
            }
        }
    })
    userId!: number;

}

export default AccessToken;
