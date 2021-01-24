// RefreshToken --------------------------------------------------------------

// Refresh token created via @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import User from "./User";
import { validateRefreshTokenUnique } from "../util/async-validators";
import { BadRequest } from "../util/http-errors";

// Public Modules ------------------------------------------------------------

@Table({
    modelName: "refreshToken",
    tableName: "refresh_tokens",
    validate: {
        isTokenUnique: async function(this: RefreshToken): Promise<void> {
            if (!(await validateRefreshTokenUnique(this))) {
                throw new BadRequest
                    (`token: Token '${this.token}' is already in use`);
            }
        }
    }
})
export class RefreshToken extends Model {

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
        field: "access_token",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "accessToken: Is required"
            }
        }
    })
    accessToken!: string;

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

    @BelongsTo(() => User)
    user!: User;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        comment: "Primary key of the owning User",
        field: "user_id",
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "userId: Is required"
            }
        }
    })
    userId!: number;

}

export default RefreshToken;
