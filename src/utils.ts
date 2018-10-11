import { valid8r } from './validator';

export const autoCast = (val: any, type: string) => {
  // Given a primitive value, try and cast it
  if (typeof val === 'string') {
    if (type === 'string') {
      return val;
    }
    if (val !== '' && !isNaN(Number(val))) {
      val = Number(val);
    }
    if (val === 'undefined') {
      val = undefined;
    }
    const commons = {
      true: true,
      false: false,
      null: null,
      NaN: NaN,
      Infinity: Infinity
    };
    if (commons[val] !== undefined) {
      val = commons[val];
    }
  } else if (Array.isArray(val)) {
    if (Array.isArray(type)) {
      type = type[0];
    }
    return val.map(v => autoCast(v, type));
  } else if (typeof val === type) {
    return val; // nothing to do
  }

  if (!valid8r.isEmpty(val)) {
    if (type === 'string') {
      return '' + val;
    } else if (type === 'number') {
      return !isNaN(Number(val)) ? Number(val) : val;
    } else if (type === 'boolean') {
      return !!val;
    } else if (type === 'array') {
      return [val];
    }
  }
  return val;
};
