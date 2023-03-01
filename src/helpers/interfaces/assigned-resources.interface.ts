import { IAssignedResource } from "../../models/person";

export interface AssignedResourceReportLine {
    personId: string;
    personFirstName?: string;
    personLastName1?: string;
    personLastName2?: string;
    resource: string;
    date: Date;
    startDate?: Date;
    finishDate?: Date;
    calification?: number;
    progress: number;
    status: 'assigned' | 'progress' | 'finished';
    plan?: number;
}