// AbstractModel -------------------------------------------------------------

// Abstract base class for objects representing application data models.

// Public Objects ------------------------------------------------------------

abstract class AbstractModel {

    /**
     * Return a human-readable name for this class of model.  Default
     * implementation returns the simple class name, but can be overridden
     * in a subclass definition if needed.
     */
    public _model (): string {
        return this.constructor.name;
    }

    /**
     * Return a human-readable title for the object represented this
     * instance of this class.  Typically, this is derived from a "name"
     * property.
     */
    public abstract _title (): string;

}

export default AbstractModel;
