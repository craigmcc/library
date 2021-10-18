// Timestamps ----------------------------------------------------------------

// Utility methods to deal with native Javascript Date objects and return
// string representations suitable for use in log files.

// Public Objects ------------------------------------------------------------

/**
 * Return the current date and time as a YYYYMMDD-HHMMSS string.
 */
export const nowDateTime = (): string => {
    return toDateTime(new Date());
}

/**
 * Return the current date and time as an ISO format string (with timezone offset).
 */
export const nowLocalISO = (): string => {
    return toLocalISO(new Date());
}

/**
 * Return the specified date and time as a YYYYMMDD-HHMMSS string.
 *
 * @param date                          The Date to be transformed
 */
export const toDateTime = (date: Date): string => {
    return date.getFullYear()
        + leftPad(date.getMonth() + 1, 2)
        + leftPad(date.getDate(), 2)
        + "-"
        + leftPad(date.getHours(), 2)
        + leftPad(date.getMinutes(), 2)
        + leftPad(date.getSeconds(), 2);
}

/**
 * Return an ISO 8601 representation of the specified date (to seconds
 * resolution), expressed as local time with the appropriate offset from UTC.
 * This implementation (except that it doesn't pollute prototypes) is based on
 * https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
 *
 * @param date                          Date to be transformed
 */
export const toLocalISO = (date: Date): string => {
    return date.getFullYear()
        + "-" + leftPad((date.getMonth() + 1), 2)
        + "-" + leftPad(date.getDate(), 2)
        + "T" + leftPad(date.getHours(), 2)
        + ":" + leftPad(date.getMinutes(), 2)
        + ":" + leftPad(date.getSeconds(), 2)
        + localOffset(date);
}

// Private Objects -----------------------------------------------------------

// Zero-pad the input string with zeros until it is of the requested size.
const leftPad = (input: string | number, size: number): string => {
    let output = String(input);
    while (output.length < size) {
        output = "0" + output;
    }
    return output;
}

// Return a local timezone offset string in the format required by ISO 8601.
const localOffset = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    return (offset < 0 ? "+" : "-")
        + leftPad(Math.floor(Math.abs(offset / 60)), 2)
        + ":" + leftPad(Math.abs(offset % 60), 2);
}

