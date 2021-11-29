// UserData ------------------------------------------------------------------

// Fields from a User that might be visible in an input form.

// Public Objects ------------------------------------------------------------

class UserData {

    constructor (data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.name = data.name ? data.name : null;
        this.password = data.password ? data.password : null;
        this.scope = data.scope ? data.scope : null;
        this.username = data.username ? data.username : null;
    }

    id: number;
    active: boolean;
    name: string;
    password: string;
    scope: string;
    username: string;

}

export default UserData;
