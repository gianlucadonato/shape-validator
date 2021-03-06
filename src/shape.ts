import * as clone from 'clone';
import * as render from 'string-template';
import { ShapeError } from './error';
import { LOCALE } from './locale';
import { ModelOptions, ModelError, ModelField } from './typings/index';
import { autoCast } from './utils';
import { valid8r } from './validator';

export class Shape {
  model: any;
  opts: ModelOptions;
  defaultField: ModelField;
  path: string[];
  error: ModelError;

  constructor(model: any, opts: ModelOptions = {}) {

    if (Array.isArray(model) || typeof model !== 'object')
      throw new Error('Model must be an object');

    if (Array.isArray(opts) || typeof opts !== 'object')
      throw new Error('Options must be an object');

    this.model = clone(model);

    this.opts = Object.assign({
      usePromise: false,
      detectUnknown: false,
      autoCast: false,
      allowEmpty: false,
      allowNull: false,
      required: false
    }, opts);

    this.defaultField = {
      type: null,
      required: null,
      convert: null,
      default: null,
      allowNull: null,
      allowEmpty: null,
      autoCast: null,
      onError: null,
      locale: LOCALE
    };

    this.error = {
      message: '',
      fields: [],
      *[Symbol.iterator]() {
        yield this.message;
        yield this.fields;
      }
    };

    const isValid: any = this.isValid.bind(this);
    isValid.shape = this;
    return isValid;
  }

  isValid(obj: any, parentPath: any = []): Promise<any> | any {
    if (typeof obj !== 'object') {
      const err = new Error(LOCALE.DATA_REQUIRED);
      if (!this.opts.usePromise) throw err;
      else return Promise.reject(err);
    }

    if (typeof obj.hasOwnProperty === 'undefined') {
      const err = new TypeError(LOCALE.DATA_INVALID);
      if (!this.opts.usePromise) throw err;
      else return Promise.reject(err);
    }

    const data: any = clone(obj);
    const result: any = {};
    const dataExcluded = {};

    if (this.opts.detectUnknown) {
      const unknownFields = [];
      for (const field in data) {
        if (!this.model.hasOwnProperty(field)) {
          unknownFields.push(field);
        }
      }
      if (unknownFields.length) {
        this.pushError(LOCALE.UNKNOWN_DETECTED, { unknownFields });
        const err = new ShapeError(this.error);
        if (!this.opts.usePromise) throw err;
        else return Promise.reject(err);
      }
    }

    for (const field in this.model) {
      if (!this.model.hasOwnProperty(field))
        continue;

      this.path = [].concat(parentPath);
      this.path.push(field);

      this.model[field] = this.normalize(this.model[field]);
      const type = this.model[field].type;

      // #1 apply default value
      this.applyDefault(field, data);

      // #2 apply convert function
      this.applyConvert(field, data);

      // #3 apply auto-cast
      if (!this.applyAutoCast(type, field, data)) {
        continue;
      }

      // #4 check required
      if (!this.checkRequired(field, data)) {
        continue;
      }

      // #5 check null
      if (!this.checkAllowNull(field, data, result)) {
        continue;
      }

      // #6 check empty
      if (!this.checkAllowEmpty(field, data, result)) {
        continue;
      }

      // #7 check type
      if (!this.checkType(type, field)) {
        continue;
      }

      // #8 validate data
      if (!this.validate(type, field, data)) {
        continue;
      }

      // Insert result
      result[field] = data[field];
    }

    if (this.opts.usePromise && !parentPath.length) {
      if (this.error.message)
        return Promise.reject(new ShapeError(this.error));
      else {
        return Promise.resolve(result);
      }
    } else {
      if (this.error.message) {
        throw new ShapeError(this.error);
      } else {
        return result;
      }
    }
  }

  // Normalize model field
  normalize(field: any): ModelField {
    if (typeof field !== 'object' || !field.hasOwnProperty('type')) {
      field = { type: field };
    }
    return Object.assign({}, this.defaultField, this.detectQuestionMark(field));
  }

