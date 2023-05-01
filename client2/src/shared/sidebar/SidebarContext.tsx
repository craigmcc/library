// SidebarContext.tsx

// External Modules ----------------------------------------------------------

import * as React from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Public interface for a `SidebarContext` object.
 */
export interface SidebarContextType {

    /**
     * Change the underlying component CSS base class name and modifier
     * class names prefix.
     *
     * @default "sidebar"
     */
    bsPrefix?: string;

    /**
     * The breakpoint below which the Sidebar will collapse.  When `true`,
     * the Sidebar will always be expanded regardless of screen size.
     */
    expand?: boolean | string | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

    /**
     * *controlled by: `onToggle`, initial prop: `defaultExpanded`
     *
     * Controls the visibility of the `<Sidebar>` body.
     */
    expanded?: boolean;

    /**
     * *controls `expanded`*
     *
     * Callback fired when the `<Sidebar>` body collapses or expands.
     * Fired when a `<Sidebar.Toggle>` is clicked and called with the
     * new `expanded` boolean value.
     */
    onToggle?: (expanded: boolean) => void;

}

/**
 * Create and configure a default `SidebarContext`.
 */
const context = React.createContext<SidebarContextType | null>(null);
context.displayName = "SidebarContext";

export default context;
