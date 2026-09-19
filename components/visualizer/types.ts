export interface PathPoint {
    id: string;
    name: string;
    x: number;
    y: number;
    heading: number;
}

export interface ActionPoint {
    id: string;
    name: string;
    t: number;
    action: string;
}

export interface Splan {
    id: string;
    name: string;
    pathPoints: PathPoint[];
    actionPoints: ActionPoint[];
}
