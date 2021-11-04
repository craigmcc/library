// AccessToken ---------------------------------------------------------------

// An access token that has been granted to a particular User.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import User from "./User";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

//export const ACCESS_TOKENS = "/accessTokens";

class AccessToken {

    constructor (data: any = {}) {

        this.id = data.id ? data.id : -1;
        this.expires = data.expires ? data.expires : null;
        this.scope = data.scope ? data.scope : null;
        this.token = data.token ? data.token : null;
        this.userId = data.userId ? data.userId : null;

        this.user = data.user ? ToModel.USER(data.user) : undefined;

    }

    id!: number;
    expires!: string;
    scope!: string;
    token!: string;
    userId!: number;

    user?: User;

}

export default AccessToken;
