// User ----------------------------------------------------------------------

// User allowed to log in to this application, with specified scope permissions.

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import RefreshToken from "./RefreshToken";
import UserData from "./UserData";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const USERS_BASE = "/users";

class User extends UserData {

    constructor(data: any = {}) {

        super(data);

        this.accessTokens = data.accessTokens ? ToModel.ACCESS_TOKENS(data.accessTokens) : undefined;
        this.refreshTokens = data.refreshTokens ? ToModel.REFRESH_TOKENS(data.refreshTokens) : undefined;

        this._model = "User";
        this._title = this.name;

    }

    accessTokens?: AccessToken[];
    refreshTokens?: RefreshToken[];

    _model: string;
    _title: string;

}

export default User;
