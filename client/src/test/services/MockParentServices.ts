// MockParentServices --------------------------------------------------------

// Abstract base class for Services implementations for a Model class
// (one that does not require a parent instance for ownership), defining
// standard CRUD operation methods and required public helper methods.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockCommonServices, {ModelStatic} from "./MockCommonServices";
import Model from "../../models/Model";
import {NotFound, NotUnique} from "../../util/HttpErrors";

// Public Objects ------------------------------------------------------------

/**
 * Define standard CRUD operations for services of a parent Model class.
 *
 * @param M                             Constructor for Model class of the parent being supported
 */
abstract class MockParentServices<M extends Model<M>> extends MockCommonServices<M> {

    /**
     * Construct a new services instance for the specified Model.
     *
     * @param model                     Constructor for Model instance being supported
     */
    constructor (model: ModelStatic<M>) {
        super(model);
    }

    // Protected Data --------------------------------------------------------

    /**
     * The last ID value that has been used.  Should be incremented
     * in insert() processing if a new ID is needed, and reset to zero
     * in reset().
     */
    protected lastId = 0;

    /**
     * Model objects in this mock database, keyed by id.
     */
    protected map = new Map<number, M>();

    // Standard CRUD Operations ----------------------------------------------

    /**
     * Return all model instances that match the specified criteria.
     *
     * @param query                     Query parameters from HTTP request
     */
    public all(query?: URLSearchParams): M[] {
        const results: M[] = [];
        for (const result of this.map.values()) {
            if (this.matches(result, query)) {
                results.push(this.includes(result, query));
            }
        }
        return results;
    }

    /**
     * Return the model instance with the specified ID, or throw NotFound
     *
     * @param modelId                   ID of the requested instance
     * @param query                     Query parameters from HTTP request
     *
     * @throws NotFound                 If no such instance is found
     */
    public find(modelId: number, query?: URLSearchParams): M {
        return this.read(`${this.name}Services.find`, modelId, query);
    }

    /**
     * Insert and return a new model instance with the specified contents.
     *
     * @param model                     Object containing fields for the inserted instance
     *
     * @throws NotUnique                Object with this ID already exists
     */
    public insert(model: M): M {
        if (!model.id || (model.id < 0)) {
            model.id = ++this.lastId;
        }
        if (this.map.has(model.id)) {
            throw new NotUnique(`id: Duplicate ${this.name} identifier`,
                `${this.name}Services.insert`);
        }
        this.map.set(model.id, model);
        return model;
    }

    /**
     * Remove and return an existing instance.
     *
     * @param modelId                   ID of the instance to be removed
     *
     * @throws NotFound                 If no such instance exists.
     */
    public remove(modelId: number): M {
        const removed = this.read(`${this.name}Services.remove`, modelId);
        this.map.delete(modelId);
        return removed;
    }

    /**
     * Update the contents of an existing instance.
     *
     * @param modelId                   ID of the instance to be updated
     * @param model                     Model properties to be updated
     *
     * @throws NotFound                 If the specified child instance does not exist
     */
    public update(modelId: number, model: M): M {
        const original = this.read(`${this.name}Services.update`, modelId);
        const updated = {
            ...original,
            ...model,
            id: modelId,
        }
        this.map.set(modelId, updated);
        return updated;
    }

    // Default Helper Methods ------------------------------------------------

    /**
     * Find and return the requested model instance.
     *
     * @param context                   Call context for error messages
     * @param modelId                   ID of the requested model instance
     * @param query                     Query parameters from HTTP request
     *
     * @throws NotFound                 If no such instance exists
     */
    public read(context: string, modelId: number, query?: URLSearchParams): M {
        const result = this.map.get(modelId);
        if (result) {
            return this.includes(result, query);
        } else {
            throw new NotFound(
                `${this.key}: Missing ${this.name} ${modelId}`,
                context,
            );
        }

    }

    /**
     * Reset the internal "database" to contain no instances.
     */
    public reset() {
        //this.lastId = 0;
        this.map.clear();
    }

    // Abstract Helper Methods -----------------------------------------------

    /**
     * Return a decorated instance of this model with extra fields for any
     * specified child models based on the query parameters.
     *
     * @param model                     Model to be decorated
     * @param query                     Query parameters from HTTP request
     */
    public abstract includes(model: M, query?: URLSearchParams): M;

    /**
     * Return true if the specified model matches criteria in the specified query.
     *
     * @param model                     Model instance being checked
     * @param query                     Query parameters to match
     */
    public abstract matches(model: M, query?: URLSearchParams): boolean;

}

export default MockParentServices;
