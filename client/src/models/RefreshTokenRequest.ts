// RefreshTokenRequest ------------------------------------------------------

// Request for an OAuth access token (and optional refresh token),
// given the specified refresh token.

// Public Objects ------------------------------------------------------------

class RefreshTokenRequest {

    constructor(data: any = {}) {
        this.grant_type = "password";
        this.refresh_token = data.refresh_token;
    }

    grant_type!: string;
    refresh_token!: string;

}

export default RefreshTokenRequest;
