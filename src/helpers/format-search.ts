/**
 * Format the search input as a query in mongodb
 * @param search
 * @param columns
 */
export function formatSearch(search:string = '', columns: string[] = []) {
    const object:any = {};

    if (search === '') return object;

    object.$or =  columns.map( (x:string) => {
        const col: any = {};
        // col[x] = { $regex: `.*${search}.*`, $options: 'i'};
        col[x] = regexField(search);

        return col;
    });

    return object;
}

export function regexField(search: string) {
    return  { $regex: `.*${search}.*`, $options: 'i'};
}