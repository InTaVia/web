export class Origin {
  constructor(private readonly _x: number = 0, private readonly _y: number = 0) {}

  clone(): Origin {
    return new Origin(this._x, this._y);
  }

  offset(dx: number, dy: number): Origin {
    return new Origin(this._x + dx, this._y + dy);
  }

  toString(): string {
    console.warn(
      'This method should not be used in combination with d3-brush components inside SVG foreignObjects. See https://github.com/InTaVia/web/issues/41',
    );
    return `translate(${this._x}, ${this._y})`;
  }

  x(x = 0): number {
    return x + this._x;
  }

  y(y = 0): number {
    return y + this._y;
  }
}
