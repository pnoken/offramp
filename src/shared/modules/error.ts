import log from 'loglevel';

/**
 *
 * @param error - The object to check.
 * @returns True or false, depending on the result.
 */
export function isErrorWithMessage(
    error: unknown,
): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
}

export function logErrorWithMessage(error: unknown) {
    if (isErrorWithMessage(error)) {
        log.error(error.message);
    } else {
        log.error(error);
    }
}