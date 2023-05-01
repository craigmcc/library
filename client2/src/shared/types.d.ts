// types.d.ts

/**
 * Various types that are normally React Bootstrap magic, but can make
 * implementations simpler.
 *
 * @packageDocumentation
 */

/**
 * Function declaration for `onSelect` props from
 * @restart/ui/esm/types.d.ts.
 */
export type SelectCallback =
    (eventKey: string | null, event: React.SyntheticEvent<unknown>) => void;

/**
 * Context declaration from @restart/ui/esm/SelectableContext.d.ts.
 */
declare const SelectableContext: React.Context<SelectCallback | null>;
export default SelectableContext;

