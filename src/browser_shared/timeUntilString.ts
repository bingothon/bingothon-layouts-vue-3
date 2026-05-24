/**
 * This function returns a string that represents the given time in an upcoming string format
 * @param time The date as string to calculate the result for
 * @param useNext Whether to use "next" for the time unit
 * @returns A string in the form of "in X minute(s)/hours(s)/day(s)
 */
export function timeUntilString(time: string, useNext: boolean): string {
    const diffMs = new Date(time).getTime() - Date.now();
    // I prefer a switch case here over if/else statements, looks cleaner to me
    switch (true) {
        case diffMs < 60 * 1000: {
            const seconds = Math.floor(diffMs / 1000);
            if (useNext) {
                return seconds > 1 ? `In the next ${seconds} second(s)` : 'In the next second';
            }
            return seconds > 1 ? `In the ${seconds} seconds` : 'In one second';
        }
        case diffMs < 60 * 60 * 1000: {
            const minutes = Math.floor(diffMs / (60 * 1000));
            if (useNext) {
                return minutes > 1 ? `In the next ${minutes} minute(s)` : 'In the next minute';
            }
            return minutes > 1 ? `In ${minutes} minutes` : 'In one minute';
        }
        case diffMs < 24 * 60 * 60 * 1000: {
            const hours = Math.floor(diffMs / (60 * 60 * 1000));
            if (useNext) {
                return hours > 1 ? `In the next ${hours} hours` : 'In the next hour';
            }
            return hours > 1 ? `In ${hours} hours` : 'In one hour';
        }
        default: {
            const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
            if (useNext) {
                return days > 1 ? `In the next ${days} days` : 'In the next day';
            }
            return days > 1 ? `In ${days} days` : 'In one day';
        }
    }
}
