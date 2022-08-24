// Model ---------------------------------------------------------------------

// Base interface for model classes so that we can use generics to
// implement common services.

// Public Objects ------------------------------------------------------------

class Model<M> {

    constructor(id?: number) {
        this.id = id ? id : -1;
    }

    public id: number;

}

export default Model;
