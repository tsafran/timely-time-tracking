export interface WorkSession {
    id: number;
    name: string;
    startTime: Date;
    endTime: Date;
    duration: string;
}

export interface WorkSessionRow {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    duration: string;
}