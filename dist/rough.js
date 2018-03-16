var rough = (function () {
'use strict';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
var _core_1 = _core.version;

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$1
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.1 Object.assign(target, source, ...)





var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

var assign = _core.Object.assign;

var assign$1 = createCommonjsModule(function (module) {
module.exports = { "default": assign, __esModule: true };
});

var _Object$assign = unwrapExports(assign$1);

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

var _iterators = {};

var _library = true;

var _redefine = _hide;

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && !_has(IteratorPrototype, ITERATOR)) _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

var TO_STRING_TAG = _wks('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var ITERATOR$1 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$1]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var core_getIterator = _core.getIterator = function (it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator = core_getIterator;

var getIterator$1 = createCommonjsModule(function (module) {
module.exports = { "default": getIterator, __esModule: true };
});

var _getIterator = unwrapExports(getIterator$1);

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = 'object' === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);
});

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

var regenerator = runtimeModule;

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator

var ITERATOR$2 = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$2] === it);
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var process = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process) == 'process') {
    defer = function (id) {
      process.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$1 = _global.process;
var Promise$1 = _global.Promise;
var isNode = _cof(process$1) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process$1.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process$1.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    var promise = Promise$1.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$3 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$3
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

var ITERATOR$3 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () { SAFE_CLOSING = true; };
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$3]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$3] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

var task = _task.set;
var microtask = _microtask();



