export const top = <T>(list: T[]) => list.length > 0 ? list[list.length - 1] : undefined;

export const maxChildLength = <T>(parent: T[][]) => parent.reduce((max, column) => Math.max(max, column.length), 0);