  // Detect if the type has the symbol "?" and set required property
  detectQuestionMark(field: ModelField): ModelField {
    let strType;
    if (typeof field.type === 'string') {
      strType = field.type;
    } else if (Array.isArray(field.type) && field.type.length && typeof field.type[0] === 'string') {
      strType = field.type[0];
    }
    if (strType) {
      if (strType.endsWith('?')) {
        if (Array.isArray(field.type)) {
          field.type = [strType.slice(0, -1)];
        } else {
          field.type = strType.slice(0, -1);
        }
        if (!field.hasOwnProperty('required')) {
          field.required = false;
        }
      } else if (!field.hasOwnProperty('required')) {
        field.required = true;
      }
    } else {
      // Field is a nested shape obj
      // if (((field.shape || {}).opts || {}).required) {
      //   field.required = true;
      // } else {
      //   field.required = false;
      // }
    }
    return field;
  }

  // Apply convert function
  applyConvert(field: string, data: any) {
    if (this.model[field].convert) {
      try {
        const res = this.model[field].convert.call(this, data[field], clone(data), valid8r);
        // if (res === undefined) throw Error();
        // else data[field] = res;
        if (res !== undefined)
          data[field] = res;
      } catch (e) {
        const err = new ShapeError(e.message || this.model[field].locale.CONVERSION_FAILED);
        if (!this.opts.usePromise) throw err;
        else return Promise.reject(err);
      }
    }
  }

  // Apply default
  applyDefault(field: string, data: any) {
    if (valid8r.isEmpty(data[field]) && this.model[field].default !== null) {
      data[field] = this.model[field].default;
    }
  }

  // Check if field is required
  checkRequired(field: string, data: any): boolean {
    if (data[field] === undefined) {
      if (this.model[field].required) {
        this.pushError(this.model[field].locale.FIELD_REQUIRED, { field });
      }
      return false;
    }
    return true;
  }

  // Check allow null
  checkAllowNull(field: string, data: any, res: any) {
    if (data[field] === null) {
      if (this.allowNull(field)) {
        res[field] = data[field];
        return false;
      } else {
        if (this.model[field].required) {
          this.pushError(this.model[field].locale.FIELD_NULL, { field });
        }
        delete data[field];
        return false;
      }
    }
    return true;
  }

  // Check allow empty
  checkAllowEmpty(field: string, data: any, res: any) {
    if (valid8r.isEmpty(data[field])) {
      if (!this.allowEmpty(field)) {
        if (this.model[field].required) {
          this.pushError(this.model[field].locale.FIELD_EMPTY, { field });
        }
        delete data[field];
        return false;
      }
      if ((!this.opts.autoCast || !this.model[field].autoCast) && data[field] !== undefined) {
        res[field] = data[field];
        return false;
      }
    }
    return true;
  }

  // Check unknown type
  checkType(type: string, field: string): boolean {
    const methodType = `is${valid8r.capitalize(type)}`;
    if (!valid8r.hasOwnProperty(methodType) && !(typeof type === 'function') && !(typeof type === 'object')) {
      this.pushError(this.model[field].locale.TYPE_UNKNOWN, { type, field });
      return false;
    }
    return true;
  }

  // Apply auto cast
  applyAutoCast(type: string, field: string, data: any): boolean {
    if (
      (this.opts.autoCast && this.model[field].autoCast) ||
      (!this.opts.autoCast && this.model[field].autoCast) ||
      (this.opts.autoCast && this.model[field].autoCast === null)
    ) {
      data[field] = autoCast(data[field], type);
    }
    return true;
  }