var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process$2 = _global.process;
var $Promise = _global[PROMISE];
var isNode$1 = _classof(process$2) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode$1 || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode$1) {
          process$2.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode$1) {
      process$2.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode$1 ? process$2.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
  var C = _speciesConstructor(this, _core.Promise || _global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return _promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return _promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

// https://github.com/tc39/proposal-promise-try




_export(_export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = _newPromiseCapability.f(this);
  var result = _perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

var promise = _core.Promise;

var promise$1 = createCommonjsModule(function (module) {
module.exports = { "default": promise, __esModule: true };
});

unwrapExports(promise$1);

var asyncToGenerator = createCommonjsModule(function (module, exports) {

exports.__esModule = true;



var _promise2 = _interopRequireDefault(promise$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
});

var _asyncToGenerator = unwrapExports(asyncToGenerator);

var classCallCheck = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object = _core.Object;
var defineProperty = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$1 = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty, __esModule: true };
});

unwrapExports(defineProperty$1);

var createClass = createCommonjsModule(function (module, exports) {

exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

function RoughSegmentRelation() {
  return {
    LEFT: 0,
    RIGHT: 1,
    INTERSECTS: 2,
    AHEAD: 3,
    BEHIND: 4,
    SEPARATE: 5,
    UNDEFINED: 6
  };
}

var RoughSegment = function () {
  function RoughSegment(px1, py1, px2, py2) {
    _classCallCheck(this, RoughSegment);

    this.RoughSegmentRelationConst = RoughSegmentRelation();
    this.px1 = px1;
    this.py1 = py1;
    this.px2 = px2;
    this.py2 = py2;
    this.xi = Number.MAX_VALUE;
    this.yi = Number.MAX_VALUE;
    this.a = py2 - py1;
    this.b = px1 - px2;
    this.c = px2 * py1 - px1 * py2;
    this._undefined = this.a == 0 && this.b == 0 && this.c == 0;
  }

  _createClass(RoughSegment, [{
    key: "isUndefined",
    value: function isUndefined() {
      return this._undefined;
    }
  }, {
    key: "compare",
    value: function compare(otherSegment) {
      if (this.isUndefined() || otherSegment.isUndefined()) {
        return this.RoughSegmentRelationConst.UNDEFINED;
      }
      var grad1 = Number.MAX_VALUE;
      var grad2 = Number.MAX_VALUE;
      var int1 = 0,
          int2 = 0;
      var a = this.a,
          b = this.b,
          c = this.c;

      if (Math.abs(b) > 0.00001) {
        grad1 = -a / b;
        int1 = -c / b;
      }
      if (Math.abs(otherSegment.b) > 0.00001) {
        grad2 = -otherSegment.a / otherSegment.b;
        int2 = -otherSegment.c / otherSegment.b;
      }

      if (grad1 == Number.MAX_VALUE) {
        if (grad2 == Number.MAX_VALUE) {
          if (-c / a != -otherSegment.c / otherSegment.a) {
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          if (this.py1 >= Math.min(otherSegment.py1, otherSegment.py2) && this.py1 <= Math.max(otherSegment.py1, otherSegment.py2)) {
            this.xi = this.px1;
            this.yi = this.py1;
            return this.RoughSegmentRelationConst.INTERSECTS;
          }
          if (this.py2 >= Math.min(otherSegment.py1, otherSegment.py2) && this.py2 <= Math.max(otherSegment.py1, otherSegment.py2)) {
            this.xi = this.px2;
            this.yi = this.py2;
            return this.RoughSegmentRelationConst.INTERSECTS;
          }
          return this.RoughSegmentRelationConst.SEPARATE;
        }
        this.xi = this.px1;
        this.yi = grad2 * this.xi + int2;
        if ((this.py1 - this.yi) * (this.yi - this.py2) < -0.00001 || (otherSegment.py1 - this.yi) * (this.yi - otherSegment.py2) < -0.00001) {
          return this.RoughSegmentRelationConst.SEPARATE;
        }
        if (Math.abs(otherSegment.a) < 0.00001) {
          if ((otherSegment.px1 - this.xi) * (this.xi - otherSegment.px2) < -0.00001) {
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          return this.RoughSegmentRelationConst.INTERSECTS;
        }
        return this.RoughSegmentRelationConst.INTERSECTS;
      }

      if (grad2 == Number.MAX_VALUE) {
        this.xi = otherSegment.px1;
        this.yi = grad1 * this.xi + int1;
        if ((otherSegment.py1 - this.yi) * (this.yi - otherSegment.py2) < -0.00001 || (this.py1 - this.yi) * (this.yi - this.py2) < -0.00001) {
          return this.RoughSegmentRelationConst.SEPARATE;
        }
        if (Math.abs(a) < 0.00001) {
          if ((this.px1 - this.xi) * (this.xi - this.px2) < -0.00001) {
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          return this.RoughSegmentRelationConst.INTERSECTS;
        }
        return this.RoughSegmentRelationConst.INTERSECTS;
      }

      if (grad1 == grad2) {
        if (int1 != int2) {
          return this.RoughSegmentRelationConst.SEPARATE;
        }
        if (this.px1 >= Math.min(otherSegment.px1, otherSegment.px2) && this.px1 <= Math.max(otherSegment.py1, otherSegment.py2)) {
          this.xi = this.px1;
          this.yi = this.py1;
          return this.RoughSegmentRelationConst.INTERSECTS;
        }
        if (this.px2 >= Math.min(otherSegment.px1, otherSegment.px2) && this.px2 <= Math.max(otherSegment.px1, otherSegment.px2)) {
          this.xi = this.px2;
          this.yi = this.py2;
          return this.RoughSegmentRelationConst.INTERSECTS;
        }
        return this.RoughSegmentRelationConst.SEPARATE;
      }

      this.xi = (int2 - int1) / (grad1 - grad2);
      this.yi = grad1 * this.xi + int1;

      if ((this.px1 - this.xi) * (this.xi - this.px2) < -0.00001 || (otherSegment.px1 - this.xi) * (this.xi - otherSegment.px2) < -0.00001) {
        return this.RoughSegmentRelationConst.SEPARATE;
      }
      return this.RoughSegmentRelationConst.INTERSECTS;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this._getLength(this.px1, this.py1, this.px2, this.py2);
    }
  }, {
    key: "_getLength",
    value: function _getLength(x1, y1, x2, y2) {
      var dx = x2 - x1;
      var dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }]);

  return RoughSegment;
}();

var RoughHachureIterator = function () {
  function RoughHachureIterator(top, bottom, left, right, gap, sinAngle, cosAngle, tanAngle) {
    _classCallCheck(this, RoughHachureIterator);

    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
    this.gap = gap;
    this.sinAngle = sinAngle;
    this.tanAngle = tanAngle;

    if (Math.abs(sinAngle) < 0.0001) {
      this.pos = left + gap;
    } else if (Math.abs(sinAngle) > 0.9999) {
      this.pos = top + gap;
    } else {
      this.deltaX = (bottom - top) * Math.abs(tanAngle);
      this.pos = left - Math.abs(this.deltaX);
      this.hGap = Math.abs(gap / cosAngle);
      this.sLeft = new RoughSegment(left, bottom, left, top);
      this.sRight = new RoughSegment(right, bottom, right, top);
    }
  }

  _createClass(RoughHachureIterator, [{
    key: "getNextLine",
    value: function getNextLine() {
      if (Math.abs(this.sinAngle) < 0.0001) {
        if (this.pos < this.right) {
          var line = [this.pos, this.top, this.pos, this.bottom];
          this.pos += this.gap;
          return line;
        }
      } else if (Math.abs(this.sinAngle) > 0.9999) {
        if (this.pos < this.bottom) {
          var _line = [this.left, this.pos, this.right, this.pos];
          this.pos += this.gap;
          return _line;
        }
      } else {
        var xLower = this.pos - this.deltaX / 2;
        var xUpper = this.pos + this.deltaX / 2;
        var yLower = this.bottom;
        var yUpper = this.top;
        if (this.pos < this.right + this.deltaX) {
          while (xLower < this.left && xUpper < this.left || xLower > this.right && xUpper > this.right) {
            this.pos += this.hGap;
            xLower = this.pos - this.deltaX / 2;
            xUpper = this.pos + this.deltaX / 2;
            if (this.pos > this.right + this.deltaX) {
              return null;
            }
          }
          var s = new RoughSegment(xLower, yLower, xUpper, yUpper);
          if (s.compare(this.sLeft) == RoughSegmentRelation().INTERSECTS) {
            xLower = s.xi;
            yLower = s.yi;
          }
          if (s.compare(this.sRight) == RoughSegmentRelation().INTERSECTS) {
            xUpper = s.xi;
            yUpper = s.yi;
          }
          if (this.tanAngle > 0) {
            xLower = this.right - (xLower - this.left);
            xUpper = this.right - (xUpper - this.left);
          }
          var _line2 = [xLower, yLower, xUpper, yUpper];
          this.pos += this.hGap;
          return _line2;
        }
      }
      return null;
    }
  }]);

  return RoughHachureIterator;
}();

var PathToken = function () {
  function PathToken(type, text) {
    _classCallCheck(this, PathToken);

    this.type = type;
    this.text = text;
  }

  _createClass(PathToken, [{
    key: "isType",
    value: function isType(type) {
      return this.type === type;
    }
  }]);

  return PathToken;
}();

var ParsedPath = function () {
  function ParsedPath(d) {
    _classCallCheck(this, ParsedPath);

    this.PARAMS = {
      A: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
      a: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
      C: ["x1", "y1", "x2", "y2", "x", "y"],
      c: ["x1", "y1", "x2", "y2", "x", "y"],
      H: ["x"],
      h: ["x"],
      L: ["x", "y"],
      l: ["x", "y"],
      M: ["x", "y"],
      m: ["x", "y"],
      Q: ["x1", "y1", "x", "y"],
      q: ["x1", "y1", "x", "y"],
      S: ["x2", "y2", "x", "y"],
      s: ["x2", "y2", "x", "y"],
      T: ["x", "y"],
      t: ["x", "y"],
      V: ["y"],
      v: ["y"],
      Z: [],
      z: []
    };
    this.COMMAND = 0;
    this.NUMBER = 1;
    this.EOD = 2;
    this.segments = [];
    this.d = d || "";
    this.parseData(d);
    this.processPoints();
  }

  _createClass(ParsedPath, [{
    key: "loadFromSegments",
    value: function loadFromSegments(segments) {
      this.segments = segments;
      this.processPoints();
    }
  }, {
    key: "processPoints",
    value: function processPoints() {
      var first = null,
          currentPoint = [0, 0];
      for (var i = 0; i < this.segments.length; i++) {
        var s = this.segments[i];
        switch (s.key) {
          case 'M':
          case 'L':
          case 'T':
            s.point = [s.data[0], s.data[1]];
            break;
          case 'm':
          case 'l':
          case 't':
            s.point = [s.data[0] + currentPoint[0], s.data[1] + currentPoint[1]];
            break;
          case 'H':
            s.point = [s.data[0], currentPoint[1]];
            break;
          case 'h':
            s.point = [s.data[0] + currentPoint[0], currentPoint[1]];
            break;
          case 'V':
            s.point = [currentPoint[0], s.data[0]];
            break;
          case 'v':
            s.point = [currentPoint[0], s.data[0] + currentPoint[1]];
            break;
          case 'z':
          case 'Z':
            if (first) {
              s.point = [first[0], first[1]];
            }
            break;
          case 'C':
            s.point = [s.data[4], s.data[5]];
            break;
          case 'c':
            s.point = [s.data[4] + currentPoint[0], s.data[5] + currentPoint[1]];
            break;
          case 'S':
            s.point = [s.data[2], s.data[3]];
            break;
          case 's':
            s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
            break;
          case 'Q':
            s.point = [s.data[2], s.data[3]];
            break;
          case 'q':
            s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
            break;
          case 'A':
            s.point = [s.data[5], s.data[6]];
            break;
          case 'a':
            s.point = [s.data[5] + currentPoint[0], s.data[6] + currentPoint[1]];
            break;
        }
        if (s.key === 'm' || s.key === 'M') {
          first = null;
        }
        if (s.point) {
          currentPoint = s.point;
          if (!first) {
            first = s.point;
          }
        }
        if (s.key === 'z' || s.key === 'Z') {
          first = null;
        }
      }
    }
  }, {
    key: "parseData",
    value: function parseData(d) {
      var tokens = this.tokenize(d);
      var index = 0;
      var token = tokens[index];
      var mode = "BOD";
      this.segments = new Array();
      while (!token.isType(this.EOD)) {
        var param_length;
        var params = new Array();
        if (mode == "BOD") {
          if (token.text == "M" || token.text == "m") {
            index++;
            param_length = this.PARAMS[token.text].length;
            mode = token.text;
          } else {
            return this.parseData('M0,0' + d);
          }
        } else {
          if (token.isType(this.NUMBER)) {
            param_length = this.PARAMS[mode].length;
          } else {
            index++;
            param_length = this.PARAMS[token.text].length;
            mode = token.text;
          }
        }

        if (index + param_length < tokens.length) {
          for (var i = index; i < index + param_length; i++) {
            var number = tokens[i];
            if (number.isType(this.NUMBER)) {
              params[params.length] = number.text;
            } else {
              console.error("Parameter type is not a number: " + mode + "," + number.text);
              return;
            }
          }
          var segment;
          if (this.PARAMS[mode]) {
            segment = { key: mode, data: params };
          } else {
            console.error("Unsupported segment type: " + mode);
            return;
          }
          this.segments.push(segment);
          index += param_length;
          token = tokens[index];
          if (mode == "M") mode = "L";
          if (mode == "m") mode = "l";
        } else {
          console.error("Path data ended before all parameters were found");
        }
      }
    }
  }, {
    key: "tokenize",
    value: function tokenize(d) {
      var tokens = new Array();
      while (d != "") {
        if (d.match(/^([ \t\r\n,]+)/)) {
          d = d.substr(RegExp.$1.length);
        } else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {
          tokens[tokens.length] = new PathToken(this.COMMAND, RegExp.$1);
          d = d.substr(RegExp.$1.length);
        } else if (d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {
          tokens[tokens.length] = new PathToken(this.NUMBER, parseFloat(RegExp.$1));
          d = d.substr(RegExp.$1.length);
        } else {
          console.error("Unrecognized segment command: " + d);
          return null;
        }
      }
      tokens[tokens.length] = new PathToken(this.EOD, null);
      return tokens;
    }
  }, {
    key: "closed",
    get: function get() {
      if (typeof this._closed === 'undefined') {
        this._closed = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(this.segments), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            if (s.key.toLowerCase() === 'z') {
              this._closed = true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      return this._closed;
    }
  }]);

  return ParsedPath;
}();

var RoughPath = function () {
  function RoughPath(d) {
    _classCallCheck(this, RoughPath);

    this.d = d;
    this.parsed = new ParsedPath(d);
    this._position = [0, 0];
    this.bezierReflectionPoint = null;
    this.quadReflectionPoint = null;
    this._first = null;
  }

  _createClass(RoughPath, [{
    key: "setPosition",
    value: function setPosition(x, y) {
      this._position = [x, y];
      if (!this._first) {
        this._first = [x, y];
      }
    }
  }, {
    key: "segments",
    get: function get() {
      return this.parsed.segments;
    }
  }, {
    key: "closed",
    get: function get() {
      return this.parsed.closed;
    }
  }, {
    key: "linearPoints",
    get: function get() {
      if (!this._linearPoints) {
        var lp = [];
        var points = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _getIterator(this.parsed.segments), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var s = _step2.value;

            var key = s.key.toLowerCase();
            if (key === 'm' || key === 'z') {
              if (points.length) {
                lp.push(points);
                points = [];
              }
              if (key === 'z') {
                continue;
              }
            }
            if (s.point) {
              points.push(s.point);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (points.length) {
          lp.push(points);
          points = [];
        }
        this._linearPoints = lp;
      }
      return this._linearPoints;
    }
  }, {
    key: "first",
    get: function get() {
      return this._first;
    },
    set: function set(v) {
      this._first = v;
    }
  }, {
    key: "position",
    get: function get() {
      return this._position;
    }
  }, {
    key: "x",
    get: function get() {
      return this._position[0];
    }
  }, {
    key: "y",
    get: function get() {
      return this._position[1];
    }
  }]);

  return RoughPath;
}();

var RoughArcConverter = function () {
  // Algorithm as described in https://www.w3.org/TR/SVG/implnote.html
  // Code adapted from nsSVGPathDataParser.cpp in Mozilla 
  // https://hg.mozilla.org/mozilla-central/file/17156fbebbc8/content/svg/content/src/nsSVGPathDataParser.cpp#l887
  function RoughArcConverter(from, to, radii, angle, largeArcFlag, sweepFlag) {
    _classCallCheck(this, RoughArcConverter);

    var radPerDeg = Math.PI / 180;
    this._segIndex = 0;
    this._numSegs = 0;
    if (from[0] == to[0] && from[1] == to[1]) {
      return;
    }
    this._rx = Math.abs(radii[0]);
    this._ry = Math.abs(radii[1]);
    this._sinPhi = Math.sin(angle * radPerDeg);
    this._cosPhi = Math.cos(angle * radPerDeg);
    var x1dash = this._cosPhi * (from[0] - to[0]) / 2.0 + this._sinPhi * (from[1] - to[1]) / 2.0;
    var y1dash = -this._sinPhi * (from[0] - to[0]) / 2.0 + this._cosPhi * (from[1] - to[1]) / 2.0;
    var root;
    var numerator = this._rx * this._rx * this._ry * this._ry - this._rx * this._rx * y1dash * y1dash - this._ry * this._ry * x1dash * x1dash;
    if (numerator < 0) {
      var s = Math.sqrt(1 - numerator / (this._rx * this._rx * this._ry * this._ry));
      this._rx = s;
      this._ry = s;
      root = 0;
    } else {
      root = (largeArcFlag == sweepFlag ? -1.0 : 1.0) * Math.sqrt(numerator / (this._rx * this._rx * y1dash * y1dash + this._ry * this._ry * x1dash * x1dash));
    }
    var cxdash = root * this._rx * y1dash / this._ry;
    var cydash = -root * this._ry * x1dash / this._rx;
    this._C = [0, 0];
    this._C[0] = this._cosPhi * cxdash - this._sinPhi * cydash + (from[0] + to[0]) / 2.0;
    this._C[1] = this._sinPhi * cxdash + this._cosPhi * cydash + (from[1] + to[1]) / 2.0;
    this._theta = this.calculateVectorAngle(1.0, 0.0, (x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry);
    var dtheta = this.calculateVectorAngle((x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry, (-x1dash - cxdash) / this._rx, (-y1dash - cydash) / this._ry);
    if (!sweepFlag && dtheta > 0) {
      dtheta -= 2 * Math.PI;
    } else if (sweepFlag && dtheta < 0) {
      dtheta += 2 * Math.PI;
    }
    this._numSegs = Math.ceil(Math.abs(dtheta / (Math.PI / 2)));
    this._delta = dtheta / this._numSegs;
    this._T = 8 / 3 * Math.sin(this._delta / 4) * Math.sin(this._delta / 4) / Math.sin(this._delta / 2);
    this._from = from;
  }

  _createClass(RoughArcConverter, [{
    key: "getNextSegment",
    value: function getNextSegment() {
      var cp1, cp2, to;
      if (this._segIndex == this._numSegs) {
        return null;
      }
      var cosTheta1 = Math.cos(this._theta);
      var sinTheta1 = Math.sin(this._theta);
      var theta2 = this._theta + this._delta;
      var cosTheta2 = Math.cos(theta2);
      var sinTheta2 = Math.sin(theta2);

      to = [this._cosPhi * this._rx * cosTheta2 - this._sinPhi * this._ry * sinTheta2 + this._C[0], this._sinPhi * this._rx * cosTheta2 + this._cosPhi * this._ry * sinTheta2 + this._C[1]];
      cp1 = [this._from[0] + this._T * (-this._cosPhi * this._rx * sinTheta1 - this._sinPhi * this._ry * cosTheta1), this._from[1] + this._T * (-this._sinPhi * this._rx * sinTheta1 + this._cosPhi * this._ry * cosTheta1)];
      cp2 = [to[0] + this._T * (this._cosPhi * this._rx * sinTheta2 + this._sinPhi * this._ry * cosTheta2), to[1] + this._T * (this._sinPhi * this._rx * sinTheta2 - this._cosPhi * this._ry * cosTheta2)];

      this._theta = theta2;
      this._from = [to[0], to[1]];
      this._segIndex++;

      return {
        cp1: cp1,
        cp2: cp2,
        to: to
      };
    }
  }, {
    key: "calculateVectorAngle",
    value: function calculateVectorAngle(ux, uy, vx, vy) {
      var ta = Math.atan2(uy, ux);
      var tb = Math.atan2(vy, vx);
      if (tb >= ta) return tb - ta;
      return 2 * Math.PI - (ta - tb);
    }
  }]);

  return RoughArcConverter;
}();

var PathFitter = function () {
  function PathFitter(sets, closed) {
    _classCallCheck(this, PathFitter);

    this.sets = sets;
    this.closed = closed;
  }

  _createClass(PathFitter, [{
    key: "fit",
    value: function fit(simplification) {
      var outSets = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _getIterator(this.sets), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var set = _step3.value;

          var length = set.length;
          var estLength = Math.floor(simplification * length);
          if (estLength < 5) {
            if (length <= 5) {
              continue;
            }
            estLength = 5;
          }
          outSets.push(this.reduce(set, estLength));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var d = '';
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _getIterator(outSets), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _set = _step4.value;

          for (var i = 0; i < _set.length; i++) {
            var point = _set[i];
            if (i === 0) {
              d += 'M' + point[0] + "," + point[1];
            } else {
              d += 'L' + point[0] + "," + point[1];
            }
          }
          if (this.closed) {
            d += 'z ';
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return d;
    }
  }, {
    key: "distance",
    value: function distance(p1, p2) {
      return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    }
  }, {
    key: "reduce",
    value: function reduce(set, count) {
      if (set.length <= count) {
        return set;
      }
      var points = set.slice(0);
      while (points.length > count) {
        var minArea = -1;
        var minIndex = -1;
        for (var i = 1; i < points.length - 1; i++) {
          var a = this.distance(points[i - 1], points[i]);
          var b = this.distance(points[i], points[i + 1]);
          var c = this.distance(points[i - 1], points[i + 1]);
          var s = (a + b + c) / 2.0;
          var area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
          if (minArea < 0 || area < minArea) {
            minArea = area;
            minIndex = i;
          }
        }
        if (minIndex > 0) {
          points.splice(minIndex, 1);
        } else {
          break;
        }
      }
      return points;
    }
  }]);

  return PathFitter;
}();

var RoughRenderer = function () {
  function RoughRenderer() {
    _classCallCheck(this, RoughRenderer);
  }

  _createClass(RoughRenderer, [{
    key: 'line',
    value: function line(x1, y1, x2, y2, o) {
      var ops = this._doubleLine(x1, y1, x2, y2, o);
      return { type: 'path', ops: ops };
    }
  }, {
    key: 'linearPath',
    value: function linearPath(points, close, o) {
      var len = (points || []).length;
      if (len > 2) {
        var ops = [];
        for (var i = 0; i < len - 1; i++) {
          ops = ops.concat(this._doubleLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], o));
        }
        if (close) {
          ops = ops.concat(this._doubleLine(points[len - 1][0], points[len - 1][1], points[0][0], points[0][1], o));
        }
        return { type: 'path', ops: ops };
      } else if (len === 2) {
        return this.line(points[0][0], points[0][1], points[1][0], points[1][1], o);
      }
    }
  }, {
    key: 'polygon',
    value: function polygon(points, o) {
      return this.linearPath(points, true, o);
    }
  }, {
    key: 'rectangle',
    value: function rectangle(x, y, width, height, o) {
      var points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
      return this.polygon(points, o);
    }
  }, {
    key: 'curve',
    value: function curve(points, o) {
      var o1 = this._curveWithOffset(points, 1 * (1 + o.roughness * 0.2), o);
      var o2 = this._curveWithOffset(points, 1.5 * (1 + o.roughness * 0.22), o);
      return { type: 'path', ops: o1.concat(o2) };
    }
  }, {
    key: 'ellipse',
    value: function ellipse(x, y, width, height, o) {
      var increment = Math.PI * 2 / o.curveStepCount;
      var rx = Math.abs(width / 2);
      var ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.05, rx * 0.05, o);
      ry += this._getOffset(-ry * 0.05, ry * 0.05, o);
      var o1 = this._ellipse(increment, x, y, rx, ry, 1, increment * this._getOffset(0.1, this._getOffset(0.4, 1, o), o), o);
      var o2 = this._ellipse(increment, x, y, rx, ry, 1.5, 0, o);
      return { type: 'path', ops: o1.concat(o2) };
    }
  }, {
    key: 'arc',
    value: function arc(x, y, width, height, start, stop, closed, roughClosure, o) {
      var cx = x;
      var cy = y;
      var rx = Math.abs(width / 2);
      var ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.01, rx * 0.01, o);
      ry += this._getOffset(-ry * 0.01, ry * 0.01, o);
      var strt = start;
      var stp = stop;
      while (strt < 0) {
        strt += Math.PI * 2;
        stp += Math.PI * 2;
      }
      if (stp - strt > Math.PI * 2) {
        strt = 0;
        stp = Math.PI * 2;
      }
      var ellipseInc = Math.PI * 2 / o.curveStepCount;
      var arcInc = Math.min(ellipseInc / 2, (stp - strt) / 2);
      var o1 = this._arc(arcInc, cx, cy, rx, ry, strt, stp, 1, o);
      var o2 = this._arc(arcInc, cx, cy, rx, ry, strt, stp, 1.5, o);
      var ops = o1.concat(o2);
      if (closed) {
        if (roughClosure) {
          ops = ops.concat(this._doubleLine(cx, cy, cx + rx * Math.cos(strt), cy + ry * Math.sin(strt), o));
          ops = ops.concat(this._doubleLine(cx, cy, cx + rx * Math.cos(stp), cy + ry * Math.sin(stp), o));
        } else {
          ops.push({ op: 'lineTo', data: [cx, cy] });
          ops.push({ op: 'lineTo', data: [cx + rx * Math.cos(strt), cy + ry * Math.sin(strt)] });
        }
      }
      return { type: 'path', ops: ops };
    }
  }, {
    key: 'hachureFillArc',
    value: function hachureFillArc(x, y, width, height, start, stop, o) {
      var cx = x;
      var cy = y;
      var rx = Math.abs(width / 2);
      var ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.01, rx * 0.01, o);
      ry += this._getOffset(-ry * 0.01, ry * 0.01, o);
      var strt = start;
      var stp = stop;
      while (strt < 0) {
        strt += Math.PI * 2;
        stp += Math.PI * 2;
      }
      if (stp - strt > Math.PI * 2) {
        strt = 0;
        stp = Math.PI * 2;
      }
      var increment = (stp - strt) / o.curveStepCount;
      var xc = [],
          yc = [];
      for (var angle = strt; angle <= stp; angle = angle + increment) {
        xc.push(cx + rx * Math.cos(angle));
        yc.push(cy + ry * Math.sin(angle));
      }
      xc.push(cx + rx * Math.cos(stp));
      yc.push(cy + ry * Math.sin(stp));
      xc.push(cx);
      yc.push(cy);
      return this.hachureFillShape(xc, yc, o);
    }
  }, {
    key: 'solidFillShape',
    value: function solidFillShape(xCoords, yCoords, o) {
      var ops = [];
      if (xCoords && yCoords && xCoords.length && yCoords.length && xCoords.length === yCoords.length) {
        var offset = o.maxRandomnessOffset || 0;
        var len = xCoords.length;
        if (len > 2) {
          ops.push({ op: 'move', data: [xCoords[0] + this._getOffset(-offset, offset, o), yCoords[0] + this._getOffset(-offset, offset, o)] });
          for (var i = 1; i < len; i++) {
            ops.push({ op: 'lineTo', data: [xCoords[i] + this._getOffset(-offset, offset, o), yCoords[i] + this._getOffset(-offset, offset, o)] });
          }
        }
      }
      return { type: 'fillPath', ops: ops };
    }
  }, {
    key: 'hachureFillShape',
    value: function hachureFillShape(xCoords, yCoords, o) {
      var ops = [];
      if (xCoords && yCoords && xCoords.length && yCoords.length) {
        var left = xCoords[0];
        var right = xCoords[0];
        var top = yCoords[0];
        var bottom = yCoords[0];
        for (var i = 1; i < xCoords.length; i++) {
          left = Math.min(left, xCoords[i]);
          right = Math.max(right, xCoords[i]);
          top = Math.min(top, yCoords[i]);
          bottom = Math.max(bottom, yCoords[i]);
        }
        var angle = o.hachureAngle;
        var gap = o.hachureGap;
        if (gap < 0) {
          gap = o.strokeWidth * 4;
        }
        gap = Math.max(gap, 0.1);

        var radPerDeg = Math.PI / 180;
        var hachureAngle = angle % 180 * radPerDeg;
        var cosAngle = Math.cos(hachureAngle);
        var sinAngle = Math.sin(hachureAngle);
        var tanAngle = Math.tan(hachureAngle);

        var it = new RoughHachureIterator(top - 1, bottom + 1, left - 1, right + 1, gap, sinAngle, cosAngle, tanAngle);
        var rectCoords = void 0;
        while ((rectCoords = it.getNextLine()) != null) {
          var lines = this._getIntersectingLines(rectCoords, xCoords, yCoords);
          for (var _i = 0; _i < lines.length; _i++) {
            if (_i < lines.length - 1) {
              var p1 = lines[_i];
              var p2 = lines[_i + 1];
              ops = ops.concat(this._doubleLine(p1[0], p1[1], p2[0], p2[1], o));
            }
          }
        }
      }
      return { type: 'path', ops: ops };
    }
  }, {
    key: 'hachureFillEllipse',
    value: function hachureFillEllipse(cx, cy, width, height, o) {
      var ops = [];
      var rx = Math.abs(width / 2);
      var ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.05, rx * 0.05, o);
      ry += this._getOffset(-ry * 0.05, ry * 0.05, o);
      var angle = o.hachureAngle;
      var gap = o.hachureGap;
      if (gap <= 0) {
        gap = o.strokeWidth * 4;
      }
      var fweight = o.fillWeight;
      if (fweight < 0) {
        fweight = o.strokeWidth / 2;
      }
      var radPerDeg = Math.PI / 180;
      var hachureAngle = angle % 180 * radPerDeg;
      var tanAngle = Math.tan(hachureAngle);
      var aspectRatio = ry / rx;
      var hyp = Math.sqrt(aspectRatio * tanAngle * aspectRatio * tanAngle + 1);
      var sinAnglePrime = aspectRatio * tanAngle / hyp;
      var cosAnglePrime = 1 / hyp;
      var gapPrime = gap / (rx * ry / Math.sqrt(ry * cosAnglePrime * (ry * cosAnglePrime) + rx * sinAnglePrime * (rx * sinAnglePrime)) / rx);
      var halfLen = Math.sqrt(rx * rx - (cx - rx + gapPrime) * (cx - rx + gapPrime));
      for (var xPos = cx - rx + gapPrime; xPos < cx + rx; xPos += gapPrime) {
        halfLen = Math.sqrt(rx * rx - (cx - xPos) * (cx - xPos));
        var p1 = this._affine(xPos, cy - halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
        var p2 = this._affine(xPos, cy + halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
        ops = ops.concat(this._doubleLine(p1[0], p1[1], p2[0], p2[1], o));
      }
      return { type: 'path', ops: ops };
    }
  }, {
    key: 'svgPath',
    value: function svgPath(path, o) {
      path = (path || '').replace(/\n/g, " ").replace(/(-)/g, " -").replace(/(-\s)/g, "-").replace("/(\s\s)/g", " ");
      var p = new RoughPath(path);
      if (o.simplification) {
        var fitter = new PathFitter(p.linearPoints, p.closed);
        var d = fitter.fit(o.simplification);
        p = new RoughPath(d);
      }
      var ops = [];
      var segments = p.segments || [];
      for (var i = 0; i < segments.length; i++) {
        var s = segments[i];
        var prev = i > 0 ? segments[i - 1] : null;
        var opList = this._processSegment(p, s, prev, o);
        if (opList && opList.length) {
          ops = ops.concat(opList);
        }
      }
      return { type: 'path', ops: ops };
    }

    // privates

  }, {
    key: '_bezierTo',
    value: function _bezierTo(x1, y1, x2, y2, x, y, path, o) {
      var ops = [];
      var ros = [o.maxRandomnessOffset || 1, (o.maxRandomnessOffset || 1) + 0.5];
      var f = null;
      for (var i = 0; i < 2; i++) {
        if (i === 0) {
          ops.push({ op: 'move', data: [path.x, path.y] });
        } else {
          ops.push({ op: 'move', data: [path.x + this._getOffset(-ros[0], ros[0], o), path.y + this._getOffset(-ros[0], ros[0], o)] });
        }
        f = [x + this._getOffset(-ros[i], ros[i], o), y + this._getOffset(-ros[i], ros[i], o)];
        ops.push({
          op: 'bcurveTo', data: [x1 + this._getOffset(-ros[i], ros[i], o), y1 + this._getOffset(-ros[i], ros[i], o), x2 + this._getOffset(-ros[i], ros[i], o), y2 + this._getOffset(-ros[i], ros[i], o), f[0], f[1]]
        });
      }
      path.setPosition(f[0], f[1]);
      return ops;
    }
  }, {
    key: '_processSegment',
    value: function _processSegment(path, seg, prevSeg, o) {
      var ops = [];
      switch (seg.key) {
        case 'M':
        case 'm':
          {
            var delta = seg.key === 'm';
            if (seg.data.length >= 2) {
              var x = +seg.data[0];
              var y = +seg.data[1];
              if (delta) {
                x += path.x;
                y += path.y;
              }
              var ro = 1 * (o.maxRandomnessOffset || 0);
              x = x + this._getOffset(-ro, ro, o);
              y = y + this._getOffset(-ro, ro, o);
              path.setPosition(x, y);
              ops.push({ op: 'move', data: [x, y] });
            }
            break;
          }
        case 'L':
        case 'l':
          {
            var _delta = seg.key === 'l';
            if (seg.data.length >= 2) {
              var _x = +seg.data[0];
              var _y = +seg.data[1];
              if (_delta) {
                _x += path.x;
                _y += path.y;
              }
              ops = ops.concat(this._doubleLine(path.x, path.y, _x, _y, o));
              path.setPosition(_x, _y);
            }
            break;
          }
        case 'H':
        case 'h':
          {
            var _delta2 = seg.key === 'h';
            if (seg.data.length) {
              var _x2 = +seg.data[0];
              if (_delta2) {
                _x2 += path.x;
              }
              ops = ops.concat(this._doubleLine(path.x, path.y, _x2, path.y, o));
              path.setPosition(_x2, path.y);
            }
            break;
          }
        case 'V':
        case 'v':
          {
            var _delta3 = seg.key === 'v';
            if (seg.data.length) {
              var _y2 = +seg.data[0];
              if (_delta3) {
                _y2 += path.y;
              }
              ops = ops.concat(this._doubleLine(path.x, path.y, path.x, _y2, o));
              path.setPosition(path.x, _y2);
            }
            break;
          }
        case 'Z':
        case 'z':
          {
            if (path.first) {
              ops = ops.concat(this._doubleLine(path.x, path.y, path.first[0], path.first[1], o));
              path.setPosition(path.first[0], path.first[1]);
              path.first = null;
            }
            break;
          }
        case 'C':
        case 'c':
          {
            var _delta4 = seg.key === 'c';
            if (seg.data.length >= 6) {
              var x1 = +seg.data[0];
              var y1 = +seg.data[1];
              var x2 = +seg.data[2];
              var y2 = +seg.data[3];
              var _x3 = +seg.data[4];
              var _y3 = +seg.data[5];
              if (_delta4) {
                x1 += path.x;
                x2 += path.x;
                _x3 += path.x;
                y1 += path.y;
                y2 += path.y;
                _y3 += path.y;
              }
              var ob = this._bezierTo(x1, y1, x2, y2, _x3, _y3, path, o);
              ops = ops.concat(ob);
              path.bezierReflectionPoint = [_x3 + (_x3 - x2), _y3 + (_y3 - y2)];
            }
            break;
          }
        case 'S':
        case 's':
          {
            var _delta5 = seg.key === 's';
            if (seg.data.length >= 4) {
              var _x4 = +seg.data[0];
              var _y4 = +seg.data[1];
              var _x5 = +seg.data[2];
              var _y5 = +seg.data[3];
              if (_delta5) {
                _x4 += path.x;
                _x5 += path.x;
                _y4 += path.y;
                _y5 += path.y;
              }
              var _x6 = _x4;
              var _y6 = _y4;
              var prevKey = prevSeg ? prevSeg.key : "";
              var ref = null;
              if (prevKey == 'c' || prevKey == 'C' || prevKey == 's' || prevKey == 'S') {
                ref = path.bezierReflectionPoint;
              }
              if (ref) {
                _x6 = ref[0];
                _y6 = ref[1];
              }
              var _ob = this._bezierTo(_x6, _y6, _x4, _y4, _x5, _y5, path, o);
              ops = ops.concat(_ob);
              path.bezierReflectionPoint = [_x5 + (_x5 - _x4), _y5 + (_y5 - _y4)];
            }
            break;
          }
        case 'Q':
        case 'q':
          {
            var _delta6 = seg.key === 'q';
            if (seg.data.length >= 4) {
              var _x7 = +seg.data[0];
              var _y7 = +seg.data[1];
              var _x8 = +seg.data[2];
              var _y8 = +seg.data[3];
              if (_delta6) {
                _x7 += path.x;
                _x8 += path.x;
                _y7 += path.y;
                _y8 += path.y;
              }
              var offset1 = 1 * (1 + o.roughness * 0.2);
              var offset2 = 1.5 * (1 + o.roughness * 0.22);
              ops.push({ op: 'move', data: [path.x + this._getOffset(-offset1, offset1, o), path.y + this._getOffset(-offset1, offset1, o)] });
              var f = [_x8 + this._getOffset(-offset1, offset1, o), _y8 + this._getOffset(-offset1, offset1, o)];
              ops.push({
                op: 'qcurveTo', data: [_x7 + this._getOffset(-offset1, offset1, o), _y7 + this._getOffset(-offset1, offset1, o), f[0], f[1]]
              });
              ops.push({ op: 'move', data: [path.x + this._getOffset(-offset2, offset2, o), path.y + this._getOffset(-offset2, offset2, o)] });
              f = [_x8 + this._getOffset(-offset2, offset2, o), _y8 + this._getOffset(-offset2, offset2, o)];
              ops.push({
                op: 'qcurveTo', data: [_x7 + this._getOffset(-offset2, offset2, o), _y7 + this._getOffset(-offset2, offset2, o), f[0], f[1]]
              });
              path.setPosition(f[0], f[1]);
              path.quadReflectionPoint = [_x8 + (_x8 - _x7), _y8 + (_y8 - _y7)];
            }
            break;
          }
        case 'T':
        case 't':
          {
            var _delta7 = seg.key === 't';
            if (seg.data.length >= 2) {
              var _x9 = +seg.data[0];
              var _y9 = +seg.data[1];
              if (_delta7) {
                _x9 += path.x;
                _y9 += path.y;
              }
              var _x10 = _x9;
              var _y10 = _y9;
              var _prevKey = prevSeg ? prevSeg.key : "";
              var ref = null;
              if (_prevKey == 'q' || _prevKey == 'Q' || _prevKey == 't' || _prevKey == 'T') {
                ref = path.quadReflectionPoint;
              }
              if (ref) {
                _x10 = ref[0];
                _y10 = ref[1];
              }
              var _offset = 1 * (1 + o.roughness * 0.2);
              var _offset2 = 1.5 * (1 + o.roughness * 0.22);
              ops.push({ op: 'move', data: [path.x + this._getOffset(-_offset, _offset, o), path.y + this._getOffset(-_offset, _offset, o)] });
              var _f = [_x9 + this._getOffset(-_offset, _offset, o), _y9 + this._getOffset(-_offset, _offset, o)];
              ops.push({
                op: 'qcurveTo', data: [_x10 + this._getOffset(-_offset, _offset, o), _y10 + this._getOffset(-_offset, _offset, o), _f[0], _f[1]]
              });
              ops.push({ op: 'move', data: [path.x + this._getOffset(-_offset2, _offset2, o), path.y + this._getOffset(-_offset2, _offset2, o)] });
              _f = [_x9 + this._getOffset(-_offset2, _offset2, o), _y9 + this._getOffset(-_offset2, _offset2, o)];
              ops.push({
                op: 'qcurveTo', data: [_x10 + this._getOffset(-_offset2, _offset2, o), _y10 + this._getOffset(-_offset2, _offset2, o), _f[0], _f[1]]
              });
              path.setPosition(_f[0], _f[1]);
              path.quadReflectionPoint = [_x9 + (_x9 - _x10), _y9 + (_y9 - _y10)];
            }
            break;
          }
        case 'A':
        case 'a':
          {
            var _delta8 = seg.key === 'a';
            if (seg.data.length >= 7) {
              var rx = +seg.data[0];
              var ry = +seg.data[1];
              var angle = +seg.data[2];
              var largeArcFlag = +seg.data[3];
              var sweepFlag = +seg.data[4];
              var _x11 = +seg.data[5];
              var _y11 = +seg.data[6];
              if (_delta8) {
                _x11 += path.x;
                _y11 += path.y;
              }
              if (_x11 == path.x && _y11 == path.y) {
                break;
              }
              if (rx == 0 || ry == 0) {
                ops = ops.concat(this._doubleLine(path.x, path.y, _x11, _y11, o));
                path.setPosition(_x11, _y11);
              } else {
                var _ro = o.maxRandomnessOffset || 0;
                for (var i = 0; i < 1; i++) {
                  var arcConverter = new RoughArcConverter([path.x, path.y], [_x11, _y11], [rx, ry], angle, largeArcFlag ? true : false, sweepFlag ? true : false);
                  var segment = arcConverter.getNextSegment();
                  while (segment) {
                    var _ob2 = this._bezierTo(segment.cp1[0], segment.cp1[1], segment.cp2[0], segment.cp2[1], segment.to[0], segment.to[1], path, o);
                    ops = ops.concat(_ob2);
                    segment = arcConverter.getNextSegment();
                  }
                }
              }
            }
            break;
          }
        default:
          break;
      }
      return ops;
    }
  }, {
    key: '_getOffset',
    value: function _getOffset(min, max, ops) {
      return ops.roughness * (Math.random() * (max - min) + min);
    }
  }, {
    key: '_affine',
    value: function _affine(x, y, cx, cy, sinAnglePrime, cosAnglePrime, R) {
      var A = -cx * cosAnglePrime - cy * sinAnglePrime + cx;
      var B = R * (cx * sinAnglePrime - cy * cosAnglePrime) + cy;
      var C = cosAnglePrime;
      var D = sinAnglePrime;
      var E = -R * sinAnglePrime;
      var F = R * cosAnglePrime;
      return [A + C * x + D * y, B + E * x + F * y];
    }
  }, {
    key: '_doubleLine',
    value: function _doubleLine(x1, y1, x2, y2, o) {
      var o1 = this._line(x1, y1, x2, y2, o, true, false);
      var o2 = this._line(x1, y1, x2, y2, o, true, true);
      return o1.concat(o2);
    }
  }, {
    key: '_line',
    value: function _line(x1, y1, x2, y2, o, move, overlay) {
      var lengthSq = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
      var offset = o.maxRandomnessOffset || 0;
      if (offset * offset * 100 > lengthSq) {
        offset = Math.sqrt(lengthSq) / 10;
      }
      var halfOffset = offset / 2;
      var divergePoint = 0.2 + Math.random() * 0.2;
      var midDispX = o.bowing * o.maxRandomnessOffset * (y2 - y1) / 200;
      var midDispY = o.bowing * o.maxRandomnessOffset * (x2) / 200;
      midDispX = this._getOffset(-midDispX, midDispX, o);
      midDispY = this._getOffset(-midDispY, midDispY, o);
      var ops = [];
      if (move) {
        if (overlay) {
          ops.push({
            op: 'move', data: [x1 + this._getOffset(-halfOffset, halfOffset, o), y1 + this._getOffset(-halfOffset, halfOffset, o)]
          });
        } else {
          ops.push({
            op: 'move', data: [x1 + this._getOffset(-offset, offset, o), y1 + this._getOffset(-offset, offset, o)]
          });
        }
      }
      if (overlay) {
        ops.push({
          op: 'bcurveTo', data: [midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), x2 + this._getOffset(-halfOffset, halfOffset, o), y2 + this._getOffset(-halfOffset, halfOffset, o)]
        });
      } else {
        ops.push({
          op: 'bcurveTo', data: [midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-offset, offset, o), midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-offset, offset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-offset, offset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-offset, offset, o), x2 + this._getOffset(-offset, offset, o), y2 + this._getOffset(-offset, offset, o)]
        });
      }
      return ops;
    }
  }, {
    key: '_curve',
    value: function _curve(points, closePoint, o) {
      var len = points.length;
      var ops = [];
      if (len > 3) {
        var b = [];
        var s = 1 - o.curveTightness;
        ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
        for (var i = 1; i + 2 < len; i++) {
          var cachedVertArray = points[i];
          b[0] = [cachedVertArray[0], cachedVertArray[1]];
          b[1] = [cachedVertArray[0] + (s * points[i + 1][0] - s * points[i - 1][0]) / 6, cachedVertArray[1] + (s * points[i + 1][1] - s * points[i - 1][1]) / 6];
          b[2] = [points[i + 1][0] + (s * points[i][0] - s * points[i + 2][0]) / 6, points[i + 1][1] + (s * points[i][1] - s * points[i + 2][1]) / 6];
          b[3] = [points[i + 1][0], points[i + 1][1]];
          ops.push({ op: 'bcurveTo', data: [b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]] });
        }
        if (closePoint && closePoint.length === 2) {
          var ro = o.maxRandomnessOffset;
          // TODO: more roughness here?
          ops.push({ ops: 'lineTo', data: [closePoint[0] + this._getOffset(-ro, ro, o), closePoint[1] + +this._getOffset(-ro, ro, o)] });
        }
      } else if (len === 3) {
        ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
        ops.push({
          op: 'bcurveTo', data: [points[1][0], points[1][1], points[2][0], points[2][1], points[2][0], points[2][1]]
        });
      } else if (len === 2) {
        ops = ops.concat(this._doubleLine(points[0][0], points[0][1], points[1][0], points[1][1], o));
      }
      return ops;
    }
  }, {
    key: '_ellipse',
    value: function _ellipse(increment, cx, cy, rx, ry, offset, overlap, o) {
      var radOffset = this._getOffset(-0.5, 0.5, o) - Math.PI / 2;
      var points = [];
      points.push([this._getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment), this._getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)]);
      for (var angle = radOffset; angle < Math.PI * 2 + radOffset - 0.01; angle = angle + increment) {
        points.push([this._getOffset(-offset, offset, o) + cx + rx * Math.cos(angle), this._getOffset(-offset, offset, o) + cy + ry * Math.sin(angle)]);
      }
      points.push([this._getOffset(-offset, offset, o) + cx + rx * Math.cos(radOffset + Math.PI * 2 + overlap * 0.5), this._getOffset(-offset, offset, o) + cy + ry * Math.sin(radOffset + Math.PI * 2 + overlap * 0.5)]);
      points.push([this._getOffset(-offset, offset, o) + cx + 0.98 * rx * Math.cos(radOffset + overlap), this._getOffset(-offset, offset, o) + cy + 0.98 * ry * Math.sin(radOffset + overlap)]);
      points.push([this._getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset + overlap * 0.5), this._getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset + overlap * 0.5)]);
      return this._curve(points, null, o);
    }
  }, {
    key: '_curveWithOffset',
    value: function _curveWithOffset(points, offset, o) {
      var ps = [];
      ps.push([points[0][0] + this._getOffset(-offset, offset, o), points[0][1] + this._getOffset(-offset, offset, o)]);
      ps.push([points[0][0] + this._getOffset(-offset, offset, o), points[0][1] + this._getOffset(-offset, offset, o)]);
      for (var i = 1; i < points.length; i++) {
        ps.push([points[i][0] + this._getOffset(-offset, offset, o), points[i][1] + this._getOffset(-offset, offset, o)]);
        if (i === points.length - 1) {
          ps.push([points[i][0] + this._getOffset(-offset, offset, o), points[i][1] + this._getOffset(-offset, offset, o)]);
        }
      }
      return this._curve(ps, null, o);
    }
  }, {
    key: '_arc',
    value: function _arc(increment, cx, cy, rx, ry, strt, stp, offset, o) {
      var radOffset = strt + this._getOffset(-0.1, 0.1, o);
      var points = [];
      points.push([this._getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment), this._getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)]);
      for (var angle = radOffset; angle <= stp; angle = angle + increment) {
        points.push([this._getOffset(-offset, offset, o) + cx + rx * Math.cos(angle), this._getOffset(-offset, offset, o) + cy + ry * Math.sin(angle)]);
      }
      points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
      points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
      return this._curve(points, null, o);
    }
  }, {
    key: '_getIntersectingLines',
    value: function _getIntersectingLines(lineCoords, xCoords, yCoords) {
      var intersections = [];
      var s1 = new RoughSegment(lineCoords[0], lineCoords[1], lineCoords[2], lineCoords[3]);
      for (var i = 0; i < xCoords.length; i++) {
        var s2 = new RoughSegment(xCoords[i], yCoords[i], xCoords[(i + 1) % xCoords.length], yCoords[(i + 1) % xCoords.length]);
        if (s1.compare(s2) == RoughSegmentRelation().INTERSECTS) {
          intersections.push([s1.xi, s1.yi]);
        }
      }
      return intersections;
    }
  }]);

  return RoughRenderer;
}();

