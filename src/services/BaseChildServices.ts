/**
 * Base class for "child" models, that require a parentId method parameter
 * (for this application, that will generally be a libraryId) to determine
 * the scope within which to select the specified child model(s).

 It defines the standard CRUD operations for this model, as well as
 standard helper methods that can be utilized by related services.
 @packageDocumentation */

// BaseChildServices ---------------------------------------------------------

// External Modules ----------------------------------------------------------

import {FindOptions, Order, ValidationError} from "sequelize";
import {Model, ModelStatic} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import BaseCommonServices from "./BaseCommonServices";
import {BadRequest, NotFound, NotUnique, ServerError} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

/**
 * Define standard CRUD operations for services of a child Model class.
 *
 * @param C                             Constructor for Model class of the child being supported
 * @param P                             Constructor for Model class of the required parent
 */
export default abstract class BaseChildServices<C extends Model, P extends Model> extends BaseCommonServices<C> {

    /**
     * Construct a new services instance for the specified child Sequelize Model.
     *
     * @param parent                    Model instance of parent being supported
     * @param child                     Model instance of child being supported
     * @param fields                    List of field names for this Model (no "id")
     * @param order                     Order object for standard sorting order
     *
     */
    constructor (parent: ModelStatic<P>, child: ModelStatic<C>, order: Order, fields: string[]) {
        super(child, order, fields);
        this.parentInstance = parent;
        this.parentKey = parent.name.toLowerCase() + "Id";
        this.parentName = parent.name;
    }

    /**
     * Sequelize Model instance of the parent for this service class's model.
     */
    protected readonly parentInstance: ModelStatic<P>;

    /**
     * Name of the primary key reference for the parent model class.
     */
    protected readonly parentKey: string;

    /**
     * Name of the parent model class.
     */
    protected readonly parentName: string;

    // Standard CRUD Operations ----------------------------------------------

    /**
     * Return all child instances that match the specified criteria.
     *
     * @param parentId                  ID of the required parent instance
     * @param query                     Optional match query parameters from HTTP request
     *
     * @returns List of matching child instances
     */
    public async all(parentId: number, query?: object): Promise<C[]> {
        await this.readParent(`${this.name}Services.all`, parentId);
        const options: FindOptions = this.appendMatchOptions({
            order: this.order,
            where: {
                [`${this.parentKey}`]: parentId,
            }
        }, query);
        // @ts-ignore
        return await this.model.findAll(options);
    }

    /**
     * Return the child instance with the specified ID.
     *
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     * @param query                     Optional include query parameters from the HTTP request
     *
     * @returns Requested model
     *
     * @throws NotFound if the requested child instance cannot be found
     */
    public async find(parentId: number, childId: number, query?: any): Promise<C> {
        return await this.read(
            `${this.name}Services.find`,
            parentId,
            childId,
            query
        );
    }

    /**
     * Insert and return a new child instance with the specified contents.
     *
     * @param parentId                  ID of the required parent model instance
     * @param child                     Object containing fields for the inserted instance
     *
     * @returns Inserted child instance (with "id" field)
     *
     * @throws BadRequest if validation error(s) occur
     * @throws NotFound if the specified model instance does not exist
     * @throws NotUnique if a unique key violation is attempted
     * @throws ServerError if some other error occurs
     */
    public async insert(parentId: number, child: Partial<C>): Promise<C> {
        await this.readParent(`${this.name}Services.insert`, parentId);
        try {
            child = {
                ...child,
                [`${this.parentKey}`]: parentId, // No cheating
            };
            // @ts-ignore
            return await this.model.create(child, {
                fields: this.fields,
            });
        } catch (error) {
            if (error instanceof BadRequest) {
                throw error;
            } else if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof NotUnique) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    `${this.name}.insert`
                );
            } else {
                throw new ServerError(
                    error as Error,
                    `${this.name}.insert`
                );
            }
        }
    }

    /**
     * Remove and return an existing child instance.
     *
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     *
     * @returns Removed child instance
     *
     * @throws NotFound if the specified child instance does not exist
     */
    public async remove(parentId: number, childId: number): Promise<C> {
        const child = await this.read(`${this.name}Services.remove`, parentId, childId);
        // @ts-ignore
        await this.model.destroy({
            where: { id: childId }
        });
        return child;
    }

    /**
     * Update and return an existing child instance.
     *
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     * @param child                     Object containing fields to be updated
     *
     * @returns Updated child instance
     *
     * @throws BadRequest if validation error(s) occur
     * @throws NotFound if the specified model instance does not exist
     * @throws NotUnique if a unique key violation is attempted
     * @throws ServerError if some other error occurs
     */
    public async update(parentId: number, childId: number, child: Partial<C>): Promise<C> {
        await this.readParent(`${this.name}Services.update`, parentId);
        try {
            child = {
                ...child,
                id: childId, // No cheating
                [`${this.parentKey}`]: parentId, // No cheating
            };
            // @ts-ignore
            const results = await this.model.update(child, {
                fields: this.fieldsWithId,
                returning: true,
                where: {id: childId},
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `${this.key}: Missing ${this.name} ${childId}`,
                    `${this.name}.update`
                );
            }
            return results[1][0];
        } catch (error) {
            if (error instanceof BadRequest) {
                throw error;
            } else if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof NotUnique) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    `${this.name}Services.update`
                );
            } else {
                throw new ServerError(
                    error as Error,
                    `${this.name}Services.update`
                );
            }
        }
    }

    // Public Helper Methods -------------------------------------------------

    /**
     * Find and return the requested child instance.
     *
     * @param context                   Call context for error messages
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     * @param query                     Optional include query parameters
     *
     * @returns Requested child instance
     *
     * @throws BadRequest if this child instance does not exist
     */
    public async read(context: string, parentId: number,  childId: number, query?: any): Promise<C> {
        await this.readParent(context, parentId);
        const options: FindOptions = this.appendIncludeOptions({
            where: {
                id: childId,
                [`${this.parentKey}`]: parentId,
            }
        }, query);
        // @ts-ignore
        const child = await this.model.findOne(options);
        if (child) {
            return child;
        } else {
            throw new NotFound(
                `${this.key}: Missing ${this.name} ${childId}`,
                context,
            );
        }
    }

    /**
     * Find and return the requested parent Model instance.
     *
     * @param context                   Call context for error messages
     * @param parentId                  ID of the required parent instance
     *
     * @returns Requested parent Model instance
     *
     * @throws NotFound if this parent model instance does not exist
     */
    public async readParent(context: string, parentId: number): Promise<P> {
        // @ts-ignore
        const parent = await this.parentInstance.findByPk(parentId);
        if (parent) {
            return parent;
        } else {
            throw new NotFound(
                `${this.parentKey}: Missing ${this.parentName} ${parentId}`,
                context,
            );
        }
    }

}