  // Check over type
  validate(type: any, field: string, data: any, parent?: any) {
    if (typeof type === 'string') {
      try {
        const res = valid8r.validate(type, data[field]);
        if (res === false || typeof res === 'string') {
          let errMsg = ((this.model[field] || {}).locale || {}).TYPE_FAIL || LOCALE.TYPE_FAIL;
          if (typeof res === 'string') {
            errMsg = res;
          }
          const errData: any = {
            type: JSON.stringify(type),
            value: JSON.stringify(data[field])
          };
          if (parent) {
            errData.type = parent.type;
            errData.index = field;
          }
          this.pushError(errMsg, errData);
          return false;
        }
      } catch (e) {
        const errMsg = e.message || ((this.model[field] || {}).locale || {}).TYPE_FUNCTION_FAIL || LOCALE.TYPE_FUNCTION_FAIL;
        this.pushError(errMsg, { field, value: data[field] });
        return false;
      }
    } else if (typeof type === 'function') {
      if (type.shape && type.shape instanceof Shape) { // Check if is nested model
        try {
          type.call(this, data[field], this.path);
        } catch (err) {
          if (err.message) {
            this.error.message = err.message;
          }
          if (err.fields && err.fields.length) {
            this.error.fields = this.error.fields.concat(err.fields);
          }
          return false;
        }
      } else {
        try {
          const res = type.call(this, data[field], clone(data), valid8r);
          if (res === false || typeof res === 'string') {
            let errMsg = ((this.model[field] || {}).locale || {}).TYPE_FUNCTION_FAIL || LOCALE.TYPE_FUNCTION_FAIL;
            if (typeof res === 'string') {
              errMsg = res;
            }
            this.pushError(errMsg, { field, value: data[field] });
            return false;
          }
        } catch (e) {
          const errMsg = e.message || ((this.model[field] || {}).locale || {}).TYPE_FUNCTION_FAIL || LOCALE.TYPE_FUNCTION_FAIL;
          this.pushError(errMsg, { field, value: data[field] });
          return false;
        }
      }
    } else if (Array.isArray(type)) {
      if (!Array.isArray(data[field])) {
        const errMsg = ((this.model[field] || {}).locale || {}).TYPE_ARRAY_FAIL || LOCALE.TYPE_ARRAY_FAIL;
        this.pushError(errMsg, { type, field, value: data[field] });
        return false;
      } else {
        data[field].forEach((val: any, idx: number) => {
          this.validate(type[0], idx.toString(), data[field], { type, field, data, parent });
        });
      }
    } else if (typeof type === 'undefined') {
      this.pushError(LOCALE.TYPE_UNDEFINED, { type, field, data, parent });
      return false;
    }
    return true;
  }

  pushError(message: string, obj?: any) {
    this.error.message = LOCALE.VALIDATION_FAILED;
    if (!obj) return;
    obj.path = obj.path || this.path.join('.');
    obj.type = obj.type || (this.model[obj.path] || {}).type;

    message = render(message, obj);
    const field: any = {
      message,
      field: obj.path,
      type: obj.type,
      value: obj.value,
    };
    if (obj.index) {
      field.index = obj.index;
    }
    this.error.message = message;
    this.error.fields.push(field);

    if (this.model[obj.path] && typeof this.model[obj.path].onError === 'function') {
      this.model[obj.path].onError.call(this, new ShapeError(this.error));
    }
  }

  allowEmpty(field: string) {
    if (
      this.opts.allowEmpty && this.model[field].allowEmpty ||
      !this.opts.allowEmpty && this.model[field].allowEmpty ||
      this.opts.allowEmpty && (this.model[field].allowEmpty === null)
    ) {
      return true;
    } else {
      return false;
    }
  }

  allowNull(field: string) {
    if (
      this.opts.allowNull && this.model[field].allowNull ||
      !this.opts.allowNull && this.model[field].allowNull ||
      this.opts.allowNull && (this.model[field].allowNull === null)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Add custom type
  static addType(name: string, fn: any) {
    if (!valid8r.isString(name))
      throw new TypeError('name must be a string');

    if (valid8r.isEmptyString(name))
      throw new Error('Name cannot be empty');

    if (Shape.typeExists(name))
      throw new Error(`Type ${name} already exists`);

    if (!valid8r.isFunction(fn))
      throw new TypeError('fn must be a function');

    const methodName = `is${valid8r.capitalize(name)}`;
    valid8r[methodName] = fn.bind(this);
  }

  // Adds multiple types
  static addTypes(types: any[] = []) {
    if (!valid8r.isArray(types))
      throw new TypeError('types must be an array');

    types.forEach(type => {
      if (!valid8r.isObject(type))
        throw new TypeError('type must be an object');
      Shape.addType(type.name, type.fn);
    });
  }

  static typeExists(name: string) {
    return valid8r.hasOwnProperty(`is${valid8r.capitalize(name)}`);
  }

  static setLocale(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!obj[key]) {
          throw new Error(`${key} cannot be empty`);
        }
        LOCALE[key] = obj[key];
      }
    }
  }
}