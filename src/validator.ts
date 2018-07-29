import * as validate from 'validator';
import { TYPES } from './types';

export class Validator {
  EMPTY_STRING_REGEXP = new RegExp('');
  isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }
  isFunction(value) {
    return typeof value === 'function';
  }
  isInteger(value) {
    return this.isNumber(value) && value % 1 === 0;
  }
  isString(value) {
    return typeof value === 'string';
  }
  isBoolean(value) {
    return typeof value === 'boolean';
  }
  isObject(value) {
    return value === Object(value);
  }
  isDate(value) {
    return value instanceof Date;
  }
  isError(value) {
    return value instanceof Error;
  }
  isDefined(value) {
    return value !== null && value !== undefined;
  }
  isUndefined(value) {
    return typeof value === 'undefined';
  }
  isPromise(value) {
    return !!value && this.isFunction(value.then);
  }
  isArray(value) {
    return Array.isArray(value);
  }
  isHexadecimal(value) {
    const hexadecimal = /^[0-9A-F]+$/i;
    return hexadecimal.test(''+value);
  }
  isMongoId(value) {
    const str = '' + value;
    return this.isHexadecimal(str) && str.length === 24;
  }
  isHash(value) {
    // Checks if the object is a hash, which is equivalent to an object that
    // is neither an array nor a function.
    return this.isObject(value) && !this.isArray(value) && !this.isFunction(value);
  }
  isEmptyString(value) {
    const EMPTY_STRING_REGEXP = /^\s*$/;
    return EMPTY_STRING_REGEXP.test(value.toString());
  }
  isEmpty(value) {
    // Null and undefined are empty
    if (!this.isDefined(value)) {
      return true;
    }
    // Whitespace strings are empty
    if (this.isString(value)) {
      return this.isEmptyString(value);
    }
    // Empty arrays are empty
    if (this.isArray(value)) {
      return value.length === 0;
    }
    // Dates have no attributes but aren't empty
    if (this.isDate(value)) {
      return false;
    }
    // If we find at least one property we consider it non empty
    if (this.isObject(value)) {
      for (let key in value) {
        if (value.hasOwnProperty(key))
          return false;
      }
      return true;
    }
    return false;
  }
}
export const valid8 = new Validator();

export const validator = {};
validator[TYPES.BOOLEAN] = (val) => valid8.isBoolean(val);
validator[TYPES.BOOL] = (val) => valid8.isBoolean(val);
validator[TYPES.ARRAY] = (val) => valid8.isArray(val);
validator[TYPES.NULL] = (val) => val === null;
validator[TYPES.ERROR] = (val) => valid8.isError(val);
validator[TYPES.DATE] = (val) => valid8.isDate(val);
validator[TYPES.FUNCTION] = (val) => valid8.isFunction(val);
validator[TYPES.OBJECT] = (val) => valid8.isObject(val);
validator[TYPES.STRING] = (val) => valid8.isString(val);
validator[TYPES.UNDEFINED] = (val) => valid8.isUndefined(val);
validator[TYPES.NUMERIC] = (val) => valid8.isNumber(val);
validator[TYPES.NUMBER] = (val) => valid8.isNumber(val);
validator[TYPES.INT] = (val) => valid8.isInteger(val);;
validator[TYPES.MONGOID] = (val) => valid8.isMongoId(val);

validator[TYPES.ALPHA] = (val) => validate.isAlpha(val);
validator[TYPES.ALPHANUMERIC] = (val) => validate.isAlphanumeric(val);
validator[TYPES.ASCII] = (val) => validate.isAscii(val);
validator[TYPES.BASE64] = (val) => validate.isBase64(val);
validator[TYPES.CREDIT_CARD] = (val) => validate.isCreditCard(val);
validator[TYPES.URI] = (val) => validate.isDataURI(val);
validator[TYPES.URL] = (val) => validate.isURL(val);
validator[TYPES.FQDN] = (val) => validate.isFQDN(val); // fully qualified domain name
validator[TYPES.DECIMAL] = (val) => validate.isDecimal(val);
validator[TYPES.DIVISIBLE_BY] = (val, num) => validate.isDivisibleBy(val, num);
validator[TYPES.EMAIL] = (val) => validate.isEmail(val);
validator[TYPES.EMPTY] = (val) => validate.isEmpty(val);
validator[TYPES.FLOAT] = (val) => validate.isFloat(val);
validator[TYPES.HASH] = (val, hash) => validate.isHash(val, hash);
validator[TYPES.HEX_COLOR] = (val) => validate.isHexColor(val);
validator[TYPES.HEXADECIMAL] = (val) => validate.isHexadecimal(val);
validator[TYPES.IP] = (val) => validate.isIP(val);
validator[TYPES.ISBN] = (val) => validate.isISBN(val);
validator[TYPES.ISSN] = (val) => validate.isISSN(val);
validator[TYPES.ISRC] = (val) => validate.isISRC(val);
validator[TYPES.ISIN] = (val, values: any[]) => validate.isIn(val, values);
validator[TYPES.JSON] = (val) => validate.isJSON(val);
validator[TYPES.LATLONG] = (val) => validate.isLatLong(val);
validator[TYPES.MAC_ADDR] = (val) => validate.isMACAddress(val);
validator[TYPES.PORT] = (val) => validate.isPort(val);
validator[TYPES.UUID] = (val) => validate.isUUID(val);

validator[TYPES.ANY] = (val) => true;