self._roughScript = self.document && self.document.currentScript && self.document.currentScript.src;

var RoughCanvas = function () {
  function RoughCanvas(canvas, config) {
    _classCallCheck(this, RoughCanvas);

    this.config = config || {};
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.defaultOptions = {
      maxRandomnessOffset: 2,
      roughness: 1,
      bowing: 1,
      stroke: '#000',
      strokeWidth: 1,
      curveTightness: 0,
      curveStepCount: 9,
      fill: null,
      fillStyle: 'hachure',
      fillWeight: -1,
      hachureAngle: -41,
      hachureGap: -1
    };
    if (this.config.options) {
      this.defaultOptions = this._options(this.config.options);
    }
  }

  _createClass(RoughCanvas, [{
    key: 'lib',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var tos, worklySource, rendererSource, code, ourl;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this._renderer) {
                  if (window.workly && !this.config.noWorker) {
                    tos = Function.prototype.toString;
                    worklySource = this.config.worklyURL || 'https://cdn.jsdelivr.net/gh/pshihn/workly/dist/workly.min.js';
                    rendererSource = this.config.roughURL || self._roughScript;

                    if (rendererSource && worklySource) {
                      code = 'importScripts(\'' + worklySource + '\', \'' + rendererSource + '\');\nworkly.expose(self.rough.createRenderer());';
                      ourl = URL.createObjectURL(new Blob([code]));

                      this._renderer = workly.proxy(ourl);
                    } else {
                      this._renderer = new RoughRenderer();
                    }
                  } else {
                    this._renderer = new RoughRenderer();
                  }
                }
                return _context.abrupt('return', this._renderer);

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function lib() {
        return _ref.apply(this, arguments);
      }

      return lib;
    }()
  }, {
    key: 'line',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(x1, y1, x2, y2, options) {
        var o, lib, drawing;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                o = this._options(options);
                _context2.next = 3;
                return this.lib();

              case 3:
                lib = _context2.sent;
                _context2.next = 6;
                return lib.line(x1, y1, x2, y2, o);

              case 6:
                drawing = _context2.sent;

                this._draw(this.ctx, drawing, o);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function line(_x, _x2, _x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return line;
    }()
  }, {
    key: 'rectangle',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(x, y, width, height, options) {
        var o, lib, ctx, xc, yc, fillShape, _fillShape, drawing;

        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                o = this._options(options);
                _context3.next = 3;
                return this.lib();

              case 3:
                lib = _context3.sent;

                if (!o.fill) {
                  _context3.next = 19;
                  break;
                }

                ctx = this.ctx;
                xc = [x, x + width, x + width, x];
                yc = [y, y, y + height, y + height];

                if (!(o.fillStyle === 'solid')) {
                  _context3.next = 15;
                  break;
                }

                _context3.next = 11;
                return lib.solidFillShape(xc, yc, o);

              case 11:
                fillShape = _context3.sent;

                this._fill(ctx, fillShape, o);
                _context3.next = 19;
                break;

              case 15:
                _context3.next = 17;
                return lib.hachureFillShape(xc, yc, o);

              case 17:
                _fillShape = _context3.sent;

                this._fillSketch(ctx, _fillShape, o);

              case 19:
                _context3.next = 21;
                return lib.rectangle(x, y, width, height, o);

              case 21:
                drawing = _context3.sent;

                this._draw(this.ctx, drawing, o);

              case 23:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function rectangle(_x6, _x7, _x8, _x9, _x10) {
        return _ref3.apply(this, arguments);
      }

      return rectangle;
    }()
  }, {
    key: 'ellipse',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(x, y, width, height, options) {
        var o, lib, fillShape, _fillShape2, drawing;

        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                o = this._options(options);
                _context4.next = 3;
                return this.lib();

              case 3:
                lib = _context4.sent;

                if (!o.fill) {
                  _context4.next = 16;
                  break;
                }

                if (!(o.fillStyle === 'solid')) {
                  _context4.next = 12;
                  break;
                }

                _context4.next = 8;
                return lib.ellipse(x, y, width, height, o);

              case 8:
                fillShape = _context4.sent;

                this._fill(this.ctx, fillShape, o);
                _context4.next = 16;
                break;

              case 12:
                _context4.next = 14;
                return lib.hachureFillEllipse(x, y, width, height, o);

              case 14:
                _fillShape2 = _context4.sent;

                this._fillSketch(this.ctx, _fillShape2, o);

              case 16:
                _context4.next = 18;
                return lib.ellipse(x, y, width, height, o);

              case 18:
                drawing = _context4.sent;

                this._draw(this.ctx, drawing, o);

              case 20:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function ellipse(_x11, _x12, _x13, _x14, _x15) {
        return _ref4.apply(this, arguments);
      }

      return ellipse;
    }()
  }, {
    key: 'circle',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(x, y, radius, options) {
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.ellipse(x, y, radius, radius, options);

              case 2:
                return _context5.abrupt('return', _context5.sent);

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function circle(_x16, _x17, _x18, _x19) {
        return _ref5.apply(this, arguments);
      }

      return circle;
    }()
  }, {
    key: 'linearPath',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(points, options) {
        var o, lib, drawing;
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                o = this._options(options);
                _context6.next = 3;
                return this.lib();

              case 3:
                lib = _context6.sent;
                _context6.next = 6;
                return lib.linearPath(points, false, o);

              case 6:
                drawing = _context6.sent;

                this._draw(this.ctx, drawing, o);

              case 8:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function linearPath(_x20, _x21) {
        return _ref6.apply(this, arguments);
      }

      return linearPath;
    }()
  }, {
    key: 'polygon',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7(points, options) {
        var o, lib, xc, yc, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, p, fillShape, _fillShape3, drawing;

        return regenerator.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                o = this._options(options);
                _context7.next = 3;
                return this.lib();

              case 3:
                lib = _context7.sent;

                if (!o.fill) {
                  _context7.next = 36;
                  break;
                }

                xc = [], yc = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context7.prev = 9;

                for (_iterator = _getIterator(points); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  p = _step.value;

                  xc.push(p[0]);
                  yc.push(p[1]);
                }
                _context7.next = 17;
                break;

              case 13:
                _context7.prev = 13;
                _context7.t0 = _context7['catch'](9);
                _didIteratorError = true;
                _iteratorError = _context7.t0;

              case 17:
                _context7.prev = 17;
                _context7.prev = 18;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 20:
                _context7.prev = 20;

                if (!_didIteratorError) {
                  _context7.next = 23;
                  break;
                }

                throw _iteratorError;

              case 23:
                return _context7.finish(20);

              case 24:
                return _context7.finish(17);

              case 25:
                if (!(o.fillStyle === 'solid')) {
                  _context7.next = 32;
                  break;
                }

                _context7.next = 28;
                return lib.solidFillShape(xc, yc, o);

              case 28:
                fillShape = _context7.sent;

                this._fill(this.ctx, fillShape, o);
                _context7.next = 36;
                break;

              case 32:
                _context7.next = 34;
                return lib.hachureFillShape(xc, yc, o);

              case 34:
                _fillShape3 = _context7.sent;

                this._fillSketch(this.ctx, _fillShape3, o);

              case 36:
                _context7.next = 38;
                return lib.linearPath(points, true, o);

              case 38:
                drawing = _context7.sent;

                this._draw(this.ctx, drawing, o);

              case 40:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[9, 13, 17, 25], [18,, 20, 24]]);
      }));

      function polygon(_x22, _x23) {
        return _ref7.apply(this, arguments);
      }

      return polygon;
    }()
  }, {
    key: 'arc',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8(x, y, width, height, start, stop, closed, options) {
        var o, lib, fillShape, _fillShape4, drawing;

        return regenerator.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                o = this._options(options);
                _context8.next = 3;
                return this.lib();

              case 3:
                lib = _context8.sent;

                if (!(closed && o.fill)) {
                  _context8.next = 16;
                  break;
                }

                if (!(o.fillStyle === 'solid')) {
                  _context8.next = 12;
                  break;
                }

                _context8.next = 8;
                return lib.arc(x, y, width, height, start, stop, true, false, o);

              case 8:
                fillShape = _context8.sent;

                this._fill(this.ctx, fillShape, o);
                _context8.next = 16;
                break;

              case 12:
                _context8.next = 14;
                return lib.hachureFillArc(x, y, width, height, start, stop, o);

              case 14:
                _fillShape4 = _context8.sent;

                this._fillSketch(this.ctx, _fillShape4, o);

              case 16:
                _context8.next = 18;
                return lib.arc(x, y, width, height, start, stop, closed, true, o);

              case 18:
                drawing = _context8.sent;

                this._draw(this.ctx, drawing, o);

              case 20:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function arc(_x24, _x25, _x26, _x27, _x28, _x29, _x30, _x31) {
        return _ref8.apply(this, arguments);
      }

      return arc;
    }()
  }, {
    key: 'curve',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee9(points, options) {
        var o, lib, drawing;
        return regenerator.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                o = this._options(options);
                _context9.next = 3;
                return this.lib();

              case 3:
                lib = _context9.sent;
                _context9.next = 6;
                return lib.curve(points, o);

              case 6:
                drawing = _context9.sent;

                this._draw(this.ctx, drawing, o);

              case 8:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function curve(_x32, _x33) {
        return _ref9.apply(this, arguments);
      }

      return curve;
    }()
  }, {
    key: 'path',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee10(d, options) {
        var o, lib, p2d, size, ns, svg, pathNode, bb, xc, yc, fillShape, hcanvas, _p2d, drawing;

        return regenerator.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (d) {
                  _context10.next = 2;
                  break;
                }

                return _context10.abrupt('return');

              case 2:
                o = this._options(options);
                _context10.next = 5;
                return this.lib();

              case 5:
                lib = _context10.sent;

                if (!o.fill) {
                  _context10.next = 34;
                  break;
                }

                if (!(o.fillStyle === 'solid')) {
                  _context10.next = 15;
                  break;
                }

                this.ctx.save();
                this.ctx.fillStyle = o.fill;
                p2d = new Path2D(d);

                this.ctx.fill(p2d);
                this.ctx.restore();
                _context10.next = 34;
                break;

              case 15:
                size = [0, 0];

                try {
                  ns = "http://www.w3.org/2000/svg";
                  svg = document.createElementNS(ns, "svg");

                  svg.setAttribute("width", "0");
                  svg.setAttribute("height", "0");
                  pathNode = document.createElementNS(ns, "path");

                  pathNode.setAttribute('d', d);
                  svg.appendChild(pathNode);
                  document.body.appendChild(svg);
                  bb = pathNode.getBBox();

                  if (bb) {
                    size[0] = bb.width || 0;
                    size[1] = bb.height || 0;
                  }
                  document.body.removeChild(svg);
                } catch (err) {}
                if (!(size[0] * size[1])) {
                  size = [this.canvas.width || 100, this.canvas.height || 100];
                }
                size[0] = Math.min(size[0] * 4, this.canvas.width);
                size[1] = Math.min(size[1] * 4, this.canvas.height);
                xc = [0, size[0], size[0], 0];
                yc = [0, 0, size[1], size[1]];
                _context10.next = 24;
                return lib.hachureFillShape(xc, yc, o);

              case 24:
                fillShape = _context10.sent;
                hcanvas = document.createElement('canvas');

                hcanvas.width = size[0];
                hcanvas.height = size[1];
                this._fillSketch(hcanvas.getContext("2d"), fillShape, o);
                this.ctx.save();
                this.ctx.fillStyle = this.ctx.createPattern(hcanvas, 'repeat');
                _p2d = new Path2D(d);

                this.ctx.fill(_p2d);
                this.ctx.restore();

              case 34:
                _context10.next = 36;
                return lib.svgPath(d, o);

              case 36:
                drawing = _context10.sent;

                this._draw(this.ctx, drawing, o);

              case 38:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function path(_x34, _x35) {
        return _ref10.apply(this, arguments);
      }

      return path;
    }()

    // private

  }, {
    key: '_options',
    value: function _options(options) {
      return options ? _Object$assign({}, this.defaultOptions, options) : this.defaultOptions;
    }
  }, {
    key: '_draw',
    value: function _draw(ctx, drawing, o) {
      ctx.save();
      ctx.strokeStyle = o.stroke;
      ctx.lineWidth = o.strokeWidth;
      this._drawToContext(ctx, drawing);
      ctx.restore();
    }
  }, {
    key: '_fillSketch',
    value: function _fillSketch(ctx, drawing, o) {
      var fweight = o.fillWeight;
      if (fweight < 0) {
        fweight = o.strokeWidth / 2;
      }
      ctx.save();
      ctx.strokeStyle = o.fill;
      ctx.lineWidth = fweight;
      this._drawToContext(ctx, drawing);
      ctx.restore();
    }
  }, {
    key: '_fill',
    value: function _fill(ctx, drawing, o) {
      ctx.save();
      ctx.fillStyle = o.fill;
      drawing.type = 'fillPath';
      this._drawToContext(ctx, drawing, o);
      ctx.restore();
    }
  }, {
    key: '_drawToContext',
    value: function _drawToContext(ctx, drawing) {
      if (drawing.type === 'path' || drawing.type === 'fillPath') {
        ctx.beginPath();
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _getIterator(drawing.ops), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            var data = item.data;
            switch (item.op) {
              case 'move':
                ctx.moveTo(data[0], data[1]);
                break;
              case 'bcurveTo':
                ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
                break;
              case 'qcurveTo':
                ctx.quadraticCurveTo(data[0], data[1], data[2], data[3]);
                break;
              case 'lineTo':
                ctx.lineTo(data[0], data[1]);
                break;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (drawing.type === 'fillPath') {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }
    }
  }], [{
    key: 'createRenderer',
    value: function createRenderer() {
      return new RoughRenderer();
    }
  }]);

  return RoughCanvas;
}();

var index = {
  canvas: function canvas(_canvas, config) {
    return new RoughCanvas(_canvas, config);
  },
  createRenderer: function createRenderer() {
    return RoughCanvas.createRenderer();
  }
};

return index;

}());
