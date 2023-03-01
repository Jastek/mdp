/**
 * Format the column and direction to be use in a mongodb query
 * @param column
 * @param direction
 * @returns
 */
export function formatOrder(column:string, direction:string, aggregateFormat = false){
    const obj:any = {};
    obj[column] = getDirection(direction, aggregateFormat);

    return obj;
}

function getDirection(direction:string, aggregateFormat: boolean = false) {
    if (aggregateFormat) {
        return direction === 'ASC' ? 1 : -1;
    } else {
        return direction;
    }
}