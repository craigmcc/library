// RefreshToken --------------------------------------------------------------

// A refresh token that has been granted to a particular User.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import User from "./User";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

//export const REFRESH_TOKENS = "/refreshTokens";

class RefreshToken {

    constructor (data: any = {}) {

        this.id = data.id ? data.id : -1;
        this.accessToken = data.accessToken ? data.accessToken : null;
        this.expires = data.expires ? data.expires : null;
        this.token = data.token ? data.token : null;
        this.userId = data.userId ? data.userId : null;

        this.user = data.user ? ToModel.USER(data.user) : undefined;

    }

    id!: number;
    accessToken!: string;
    expires!: string;
    token!: string;
    userId!: number;

    user?: User;

}

export default RefreshToken;
