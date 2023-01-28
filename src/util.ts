export function isSet<T>(input: T): input is NonNullable<T> {
    return input !== null && input !== undefined;
}

export function isNotSet<T, U extends null | undefined>(input: T | U): input is U {
    return input === null || input === undefined;
}
