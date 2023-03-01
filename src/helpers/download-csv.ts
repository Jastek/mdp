import { Parser } from 'json2csv';

export const downloadCSV = async (res: any, fileName: string, fields: any[], data: any) => {
    try {
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(data);

        return csv;
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        throw err;

    }



}