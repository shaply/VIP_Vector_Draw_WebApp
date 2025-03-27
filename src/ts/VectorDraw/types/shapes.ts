interface Shape {
    type: string;
}

export interface Point extends Shape {
    point: paper.Point;
}

export interface Line extends Shape {
    startPoint: paper.Point;
    endPoint: paper.Point;
}

export interface Circle extends Shape {
    center: paper.Point;
    radius: number;
}