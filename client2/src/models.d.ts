// models.d.ts

/**
 * This file defines data models that are used in interactions with either a database
 * or an API service for object types relevant to the persistent data model for the
 * Library application.
 *
 * @packageDocumentation
 */

// Model ---------------------------------------------------------------------

/**
 * The base interface for model instances, identifying the primary key field.
 */
export interface Model<M> {

    /**
     * The primary key for this Model instance.
     */
    id: number;

}

// Credentials ---------------------------------------------------------------

/**
 * The login credentials passed to an OAuth server.  This is not strictly
 * a Model, but conceptually makes sense to be defined here.
 */
export interface Credentials {

    /**
     * The password to be authenticated.
     */
    password: string;

    /**
     * The username to be authenticated.
     */
    username: string;
}

// Library -------------------------------------------------------------------

/**
 * A collection of Authors, Series, Stories, and Volumes that are stored and indexed
 * as part of a particular Library.
 */
export interface Library extends Model<Library> {

    /**
     * Flag indicating whether this Library is currently active or not.
     */
    active: boolean;

    /**
     * Name of this Library.  Must be globally unique among all libraries
     * in the database.
     */
    name: string;

    /**
     * Optional miscellaneous notes about this Library.
     */
    notes: string;

    /**
     * Scope prefix that is used to compose authorization scopes (returned via
     * OAuth token requests) for the contents of this Library.
     */
    scope: string;

}

// User ----------------------------------------------------------------------

/**
 * An individual user that can be authenticated (via OAuth) and granted
 * permissions based on the specified scopes.
 */
export interface User extends Model<User> {

    /**
     * Flag indicating whether this User is currently active or not.
     */
    active: boolean;

    /**
     * Optional API Key for this User on Google Books.
     */
    googleBooksApiKey: string;

    /**
     * Optional name of this User or role.
     */
    name: string;

    /**
     * Login password for this User.  Required when a User is being created,
     * but optional on updates unless the password is being changed.
     */
    password: string;

    /**
     * Authorization scope(s), space separated, that define what this User
     * is allowed to do.  Generally, such values will be prefixed by the
     * corresponding Library scope, and a colon.  For example:
     * `my-library:admin`.
     */
    scope: string;

    /**
     * Login username for this User.  Must be globally unique.
     */
    username: string;

}
