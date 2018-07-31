// Check if value is empty
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number' || typeof value === 'function' || typeof value === 'boolean') return false;
  if (typeof value === 'object' || Array.isArray(value)) {
    if (value.length > 0) return false;
    if (value.length === 0) return true;
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) return false;
    }
    if (value instanceof Date) return false;
  }
  return !(typeof value === 'string' && value.length > 0);
};

export const autoCast = (val: any, type: string) => {    
  // Given a primitive value, try and cast it
  if (typeof val === 'string') {
    if (!isNaN(Number(val))) {
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

  if (type === 'string') {
    return '' + val;
  } else if (type === 'number') {
    return !isNaN(Number(val)) ? Number(val) : val;
  } else if (type === 'boolean') {
    return !!val;
  } else if (type === 'array') {
    return [val];
  }
  return val;
};
