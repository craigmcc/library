// MockChildServices ---------------------------------------------------------

// Abstract base class for Services implementations for a Model class
// that requires a parent instance for ownership), defining standard
// CRUD operation methods and required public helper methods.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockCommonServices, {ModelStatic} from "./MockCommonServices";
import MockParentServices from "./MockParentServices";
import Model from "../../models/Model";
import {NotFound, NotUnique} from "../../util/HttpErrors";

// Public Objects -----------------------------------------------------------

/**
 * Define standard CRUD operations for services of a child Model class.
 *
 * @param C                             Model class of child
 * @param P                             Model class of parent
 */
abstract class MockChildServices<C extends Model<C>, P extends Model<P>> extends MockCommonServices<C> {

    /**
     * Construct a new Services instance for the specified child Model.
     *
     * @param parentInstance            Services instance parent Model class
     * @param child                     Constructor of child Model class
     */
    constructor(parentInstance: MockParentServices<P>, child: ModelStatic<C>) {
        super(child);
        this.parentInstance = parentInstance;
        this.parentKey = parentInstance.key
        this.parentName = parentInstance.name;
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
    protected map = new Map<number, C>();

    // Readonly Data --------------------------------------------------------

    /**
     * Model constructor of the parent service class's model.
     */
    public readonly parentInstance: MockParentServices<P>;

    /**
     * Name of the primary key reference for the parent model class.
     */
    public readonly parentKey: string;

    /**
     * Name of the parent model class.
     */
    public readonly parentName: string;

    // Standard CRUD Operations ----------------------------------------------

    /**
     * Return all child instances for the specified parent instance that
     * match the specified criteria.
     *
     * @param parentId                  ID of the required parent instance
     * @param query                     Query parameters from HTTP request
     */
    public all(parentId: number, query?: URLSearchParams): C[] {
        const results: C[] = [];
        const parent = this.readParent(`${this.name}Services.all`, parentId);
        for (const result of this.map.values()) {
            // @ts-ignore
            if ((result[this.parentKey] === parentId) && this.matches(result, query)) {
                results.push(this.includes(result, query));
            }
        }
        return results;
    }

    /**
     * Return the child instance with the specified ID, or throw NotFound.
     *
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     * @param query                     Query parameters from HTTP request
     *
     * @throws NotFound                 If no such instance is found
     */
    public find(parentId: number, childId: number, query?: URLSearchParams): C {
        return this.read(`${this.name}Services.find`, parentId, childId, query);
    }

    /**
     * Insert and return a new model instance with the specified contents.
     *
     * @param parentId                  ID of the required parent instance
     * @param child                     Contents of the child model to be updated
     */
    public insert(parentId: number, child: C): C {
        const parent = this.parentInstance.read(`${this.name}Services.insert`, parentId);
        if (!child.id || (child.id < 0)) {
            child.id = ++this.lastId;
        }
        if (this.map.has(child.id)) {
            throw new NotUnique(`id: Duplicate ${this.name} identifier`,
                `${this.name}Services.insert`);
        }
        this.map.set(child.id, {
            ...child,
            [`${this.parentKey}`]: parentId,
        });
        return child;
    }

    /**
     * Remove and return an existing child instance.
     *
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the child instance to be removed
     *
     * @throws NotFound                 If the specified child instance does not exist
     */
    public remove(parentId: number, childId: number): C {
        const removed = this.read(`${this.name}Services.remove`, parentId, childId);
        this.map.delete(childId);
        return removed;
    }

    /**
     * Update the contents of an existing child instance.
     *
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the child instance to be updated
     * @param child                     Child properties to be updated
     *
     * @throws NotFound                 If the specified child instance does not exist
     */
    public update(parentId: number, childId: number, child: C): C{
        const original = this.read(`${this.name}Services.update`, parentId, childId);
        const updated = {
            ...original,
            ...child,
            id: childId,
        }
        this.map.set(childId, updated);
        return updated;
    }

    // Default Helper Methods ------------------------------------------------

    /**
     * Find and return the requested child instance.
     *
     * @param context                   Call context for error messages
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     * @param query                     Query parameters from HTTP request
     *
     * @throws NotFound                 If no such instance exists
     */
    public read(context: string, parentId: number, childId: number, query?: URLSearchParams): C {
        const parent = this.readParent(context, parentId);
        const child = this.map.get(childId);
        // @ts-ignore -- TODO make sure this works
        if (child && (child[this.parentKey] === parent["id"])) {
            return this.includes(child, query);
        } else {
            throw new NotFound(
                `${this.key}: Missing ${this.name} ${childId}`,
                context
            );
        }
    }

    /**
     * Find and return the required parent instance.
     *
     * @param context                   Call context for error messages
     * @parem parentId                  ID of the required parent instance
     *
     * @throws NotFound                 If no such instance exists
     */
    public readParent(context: string, parentId: number): P {
        const parent = this.parentInstance.read(context, parentId);
        if (parent) {
            return parent;
        } else {
            throw new NotFound(
                `${this.parentKey}: Missing ${this.parentName} ${parentId}`,
                context
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
     * Return a decorated instanceo of this model with extra fields for any
     * specified child models based on the query parameters.
     *
     * @param model                     Model to be decorated
     * @param query                     Query parameters from HTTP request
     */
    public abstract includes(model: C, query?: URLSearchParams): C;

    /**
     * Return true if the specified model matches criteria in the specified query.
     *
     * @param model                     Model instance being checked
     * @param query                     Query parameters to match
     */
    public abstract matches(model: C, query?: URLSearchParams): boolean;

}

export default MockChildServices;
