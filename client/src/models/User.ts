// User ----------------------------------------------------------------------

// User allowed to log in to this application, with specified scope permissions.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

import AccessToken from "./AccessToken";
import RefreshToken from "./RefreshToken";
import * as ToModel from "../util/ToModel";

export const USERS_BASE = "/users";

class User {

    constructor(data: any = {}) {

        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.name = data.name ? data.name : null;
        this.password = data.password ? data.password : null;
        this.scope = data.scope ? data.scope : null;
        this.username = data.username ? data.username : null;

        this.accessTokens = data.accessTokens ? ToModel.ACCESS_TOKENS(data.accessTokens) : undefined;
        this.refreshTokens = data.refreshTokens ? ToModel.REFRESH_TOKENS(data.refreshTokens) : undefined;

    }

    id!: number;
    active!: boolean;
    name!: string;
    password!: string;  // Hashed in the database
    scope!: string;
    username!: string;

    accessTokens?: AccessToken[];
    refreshTokens?: RefreshToken[];

}

export default User;
