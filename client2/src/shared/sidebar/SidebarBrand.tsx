// SidebarBrand.tsx

// External Modules ----------------------------------------------------------

import * as React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// Internal Modules ----------------------------------------------------------

import {useBootstrapPrefix} from "react-bootstrap/ThemeProvider";
import {BsPrefixProps, BsPrefixRefForwardingComponent} from "react-bootstrap/helpers";

// Public Objects ------------------------------------------------------------

/**
 * Properties for the SidebarBrand component.
 */
export interface SidebarBrandProps
    extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {

    /**
     * An HREF, when provided the Brand will render as an `<a>` element
     * (unless `as` is provided).
     */
    href?: string;

}

const propTypes = {

    /**
     * Set custom element for this component.
     */
    as: PropTypes.elementType,

    /**
     * Change the underlying component CSS base class name and
     * modifier class names prefix.
     *
     * @default "sidebar"
     */
    bsPrefix: PropTypes.string,

    /**
     * An HREF, when provided the Brand will render as an `<a>` element
     * (unless `as` is provided).
     */
    href: PropTypes.string,

}

const SidebarBrand: BsPrefixRefForwardingComponent<'a', SidebarBrandProps> =
    React.forwardRef<HTMLElement, SidebarBrandProps>(
        ({ bsPrefix, className, as, ...props }, ref) => {
            bsPrefix = useBootstrapPrefix(bsPrefix, 'sidebar-brand');

            const Component = as || (props.href ? 'a' : 'span');

            return (
                <Component
                    {...props}
                    ref={ref}
                    className={classNames(className, bsPrefix)}
                />
            );
        },
    );

SidebarBrand.displayName = 'NavbarBrand';
SidebarBrand.propTypes = propTypes;

export default SidebarBrand;
