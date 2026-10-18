/**
 * A waypoint represents a specific point in 2D space (x, y) that will be used to generate a spline segment.
 * The theta and magnitude are used in a vector (sin(theta) * magnitude, cos(theta) * magnitude) to determine the 
 * direction and sharpness of the spline segment at that point.
 */
export interface WayPoint {
    id: string;
    name: string;
    x: number;
    y: number;
    theta: number;
    magnitude: number;
}

/**
 * An action point represents a specific python function to be executed at a given t-value along the entire splan.
 */
export interface ActionPoint {
    id: string;
    name: string;
    t: number;
    action: string;
}

/**
 * A splan represents a collection of waypoints and action points that will be turned into connected spline segments.
 */
export interface Splan {
    id: string;
    name: string;
    pathPoints: WayPoint[];
    actionPoints: ActionPoint[];
}