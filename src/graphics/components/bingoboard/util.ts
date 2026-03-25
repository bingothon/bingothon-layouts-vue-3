export interface BingoCell {
    name: string;
    rawColors: string;
    markers?: (string | null)[];
    colors: {
        color: string;
        style: string;
    }[];
}

export const translatePercent: Record<number, string[]> = {
    2: ['0', '0'],
    3: ['0', '36', '-34'],
    4: ['0', '46', '0', '-48'],
    5: ['0', '56', '18', '-18', '-56'],
    6: ['0', '60', '30', '0', '-30', '-60'],
    7: ['0', '64', '38', '13', '-13', '-38', '-64'],
    8: ['0', '64', '41', '20', '0', '-21', '-41', '-64'],
    9: ['0', '66', '45', '27', '9', '-9', '-27', '-45', '-66'],
    10: ['0', '68', '51', '34', '17', '0', '-17', '-34', '-51', '-68']
};

export const ORDERED_COLORS = ['pink', 'red', 'orange', 'brown', 'yellow', 'green', 'teal', 'blue', 'navy', 'purple'].reverse();

export function sortColors(colors: string[] | string): string[] {
    const orderedColors: string[] = [];
    for (let i = 0; i < ORDERED_COLORS.length; i++) {
        if (colors.indexOf(ORDERED_COLORS[i]) !== -1) {
            orderedColors.push(ORDERED_COLORS[i]);
        }
    }
    if (Array.isArray(colors)) {
        colors.forEach((color) => {
            if (!orderedColors.includes(color)) {
                orderedColors.push(color);
            }
        });
    }
    return orderedColors;
}

export const colorToGradient: Record<string, string> = {
    green: '#31D814',
    red: '#FF4944',
    orange: '#FF9C12',
    blue: '#409CFF',
    purple: '#822dbf',
    pink: '#ed86aa',
    brown: '#ab5c23',
    teal: '#419695',
    navy: '#0d48b5',
    yellow: '#d8d014'
};

export function defaultBingoBoard(): BingoCell[][] {
    const result = [];
    for (let i = 0; i < 5; i++) {
        const cur: BingoCell[] = [];
        for (let j = 0; j < 5; j++) {
            cur.push({ name: '', colors: [], rawColors: 'blank' });
        }
        result.push(cur);
    }
    return result;
}

export function colorsToTransforms(colorsIn: string[], skewAngle: number): { color: string; style: string }[] {
    if (colorsIn.length !== 0) {
        const colors = sortColors(colorsIn);
        const newColors = [];
        newColors.push({ color: colors[0], style: '' });
        const translations = translatePercent[colors.length];
        for (let i = 1; i < colors.length; i++) {
            // how bingosync handles the backgrounds, set style here to simply bind it to html later
            newColors.push({
                color: colors[i],
                style: `transform: skew(-${skewAngle}rad) translateX(${translations[i]}%); border-right: solid 1.5px #444444`
            });
        }
        return newColors;
    } else {
        return [];
    }
}
