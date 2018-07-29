import { Locale } from '../typings';

export const LOCALE: Locale = {
  VALIDATION_FAILED: 'Validation failed',
  CONVERSION_FAILED: 'Conversion failed',
  DATA_REQUIRED: 'Data is required and must be an object',
  DATA_INVALID: 'Data object must be created with prototype, otherwise copy object with Object.assign({}, yourDataObject)',
  TYPE_FAIL: '"{path}" expects {type} type but receives: {value}',
  TYPE_UNKNOWN: 'Unknown type: {type}',
  TYPE_ARRAY_FAIL: '"{path}" expects array of {type} type but receives: {value}',
  TYPE_FUNCTION_FAIL: '"{path}" receives: {value}',
  TYPE_UNDEFINED: 'type is not defined',
  FIELD_REQUIRED: '"{path}" is required',
  FIELD_EMPTY: '"{path}" cannot be empty',
  FIELD_NULL: '"{path}" cannot be null',
  UNKNOWN_DETECTED: 'Unknown fields were detected: {unknownFields}',
};