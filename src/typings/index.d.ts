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

export interface Validator {
  isAny: (value: any) => boolean;
  isNumber: (value: any) => boolean;
  isFunction: (value: any) => boolean;
  isInteger: (value: any) => boolean;
  isString: (value: any) => boolean;
  isObject: (value: any) => boolean;
  isDate: (value: any) => boolean;
  isError: (value: any) => boolean;
  isDefined: (value: any) => boolean;
  isUndefined: (value: any) => boolean;
  isPromise: (value: any) => boolean;
  isArray: (value: any) => boolean;
  isEmptyString: (value: any) => boolean;
  isLength: (value: any) => boolean;
  isPassword: (value: string) => boolean | string;
  isObjectId: (value: any) => boolean;
  isNull: (value: any) => boolean;
  capitalize: (value: any) => string;
  validate: (type: string, value: any) => any;

  version: typeof validator.version;
  toDate: typeof validator.toDate;
  toFloat: typeof validator.toFloat;
  toInt: typeof validator.toInt;
  toBoolean: typeof validator.toBoolean;
  equals: typeof validator.equals;
  contains: typeof validator.contains;
  matches: typeof validator.matches;
  isEmail: typeof validator.isEmail;
  isURL: typeof validator.isURL;
  isMACAddress: typeof validator.isMACAddress;
  isIP: typeof validator.isIP;
  isFQDN: typeof validator.isFQDN;
  isBoolean: typeof validator.isBoolean;
  isAlpha: typeof validator.isAlpha;
  isAlphanumeric: typeof validator.isAlphanumeric;
  isNumeric: typeof validator.isNumeric;
  isPort: typeof validator.isPort;
  isLowercase: typeof validator.isLowercase;
  isUppercase: typeof validator.isUppercase;
  isAscii: typeof validator.isAscii;
  isFullWidth: typeof validator.isFullWidth;
  isHalfWidth: typeof validator.isHalfWidth;
  isVariableWidth: typeof validator.isVariableWidth;
  isMultibyte: typeof validator.isMultibyte;
  isSurrogatePair: typeof validator.isSurrogatePair;
  isInt: typeof validator.isInt;
  isFloat: typeof validator.isFloat;
  isDecimal: typeof validator.isDecimal;
  isHexadecimal: typeof validator.isHexadecimal;
  isDivisibleBy: typeof validator.isDivisibleBy;
  isHexColor: typeof validator.isHexColor;
  isISRC: typeof validator.isISRC;
  isMD5: typeof validator.isMD5;
  isHash: typeof validator.isHash;
  isJSON: typeof validator.isJSON;
  isEmpty: typeof validator.isEmpty;
  // isLength: typeof validator.isLength;
  isByteLength: typeof validator.isByteLength;
  isUUID: typeof validator.isUUID;
  isMongoId: typeof validator.isMongoId;
  isAfter: typeof validator.isAfter;
  isBefore: typeof validator.isBefore;
  isIn: typeof validator.isIn;
  isCreditCard: typeof validator.isCreditCard;
  isISIN: typeof validator.isISIN;
  isISBN: typeof validator.isISBN;
  isISSN: typeof validator.isISSN;
  isMobilePhone: typeof validator.isMobilePhone;
  isPostalCode: typeof validator.isPostalCode;
  isCurrency: typeof validator.isCurrency;
  isISO8601: typeof validator.isISO8601;
  isISO31661Alpha2: typeof validator.isISO31661Alpha2;
  isBase64: typeof validator.isBase64;
  isDataURI: typeof validator.isDataURI;
  isMimeType: typeof validator.isMimeType;
  isLatLong: typeof validator.isLatLong;
  ltrim: typeof validator.ltrim;
  rtrim: typeof validator.rtrim;
  trim: typeof validator.trim;
  escape: typeof validator.escape;
  unescape: typeof validator.unescape;
  stripLow: typeof validator.stripLow;
  whitelist: typeof validator.whitelist;
  blacklist: typeof validator.blacklist;
  isWhitelisted: typeof validator.isWhitelisted;
  normalizeEmail: typeof validator.normalizeEmail;
  toString: typeof validator.toString;
}

// export declare class Shape {
//   constructor(model: any, options?: ModelOptions);
// }

// export declare function Shape(model: any, options?: ModelOptions): void {};
