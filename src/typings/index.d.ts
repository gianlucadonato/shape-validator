import { valid8r } from '../validator';
import { Shape } from '../shape';

export { valid8r, Shape };

export type ModelField = {
  type: any;
  required: boolean;
  default: any;
  convert: () => any;
  onError: () => void;
  allowNull: boolean;
  allowEmpty: boolean;
  autoCast: boolean;
  locale: Locale
}

export type ModelError = {
  message: string;
  fields: ModelErrorField[];
  [Symbol.iterator](): IterableIterator<any>;
};

export type ModelErrorField = {
  type?: string;
  field?: string;
  message?: string;
  value: any;
  valueType?: string;
  path?: string;
};

export type Locale = {
  [key: string]: string;
  VALIDATION_FAILED: string;
  CONVERSION_FAILED: string;
  DATA_REQUIRED: string;
  DATA_INVALID: string;
  TYPE_FAIL: string;
  TYPE_UNKNOWN: string;
  TYPE_ARRAY_FAIL: string;
  TYPE_FUNCTION_FAIL: string;
  TYPE_UNDEFINED: string;
  FIELD_REQUIRED: string;
  FIELD_EMPTY: string;
  FIELD_NULL: string;
  UNKNOWN_DETECTED: string;
}

export type ModelOptions = {
  usePromise?: boolean;
  detectUnknown?: boolean;
  autoCast?: boolean;
  allowEmpty?: boolean;
  allowNull?: boolean;
  required?: boolean;
};

// export declare class Shape {
//   constructor(model: any, options?: ModelOptions);
// }

// export declare function Shape(model: any, options?: ModelOptions): void {};
