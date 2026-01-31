export class Cursor {
  private position: number;

  constructor(initialPosition: number = 1) {
    this.position = initialPosition;
  }

  getPosition(): number {
    return this.position;
  }

  advance(amount: number): void {
    this.position += amount;
  }

  setPosition(position: number): void {
    this.position = position;
  }

  reset(): void {
    this.position = 1;
  }
}

