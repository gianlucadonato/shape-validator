import * as validator from 'validator';
import { Validator } from './typings';

const valid8r: Validator = Object.create(validator);
valid8r.isAny = function (value: any) {
  return true;
}
valid8r.isNumber = function (value: any) {
  return typeof value === 'number' && !isNaN(value);
}
valid8r.isFunction = function (value: any) {
  return typeof value === 'function';
}
valid8r.isInteger = function (value: any) {
  return this.isNumber(value) && value % 1 === 0;
}
valid8r.isInt = function (value: any) {
  return this.isInteger(value);
}
valid8r.isString = function (value: any) {
  return typeof value === 'string';
}
valid8r.isBoolean = function (value: any) {
  return typeof value === 'boolean';
}
valid8r.isObject = function (value: any) {
  return value === Object(value);
}
valid8r.isDate = function (value: any) {
  return value instanceof Date;
}
valid8r.isError = function (value: any) {
  return value instanceof Error;
}
valid8r.isDefined = function (value: any) {
  return value !== null && value !== undefined;
}
valid8r.isUndefined = function (value: any) {
  return typeof value === 'undefined';
}
valid8r.isPromise = function (value: any) {
  return !!value && this.isFunction(value.then);
}
valid8r.isArray = function (value: any) {
  return Array.isArray(value);
}
valid8r.isHexadecimal = function (value: any) {
  const hexadecimal = /^[0-9A-F]+$/i;
  return hexadecimal.test('' + value);
}
valid8r.isMongoId = function (value: any) {
  const str = '' + value;
  return this.isHexadecimal(str) && str.length === 24;
}
valid8r.isObjectId = function (value: any) {
  return this.isMongoId(value);
}
valid8r.isHash = function (value: any) {
  // Checks if the object is a hash, which is equivalent to an object that
  // is neither an array nor a function.
  return this.isObject(value) && !this.isArray(value) && !this.isFunction(value);
}
valid8r.isEmptyString = function (value: string) {
  const EMPTY_STRING_REGEXP = /^\s*$/;
  return EMPTY_STRING_REGEXP.test(value.toString());
}
valid8r.isEmpty = function (value: any) {
  // Null and undefined are empty
  if (!this.isDefined(value)) {
    return true;
  }
  // Whitespace strings are empty
  if (this.isString(value)) {
    return this.isEmptyString(value);
  }
  // Dates have no attributes but aren't empty
  if (this.isDate(value)) {
    return false;
  }
  // Empty arrays are empty
  if (this.isArray(value)) {
    return value.length === 0;
  }
  // If we find at least one property we consider it non empty
  if (this.isObject(value)) {
    for (const key in value) {
      if (value.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  return false;
}
valid8r.isLength = function (value: any, options?: { min?: number, max?: number }): boolean {
  const min = options && options.min || 0;
  const max = options && options.max;
  if (typeof value === 'string') {
    const str = value.toString();
    const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
    const len = str.length - surrogatePairs.length;
    return len >= min && (typeof max === 'undefined' || len <= max);
  }
  if (typeof value === 'number') {
    return value >= min && (typeof max === 'undefined' || value <= max);
  }
  return false;
}
valid8r.isEmail = function (value: string) {
  const email = value.toString();
  const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return EMAIL_REGEXP.test(email);
}
valid8r.isPassword = function (value: string) {
  if (!this.isLength(value, { min: 3 })) return 'password is too short';
  if (!this.isLength(value, { max: 20 })) return 'password is too long';
  return true;
}
valid8r.isNull = function (value: any) {
  return value === null;
}
valid8r.capitalize = function (value: string) {
  const str = value.toString();
  return str.charAt(0).toUpperCase() + str.slice(1);
}
valid8r.validate = function (type: string, value: any) {
  const methodName = `is${this.capitalize(type)}`;
  if (typeof this[methodName] === 'function') {
    return this[methodName](value);
  } else {
    throw new Error(`Type ${type} Not Found`);
  }
}
export { valid8r };