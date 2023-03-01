export const platformList = [
    { id: "1", label:'LinkedIn'},
    { id: "2", label:'Pluralsight'},
    { id: "3", label:'Coursera'},
    { id: "4", label:'EDX'},
    { id: "5", label:'Udemy'},
    { id: "6", label:'LinkedIn'},
    { id: "7", label:'Capacitación interna'},
    { id: "8", label:'Otro'}
]

export function getPlatform(platformNumber: string) {
    return platformList.find( (x:any) => x.id === platformNumber)?.label;
}