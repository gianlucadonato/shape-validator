export class ShapeError extends Error {
  message: string;
  fields: any[];

  constructor(...args: any[]) {
    super();
    if (args[0] && typeof args[0] === 'object') {
      this.message = args[0].message || '';
      this.fields = args[0].fields || [];
    }
    if (args[0] && typeof args[0] === 'string')
      this.message = args[0];
    if (args[1] && Array.isArray(args[1]))
      this.fields = args[1];

    this.stack = new Error().stack;
  }
}