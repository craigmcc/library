// Sidebar.tsx

// External Modules ----------------------------------------------------------

import * as React from "react";
import classNames from "classnames";

// Internal Modules ----------------------------------------------------------

import SelectableContext, {SelectCallback} from "../types";
import SidebarContext, {SidebarContextType} from "./SidebarContext";

// Public Objects ------------------------------------------------------------

/**
 * Properties for the Sidebar component.
 */
export interface SidebarProps {

    /**
     * Set a custom element for this component.
     */
    as: string,

    /**
     * A convenience prop for adding `bg-*` utility classes since they are
     * so commonly used here.  `light` and `ark` are common choices, but
     * any `bg-*` class is supported, including custom ones you might define.
     */
    bg?: string;

    /**
     * Change the underlying component CSS base class name and modifier
     * class names prefix.
     *
     * @default 'sidebar'
     */
    bsPrefix?: string,

    /**
     * Developer specified CSS class name(s).
     */
    className?: string,

    /**
     * Toggles `expanded` to `false` after the onSelect event of a desdendant
     * of a child `<Nav>` fires.  Does nothing if no `<Nav>` or `<Nav>`
     * descendants exist.
     *
     * Manually controlling `expanded` via the onSelect callback is recommended
     * instead, for more complex operations that need to be executed after the
     * `select` event of `<Nav>` descendants.
     */
    collapseOnSelect?: boolean;

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

    // TODO - verify usage compared to Navbar.
    /**
     * Create a fixed sidebar along the top or bottom of the screen,
     * that scrolls with the page.  A convenience prop for the
     * `fixed-*` positioning classes.
     */
    fixed?: 'top' | 'bottom';

    /**
     * Callback fired when a descendant of a child `<Nav>` is selected.
     * Should be used to execute complex closing or other miscellaneous
     * actions desired after selecting a descendent of `<Nav>`.  Does
     * nothing if no `<Nav>` or `<Nav>` descendants exist.
     */
    onSelect?: SelectCallback;

    /**
     * *controls `expanded`*
     *
     * Callback fired when the `<Sidebar>` body collapses or expands.
     * Fired when a `<Sidebar.Toggle>` is clicked and called with the
     * new `expanded` boolean value.
     */
    onToggle?: (expanded: boolean) => void;

    /**
     * The ARIA role for the sidebar, will default to 'navigation'
     * for sidebars whose `as` is something other than `<nav>`.
     *
     * @default 'navigation'
     */
    role?: string | null;

    /**
     * Position the sidebar at the top of the viewpoint, but only after
     * scrolling past it.  A convenience prop for the `sticky-top`
     * positioning class.
     *
     * @default 'top'
     */
    sticky?: string;

    /**
     * The general visual variant in a Sidebar.  Use in combination with the
     * `bg` prop, `background-color` utilities, or your own background styles.
     */
    variant?: 'light' | 'dark' | string;

}

const Sidebar = (props: SidebarProps) => {

    const bsPrefix = props.bsPrefix || "sidebar";

    const handleCollapse = React.useCallback<SelectCallback>(
        (...args) => {
            props.onSelect?.(...args);
            if (props.collapseOnSelect && props.expanded) {
                props.onToggle?.(false);
            }
        },
        [props.collapseOnSelect, props.expanded, props.onSelect, props.onToggle],
    );

    const controlledPropsRole = (props.role !== undefined) && (props.role !== null)
        ? "navigation"
        : undefined;

    let expandClass = `${bsPrefix}-expand`;
    if (typeof props.expand === 'string') expandClass = `${expandClass}-${props.expand}`;

    const sidebarContext = React.useMemo<SidebarContextType>(
        () => ({
            bsPrefix,
            expand: props.expand,
            expanded: !!props.expanded,
            onToggle: () => props.onToggle?.(!props.expanded),
        }),
        [bsPrefix, props.expand, props.expand, props.onToggle],
    );

    return (
        <SidebarContext.Provider value={sidebarContext}>
            <SelectableContext.Provider value={handleCollapse}>

{/* TODO: still need Component, ref, controlledProps
                <Component
                    ref={ref}
                    {...controlledProps}
                    className={classNames(
                        props.className,
                        bsPrefix,
                        props.expand && expandClass,
                        props.variant && `${bsPrefix}-${props.variant}`,
                        props.bg && `bg-${props.bg}`,
                        props.sticky && `sticky-${props.sticky}`,
                        props.fixed && `fixed-${props.fixed}`,
                    )}
                />
*/}


            </SelectableContext.Provider>
        </SidebarContext.Provider>
    )

}

export default Sidebar;

