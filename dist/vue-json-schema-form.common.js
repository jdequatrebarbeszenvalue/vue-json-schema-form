module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
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
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "03a0":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "097d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var speciesConstructor = __webpack_require__("ebd6");
var promiseResolve = __webpack_require__("bcaa");

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "11da":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.symbol.async-iterator.js
var es7_symbol_async_iterator = __webpack_require__("ac4d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.symbol.js
var es6_symbol = __webpack_require__("8a81");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}
// CONCATENATED MODULE: ./src/utility/json-schema-helpers.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return scaffoldFromSchema; });
/* unused harmony export deepMerge */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return pruneEmptyMembers; });







// Recursively purge empty values
var json_schema_helpers_prune = function prune(input) {
  if (_typeof(input) === 'object') {
    if (input instanceof Date) {
      // date handling
      return input.toISOString().slice(0, 10);
    } else if (!Array.isArray(input)) {
      var output = {};

      for (var member in input) {
        var value = prune(input[member]);

        if (value !== undefined) {
          output[member] = value;
        }
      }

      if (Object.keys(output).length > 0) {
        return output;
      }
    } else {
      var _output = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _member = _step.value;

          var _value = prune(_member);

          if (_value !== undefined) {
            _output.push(_value);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (_output.length > 0) {
        return _output;
      }
    }
  } else if (input !== undefined && input !== '') {
    return input;
  }
}; // Recursively scaffold a model given a schema


var scaffold = function scaffold(input, f) {
  if (input.type === 'object') {
    var output = {};

    for (var item in input.properties) {
      output[item] = scaffold(input.properties[item], f);
    }

    return output;
  } else if (input.type === 'array') {
    return [scaffold(input.items, f)];
  } else {
    return f === undefined ? f : f(input);
  }
}; // Recursively combine two objects


var json_schema_helpers_merge = function merge(first, second) {
  if (_typeof(first) === 'object' && _typeof(second) === 'object') {
    if (!Array.isArray(first)) {
      var output = {};

      for (var member in first) {
        output[member] = merge(first[member], second[member]);
      }

      return output;
    } else {
      // return second array only if it is not empty and its first member has non-empty values
      return Array.isArray(second) && second.length > 0 && json_schema_helpers_prune(second[0]) !== undefined ? second : first;
    }
  } else {
    return second !== undefined ? second : first;
  }
};

function scaffoldFromSchema(schema, func) {
  return scaffold(schema, func);
}

function deepMerge(obj1, obj2) {
  return json_schema_helpers_merge(obj1, obj2);
}

function pruneEmptyMembers(obj) {
  var pruned = json_schema_helpers_prune(obj);
  return pruned === undefined ? {} : pruned;
}



/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "13bb":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1991":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var invoke = __webpack_require__("31f4");
var html = __webpack_require__("fab2");
var cel = __webpack_require__("230e");
var global = __webpack_require__("7726");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
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
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__("2d95")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "1b85":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InputImageElement_vue_vue_type_style_index_0_id_85aef61a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6043");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InputImageElement_vue_vue_type_style_index_0_id_85aef61a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InputImageElement_vue_vue_type_style_index_0_id_85aef61a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InputImageElement_vue_vue_type_style_index_0_id_85aef61a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "1fa8":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("cb7c");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "27ee":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("23c6");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var Iterators = __webpack_require__("84f2");
module.exports = __webpack_require__("8378").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "2877":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "31f4":
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
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


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "33a4":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("84f2");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "3730":
/***/ (function(module, exports, __webpack_require__) {

/*!
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
!function(t,e){ true?module.exports=e():undefined}(window,function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){"use strict";(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.a=n}).call(this,n(1))},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";n.r(e);var i=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)},r=n(0),o="object"==typeof self&&self&&self.Object===Object&&self,u=r.a||o||Function("return this")(),a=function(){return u.Date.now()},c=u.Symbol,s=Object.prototype,f=s.hasOwnProperty,l=s.toString,d=c?c.toStringTag:void 0;var p=function(t){var e=f.call(t,d),n=t[d];try{t[d]=void 0;var i=!0}catch(t){}var r=l.call(t);return i&&(e?t[d]=n:delete t[d]),r},v=Object.prototype.toString;var y=function(t){return v.call(t)},b="[object Null]",h="[object Undefined]",m=c?c.toStringTag:void 0;var g=function(t){return null==t?void 0===t?h:b:m&&m in Object(t)?p(t):y(t)};var j=function(t){return null!=t&&"object"==typeof t},O="[object Symbol]";var w=function(t){return"symbol"==typeof t||j(t)&&g(t)==O},x=NaN,$=/^\s+|\s+$/g,S=/^[-+]0x[0-9a-f]+$/i,E=/^0b[01]+$/i,T=/^0o[0-7]+$/i,_=parseInt;var D=function(t){if("number"==typeof t)return t;if(w(t))return x;if(i(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=i(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace($,"");var n=E.test(t);return n||T.test(t)?_(t.slice(2),n?2:8):S.test(t)?x:+t},M="Expected a function",P=Math.max,N=Math.min;var F=function(t,e,n){var r,o,u,c,s,f,l=0,d=!1,p=!1,v=!0;if("function"!=typeof t)throw new TypeError(M);function y(e){var n=r,i=o;return r=o=void 0,l=e,c=t.apply(i,n)}function b(t){var n=t-f;return void 0===f||n>=e||n<0||p&&t-l>=u}function h(){var t=a();if(b(t))return m(t);s=setTimeout(h,function(t){var n=e-(t-f);return p?N(n,u-(t-l)):n}(t))}function m(t){return s=void 0,v&&r?y(t):(r=o=void 0,c)}function g(){var t=a(),n=b(t);if(r=arguments,o=this,f=t,n){if(void 0===s)return function(t){return l=t,s=setTimeout(h,e),d?y(t):c}(f);if(p)return clearTimeout(s),s=setTimeout(h,e),y(f)}return void 0===s&&(s=setTimeout(h,e)),c}return e=D(e)||0,i(n)&&(d=!!n.leading,u=(p="maxWait"in n)?P(D(n.maxWait)||0,e):u,v="trailing"in n?!!n.trailing:v),g.cancel=function(){void 0!==s&&clearTimeout(s),l=0,r=f=o=s=void 0},g.flush=function(){return void 0===s?c:m(a())},g};var U={name:"ckeditor",render(t){return t(this.tagName)},props:{editor:{type:Function,default:null},value:{type:String,default:""},config:{type:Object,default:()=>({})},tagName:{type:String,default:"div"},disabled:{type:Boolean,default:!1}},data:()=>({instance:null,$_lastEditorData:{type:String,default:""}}),mounted(){const t=Object.assign({},this.config);this.value&&(t.initialData=this.value),this.editor.create(this.$el,t).then(t=>{this.instance=t,t.isReadOnly=this.disabled,this.$_setUpEditorEvents(),this.$emit("ready",t)}).catch(t=>{console.error(t)})},beforeDestroy(){this.instance&&(this.instance.destroy(),this.instance=null),this.$emit("destroy",this.instance)},watch:{value(t,e){t!==e&&t!==this.$_lastEditorData&&this.instance.setData(t)},disabled(t){this.instance.isReadOnly=t}},methods:{$_setUpEditorEvents(){const t=this.instance;t.model.document.on("change:data",F(e=>{const n=this.$_lastEditorData=t.getData();this.$emit("input",n,e,t)},300)),t.editing.view.document.on("focus",e=>{this.$emit("focus",e,t)}),t.editing.view.document.on("blur",e=>{this.$emit("blur",e,t)})}}};const k={install(t){t.component("ckeditor",U)},component:U};e.default=k}]).default});
//# sourceMappingURL=ckeditor.js.map

/***/ }),

/***/ "37c8":
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__("2b4c");


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "3a72":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var LIBRARY = __webpack_require__("2d00");
var wksExt = __webpack_require__("37c8");
var defineProperty = __webpack_require__("86cc").f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),

/***/ "3d54":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InputJsonFile_vue_vue_type_style_index_0_id_576e82a6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8c73");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InputJsonFile_vue_vue_type_style_index_0_id_576e82a6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InputJsonFile_vue_vue_type_style_index_0_id_576e82a6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InputJsonFile_vue_vue_type_style_index_0_id_576e82a6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "3ef3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckboxElement_vue_vue_type_style_index_0_id_71c273b0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("13bb");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckboxElement_vue_vue_type_style_index_0_id_71c273b0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckboxElement_vue_vue_type_style_index_0_id_71c273b0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckboxElement_vue_vue_type_style_index_0_id_71c273b0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4a59":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var call = __webpack_require__("1fa8");
var isArrayIter = __webpack_require__("33a4");
var anObject = __webpack_require__("cb7c");
var toLength = __webpack_require__("9def");
var getIterFn = __webpack_require__("27ee");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "5091":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RadioButtonElement_vue_vue_type_style_index_0_id_4613c018_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a338");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RadioButtonElement_vue_vue_type_style_index_0_id_4613c018_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RadioButtonElement_vue_vue_type_style_index_0_id_4613c018_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RadioButtonElement_vue_vue_type_style_index_0_id_4613c018_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "551c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var global = __webpack_require__("7726");
var ctx = __webpack_require__("9b43");
var classof = __webpack_require__("23c6");
var $export = __webpack_require__("5ca1");
var isObject = __webpack_require__("d3f4");
var aFunction = __webpack_require__("d8e8");
var anInstance = __webpack_require__("f605");
var forOf = __webpack_require__("4a59");
var speciesConstructor = __webpack_require__("ebd6");
var task = __webpack_require__("1991").set;
var microtask = __webpack_require__("8079")();
var newPromiseCapabilityModule = __webpack_require__("a5b8");
var perform = __webpack_require__("9c80");
var userAgent = __webpack_require__("a25f");
var promiseResolve = __webpack_require__("bcaa");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__("2b4c")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
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
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
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
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
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
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
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
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
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
  Internal.prototype = __webpack_require__("dcbc")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
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
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__("7f20")($Promise, PROMISE);
__webpack_require__("7a56")(PROMISE);
Wrapper = __webpack_require__("8378")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("5cc5")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
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
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5cc5":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("2b4c")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "6043":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "67ab":
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__("ca5a")('meta');
var isObject = __webpack_require__("d3f4");
var has = __webpack_require__("69a8");
var setDesc = __webpack_require__("86cc").f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__("79e5")(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "6cd0":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a20":
/***/ (function(module, exports) {

module.exports = require("buefy");

/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7bbc":
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__("6821");
var gOPN = __webpack_require__("9093").f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ "7e41":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormElementMultiple_vue_vue_type_style_index_0_id_58c46062_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d4a4");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormElementMultiple_vue_vue_type_style_index_0_id_58c46062_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormElementMultiple_vue_vue_type_style_index_0_id_58c46062_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormElementMultiple_vue_vue_type_style_index_0_id_58c46062_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "8079":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var macrotask = __webpack_require__("1991").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__("2d95")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
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
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
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
      macrotask.call(global, flush);
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


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8a81":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var DESCRIPTORS = __webpack_require__("9e1e");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var META = __webpack_require__("67ab").KEY;
var $fails = __webpack_require__("79e5");
var shared = __webpack_require__("5537");
var setToStringTag = __webpack_require__("7f20");
var uid = __webpack_require__("ca5a");
var wks = __webpack_require__("2b4c");
var wksExt = __webpack_require__("37c8");
var wksDefine = __webpack_require__("3a72");
var enumKeys = __webpack_require__("d4c0");
var isArray = __webpack_require__("1169");
var anObject = __webpack_require__("cb7c");
var isObject = __webpack_require__("d3f4");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var createDesc = __webpack_require__("4630");
var _create = __webpack_require__("2aeb");
var gOPNExt = __webpack_require__("7bbc");
var $GOPD = __webpack_require__("11e9");
var $DP = __webpack_require__("86cc");
var $keys = __webpack_require__("0d58");
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__("9093").f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__("52a7").f = $propertyIsEnumerable;
  __webpack_require__("2621").f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__("2d00")) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__("32e9")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),

/***/ "8c73":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
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


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9c80":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a25f":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "a338":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "a542":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckboxGroupElement_vue_vue_type_style_index_0_id_6f617e2c_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("6cd0");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckboxGroupElement_vue_vue_type_style_index_0_id_6f617e2c_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckboxGroupElement_vue_vue_type_style_index_0_id_6f617e2c_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckboxGroupElement_vue_vue_type_style_index_0_id_6f617e2c_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "a5b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__("d8e8");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "ac4d":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("3a72")('asyncIterator');


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "b627":
/***/ (function(module, exports) {

module.exports = require("ajv");

/***/ }),

/***/ "bcaa":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var isObject = __webpack_require__("d3f4");
var newPromiseCapability = __webpack_require__("a5b8");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "bfad":
/***/ (function(module, exports) {


var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};



/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
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


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d31f":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormElementWrapper_vue_vue_type_style_index_0_id_bc49ad20_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("03a0");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormElementWrapper_vue_vue_type_style_index_0_id_bc49ad20_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormElementWrapper_vue_vue_type_style_index_0_id_bc49ad20_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FormElementWrapper_vue_vue_type_style_index_0_id_bc49ad20_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d4a4":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "d4c0":
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__("0d58");
var gOPS = __webpack_require__("2621");
var pIE = __webpack_require__("52a7");
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "dc2d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var each = __webpack_require__("bfad");
module.exports = api;


/**
 * Convenience wrapper around the api.
 * Calls `.get` when called with an `object` and a `pointer`.
 * Calls `.set` when also called with `value`.
 * If only supplied `object`, returns a partially applied function, mapped to the object.
 *
 * @param {Object} obj
 * @param {String|Array} pointer
 * @param value
 * @returns {*}
 */

function api (obj, pointer, value) {
    // .set()
    if (arguments.length === 3) {
        return api.set(obj, pointer, value);
    }
    // .get()
    if (arguments.length === 2) {
        return api.get(obj, pointer);
    }
    // Return a partially applied function on `obj`.
    var wrapped = api.bind(api, obj);

    // Support for oo style
    for (var name in api) {
        if (api.hasOwnProperty(name)) {
            wrapped[name] = api[name].bind(wrapped, obj);
        }
    }
    return wrapped;
}


/**
 * Lookup a json pointer in an object
 *
 * @param {Object} obj
 * @param {String|Array} pointer
 * @returns {*}
 */
api.get = function get (obj, pointer) {
    var refTokens = Array.isArray(pointer) ? pointer : api.parse(pointer);

    for (var i = 0; i < refTokens.length; ++i) {
        var tok = refTokens[i];
        if (!(typeof obj == 'object' && tok in obj)) {
            throw new Error('Invalid reference token: ' + tok);
        }
        obj = obj[tok];
    }
    return obj;
};

/**
 * Sets a value on an object
 *
 * @param {Object} obj
 * @param {String|Array} pointer
 * @param value
 */
api.set = function set (obj, pointer, value) {
    var refTokens = Array.isArray(pointer) ? pointer : api.parse(pointer),
      nextTok = refTokens[0];

    for (var i = 0; i < refTokens.length - 1; ++i) {
        var tok = refTokens[i];
        if (tok === '-' && Array.isArray(obj)) {
          tok = obj.length;
        }
        nextTok = refTokens[i + 1];

        if (!(tok in obj)) {
            if (nextTok.match(/^(\d+|-)$/)) {
                obj[tok] = [];
            } else {
                obj[tok] = {};
            }
        }
        obj = obj[tok];
    }
    if (nextTok === '-' && Array.isArray(obj)) {
      nextTok = obj.length;
    }
    obj[nextTok] = value;
    return this;
};

/**
 * Removes an attribute
 *
 * @param {Object} obj
 * @param {String|Array} pointer
 */
api.remove = function (obj, pointer) {
    var refTokens = Array.isArray(pointer) ? pointer : api.parse(pointer);
    var finalToken = refTokens[refTokens.length -1];
    if (finalToken === undefined) {
        throw new Error('Invalid JSON pointer for remove: "' + pointer + '"');
    }

    var parent = api.get(obj, refTokens.slice(0, -1));
    if (Array.isArray(parent)) {
      var index = +finalToken;
      if (finalToken === '' && isNaN(index)) {
        throw new Error('Invalid array index: "' + finalToken + '"');
      }

      Array.prototype.splice.call(parent, index, 1);
    } else {
      delete parent[finalToken];
    }
};

/**
 * Returns a (pointer -> value) dictionary for an object
 *
 * @param obj
 * @param {function} descend
 * @returns {}
 */
api.dict = function dict (obj, descend) {
    var results = {};
    api.walk(obj, function (value, pointer) {
        results[pointer] = value;
    }, descend);
    return results;
};

/**
 * Iterates over an object
 * Iterator: function (value, pointer) {}
 *
 * @param obj
 * @param {function} iterator
 * @param {function} descend
 */
api.walk = function walk (obj, iterator, descend) {
    var refTokens = [];

    descend = descend || function (value) {
        var type = Object.prototype.toString.call(value);
        return type === '[object Object]' || type === '[object Array]';
    };

    (function next (cur) {
        each(cur, function (value, key) {
            refTokens.push(String(key));
            if (descend(value)) {
                next(value);
            } else {
                iterator(value, api.compile(refTokens));
            }
            refTokens.pop();
        });
    }(obj));
};

/**
 * Tests if an object has a value for a json pointer
 *
 * @param obj
 * @param pointer
 * @returns {boolean}
 */
api.has = function has (obj, pointer) {
    try {
        api.get(obj, pointer);
    } catch (e) {
        return false;
    }
    return true;
};

/**
 * Escapes a reference token
 *
 * @param str
 * @returns {string}
 */
api.escape = function escape (str) {
    return str.toString().replace(/~/g, '~0').replace(/\//g, '~1');
};

/**
 * Unescapes a reference token
 *
 * @param str
 * @returns {string}
 */
api.unescape = function unescape (str) {
    return str.replace(/~1/g, '/').replace(/~0/g, '~');
};

/**
 * Converts a json pointer into a array of reference tokens
 *
 * @param pointer
 * @returns {Array}
 */
api.parse = function parse (pointer) {
    if (pointer === '') { return []; }
    if (pointer.charAt(0) !== '/') { throw new Error('Invalid JSON pointer: ' + pointer); }
    return pointer.substring(1).split(/\//).map(api.unescape);
};

/**
 * Builds a json pointer from a array of reference tokens
 *
 * @param refTokens
 * @returns {string}
 */
api.compile = function compile (refTokens) {
    if (refTokens.length === 0) { return ''; }
    return '/' + refTokens.map(api.escape).join('/');
};


/***/ }),

/***/ "dcbc":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("2aba");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "ebd6":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("cb7c");
var aFunction = __webpack_require__("d8e8");
var SPECIES = __webpack_require__("2b4c")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "f046":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/FormElement.vue?vue&type=template&id=44b24e87&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.type,{tag:"component",attrs:{"schema":_vm.schema,"value":_vm.value},on:{"input":function($event){_vm.$emit('input', $event)}}})}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/FormElement.vue?vue&type=template&id=44b24e87&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/FormElementWrapper.vue?vue&type=template&id=bc49ad20&scoped=true&
var FormElementWrappervue_type_template_id_bc49ad20_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('fieldset',{staticClass:"field"},[(_vm.schema.title)?_c('legend',[_vm._v(_vm._s(_vm.schema.title))]):_vm._e(),(_vm.schema.description)?_c('div',{staticClass:"content"},[_vm._v(_vm._s(_vm.schema.description))]):_vm._e(),_vm._l((_vm.schema.properties),function(child,key){return _c('form-element',{key:key,attrs:{"schema":child,"value":_vm.internalValue[key]},on:{"input":function($event){_vm.updateValue($event, key)}}})})],2)}
var FormElementWrappervue_type_template_id_bc49ad20_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/FormElementWrapper.vue?vue&type=template&id=bc49ad20&scoped=true&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.promise.js
var es6_promise = __webpack_require__("551c");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.promise.finally.js
var es7_promise_finally = __webpack_require__("097d");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/FormElementWrapper.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
// import FormElement from '@/components/elements/FormElement'
/* harmony default export */ var FormElementWrappervue_type_script_lang_js_ = ({
  name: 'FormElementWrapper',
  components: {
    // load at runtime to avoid circular dependency https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
    FormElement: function FormElement() {
      return Promise.resolve(/* import() */).then(__webpack_require__.bind(null, "f046"));
    }
  },
  props: ['schema', 'value'],
  data: function data() {
    return {
      internalValue: this.value !== undefined ? this.value : {}
    };
  },
  watch: {
    value: function value(val) {
      this.internalValue = val;
    }
  },
  methods: {
    updateValue: function updateValue(value, child) {
      this.internalValue[child] = value;
      this.$emit('input', this.internalValue);
    }
  }
});
// CONCATENATED MODULE: ./src/components/elements/FormElementWrapper.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_FormElementWrappervue_type_script_lang_js_ = (FormElementWrappervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/elements/FormElementWrapper.vue?vue&type=style&index=0&id=bc49ad20&scoped=true&lang=css&
var FormElementWrappervue_type_style_index_0_id_bc49ad20_scoped_true_lang_css_ = __webpack_require__("d31f");

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/components/elements/FormElementWrapper.vue






/* normalize component */

var FormElementWrapper_component = Object(componentNormalizer["a" /* default */])(
  elements_FormElementWrappervue_type_script_lang_js_,
  FormElementWrappervue_type_template_id_bc49ad20_scoped_true_render,
  FormElementWrappervue_type_template_id_bc49ad20_scoped_true_staticRenderFns,
  false,
  null,
  "bc49ad20",
  null
  
)

FormElementWrapper_component.options.__file = "FormElementWrapper.vue"
/* harmony default export */ var FormElementWrapper = (FormElementWrapper_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/RichTextElement.vue?vue&type=template&id=9d134746&
var RichTextElementvue_type_template_id_9d134746_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{attrs:{"label":_vm.schema.title,"message":_vm.schema.description}},[_c('ckeditor',{attrs:{"editor":_vm.editor,"config":_vm.editorConfig},model:{value:(_vm.editorValue),callback:function ($$v) {_vm.editorValue=$$v},expression:"editorValue"}})],1)}
var RichTextElementvue_type_template_id_9d134746_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/RichTextElement.vue?vue&type=template&id=9d134746&

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// EXTERNAL MODULE: ./node_modules/@ckeditor/ckeditor5-vue/dist/ckeditor.js
var ckeditor = __webpack_require__("3730");
var ckeditor_default = /*#__PURE__*/__webpack_require__.n(ckeditor);

// EXTERNAL MODULE: ./node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor.js
var build_ckeditor = __webpack_require__("fb3d");
var build_ckeditor_default = /*#__PURE__*/__webpack_require__.n(build_ckeditor);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/RichTextElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//



external_commonjs_vue_commonjs2_vue_root_Vue_default.a.use(ckeditor_default.a);
/* harmony default export */ var RichTextElementvue_type_script_lang_js_ = ({
  name: 'RichTextElement',
  props: ['schema', 'value'],
  components: {
    ckeditor: ckeditor_default.a.component
  },
  data: function data() {
    return {
      editor: build_ckeditor_default.a,
      editorValue: this.value,
      editorConfig: {// The configuration of the editor.
      }
    };
  },
  watch: {
    editorValue: function editorValue($event) {
      this.$emit('input', $event);
    }
  }
});
// CONCATENATED MODULE: ./src/components/elements/RichTextElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_RichTextElementvue_type_script_lang_js_ = (RichTextElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/elements/RichTextElement.vue





/* normalize component */

var RichTextElement_component = Object(componentNormalizer["a" /* default */])(
  elements_RichTextElementvue_type_script_lang_js_,
  RichTextElementvue_type_template_id_9d134746_render,
  RichTextElementvue_type_template_id_9d134746_staticRenderFns,
  false,
  null,
  null,
  null
  
)

RichTextElement_component.options.__file = "RichTextElement.vue"
/* harmony default export */ var RichTextElement = (RichTextElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/TextElement.vue?vue&type=template&id=73d45b7c&
var TextElementvue_type_template_id_73d45b7c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{attrs:{"label":_vm.schema.title,"message":_vm.schema.description}},[_c('b-input',{attrs:{"value":_vm.value,"placeholder":_vm.schema.example},on:{"input":function($event){_vm.$emit('input', $event)}}})],1)}
var TextElementvue_type_template_id_73d45b7c_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/TextElement.vue?vue&type=template&id=73d45b7c&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/TextElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
/* harmony default export */ var TextElementvue_type_script_lang_js_ = ({
  name: 'TextElement',
  props: ['schema', 'value']
});
// CONCATENATED MODULE: ./src/components/elements/TextElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_TextElementvue_type_script_lang_js_ = (TextElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/elements/TextElement.vue





/* normalize component */

var TextElement_component = Object(componentNormalizer["a" /* default */])(
  elements_TextElementvue_type_script_lang_js_,
  TextElementvue_type_template_id_73d45b7c_render,
  TextElementvue_type_template_id_73d45b7c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

TextElement_component.options.__file = "TextElement.vue"
/* harmony default export */ var TextElement = (TextElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/TextareaElement.vue?vue&type=template&id=b4d35c3e&
var TextareaElementvue_type_template_id_b4d35c3e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{attrs:{"label":_vm.schema.title,"message":_vm.schema.description}},[_c('b-form-textarea',{attrs:{"minlength":_vm.schema.minLength,"maxlength":_vm.schema.maxLength,"value":_vm.value},on:{"input":function($event){_vm.$emit('input', $event)}}})],1)}
var TextareaElementvue_type_template_id_b4d35c3e_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/TextareaElement.vue?vue&type=template&id=b4d35c3e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/TextareaElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
/* harmony default export */ var TextareaElementvue_type_script_lang_js_ = ({
  name: 'TextareaElement',
  props: ['schema', 'value']
});
// CONCATENATED MODULE: ./src/components/elements/TextareaElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_TextareaElementvue_type_script_lang_js_ = (TextareaElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/elements/TextareaElement.vue





/* normalize component */

var TextareaElement_component = Object(componentNormalizer["a" /* default */])(
  elements_TextareaElementvue_type_script_lang_js_,
  TextareaElementvue_type_template_id_b4d35c3e_render,
  TextareaElementvue_type_template_id_b4d35c3e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

TextareaElement_component.options.__file = "TextareaElement.vue"
/* harmony default export */ var TextareaElement = (TextareaElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/NumberElement.vue?vue&type=template&id=11c3370a&
var NumberElementvue_type_template_id_11c3370a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{attrs:{"label":_vm.schema.title,"message":_vm.schema.description}},[_c('b-input',{attrs:{"type":"number","min":_vm.schema.minimum,"max":_vm.schema.maximum,"step":_vm.schema.type === 'number' ? 'any': '1',"value":_vm.value},on:{"input":function($event){_vm.$emit('input', Number($event))}}})],1)}
var NumberElementvue_type_template_id_11c3370a_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/NumberElement.vue?vue&type=template&id=11c3370a&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/NumberElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
/* harmony default export */ var NumberElementvue_type_script_lang_js_ = ({
  name: 'NumberElement',
  props: ['schema', 'value']
});
// CONCATENATED MODULE: ./src/components/elements/NumberElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_NumberElementvue_type_script_lang_js_ = (NumberElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/elements/NumberElement.vue





/* normalize component */

var NumberElement_component = Object(componentNormalizer["a" /* default */])(
  elements_NumberElementvue_type_script_lang_js_,
  NumberElementvue_type_template_id_11c3370a_render,
  NumberElementvue_type_template_id_11c3370a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

NumberElement_component.options.__file = "NumberElement.vue"
/* harmony default export */ var NumberElement = (NumberElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/SelectElement.vue?vue&type=template&id=090bac4f&
var SelectElementvue_type_template_id_090bac4f_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{attrs:{"label":_vm.schema.title,"message":_vm.schema.description}},[_c('b-select',{attrs:{"value":_vm.value,"placeholder":_vm.schema.title},on:{"input":function($event){_vm.$emit('input', $event)}}},_vm._l((_vm.schema.enum),function(item){return _c('option',{key:item,domProps:{"value":item}},[_vm._v("\n      "+_vm._s(item)+"\n    ")])}))],1)}
var SelectElementvue_type_template_id_090bac4f_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/SelectElement.vue?vue&type=template&id=090bac4f&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/SelectElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var SelectElementvue_type_script_lang_js_ = ({
  name: 'SelectElement',
  props: ['schema', 'value']
});
// CONCATENATED MODULE: ./src/components/elements/SelectElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_SelectElementvue_type_script_lang_js_ = (SelectElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/elements/SelectElement.vue





/* normalize component */

var SelectElement_component = Object(componentNormalizer["a" /* default */])(
  elements_SelectElementvue_type_script_lang_js_,
  SelectElementvue_type_template_id_090bac4f_render,
  SelectElementvue_type_template_id_090bac4f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

SelectElement_component.options.__file = "SelectElement.vue"
/* harmony default export */ var SelectElement = (SelectElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/CheckboxElement.vue?vue&type=template&id=71c273b0&scoped=true&
var CheckboxElementvue_type_template_id_71c273b0_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"field checkbox-field"},[_c('b-checkbox',{attrs:{"value":_vm.value},on:{"input":function($event){_vm.$emit('input', $event)}}},[_c('span',{staticClass:"checkbox-title"},[_vm._v(_vm._s(_vm.schema.title))]),(_vm.schema.description)?_c('p',{staticClass:"help checkbox-desc"},[_vm._v(_vm._s(_vm.schema.description))]):_vm._e()])],1)}
var CheckboxElementvue_type_template_id_71c273b0_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/CheckboxElement.vue?vue&type=template&id=71c273b0&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/CheckboxElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
/* harmony default export */ var CheckboxElementvue_type_script_lang_js_ = ({
  name: 'CheckboxElement',
  props: ['schema', 'value']
});
// CONCATENATED MODULE: ./src/components/elements/CheckboxElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_CheckboxElementvue_type_script_lang_js_ = (CheckboxElementvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/elements/CheckboxElement.vue?vue&type=style&index=0&id=71c273b0&scoped=true&lang=css&
var CheckboxElementvue_type_style_index_0_id_71c273b0_scoped_true_lang_css_ = __webpack_require__("3ef3");

// CONCATENATED MODULE: ./src/components/elements/CheckboxElement.vue






/* normalize component */

var CheckboxElement_component = Object(componentNormalizer["a" /* default */])(
  elements_CheckboxElementvue_type_script_lang_js_,
  CheckboxElementvue_type_template_id_71c273b0_scoped_true_render,
  CheckboxElementvue_type_template_id_71c273b0_scoped_true_staticRenderFns,
  false,
  null,
  "71c273b0",
  null
  
)

CheckboxElement_component.options.__file = "CheckboxElement.vue"
/* harmony default export */ var CheckboxElement = (CheckboxElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/CheckboxGroupElement.vue?vue&type=template&id=6f617e2c&scoped=true&
var CheckboxGroupElementvue_type_template_id_6f617e2c_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"field"},[(_vm.schema.title)?_c('label',{staticClass:"label"},[_vm._v(_vm._s(_vm.schema.title))]):_vm._e(),_vm._l((_vm.schema.items.anyOf),function(item,index){return _c('div',{key:index,staticClass:"field checkbox-field"},[_c('b-checkbox',{attrs:{"value":_vm.items.indexOf(item.enum[0]) !== -1},on:{"input":function($event){_vm.updateValue($event, index)}}},[_c('span',{staticClass:"checkbox-title"},[_vm._v(_vm._s(item.title))]),(item.description)?_c('p',{staticClass:"help checkbox-desc"},[_vm._v(_vm._s(item.description))]):_vm._e()])],1)})],2)}
var CheckboxGroupElementvue_type_template_id_6f617e2c_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/CheckboxGroupElement.vue?vue&type=template&id=6f617e2c&scoped=true&

// EXTERNAL MODULE: ./src/utility/json-schema-helpers.js + 1 modules
var json_schema_helpers = __webpack_require__("11da");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/CheckboxGroupElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var CheckboxGroupElementvue_type_script_lang_js_ = ({
  name: 'CheckboxGroupElement',
  props: ['schema', 'value'],
  data: function data() {
    return {
      items: this.value !== undefined ? this.value : Object(json_schema_helpers["b" /* scaffoldFromSchema */])(this.schema)
    };
  },
  methods: {
    updateValue: function updateValue(value, index) {
      var location = this.items.indexOf(this.schema.items.anyOf[index].enum[0]);

      if (value && location === -1) {
        this.items.push(this.schema.items.anyOf[index].enum[0]);
      } else if (!value && location !== -1) {
        this.items.splice(location, 1);
      }

      this.$emit('input', this.items);
    }
  }
});
// CONCATENATED MODULE: ./src/components/elements/CheckboxGroupElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_CheckboxGroupElementvue_type_script_lang_js_ = (CheckboxGroupElementvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/elements/CheckboxGroupElement.vue?vue&type=style&index=0&id=6f617e2c&scoped=true&lang=css&
var CheckboxGroupElementvue_type_style_index_0_id_6f617e2c_scoped_true_lang_css_ = __webpack_require__("a542");

// CONCATENATED MODULE: ./src/components/elements/CheckboxGroupElement.vue






/* normalize component */

var CheckboxGroupElement_component = Object(componentNormalizer["a" /* default */])(
  elements_CheckboxGroupElementvue_type_script_lang_js_,
  CheckboxGroupElementvue_type_template_id_6f617e2c_scoped_true_render,
  CheckboxGroupElementvue_type_template_id_6f617e2c_scoped_true_staticRenderFns,
  false,
  null,
  "6f617e2c",
  null
  
)

CheckboxGroupElement_component.options.__file = "CheckboxGroupElement.vue"
/* harmony default export */ var CheckboxGroupElement = (CheckboxGroupElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/RadioButtonElement.vue?vue&type=template&id=4613c018&scoped=true&
var RadioButtonElementvue_type_template_id_4613c018_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"field"},_vm._l((_vm.schema.anyOf),function(item,index){return _c('div',{key:index,staticClass:"field radio-field"},[_c('b-radio',{attrs:{"value":_vm.value,"native-value":item.enum[0]},on:{"input":function($event){_vm.$emit('input', $event)}}},[_c('span',{staticClass:"radio-title"},[_vm._v(_vm._s(item.title))])])],1)}))}
var RadioButtonElementvue_type_template_id_4613c018_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/RadioButtonElement.vue?vue&type=template&id=4613c018&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/RadioButtonElement.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var RadioButtonElementvue_type_script_lang_js_ = ({
  name: 'RadioButtonElement',
  props: ['schema', 'value']
});
// CONCATENATED MODULE: ./src/components/elements/RadioButtonElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_RadioButtonElementvue_type_script_lang_js_ = (RadioButtonElementvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/elements/RadioButtonElement.vue?vue&type=style&index=0&id=4613c018&scoped=true&lang=css&
var RadioButtonElementvue_type_style_index_0_id_4613c018_scoped_true_lang_css_ = __webpack_require__("5091");

// CONCATENATED MODULE: ./src/components/elements/RadioButtonElement.vue






/* normalize component */

var RadioButtonElement_component = Object(componentNormalizer["a" /* default */])(
  elements_RadioButtonElementvue_type_script_lang_js_,
  RadioButtonElementvue_type_template_id_4613c018_scoped_true_render,
  RadioButtonElementvue_type_template_id_4613c018_scoped_true_staticRenderFns,
  false,
  null,
  "4613c018",
  null
  
)

RadioButtonElement_component.options.__file = "RadioButtonElement.vue"
/* harmony default export */ var RadioButtonElement = (RadioButtonElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/FormElementMultiple.vue?vue&type=template&id=58c46062&scoped=true&
var FormElementMultiplevue_type_template_id_58c46062_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('fieldset',{staticClass:"field"},[(_vm.schema.title)?_c('legend',[_vm._v(_vm._s(_vm.schema.title))]):_vm._e(),_vm._l((_vm.items),function(item,index){return _c('div',{key:index,staticClass:"columns"},[_c('div',{staticClass:"column"},[_c('form-element',{attrs:{"schema":_vm.schema.items,"value":item},on:{"input":function($event){_vm.updateValue($event, index)}}})],1),_c('div',{staticClass:"column is-narrow"},[(_vm.items.length > 0)?_c('button',{key:("remove-" + index),staticClass:"button is-danger",attrs:{"type":"button"},on:{"click":function($event){_vm.items.splice(index, 1)}}},[_vm._v("Remove")]):_vm._e()])])}),_c('button',{staticClass:"button",attrs:{"type":"button"},on:{"click":function($event){_vm.addItem()}}},[_vm._v("Add Item")])],2)}
var FormElementMultiplevue_type_template_id_58c46062_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/FormElementMultiple.vue?vue&type=template&id=58c46062&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/FormElementMultiple.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var FormElementMultiplevue_type_script_lang_js_ = ({
  name: 'FormElementMultiple',
  components: {
    // load at runtime to avoid circular dependency https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
    FormElement: function FormElement() {
      return Promise.resolve(/* import() */).then(__webpack_require__.bind(null, "f046"));
    }
  },
  props: ['schema', 'value'],
  data: function data() {
    return {
      items: this.value !== undefined ? this.value : Object(json_schema_helpers["b" /* scaffoldFromSchema */])(this.schema)
    };
  },
  methods: {
    addItem: function addItem() {
      this.items.push(Object(json_schema_helpers["b" /* scaffoldFromSchema */])(this.schema)[0]);
    },
    updateValue: function updateValue(value, index) {
      this.items.splice(index, 1, value);
      this.$emit('input', this.items);
    }
  }
});
// CONCATENATED MODULE: ./src/components/elements/FormElementMultiple.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_FormElementMultiplevue_type_script_lang_js_ = (FormElementMultiplevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/elements/FormElementMultiple.vue?vue&type=style&index=0&id=58c46062&scoped=true&lang=css&
var FormElementMultiplevue_type_style_index_0_id_58c46062_scoped_true_lang_css_ = __webpack_require__("7e41");

// CONCATENATED MODULE: ./src/components/elements/FormElementMultiple.vue






/* normalize component */

var FormElementMultiple_component = Object(componentNormalizer["a" /* default */])(
  elements_FormElementMultiplevue_type_script_lang_js_,
  FormElementMultiplevue_type_template_id_58c46062_scoped_true_render,
  FormElementMultiplevue_type_template_id_58c46062_scoped_true_staticRenderFns,
  false,
  null,
  "58c46062",
  null
  
)

FormElementMultiple_component.options.__file = "FormElementMultiple.vue"
/* harmony default export */ var FormElementMultiple = (FormElementMultiple_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/DatePickerElement.vue?vue&type=template&id=41956666&
var DatePickerElementvue_type_template_id_41956666_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{attrs:{"label":_vm.schema.title,"message":_vm.schema.description}},[_c('b-datepicker',{attrs:{"value":_vm.value,"placeholder":"Click to select date"},on:{"input":function($event){_vm.$emit('input', $event)}}})],1)}
var DatePickerElementvue_type_template_id_41956666_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/DatePickerElement.vue?vue&type=template&id=41956666&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/DatePickerElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
/* harmony default export */ var DatePickerElementvue_type_script_lang_js_ = ({
  name: 'DatePickerElement',
  props: ['schema', 'value']
});
// CONCATENATED MODULE: ./src/components/elements/DatePickerElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_DatePickerElementvue_type_script_lang_js_ = (DatePickerElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/elements/DatePickerElement.vue





/* normalize component */

var DatePickerElement_component = Object(componentNormalizer["a" /* default */])(
  elements_DatePickerElementvue_type_script_lang_js_,
  DatePickerElementvue_type_template_id_41956666_render,
  DatePickerElementvue_type_template_id_41956666_staticRenderFns,
  false,
  null,
  null,
  null
  
)

DatePickerElement_component.options.__file = "DatePickerElement.vue"
/* harmony default export */ var DatePickerElement = (DatePickerElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/InputImageElement.vue?vue&type=template&id=85aef61a&scoped=true&
var InputImageElementvue_type_template_id_85aef61a_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{staticClass:"file",attrs:{"label":_vm.schema.title}},[_c('b-upload',{attrs:{"accept":"image/png, image/jpeg, image/gif, image/jpg"},on:{"input":_vm.onLoad},model:{value:(_vm.file),callback:function ($$v) {_vm.file=$$v},expression:"file"}},[_c('img',{attrs:{"src":_vm.preview || _vm.value}}),(_vm.file)?_c('b-field',{attrs:{"message":_vm.file.name}}):_vm._e(),_c('a',{staticClass:"button"},[_c('span',[_vm._v(" Click to upload ")])])],1)],1)}
var InputImageElementvue_type_template_id_85aef61a_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/InputImageElement.vue?vue&type=template&id=85aef61a&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/InputImageElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var InputImageElementvue_type_script_lang_js_ = ({
  name: 'InputImageElement',
  props: ['schema', 'value'],
  data: function data() {
    return {
      file: null,
      preview: "",
      maxSize: 2
    };
  },
  methods: {
    onLoad: function onLoad(evt) {
      var _this = this;

      if (evt.size / Math.pow(1000, 2) > this.maxSize) {
        this.file = null;
        this.preview = null;
        return false;
      }

      var reader = new FileReader();
      reader.readAsDataURL(this.file);

      reader.onload = function ()
      /*evt*/
      {
        _this.preview = reader.result;

        _this.$emit('input', reader.result);
      };
    }
  }
});
// CONCATENATED MODULE: ./src/components/elements/InputImageElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_InputImageElementvue_type_script_lang_js_ = (InputImageElementvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/elements/InputImageElement.vue?vue&type=style&index=0&id=85aef61a&scoped=true&lang=css&
var InputImageElementvue_type_style_index_0_id_85aef61a_scoped_true_lang_css_ = __webpack_require__("1b85");

// CONCATENATED MODULE: ./src/components/elements/InputImageElement.vue






/* normalize component */

var InputImageElement_component = Object(componentNormalizer["a" /* default */])(
  elements_InputImageElementvue_type_script_lang_js_,
  InputImageElementvue_type_template_id_85aef61a_scoped_true_render,
  InputImageElementvue_type_template_id_85aef61a_scoped_true_staticRenderFns,
  false,
  null,
  "85aef61a",
  null
  
)

InputImageElement_component.options.__file = "InputImageElement.vue"
/* harmony default export */ var InputImageElement = (InputImageElement_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/InputJsonFile.vue?vue&type=template&id=576e82a6&scoped=true&
var InputJsonFilevue_type_template_id_576e82a6_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-field',{staticClass:"file",attrs:{"label":_vm.schema.title}},[_c('b-upload',{attrs:{"accept":"application/json"},on:{"input":_vm.onLoad},model:{value:(_vm.file),callback:function ($$v) {_vm.file=$$v},expression:"file"}},[(_vm.file)?_c('b-field',{attrs:{"message":_vm.file.name}}):_vm._e(),_c('a',{staticClass:"button"},[_c('span',[_vm._v(" Click to upload ")])])],1)],1)}
var InputJsonFilevue_type_template_id_576e82a6_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/elements/InputJsonFile.vue?vue&type=template&id=576e82a6&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/InputJsonFile.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var InputJsonFilevue_type_script_lang_js_ = ({
  name: 'InputJsonFile',
  props: ['schema', 'value'],
  data: function data() {
    return {
      file: null //preview: "",

    };
  },
  methods: {
    onLoad: function onLoad()
    /*evt*/
    {
      var _this = this;

      var reader = new FileReader();
      reader.readAsText(this.file);

      reader.onload = function ()
      /*evt*/
      {
        //this.preview = reader.result;
        _this.$emit('input', reader.result);
      };
    }
  }
});
// CONCATENATED MODULE: ./src/components/elements/InputJsonFile.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_InputJsonFilevue_type_script_lang_js_ = (InputJsonFilevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/elements/InputJsonFile.vue?vue&type=style&index=0&id=576e82a6&scoped=true&lang=css&
var InputJsonFilevue_type_style_index_0_id_576e82a6_scoped_true_lang_css_ = __webpack_require__("3d54");

// CONCATENATED MODULE: ./src/components/elements/InputJsonFile.vue






/* normalize component */

var InputJsonFile_component = Object(componentNormalizer["a" /* default */])(
  elements_InputJsonFilevue_type_script_lang_js_,
  InputJsonFilevue_type_template_id_576e82a6_scoped_true_render,
  InputJsonFilevue_type_template_id_576e82a6_scoped_true_staticRenderFns,
  false,
  null,
  "576e82a6",
  null
  
)

InputJsonFile_component.options.__file = "InputJsonFile.vue"
/* harmony default export */ var InputJsonFile = (InputJsonFile_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/elements/FormElement.vue?vue&type=script&lang=js&
//
//
//
//













/* harmony default export */ var FormElementvue_type_script_lang_js_ = ({
  name: 'FormElement',
  props: ['schema', 'value'],
  computed: {
    type: function type() {
      var component = TextElement;

      if (this.schema.widget !== undefined) {
        // allow the schema to specify widget
        // currently only textarea is supported
        if (this.schema.widget === 'textarea') {
          component = TextareaElement;
        } // CKeditor


        if (this.schema.widget === 'richtext') {
          component = RichTextElement;
        } // possibility to load an image in base64


        if (this.schema.widget === 'img') {
          component = InputImageElement;
        }

        if (this.schema.widget === 'json') {
          component = InputJsonFile;
        }
      } else if (this.schema.anyOf !== undefined) {
        component = RadioButtonElement;
      } else if (this.schema.enum !== undefined) {
        component = SelectElement;
      } else if (this.schema.type === 'boolean') {
        component = CheckboxElement;
      } else if (this.schema.type === 'array') {
        component = this.schema.items.anyOf === undefined ? FormElementMultiple : CheckboxGroupElement;
      } else if (this.schema.type === 'object') {
        component = FormElementWrapper;
      } else if (this.schema.type === 'integer' || this.schema.type === 'number') {
        component = NumberElement;
      } else if (this.schema.format === 'date') {
        component = DatePickerElement;
      }

      return component;
    }
  }
});
// CONCATENATED MODULE: ./src/components/elements/FormElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var elements_FormElementvue_type_script_lang_js_ = (FormElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/elements/FormElement.vue





/* normalize component */

var FormElement_component = Object(componentNormalizer["a" /* default */])(
  elements_FormElementvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

FormElement_component.options.__file = "FormElement.vue"
/* harmony default export */ var FormElement = __webpack_exports__["default"] = (FormElement_component.exports);

/***/ }),

/***/ "f605":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: external {"amd":"buefy","commonjs":"buefy","commonjs2":"buefy","root":"Buefy"}
var external_amd_buefy_commonjs_buefy_commonjs2_buefy_root_Buefy_ = __webpack_require__("7a20");
var external_amd_buefy_commonjs_buefy_commonjs2_buefy_root_Buefy_default = /*#__PURE__*/__webpack_require__.n(external_amd_buefy_commonjs_buefy_commonjs2_buefy_root_Buefy_);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"50c18fd5-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/SchemaForm.vue?vue&type=template&id=17fdf74a&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('form',{on:{"submit":function($event){$event.preventDefault();return _vm.submit($event)}}},[_vm._t("header",[_c('b-notification',{directives:[{name:"show",rawName:"v-show",value:(_vm.activeErrorMessages.length),expression:"activeErrorMessages.length"}],attrs:{"type":"is-danger","closable":false,"id":"error-messages"}},_vm._l((_vm.activeErrorMessages),function(error,index){return _c('div',{key:index},[_c('div',[_vm._v(_vm._s(error))])])}))],{errorMessages:_vm.activeErrorMessages}),_vm._l((_vm.schema.properties),function(property,key){return [_vm._t(key,[_c(_vm.element,{key:key,tag:"component",attrs:{"schema":property,"value":_vm.items[key]},on:{"input":function($event){_vm.updateValue($event, key)}}})],{item:{key: key, schema: property, value: _vm.items[key], update: _vm.updateValue}})]}),_vm._t("actions",[_vm._m(0)])],2)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"control"},[_c('button',{staticClass:"button is-primary",attrs:{"type":"submit"}},[_c('span',[_vm._v("Submit")])])])}]


// CONCATENATED MODULE: ./src/components/SchemaForm.vue?vue&type=template&id=17fdf74a&

// EXTERNAL MODULE: external {"amd":"ajv","commonjs":"ajv","commonjs2":"ajv","root":"Ajv"}
var external_amd_ajv_commonjs_ajv_commonjs2_ajv_root_Ajv_ = __webpack_require__("b627");
var external_amd_ajv_commonjs_ajv_commonjs2_ajv_root_Ajv_default = /*#__PURE__*/__webpack_require__.n(external_amd_ajv_commonjs_ajv_commonjs2_ajv_root_Ajv_);

// EXTERNAL MODULE: ./node_modules/json-pointer/index.js
var json_pointer = __webpack_require__("dc2d");
var json_pointer_default = /*#__PURE__*/__webpack_require__.n(json_pointer);

// EXTERNAL MODULE: ./src/components/elements/FormElement.vue + 69 modules
var FormElement = __webpack_require__("f046");

// EXTERNAL MODULE: ./src/utility/json-schema-helpers.js + 1 modules
var json_schema_helpers = __webpack_require__("11da");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/SchemaForm.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




var ajv = new external_amd_ajv_commonjs_ajv_commonjs2_ajv_root_Ajv_default.a({
  allErrors: true,
  jsonPointers: true,
  format: 'full'
});
/* harmony default export */ var SchemaFormvue_type_script_lang_js_ = ({
  name: 'SchemaForm',
  components: {
    FormElement: FormElement["default"]
  },
  props: {
    schema: {
      type: Object
    },
    value: {
      type: Object
    },
    element: {
      default: function _default() {
        return 'form-element';
      }
    }
  },
  data: function data() {
    return {
      items: this.value !== undefined ? this.value : Object(json_schema_helpers["b" /* scaffoldFromSchema */])(this.schema),
      activeErrorMessages: []
    };
  },
  watch: {
    schema: function schema() {
      this.items = Object(json_schema_helpers["b" /* scaffoldFromSchema */])(this.schema);
      ajv = new external_amd_ajv_commonjs_ajv_commonjs2_ajv_root_Ajv_default.a({
        allErrors: true,
        jsonPointers: true,
        format: 'full'
      });
    }
  },
  methods: {
    submit: function submit() {
      if (this.validate()) {
        this.activeErrorMessages = [];
        this.$emit('input', Object(json_schema_helpers["a" /* pruneEmptyMembers */])(this.items));
        this.$emit('submit');
      } else {
        this.buildErrors();
      }
    },
    validate: function validate() {
      // validate against schema
      return ajv.validate(this.schema, Object(json_schema_helpers["a" /* pruneEmptyMembers */])(this.items));
    },
    buildErrors: function buildErrors() {
      var _this = this;

      this.activeErrorMessages = ajv.errors.map(function (error) {
        if (error.keyword === 'required') {
          var path = error.dataPath.length === 0 ? "/properties/".concat(error.params.missingProperty) : error.schemaPath.substring(1, error.schemaPath.length - 8) + "properties/".concat(error.params.missingProperty);
          var property = json_pointer_default.a.get(_this.schema, path);
          return property.title + ' is required';
        } else if (error.keyword === 'format') {
          var _path = error.schemaPath.substring(1, error.schemaPath.length - 7);

          var _property = json_pointer_default.a.get(_this.schema, _path);

          return "".concat(_property.title, " is not in the correct format. Eg: ").concat(_property.example);
        } else if (error.keyword === 'pattern') {
          var _path2 = error.schemaPath.substring(1, error.schemaPath.length - 8);

          var _property2 = json_pointer_default.a.get(_this.schema, _path2);

          return "".concat(_property2.title, " is not in the correct format. Eg: ").concat(_property2.example);
        }
      });
    },
    updateValue: function updateValue(value, child) {
      this.items[child] = value;
      this.$emit('input', Object(json_schema_helpers["a" /* pruneEmptyMembers */])(this.items));
    }
  }
});
// CONCATENATED MODULE: ./src/components/SchemaForm.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_SchemaFormvue_type_script_lang_js_ = (SchemaFormvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/components/SchemaForm.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_SchemaFormvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

component.options.__file = "SchemaForm.vue"
/* harmony default export */ var SchemaForm = (component.exports);
// CONCATENATED MODULE: ./src/components/index.js


var VueJsonSchemaForm = {
  install: function install(Vue) {
    Vue.use(external_amd_buefy_commonjs_buefy_commonjs2_buefy_root_Buefy_default.a);
    Vue.component('SchemaForm', SchemaForm);
  }
};
/* harmony default export */ var components = (VueJsonSchemaForm);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js
/* concated harmony reexport SchemaForm */__webpack_require__.d(__webpack_exports__, "SchemaForm", function() { return SchemaForm; });


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (components);



/***/ }),

/***/ "fb3d":
/***/ (function(module, exports, __webpack_require__) {

/*!
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
!function(t){const e=t.en=t.en||{};e.dictionary=Object.assign(e.dictionary||{},{"%0 of %1":"%0 of %1","Block quote":"Block quote",Bold:"Bold","Bulleted List":"Bulleted List",Cancel:"Cancel","Cannot upload file:":"Cannot upload file:","Centered image":"Centered image","Change image text alternative":"Change image text alternative","Choose heading":"Choose heading",Column:"Column","Could not insert image at the current position.":"Could not insert image at the current position.","Could not obtain resized image URL.":"Could not obtain resized image URL.","Decrease indent":"Decrease indent","Delete column":"Delete column","Delete row":"Delete row",Downloadable:"Downloadable","Dropdown toolbar":"Dropdown toolbar","Edit link":"Edit link","Editor toolbar":"Editor toolbar","Enter image caption":"Enter image caption","Full size image":"Full size image","Header column":"Header column","Header row":"Header row",Heading:"Heading","Heading 1":"Heading 1","Heading 2":"Heading 2","Heading 3":"Heading 3","Heading 4":"Heading 4","Heading 5":"Heading 5","Heading 6":"Heading 6","Image toolbar":"Image toolbar","image widget":"image widget","Increase indent":"Increase indent","Insert column left":"Insert column left","Insert column right":"Insert column right","Insert image":"Insert image","Insert image or file":"Insert image or file","Insert media":"Insert media","Insert row above":"Insert row above","Insert row below":"Insert row below","Insert table":"Insert table","Inserting image failed":"Inserting image failed",Italic:"Italic","Left aligned image":"Left aligned image",Link:"Link","Link URL":"Link URL","Media URL":"Media URL","media widget":"media widget","Merge cell down":"Merge cell down","Merge cell left":"Merge cell left","Merge cell right":"Merge cell right","Merge cell up":"Merge cell up","Merge cells":"Merge cells",Next:"Next","Numbered List":"Numbered List","Open in a new tab":"Open in a new tab","Open link in new tab":"Open link in new tab",Paragraph:"Paragraph","Paste the media URL in the input.":"Paste the media URL in the input.",Previous:"Previous",Redo:"Redo","Rich Text Editor":"Rich Text Editor","Rich Text Editor, %0":"Rich Text Editor, %0","Right aligned image":"Right aligned image",Row:"Row",Save:"Save","Select column":"Select column","Select row":"Select row","Selecting resized image failed":"Selecting resized image failed","Show more items":"Show more items","Side image":"Side image","Split cell horizontally":"Split cell horizontally","Split cell vertically":"Split cell vertically","Table toolbar":"Table toolbar","Text alternative":"Text alternative","The URL must not be empty.":"The URL must not be empty.","This link has no URL":"This link has no URL","This media URL is not supported.":"This media URL is not supported.","Tip: Paste the URL into the content to embed faster.":"Tip: Paste the URL into the content to embed faster.",Undo:"Undo",Unlink:"Unlink","Upload failed":"Upload failed","Upload in progress":"Upload in progress","Widget toolbar":"Widget toolbar"})}(window.CKEDITOR_TRANSLATIONS||(window.CKEDITOR_TRANSLATIONS={})),function(t,e){ true?module.exports=e():undefined}(window,(function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=94)}([function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"a",(function(){return o}));class i extends Error{constructor(t,e,n){t=o(t),n&&(t+=" "+JSON.stringify(n)),super(t),this.name="CKEditorError",this.context=e,this.data=n}is(t){return"CKEditorError"===t}static rethrowUnexpectedError(t,e){if(t.is&&t.is("CKEditorError"))throw t;const n=new i(t.message,e);throw n.stack=t.stack,n}}function o(t){const e=t.match(/^([^:]+):/);return e?t+` Read more: https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/error-codes.html#error-${e[1]}\n`:t}},function(t,e,n){"use strict";var i,o=function(){return void 0===i&&(i=Boolean(window&&document&&document.all&&!window.atob)),i},r=function(){var t={};return function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}t[e]=n}return t[e]}}(),s=[];function a(t){for(var e=-1,n=0;n<s.length;n++)if(s[n].identifier===t){e=n;break}return e}function c(t,e){for(var n={},i=[],o=0;o<t.length;o++){var r=t[o],c=e.base?r[0]+e.base:r[0],l=n[c]||0,d="".concat(c," ").concat(l);n[c]=l+1;var u=a(d),h={css:r[1],media:r[2],sourceMap:r[3]};-1!==u?(s[u].references++,s[u].updater(h)):s.push({identifier:d,updater:p(h,e),references:1}),i.push(d)}return i}function l(t){var e=document.createElement("style"),i=t.attributes||{};if(void 0===i.nonce){var o=n.nc;o&&(i.nonce=o)}if(Object.keys(i).forEach((function(t){e.setAttribute(t,i[t])})),"function"==typeof t.insert)t.insert(e);else{var s=r(t.insert||"head");if(!s)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");s.appendChild(e)}return e}var d,u=(d=[],function(t,e){return d[t]=e,d.filter(Boolean).join("\n")});function h(t,e,n,i){var o=n?"":i.media?"@media ".concat(i.media," {").concat(i.css,"}"):i.css;if(t.styleSheet)t.styleSheet.cssText=u(e,o);else{var r=document.createTextNode(o),s=t.childNodes;s[e]&&t.removeChild(s[e]),s.length?t.insertBefore(r,s[e]):t.appendChild(r)}}function f(t,e,n){var i=n.css,o=n.media,r=n.sourceMap;if(o?t.setAttribute("media",o):t.removeAttribute("media"),r&&btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),t.styleSheet)t.styleSheet.cssText=i;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(i))}}var m=null,g=0;function p(t,e){var n,i,o;if(e.singleton){var r=g++;n=m||(m=l(e)),i=h.bind(null,n,r,!1),o=h.bind(null,n,r,!0)}else n=l(e),i=f.bind(null,n,e),o=function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(n)};return i(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;i(t=e)}else o()}}t.exports=function(t,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=o());var n=c(t=t||[],e);return function(t){if(t=t||[],"[object Array]"===Object.prototype.toString.call(t)){for(var i=0;i<n.length;i++){var o=a(n[i]);s[o].references--}for(var r=c(t,e),l=0;l<n.length;l++){var d=a(n[l]);0===s[d].references&&(s[d].updater(),s.splice(d,1))}n=r}}}},,function(t,e,n){"use strict";var i=n(7),o="object"==typeof self&&self&&self.Object===Object&&self,r=i.a||o||Function("return this")();e.a=r},function(t,e,n){"use strict";(function(t){var i=n(3),o=n(12),r= true&&exports&&!exports.nodeType&&exports,s=r&&"object"==typeof t&&t&&!t.nodeType&&t,a=s&&s.exports===r?i.a.Buffer:void 0,c=(a?a.isBuffer:void 0)||o.a;e.a=c}).call(this,n(9)(t))},function(t,e,n){"use strict";(function(t){var i=n(7),o= true&&exports&&!exports.nodeType&&exports,r=o&&"object"==typeof t&&t&&!t.nodeType&&t,s=r&&r.exports===o&&i.a.process,a=function(){try{var t=r&&r.require&&r.require("util").types;return t||s&&s.binding&&s.binding("util")}catch(t){}}();e.a=a}).call(this,n(9)(t))},function(t,e,n){"use strict";(function(t){var e=n(0);const i="object"==typeof window?window:t;if(i.CKEDITOR_VERSION)throw new e.b("ckeditor-duplicated-modules: Some CKEditor 5 modules are duplicated.",null);i.CKEDITOR_VERSION="19.0.0"}).call(this,n(10))},function(t,e,n){"use strict";(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.a=n}).call(this,n(10))},function(t,e,n){"use strict";(function(t){var i=n(3),o= true&&exports&&!exports.nodeType&&exports,r=o&&"object"==typeof t&&t&&!t.nodeType&&t,s=r&&r.exports===o?i.a.Buffer:void 0,a=s?s.allocUnsafe:void 0;e.a=function(t,e){if(e)return t.slice();var n=t.length,i=a?a(n):new t.constructor(n);return t.copy(i),i}}).call(this,n(9)(t))},function(t,e){t.exports=function(t){if(!t.webpackPolyfill){var e=Object.create(t);e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),Object.defineProperty(e,"exports",{enumerable:!0}),e.webpackPolyfill=1}return e}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){var i=n(1),o=n(69);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e,n){"use strict";e.a=function(){return!1}},function(t,e,n){var i=n(1),o=n(14);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-placeholder:before,.ck .ck-placeholder:before{content:attr(data-placeholder);pointer-events:none}.ck.ck-read-only .ck-placeholder:before{display:none}.ck.ck-placeholder:before,.ck .ck-placeholder:before{cursor:text;color:var(--ck-color-engine-placeholder-text)}"},function(t,e,n){var i=n(1),o=n(16);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck-hidden{display:none!important}.ck.ck-reset,.ck.ck-reset_all,.ck.ck-reset_all *{box-sizing:border-box;width:auto;height:auto;position:static}:root{--ck-z-default:1;--ck-z-modal:calc(var(--ck-z-default) + 999);--ck-color-base-foreground:#fafafa;--ck-color-base-background:#fff;--ck-color-base-border:#c4c4c4;--ck-color-base-action:#61b045;--ck-color-base-focus:#6cb5f9;--ck-color-base-text:#333;--ck-color-base-active:#198cf0;--ck-color-base-active-focus:#0e7fe1;--ck-color-base-error:#db3700;--ck-color-focus-border:#1f89e5;--ck-color-focus-outer-shadow:#bcdefb;--ck-color-focus-disabled-shadow:rgba(119,186,248,0.3);--ck-color-focus-error-shadow:rgba(255,64,31,0.3);--ck-color-text:var(--ck-color-base-text);--ck-color-shadow-drop:rgba(0,0,0,0.15);--ck-color-shadow-drop-active:rgba(0,0,0,0.2);--ck-color-shadow-inner:rgba(0,0,0,0.1);--ck-color-button-default-background:transparent;--ck-color-button-default-hover-background:#e6e6e6;--ck-color-button-default-active-background:#d9d9d9;--ck-color-button-default-active-shadow:#bfbfbf;--ck-color-button-default-disabled-background:transparent;--ck-color-button-on-background:#dedede;--ck-color-button-on-hover-background:#c4c4c4;--ck-color-button-on-active-background:#bababa;--ck-color-button-on-active-shadow:#a1a1a1;--ck-color-button-on-disabled-background:#dedede;--ck-color-button-action-background:var(--ck-color-base-action);--ck-color-button-action-hover-background:#579e3d;--ck-color-button-action-active-background:#53973b;--ck-color-button-action-active-shadow:#498433;--ck-color-button-action-disabled-background:#7ec365;--ck-color-button-action-text:var(--ck-color-base-background);--ck-color-button-save:#008a00;--ck-color-button-cancel:#db3700;--ck-color-switch-button-off-background:#b0b0b0;--ck-color-switch-button-off-hover-background:#a3a3a3;--ck-color-switch-button-on-background:var(--ck-color-button-action-background);--ck-color-switch-button-on-hover-background:#579e3d;--ck-color-switch-button-inner-background:var(--ck-color-base-background);--ck-color-switch-button-inner-shadow:rgba(0,0,0,0.1);--ck-color-dropdown-panel-background:var(--ck-color-base-background);--ck-color-dropdown-panel-border:var(--ck-color-base-border);--ck-color-input-background:var(--ck-color-base-background);--ck-color-input-border:#c7c7c7;--ck-color-input-error-border:var(--ck-color-base-error);--ck-color-input-text:var(--ck-color-base-text);--ck-color-input-disabled-background:#f2f2f2;--ck-color-input-disabled-border:#c7c7c7;--ck-color-input-disabled-text:#5c5c5c;--ck-color-list-background:var(--ck-color-base-background);--ck-color-list-button-hover-background:var(--ck-color-button-default-hover-background);--ck-color-list-button-on-background:var(--ck-color-base-active);--ck-color-list-button-on-background-focus:var(--ck-color-base-active-focus);--ck-color-list-button-on-text:var(--ck-color-base-background);--ck-color-panel-background:var(--ck-color-base-background);--ck-color-panel-border:var(--ck-color-base-border);--ck-color-toolbar-background:var(--ck-color-base-foreground);--ck-color-toolbar-border:var(--ck-color-base-border);--ck-color-tooltip-background:var(--ck-color-base-text);--ck-color-tooltip-text:var(--ck-color-base-background);--ck-color-engine-placeholder-text:#707070;--ck-color-upload-bar-background:#6cb5f9;--ck-color-link-default:#0000f0;--ck-color-link-selected-background:rgba(31,177,255,0.1);--ck-disabled-opacity:.5;--ck-focus-outer-shadow-geometry:0 0 0 3px;--ck-focus-outer-shadow:var(--ck-focus-outer-shadow-geometry) var(--ck-color-focus-outer-shadow);--ck-focus-disabled-outer-shadow:var(--ck-focus-outer-shadow-geometry) var(--ck-color-focus-disabled-shadow);--ck-focus-error-outer-shadow:var(--ck-focus-outer-shadow-geometry) var(--ck-color-focus-error-shadow);--ck-focus-ring:1px solid var(--ck-color-focus-border);--ck-font-size-base:13px;--ck-line-height-base:1.84615;--ck-font-face:Helvetica,Arial,Tahoma,Verdana,Sans-Serif;--ck-font-size-tiny:0.7em;--ck-font-size-small:0.75em;--ck-font-size-normal:1em;--ck-font-size-big:1.4em;--ck-font-size-large:1.8em;--ck-ui-component-min-height:2.3em}.ck.ck-reset,.ck.ck-reset_all,.ck.ck-reset_all *{margin:0;padding:0;border:0;background:transparent;text-decoration:none;vertical-align:middle;transition:none;word-wrap:break-word}.ck.ck-reset_all,.ck.ck-reset_all *{border-collapse:collapse;font:normal normal normal var(--ck-font-size-base)/var(--ck-line-height-base) var(--ck-font-face);color:var(--ck-color-text);text-align:left;white-space:nowrap;cursor:auto;float:none}.ck.ck-reset_all .ck-rtl *{text-align:right}.ck.ck-reset_all iframe{vertical-align:inherit}.ck.ck-reset_all textarea{white-space:pre-wrap}.ck.ck-reset_all input[type=password],.ck.ck-reset_all input[type=text],.ck.ck-reset_all textarea{cursor:text}.ck.ck-reset_all input[type=password][disabled],.ck.ck-reset_all input[type=text][disabled],.ck.ck-reset_all textarea[disabled]{cursor:default}.ck.ck-reset_all fieldset{padding:10px;border:2px groove #dfdee3}.ck.ck-reset_all button::-moz-focus-inner{padding:0;border:0}.ck[dir=rtl],.ck[dir=rtl] .ck{text-align:right}:root{--ck-border-radius:2px;--ck-inner-shadow:2px 2px 3px var(--ck-color-shadow-inner) inset;--ck-drop-shadow:0 1px 2px 1px var(--ck-color-shadow-drop);--ck-drop-shadow-active:0 3px 6px 1px var(--ck-color-shadow-drop-active);--ck-spacing-unit:0.6em;--ck-spacing-large:calc(var(--ck-spacing-unit)*1.5);--ck-spacing-standard:var(--ck-spacing-unit);--ck-spacing-medium:calc(var(--ck-spacing-unit)*0.8);--ck-spacing-small:calc(var(--ck-spacing-unit)*0.5);--ck-spacing-tiny:calc(var(--ck-spacing-unit)*0.3);--ck-spacing-extra-tiny:calc(var(--ck-spacing-unit)*0.16)}"},function(t,e,n){var i=n(1),o=n(18);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=":root{--ck-color-editable-blur-selection:#d9d9d9}.ck.ck-editor__editable:not(.ck-editor__nested-editable){border-radius:0}.ck-rounded-corners .ck.ck-editor__editable:not(.ck-editor__nested-editable),.ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-rounded-corners{border-radius:var(--ck-border-radius)}.ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused{outline:none;border:var(--ck-focus-ring);box-shadow:var(--ck-inner-shadow),0 0}.ck.ck-editor__editable_inline{overflow:auto;padding:0 var(--ck-spacing-standard);border:1px solid transparent}.ck.ck-editor__editable_inline[dir=ltr]{text-align:left}.ck.ck-editor__editable_inline[dir=rtl]{text-align:right}.ck.ck-editor__editable_inline>:first-child{margin-top:var(--ck-spacing-large)}.ck.ck-editor__editable_inline>:last-child{margin-bottom:var(--ck-spacing-large)}.ck.ck-editor__editable_inline.ck-blurred ::selection{background:var(--ck-color-editable-blur-selection)}.ck.ck-balloon-panel.ck-toolbar-container[class*=arrow_n]:after{border-bottom-color:var(--ck-color-base-foreground)}.ck.ck-balloon-panel.ck-toolbar-container[class*=arrow_s]:after{border-top-color:var(--ck-color-base-foreground)}"},function(t,e,n){var i=n(1),o=n(20);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-label{display:block}.ck.ck-voice-label{display:none}.ck.ck-label{font-weight:700}"},function(t,e,n){var i=n(1),o=n(22);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-sticky-panel .ck-sticky-panel__content_sticky{z-index:var(--ck-z-modal);position:fixed;top:0}.ck.ck-sticky-panel .ck-sticky-panel__content_sticky_bottom-limit{top:auto;position:absolute}.ck.ck-sticky-panel .ck-sticky-panel__content_sticky{box-shadow:var(--ck-drop-shadow),0 0;border-width:0 1px 1px;border-top-left-radius:0;border-top-right-radius:0}"},function(t,e,n){var i=n(1),o=n(24);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-dropdown{display:inline-block;position:relative}.ck.ck-dropdown .ck-dropdown__arrow{pointer-events:none;z-index:var(--ck-z-default)}.ck.ck-dropdown .ck-button.ck-dropdown__button{width:100%}.ck.ck-dropdown .ck-button.ck-dropdown__button.ck-on .ck-tooltip{display:none}.ck.ck-dropdown .ck-dropdown__panel{-webkit-backface-visibility:hidden;display:none;z-index:var(--ck-z-modal);position:absolute}.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel-visible{display:inline-block}.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_ne,.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_nw{bottom:100%}.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_se,.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_sw{top:100%;bottom:auto}.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_ne,.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_se{left:0}.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_nw,.ck.ck-dropdown .ck-dropdown__panel.ck-dropdown__panel_sw{right:0}:root{--ck-dropdown-arrow-size:calc(0.5*var(--ck-icon-size))}.ck.ck-dropdown{font-size:inherit}.ck.ck-dropdown .ck-dropdown__arrow{width:var(--ck-dropdown-arrow-size)}[dir=ltr] .ck.ck-dropdown .ck-dropdown__arrow{right:var(--ck-spacing-standard);margin-left:var(--ck-spacing-standard)}[dir=rtl] .ck.ck-dropdown .ck-dropdown__arrow{left:var(--ck-spacing-standard);margin-right:var(--ck-spacing-small)}.ck.ck-dropdown.ck-disabled .ck-dropdown__arrow{opacity:var(--ck-disabled-opacity)}[dir=ltr] .ck.ck-dropdown .ck-button.ck-dropdown__button:not(.ck-button_with-text){padding-left:var(--ck-spacing-small)}[dir=rtl] .ck.ck-dropdown .ck-button.ck-dropdown__button:not(.ck-button_with-text){padding-right:var(--ck-spacing-small)}.ck.ck-dropdown .ck-button.ck-dropdown__button .ck-button__label{width:7em;overflow:hidden;text-overflow:ellipsis}.ck.ck-dropdown .ck-button.ck-dropdown__button.ck-disabled .ck-button__label{opacity:var(--ck-disabled-opacity)}.ck.ck-dropdown .ck-button.ck-dropdown__button.ck-on{border-bottom-left-radius:0;border-bottom-right-radius:0}.ck.ck-dropdown .ck-button.ck-dropdown__button.ck-dropdown__button_label-width_auto .ck-button__label{width:auto}.ck.ck-dropdown__panel{border-radius:0}.ck-rounded-corners .ck.ck-dropdown__panel,.ck.ck-dropdown__panel.ck-rounded-corners{border-radius:var(--ck-border-radius)}.ck.ck-dropdown__panel{box-shadow:var(--ck-drop-shadow),0 0;background:var(--ck-color-dropdown-panel-background);border:1px solid var(--ck-color-dropdown-panel-border);bottom:0;min-width:100%}.ck.ck-dropdown__panel.ck-dropdown__panel_se{border-top-left-radius:0}.ck.ck-dropdown__panel.ck-dropdown__panel_sw{border-top-right-radius:0}.ck.ck-dropdown__panel.ck-dropdown__panel_ne{border-bottom-left-radius:0}.ck.ck-dropdown__panel.ck-dropdown__panel_nw{border-bottom-right-radius:0}"},function(t,e,n){var i=n(1),o=n(26);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-icon{vertical-align:middle}:root{--ck-icon-size:calc(var(--ck-line-height-base)*var(--ck-font-size-normal))}.ck.ck-icon{width:var(--ck-icon-size);height:var(--ck-icon-size);font-size:.8333350694em;will-change:transform}.ck.ck-icon,.ck.ck-icon *{color:inherit;cursor:inherit}.ck.ck-icon :not([fill]){fill:currentColor}"},function(t,e,n){var i=n(1),o=n(28);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports='.ck.ck-tooltip,.ck.ck-tooltip .ck-tooltip__text:after{position:absolute;pointer-events:none;-webkit-backface-visibility:hidden}.ck.ck-tooltip{visibility:hidden;opacity:0;display:none;z-index:var(--ck-z-modal)}.ck.ck-tooltip .ck-tooltip__text{display:inline-block}.ck.ck-tooltip .ck-tooltip__text:after{content:"";width:0;height:0}:root{--ck-tooltip-arrow-size:5px}.ck.ck-tooltip{left:50%;top:0;transition:opacity .2s ease-in-out .2s}.ck.ck-tooltip .ck-tooltip__text{border-radius:0}.ck-rounded-corners .ck.ck-tooltip .ck-tooltip__text,.ck.ck-tooltip .ck-tooltip__text.ck-rounded-corners{border-radius:var(--ck-border-radius)}.ck.ck-tooltip .ck-tooltip__text{font-size:.9em;line-height:1.5;color:var(--ck-color-tooltip-text);padding:var(--ck-spacing-small) var(--ck-spacing-medium);background:var(--ck-color-tooltip-background);position:relative;left:-50%}.ck.ck-tooltip .ck-tooltip__text:after{transition:opacity .2s ease-in-out .2s;border-style:solid;left:50%}.ck.ck-tooltip.ck-tooltip_s{bottom:calc(-1*var(--ck-tooltip-arrow-size));transform:translateY(100%)}.ck.ck-tooltip.ck-tooltip_s .ck-tooltip__text:after{top:calc(-1*var(--ck-tooltip-arrow-size));transform:translateX(-50%);border-left-color:transparent;border-bottom-color:var(--ck-color-tooltip-background);border-right-color:transparent;border-top-color:transparent;border-left-width:var(--ck-tooltip-arrow-size);border-bottom-width:var(--ck-tooltip-arrow-size);border-right-width:var(--ck-tooltip-arrow-size);border-top-width:0}.ck.ck-tooltip.ck-tooltip_n{top:calc(-1*var(--ck-tooltip-arrow-size));transform:translateY(-100%)}.ck.ck-tooltip.ck-tooltip_n .ck-tooltip__text:after{bottom:calc(-1*var(--ck-tooltip-arrow-size));transform:translateX(-50%);border-left-color:transparent;border-bottom-color:transparent;border-right-color:transparent;border-top-color:var(--ck-color-tooltip-background);border-left-width:var(--ck-tooltip-arrow-size);border-bottom-width:0;border-right-width:var(--ck-tooltip-arrow-size);border-top-width:var(--ck-tooltip-arrow-size)}'},function(t,e,n){var i=n(1),o=n(30);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-button,a.ck.ck-button{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.ck.ck-button .ck-tooltip,a.ck.ck-button .ck-tooltip{display:block}@media (hover:none){.ck.ck-button .ck-tooltip,a.ck.ck-button .ck-tooltip{display:none}}.ck.ck-button,a.ck.ck-button{position:relative;display:inline-flex;align-items:center;justify-content:left}.ck.ck-button .ck-button__label,a.ck.ck-button .ck-button__label{display:none}.ck.ck-button.ck-button_with-text .ck-button__label,a.ck.ck-button.ck-button_with-text .ck-button__label{display:inline-block}.ck.ck-button:not(.ck-button_with-text),a.ck.ck-button:not(.ck-button_with-text){justify-content:center}.ck.ck-button:hover .ck-tooltip,a.ck.ck-button:hover .ck-tooltip{visibility:visible;opacity:1}.ck.ck-button:focus:not(:hover) .ck-tooltip,a.ck.ck-button:focus:not(:hover) .ck-tooltip{display:none}.ck.ck-button,a.ck.ck-button{background:var(--ck-color-button-default-background)}.ck.ck-button:not(.ck-disabled):hover,a.ck.ck-button:not(.ck-disabled):hover{background:var(--ck-color-button-default-hover-background)}.ck.ck-button:not(.ck-disabled):active,a.ck.ck-button:not(.ck-disabled):active{background:var(--ck-color-button-default-active-background);box-shadow:inset 0 2px 2px var(--ck-color-button-default-active-shadow)}.ck.ck-button.ck-disabled,a.ck.ck-button.ck-disabled{background:var(--ck-color-button-default-disabled-background)}.ck.ck-button,a.ck.ck-button{border-radius:0}.ck-rounded-corners .ck.ck-button,.ck-rounded-corners a.ck.ck-button,.ck.ck-button.ck-rounded-corners,a.ck.ck-button.ck-rounded-corners{border-radius:var(--ck-border-radius)}.ck.ck-button,a.ck.ck-button{white-space:nowrap;cursor:default;vertical-align:middle;padding:var(--ck-spacing-tiny);text-align:center;min-width:var(--ck-ui-component-min-height);min-height:var(--ck-ui-component-min-height);line-height:1;font-size:inherit;border:1px solid transparent;transition:box-shadow .2s ease-in-out,border .2s ease-in-out;-webkit-appearance:none}.ck.ck-button:active,.ck.ck-button:focus,a.ck.ck-button:active,a.ck.ck-button:focus{outline:none;border:var(--ck-focus-ring);box-shadow:var(--ck-focus-outer-shadow),0 0}.ck.ck-button .ck-button__icon use,.ck.ck-button .ck-button__icon use *,a.ck.ck-button .ck-button__icon use,a.ck.ck-button .ck-button__icon use *{color:inherit}.ck.ck-button .ck-button__label,a.ck.ck-button .ck-button__label{font-size:inherit;font-weight:inherit;color:inherit;cursor:inherit;vertical-align:middle}[dir=ltr] .ck.ck-button .ck-button__label,[dir=ltr] a.ck.ck-button .ck-button__label{text-align:left}[dir=rtl] .ck.ck-button .ck-button__label,[dir=rtl] a.ck.ck-button .ck-button__label{text-align:right}.ck.ck-button .ck-button__keystroke,a.ck.ck-button .ck-button__keystroke{color:inherit}[dir=ltr] .ck.ck-button .ck-button__keystroke,[dir=ltr] a.ck.ck-button .ck-button__keystroke{margin-left:var(--ck-spacing-large)}[dir=rtl] .ck.ck-button .ck-button__keystroke,[dir=rtl] a.ck.ck-button .ck-button__keystroke{margin-right:var(--ck-spacing-large)}.ck.ck-button .ck-button__keystroke,a.ck.ck-button .ck-button__keystroke{font-weight:700;opacity:.7}.ck.ck-button.ck-disabled:active,.ck.ck-button.ck-disabled:focus,a.ck.ck-button.ck-disabled:active,a.ck.ck-button.ck-disabled:focus{box-shadow:var(--ck-focus-disabled-outer-shadow),0 0}.ck.ck-button.ck-disabled .ck-button__icon,a.ck.ck-button.ck-disabled .ck-button__icon{opacity:var(--ck-disabled-opacity)}.ck.ck-button.ck-disabled .ck-button__label,a.ck.ck-button.ck-disabled .ck-button__label{opacity:var(--ck-disabled-opacity)}.ck.ck-button.ck-disabled .ck-button__keystroke,a.ck.ck-button.ck-disabled .ck-button__keystroke{opacity:.3}.ck.ck-button.ck-button_with-text,a.ck.ck-button.ck-button_with-text{padding:var(--ck-spacing-tiny) var(--ck-spacing-standard)}[dir=ltr] .ck.ck-button.ck-button_with-text .ck-button__icon,[dir=ltr] a.ck.ck-button.ck-button_with-text .ck-button__icon{margin-left:calc(-1*var(--ck-spacing-small));margin-right:var(--ck-spacing-small)}[dir=rtl] .ck.ck-button.ck-button_with-text .ck-button__icon,[dir=rtl] a.ck.ck-button.ck-button_with-text .ck-button__icon{margin-right:calc(-1*var(--ck-spacing-small));margin-left:var(--ck-spacing-small)}.ck.ck-button.ck-button_with-keystroke .ck-button__label,a.ck.ck-button.ck-button_with-keystroke .ck-button__label{flex-grow:1}.ck.ck-button.ck-on,a.ck.ck-button.ck-on{background:var(--ck-color-button-on-background)}.ck.ck-button.ck-on:not(.ck-disabled):hover,a.ck.ck-button.ck-on:not(.ck-disabled):hover{background:var(--ck-color-button-on-hover-background)}.ck.ck-button.ck-on:not(.ck-disabled):active,a.ck.ck-button.ck-on:not(.ck-disabled):active{background:var(--ck-color-button-on-active-background);box-shadow:inset 0 2px 2px var(--ck-color-button-on-active-shadow)}.ck.ck-button.ck-on.ck-disabled,a.ck.ck-button.ck-on.ck-disabled{background:var(--ck-color-button-on-disabled-background)}.ck.ck-button.ck-button-save,a.ck.ck-button.ck-button-save{color:var(--ck-color-button-save)}.ck.ck-button.ck-button-cancel,a.ck.ck-button.ck-button-cancel{color:var(--ck-color-button-cancel)}.ck.ck-button-action,a.ck.ck-button-action{background:var(--ck-color-button-action-background)}.ck.ck-button-action:not(.ck-disabled):hover,a.ck.ck-button-action:not(.ck-disabled):hover{background:var(--ck-color-button-action-hover-background)}.ck.ck-button-action:not(.ck-disabled):active,a.ck.ck-button-action:not(.ck-disabled):active{background:var(--ck-color-button-action-active-background);box-shadow:inset 0 2px 2px var(--ck-color-button-action-active-shadow)}.ck.ck-button-action.ck-disabled,a.ck.ck-button-action.ck-disabled{background:var(--ck-color-button-action-disabled-background)}.ck.ck-button-action,a.ck.ck-button-action{color:var(--ck-color-button-action-text)}.ck.ck-button-bold,a.ck.ck-button-bold{font-weight:700}"},function(t,e,n){var i=n(1),o=n(32);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-list{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;display:flex;flex-direction:column}.ck.ck-list .ck-list__item,.ck.ck-list .ck-list__separator{display:block}.ck.ck-list .ck-list__item>:focus{position:relative;z-index:var(--ck-z-default)}.ck.ck-list{border-radius:0}.ck-rounded-corners .ck.ck-list,.ck.ck-list.ck-rounded-corners{border-radius:var(--ck-border-radius)}.ck.ck-list{list-style-type:none;background:var(--ck-color-list-background)}.ck.ck-list__item{cursor:default;min-width:12em}.ck.ck-list__item .ck-button{min-height:unset;width:100%;text-align:left;border-radius:0;padding:calc(0.2*var(--ck-line-height-base)*var(--ck-font-size-base)) calc(0.4*var(--ck-line-height-base)*var(--ck-font-size-base))}.ck.ck-list__item .ck-button .ck-button__label{line-height:calc(1.2*var(--ck-line-height-base)*var(--ck-font-size-base))}.ck.ck-list__item .ck-button:active{box-shadow:none}.ck.ck-list__item .ck-button.ck-on{background:var(--ck-color-list-button-on-background);color:var(--ck-color-list-button-on-text)}.ck.ck-list__item .ck-button.ck-on:active{box-shadow:none}.ck.ck-list__item .ck-button.ck-on:hover:not(.ck-disabled){background:var(--ck-color-list-button-on-background-focus)}.ck.ck-list__item .ck-button.ck-on:focus:not(.ck-disabled){border-color:var(--ck-color-base-background)}.ck.ck-list__item .ck-button:hover:not(.ck-disabled){background:var(--ck-color-list-button-hover-background)}.ck.ck-list__item .ck-switchbutton.ck-on{background:var(--ck-color-list-background);color:inherit}.ck.ck-list__item .ck-switchbutton.ck-on:hover:not(.ck-disabled){background:var(--ck-color-list-button-hover-background);color:inherit}.ck.ck-list__separator{height:1px;width:100%;background:var(--ck-color-base-border)}"},function(t,e,n){var i=n(1),o=n(34);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-button.ck-switchbutton .ck-button__toggle,.ck.ck-button.ck-switchbutton .ck-button__toggle .ck-button__toggle__inner{display:block}:root{--ck-switch-button-toggle-width:2.6153846154em;--ck-switch-button-toggle-inner-size:1.0769230769em;--ck-switch-button-toggle-spacing:1px;--ck-switch-button-translation:calc(var(--ck-switch-button-toggle-width) - var(--ck-switch-button-toggle-inner-size) - 2*var(--ck-switch-button-toggle-spacing))}[dir=ltr] .ck.ck-button.ck-switchbutton .ck-button__label{margin-right:calc(2*var(--ck-spacing-large))}[dir=rtl] .ck.ck-button.ck-switchbutton .ck-button__label{margin-left:calc(2*var(--ck-spacing-large))}.ck.ck-button.ck-switchbutton .ck-button__toggle{border-radius:0}.ck-rounded-corners .ck.ck-button.ck-switchbutton .ck-button__toggle,.ck.ck-button.ck-switchbutton .ck-button__toggle.ck-rounded-corners{border-radius:var(--ck-border-radius)}[dir=ltr] .ck.ck-button.ck-switchbutton .ck-button__toggle{margin-left:auto}[dir=rtl] .ck.ck-button.ck-switchbutton .ck-button__toggle{margin-right:auto}.ck.ck-button.ck-switchbutton .ck-button__toggle{transition:background .4s ease;width:var(--ck-switch-button-toggle-width);background:var(--ck-color-switch-button-off-background)}.ck.ck-button.ck-switchbutton .ck-button__toggle .ck-button__toggle__inner{border-radius:0}.ck-rounded-corners .ck.ck-button.ck-switchbutton .ck-button__toggle .ck-button__toggle__inner,.ck.ck-button.ck-switchbutton .ck-button__toggle .ck-button__toggle__inner.ck-rounded-corners{border-radius:var(--ck-border-radius);border-radius:calc(0.5*var(--ck-border-radius))}.ck.ck-button.ck-switchbutton .ck-button__toggle .ck-button__toggle__inner{margin:var(--ck-switch-button-toggle-spacing);width:var(--ck-switch-button-toggle-inner-size);height:var(--ck-switch-button-toggle-inner-size);background:var(--ck-color-switch-button-inner-background);transition:all .3s ease}.ck.ck-button.ck-switchbutton .ck-button__toggle:hover{background:var(--ck-color-switch-button-off-hover-background)}.ck.ck-button.ck-switchbutton .ck-button__toggle:hover .ck-button__toggle__inner{box-shadow:0 0 0 5px var(--ck-color-switch-button-inner-shadow)}.ck.ck-button.ck-switchbutton.ck-disabled .ck-button__toggle{opacity:var(--ck-disabled-opacity)}.ck.ck-button.ck-switchbutton.ck-on .ck-button__toggle{background:var(--ck-color-switch-button-on-background)}.ck.ck-button.ck-switchbutton.ck-on .ck-button__toggle:hover{background:var(--ck-color-switch-button-on-hover-background)}[dir=ltr] .ck.ck-button.ck-switchbutton.ck-on .ck-button__toggle .ck-button__toggle__inner{transform:translateX(var(--ck-switch-button-translation))}[dir=rtl] .ck.ck-button.ck-switchbutton.ck-on .ck-button__toggle .ck-button__toggle__inner{transform:translateX(calc(-1*var(--ck-switch-button-translation)))}"},function(t,e,n){var i=n(1),o=n(36);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-toolbar-dropdown .ck.ck-toolbar .ck.ck-toolbar__items{flex-wrap:nowrap}.ck.ck-toolbar-dropdown .ck-dropdown__panel .ck-button:focus{z-index:calc(var(--ck-z-default) + 1)}.ck.ck-toolbar-dropdown .ck-toolbar{border:0}"},function(t,e,n){var i=n(1),o=n(38);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-dropdown .ck-dropdown__panel .ck-list{border-radius:0}.ck-rounded-corners .ck.ck-dropdown .ck-dropdown__panel .ck-list,.ck.ck-dropdown .ck-dropdown__panel .ck-list.ck-rounded-corners{border-radius:var(--ck-border-radius);border-top-left-radius:0}.ck.ck-dropdown .ck-dropdown__panel .ck-list .ck-list__item:first-child .ck-button{border-radius:0}.ck-rounded-corners .ck.ck-dropdown .ck-dropdown__panel .ck-list .ck-list__item:first-child .ck-button,.ck.ck-dropdown .ck-dropdown__panel .ck-list .ck-list__item:first-child .ck-button.ck-rounded-corners{border-radius:var(--ck-border-radius);border-top-left-radius:0;border-bottom-left-radius:0;border-bottom-right-radius:0}.ck.ck-dropdown .ck-dropdown__panel .ck-list .ck-list__item:last-child .ck-button{border-radius:0}.ck-rounded-corners .ck.ck-dropdown .ck-dropdown__panel .ck-list .ck-list__item:last-child .ck-button,.ck.ck-dropdown .ck-dropdown__panel .ck-list .ck-list__item:last-child .ck-button.ck-rounded-corners{border-radius:var(--ck-border-radius);border-top-left-radius:0;border-top-right-radius:0}"},function(t,e,n){var i=n(1),o=n(40);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-toolbar{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;display:flex;flex-flow:row nowrap;align-items:center}.ck.ck-toolbar>.ck-toolbar__items{display:flex;flex-flow:row wrap;align-items:center;flex-grow:1}.ck.ck-toolbar .ck.ck-toolbar__separator{display:inline-block}.ck.ck-toolbar .ck.ck-toolbar__separator:first-child,.ck.ck-toolbar .ck.ck-toolbar__separator:last-child{display:none}.ck.ck-toolbar.ck-toolbar_grouping>.ck-toolbar__items{flex-wrap:nowrap}.ck.ck-toolbar.ck-toolbar_vertical>.ck-toolbar__items{flex-direction:column}.ck.ck-toolbar.ck-toolbar_floating>.ck-toolbar__items{flex-wrap:nowrap}.ck.ck-toolbar>.ck.ck-toolbar__grouped-dropdown>.ck-dropdown__button .ck-dropdown__arrow{display:none}.ck.ck-toolbar{border-radius:0}.ck-rounded-corners .ck.ck-toolbar,.ck.ck-toolbar.ck-rounded-corners{border-radius:var(--ck-border-radius)}.ck.ck-toolbar{background:var(--ck-color-toolbar-background);padding:0 var(--ck-spacing-small);border:1px solid var(--ck-color-toolbar-border)}.ck.ck-toolbar .ck.ck-toolbar__separator{align-self:stretch;width:1px;min-width:1px;margin-top:0;margin-bottom:0;background:var(--ck-color-toolbar-border)}.ck.ck-toolbar>.ck-toolbar__items>*{margin-top:var(--ck-spacing-small);margin-bottom:var(--ck-spacing-small);margin-right:var(--ck-spacing-small)}.ck.ck-toolbar>.ck-toolbar__items:empty+.ck.ck-toolbar__separator{display:none}.ck.ck-toolbar>.ck-toolbar__items>*,.ck.ck-toolbar>.ck.ck-toolbar__grouped-dropdown{margin-top:var(--ck-spacing-small);margin-bottom:var(--ck-spacing-small)}.ck.ck-toolbar.ck-toolbar_vertical{padding:0}.ck.ck-toolbar.ck-toolbar_vertical>.ck-toolbar__items>.ck{width:100%;margin:0;border-radius:0;border:0}.ck.ck-toolbar.ck-toolbar_compact{padding:0}.ck.ck-toolbar.ck-toolbar_compact>.ck-toolbar__items>*{margin:0}.ck.ck-toolbar.ck-toolbar_compact>.ck-toolbar__items>:not(:first-child):not(:last-child){border-radius:0}.ck.ck-toolbar>.ck.ck-toolbar__grouped-dropdown>.ck.ck-button.ck-dropdown__button{padding-left:var(--ck-spacing-tiny)}.ck-toolbar-container .ck.ck-toolbar{border:0}.ck.ck-toolbar[dir=rtl]>.ck-toolbar__items>.ck,[dir=rtl] .ck.ck-toolbar>.ck-toolbar__items>.ck{margin-right:0}.ck.ck-toolbar[dir=rtl]:not(.ck-toolbar_compact)>.ck-toolbar__items>.ck,[dir=rtl] .ck.ck-toolbar:not(.ck-toolbar_compact)>.ck-toolbar__items>.ck{margin-left:var(--ck-spacing-small)}.ck.ck-toolbar[dir=rtl]>.ck-toolbar__items>.ck:last-child,[dir=rtl] .ck.ck-toolbar>.ck-toolbar__items>.ck:last-child{margin-left:0}.ck.ck-toolbar[dir=rtl].ck-toolbar_compact>.ck-toolbar__items>.ck:first-child,[dir=rtl] .ck.ck-toolbar.ck-toolbar_compact>.ck-toolbar__items>.ck:first-child{border-top-left-radius:0;border-bottom-left-radius:0}.ck.ck-toolbar[dir=rtl].ck-toolbar_compact>.ck-toolbar__items>.ck:last-child,[dir=rtl] .ck.ck-toolbar.ck-toolbar_compact>.ck-toolbar__items>.ck:last-child{border-top-right-radius:0;border-bottom-right-radius:0}.ck.ck-toolbar[dir=rtl]>.ck.ck-toolbar__separator,[dir=rtl] .ck.ck-toolbar>.ck.ck-toolbar__separator{margin-left:var(--ck-spacing-small)}.ck.ck-toolbar[dir=rtl].ck-toolbar_grouping>.ck-toolbar__items:not(:empty):not(:only-child),[dir=rtl] .ck.ck-toolbar.ck-toolbar_grouping>.ck-toolbar__items:not(:empty):not(:only-child){margin-left:var(--ck-spacing-small)}.ck.ck-toolbar[dir=ltr]>.ck-toolbar__items>.ck:last-child,[dir=ltr] .ck.ck-toolbar>.ck-toolbar__items>.ck:last-child{margin-right:0}.ck.ck-toolbar[dir=ltr].ck-toolbar_compact>.ck-toolbar__items>.ck:first-child,[dir=ltr] .ck.ck-toolbar.ck-toolbar_compact>.ck-toolbar__items>.ck:first-child{border-top-right-radius:0;border-bottom-right-radius:0}.ck.ck-toolbar[dir=ltr].ck-toolbar_compact>.ck-toolbar__items>.ck:last-child,[dir=ltr] .ck.ck-toolbar.ck-toolbar_compact>.ck-toolbar__items>.ck:last-child{border-top-left-radius:0;border-bottom-left-radius:0}.ck.ck-toolbar[dir=ltr]>.ck.ck-toolbar__separator,[dir=ltr] .ck.ck-toolbar>.ck.ck-toolbar__separator{margin-right:var(--ck-spacing-small)}.ck.ck-toolbar[dir=ltr].ck-toolbar_grouping>.ck-toolbar__items:not(:empty):not(:only-child),[dir=ltr] .ck.ck-toolbar.ck-toolbar_grouping>.ck-toolbar__items:not(:empty):not(:only-child){margin-right:var(--ck-spacing-small)}"},function(t,e,n){var i=n(1),o=n(42);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-editor{position:relative}.ck.ck-editor .ck-editor__top .ck-sticky-panel .ck-toolbar{z-index:var(--ck-z-modal)}.ck.ck-editor__top .ck-sticky-panel .ck-toolbar{border-radius:0}.ck-rounded-corners .ck.ck-editor__top .ck-sticky-panel .ck-toolbar,.ck.ck-editor__top .ck-sticky-panel .ck-toolbar.ck-rounded-corners{border-radius:var(--ck-border-radius);border-bottom-left-radius:0;border-bottom-right-radius:0}.ck.ck-editor__top .ck-sticky-panel .ck-toolbar{border-bottom-width:0}.ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content_sticky .ck-toolbar{border-bottom-width:1px;border-radius:0}.ck-rounded-corners .ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content_sticky .ck-toolbar,.ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content_sticky .ck-toolbar.ck-rounded-corners{border-radius:var(--ck-border-radius);border-radius:0}.ck.ck-editor__main>.ck-editor__editable{background:var(--ck-color-base-background);border-radius:0}.ck-rounded-corners .ck.ck-editor__main>.ck-editor__editable,.ck.ck-editor__main>.ck-editor__editable.ck-rounded-corners{border-radius:var(--ck-border-radius);border-top-left-radius:0;border-top-right-radius:0}.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){border-color:var(--ck-color-base-border)}"},function(t,e,n){var i=n(1),o=n(44);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck-content blockquote{overflow:hidden;padding-right:1.5em;padding-left:1.5em;margin-left:0;margin-right:0;font-style:italic;border-left:5px solid #ccc}.ck-content[dir=rtl] blockquote{border-left:0;border-right:5px solid #ccc}"},function(t,e,n){var i=n(1),o=n(46);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck .ck-link_selected{background:var(--ck-color-link-selected-background)}"},function(t,e,n){var i=n(1),o=n(48);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=":root{--ck-color-resizer:var(--ck-color-focus-border);--ck-resizer-size:10px;--ck-resizer-border-width:1px;--ck-resizer-border-radius:2px;--ck-resizer-offset:calc(var(--ck-resizer-size)/-2 - 2px);--ck-resizer-tooltip-offset:10px;--ck-color-resizer-tooltip-background:#262626;--ck-color-resizer-tooltip-text:#f2f2f2}.ck .ck-widget.ck-widget_with-selection-handle{position:relative}.ck .ck-widget.ck-widget_with-selection-handle .ck-widget__selection-handle{position:absolute}.ck .ck-widget.ck-widget_with-selection-handle .ck-widget__selection-handle .ck-icon{display:block}.ck .ck-widget.ck-widget_with-selection-handle.ck-widget_selected .ck-widget__selection-handle,.ck .ck-widget.ck-widget_with-selection-handle:hover .ck-widget__selection-handle{visibility:visible}.ck .ck-size-view{background:var(--ck-color-resizer-tooltip-background);color:var(--ck-color-resizer-tooltip-text);border:1px solid var(--ck-color-resizer-tooltip-text);border-radius:var(--ck-resizer-border-radius);font-size:var(--ck-font-size-tiny);display:block;padding:var(--ck-spacing-small)}.ck .ck-size-view.ck-orientation-bottom-left,.ck .ck-size-view.ck-orientation-bottom-right,.ck .ck-size-view.ck-orientation-top-left,.ck .ck-size-view.ck-orientation-top-right{position:absolute}.ck .ck-size-view.ck-orientation-top-left{top:var(--ck-resizer-tooltip-offset);left:var(--ck-resizer-tooltip-offset)}.ck .ck-size-view.ck-orientation-top-right{top:var(--ck-resizer-tooltip-offset);right:var(--ck-resizer-tooltip-offset)}.ck .ck-size-view.ck-orientation-bottom-right{bottom:var(--ck-resizer-tooltip-offset);right:var(--ck-resizer-tooltip-offset)}.ck .ck-size-view.ck-orientation-bottom-left{bottom:var(--ck-resizer-tooltip-offset);left:var(--ck-resizer-tooltip-offset)}:root{--ck-widget-outline-thickness:3px;--ck-widget-handler-icon-size:16px;--ck-widget-handler-animation-duration:200ms;--ck-widget-handler-animation-curve:ease;--ck-color-widget-blurred-border:#dedede;--ck-color-widget-hover-border:#ffc83d;--ck-color-widget-editable-focus-background:var(--ck-color-base-background);--ck-color-widget-drag-handler-icon-color:var(--ck-color-base-background)}.ck .ck-widget{outline-width:var(--ck-widget-outline-thickness);outline-style:solid;outline-color:transparent;transition:outline-color var(--ck-widget-handler-animation-duration) var(--ck-widget-handler-animation-curve)}.ck .ck-widget.ck-widget_selected,.ck .ck-widget.ck-widget_selected:hover{outline:var(--ck-widget-outline-thickness) solid var(--ck-color-focus-border)}.ck .ck-widget:hover{outline-color:var(--ck-color-widget-hover-border)}.ck .ck-editor__nested-editable{border:1px solid transparent}.ck .ck-editor__nested-editable.ck-editor__nested-editable_focused,.ck .ck-editor__nested-editable:focus{outline:none;border:var(--ck-focus-ring);box-shadow:var(--ck-inner-shadow),0 0;background-color:var(--ck-color-widget-editable-focus-background)}.ck .ck-widget.ck-widget_with-selection-handle .ck-widget__selection-handle{padding:4px;box-sizing:border-box;background-color:transparent;opacity:0;transition:background-color var(--ck-widget-handler-animation-duration) var(--ck-widget-handler-animation-curve),visibility var(--ck-widget-handler-animation-duration) var(--ck-widget-handler-animation-curve),opacity var(--ck-widget-handler-animation-duration) var(--ck-widget-handler-animation-curve);border-radius:var(--ck-border-radius) var(--ck-border-radius) 0 0;transform:translateY(-100%);left:calc(0px - var(--ck-widget-outline-thickness))}.ck .ck-widget.ck-widget_with-selection-handle .ck-widget__selection-handle .ck-icon{width:var(--ck-widget-handler-icon-size);height:var(--ck-widget-handler-icon-size);color:var(--ck-color-widget-drag-handler-icon-color)}.ck .ck-widget.ck-widget_with-selection-handle .ck-widget__selection-handle .ck-icon .ck-icon__selected-indicator{opacity:0;transition:opacity .3s var(--ck-widget-handler-animation-curve)}.ck .ck-widget.ck-widget_with-selection-handle .ck-widget__selection-handle:hover .ck-icon .ck-icon__selected-indicator{opacity:1}.ck .ck-widget.ck-widget_with-selection-handle:hover .ck-widget__selection-handle{opacity:1;background-color:var(--ck-color-widget-hover-border)}.ck .ck-widget.ck-widget_with-selection-handle.ck-widget_selected .ck-widget__selection-handle,.ck .ck-widget.ck-widget_with-selection-handle.ck-widget_selected:hover .ck-widget__selection-handle{opacity:1;background-color:var(--ck-color-focus-border)}.ck .ck-widget.ck-widget_with-selection-handle.ck-widget_selected .ck-widget__selection-handle .ck-icon .ck-icon__selected-indicator,.ck .ck-widget.ck-widget_with-selection-handle.ck-widget_selected:hover .ck-widget__selection-handle .ck-icon .ck-icon__selected-indicator{opacity:1}.ck[dir=rtl] .ck-widget.ck-widget_with-selection-handle .ck-widget__selection-handle{left:auto;right:calc(0px - var(--ck-widget-outline-thickness))}.ck.ck-editor__editable.ck-read-only .ck-widget{transition:none}.ck.ck-editor__editable.ck-read-only .ck-widget:not(.ck-widget_selected){--ck-widget-outline-thickness:0}.ck.ck-editor__editable.ck-read-only .ck-widget.ck-widget_with-selection-handle .ck-widget__selection-handle,.ck.ck-editor__editable.ck-read-only .ck-widget.ck-widget_with-selection-handle .ck-widget__selection-handle:hover{background:var(--ck-color-widget-blurred-border)}.ck.ck-editor__editable.ck-blurred .ck-widget.ck-widget_selected,.ck.ck-editor__editable.ck-blurred .ck-widget.ck-widget_selected:hover{outline-color:var(--ck-color-widget-blurred-border)}.ck.ck-editor__editable.ck-blurred .ck-widget.ck-widget_selected.ck-widget_with-selection-handle .ck-widget__selection-handle,.ck.ck-editor__editable.ck-blurred .ck-widget.ck-widget_selected.ck-widget_with-selection-handle .ck-widget__selection-handle:hover,.ck.ck-editor__editable.ck-blurred .ck-widget.ck-widget_selected:hover.ck-widget_with-selection-handle .ck-widget__selection-handle,.ck.ck-editor__editable.ck-blurred .ck-widget.ck-widget_selected:hover.ck-widget_with-selection-handle .ck-widget__selection-handle:hover{background:var(--ck-color-widget-blurred-border)}.ck.ck-editor__editable>.ck-widget.ck-widget_with-selection-handle:first-child,.ck.ck-editor__editable blockquote>.ck-widget.ck-widget_with-selection-handle:first-child{margin-top:calc(1em + var(--ck-widget-handler-icon-size))}"},function(t,e,n){var i=n(1),o=n(50);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-labeled-field-view .ck-labeled-field-view__status{font-size:var(--ck-font-size-small);margin-top:var(--ck-spacing-small);white-space:normal}.ck.ck-labeled-field-view .ck-labeled-field-view__status_error{color:var(--ck-color-base-error)}.ck.ck-labeled-field-view>.ck.ck-label{width:100%;text-overflow:ellipsis;overflow:hidden}"},function(t,e,n){var i=n(1),o=n(52);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=":root{--ck-input-text-width:18em}.ck.ck-input-text{border-radius:0}.ck-rounded-corners .ck.ck-input-text,.ck.ck-input-text.ck-rounded-corners{border-radius:var(--ck-border-radius)}.ck.ck-input-text{box-shadow:var(--ck-inner-shadow),0 0;background:var(--ck-color-input-background);border:1px solid var(--ck-color-input-border);padding:var(--ck-spacing-extra-tiny) var(--ck-spacing-medium);min-width:var(--ck-input-text-width);min-height:var(--ck-ui-component-min-height);transition:box-shadow .2s ease-in-out,border .2s ease-in-out}.ck.ck-input-text:focus{outline:none;border:var(--ck-focus-ring);box-shadow:var(--ck-focus-outer-shadow),var(--ck-inner-shadow)}.ck.ck-input-text[readonly]{border:1px solid var(--ck-color-input-disabled-border);background:var(--ck-color-input-disabled-background);color:var(--ck-color-input-disabled-text)}.ck.ck-input-text[readonly]:focus{box-shadow:var(--ck-focus-disabled-outer-shadow),var(--ck-inner-shadow)}.ck.ck-input-text.ck-error{border-color:var(--ck-color-input-error-border);animation:ck-text-input-shake .3s ease both}.ck.ck-input-text.ck-error:focus{box-shadow:var(--ck-focus-error-outer-shadow),var(--ck-inner-shadow)}@keyframes ck-text-input-shake{20%{transform:translateX(-2px)}40%{transform:translateX(2px)}60%{transform:translateX(-1px)}80%{transform:translateX(1px)}}"},function(t,e,n){var i=n(1),o=n(54);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-text-alternative-form{display:flex;flex-direction:row;flex-wrap:nowrap}.ck.ck-text-alternative-form .ck-labeled-field-view{display:inline-block}.ck.ck-text-alternative-form .ck-label{display:none}@media screen and (max-width:600px){.ck.ck-text-alternative-form{flex-wrap:wrap}.ck.ck-text-alternative-form .ck-labeled-field-view{flex-basis:100%}.ck.ck-text-alternative-form .ck-button{flex-basis:50%}}.ck.ck-text-alternative-form{padding:var(--ck-spacing-standard)}.ck.ck-text-alternative-form:focus{outline:none}[dir=ltr] .ck.ck-text-alternative-form>:not(:first-child),[dir=rtl] .ck.ck-text-alternative-form>:not(:last-child){margin-left:var(--ck-spacing-standard)}@media screen and (max-width:600px){.ck.ck-text-alternative-form{padding:0;width:calc(0.8*var(--ck-input-text-width))}.ck.ck-text-alternative-form .ck-labeled-field-view{margin:var(--ck-spacing-standard) var(--ck-spacing-standard) 0}.ck.ck-text-alternative-form .ck-labeled-field-view .ck-input-text{min-width:0;width:100%}.ck.ck-text-alternative-form .ck-button{padding:var(--ck-spacing-standard);margin-top:var(--ck-spacing-standard);border-radius:0;border:0;border-top:1px solid var(--ck-color-base-border)}[dir=ltr] .ck.ck-text-alternative-form .ck-button{margin-left:0}[dir=ltr] .ck.ck-text-alternative-form .ck-button:first-of-type{border-right:1px solid var(--ck-color-base-border)}[dir=rtl] .ck.ck-text-alternative-form .ck-button{margin-left:0}[dir=rtl] .ck.ck-text-alternative-form .ck-button:last-of-type{border-right:1px solid var(--ck-color-base-border)}}"},function(t,e,n){var i=n(1),o=n(56);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=':root{--ck-balloon-panel-arrow-z-index:calc(var(--ck-z-default) - 3)}.ck.ck-balloon-panel{display:none;position:absolute;z-index:var(--ck-z-modal)}.ck.ck-balloon-panel.ck-balloon-panel_with-arrow:after,.ck.ck-balloon-panel.ck-balloon-panel_with-arrow:before{content:"";position:absolute}.ck.ck-balloon-panel.ck-balloon-panel_with-arrow:before{z-index:var(--ck-balloon-panel-arrow-z-index)}.ck.ck-balloon-panel.ck-balloon-panel_with-arrow:after{z-index:calc(var(--ck-balloon-panel-arrow-z-index) + 1)}.ck.ck-balloon-panel[class*=arrow_n]:before{z-index:var(--ck-balloon-panel-arrow-z-index)}.ck.ck-balloon-panel[class*=arrow_n]:after{z-index:calc(var(--ck-balloon-panel-arrow-z-index) + 1)}.ck.ck-balloon-panel[class*=arrow_s]:before{z-index:var(--ck-balloon-panel-arrow-z-index)}.ck.ck-balloon-panel[class*=arrow_s]:after{z-index:calc(var(--ck-balloon-panel-arrow-z-index) + 1)}.ck.ck-balloon-panel.ck-balloon-panel_visible{display:block}:root{--ck-balloon-arrow-offset:2px;--ck-balloon-arrow-height:10px;--ck-balloon-arrow-half-width:8px}.ck.ck-balloon-panel{border-radius:0}.ck-rounded-corners .ck.ck-balloon-panel,.ck.ck-balloon-panel.ck-rounded-corners{border-radius:var(--ck-border-radius)}.ck.ck-balloon-panel{box-shadow:var(--ck-drop-shadow),0 0;min-height:15px;background:var(--ck-color-panel-background);border:1px solid var(--ck-color-panel-border)}.ck.ck-balloon-panel.ck-balloon-panel_with-arrow:after,.ck.ck-balloon-panel.ck-balloon-panel_with-arrow:before{width:0;height:0;border-style:solid}.ck.ck-balloon-panel[class*=arrow_n]:after,.ck.ck-balloon-panel[class*=arrow_n]:before{border-left-width:var(--ck-balloon-arrow-half-width);border-bottom-width:var(--ck-balloon-arrow-height);border-right-width:var(--ck-balloon-arrow-half-width);border-top-width:0}.ck.ck-balloon-panel[class*=arrow_n]:before{border-bottom-color:var(--ck-color-panel-border)}.ck.ck-balloon-panel[class*=arrow_n]:after,.ck.ck-balloon-panel[class*=arrow_n]:before{border-left-color:transparent;border-right-color:transparent;border-top-color:transparent}.ck.ck-balloon-panel[class*=arrow_n]:after{border-bottom-color:var(--ck-color-panel-background);margin-top:var(--ck-balloon-arrow-offset)}.ck.ck-balloon-panel[class*=arrow_s]:after,.ck.ck-balloon-panel[class*=arrow_s]:before{border-left-width:var(--ck-balloon-arrow-half-width);border-bottom-width:0;border-right-width:var(--ck-balloon-arrow-half-width);border-top-width:var(--ck-balloon-arrow-height)}.ck.ck-balloon-panel[class*=arrow_s]:before{border-top-color:var(--ck-color-panel-border)}.ck.ck-balloon-panel[class*=arrow_s]:after,.ck.ck-balloon-panel[class*=arrow_s]:before{border-left-color:transparent;border-bottom-color:transparent;border-right-color:transparent}.ck.ck-balloon-panel[class*=arrow_s]:after{border-top-color:var(--ck-color-panel-background);margin-bottom:var(--ck-balloon-arrow-offset)}.ck.ck-balloon-panel.ck-balloon-panel_arrow_n:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_n:before{left:50%;margin-left:calc(-1*var(--ck-balloon-arrow-half-width));top:calc(-1*var(--ck-balloon-arrow-height))}.ck.ck-balloon-panel.ck-balloon-panel_arrow_nw:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_nw:before{left:calc(2*var(--ck-balloon-arrow-half-width));top:calc(-1*var(--ck-balloon-arrow-height))}.ck.ck-balloon-panel.ck-balloon-panel_arrow_ne:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_ne:before{right:calc(2*var(--ck-balloon-arrow-half-width));top:calc(-1*var(--ck-balloon-arrow-height))}.ck.ck-balloon-panel.ck-balloon-panel_arrow_s:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_s:before{left:50%;margin-left:calc(-1*var(--ck-balloon-arrow-half-width));bottom:calc(-1*var(--ck-balloon-arrow-height))}.ck.ck-balloon-panel.ck-balloon-panel_arrow_sw:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_sw:before{left:calc(2*var(--ck-balloon-arrow-half-width));bottom:calc(-1*var(--ck-balloon-arrow-height))}.ck.ck-balloon-panel.ck-balloon-panel_arrow_se:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_se:before{right:calc(2*var(--ck-balloon-arrow-half-width));bottom:calc(-1*var(--ck-balloon-arrow-height))}.ck.ck-balloon-panel.ck-balloon-panel_arrow_sme:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_sme:before{right:25%;margin-right:calc(2*var(--ck-balloon-arrow-half-width));bottom:calc(-1*var(--ck-balloon-arrow-height))}.ck.ck-balloon-panel.ck-balloon-panel_arrow_smw:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_smw:before{left:25%;margin-left:calc(2*var(--ck-balloon-arrow-half-width));bottom:calc(-1*var(--ck-balloon-arrow-height))}.ck.ck-balloon-panel.ck-balloon-panel_arrow_nme:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_nme:before{right:25%;margin-right:calc(2*var(--ck-balloon-arrow-half-width));top:calc(-1*var(--ck-balloon-arrow-height))}.ck.ck-balloon-panel.ck-balloon-panel_arrow_nmw:after,.ck.ck-balloon-panel.ck-balloon-panel_arrow_nmw:before{left:25%;margin-left:calc(2*var(--ck-balloon-arrow-half-width));top:calc(-1*var(--ck-balloon-arrow-height))}'},function(t,e,n){var i=n(1),o=n(58);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck .ck-balloon-rotator__navigation{display:flex;align-items:center;justify-content:center}.ck .ck-balloon-rotator__content .ck-toolbar{justify-content:center}.ck .ck-balloon-rotator__navigation{background:var(--ck-color-toolbar-background);border-bottom:1px solid var(--ck-color-toolbar-border);padding:0 var(--ck-spacing-small)}.ck .ck-balloon-rotator__navigation>*{margin-right:var(--ck-spacing-small);margin-top:var(--ck-spacing-small);margin-bottom:var(--ck-spacing-small)}.ck .ck-balloon-rotator__navigation .ck-balloon-rotator__counter{margin-right:var(--ck-spacing-standard);margin-left:var(--ck-spacing-small)}.ck .ck-balloon-rotator__content .ck.ck-annotation-wrapper{box-shadow:none}"},function(t,e,n){var i=n(1),o=n(60);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck .ck-fake-panel{position:absolute;z-index:calc(var(--ck-z-modal) - 1)}.ck .ck-fake-panel div{position:absolute}.ck .ck-fake-panel div:first-child{z-index:2}.ck .ck-fake-panel div:nth-child(2){z-index:1}:root{--ck-balloon-fake-panel-offset-horizontal:6px;--ck-balloon-fake-panel-offset-vertical:6px}.ck .ck-fake-panel div{box-shadow:var(--ck-drop-shadow),0 0;min-height:15px;background:var(--ck-color-panel-background);border:1px solid var(--ck-color-panel-border);border-radius:var(--ck-border-radius);width:100%;height:100%}.ck .ck-fake-panel div:first-child{margin-left:var(--ck-balloon-fake-panel-offset-horizontal);margin-top:var(--ck-balloon-fake-panel-offset-vertical)}.ck .ck-fake-panel div:nth-child(2){margin-left:calc(var(--ck-balloon-fake-panel-offset-horizontal)*2);margin-top:calc(var(--ck-balloon-fake-panel-offset-vertical)*2)}.ck .ck-fake-panel div:nth-child(3){margin-left:calc(var(--ck-balloon-fake-panel-offset-horizontal)*3);margin-top:calc(var(--ck-balloon-fake-panel-offset-vertical)*3)}.ck .ck-balloon-panel_arrow_s+.ck-fake-panel,.ck .ck-balloon-panel_arrow_se+.ck-fake-panel,.ck .ck-balloon-panel_arrow_sw+.ck-fake-panel{--ck-balloon-fake-panel-offset-vertical:-6px}"},function(t,e,n){var i=n(1),o=n(62);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck-content .image{display:table;clear:both;text-align:center;margin:1em auto}.ck-content .image>img{display:block;margin:0 auto;max-width:100%;min-width:50px}"},function(t,e,n){var i=n(1),o=n(64);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-editor__editable .image{position:relative}.ck.ck-editor__editable .image .ck-progress-bar{position:absolute;top:0;left:0}.ck.ck-editor__editable .image.ck-appear{animation:fadeIn .7s}.ck.ck-editor__editable .image .ck-progress-bar{height:2px;width:0;background:var(--ck-color-upload-bar-background);transition:width .1s}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}"},function(t,e,n){var i=n(1),o=n(66);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports='.ck-image-upload-complete-icon{display:block;position:absolute;top:10px;right:10px;border-radius:50%}.ck-image-upload-complete-icon:after{content:"";position:absolute}:root{--ck-color-image-upload-icon:#fff;--ck-color-image-upload-icon-background:#008a00;--ck-image-upload-icon-size:20px;--ck-image-upload-icon-width:2px}.ck-image-upload-complete-icon{width:var(--ck-image-upload-icon-size);height:var(--ck-image-upload-icon-size);opacity:0;background:var(--ck-color-image-upload-icon-background);animation-name:ck-upload-complete-icon-show,ck-upload-complete-icon-hide;animation-fill-mode:forwards,forwards;animation-duration:.5s,.5s;font-size:var(--ck-image-upload-icon-size);animation-delay:0ms,3s}.ck-image-upload-complete-icon:after{left:25%;top:50%;opacity:0;height:0;width:0;transform:scaleX(-1) rotate(135deg);transform-origin:left top;border-top:var(--ck-image-upload-icon-width) solid var(--ck-color-image-upload-icon);border-right:var(--ck-image-upload-icon-width) solid var(--ck-color-image-upload-icon);animation-name:ck-upload-complete-icon-check;animation-duration:.5s;animation-delay:.5s;animation-fill-mode:forwards;box-sizing:border-box}@keyframes ck-upload-complete-icon-show{0%{opacity:0}to{opacity:1}}@keyframes ck-upload-complete-icon-hide{0%{opacity:1}to{opacity:0}}@keyframes ck-upload-complete-icon-check{0%{opacity:1;width:0;height:0}33%{width:.3em;height:0}to{opacity:1;width:.3em;height:.45em}}'},function(t,e,n){var i=n(1),o=n(68);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports='.ck .ck-upload-placeholder-loader{position:absolute;display:flex;align-items:center;justify-content:center;top:0;left:0}.ck .ck-upload-placeholder-loader:before{content:"";position:relative}:root{--ck-color-upload-placeholder-loader:#b3b3b3;--ck-upload-placeholder-loader-size:32px}.ck .ck-image-upload-placeholder{width:100%;margin:0}.ck .ck-upload-placeholder-loader{width:100%;height:100%}.ck .ck-upload-placeholder-loader:before{width:var(--ck-upload-placeholder-loader-size);height:var(--ck-upload-placeholder-loader-size);border-radius:50%;border-top:3px solid var(--ck-color-upload-placeholder-loader);border-right:2px solid transparent;animation:ck-upload-placeholder-loader 1s linear infinite}@keyframes ck-upload-placeholder-loader{to{transform:rotate(1turn)}}'},function(t,e){t.exports=".ck.ck-heading_heading1{font-size:20px}.ck.ck-heading_heading2{font-size:17px}.ck.ck-heading_heading3{font-size:14px}.ck[class*=ck-heading_heading]{font-weight:700}.ck.ck-dropdown.ck-heading-dropdown .ck-dropdown__button .ck-button__label{width:8em}.ck.ck-dropdown.ck-heading-dropdown .ck-dropdown__panel .ck-list__item{min-width:18em}"},function(t,e,n){var i=n(1),o=n(71);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck-content .image>figcaption{display:table-caption;caption-side:bottom;word-break:break-word;color:#333;background-color:#f7f7f7;padding:.6em;font-size:.75em;outline-offset:-1px}"},function(t,e,n){var i=n(1),o=n(73);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=":root{--ck-image-style-spacing:1.5em}.ck-content .image-style-align-center,.ck-content .image-style-align-left,.ck-content .image-style-align-right,.ck-content .image-style-side{max-width:50%}.ck-content .image-style-side{float:right;margin-left:var(--ck-image-style-spacing)}.ck-content .image-style-align-left{float:left;margin-right:var(--ck-image-style-spacing)}.ck-content .image-style-align-center{margin-left:auto;margin-right:auto}.ck-content .image-style-align-right{float:right;margin-left:var(--ck-image-style-spacing)}"},function(t,e,n){var i=n(1),o=n(75);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-link-form{display:flex}.ck.ck-link-form .ck-label{display:none}@media screen and (max-width:600px){.ck.ck-link-form{flex-wrap:wrap}.ck.ck-link-form .ck-labeled-field-view{flex-basis:100%}.ck.ck-link-form .ck-button{flex-basis:50%}}.ck.ck-link-form_layout-vertical{display:block}.ck.ck-link-form{padding:var(--ck-spacing-standard)}.ck.ck-link-form:focus{outline:none}[dir=ltr] .ck.ck-link-form>:not(:first-child),[dir=rtl] .ck.ck-link-form>:not(:last-child){margin-left:var(--ck-spacing-standard)}@media screen and (max-width:600px){.ck.ck-link-form{padding:0;width:calc(0.8*var(--ck-input-text-width))}.ck.ck-link-form .ck-labeled-field-view{margin:var(--ck-spacing-standard) var(--ck-spacing-standard) 0}.ck.ck-link-form .ck-labeled-field-view .ck-input-text{min-width:0;width:100%}.ck.ck-link-form .ck-button{padding:var(--ck-spacing-standard);margin-top:var(--ck-spacing-standard);border-radius:0;border:0;border-top:1px solid var(--ck-color-base-border)}[dir=ltr] .ck.ck-link-form .ck-button{margin-left:0}[dir=ltr] .ck.ck-link-form .ck-button:first-of-type{border-right:1px solid var(--ck-color-base-border)}[dir=rtl] .ck.ck-link-form .ck-button{margin-left:0}[dir=rtl] .ck.ck-link-form .ck-button:last-of-type{border-right:1px solid var(--ck-color-base-border)}}.ck.ck-link-form_layout-vertical{padding:0;min-width:var(--ck-input-text-width)}.ck.ck-link-form_layout-vertical .ck-labeled-field-view{margin:var(--ck-spacing-standard) var(--ck-spacing-standard) var(--ck-spacing-small)}.ck.ck-link-form_layout-vertical .ck-labeled-field-view .ck-input-text{min-width:0;width:100%}.ck.ck-link-form_layout-vertical .ck-button{padding:var(--ck-spacing-standard);margin:0;border-radius:0;border:0;border-top:1px solid var(--ck-color-base-border);width:50%}[dir=ltr] .ck.ck-link-form_layout-vertical .ck-button{margin-left:0}[dir=ltr] .ck.ck-link-form_layout-vertical .ck-button:first-of-type{border-right:1px solid var(--ck-color-base-border)}[dir=rtl] .ck.ck-link-form_layout-vertical .ck-button{margin-left:0}[dir=rtl] .ck.ck-link-form_layout-vertical .ck-button:last-of-type{border-right:1px solid var(--ck-color-base-border)}.ck.ck-link-form_layout-vertical .ck.ck-list{margin-left:0}.ck.ck-link-form_layout-vertical .ck.ck-list .ck-button.ck-switchbutton{border:0;width:100%}.ck.ck-link-form_layout-vertical .ck.ck-list .ck-button.ck-switchbutton:hover{background:none}"},function(t,e,n){var i=n(1),o=n(77);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-link-actions{display:flex;flex-direction:row;flex-wrap:nowrap}.ck.ck-link-actions .ck-link-actions__preview{display:inline-block}.ck.ck-link-actions .ck-link-actions__preview .ck-button__label{overflow:hidden}@media screen and (max-width:600px){.ck.ck-link-actions{flex-wrap:wrap}.ck.ck-link-actions .ck-link-actions__preview{flex-basis:100%}.ck.ck-link-actions .ck-button:not(.ck-link-actions__preview){flex-basis:50%}}.ck.ck-link-actions{padding:var(--ck-spacing-standard)}.ck.ck-link-actions .ck-button.ck-link-actions__preview{padding-left:0;padding-right:0}.ck.ck-link-actions .ck-button.ck-link-actions__preview .ck-button__label{padding:0 var(--ck-spacing-medium);color:var(--ck-color-link-default);text-overflow:ellipsis;cursor:pointer;max-width:var(--ck-input-text-width);min-width:3em;text-align:center}.ck.ck-link-actions .ck-button.ck-link-actions__preview .ck-button__label:hover{text-decoration:underline}.ck.ck-link-actions .ck-button.ck-link-actions__preview,.ck.ck-link-actions .ck-button.ck-link-actions__preview:active,.ck.ck-link-actions .ck-button.ck-link-actions__preview:focus,.ck.ck-link-actions .ck-button.ck-link-actions__preview:hover{background:none}.ck.ck-link-actions .ck-button.ck-link-actions__preview:active{box-shadow:none}.ck.ck-link-actions .ck-button.ck-link-actions__preview:focus .ck-button__label{text-decoration:underline}.ck.ck-link-actions:focus{outline:none}[dir=ltr] .ck.ck-link-actions .ck-button:not(:first-child),[dir=rtl] .ck.ck-link-actions .ck-button:not(:last-child){margin-left:var(--ck-spacing-standard)}@media screen and (max-width:600px){.ck.ck-link-actions{padding:0;width:calc(0.8*var(--ck-input-text-width))}.ck.ck-link-actions .ck-button.ck-link-actions__preview{margin:var(--ck-spacing-standard) var(--ck-spacing-standard) 0}.ck.ck-link-actions .ck-button.ck-link-actions__preview .ck-button__label{min-width:0;max-width:100%}.ck.ck-link-actions .ck-button:not(.ck-link-actions__preview){padding:var(--ck-spacing-standard);margin-top:var(--ck-spacing-standard);border-radius:0;border:0;border-top:1px solid var(--ck-color-base-border)}[dir=ltr] .ck.ck-link-actions .ck-button:not(.ck-link-actions__preview){margin-left:0}[dir=ltr] .ck.ck-link-actions .ck-button:not(.ck-link-actions__preview):first-of-type{border-right:1px solid var(--ck-color-base-border)}[dir=rtl] .ck.ck-link-actions .ck-button:not(.ck-link-actions__preview){margin-left:0}[dir=rtl] .ck.ck-link-actions .ck-button:not(.ck-link-actions__preview):last-of-type{border-right:1px solid var(--ck-color-base-border)}}"},function(t,e,n){var i=n(1),o=n(79);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports='.ck-media__wrapper .ck-media__placeholder{display:flex;flex-direction:column;align-items:center}.ck-media__wrapper .ck-media__placeholder .ck-media__placeholder__url .ck-tooltip{display:block}@media (hover:none){.ck-media__wrapper .ck-media__placeholder .ck-media__placeholder__url .ck-tooltip{display:none}}.ck-media__wrapper .ck-media__placeholder .ck-media__placeholder__url{max-width:100%;position:relative}.ck-media__wrapper .ck-media__placeholder .ck-media__placeholder__url:hover .ck-tooltip{visibility:visible;opacity:1}.ck-media__wrapper .ck-media__placeholder .ck-media__placeholder__url .ck-media__placeholder__url__text{overflow:hidden;display:block}.ck-media__wrapper[data-oembed-url*="facebook.com"] .ck-media__placeholder__icon *,.ck-media__wrapper[data-oembed-url*="google.com/maps"] .ck-media__placeholder__icon *,.ck-media__wrapper[data-oembed-url*="instagram.com"] .ck-media__placeholder__icon *,.ck-media__wrapper[data-oembed-url*="twitter.com"] .ck-media__placeholder__icon *{display:none}.ck-editor__editable:not(.ck-read-only) .ck-media__wrapper>:not(.ck-media__placeholder),.ck-editor__editable:not(.ck-read-only) .ck-widget:not(.ck-widget_selected) .ck-media__placeholder{pointer-events:none}:root{--ck-media-embed-placeholder-icon-size:3em;--ck-color-media-embed-placeholder-url-text:#757575;--ck-color-media-embed-placeholder-url-text-hover:var(--ck-color-base-text)}.ck-media__wrapper{margin:0 auto}.ck-media__wrapper .ck-media__placeholder{padding:calc(3*var(--ck-spacing-standard));background:var(--ck-color-base-foreground)}.ck-media__wrapper .ck-media__placeholder .ck-media__placeholder__icon{min-width:var(--ck-media-embed-placeholder-icon-size);height:var(--ck-media-embed-placeholder-icon-size);margin-bottom:var(--ck-spacing-large);background-position:50%;background-size:cover}.ck-media__wrapper .ck-media__placeholder .ck-media__placeholder__icon .ck-icon{width:100%;height:100%}.ck-media__wrapper .ck-media__placeholder .ck-media__placeholder__url__text{color:var(--ck-color-media-embed-placeholder-url-text);white-space:nowrap;text-align:center;font-style:italic;text-overflow:ellipsis}.ck-media__wrapper .ck-media__placeholder .ck-media__placeholder__url__text:hover{color:var(--ck-color-media-embed-placeholder-url-text-hover);cursor:pointer;text-decoration:underline}.ck-media__wrapper[data-oembed-url*="open.spotify.com"]{max-width:300px;max-height:380px}.ck-media__wrapper[data-oembed-url*="google.com/maps"] .ck-media__placeholder__icon{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAuMzc4IiBoZWlnaHQ9IjI1NC4xNjciIHZpZXdCb3g9IjAgMCA2Ni4yNDYgNjcuMjQ4Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTcyLjUzMSAtMjE4LjQ1NSkgc2NhbGUoLjk4MDEyKSI+PHJlY3Qgcnk9IjUuMjM4IiByeD0iNS4yMzgiIHk9IjIzMS4zOTkiIHg9IjE3Ni4wMzEiIGhlaWdodD0iNjAuMDk5IiB3aWR0aD0iNjAuMDk5IiBmaWxsPSIjMzRhNjY4IiBwYWludC1vcmRlcj0ibWFya2VycyBzdHJva2UgZmlsbCIvPjxwYXRoIGQ9Ik0yMDYuNDc3IDI2MC45bC0yOC45ODcgMjguOTg3YTUuMjE4IDUuMjE4IDAgMDAzLjc4IDEuNjFoNDkuNjIxYzEuNjk0IDAgMy4xOS0uNzk4IDQuMTQ2LTIuMDM3eiIgZmlsbD0iIzVjODhjNSIvPjxwYXRoIGQ9Ik0yMjYuNzQyIDIyMi45ODhjLTkuMjY2IDAtMTYuNzc3IDcuMTctMTYuNzc3IDE2LjAxNC4wMDcgMi43NjIuNjYzIDUuNDc0IDIuMDkzIDcuODc1LjQzLjcwMy44MyAxLjQwOCAxLjE5IDIuMTA3LjMzMy41MDIuNjUgMS4wMDUuOTUgMS41MDguMzQzLjQ3Ny42NzMuOTU3Ljk4OCAxLjQ0IDEuMzEgMS43NjkgMi41IDMuNTAyIDMuNjM3IDUuMTY4Ljc5MyAxLjI3NSAxLjY4MyAyLjY0IDIuNDY2IDMuOTkgMi4zNjMgNC4wOTQgNC4wMDcgOC4wOTIgNC42IDEzLjkxNHYuMDEyYy4xODIuNDEyLjUxNi42NjYuODc5LjY2Ny40MDMtLjAwMS43NjgtLjMxNC45My0uNzk5LjYwMy01Ljc1NiAyLjIzOC05LjcyOSA0LjU4NS0xMy43OTQuNzgyLTEuMzUgMS42NzMtMi43MTUgMi40NjUtMy45OSAxLjEzNy0xLjY2NiAyLjMyOC0zLjQgMy42MzgtNS4xNjkuMzE1LS40ODIuNjQ1LS45NjIuOTg4LTEuNDM5LjMtLjUwMy42MTctMS4wMDYuOTUtMS41MDguMzU5LS43Ljc2LTEuNDA0IDEuMTktMi4xMDcgMS40MjYtMi40MDIgMi01LjExNCAyLjAwNC03Ljg3NSAwLTguODQ0LTcuNTExLTE2LjAxNC0xNi43NzYtMTYuMDE0eiIgZmlsbD0iI2RkNGIzZSIgcGFpbnQtb3JkZXI9Im1hcmtlcnMgc3Ryb2tlIGZpbGwiLz48ZWxsaXBzZSByeT0iNS41NjQiIHJ4PSI1LjgyOCIgY3k9IjIzOS4wMDIiIGN4PSIyMjYuNzQyIiBmaWxsPSIjODAyZDI3IiBwYWludC1vcmRlcj0ibWFya2VycyBzdHJva2UgZmlsbCIvPjxwYXRoIGQ9Ik0xOTAuMzAxIDIzNy4yODNjLTQuNjcgMC04LjQ1NyAzLjg1My04LjQ1NyA4LjYwNnMzLjc4NiA4LjYwNyA4LjQ1NyA4LjYwN2MzLjA0MyAwIDQuODA2LS45NTggNi4zMzctMi41MTYgMS41My0xLjU1NyAyLjA4Ny0zLjkxMyAyLjA4Ny02LjI5IDAtLjM2Mi0uMDIzLS43MjItLjA2NC0xLjA3OWgtOC4yNTd2My4wNDNoNC44NWMtLjE5Ny43NTktLjUzMSAxLjQ1LTEuMDU4IDEuOTg2LS45NDIuOTU4LTIuMDI4IDEuNTQ4LTMuOTAxIDEuNTQ4LTIuODc2IDAtNS4yMDgtMi4zNzItNS4yMDgtNS4yOTkgMC0yLjkyNiAyLjMzMi01LjI5OSA1LjIwOC01LjI5OSAxLjM5OSAwIDIuNjE4LjQwNyAzLjU4NCAxLjI5M2wyLjM4MS0yLjM4YzAtLjAwMi0uMDAzLS4wMDQtLjAwNC0uMDA1LTEuNTg4LTEuNTI0LTMuNjItMi4yMTUtNS45NTUtMi4yMTV6bTQuNDMgNS42NmwuMDAzLjAwNnYtLjAwM3oiIGZpbGw9IiNmZmYiIHBhaW50LW9yZGVyPSJtYXJrZXJzIHN0cm9rZSBmaWxsIi8+PHBhdGggZD0iTTIxNS4xODQgMjUxLjkyOWwtNy45OCA3Ljk3OSAyOC40NzcgMjguNDc1YTUuMjMzIDUuMjMzIDAgMDAuNDQ5LTIuMTIzdi0zMS4xNjVjLS40NjkuNjc1LS45MzQgMS4zNDktMS4zODIgMi4wMDUtLjc5MiAxLjI3NS0xLjY4MiAyLjY0LTIuNDY1IDMuOTktMi4zNDcgNC4wNjUtMy45ODIgOC4wMzgtNC41ODUgMTMuNzk0LS4xNjIuNDg1LS41MjcuNzk4LS45My43OTktLjM2My0uMDAxLS42OTctLjI1NS0uODc5LS42Njd2LS4wMTJjLS41OTMtNS44MjItMi4yMzctOS44Mi00LjYtMTMuOTE0LS43ODMtMS4zNS0xLjY3My0yLjcxNS0yLjQ2Ni0zLjk5LTEuMTM3LTEuNjY2LTIuMzI3LTMuNC0zLjYzNy01LjE2OWwtLjAwMi0uMDAzeiIgZmlsbD0iI2MzYzNjMyIvPjxwYXRoIGQ9Ik0yMTIuOTgzIDI0OC40OTVsLTM2Ljk1MiAzNi45NTN2LjgxMmE1LjIyNyA1LjIyNyAwIDAwNS4yMzggNS4yMzhoMS4wMTVsMzUuNjY2LTM1LjY2NmExMzYuMjc1IDEzNi4yNzUgMCAwMC0yLjc2NC0zLjkgMzcuNTc1IDM3LjU3NSAwIDAwLS45ODktMS40NCAzNS4xMjcgMzUuMTI3IDAgMDAtLjk1LTEuNTA4Yy0uMDgzLS4xNjItLjE3Ni0uMzI2LS4yNjQtLjQ4OXoiIGZpbGw9IiNmZGRjNGYiIHBhaW50LW9yZGVyPSJtYXJrZXJzIHN0cm9rZSBmaWxsIi8+PHBhdGggZD0iTTIxMS45OTggMjYxLjA4M2wtNi4xNTIgNi4xNTEgMjQuMjY0IDI0LjI2NGguNzgxYTUuMjI3IDUuMjI3IDAgMDA1LjIzOS01LjIzOHYtMS4wNDV6IiBmaWxsPSIjZmZmIiBwYWludC1vcmRlcj0ibWFya2VycyBzdHJva2UgZmlsbCIvPjwvZz48L3N2Zz4=)}.ck-media__wrapper[data-oembed-url*="facebook.com"] .ck-media__placeholder{background:#4268b3}.ck-media__wrapper[data-oembed-url*="facebook.com"] .ck-media__placeholder .ck-media__placeholder__icon{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik05NjcuNDg0IDBINTYuNTE3QzI1LjMwNCAwIDAgMjUuMzA0IDAgNTYuNTE3djkxMC45NjZDMCA5OTguNjk0IDI1LjI5NyAxMDI0IDU2LjUyMiAxMDI0SDU0N1Y2MjhINDE0VjQ3M2gxMzNWMzU5LjAyOWMwLTEzMi4yNjIgODAuNzczLTIwNC4yODIgMTk4Ljc1Ni0yMDQuMjgyIDU2LjUxMyAwIDEwNS4wODYgNC4yMDggMTE5LjI0NCA2LjA4OVYyOTlsLTgxLjYxNi4wMzdjLTYzLjk5MyAwLTc2LjM4NCAzMC40OTItNzYuMzg0IDc1LjIzNlY0NzNoMTUzLjQ4N2wtMTkuOTg2IDE1NUg3MDd2Mzk2aDI2MC40ODRjMzEuMjEzIDAgNTYuNTE2LTI1LjMwMyA1Ni41MTYtNTYuNTE2VjU2LjUxNUMxMDI0IDI1LjMwMyA5OTguNjk3IDAgOTY3LjQ4NCAwIiBmaWxsPSIjRkZGRkZFIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=)}.ck-media__wrapper[data-oembed-url*="facebook.com"] .ck-media__placeholder .ck-media__placeholder__url__text{color:#cdf}.ck-media__wrapper[data-oembed-url*="facebook.com"] .ck-media__placeholder .ck-media__placeholder__url__text:hover{color:#fff}.ck-media__wrapper[data-oembed-url*="instagram.com"] .ck-media__placeholder{background:linear-gradient(-135deg,#1400c7,#b800b1,#f50000)}.ck-media__wrapper[data-oembed-url*="instagram.com"] .ck-media__placeholder .ck-media__placeholder__icon{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTA0IiBoZWlnaHQ9IjUwNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0wIC4xNTloNTAzLjg0MVY1MDMuOTRIMHoiLz48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48bWFzayBpZD0iYiIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmPSIjYSIvPjwvbWFzaz48cGF0aCBkPSJNMjUxLjkyMS4xNTljLTY4LjQxOCAwLTc2Ljk5Ny4yOS0xMDMuODY3IDEuNTE2LTI2LjgxNCAxLjIyMy00NS4xMjcgNS40ODItNjEuMTUxIDExLjcxLTE2LjU2NiA2LjQzNy0zMC42MTUgMTUuMDUxLTQ0LjYyMSAyOS4wNTYtMTQuMDA1IDE0LjAwNi0yMi42MTkgMjguMDU1LTI5LjA1NiA0NC42MjEtNi4yMjggMTYuMDI0LTEwLjQ4NyAzNC4zMzctMTEuNzEgNjEuMTUxQy4yOSAxNzUuMDgzIDAgMTgzLjY2MiAwIDI1Mi4wOGMwIDY4LjQxNy4yOSA3Ni45OTYgMS41MTYgMTAzLjg2NiAxLjIyMyAyNi44MTQgNS40ODIgNDUuMTI3IDExLjcxIDYxLjE1MSA2LjQzNyAxNi41NjYgMTUuMDUxIDMwLjYxNSAyOS4wNTYgNDQuNjIxIDE0LjAwNiAxNC4wMDUgMjguMDU1IDIyLjYxOSA0NC42MjEgMjkuMDU3IDE2LjAyNCA2LjIyNyAzNC4zMzcgMTAuNDg2IDYxLjE1MSAxMS43MDkgMjYuODcgMS4yMjYgMzUuNDQ5IDEuNTE2IDEwMy44NjcgMS41MTYgNjguNDE3IDAgNzYuOTk2LS4yOSAxMDMuODY2LTEuNTE2IDI2LjgxNC0xLjIyMyA0NS4xMjctNS40ODIgNjEuMTUxLTExLjcwOSAxNi41NjYtNi40MzggMzAuNjE1LTE1LjA1MiA0NC42MjEtMjkuMDU3IDE0LjAwNS0xNC4wMDYgMjIuNjE5LTI4LjA1NSAyOS4wNTctNDQuNjIxIDYuMjI3LTE2LjAyNCAxMC40ODYtMzQuMzM3IDExLjcwOS02MS4xNTEgMS4yMjYtMjYuODcgMS41MTYtMzUuNDQ5IDEuNTE2LTEwMy44NjYgMC02OC40MTgtLjI5LTc2Ljk5Ny0xLjUxNi0xMDMuODY3LTEuMjIzLTI2LjgxNC01LjQ4Mi00NS4xMjctMTEuNzA5LTYxLjE1MS02LjQzOC0xNi41NjYtMTUuMDUyLTMwLjYxNS0yOS4wNTctNDQuNjIxLTE0LjAwNi0xNC4wMDUtMjguMDU1LTIyLjYxOS00NC42MjEtMjkuMDU2LTE2LjAyNC02LjIyOC0zNC4zMzctMTAuNDg3LTYxLjE1MS0xMS43MUMzMjguOTE3LjQ0OSAzMjAuMzM4LjE1OSAyNTEuOTIxLjE1OXptMCA0NS4zOTFjNjcuMjY1IDAgNzUuMjMzLjI1NyAxMDEuNzk3IDEuNDY5IDI0LjU2MiAxLjEyIDM3LjkwMSA1LjIyNCA0Ni43NzggOC42NzQgMTEuNzU5IDQuNTcgMjAuMTUxIDEwLjAyOSAyOC45NjYgMTguODQ1IDguODE2IDguODE1IDE0LjI3NSAxNy4yMDcgMTguODQ1IDI4Ljk2NiAzLjQ1IDguODc3IDcuNTU0IDIyLjIxNiA4LjY3NCA0Ni43NzggMS4yMTIgMjYuNTY0IDEuNDY5IDM0LjUzMiAxLjQ2OSAxMDEuNzk4IDAgNjcuMjY1LS4yNTcgNzUuMjMzLTEuNDY5IDEwMS43OTctMS4xMiAyNC41NjItNS4yMjQgMzcuOTAxLTguNjc0IDQ2Ljc3OC00LjU3IDExLjc1OS0xMC4wMjkgMjAuMTUxLTE4Ljg0NSAyOC45NjYtOC44MTUgOC44MTYtMTcuMjA3IDE0LjI3NS0yOC45NjYgMTguODQ1LTguODc3IDMuNDUtMjIuMjE2IDcuNTU0LTQ2Ljc3OCA4LjY3NC0yNi41NiAxLjIxMi0zNC41MjcgMS40NjktMTAxLjc5NyAxLjQ2OS02Ny4yNzEgMC03NS4yMzctLjI1Ny0xMDEuNzk4LTEuNDY5LTI0LjU2Mi0xLjEyLTM3LjkwMS01LjIyNC00Ni43NzgtOC42NzQtMTEuNzU5LTQuNTctMjAuMTUxLTEwLjAyOS0yOC45NjYtMTguODQ1LTguODE1LTguODE1LTE0LjI3NS0xNy4yMDctMTguODQ1LTI4Ljk2Ni0zLjQ1LTguODc3LTcuNTU0LTIyLjIxNi04LjY3NC00Ni43NzgtMS4yMTItMjYuNTY0LTEuNDY5LTM0LjUzMi0xLjQ2OS0xMDEuNzk3IDAtNjcuMjY2LjI1Ny03NS4yMzQgMS40NjktMTAxLjc5OCAxLjEyLTI0LjU2MiA1LjIyNC0zNy45MDEgOC42NzQtNDYuNzc4IDQuNTctMTEuNzU5IDEwLjAyOS0yMC4xNTEgMTguODQ1LTI4Ljk2NiA4LjgxNS04LjgxNiAxNy4yMDctMTQuMjc1IDI4Ljk2Ni0xOC44NDUgOC44NzctMy40NSAyMi4yMTYtNy41NTQgNDYuNzc4LTguNjc0IDI2LjU2NC0xLjIxMiAzNC41MzItMS40NjkgMTAxLjc5OC0xLjQ2OXoiIGZpbGw9IiNGRkYiIG1hc2s9InVybCgjYikiLz48cGF0aCBkPSJNMjUxLjkyMSAzMzYuMDUzYy00Ni4zNzggMC04My45NzQtMzcuNTk2LTgzLjk3NC04My45NzMgMC00Ni4zNzggMzcuNTk2LTgzLjk3NCA4My45NzQtODMuOTc0IDQ2LjM3NyAwIDgzLjk3MyAzNy41OTYgODMuOTczIDgzLjk3NCAwIDQ2LjM3Ny0zNy41OTYgODMuOTczLTgzLjk3MyA4My45NzN6bTAtMjEzLjMzOGMtNzEuNDQ3IDAtMTI5LjM2NSA1Ny45MTgtMTI5LjM2NSAxMjkuMzY1IDAgNzEuNDQ2IDU3LjkxOCAxMjkuMzY0IDEyOS4zNjUgMTI5LjM2NCA3MS40NDYgMCAxMjkuMzY0LTU3LjkxOCAxMjkuMzY0LTEyOS4zNjQgMC03MS40NDctNTcuOTE4LTEyOS4zNjUtMTI5LjM2NC0xMjkuMzY1ek00MTYuNjI3IDExNy42MDRjMCAxNi42OTYtMTMuNTM1IDMwLjIzLTMwLjIzMSAzMC4yMy0xNi42OTUgMC0zMC4yMy0xMy41MzQtMzAuMjMtMzAuMjMgMC0xNi42OTYgMTMuNTM1LTMwLjIzMSAzMC4yMy0zMC4yMzEgMTYuNjk2IDAgMzAuMjMxIDEzLjUzNSAzMC4yMzEgMzAuMjMxIiBmaWxsPSIjRkZGIi8+PC9nPjwvc3ZnPg==)}.ck-media__wrapper[data-oembed-url*="instagram.com"] .ck-media__placeholder .ck-media__placeholder__url__text{color:#ffe0fe}.ck-media__wrapper[data-oembed-url*="instagram.com"] .ck-media__placeholder .ck-media__placeholder__url__text:hover{color:#fff}.ck-media__wrapper[data-oembed-url*="twitter.com"] .ck.ck-media__placeholder{background:linear-gradient(90deg,#71c6f4,#0d70a5)}.ck-media__wrapper[data-oembed-url*="twitter.com"] .ck.ck-media__placeholder .ck-media__placeholder__icon{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIj48cGF0aCBkPSJNNDAwIDIwMGMwIDExMC41LTg5LjUgMjAwLTIwMCAyMDBTMCAzMTAuNSAwIDIwMCA4OS41IDAgMjAwIDBzMjAwIDg5LjUgMjAwIDIwMHpNMTYzLjQgMzA1LjVjODguNyAwIDEzNy4yLTczLjUgMTM3LjItMTM3LjIgMC0yLjEgMC00LjItLjEtNi4yIDkuNC02LjggMTcuNi0xNS4zIDI0LjEtMjUtOC42IDMuOC0xNy45IDYuNC0yNy43IDcuNiAxMC02IDE3LjYtMTUuNCAyMS4yLTI2LjctOS4zIDUuNS0xOS42IDkuNS0zMC42IDExLjctOC44LTkuNC0yMS4zLTE1LjItMzUuMi0xNS4yLTI2LjYgMC00OC4yIDIxLjYtNDguMiA0OC4yIDAgMy44LjQgNy41IDEuMyAxMS00MC4xLTItNzUuNi0yMS4yLTk5LjQtNTAuNC00LjEgNy4xLTYuNSAxNS40LTYuNSAyNC4yIDAgMTYuNyA4LjUgMzEuNSAyMS41IDQwLjEtNy45LS4yLTE1LjMtMi40LTIxLjgtNnYuNmMwIDIzLjQgMTYuNiA0Mi44IDM4LjcgNDcuMy00IDEuMS04LjMgMS43LTEyLjcgMS43LTMuMSAwLTYuMS0uMy05LjEtLjkgNi4xIDE5LjIgMjMuOSAzMy4xIDQ1IDMzLjUtMTYuNSAxMi45LTM3LjMgMjAuNi01OS45IDIwLjYtMy45IDAtNy43LS4yLTExLjUtLjcgMjEuMSAxMy44IDQ2LjUgMjEuOCA3My43IDIxLjgiIGZpbGw9IiNmZmYiLz48L3N2Zz4=)}.ck-media__wrapper[data-oembed-url*="twitter.com"] .ck.ck-media__placeholder .ck-media__placeholder__url__text{color:#b8e6ff}.ck-media__wrapper[data-oembed-url*="twitter.com"] .ck.ck-media__placeholder .ck-media__placeholder__url__text:hover{color:#fff}'},function(t,e,n){var i=n(1),o=n(81);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-media-form{display:flex;align-items:flex-start;flex-direction:row;flex-wrap:nowrap}.ck.ck-media-form .ck-labeled-field-view{display:inline-block}.ck.ck-media-form .ck-label{display:none}@media screen and (max-width:600px){.ck.ck-media-form{flex-wrap:wrap}.ck.ck-media-form .ck-labeled-field-view{flex-basis:100%}.ck.ck-media-form .ck-button{flex-basis:50%}}.ck.ck-media-form{padding:var(--ck-spacing-standard)}.ck.ck-media-form:focus{outline:none}[dir=ltr] .ck.ck-media-form>:not(:first-child),[dir=rtl] .ck.ck-media-form>:not(:last-child){margin-left:var(--ck-spacing-standard)}@media screen and (max-width:600px){.ck.ck-media-form{padding:0;width:calc(0.8*var(--ck-input-text-width))}.ck.ck-media-form .ck-labeled-field-view{margin:var(--ck-spacing-standard) var(--ck-spacing-standard) 0}.ck.ck-media-form .ck-labeled-field-view .ck-input-text{min-width:0;width:100%}.ck.ck-media-form .ck-labeled-field-view .ck-labeled-field-view__error{white-space:normal}.ck.ck-media-form .ck-button{padding:var(--ck-spacing-standard);margin-top:var(--ck-spacing-standard);border-radius:0;border:0;border-top:1px solid var(--ck-color-base-border)}[dir=ltr] .ck.ck-media-form .ck-button{margin-left:0}[dir=ltr] .ck.ck-media-form .ck-button:first-of-type{border-right:1px solid var(--ck-color-base-border)}[dir=rtl] .ck.ck-media-form .ck-button{margin-left:0}[dir=rtl] .ck.ck-media-form .ck-button:last-of-type{border-right:1px solid var(--ck-color-base-border)}}"},function(t,e,n){var i=n(1),o=n(83);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck-content .media{clear:both;margin:1em 0;display:block;min-width:15em}"},function(t,e,n){var i=n(1),o=n(85);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=":root{--ck-color-table-focused-cell-background:rgba(158,207,250,0.3)}.ck-widget.table td.ck-editor__nested-editable.ck-editor__nested-editable_focused,.ck-widget.table td.ck-editor__nested-editable:focus,.ck-widget.table th.ck-editor__nested-editable.ck-editor__nested-editable_focused,.ck-widget.table th.ck-editor__nested-editable:focus{background:var(--ck-color-table-focused-cell-background);border-style:none;outline:1px solid var(--ck-color-focus-border);outline-offset:-1px}"},function(t,e,n){var i=n(1),o=n(87);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck.ck-splitbutton{font-size:inherit}.ck.ck-splitbutton .ck-splitbutton__action:focus{z-index:calc(var(--ck-z-default) + 1)}.ck.ck-splitbutton.ck-splitbutton_open>.ck-button .ck-tooltip{display:none}:root{--ck-color-split-button-hover-background:#ebebeb;--ck-color-split-button-hover-border:#b3b3b3}[dir=ltr] .ck.ck-splitbutton>.ck-splitbutton__action{border-top-right-radius:unset;border-bottom-right-radius:unset}[dir=rtl] .ck.ck-splitbutton>.ck-splitbutton__action{border-top-left-radius:unset;border-bottom-left-radius:unset}.ck.ck-splitbutton>.ck-splitbutton__arrow{min-width:unset}[dir=ltr] .ck.ck-splitbutton>.ck-splitbutton__arrow{border-radius:0}.ck-rounded-corners [dir=ltr] .ck.ck-splitbutton>.ck-splitbutton__arrow,[dir=ltr] .ck.ck-splitbutton>.ck-splitbutton__arrow.ck-rounded-corners{border-radius:var(--ck-border-radius);border-top-left-radius:unset;border-bottom-left-radius:unset}[dir=rtl] .ck.ck-splitbutton>.ck-splitbutton__arrow{border-top-right-radius:unset;border-bottom-right-radius:unset}.ck.ck-splitbutton>.ck-splitbutton__arrow svg{width:var(--ck-dropdown-arrow-size)}.ck.ck-splitbutton.ck-splitbutton_open>.ck-button:not(.ck-on):not(.ck-disabled):not(:hover),.ck.ck-splitbutton:hover>.ck-button:not(.ck-on):not(.ck-disabled):not(:hover){background:var(--ck-color-split-button-hover-background)}[dir=ltr] .ck.ck-splitbutton.ck-splitbutton_open>.ck-splitbutton__arrow:not(.ck-disabled),[dir=ltr] .ck.ck-splitbutton:hover>.ck-splitbutton__arrow:not(.ck-disabled){border-left-color:var(--ck-color-split-button-hover-border)}[dir=rtl] .ck.ck-splitbutton.ck-splitbutton_open>.ck-splitbutton__arrow:not(.ck-disabled),[dir=rtl] .ck.ck-splitbutton:hover>.ck-splitbutton__arrow:not(.ck-disabled){border-right-color:var(--ck-color-split-button-hover-border)}.ck.ck-splitbutton.ck-splitbutton_open{border-radius:0}.ck-rounded-corners .ck.ck-splitbutton.ck-splitbutton_open,.ck.ck-splitbutton.ck-splitbutton_open.ck-rounded-corners{border-radius:var(--ck-border-radius)}.ck-rounded-corners .ck.ck-splitbutton.ck-splitbutton_open>.ck-splitbutton__action,.ck.ck-splitbutton.ck-splitbutton_open.ck-rounded-corners>.ck-splitbutton__action{border-bottom-left-radius:0}.ck-rounded-corners .ck.ck-splitbutton.ck-splitbutton_open>.ck-splitbutton__arrow,.ck.ck-splitbutton.ck-splitbutton_open.ck-rounded-corners>.ck-splitbutton__arrow{border-bottom-right-radius:0}"},function(t,e,n){var i=n(1),o=n(89);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck .ck-insert-table-dropdown__grid{display:flex;flex-direction:row;flex-wrap:wrap}:root{--ck-insert-table-dropdown-padding:10px;--ck-insert-table-dropdown-box-height:11px;--ck-insert-table-dropdown-box-width:12px;--ck-insert-table-dropdown-box-margin:1px}.ck .ck-insert-table-dropdown__grid{width:calc(var(--ck-insert-table-dropdown-box-width)*10 + var(--ck-insert-table-dropdown-box-margin)*20 + var(--ck-insert-table-dropdown-padding)*2);padding:var(--ck-insert-table-dropdown-padding) var(--ck-insert-table-dropdown-padding) 0}.ck .ck-insert-table-dropdown__label{text-align:center}.ck .ck-insert-table-dropdown-grid-box{width:var(--ck-insert-table-dropdown-box-width);height:var(--ck-insert-table-dropdown-box-height);margin:var(--ck-insert-table-dropdown-box-margin);border:1px solid var(--ck-color-base-border);border-radius:1px}.ck .ck-insert-table-dropdown-grid-box.ck-on{border-color:var(--ck-color-focus-border);background:var(--ck-color-focus-outer-shadow)}"},function(t,e,n){var i=n(1),o=n(91);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=':root{--ck-table-selected-cell-background:rgba(158,207,250,0.3)}.ck.ck-editor__editable .table table td.ck-editor__editable_selected,.ck.ck-editor__editable .table table th.ck-editor__editable_selected{position:relative;caret-color:transparent;outline:unset;box-shadow:unset}.ck.ck-editor__editable .table table td.ck-editor__editable_selected:after,.ck.ck-editor__editable .table table th.ck-editor__editable_selected:after{content:"";pointer-events:none;background-color:var(--ck-table-selected-cell-background);position:absolute;top:0;left:0;right:0;bottom:0}.ck.ck-editor__editable .table table td.ck-editor__editable_selected ::selection,.ck.ck-editor__editable .table table td.ck-editor__editable_selected:focus,.ck.ck-editor__editable .table table th.ck-editor__editable_selected ::selection,.ck.ck-editor__editable .table table th.ck-editor__editable_selected:focus{background-color:transparent}.ck.ck-editor__editable .table table td.ck-editor__editable_selected .ck-widget_selected,.ck.ck-editor__editable .table table th.ck-editor__editable_selected .ck-widget_selected{outline:unset}'},function(t,e,n){var i=n(1),o=n(93);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var r={injectType:"singletonStyleTag",attributes:{"data-cke":!0},insert:"head",singleton:!0};i(o,r);t.exports=o.locals||{}},function(t,e){t.exports=".ck-content .table{margin:1em auto;display:table}.ck-content .table table{border-collapse:collapse;border-spacing:0;width:100%;height:100%;border:1px double #b3b3b3}.ck-content .table table td,.ck-content .table table th{min-width:2em;padding:.4em;border:1px solid #bfbfbf}.ck-content .table table th{font-weight:700;background:hsla(0,0%,0%,5%)}.ck-content[dir=rtl] .table th{text-align:right}.ck-content[dir=ltr] .table th{text-align:left}"},function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return Yp}));var i=n(3),o=i.a.Symbol,r=Object.prototype,s=r.hasOwnProperty,a=r.toString,c=o?o.toStringTag:void 0;var l=function(t){var e=s.call(t,c),n=t[c];try{t[c]=void 0;var i=!0}catch(t){}var o=a.call(t);return i&&(e?t[c]=n:delete t[c]),o},d=Object.prototype.toString;var u=function(t){return d.call(t)},h=o?o.toStringTag:void 0;var f=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":h&&h in Object(t)?l(t):u(t)};var m=function(t,e){return function(n){return t(e(n))}},g=m(Object.getPrototypeOf,Object);var p=function(t){return null!=t&&"object"==typeof t},b=Function.prototype,w=Object.prototype,k=b.toString,_=w.hasOwnProperty,v=k.call(Object);var y=function(t){if(!p(t)||"[object Object]"!=f(t))return!1;var e=g(t);if(null===e)return!0;var n=_.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&k.call(n)==v};var x=function(){this.__data__=[],this.size=0};var A=function(t,e){return t===e||t!=t&&e!=e};var T=function(t,e){for(var n=t.length;n--;)if(A(t[n][0],e))return n;return-1},C=Array.prototype.splice;var P=function(t){var e=this.__data__,n=T(e,t);return!(n<0)&&(n==e.length-1?e.pop():C.call(e,n,1),--this.size,!0)};var S=function(t){var e=this.__data__,n=T(e,t);return n<0?void 0:e[n][1]};var M=function(t){return T(this.__data__,t)>-1};var E=function(t,e){var n=this.__data__,i=T(n,t);return i<0?(++this.size,n.push([t,e])):n[i][1]=e,this};function I(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var i=t[e];this.set(i[0],i[1])}}I.prototype.clear=x,I.prototype.delete=P,I.prototype.get=S,I.prototype.has=M,I.prototype.set=E;var N=I;var O=function(){this.__data__=new N,this.size=0};var R=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n};var D=function(t){return this.__data__.get(t)};var L=function(t){return this.__data__.has(t)};var j=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)};var V,z=function(t){if(!j(t))return!1;var e=f(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e},B=i.a["__core-js_shared__"],F=(V=/[^.]+$/.exec(B&&B.keys&&B.keys.IE_PROTO||""))?"Symbol(src)_1."+V:"";var U=function(t){return!!F&&F in t},H=Function.prototype.toString;var q=function(t){if(null!=t){try{return H.call(t)}catch(t){}try{return t+""}catch(t){}}return""},W=/^\[object .+?Constructor\]$/,Y=Function.prototype,G=Object.prototype,$=Y.toString,Q=G.hasOwnProperty,K=RegExp("^"+$.call(Q).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");var J=function(t){return!(!j(t)||U(t))&&(z(t)?K:W).test(q(t))};var Z=function(t,e){return null==t?void 0:t[e]};var X=function(t,e){var n=Z(t,e);return J(n)?n:void 0},tt=X(i.a,"Map"),et=X(Object,"create");var nt=function(){this.__data__=et?et(null):{},this.size=0};var it=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},ot=Object.prototype.hasOwnProperty;var rt=function(t){var e=this.__data__;if(et){var n=e[t];return"__lodash_hash_undefined__"===n?void 0:n}return ot.call(e,t)?e[t]:void 0},st=Object.prototype.hasOwnProperty;var at=function(t){var e=this.__data__;return et?void 0!==e[t]:st.call(e,t)};var ct=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=et&&void 0===e?"__lodash_hash_undefined__":e,this};function lt(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var i=t[e];this.set(i[0],i[1])}}lt.prototype.clear=nt,lt.prototype.delete=it,lt.prototype.get=rt,lt.prototype.has=at,lt.prototype.set=ct;var dt=lt;var ut=function(){this.size=0,this.__data__={hash:new dt,map:new(tt||N),string:new dt}};var ht=function(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t};var ft=function(t,e){var n=t.__data__;return ht(e)?n["string"==typeof e?"string":"hash"]:n.map};var mt=function(t){var e=ft(this,t).delete(t);return this.size-=e?1:0,e};var gt=function(t){return ft(this,t).get(t)};var pt=function(t){return ft(this,t).has(t)};var bt=function(t,e){var n=ft(this,t),i=n.size;return n.set(t,e),this.size+=n.size==i?0:1,this};function wt(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var i=t[e];this.set(i[0],i[1])}}wt.prototype.clear=ut,wt.prototype.delete=mt,wt.prototype.get=gt,wt.prototype.has=pt,wt.prototype.set=bt;var kt=wt;var _t=function(t,e){var n=this.__data__;if(n instanceof N){var i=n.__data__;if(!tt||i.length<199)return i.push([t,e]),this.size=++n.size,this;n=this.__data__=new kt(i)}return n.set(t,e),this.size=n.size,this};function vt(t){var e=this.__data__=new N(t);this.size=e.size}vt.prototype.clear=O,vt.prototype.delete=R,vt.prototype.get=D,vt.prototype.has=L,vt.prototype.set=_t;var yt=vt;var xt=function(t,e){for(var n=-1,i=null==t?0:t.length;++n<i&&!1!==e(t[n],n,t););return t},At=function(){try{var t=X(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();var Tt=function(t,e,n){"__proto__"==e&&At?At(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n},Ct=Object.prototype.hasOwnProperty;var Pt=function(t,e,n){var i=t[e];Ct.call(t,e)&&A(i,n)&&(void 0!==n||e in t)||Tt(t,e,n)};var St=function(t,e,n,i){var o=!n;n||(n={});for(var r=-1,s=e.length;++r<s;){var a=e[r],c=i?i(n[a],t[a],a,n,t):void 0;void 0===c&&(c=t[a]),o?Tt(n,a,c):Pt(n,a,c)}return n};var Mt=function(t,e){for(var n=-1,i=Array(t);++n<t;)i[n]=e(n);return i};var Et=function(t){return p(t)&&"[object Arguments]"==f(t)},It=Object.prototype,Nt=It.hasOwnProperty,Ot=It.propertyIsEnumerable,Rt=Et(function(){return arguments}())?Et:function(t){return p(t)&&Nt.call(t,"callee")&&!Ot.call(t,"callee")},Dt=Array.isArray,Lt=n(4),jt=/^(?:0|[1-9]\d*)$/;var Vt=function(t,e){var n=typeof t;return!!(e=null==e?9007199254740991:e)&&("number"==n||"symbol"!=n&&jt.test(t))&&t>-1&&t%1==0&&t<e};var zt=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991},Bt={};Bt["[object Float32Array]"]=Bt["[object Float64Array]"]=Bt["[object Int8Array]"]=Bt["[object Int16Array]"]=Bt["[object Int32Array]"]=Bt["[object Uint8Array]"]=Bt["[object Uint8ClampedArray]"]=Bt["[object Uint16Array]"]=Bt["[object Uint32Array]"]=!0,Bt["[object Arguments]"]=Bt["[object Array]"]=Bt["[object ArrayBuffer]"]=Bt["[object Boolean]"]=Bt["[object DataView]"]=Bt["[object Date]"]=Bt["[object Error]"]=Bt["[object Function]"]=Bt["[object Map]"]=Bt["[object Number]"]=Bt["[object Object]"]=Bt["[object RegExp]"]=Bt["[object Set]"]=Bt["[object String]"]=Bt["[object WeakMap]"]=!1;var Ft=function(t){return p(t)&&zt(t.length)&&!!Bt[f(t)]};var Ut=function(t){return function(e){return t(e)}},Ht=n(5),qt=Ht.a&&Ht.a.isTypedArray,Wt=qt?Ut(qt):Ft,Yt=Object.prototype.hasOwnProperty;var Gt=function(t,e){var n=Dt(t),i=!n&&Rt(t),o=!n&&!i&&Object(Lt.a)(t),r=!n&&!i&&!o&&Wt(t),s=n||i||o||r,a=s?Mt(t.length,String):[],c=a.length;for(var l in t)!e&&!Yt.call(t,l)||s&&("length"==l||o&&("offset"==l||"parent"==l)||r&&("buffer"==l||"byteLength"==l||"byteOffset"==l)||Vt(l,c))||a.push(l);return a},$t=Object.prototype;var Qt=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||$t)},Kt=m(Object.keys,Object),Jt=Object.prototype.hasOwnProperty;var Zt=function(t){if(!Qt(t))return Kt(t);var e=[];for(var n in Object(t))Jt.call(t,n)&&"constructor"!=n&&e.push(n);return e};var Xt=function(t){return null!=t&&zt(t.length)&&!z(t)};var te=function(t){return Xt(t)?Gt(t):Zt(t)};var ee=function(t,e){return t&&St(e,te(e),t)};var ne=function(t){var e=[];if(null!=t)for(var n in Object(t))e.push(n);return e},ie=Object.prototype.hasOwnProperty;var oe=function(t){if(!j(t))return ne(t);var e=Qt(t),n=[];for(var i in t)("constructor"!=i||!e&&ie.call(t,i))&&n.push(i);return n};var re=function(t){return Xt(t)?Gt(t,!0):oe(t)};var se=function(t,e){return t&&St(e,re(e),t)},ae=n(8);var ce=function(t,e){var n=-1,i=t.length;for(e||(e=Array(i));++n<i;)e[n]=t[n];return e};var le=function(t,e){for(var n=-1,i=null==t?0:t.length,o=0,r=[];++n<i;){var s=t[n];e(s,n,t)&&(r[o++]=s)}return r};var de=function(){return[]},ue=Object.prototype.propertyIsEnumerable,he=Object.getOwnPropertySymbols,fe=he?function(t){return null==t?[]:(t=Object(t),le(he(t),(function(e){return ue.call(t,e)})))}:de;var me=function(t,e){return St(t,fe(t),e)};var ge=function(t,e){for(var n=-1,i=e.length,o=t.length;++n<i;)t[o+n]=e[n];return t},pe=Object.getOwnPropertySymbols?function(t){for(var e=[];t;)ge(e,fe(t)),t=g(t);return e}:de;var be=function(t,e){return St(t,pe(t),e)};var we=function(t,e,n){var i=e(t);return Dt(t)?i:ge(i,n(t))};var ke=function(t){return we(t,te,fe)};var _e=function(t){return we(t,re,pe)},ve=X(i.a,"DataView"),ye=X(i.a,"Promise"),xe=X(i.a,"Set"),Ae=X(i.a,"WeakMap"),Te=q(ve),Ce=q(tt),Pe=q(ye),Se=q(xe),Me=q(Ae),Ee=f;(ve&&"[object DataView]"!=Ee(new ve(new ArrayBuffer(1)))||tt&&"[object Map]"!=Ee(new tt)||ye&&"[object Promise]"!=Ee(ye.resolve())||xe&&"[object Set]"!=Ee(new xe)||Ae&&"[object WeakMap]"!=Ee(new Ae))&&(Ee=function(t){var e=f(t),n="[object Object]"==e?t.constructor:void 0,i=n?q(n):"";if(i)switch(i){case Te:return"[object DataView]";case Ce:return"[object Map]";case Pe:return"[object Promise]";case Se:return"[object Set]";case Me:return"[object WeakMap]"}return e});var Ie=Ee,Ne=Object.prototype.hasOwnProperty;var Oe=function(t){var e=t.length,n=new t.constructor(e);return e&&"string"==typeof t[0]&&Ne.call(t,"index")&&(n.index=t.index,n.input=t.input),n},Re=i.a.Uint8Array;var De=function(t){var e=new t.constructor(t.byteLength);return new Re(e).set(new Re(t)),e};var Le=function(t,e){var n=e?De(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.byteLength)},je=/\w*$/;var Ve=function(t){var e=new t.constructor(t.source,je.exec(t));return e.lastIndex=t.lastIndex,e},ze=o?o.prototype:void 0,Be=ze?ze.valueOf:void 0;var Fe=function(t){return Be?Object(Be.call(t)):{}};var Ue=function(t,e){var n=e?De(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.length)};var He=function(t,e,n){var i=t.constructor;switch(e){case"[object ArrayBuffer]":return De(t);case"[object Boolean]":case"[object Date]":return new i(+t);case"[object DataView]":return Le(t,n);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return Ue(t,n);case"[object Map]":return new i;case"[object Number]":case"[object String]":return new i(t);case"[object RegExp]":return Ve(t);case"[object Set]":return new i;case"[object Symbol]":return Fe(t)}},qe=Object.create,We=function(){function t(){}return function(e){if(!j(e))return{};if(qe)return qe(e);t.prototype=e;var n=new t;return t.prototype=void 0,n}}();var Ye=function(t){return"function"!=typeof t.constructor||Qt(t)?{}:We(g(t))};var Ge=function(t){return p(t)&&"[object Map]"==Ie(t)},$e=Ht.a&&Ht.a.isMap,Qe=$e?Ut($e):Ge;var Ke=function(t){return p(t)&&"[object Set]"==Ie(t)},Je=Ht.a&&Ht.a.isSet,Ze=Je?Ut(Je):Ke,Xe={};Xe["[object Arguments]"]=Xe["[object Array]"]=Xe["[object ArrayBuffer]"]=Xe["[object DataView]"]=Xe["[object Boolean]"]=Xe["[object Date]"]=Xe["[object Float32Array]"]=Xe["[object Float64Array]"]=Xe["[object Int8Array]"]=Xe["[object Int16Array]"]=Xe["[object Int32Array]"]=Xe["[object Map]"]=Xe["[object Number]"]=Xe["[object Object]"]=Xe["[object RegExp]"]=Xe["[object Set]"]=Xe["[object String]"]=Xe["[object Symbol]"]=Xe["[object Uint8Array]"]=Xe["[object Uint8ClampedArray]"]=Xe["[object Uint16Array]"]=Xe["[object Uint32Array]"]=!0,Xe["[object Error]"]=Xe["[object Function]"]=Xe["[object WeakMap]"]=!1;var tn=function t(e,n,i,o,r,s){var a,c=1&n,l=2&n,d=4&n;if(i&&(a=r?i(e,o,r,s):i(e)),void 0!==a)return a;if(!j(e))return e;var u=Dt(e);if(u){if(a=Oe(e),!c)return ce(e,a)}else{var h=Ie(e),f="[object Function]"==h||"[object GeneratorFunction]"==h;if(Object(Lt.a)(e))return Object(ae.a)(e,c);if("[object Object]"==h||"[object Arguments]"==h||f&&!r){if(a=l||f?{}:Ye(e),!c)return l?be(e,se(a,e)):me(e,ee(a,e))}else{if(!Xe[h])return r?e:{};a=He(e,h,c)}}s||(s=new yt);var m=s.get(e);if(m)return m;s.set(e,a),Ze(e)?e.forEach((function(o){a.add(t(o,n,i,o,e,s))})):Qe(e)&&e.forEach((function(o,r){a.set(r,t(o,n,i,r,e,s))}));var g=d?l?_e:ke:l?keysIn:te,p=u?void 0:g(e);return xt(p||e,(function(o,r){p&&(o=e[r=o]),Pt(a,r,t(o,n,i,r,e,s))})),a};var en=function(t,e){return tn(t,5,e="function"==typeof e?e:void 0)};var nn=function(t){return p(t)&&1===t.nodeType&&!y(t)};class on{constructor(t,e){this._config={},e&&this.define(rn(e)),t&&this._setObjectToTarget(this._config,t)}set(t,e){this._setToTarget(this._config,t,e)}define(t,e){this._setToTarget(this._config,t,e,!0)}get(t){return this._getFromSource(this._config,t)}*names(){for(const t of Object.keys(this._config))yield t}_setToTarget(t,e,n,i=!1){if(y(e))return void this._setObjectToTarget(t,e,i);const o=e.split(".");e=o.pop();for(const e of o)y(t[e])||(t[e]={}),t=t[e];if(y(n))return y(t[e])||(t[e]={}),t=t[e],void this._setObjectToTarget(t,n,i);i&&void 0!==t[e]||(t[e]=n)}_getFromSource(t,e){const n=e.split(".");e=n.pop();for(const e of n){if(!y(t[e])){t=null;break}t=t[e]}return t?rn(t[e]):void 0}_setObjectToTarget(t,e,n){Object.keys(e).forEach(i=>{this._setToTarget(t,i,e[i],n)})}}function rn(t){return en(t,sn)}function sn(t){return nn(t)?t:void 0}var an=function(){return function t(){t.called=!0}};class cn{constructor(t,e){this.source=t,this.name=e,this.path=[],this.stop=an(),this.off=an()}}const ln=new Array(256).fill().map((t,e)=>("0"+e.toString(16)).slice(-2));function dn(){const t=4294967296*Math.random()>>>0,e=4294967296*Math.random()>>>0,n=4294967296*Math.random()>>>0,i=4294967296*Math.random()>>>0;return"e"+ln[t>>0&255]+ln[t>>8&255]+ln[t>>16&255]+ln[t>>24&255]+ln[e>>0&255]+ln[e>>8&255]+ln[e>>16&255]+ln[e>>24&255]+ln[n>>0&255]+ln[n>>8&255]+ln[n>>16&255]+ln[n>>24&255]+ln[i>>0&255]+ln[i>>8&255]+ln[i>>16&255]+ln[i>>24&255]}var un={get(t){return"number"!=typeof t?this[t]||this.normal:t},highest:1e5,high:1e3,normal:0,low:-1e3,lowest:-1e5},hn=(n(6),n(0));const fn=Symbol("listeningTo"),mn=Symbol("emitterId");var gn={on(t,e,n={}){this.listenTo(this,t,e,n)},once(t,e,n){let i=!1;this.listenTo(this,t,(function(t,...n){i||(i=!0,t.off(),e.call(this,t,...n))}),n)},off(t,e){this.stopListening(this,t,e)},listenTo(t,e,n,i={}){let o,r;this[fn]||(this[fn]={});const s=this[fn];bn(t)||pn(t);const a=bn(t);(o=s[a])||(o=s[a]={emitter:t,callbacks:{}}),(r=o.callbacks[e])||(r=o.callbacks[e]=[]),r.push(n),function(t,e){const n=wn(t);if(n[e])return;let i=e,o=null;const r=[];for(;""!==i&&!n[i];)n[i]={callbacks:[],childEvents:[]},r.push(n[i]),o&&n[i].childEvents.push(o),o=i,i=i.substr(0,i.lastIndexOf(":"));if(""!==i){for(const t of r)t.callbacks=n[i].callbacks.slice();n[i].childEvents.push(o)}}(t,e);const c=kn(t,e),l=un.get(i.priority),d={callback:n,priority:l};for(const t of c){let e=!1;for(let n=0;n<t.length;n++)if(t[n].priority<l){t.splice(n,0,d),e=!0;break}e||t.push(d)}},stopListening(t,e,n){const i=this[fn];let o=t&&bn(t);const r=i&&o&&i[o],s=r&&e&&r.callbacks[e];if(!(!i||t&&!r||e&&!s))if(n)vn(t,e,n);else if(s){for(;n=s.pop();)vn(t,e,n);delete r.callbacks[e]}else if(r){for(e in r.callbacks)this.stopListening(t,e);delete i[o]}else{for(o in i)this.stopListening(i[o].emitter);delete this[fn]}},fire(t,...e){try{const n=t instanceof cn?t:new cn(this,t),i=n.name;let o=function t(e,n){let i;if(!e._events||!(i=e._events[n])||!i.callbacks.length)return n.indexOf(":")>-1?t(e,n.substr(0,n.lastIndexOf(":"))):null;return i.callbacks}(this,i);if(n.path.push(this),o){const t=[n,...e];o=Array.from(o);for(let e=0;e<o.length&&(o[e].callback.apply(this,t),n.off.called&&(delete n.off.called,vn(this,i,o[e].callback)),!n.stop.called);e++);}if(this._delegations){const t=this._delegations.get(i),o=this._delegations.get("*");t&&_n(t,n,e),o&&_n(o,n,e)}return n.return}catch(t){hn.b.rethrowUnexpectedError(t,this)}},delegate(...t){return{to:(e,n)=>{this._delegations||(this._delegations=new Map),t.forEach(t=>{const i=this._delegations.get(t);i?i.set(e,n):this._delegations.set(t,new Map([[e,n]]))})}}},stopDelegating(t,e){if(this._delegations)if(t)if(e){const n=this._delegations.get(t);n&&n.delete(e)}else this._delegations.delete(t);else this._delegations.clear()}};function pn(t,e){t[mn]||(t[mn]=e||dn())}function bn(t){return t[mn]}function wn(t){return t._events||Object.defineProperty(t,"_events",{value:{}}),t._events}function kn(t,e){const n=wn(t)[e];if(!n)return[];let i=[n.callbacks];for(let e=0;e<n.childEvents.length;e++){const o=kn(t,n.childEvents[e]);i=i.concat(o)}return i}function _n(t,e,n){for(let[i,o]of t){o?"function"==typeof o&&(o=o(e.name)):o=e.name;const t=new cn(e.source,o);t.path=[...e.path],i.fire(t,...n)}}function vn(t,e,n){const i=kn(t,e);for(const t of i)for(let e=0;e<t.length;e++)t[e].callback==n&&(t.splice(e,1),e--)}function yn(t){return!(!t||!t[Symbol.iterator])}function xn(t,...e){e.forEach(e=>{Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e)).forEach(n=>{if(n in t.prototype)return;const i=Object.getOwnPropertyDescriptor(e,n);i.enumerable=!1,Object.defineProperty(t.prototype,n,i)})})}class An{constructor(t={},e={}){const n=yn(t);if(n||(e=t),this._items=[],this._itemMap=new Map,this._idProperty=e.idProperty||"id",this._bindToExternalToInternalMap=new WeakMap,this._bindToInternalToExternalMap=new WeakMap,this._skippedIndexesFromExternal=[],n)for(const e of t)this._items.push(e),this._itemMap.set(this._getItemIdBeforeAdding(e),e)}get length(){return this._items.length}get first(){return this._items[0]||null}get last(){return this._items[this.length-1]||null}add(t,e){const n=this._getItemIdBeforeAdding(t);if(void 0===e)e=this._items.length;else if(e>this._items.length||e<0)throw new hn.b("collection-add-item-invalid-index",this);return this._items.splice(e,0,t),this._itemMap.set(n,t),this.fire("add",t,e),this}get(t){let e;if("string"==typeof t)e=this._itemMap.get(t);else{if("number"!=typeof t)throw new hn.b("collection-get-invalid-arg: Index or id must be given.",this);e=this._items[t]}return e||null}has(t){if("string"==typeof t)return this._itemMap.has(t);{const e=t[this._idProperty];return this._itemMap.has(e)}}getIndex(t){let e;return e="string"==typeof t?this._itemMap.get(t):t,this._items.indexOf(e)}remove(t){let e,n,i,o=!1;const r=this._idProperty;if("string"==typeof t?(n=t,i=this._itemMap.get(n),o=!i,i&&(e=this._items.indexOf(i))):"number"==typeof t?(e=t,i=this._items[e],o=!i,i&&(n=i[r])):(i=t,n=i[r],e=this._items.indexOf(i),o=-1==e||!this._itemMap.get(n)),o)throw new hn.b("collection-remove-404: Item not found.",this);this._items.splice(e,1),this._itemMap.delete(n);const s=this._bindToInternalToExternalMap.get(i);return this._bindToInternalToExternalMap.delete(i),this._bindToExternalToInternalMap.delete(s),this.fire("remove",i,e),i}map(t,e){return this._items.map(t,e)}find(t,e){return this._items.find(t,e)}filter(t,e){return this._items.filter(t,e)}clear(){for(this._bindToCollection&&(this.stopListening(this._bindToCollection),this._bindToCollection=null);this.length;)this.remove(0)}bindTo(t){if(this._bindToCollection)throw new hn.b("collection-bind-to-rebind: The collection cannot be bound more than once.",this);return this._bindToCollection=t,{as:t=>{this._setUpBindToBinding(e=>new t(e))},using:t=>{"function"==typeof t?this._setUpBindToBinding(e=>t(e)):this._setUpBindToBinding(e=>e[t])}}}_setUpBindToBinding(t){const e=this._bindToCollection,n=(n,i,o)=>{const r=e._bindToCollection==this,s=e._bindToInternalToExternalMap.get(i);if(r&&s)this._bindToExternalToInternalMap.set(i,s),this._bindToInternalToExternalMap.set(s,i);else{const n=t(i);if(!n)return void this._skippedIndexesFromExternal.push(o);let r=o;for(const t of this._skippedIndexesFromExternal)o>t&&r--;for(const t of e._skippedIndexesFromExternal)r>=t&&r++;this._bindToExternalToInternalMap.set(i,n),this._bindToInternalToExternalMap.set(n,i),this.add(n,r);for(let t=0;t<e._skippedIndexesFromExternal.length;t++)r<=e._skippedIndexesFromExternal[t]&&e._skippedIndexesFromExternal[t]++}};for(const t of e)n(0,t,e.getIndex(t));this.listenTo(e,"add",n),this.listenTo(e,"remove",(t,e,n)=>{const i=this._bindToExternalToInternalMap.get(e);i&&this.remove(i),this._skippedIndexesFromExternal=this._skippedIndexesFromExternal.reduce((t,e)=>(n<e&&t.push(e-1),n>e&&t.push(e),t),[])})}_getItemIdBeforeAdding(t){const e=this._idProperty;let n;if(e in t){if(n=t[e],"string"!=typeof n)throw new hn.b("collection-add-invalid-id",this);if(this.get(n))throw new hn.b("collection-add-item-already-exists",this)}else t[e]=n=dn();return n}[Symbol.iterator](){return this._items[Symbol.iterator]()}}xn(An,gn);class Tn{constructor(t,e=[],n=[]){this._context=t,this._plugins=new Map,this._availablePlugins=new Map;for(const t of e)t.pluginName&&this._availablePlugins.set(t.pluginName,t);this._contextPlugins=new Map;for(const[t,e]of n)this._contextPlugins.set(t,e),this._contextPlugins.set(e,t),t.pluginName&&this._availablePlugins.set(t.pluginName,t)}*[Symbol.iterator](){for(const t of this._plugins)"function"==typeof t[0]&&(yield t)}get(t){const e=this._plugins.get(t);if(!e){const e="plugincollection-plugin-not-loaded: The requested plugin is not loaded.";let n=t;throw"function"==typeof t&&(n=t.pluginName||t.name),new hn.b(e,this._context,{plugin:n})}return e}has(t){return this._plugins.has(t)}init(t,e=[]){const n=this,i=this._context,o=new Set,r=[],s=h(t),a=h(e),c=function(t){const e=[];for(const n of t)u(n)||e.push(n);return e.length?e:null}(t);if(c){const t="plugincollection-plugin-not-found: Some plugins are not available and could not be loaded.";return console.error(Object(hn.a)(t),{plugins:c}),Promise.reject(new hn.b(t,i,{plugins:c}))}return Promise.all(s.map(l)).then(()=>d(r,"init")).then(()=>d(r,"afterInit")).then(()=>r);function l(t){if(!a.includes(t)&&!n._plugins.has(t)&&!o.has(t))return function(t){return new Promise(s=>{o.add(t),t.requires&&t.requires.forEach(n=>{const o=u(n);if(t.isContextPlugin&&!o.isContextPlugin)throw new hn.b("plugincollection-context-required: Context plugin can not require plugin which is not a context plugin",null,{plugin:o.name,requiredBy:t.name});if(e.includes(o))throw new hn.b("plugincollection-required: Cannot load a plugin because one of its dependencies is listed inthe `removePlugins` option.",i,{plugin:o.name,requiredBy:t.name});l(o)});const a=n._contextPlugins.get(t)||new t(i);n._add(t,a),r.push(a),s()})}(t).catch(e=>{throw console.error(Object(hn.a)("plugincollection-load: It was not possible to load the plugin."),{plugin:t}),e})}function d(t,e){return t.reduce((t,i)=>i[e]?n._contextPlugins.has(i)?t:t.then(i[e].bind(i)):t,Promise.resolve())}function u(t){return"function"==typeof t?t:n._availablePlugins.get(t)}function h(t){return t.map(t=>u(t)).filter(t=>!!t)}}destroy(){const t=[];for(const[,e]of this)"function"!=typeof e.destroy||this._contextPlugins.has(e)||t.push(e.destroy());return Promise.all(t)}_add(t,e){this._plugins.set(t,e);const n=t.pluginName;if(n){if(this._plugins.has(n))throw new hn.b("plugincollection-plugin-name-conflict: Two plugins with the same name were loaded.",null,{pluginName:n,plugin1:this._plugins.get(n).constructor,plugin2:t});this._plugins.set(n,e)}}}function Cn(t,e,n=1){if("number"!=typeof n)throw new hn.b("translation-service-quantity-not-a-number: Expecting `quantity` to be a number.",null,{quantity:n});const i=Object.keys(window.CKEDITOR_TRANSLATIONS).length;1===i&&(t=Object.keys(window.CKEDITOR_TRANSLATIONS)[0]);const o=e.id||e.string;if(0===i||!function(t,e){return!!window.CKEDITOR_TRANSLATIONS[t]&&!!window.CKEDITOR_TRANSLATIONS[t].dictionary[e]}(t,o))return 1!==n?e.plural:e.string;const r=window.CKEDITOR_TRANSLATIONS[t].dictionary,s=window.CKEDITOR_TRANSLATIONS[t].getPluralForm||(t=>1===t?0:1);if("string"==typeof r[o])return r[o];const a=Number(s(n));return r[o][a]}xn(Tn,gn),window.CKEDITOR_TRANSLATIONS||(window.CKEDITOR_TRANSLATIONS={});const Pn=["ar","fa","he","ku","ug"];class Sn{constructor(t={}){this.uiLanguage=t.uiLanguage||"en",this.contentLanguage=t.contentLanguage||this.uiLanguage,this.uiLanguageDirection=Mn(this.uiLanguage),this.contentLanguageDirection=Mn(this.contentLanguage),this.t=(t,e)=>this._t(t,e)}get language(){return console.warn("locale-deprecated-language-property: The Locale#language property has been deprecated and will be removed in the near future. Please use #uiLanguage and #contentLanguage properties instead."),this.uiLanguage}_t(t,e=[]){Array.isArray(e)||(e=[e]),"string"==typeof t&&(t={string:t});const n=!!t.plural?e[0]:1;return function(t,e){return t.replace(/%(\d+)/g,(t,n)=>n<e.length?e[n]:t)}(Cn(this.uiLanguage,t,n),e)}}function Mn(t){return Pn.includes(t)?"rtl":"ltr"}class En{constructor(t){this.config=new on(t,this.constructor.defaultConfig);const e=this.constructor.builtinPlugins;this.config.define("plugins",e),this.plugins=new Tn(this,e);const n=this.config.get("language")||{};this.locale=new Sn({uiLanguage:"string"==typeof n?n:n.ui,contentLanguage:this.config.get("language.content")}),this.t=this.locale.t,this.editors=new An,this._contextOwner=null}initPlugins(){const t=this.config.get("plugins")||[];for(const e of t){if("function"!=typeof e)throw new hn.b("context-initplugins-constructor-only: Only a constructor function is allowed as a context plugin.",null,{Plugin:e});if(!0!==e.isContextPlugin)throw new hn.b("context-initplugins-invalid-plugin: Only a plugin marked as a context plugin is allowed to be used with a context.",null,{Plugin:e})}return this.plugins.init(t)}destroy(){return Promise.all(Array.from(this.editors,t=>t.destroy())).then(()=>this.plugins.destroy())}_addEditor(t,e){if(this._contextOwner)throw new hn.b("context-addEditor-private-context: Cannot add multiple editors to the context which is created by the editor.");this.editors.add(t),e&&(this._contextOwner=t)}_removeEditor(t){return this.editors.has(t)&&this.editors.remove(t),this._contextOwner===t?this.destroy():Promise.resolve()}_getEditorConfig(){const t={};for(const e of this.config.names())["plugins","removePlugins","extraPlugins"].includes(e)||(t[e]=this.config.get(e));return t}static create(t){return new Promise(e=>{const n=new this(t);e(n.initPlugins().then(()=>n))})}}function In(t,e){const n=Math.min(t.length,e.length);for(let i=0;i<n;i++)if(t[i]!=e[i])return i;return t.length==e.length?"same":t.length<e.length?"prefix":"extension"}var Nn=function(t){return tn(t,4)};class On{constructor(t){this.document=t,this.parent=null}get index(){let t;if(!this.parent)return null;if(-1==(t=this.parent.getChildIndex(this)))throw new hn.b("view-node-not-found-in-parent: The node's parent does not contain this node.",this);return t}get nextSibling(){const t=this.index;return null!==t&&this.parent.getChild(t+1)||null}get previousSibling(){const t=this.index;return null!==t&&this.parent.getChild(t-1)||null}get root(){let t=this;for(;t.parent;)t=t.parent;return t}isAttached(){return this.root.is("rootElement")}getPath(){const t=[];let e=this;for(;e.parent;)t.unshift(e.index),e=e.parent;return t}getAncestors(t={includeSelf:!1,parentFirst:!1}){const e=[];let n=t.includeSelf?this:this.parent;for(;n;)e[t.parentFirst?"push":"unshift"](n),n=n.parent;return e}getCommonAncestor(t,e={}){const n=this.getAncestors(e),i=t.getAncestors(e);let o=0;for(;n[o]==i[o]&&n[o];)o++;return 0===o?null:n[o-1]}isBefore(t){if(this==t)return!1;if(this.root!==t.root)return!1;const e=this.getPath(),n=t.getPath(),i=In(e,n);switch(i){case"prefix":return!0;case"extension":return!1;default:return e[i]<n[i]}}isAfter(t){return this!=t&&(this.root===t.root&&!this.isBefore(t))}_remove(){this.parent._removeChildren(this.index)}_fireChange(t,e){this.fire("change:"+t,e),this.parent&&this.parent._fireChange(t,e)}toJSON(){const t=Nn(this);return delete t.parent,t}is(t){return"node"===t||"view:node"===t}}xn(On,gn);class Rn extends On{constructor(t,e){super(t),this._textData=e}is(t){return"text"===t||"view:text"===t||"node"===t||"view:node"===t}get data(){return this._textData}get _data(){return this.data}set _data(t){this._fireChange("text",this),this._textData=t}isSimilar(t){return t instanceof Rn&&(this===t||this.data===t.data)}_clone(){return new Rn(this.document,this.data)}}class Dn{constructor(t,e,n){if(this.textNode=t,e<0||e>t.data.length)throw new hn.b("view-textproxy-wrong-offsetintext: Given offsetInText value is incorrect.",this);if(n<0||e+n>t.data.length)throw new hn.b("view-textproxy-wrong-length: Given length value is incorrect.",this);this.data=t.data.substring(e,e+n),this.offsetInText=e}get offsetSize(){return this.data.length}get isPartial(){return this.data.length!==this.textNode.data.length}get parent(){return this.textNode.parent}get root(){return this.textNode.root}get document(){return this.textNode.document}is(t){return"textProxy"===t||"view:textProxy"===t}getAncestors(t={includeSelf:!1,parentFirst:!1}){const e=[];let n=t.includeSelf?this.textNode:this.parent;for(;null!==n;)e[t.parentFirst?"push":"unshift"](n),n=n.parent;return e}}function Ln(t){return yn(t)?new Map(t):function(t){const e=new Map;for(const n in t)e.set(n,t[n]);return e}(t)}class jn{constructor(...t){this._patterns=[],this.add(...t)}add(...t){for(let e of t)("string"==typeof e||e instanceof RegExp)&&(e={name:e}),e.classes&&("string"==typeof e.classes||e.classes instanceof RegExp)&&(e.classes=[e.classes]),this._patterns.push(e)}match(...t){for(const e of t)for(const t of this._patterns){const n=Vn(e,t);if(n)return{element:e,pattern:t,match:n}}return null}matchAll(...t){const e=[];for(const n of t)for(const t of this._patterns){const i=Vn(n,t);i&&e.push({element:n,pattern:t,match:i})}return e.length>0?e:null}getElementName(){if(1!==this._patterns.length)return null;const t=this._patterns[0],e=t.name;return"function"==typeof t||!e||e instanceof RegExp?null:e}}function Vn(t,e){if("function"==typeof e)return e(t);const n={};return e.name&&(n.name=function(t,e){if(t instanceof RegExp)return t.test(e);return t===e}(e.name,t.name),!n.name)||e.attributes&&(n.attributes=function(t,e){const n=[];for(const i in t){const o=t[i];if(!e.hasAttribute(i))return null;{const t=e.getAttribute(i);if(!0===o)n.push(i);else if(o instanceof RegExp){if(!o.test(t))return null;n.push(i)}else{if(t!==o)return null;n.push(i)}}}return n}(e.attributes,t),!n.attributes)?null:!(e.classes&&(n.classes=function(t,e){const n=[];for(const i of t)if(i instanceof RegExp){const t=e.getClassNames();for(const e of t)i.test(e)&&n.push(e);if(0===n.length)return null}else{if(!e.hasClass(i))return null;n.push(i)}return n}(e.classes,t),!n.classes))&&(!(e.styles&&(n.styles=function(t,e){const n=[];for(const i in t){const o=t[i];if(!e.hasStyle(i))return null;{const t=e.getStyle(i);if(o instanceof RegExp){if(!o.test(t))return null;n.push(i)}else{if(t!==o)return null;n.push(i)}}}return n}(e.styles,t),!n.styles))&&n)}var zn=function(t){return"symbol"==typeof t||p(t)&&"[object Symbol]"==f(t)},Bn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Fn=/^\w*$/;var Un=function(t,e){if(Dt(t))return!1;var n=typeof t;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!zn(t))||(Fn.test(t)||!Bn.test(t)||null!=e&&t in Object(e))};function Hn(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError("Expected a function");var n=function(){var i=arguments,o=e?e.apply(this,i):i[0],r=n.cache;if(r.has(o))return r.get(o);var s=t.apply(this,i);return n.cache=r.set(o,s)||r,s};return n.cache=new(Hn.Cache||kt),n}Hn.Cache=kt;var qn=Hn;var Wn=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Yn=/\\(\\)?/g,Gn=function(t){var e=qn(t,(function(t){return 500===n.size&&n.clear(),t})),n=e.cache;return e}((function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(Wn,(function(t,n,i,o){e.push(i?o.replace(Yn,"$1"):n||t)})),e}));var $n=function(t,e){for(var n=-1,i=null==t?0:t.length,o=Array(i);++n<i;)o[n]=e(t[n],n,t);return o},Qn=o?o.prototype:void 0,Kn=Qn?Qn.toString:void 0;var Jn=function t(e){if("string"==typeof e)return e;if(Dt(e))return $n(e,t)+"";if(zn(e))return Kn?Kn.call(e):"";var n=e+"";return"0"==n&&1/e==-1/0?"-0":n};var Zn=function(t){return null==t?"":Jn(t)};var Xn=function(t,e){return Dt(t)?t:Un(t,e)?[t]:Gn(Zn(t))};var ti=function(t){var e=null==t?0:t.length;return e?t[e-1]:void 0};var ei=function(t){if("string"==typeof t||zn(t))return t;var e=t+"";return"0"==e&&1/t==-1/0?"-0":e};var ni=function(t,e){for(var n=0,i=(e=Xn(e,t)).length;null!=t&&n<i;)t=t[ei(e[n++])];return n&&n==i?t:void 0};var ii=function(t,e,n){var i=-1,o=t.length;e<0&&(e=-e>o?0:o+e),(n=n>o?o:n)<0&&(n+=o),o=e>n?0:n-e>>>0,e>>>=0;for(var r=Array(o);++i<o;)r[i]=t[i+e];return r};var oi=function(t,e){return e.length<2?t:ni(t,ii(e,0,-1))};var ri=function(t,e){return e=Xn(e,t),null==(t=oi(t,e))||delete t[ei(ti(e))]};var si=function(t,e){return null==t||ri(t,e)};var ai=function(t,e,n){var i=null==t?void 0:ni(t,e);return void 0===i?n:i};var ci=function(t,e,n){(void 0!==n&&!A(t[e],n)||void 0===n&&!(e in t))&&Tt(t,e,n)};var li=function(t){return function(e,n,i){for(var o=-1,r=Object(e),s=i(e),a=s.length;a--;){var c=s[t?a:++o];if(!1===n(r[c],c,r))break}return e}}();var di=function(t){return p(t)&&Xt(t)};var ui=function(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]};var hi=function(t){return St(t,re(t))};var fi=function(t,e,n,i,o,r,s){var a=ui(t,n),c=ui(e,n),l=s.get(c);if(l)ci(t,n,l);else{var d=r?r(a,c,n+"",t,e,s):void 0,u=void 0===d;if(u){var h=Dt(c),f=!h&&Object(Lt.a)(c),m=!h&&!f&&Wt(c);d=c,h||f||m?Dt(a)?d=a:di(a)?d=ce(a):f?(u=!1,d=Object(ae.a)(c,!0)):m?(u=!1,d=Ue(c,!0)):d=[]:y(c)||Rt(c)?(d=a,Rt(a)?d=hi(a):j(a)&&!z(a)||(d=Ye(c))):u=!1}u&&(s.set(c,d),o(d,c,i,r,s),s.delete(c)),ci(t,n,d)}};var mi=function t(e,n,i,o,r){e!==n&&li(n,(function(s,a){if(r||(r=new yt),j(s))fi(e,n,a,i,t,o,r);else{var c=o?o(ui(e,a),s,a+"",e,n,r):void 0;void 0===c&&(c=s),ci(e,a,c)}}),re)};var gi=function(t){return t};var pi=function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)},bi=Math.max;var wi=function(t,e,n){return e=bi(void 0===e?t.length-1:e,0),function(){for(var i=arguments,o=-1,r=bi(i.length-e,0),s=Array(r);++o<r;)s[o]=i[e+o];o=-1;for(var a=Array(e+1);++o<e;)a[o]=i[o];return a[e]=n(s),pi(t,this,a)}};var ki=function(t){return function(){return t}},_i=At?function(t,e){return At(t,"toString",{configurable:!0,enumerable:!1,value:ki(e),writable:!0})}:gi,vi=Date.now;var yi=function(t){var e=0,n=0;return function(){var i=vi(),o=16-(i-n);if(n=i,o>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}(_i);var xi=function(t,e){return yi(wi(t,e,gi),t+"")};var Ai=function(t,e,n){if(!j(n))return!1;var i=typeof e;return!!("number"==i?Xt(n)&&Vt(e,n.length):"string"==i&&e in n)&&A(n[e],t)};var Ti=function(t){return xi((function(e,n){var i=-1,o=n.length,r=o>1?n[o-1]:void 0,s=o>2?n[2]:void 0;for(r=t.length>3&&"function"==typeof r?(o--,r):void 0,s&&Ai(n[0],n[1],s)&&(r=o<3?void 0:r,o=1),e=Object(e);++i<o;){var a=n[i];a&&t(e,a,i,r)}return e}))},Ci=Ti((function(t,e,n){mi(t,e,n)}));var Pi=function(t,e,n,i){if(!j(t))return t;for(var o=-1,r=(e=Xn(e,t)).length,s=r-1,a=t;null!=a&&++o<r;){var c=ei(e[o]),l=n;if(o!=s){var d=a[c];void 0===(l=i?i(d,c,a):void 0)&&(l=j(d)?d:Vt(e[o+1])?[]:{})}Pt(a,c,l),a=a[c]}return t};var Si=function(t,e,n){return null==t?t:Pi(t,e,n)};class Mi{constructor(t){this._styles={},this._styleProcessor=t}get isEmpty(){const t=Object.entries(this._styles);return!Array.from(t).length}get size(){return this.isEmpty?0:this.getStyleNames().length}setTo(t){this.clear();const e=Array.from(function(t){let e=null,n=0,i=0,o=null;const r=new Map;if(""===t)return r;";"!=t.charAt(t.length-1)&&(t+=";");for(let s=0;s<t.length;s++){const a=t.charAt(s);if(null===e)switch(a){case":":o||(o=t.substr(n,s-n),i=s+1);break;case'"':case"'":e=a;break;case";":{const e=t.substr(i,s-i);o&&r.set(o.trim(),e.trim()),o=null,n=s+1;break}}else a===e&&(e=null)}return r}(t).entries());for(const[t,n]of e)this._styleProcessor.toNormalizedForm(t,n,this._styles)}has(t){if(this.isEmpty)return!1;const e=this._styleProcessor.getReducedForm(t,this._styles).find(([e])=>e===t);return Array.isArray(e)}set(t,e){if(j(t))for(const[e,n]of Object.entries(t))this._styleProcessor.toNormalizedForm(e,n,this._styles);else this._styleProcessor.toNormalizedForm(t,e,this._styles)}remove(t){const e=Ii(t);si(this._styles,e),delete this._styles[t],this._cleanEmptyObjectsOnPath(e)}getNormalized(t){return this._styleProcessor.getNormalized(t,this._styles)}toString(){return this.isEmpty?"":this._getStylesEntries().map(t=>t.join(":")).sort().join(";")+";"}getAsString(t){if(this.isEmpty)return;if(this._styles[t]&&!j(this._styles[t]))return this._styles[t];const e=this._styleProcessor.getReducedForm(t,this._styles).find(([e])=>e===t);return Array.isArray(e)?e[1]:void 0}getStyleNames(){if(this.isEmpty)return[];return this._getStylesEntries().map(([t])=>t)}clear(){this._styles={}}_getStylesEntries(){const t=[],e=Object.keys(this._styles);for(const n of e)t.push(...this._styleProcessor.getReducedForm(n,this._styles));return t}_cleanEmptyObjectsOnPath(t){const e=t.split(".");if(!(e.length>1))return;const n=e.splice(0,e.length-1).join("."),i=ai(this._styles,n);i&&!Array.from(Object.keys(i)).length&&this.remove(n)}}class Ei{constructor(){this._normalizers=new Map,this._extractors=new Map,this._reducers=new Map,this._consumables=new Map}toNormalizedForm(t,e,n){if(j(e))Ni(n,Ii(t),e);else if(this._normalizers.has(t)){const i=this._normalizers.get(t),{path:o,value:r}=i(e);Ni(n,o,r)}else Ni(n,t,e)}getNormalized(t,e){if(!t)return Ci({},e);if(void 0!==e[t])return e[t];if(this._extractors.has(t)){const n=this._extractors.get(t);if("string"==typeof n)return ai(e,n);const i=n(t,e);if(i)return i}return ai(e,Ii(t))}getReducedForm(t,e){const n=this.getNormalized(t,e);if(void 0===n)return[];if(this._reducers.has(t)){return this._reducers.get(t)(n)}return[[t,n]]}getRelatedStyles(t){return this._consumables.get(t)||[]}setNormalizer(t,e){this._normalizers.set(t,e)}setExtractor(t,e){this._extractors.set(t,e)}setReducer(t,e){this._reducers.set(t,e)}setStyleRelation(t,e){this._mapStyleNames(t,e);for(const n of e)this._mapStyleNames(n,[t])}_mapStyleNames(t,e){this._consumables.has(t)||this._consumables.set(t,[]),this._consumables.get(t).push(...e)}}function Ii(t){return t.replace("-",".")}function Ni(t,e,n){let i=n;j(n)&&(i=Ci({},ai(t,e),n)),Si(t,e,i)}class Oi extends On{constructor(t,e,n,i){if(super(t),this.name=e,this._attrs=function(t){t=Ln(t);for(const[e,n]of t)null===n?t.delete(e):"string"!=typeof n&&t.set(e,String(n));return t}(n),this._children=[],i&&this._insertChild(0,i),this._classes=new Set,this._attrs.has("class")){const t=this._attrs.get("class");Ri(this._classes,t),this._attrs.delete("class")}this._styles=new Mi(this.document.stylesProcessor),this._attrs.has("style")&&(this._styles.setTo(this._attrs.get("style")),this._attrs.delete("style")),this._customProperties=new Map}get childCount(){return this._children.length}get isEmpty(){return 0===this._children.length}is(t,e=null){return e?e===this.name&&("element"===t||"view:element"===t):t===this.name||t==="view:"+this.name||"element"===t||"view:element"===t||"node"===t||"view:node"===t}getChild(t){return this._children[t]}getChildIndex(t){return this._children.indexOf(t)}getChildren(){return this._children[Symbol.iterator]()}*getAttributeKeys(){this._classes.size>0&&(yield"class"),this._styles.isEmpty||(yield"style"),yield*this._attrs.keys()}*getAttributes(){yield*this._attrs.entries(),this._classes.size>0&&(yield["class",this.getAttribute("class")]),this._styles.isEmpty||(yield["style",this.getAttribute("style")])}getAttribute(t){if("class"==t)return this._classes.size>0?[...this._classes].join(" "):void 0;if("style"==t){const t=this._styles.toString();return""==t?void 0:t}return this._attrs.get(t)}hasAttribute(t){return"class"==t?this._classes.size>0:"style"==t?!this._styles.isEmpty:this._attrs.has(t)}isSimilar(t){if(!(t instanceof Oi))return!1;if(this===t)return!0;if(this.name!=t.name)return!1;if(this._attrs.size!==t._attrs.size||this._classes.size!==t._classes.size||this._styles.size!==t._styles.size)return!1;for(const[e,n]of this._attrs)if(!t._attrs.has(e)||t._attrs.get(e)!==n)return!1;for(const e of this._classes)if(!t._classes.has(e))return!1;for(const e of this._styles.getStyleNames())if(!t._styles.has(e)||t._styles.getAsString(e)!==this._styles.getAsString(e))return!1;return!0}hasClass(...t){for(const e of t)if(!this._classes.has(e))return!1;return!0}getClassNames(){return this._classes.keys()}getStyle(t){return this._styles.getAsString(t)}getNormalizedStyle(t){return this._styles.getNormalized(t)}getStyleNames(){return this._styles.getStyleNames()}hasStyle(...t){for(const e of t)if(!this._styles.has(e))return!1;return!0}findAncestor(...t){const e=new jn(...t);let n=this.parent;for(;n;){if(e.match(n))return n;n=n.parent}return null}getCustomProperty(t){return this._customProperties.get(t)}*getCustomProperties(){yield*this._customProperties.entries()}getIdentity(){const t=Array.from(this._classes).sort().join(","),e=this._styles.toString(),n=Array.from(this._attrs).map(t=>`${t[0]}="${t[1]}"`).sort().join(" ");return this.name+(""==t?"":` class="${t}"`)+(e?` style="${e}"`:"")+(""==n?"":" "+n)}_clone(t=!1){const e=[];if(t)for(const n of this.getChildren())e.push(n._clone(t));const n=new this.constructor(this.document,this.name,this._attrs,e);return n._classes=new Set(this._classes),n._styles.set(this._styles.getNormalized()),n._customProperties=new Map(this._customProperties),n.getFillerOffset=this.getFillerOffset,n}_appendChild(t){return this._insertChild(this.childCount,t)}_insertChild(t,e){this._fireChange("children",this);let n=0;const i=function(t,e){if("string"==typeof e)return[new Rn(t,e)];yn(e)||(e=[e]);return Array.from(e).map(e=>"string"==typeof e?new Rn(t,e):e instanceof Dn?new Rn(t,e.data):e)}(this.document,e);for(const e of i)null!==e.parent&&e._remove(),e.parent=this,e.document=this.document,this._children.splice(t,0,e),t++,n++;return n}_removeChildren(t,e=1){this._fireChange("children",this);for(let n=t;n<t+e;n++)this._children[n].parent=null;return this._children.splice(t,e)}_setAttribute(t,e){e=String(e),this._fireChange("attributes",this),"class"==t?Ri(this._classes,e):"style"==t?this._styles.setTo(e):this._attrs.set(t,e)}_removeAttribute(t){return this._fireChange("attributes",this),"class"==t?this._classes.size>0&&(this._classes.clear(),!0):"style"==t?!this._styles.isEmpty&&(this._styles.clear(),!0):this._attrs.delete(t)}_addClass(t){this._fireChange("attributes",this),(t=Array.isArray(t)?t:[t]).forEach(t=>this._classes.add(t))}_removeClass(t){this._fireChange("attributes",this),(t=Array.isArray(t)?t:[t]).forEach(t=>this._classes.delete(t))}_setStyle(t,e){this._fireChange("attributes",this),this._styles.set(t,e)}_removeStyle(t){this._fireChange("attributes",this),(t=Array.isArray(t)?t:[t]).forEach(t=>this._styles.remove(t))}_setCustomProperty(t,e){this._customProperties.set(t,e)}_removeCustomProperty(t){return this._customProperties.delete(t)}}function Ri(t,e){const n=e.split(/\s+/);t.clear(),n.forEach(e=>t.add(e))}class Di extends Oi{constructor(t,e,n,i){super(t,e,n,i),this.getFillerOffset=Li}is(t,e=null){return e?e===this.name&&("containerElement"===t||"view:containerElement"===t||"element"===t||"view:element"===t):"containerElement"===t||"view:containerElement"===t||t===this.name||t==="view:"+this.name||"element"===t||"view:element"===t||"node"===t||"view:node"===t}}function Li(){const t=[...this.getChildren()],e=t[this.childCount-1];if(e&&e.is("element","br"))return this.childCount;for(const e of t)if(!e.is("uiElement"))return null;return this.childCount}var ji=Ti((function(t,e){St(e,re(e),t)}));const Vi=Symbol("observableProperties"),zi=Symbol("boundObservables"),Bi=Symbol("boundProperties"),Fi={set(t,e){if(j(t))return void Object.keys(t).forEach(e=>{this.set(e,t[e])},this);Hi(this);const n=this[Vi];if(t in this&&!n.has(t))throw new hn.b("observable-set-cannot-override: Cannot override an existing property.",this);Object.defineProperty(this,t,{enumerable:!0,configurable:!0,get:()=>n.get(t),set(e){const i=n.get(t);let o=this.fire("set:"+t,t,e,i);void 0===o&&(o=e),i===o&&n.has(t)||(n.set(t,o),this.fire("change:"+t,t,o,i))}}),this[t]=e},bind(...t){if(!t.length||!Yi(t))throw new hn.b("observable-bind-wrong-properties: All properties must be strings.",this);if(new Set(t).size!==t.length)throw new hn.b("observable-bind-duplicate-properties: Properties must be unique.",this);Hi(this);const e=this[Bi];t.forEach(t=>{if(e.has(t))throw new hn.b("observable-bind-rebind: Cannot bind the same property more than once.",this)});const n=new Map;return t.forEach(t=>{const i={property:t,to:[]};e.set(t,i),n.set(t,i)}),{to:qi,toMany:Wi,_observable:this,_bindProperties:t,_to:[],_bindings:n}},unbind(...t){if(!this[Vi])return;const e=this[Bi],n=this[zi];if(t.length){if(!Yi(t))throw new hn.b("observable-unbind-wrong-properties: Properties must be strings.",this);t.forEach(t=>{const i=e.get(t);if(!i)return;let o,r,s,a;i.to.forEach(t=>{o=t[0],r=t[1],s=n.get(o),a=s[r],a.delete(i),a.size||delete s[r],Object.keys(s).length||(n.delete(o),this.stopListening(o,"change"))}),e.delete(t)})}else n.forEach((t,e)=>{this.stopListening(e,"change")}),n.clear(),e.clear()},decorate(t){const e=this[t];if(!e)throw new hn.b("observablemixin-cannot-decorate-undefined: Cannot decorate an undefined method.",this,{object:this,methodName:t});this.on(t,(t,n)=>{t.return=e.apply(this,n)}),this[t]=function(...e){return this.fire(t,e)}}};ji(Fi,gn);var Ui=Fi;function Hi(t){t[Vi]||(Object.defineProperty(t,Vi,{value:new Map}),Object.defineProperty(t,zi,{value:new Map}),Object.defineProperty(t,Bi,{value:new Map}))}function qi(...t){const e=function(...t){if(!t.length)throw new hn.b("observable-bind-to-parse-error: Invalid argument syntax in `to()`.",null);const e={to:[]};let n;"function"==typeof t[t.length-1]&&(e.callback=t.pop());return t.forEach(t=>{if("string"==typeof t)n.properties.push(t);else{if("object"!=typeof t)throw new hn.b("observable-bind-to-parse-error: Invalid argument syntax in `to()`.",null);n={observable:t,properties:[]},e.to.push(n)}}),e}(...t),n=Array.from(this._bindings.keys()),i=n.length;if(!e.callback&&e.to.length>1)throw new hn.b("observable-bind-to-no-callback: Binding multiple observables only possible with callback.",this);if(i>1&&e.callback)throw new hn.b("observable-bind-to-extra-callback: Cannot bind multiple properties and use a callback in one binding.",this);var o;e.to.forEach(t=>{if(t.properties.length&&t.properties.length!==i)throw new hn.b("observable-bind-to-properties-length: The number of properties must match.",this);t.properties.length||(t.properties=this._bindProperties)}),this._to=e.to,e.callback&&(this._bindings.get(n[0]).callback=e.callback),o=this._observable,this._to.forEach(t=>{const e=o[zi];let n;e.get(t.observable)||o.listenTo(t.observable,"change",(i,r)=>{n=e.get(t.observable)[r],n&&n.forEach(t=>{Gi(o,t.property)})})}),function(t){let e;t._bindings.forEach((n,i)=>{t._to.forEach(o=>{e=o.properties[n.callback?0:t._bindProperties.indexOf(i)],n.to.push([o.observable,e]),function(t,e,n,i){const o=t[zi],r=o.get(n),s=r||{};s[i]||(s[i]=new Set);s[i].add(e),r||o.set(n,s)}(t._observable,n,o.observable,e)})})}(this),this._bindProperties.forEach(t=>{Gi(this._observable,t)})}function Wi(t,e,n){if(this._bindings.size>1)throw new hn.b("observable-bind-to-many-not-one-binding: Cannot bind multiple properties with toMany().",this);this.to(...function(t,e){const n=t.map(t=>[t,e]);return Array.prototype.concat.apply([],n)}(t,e),n)}function Yi(t){return t.every(t=>"string"==typeof t)}function Gi(t,e){const n=t[Bi].get(e);let i;n.callback?i=n.callback.apply(t,n.to.map(t=>t[0][t[1]])):(i=n.to[0],i=i[0][i[1]]),t.hasOwnProperty(e)?t[e]=i:t.set(e,i)}class $i extends Di{constructor(t,e,n,i){super(t,e,n,i),this.set("isReadOnly",!1),this.set("isFocused",!1),this.bind("isReadOnly").to(t),this.bind("isFocused").to(t,"isFocused",e=>e&&t.selection.editableElement==this),this.listenTo(t.selection,"change",()=>{this.isFocused=t.isFocused&&t.selection.editableElement==this})}is(t,e=null){return e?e===this.name&&("editableElement"===t||"view:editableElement"===t||"containerElement"===t||"view:containerElement"===t||"element"===t||"view:element"===t):"editableElement"===t||"view:editableElement"===t||"containerElement"===t||"view:containerElement"===t||t===this.name||t==="view:"+this.name||"element"===t||"view:element"===t||"node"===t||"view:node"===t}destroy(){this.stopListening()}}xn($i,Ui);const Qi=Symbol("rootName");class Ki extends $i{constructor(t,e){super(t,e),this.rootName="main"}is(t,e=null){return e?e===this.name&&("rootElement"===t||"view:rootElement"===t||"editableElement"===t||"view:editableElement"===t||"containerElement"===t||"view:containerElement"===t||"element"===t||"view:element"===t):"rootElement"===t||"view:rootElement"===t||"editableElement"===t||"view:editableElement"===t||"containerElement"===t||"view:containerElement"===t||t===this.name||t==="view:"+this.name||"element"===t||"view:element"===t||"node"===t||"view:node"===t}get rootName(){return this.getCustomProperty(Qi)}set rootName(t){this._setCustomProperty(Qi,t)}set _name(t){this.name=t}}class Ji{constructor(t={}){if(!t.boundaries&&!t.startPosition)throw new hn.b("view-tree-walker-no-start-position: Neither boundaries nor starting position have been defined.",null);if(t.direction&&"forward"!=t.direction&&"backward"!=t.direction)throw new hn.b("view-tree-walker-unknown-direction: Only `backward` and `forward` direction allowed.",t.startPosition,{direction:t.direction});this.boundaries=t.boundaries||null,t.startPosition?this.position=Zi._createAt(t.startPosition):this.position=Zi._createAt(t.boundaries["backward"==t.direction?"end":"start"]),this.direction=t.direction||"forward",this.singleCharacters=!!t.singleCharacters,this.shallow=!!t.shallow,this.ignoreElementEnd=!!t.ignoreElementEnd,this._boundaryStartParent=this.boundaries?this.boundaries.start.parent:null,this._boundaryEndParent=this.boundaries?this.boundaries.end.parent:null}[Symbol.iterator](){return this}skip(t){let e,n,i;do{i=this.position,({done:e,value:n}=this.next())}while(!e&&t(n));e||(this.position=i)}next(){return"forward"==this.direction?this._next():this._previous()}_next(){let t=this.position.clone();const e=this.position,n=t.parent;if(null===n.parent&&t.offset===n.childCount)return{done:!0};if(n===this._boundaryEndParent&&t.offset==this.boundaries.end.offset)return{done:!0};let i;if(n instanceof Rn){if(t.isAtEnd)return this.position=Zi._createAfter(n),this._next();i=n.data[t.offset]}else i=n.getChild(t.offset);if(i instanceof Oi)return this.shallow?t.offset++:t=new Zi(i,0),this.position=t,this._formatReturnValue("elementStart",i,e,t,1);if(i instanceof Rn){if(this.singleCharacters)return t=new Zi(i,0),this.position=t,this._next();{let n,o=i.data.length;return i==this._boundaryEndParent?(o=this.boundaries.end.offset,n=new Dn(i,0,o),t=Zi._createAfter(n)):(n=new Dn(i,0,i.data.length),t.offset++),this.position=t,this._formatReturnValue("text",n,e,t,o)}}if("string"==typeof i){let i;if(this.singleCharacters)i=1;else{i=(n===this._boundaryEndParent?this.boundaries.end.offset:n.data.length)-t.offset}const o=new Dn(n,t.offset,i);return t.offset+=i,this.position=t,this._formatReturnValue("text",o,e,t,i)}return t=Zi._createAfter(n),this.position=t,this.ignoreElementEnd?this._next():this._formatReturnValue("elementEnd",n,e,t)}_previous(){let t=this.position.clone();const e=this.position,n=t.parent;if(null===n.parent&&0===t.offset)return{done:!0};if(n==this._boundaryStartParent&&t.offset==this.boundaries.start.offset)return{done:!0};let i;if(n instanceof Rn){if(t.isAtStart)return this.position=Zi._createBefore(n),this._previous();i=n.data[t.offset-1]}else i=n.getChild(t.offset-1);if(i instanceof Oi)return this.shallow?(t.offset--,this.position=t,this._formatReturnValue("elementStart",i,e,t,1)):(t=new Zi(i,i.childCount),this.position=t,this.ignoreElementEnd?this._previous():this._formatReturnValue("elementEnd",i,e,t));if(i instanceof Rn){if(this.singleCharacters)return t=new Zi(i,i.data.length),this.position=t,this._previous();{let n,o=i.data.length;if(i==this._boundaryStartParent){const e=this.boundaries.start.offset;n=new Dn(i,e,i.data.length-e),o=n.data.length,t=Zi._createBefore(n)}else n=new Dn(i,0,i.data.length),t.offset--;return this.position=t,this._formatReturnValue("text",n,e,t,o)}}if("string"==typeof i){let i;if(this.singleCharacters)i=1;else{const e=n===this._boundaryStartParent?this.boundaries.start.offset:0;i=t.offset-e}t.offset-=i;const o=new Dn(n,t.offset,i);return this.position=t,this._formatReturnValue("text",o,e,t,i)}return t=Zi._createBefore(n),this.position=t,this._formatReturnValue("elementStart",n,e,t,1)}_formatReturnValue(t,e,n,i,o){return e instanceof Dn&&(e.offsetInText+e.data.length==e.textNode.data.length&&("forward"!=this.direction||this.boundaries&&this.boundaries.end.isEqual(this.position)?n=Zi._createAfter(e.textNode):(i=Zi._createAfter(e.textNode),this.position=i)),0===e.offsetInText&&("backward"!=this.direction||this.boundaries&&this.boundaries.start.isEqual(this.position)?n=Zi._createBefore(e.textNode):(i=Zi._createBefore(e.textNode),this.position=i))),{done:!1,value:{type:t,item:e,previousPosition:n,nextPosition:i,length:o}}}}class Zi{constructor(t,e){this.parent=t,this.offset=e}get nodeAfter(){return this.parent.is("text")?null:this.parent.getChild(this.offset)||null}get nodeBefore(){return this.parent.is("text")?null:this.parent.getChild(this.offset-1)||null}get isAtStart(){return 0===this.offset}get isAtEnd(){const t=this.parent.is("text")?this.parent.data.length:this.parent.childCount;return this.offset===t}get root(){return this.parent.root}get editableElement(){let t=this.parent;for(;!(t instanceof $i);){if(!t.parent)return null;t=t.parent}return t}getShiftedBy(t){const e=Zi._createAt(this),n=e.offset+t;return e.offset=n<0?0:n,e}getLastMatchingPosition(t,e={}){e.startPosition=this;const n=new Ji(e);return n.skip(t),n.position}getAncestors(){return this.parent.is("documentFragment")?[this.parent]:this.parent.getAncestors({includeSelf:!0})}getCommonAncestor(t){const e=this.getAncestors(),n=t.getAncestors();let i=0;for(;e[i]==n[i]&&e[i];)i++;return 0===i?null:e[i-1]}is(t){return"position"===t||"view:position"===t}isEqual(t){return this.parent==t.parent&&this.offset==t.offset}isBefore(t){return"before"==this.compareWith(t)}isAfter(t){return"after"==this.compareWith(t)}compareWith(t){if(this.root!==t.root)return"different";if(this.isEqual(t))return"same";const e=this.parent.is("node")?this.parent.getPath():[],n=t.parent.is("node")?t.parent.getPath():[];e.push(this.offset),n.push(t.offset);const i=In(e,n);switch(i){case"prefix":return"before";case"extension":return"after";default:return e[i]<n[i]?"before":"after"}}getWalker(t={}){return t.startPosition=this,new Ji(t)}clone(){return new Zi(this.parent,this.offset)}static _createAt(t,e){if(t instanceof Zi)return new this(t.parent,t.offset);{const n=t;if("end"==e)e=n.is("text")?n.data.length:n.childCount;else{if("before"==e)return this._createBefore(n);if("after"==e)return this._createAfter(n);if(0!==e&&!e)throw new hn.b("view-createPositionAt-offset-required: View#createPositionAt() requires the offset when the first parameter is a view item.",n)}return new Zi(n,e)}}static _createAfter(t){if(t.is("textProxy"))return new Zi(t.textNode,t.offsetInText+t.data.length);if(!t.parent)throw new hn.b("view-position-after-root: You can not make position after root.",t,{root:t});return new Zi(t.parent,t.index+1)}static _createBefore(t){if(t.is("textProxy"))return new Zi(t.textNode,t.offsetInText);if(!t.parent)throw new hn.b("view-position-before-root: You can not make position before root.",t,{root:t});return new Zi(t.parent,t.index)}}class Xi{constructor(t,e=null){this.start=t.clone(),this.end=e?e.clone():t.clone()}*[Symbol.iterator](){yield*new Ji({boundaries:this,ignoreElementEnd:!0})}get isCollapsed(){return this.start.isEqual(this.end)}get isFlat(){return this.start.parent===this.end.parent}get root(){return this.start.root}getEnlarged(){let t=this.start.getLastMatchingPosition(to,{direction:"backward"}),e=this.end.getLastMatchingPosition(to);return t.parent.is("text")&&t.isAtStart&&(t=Zi._createBefore(t.parent)),e.parent.is("text")&&e.isAtEnd&&(e=Zi._createAfter(e.parent)),new Xi(t,e)}getTrimmed(){let t=this.start.getLastMatchingPosition(to);if(t.isAfter(this.end)||t.isEqual(this.end))return new Xi(t,t);let e=this.end.getLastMatchingPosition(to,{direction:"backward"});const n=t.nodeAfter,i=e.nodeBefore;return n&&n.is("text")&&(t=new Zi(n,0)),i&&i.is("text")&&(e=new Zi(i,i.data.length)),new Xi(t,e)}isEqual(t){return this==t||this.start.isEqual(t.start)&&this.end.isEqual(t.end)}containsPosition(t){return t.isAfter(this.start)&&t.isBefore(this.end)}containsRange(t,e=!1){t.isCollapsed&&(e=!1);const n=this.containsPosition(t.start)||e&&this.start.isEqual(t.start),i=this.containsPosition(t.end)||e&&this.end.isEqual(t.end);return n&&i}getDifference(t){const e=[];return this.isIntersecting(t)?(this.containsPosition(t.start)&&e.push(new Xi(this.start,t.start)),this.containsPosition(t.end)&&e.push(new Xi(t.end,this.end))):e.push(this.clone()),e}getIntersection(t){if(this.isIntersecting(t)){let e=this.start,n=this.end;return this.containsPosition(t.start)&&(e=t.start),this.containsPosition(t.end)&&(n=t.end),new Xi(e,n)}return null}getWalker(t={}){return t.boundaries=this,new Ji(t)}getCommonAncestor(){return this.start.getCommonAncestor(this.end)}getContainedElement(){if(this.isCollapsed)return null;let t=this.start.nodeAfter,e=this.end.nodeBefore;return this.start.parent.is("text")&&this.start.isAtEnd&&this.start.parent.nextSibling&&(t=this.start.parent.nextSibling),this.end.parent.is("text")&&this.end.isAtStart&&this.end.parent.previousSibling&&(e=this.end.parent.previousSibling),t&&t.is("element")&&t===e?t:null}clone(){return new Xi(this.start,this.end)}*getItems(t={}){t.boundaries=this,t.ignoreElementEnd=!0;const e=new Ji(t);for(const t of e)yield t.item}*getPositions(t={}){t.boundaries=this;const e=new Ji(t);yield e.position;for(const t of e)yield t.nextPosition}is(t){return"range"===t||"view:range"===t}isIntersecting(t){return this.start.isBefore(t.end)&&this.end.isAfter(t.start)}static _createFromParentsAndOffsets(t,e,n,i){return new this(new Zi(t,e),new Zi(n,i))}static _createFromPositionAndShift(t,e){const n=t,i=t.getShiftedBy(e);return e>0?new this(n,i):new this(i,n)}static _createIn(t){return this._createFromParentsAndOffsets(t,0,t,t.childCount)}static _createOn(t){const e=t.is("textProxy")?t.offsetSize:1;return this._createFromPositionAndShift(Zi._createBefore(t),e)}}function to(t){return!(!t.item.is("attributeElement")&&!t.item.is("uiElement"))}function eo(t){let e=0;for(const n of t)e++;return e}class no{constructor(t=null,e,n){this._ranges=[],this._lastRangeBackward=!1,this._isFake=!1,this._fakeSelectionLabel="",this.setTo(t,e,n)}get isFake(){return this._isFake}get fakeSelectionLabel(){return this._fakeSelectionLabel}get anchor(){if(!this._ranges.length)return null;const t=this._ranges[this._ranges.length-1];return(this._lastRangeBackward?t.end:t.start).clone()}get focus(){if(!this._ranges.length)return null;const t=this._ranges[this._ranges.length-1];return(this._lastRangeBackward?t.start:t.end).clone()}get isCollapsed(){return 1===this.rangeCount&&this._ranges[0].isCollapsed}get rangeCount(){return this._ranges.length}get isBackward(){return!this.isCollapsed&&this._lastRangeBackward}get editableElement(){return this.anchor?this.anchor.editableElement:null}*getRanges(){for(const t of this._ranges)yield t.clone()}getFirstRange(){let t=null;for(const e of this._ranges)t&&!e.start.isBefore(t.start)||(t=e);return t?t.clone():null}getLastRange(){let t=null;for(const e of this._ranges)t&&!e.end.isAfter(t.end)||(t=e);return t?t.clone():null}getFirstPosition(){const t=this.getFirstRange();return t?t.start.clone():null}getLastPosition(){const t=this.getLastRange();return t?t.end.clone():null}isEqual(t){if(this.isFake!=t.isFake)return!1;if(this.isFake&&this.fakeSelectionLabel!=t.fakeSelectionLabel)return!1;if(this.rangeCount!=t.rangeCount)return!1;if(0===this.rangeCount)return!0;if(!this.anchor.isEqual(t.anchor)||!this.focus.isEqual(t.focus))return!1;for(const e of this._ranges){let n=!1;for(const i of t._ranges)if(e.isEqual(i)){n=!0;break}if(!n)return!1}return!0}isSimilar(t){if(this.isBackward!=t.isBackward)return!1;const e=eo(this.getRanges());if(e!=eo(t.getRanges()))return!1;if(0==e)return!0;for(let e of this.getRanges()){e=e.getTrimmed();let n=!1;for(let i of t.getRanges())if(i=i.getTrimmed(),e.start.isEqual(i.start)&&e.end.isEqual(i.end)){n=!0;break}if(!n)return!1}return!0}getSelectedElement(){return 1!==this.rangeCount?null:this.getFirstRange().getContainedElement()}setTo(t,e,n){if(null===t)this._setRanges([]),this._setFakeOptions(e);else if(t instanceof no||t instanceof io)this._setRanges(t.getRanges(),t.isBackward),this._setFakeOptions({fake:t.isFake,label:t.fakeSelectionLabel});else if(t instanceof Xi)this._setRanges([t],e&&e.backward),this._setFakeOptions(e);else if(t instanceof Zi)this._setRanges([new Xi(t)]),this._setFakeOptions(e);else if(t instanceof On){const i=!!n&&!!n.backward;let o;if(void 0===e)throw new hn.b("view-selection-setTo-required-second-parameter: selection.setTo requires the second parameter when the first parameter is a node.",this);o="in"==e?Xi._createIn(t):"on"==e?Xi._createOn(t):new Xi(Zi._createAt(t,e)),this._setRanges([o],i),this._setFakeOptions(n)}else{if(!yn(t))throw new hn.b("view-selection-setTo-not-selectable: Cannot set selection to given place.",this);this._setRanges(t,e&&e.backward),this._setFakeOptions(e)}this.fire("change")}setFocus(t,e){if(null===this.anchor)throw new hn.b("view-selection-setFocus-no-ranges: Cannot set selection focus if there are no ranges in selection.",this);const n=Zi._createAt(t,e);if("same"==n.compareWith(this.focus))return;const i=this.anchor;this._ranges.pop(),"before"==n.compareWith(i)?this._addRange(new Xi(n,i),!0):this._addRange(new Xi(i,n)),this.fire("change")}is(t){return"selection"===t||"view:selection"===t}_setRanges(t,e=!1){t=Array.from(t),this._ranges=[];for(const e of t)this._addRange(e);this._lastRangeBackward=!!e}_setFakeOptions(t={}){this._isFake=!!t.fake,this._fakeSelectionLabel=t.fake&&t.label||""}_addRange(t,e=!1){if(!(t instanceof Xi))throw new hn.b("view-selection-add-range-not-range: Selection range set to an object that is not an instance of view.Range",this);this._pushRange(t),this._lastRangeBackward=!!e}_pushRange(t){for(const e of this._ranges)if(t.isIntersecting(e))throw new hn.b("view-selection-range-intersects: Trying to add a range that intersects with another range from selection.",this,{addedRange:t,intersectingRange:e});this._ranges.push(new Xi(t.start,t.end))}}xn(no,gn);class io{constructor(t=null,e,n){this._selection=new no,this._selection.delegate("change").to(this),this._selection.setTo(t,e,n)}get isFake(){return this._selection.isFake}get fakeSelectionLabel(){return this._selection.fakeSelectionLabel}get anchor(){return this._selection.anchor}get focus(){return this._selection.focus}get isCollapsed(){return this._selection.isCollapsed}get rangeCount(){return this._selection.rangeCount}get isBackward(){return this._selection.isBackward}get editableElement(){return this._selection.editableElement}get _ranges(){return this._selection._ranges}*getRanges(){yield*this._selection.getRanges()}getFirstRange(){return this._selection.getFirstRange()}getLastRange(){return this._selection.getLastRange()}getFirstPosition(){return this._selection.getFirstPosition()}getLastPosition(){return this._selection.getLastPosition()}getSelectedElement(){return this._selection.getSelectedElement()}isEqual(t){return this._selection.isEqual(t)}isSimilar(t){return this._selection.isSimilar(t)}is(t){return"selection"===t||"documentSelection"==t||"view:selection"==t||"view:documentSelection"==t}_setTo(t,e,n){this._selection.setTo(t,e,n)}_setFocus(t,e){this._selection.setFocus(t,e)}}xn(io,gn);class oo{constructor(t){this.selection=new io,this.roots=new An({idProperty:"rootName"}),this.stylesProcessor=t,this.set("isReadOnly",!1),this.set("isFocused",!1),this.set("isComposing",!1),this._postFixers=new Set}getRoot(t="main"){return this.roots.get(t)}registerPostFixer(t){this._postFixers.add(t)}destroy(){this.roots.map(t=>t.destroy()),this.stopListening()}_callPostFixers(t){let e=!1;do{for(const n of this._postFixers)if(e=n(t),e)break}while(e)}}xn(oo,Ui);class ro extends Oi{constructor(t,e,n,i){super(t,e,n,i),this.getFillerOffset=so,this._priority=10,this._id=null,this._clonesGroup=null}get priority(){return this._priority}get id(){return this._id}getElementsWithSameId(){if(null===this.id)throw new hn.b("attribute-element-get-elements-with-same-id-no-id: Cannot get elements with the same id for an attribute element without id.",this);return new Set(this._clonesGroup)}is(t,e=null){return e?e===this.name&&("attributeElement"===t||"view:attributeElement"===t||"element"===t||"view:element"===t):"attributeElement"===t||"view:attributeElement"===t||t===this.name||t==="view:"+this.name||"element"===t||"view:element"===t||"node"===t||"view:node"===t}isSimilar(t){return null!==this.id||null!==t.id?this.id===t.id:super.isSimilar(t)&&this.priority==t.priority}_clone(t){const e=super._clone(t);return e._priority=this._priority,e._id=this._id,e}}function so(){if(ao(this))return null;let t=this.parent;for(;t&&t.is("attributeElement");){if(ao(t)>1)return null;t=t.parent}return!t||ao(t)>1?null:this.childCount}function ao(t){return Array.from(t.getChildren()).filter(t=>!t.is("uiElement")).length}ro.DEFAULT_PRIORITY=10;class co extends Oi{constructor(t,e,n,i){super(t,e,n,i),this.getFillerOffset=lo}is(t,e=null){return e?e===this.name&&("emptyElement"===t||"view:emptyElement"===t||"element"===t||"view:element"===t):"emptyElement"===t||"view:emptyElement"===t||t===this.name||t==="view:"+this.name||"element"===t||"view:element"===t||"node"===t||"view:node"===t}_insertChild(t,e){if(e&&(e instanceof On||Array.from(e).length>0))throw new hn.b("view-emptyelement-cannot-add: Cannot add child nodes to EmptyElement instance.",[this,e])}}function lo(){return null}const uo=navigator.userAgent.toLowerCase();var ho={isMac:function(t){return t.indexOf("macintosh")>-1}(uo),isGecko:function(t){return!!t.match(/gecko\/\d+/)}(uo),isSafari:function(t){return t.indexOf(" applewebkit/")>-1&&-1===t.indexOf("chrome")}(uo),isAndroid:function(t){return t.indexOf("android")>-1}(uo),features:{isRegExpUnicodePropertySupported:function(){let t=!1;try{t=0==="ć".search(new RegExp("[\\p{L}]","u"))}catch(t){}return t}()}};const fo={"⌘":"ctrl","⇧":"shift","⌥":"alt"},mo={ctrl:"⌘",shift:"⇧",alt:"⌥"},go=function(){const t={arrowleft:37,arrowup:38,arrowright:39,arrowdown:40,backspace:8,delete:46,enter:13,space:32,esc:27,tab:9,ctrl:1114112,cmd:1114112,shift:2228224,alt:4456448};for(let e=65;e<=90;e++){const n=String.fromCharCode(e);t[n.toLowerCase()]=e}for(let e=48;e<=57;e++)t[e-48]=e;for(let e=112;e<=123;e++)t["f"+(e-111)]=e;return t}();function po(t){let e;if("string"==typeof t){if(e=go[t.toLowerCase()],!e)throw new hn.b("keyboard-unknown-key: Unknown key name.",null,{key:t})}else e=t.keyCode+(t.altKey?go.alt:0)+(t.ctrlKey?go.ctrl:0)+(t.shiftKey?go.shift:0);return e}function bo(t){return"string"==typeof t&&(t=ko(t)),t.map(t=>"string"==typeof t?po(t):t).reduce((t,e)=>e+t,0)}function wo(t){return ho.isMac?ko(t).map(t=>mo[t.toLowerCase()]||t).reduce((t,e)=>t.slice(-1)in fo?t+e:t+"+"+e):t}function ko(t){return t.split(/\s*\+\s*/)}class _o extends Oi{constructor(t,e,n,i){super(t,e,n,i),this.getFillerOffset=yo}is(t,e=null){return e?e===this.name&&("uiElement"===t||"view:uiElement"===t||"element"===t||"view:element"===t):"uiElement"===t||"view:uiElement"===t||t===this.name||t==="view:"+this.name||"element"===t||"view:element"===t||"node"===t||"view:node"===t}_insertChild(t,e){if(e&&(e instanceof On||Array.from(e).length>0))throw new hn.b("view-uielement-cannot-add: Cannot add child nodes to UIElement instance.",this)}render(t){return this.toDomElement(t)}toDomElement(t){const e=t.createElement(this.name);for(const t of this.getAttributeKeys())e.setAttribute(t,this.getAttribute(t));return e}}function vo(t){t.document.on("keydown",(e,n)=>function(t,e,n){if(e.keyCode==go.arrowright){const t=e.domTarget.ownerDocument.defaultView.getSelection(),i=1==t.rangeCount&&t.getRangeAt(0).collapsed;if(i||e.shiftKey){const e=t.focusNode,o=t.focusOffset,r=n.domPositionToView(e,o);if(null===r)return;let s=!1;const a=r.getLastMatchingPosition(t=>(t.item.is("uiElement")&&(s=!0),!(!t.item.is("uiElement")&&!t.item.is("attributeElement"))));if(s){const e=n.viewPositionToDom(a);i?t.collapse(e.parent,e.offset):t.extend(e.parent,e.offset)}}}}(0,n,t.domConverter))}function yo(){return null}class xo{constructor(t,e){this.document=t,this._children=[],e&&this._insertChild(0,e)}[Symbol.iterator](){return this._children[Symbol.iterator]()}get childCount(){return this._children.length}get isEmpty(){return 0===this.childCount}get root(){return this}get parent(){return null}is(t){return"documentFragment"===t||"view:documentFragment"===t}_appendChild(t){return this._insertChild(this.childCount,t)}getChild(t){return this._children[t]}getChildIndex(t){return this._children.indexOf(t)}getChildren(){return this._children[Symbol.iterator]()}_insertChild(t,e){this._fireChange("children",this);let n=0;const i=function(t,e){if("string"==typeof e)return[new Rn(t,e)];yn(e)||(e=[e]);return Array.from(e).map(e=>"string"==typeof e?new Rn(t,e):e instanceof Dn?new Rn(t,e.data):e)}(this.document,e);for(const e of i)null!==e.parent&&e._remove(),e.parent=this,this._children.splice(t,0,e),t++,n++;return n}_removeChildren(t,e=1){this._fireChange("children",this);for(let n=t;n<t+e;n++)this._children[n].parent=null;return this._children.splice(t,e)}_fireChange(t,e){this.fire("change:"+t,e)}}xn(xo,gn);class Ao{constructor(t){this.document=t,this._cloneGroups=new Map}setSelection(t,e,n){this.document.selection._setTo(t,e,n)}setSelectionFocus(t,e){this.document.selection._setFocus(t,e)}createText(t){return new Rn(this.document,t)}createAttributeElement(t,e,n={}){const i=new ro(this.document,t,e);return n.priority&&(i._priority=n.priority),n.id&&(i._id=n.id),i}createContainerElement(t,e){return new Di(this.document,t,e)}createEditableElement(t,e){const n=new $i(this.document,t,e);return n._document=this.document,n}createEmptyElement(t,e){return new co(this.document,t,e)}createUIElement(t,e,n){const i=new _o(this.document,t,e);return n&&(i.render=n),i}setAttribute(t,e,n){n._setAttribute(t,e)}removeAttribute(t,e){e._removeAttribute(t)}addClass(t,e){e._addClass(t)}removeClass(t,e){e._removeClass(t)}setStyle(t,e,n){y(t)&&void 0===n&&(n=e),n._setStyle(t,e)}removeStyle(t,e){e._removeStyle(t)}setCustomProperty(t,e,n){n._setCustomProperty(t,e)}removeCustomProperty(t,e){return e._removeCustomProperty(t)}breakAttributes(t){return t instanceof Zi?this._breakAttributes(t):this._breakAttributesRange(t)}breakContainer(t){const e=t.parent;if(!e.is("containerElement"))throw new hn.b("view-writer-break-non-container-element: Trying to break an element which is not a container element.",this.document);if(!e.parent)throw new hn.b("view-writer-break-root: Trying to break root element.",this.document);if(t.isAtStart)return Zi._createBefore(e);if(!t.isAtEnd){const n=e._clone(!1);this.insert(Zi._createAfter(e),n);const i=new Xi(t,Zi._createAt(e,"end")),o=new Zi(n,0);this.move(i,o)}return Zi._createAfter(e)}mergeAttributes(t){const e=t.offset,n=t.parent;if(n.is("text"))return t;if(n.is("attributeElement")&&0===n.childCount){const t=n.parent,e=n.index;return n._remove(),this._removeFromClonedElementsGroup(n),this.mergeAttributes(new Zi(t,e))}const i=n.getChild(e-1),o=n.getChild(e);if(!i||!o)return t;if(i.is("text")&&o.is("text"))return Mo(i,o);if(i.is("attributeElement")&&o.is("attributeElement")&&i.isSimilar(o)){const t=i.childCount;return i._appendChild(o.getChildren()),o._remove(),this._removeFromClonedElementsGroup(o),this.mergeAttributes(new Zi(i,t))}return t}mergeContainers(t){const e=t.nodeBefore,n=t.nodeAfter;if(!(e&&n&&e.is("containerElement")&&n.is("containerElement")))throw new hn.b("view-writer-merge-containers-invalid-position: Element before and after given position cannot be merged.",this.document);const i=e.getChild(e.childCount-1),o=i instanceof Rn?Zi._createAt(i,"end"):Zi._createAt(e,"end");return this.move(Xi._createIn(n),Zi._createAt(e,"end")),this.remove(Xi._createOn(n)),o}insert(t,e){(function t(e,n){for(const i of e){if(!Eo.some(t=>i instanceof t))throw new hn.b("view-writer-insert-invalid-node",n);i.is("text")||t(i.getChildren(),n)}})(e=yn(e)?[...e]:[e],this.document);const n=To(t);if(!n)throw new hn.b("view-writer-invalid-position-container",this.document);const i=this._breakAttributes(t,!0),o=n._insertChild(i.offset,e);for(const t of e)this._addToClonedElementsGroup(t);const r=i.getShiftedBy(o),s=this.mergeAttributes(i);if(0===o)return new Xi(s,s);{s.isEqual(i)||r.offset--;const t=this.mergeAttributes(r);return new Xi(s,t)}}remove(t){const e=t instanceof Xi?t:Xi._createOn(t);if(No(e,this.document),e.isCollapsed)return new xo(this.document);const{start:n,end:i}=this._breakAttributesRange(e,!0),o=n.parent,r=i.offset-n.offset,s=o._removeChildren(n.offset,r);for(const t of s)this._removeFromClonedElementsGroup(t);const a=this.mergeAttributes(n);return e.start=a,e.end=a.clone(),new xo(this.document,s)}clear(t,e){No(t,this.document);const n=t.getWalker({direction:"backward",ignoreElementEnd:!0});for(const i of n){const n=i.item;let o;if(n.is("element")&&e.isSimilar(n))o=Xi._createOn(n);else if(!i.nextPosition.isAfter(t.start)&&n.is("textProxy")){const t=n.getAncestors().find(t=>t.is("element")&&e.isSimilar(t));t&&(o=Xi._createIn(t))}o&&(o.end.isAfter(t.end)&&(o.end=t.end),o.start.isBefore(t.start)&&(o.start=t.start),this.remove(o))}}move(t,e){let n;if(e.isAfter(t.end)){const i=(e=this._breakAttributes(e,!0)).parent,o=i.childCount;t=this._breakAttributesRange(t,!0),n=this.remove(t),e.offset+=i.childCount-o}else n=this.remove(t);return this.insert(e,n)}wrap(t,e){if(!(e instanceof ro))throw new hn.b("view-writer-wrap-invalid-attribute",this.document);if(No(t,this.document),t.isCollapsed){let i=t.start;i.parent.is("element")&&(n=i.parent,!Array.from(n.getChildren()).some(t=>!t.is("uiElement")))&&(i=i.getLastMatchingPosition(t=>t.item.is("uiElement"))),i=this._wrapPosition(i,e);const o=this.document.selection;return o.isCollapsed&&o.getFirstPosition().isEqual(t.start)&&this.setSelection(i),new Xi(i)}return this._wrapRange(t,e);var n}unwrap(t,e){if(!(e instanceof ro))throw new hn.b("view-writer-unwrap-invalid-attribute",this.document);if(No(t,this.document),t.isCollapsed)return t;const{start:n,end:i}=this._breakAttributesRange(t,!0),o=n.parent,r=this._unwrapChildren(o,n.offset,i.offset,e),s=this.mergeAttributes(r.start);s.isEqual(r.start)||r.end.offset--;const a=this.mergeAttributes(r.end);return new Xi(s,a)}rename(t,e){const n=new Di(this.document,t,e.getAttributes());return this.insert(Zi._createAfter(e),n),this.move(Xi._createIn(e),Zi._createAt(n,0)),this.remove(Xi._createOn(e)),n}clearClonedElementsGroup(t){this._cloneGroups.delete(t)}createPositionAt(t,e){return Zi._createAt(t,e)}createPositionAfter(t){return Zi._createAfter(t)}createPositionBefore(t){return Zi._createBefore(t)}createRange(t,e){return new Xi(t,e)}createRangeOn(t){return Xi._createOn(t)}createRangeIn(t){return Xi._createIn(t)}createSelection(t,e,n){return new no(t,e,n)}_wrapChildren(t,e,n,i){let o=e;const r=[];for(;o<n;){const e=t.getChild(o),n=e.is("text"),s=e.is("attributeElement"),a=e.is("emptyElement"),c=e.is("uiElement");if(s&&this._wrapAttributeElement(i,e))r.push(new Zi(t,o));else if(n||a||c||s&&Co(i,e)){const n=i._clone();e._remove(),n._appendChild(e),t._insertChild(o,n),this._addToClonedElementsGroup(n),r.push(new Zi(t,o))}else s&&this._wrapChildren(e,0,e.childCount,i);o++}let s=0;for(const t of r){if(t.offset-=s,t.offset==e)continue;this.mergeAttributes(t).isEqual(t)||(s++,n--)}return Xi._createFromParentsAndOffsets(t,e,t,n)}_unwrapChildren(t,e,n,i){let o=e;const r=[];for(;o<n;){const e=t.getChild(o);if(e.is("attributeElement"))if(e.isSimilar(i)){const i=e.getChildren(),s=e.childCount;e._remove(),t._insertChild(o,i),this._removeFromClonedElementsGroup(e),r.push(new Zi(t,o),new Zi(t,o+s)),o+=s,n+=s-1}else this._unwrapAttributeElement(i,e)?(r.push(new Zi(t,o),new Zi(t,o+1)),o++):(this._unwrapChildren(e,0,e.childCount,i),o++);else o++}let s=0;for(const t of r){if(t.offset-=s,t.offset==e||t.offset==n)continue;this.mergeAttributes(t).isEqual(t)||(s++,n--)}return Xi._createFromParentsAndOffsets(t,e,t,n)}_wrapRange(t,e){const{start:n,end:i}=this._breakAttributesRange(t,!0),o=n.parent,r=this._wrapChildren(o,n.offset,i.offset,e),s=this.mergeAttributes(r.start);s.isEqual(r.start)||r.end.offset--;const a=this.mergeAttributes(r.end);return new Xi(s,a)}_wrapPosition(t,e){if(e.isSimilar(t.parent))return Po(t.clone());t.parent.is("text")&&(t=So(t));const n=this.createAttributeElement();n._priority=Number.POSITIVE_INFINITY,n.isSimilar=()=>!1,t.parent._insertChild(t.offset,n);const i=new Xi(t,t.getShiftedBy(1));this.wrap(i,e);const o=new Zi(n.parent,n.index);n._remove();const r=o.nodeBefore,s=o.nodeAfter;return r instanceof Rn&&s instanceof Rn?Mo(r,s):Po(o)}_wrapAttributeElement(t,e){if(!Oo(t,e))return!1;if(t.name!==e.name||t.priority!==e.priority)return!1;for(const n of t.getAttributeKeys())if("class"!==n&&"style"!==n&&e.hasAttribute(n)&&e.getAttribute(n)!==t.getAttribute(n))return!1;for(const n of t.getStyleNames())if(e.hasStyle(n)&&e.getStyle(n)!==t.getStyle(n))return!1;for(const n of t.getAttributeKeys())"class"!==n&&"style"!==n&&(e.hasAttribute(n)||this.setAttribute(n,t.getAttribute(n),e));for(const n of t.getStyleNames())e.hasStyle(n)||this.setStyle(n,t.getStyle(n),e);for(const n of t.getClassNames())e.hasClass(n)||this.addClass(n,e);return!0}_unwrapAttributeElement(t,e){if(!Oo(t,e))return!1;if(t.name!==e.name||t.priority!==e.priority)return!1;for(const n of t.getAttributeKeys())if("class"!==n&&"style"!==n&&(!e.hasAttribute(n)||e.getAttribute(n)!==t.getAttribute(n)))return!1;if(!e.hasClass(...t.getClassNames()))return!1;for(const n of t.getStyleNames())if(!e.hasStyle(n)||e.getStyle(n)!==t.getStyle(n))return!1;for(const n of t.getAttributeKeys())"class"!==n&&"style"!==n&&this.removeAttribute(n,e);return this.removeClass(Array.from(t.getClassNames()),e),this.removeStyle(Array.from(t.getStyleNames()),e),!0}_breakAttributesRange(t,e=!1){const n=t.start,i=t.end;if(No(t,this.document),t.isCollapsed){const n=this._breakAttributes(t.start,e);return new Xi(n,n)}const o=this._breakAttributes(i,e),r=o.parent.childCount,s=this._breakAttributes(n,e);return o.offset+=o.parent.childCount-r,new Xi(s,o)}_breakAttributes(t,e=!1){const n=t.offset,i=t.parent;if(t.parent.is("emptyElement"))throw new hn.b("view-writer-cannot-break-empty-element",this.document);if(t.parent.is("uiElement"))throw new hn.b("view-writer-cannot-break-ui-element",this.document);if(!e&&i.is("text")&&Io(i.parent))return t.clone();if(Io(i))return t.clone();if(i.is("text"))return this._breakAttributes(So(t),e);if(n==i.childCount){const t=new Zi(i.parent,i.index+1);return this._breakAttributes(t,e)}if(0===n){const t=new Zi(i.parent,i.index);return this._breakAttributes(t,e)}{const t=i.index+1,o=i._clone();i.parent._insertChild(t,o),this._addToClonedElementsGroup(o);const r=i.childCount-n,s=i._removeChildren(n,r);o._appendChild(s);const a=new Zi(i.parent,t);return this._breakAttributes(a,e)}}_addToClonedElementsGroup(t){if(!t.root.is("rootElement"))return;if(t.is("element"))for(const e of t.getChildren())this._addToClonedElementsGroup(e);const e=t.id;if(!e)return;let n=this._cloneGroups.get(e);n||(n=new Set,this._cloneGroups.set(e,n)),n.add(t),t._clonesGroup=n}_removeFromClonedElementsGroup(t){if(t.is("element"))for(const e of t.getChildren())this._removeFromClonedElementsGroup(e);const e=t.id;if(!e)return;const n=this._cloneGroups.get(e);n&&n.delete(t)}}function To(t){let e=t.parent;for(;!Io(e);){if(!e)return;e=e.parent}return e}function Co(t,e){return t.priority<e.priority||!(t.priority>e.priority)&&t.getIdentity()<e.getIdentity()}function Po(t){const e=t.nodeBefore;if(e&&e.is("text"))return new Zi(e,e.data.length);const n=t.nodeAfter;return n&&n.is("text")?new Zi(n,0):t}function So(t){if(t.offset==t.parent.data.length)return new Zi(t.parent.parent,t.parent.index+1);if(0===t.offset)return new Zi(t.parent.parent,t.parent.index);const e=t.parent.data.slice(t.offset);return t.parent._data=t.parent.data.slice(0,t.offset),t.parent.parent._insertChild(t.parent.index+1,new Rn(t.root.document,e)),new Zi(t.parent.parent,t.parent.index+1)}function Mo(t,e){const n=t.data.length;return t._data+=e.data,e._remove(),new Zi(t,n)}const Eo=[Rn,ro,Di,co,_o];function Io(t){return t&&(t.is("containerElement")||t.is("documentFragment"))}function No(t,e){const n=To(t.start),i=To(t.end);if(!n||!i||n!==i)throw new hn.b("view-writer-invalid-range-container",e)}function Oo(t,e){return null===t.id&&null===e.id}function Ro(t){return"[object Text]"==Object.prototype.toString.call(t)}const Do=t=>t.createTextNode(" "),Lo=t=>{const e=t.createElement("br");return e.dataset.ckeFiller=!0,e},jo=(()=>{let t="";for(let e=0;e<7;e++)t+="​";return t})();function Vo(t){return Ro(t)&&t.data.substr(0,7)===jo}function zo(t){return 7==t.data.length&&Vo(t)}function Bo(t){return Vo(t)?t.data.slice(7):t.data}function Fo(t,e){if(e.keyCode==go.arrowleft){const t=e.domTarget.ownerDocument.defaultView.getSelection();if(1==t.rangeCount&&t.getRangeAt(0).collapsed){const e=t.getRangeAt(0).startContainer,n=t.getRangeAt(0).startOffset;Vo(e)&&n<=7&&t.collapse(e,0)}}}function Uo(t,e,n,i=!1){n=n||function(t,e){return t===e},Array.isArray(t)||(t=Array.prototype.slice.call(t)),Array.isArray(e)||(e=Array.prototype.slice.call(e));const o=function(t,e,n){const i=Ho(t,e,n);if(-1===i)return{firstIndex:-1,lastIndexOld:-1,lastIndexNew:-1};const o=qo(t,i),r=qo(e,i),s=Ho(o,r,n),a=t.length-s,c=e.length-s;return{firstIndex:i,lastIndexOld:a,lastIndexNew:c}}(t,e,n);return i?function(t,e){const{firstIndex:n,lastIndexOld:i,lastIndexNew:o}=t;if(-1===n)return Array(e).fill("equal");let r=[];n>0&&(r=r.concat(Array(n).fill("equal")));o-n>0&&(r=r.concat(Array(o-n).fill("insert")));i-n>0&&(r=r.concat(Array(i-n).fill("delete")));o<e&&(r=r.concat(Array(e-o).fill("equal")));return r}(o,e.length):function(t,e){const n=[],{firstIndex:i,lastIndexOld:o,lastIndexNew:r}=e;r-i>0&&n.push({index:i,type:"insert",values:t.slice(i,r)});o-i>0&&n.push({index:i+(r-i),type:"delete",howMany:o-i});return n}(e,o)}function Ho(t,e,n){for(let i=0;i<Math.max(t.length,e.length);i++)if(void 0===t[i]||void 0===e[i]||!n(t[i],e[i]))return i;return-1}function qo(t,e){return t.slice(e).reverse()}function Wo(t,e,n){n=n||function(t,e){return t===e};const i=t.length,o=e.length;if(i>200||o>200||i+o>300)return Wo.fastDiff(t,e,n,!0);let r,s;if(o<i){const n=t;t=e,e=n,r="delete",s="insert"}else r="insert",s="delete";const a=t.length,c=e.length,l=c-a,d={},u={};function h(i){const o=(void 0!==u[i-1]?u[i-1]:-1)+1,l=void 0!==u[i+1]?u[i+1]:-1,h=o>l?-1:1;d[i+h]&&(d[i]=d[i+h].slice(0)),d[i]||(d[i]=[]),d[i].push(o>l?r:s);let f=Math.max(o,l),m=f-i;for(;m<a&&f<c&&n(t[m],e[f]);)m++,f++,d[i].push("equal");return f}let f,m=0;do{for(f=-m;f<l;f++)u[f]=h(f);for(f=l+m;f>l;f--)u[f]=h(f);u[l]=h(l),m++}while(u[l]!==c);return d[l].slice(1)}function Yo(t,e,n){t.insertBefore(n,t.childNodes[e]||null)}function Go(t){const e=t.parentNode;e&&e.removeChild(t)}function $o(t){if(t){if(t.defaultView)return t instanceof t.defaultView.Document;if(t.ownerDocument&&t.ownerDocument.defaultView)return t instanceof t.ownerDocument.defaultView.Node}return!1}Wo.fastDiff=Uo;class Qo{constructor(t,e){this.domDocuments=new Set,this.domConverter=t,this.markedAttributes=new Set,this.markedChildren=new Set,this.markedTexts=new Set,this.selection=e,this.isFocused=!1,this._inlineFiller=null,this._fakeSelectionContainer=null}markToSync(t,e){if("text"===t)this.domConverter.mapViewToDom(e.parent)&&this.markedTexts.add(e);else{if(!this.domConverter.mapViewToDom(e))return;if("attributes"===t)this.markedAttributes.add(e);else{if("children"!==t)throw new hn.b("view-renderer-unknown-type: Unknown type passed to Renderer.markToSync.",this);this.markedChildren.add(e)}}}render(){let t;for(const t of this.markedChildren)this._updateChildrenMappings(t);this._inlineFiller&&!this._isSelectionInInlineFiller()&&this._removeInlineFiller(),this._inlineFiller?t=this._getInlineFillerPosition():this._needsInlineFillerAtSelection()&&(t=this.selection.getFirstPosition(),this.markedChildren.add(t.parent));for(const t of this.markedAttributes)this._updateAttrs(t);for(const e of this.markedChildren)this._updateChildren(e,{inlineFillerPosition:t});for(const e of this.markedTexts)!this.markedChildren.has(e.parent)&&this.domConverter.mapViewToDom(e.parent)&&this._updateText(e,{inlineFillerPosition:t});if(t){const e=this.domConverter.viewPositionToDom(t),n=e.parent.ownerDocument;Vo(e.parent)?this._inlineFiller=e.parent:this._inlineFiller=Ko(n,e.parent,e.offset)}else this._inlineFiller=null;this._updateSelection(),this._updateFocus(),this.markedTexts.clear(),this.markedAttributes.clear(),this.markedChildren.clear()}_updateChildrenMappings(t){const e=this.domConverter.mapViewToDom(t);if(!e)return;const n=this.domConverter.mapViewToDom(t).childNodes,i=Array.from(this.domConverter.viewChildrenToDom(t,e.ownerDocument,{withChildren:!1})),o=this._diffNodeLists(n,i),r=this._findReplaceActions(o,n,i);if(-1!==r.indexOf("replace")){const e={equal:0,insert:0,delete:0};for(const o of r)if("replace"===o){const o=e.equal+e.insert,r=e.equal+e.delete,s=t.getChild(o);s&&!s.is("uiElement")&&this._updateElementMappings(s,n[r]),Go(i[o]),e.equal++}else e[o]++}}_updateElementMappings(t,e){this.domConverter.unbindDomElement(e),this.domConverter.bindElements(e,t),this.markedChildren.add(t),this.markedAttributes.add(t)}_getInlineFillerPosition(){const t=this.selection.getFirstPosition();return t.parent.is("text")?Zi._createBefore(this.selection.getFirstPosition().parent):t}_isSelectionInInlineFiller(){if(1!=this.selection.rangeCount||!this.selection.isCollapsed)return!1;const t=this.selection.getFirstPosition(),e=this.domConverter.viewPositionToDom(t);return!!(e&&Ro(e.parent)&&Vo(e.parent))}_removeInlineFiller(){const t=this._inlineFiller;if(!Vo(t))throw new hn.b("view-renderer-filler-was-lost: The inline filler node was lost.",this);zo(t)?t.parentNode.removeChild(t):t.data=t.data.substr(7),this._inlineFiller=null}_needsInlineFillerAtSelection(){if(1!=this.selection.rangeCount||!this.selection.isCollapsed)return!1;const t=this.selection.getFirstPosition(),e=t.parent,n=t.offset;if(!this.domConverter.mapViewToDom(e.root))return!1;if(!e.is("element"))return!1;if(!function(t){if("false"==t.getAttribute("contenteditable"))return!1;const e=t.findAncestor(t=>t.hasAttribute("contenteditable"));return!e||"true"==e.getAttribute("contenteditable")}(e))return!1;if(n===e.getFillerOffset())return!1;const i=t.nodeBefore,o=t.nodeAfter;return!(i instanceof Rn||o instanceof Rn)}_updateText(t,e){const n=this.domConverter.findCorrespondingDomText(t),i=this.domConverter.viewToDom(t,n.ownerDocument),o=n.data;let r=i.data;const s=e.inlineFillerPosition;if(s&&s.parent==t.parent&&s.offset==t.index&&(r=jo+r),o!=r){const t=Uo(o,r);for(const e of t)"insert"===e.type?n.insertData(e.index,e.values.join("")):n.deleteData(e.index,e.howMany)}}_updateAttrs(t){const e=this.domConverter.mapViewToDom(t);if(!e)return;const n=Array.from(e.attributes).map(t=>t.name),i=t.getAttributeKeys();for(const n of i)e.setAttribute(n,t.getAttribute(n));for(const i of n)t.hasAttribute(i)||e.removeAttribute(i)}_updateChildren(t,e){const n=this.domConverter.mapViewToDom(t);if(!n)return;const i=e.inlineFillerPosition,o=this.domConverter.mapViewToDom(t).childNodes,r=Array.from(this.domConverter.viewChildrenToDom(t,n.ownerDocument,{bind:!0,inlineFillerPosition:i}));i&&i.parent===t&&Ko(n.ownerDocument,r,i.offset);const s=this._diffNodeLists(o,r);let a=0;const c=new Set;for(const t of s)"delete"===t?(c.add(o[a]),Go(o[a])):"equal"===t&&a++;a=0;for(const t of s)"insert"===t?(Yo(n,a,r[a]),a++):"equal"===t&&(this._markDescendantTextToSync(this.domConverter.domToView(r[a])),a++);for(const t of c)t.parentNode||this.domConverter.unbindDomElement(t)}_diffNodeLists(t,e){return Wo(t=function(t,e){const n=Array.from(t);if(0==n.length||!e)return n;n[n.length-1]==e&&n.pop();return n}(t,this._fakeSelectionContainer),e,Zo.bind(null,this.domConverter))}_findReplaceActions(t,e,n){if(-1===t.indexOf("insert")||-1===t.indexOf("delete"))return t;let i=[],o=[],r=[];const s={equal:0,insert:0,delete:0};for(const a of t)"insert"===a?r.push(n[s.equal+s.insert]):"delete"===a?o.push(e[s.equal+s.delete]):(i=i.concat(Wo(o,r,Jo).map(t=>"equal"===t?"replace":t)),i.push("equal"),o=[],r=[]),s[a]++;return i.concat(Wo(o,r,Jo).map(t=>"equal"===t?"replace":t))}_markDescendantTextToSync(t){if(t)if(t.is("text"))this.markedTexts.add(t);else if(t.is("element"))for(const e of t.getChildren())this._markDescendantTextToSync(e)}_updateSelection(){if(0===this.selection.rangeCount)return this._removeDomSelection(),void this._removeFakeSelection();const t=this.domConverter.mapViewToDom(this.selection.editableElement);this.isFocused&&t&&(this.selection.isFake?this._updateFakeSelection(t):(this._removeFakeSelection(),this._updateDomSelection(t)))}_updateFakeSelection(t){const e=t.ownerDocument;this._fakeSelectionContainer||(this._fakeSelectionContainer=function(t){const e=t.createElement("div");return Object.assign(e.style,{position:"fixed",top:0,left:"-9999px",width:"42px"}),e.textContent=" ",e}(e));const n=this._fakeSelectionContainer;if(this.domConverter.bindFakeSelection(n,this.selection),!this._fakeSelectionNeedsUpdate(t))return;n.parentElement&&n.parentElement==t||t.appendChild(n),n.textContent=this.selection.fakeSelectionLabel||" ";const i=e.getSelection(),o=e.createRange();i.removeAllRanges(),o.selectNodeContents(n),i.addRange(o)}_updateDomSelection(t){const e=t.ownerDocument.defaultView.getSelection();if(!this._domSelectionNeedsUpdate(e))return;const n=this.domConverter.viewPositionToDom(this.selection.anchor),i=this.domConverter.viewPositionToDom(this.selection.focus);t.focus(),e.collapse(n.parent,n.offset),e.extend(i.parent,i.offset),ho.isGecko&&function(t,e){const n=t.parent;if(n.nodeType!=Node.ELEMENT_NODE||t.offset!=n.childNodes.length-1)return;const i=n.childNodes[t.offset];i&&"BR"==i.tagName&&e.addRange(e.getRangeAt(0))}(i,e)}_domSelectionNeedsUpdate(t){if(!this.domConverter.isDomSelectionCorrect(t))return!0;const e=t&&this.domConverter.domSelectionToView(t);return(!e||!this.selection.isEqual(e))&&!(!this.selection.isCollapsed&&this.selection.isSimilar(e))}_fakeSelectionNeedsUpdate(t){const e=this._fakeSelectionContainer,n=t.ownerDocument.getSelection();return!e||e.parentElement!==t||(n.anchorNode!==e&&!e.contains(n.anchorNode)||e.textContent!==this.selection.fakeSelectionLabel)}_removeDomSelection(){for(const t of this.domDocuments){if(t.getSelection().rangeCount){const e=t.activeElement,n=this.domConverter.mapDomToView(e);e&&n&&t.getSelection().removeAllRanges()}}}_removeFakeSelection(){const t=this._fakeSelectionContainer;t&&t.remove()}_updateFocus(){if(this.isFocused){const t=this.selection.editableElement;t&&this.domConverter.focus(t)}}}function Ko(t,e,n){const i=e instanceof Array?e:e.childNodes,o=i[n];if(Ro(o))return o.data=jo+o.data,o;{const o=t.createTextNode(jo);return Array.isArray(e)?i.splice(n,0,o):Yo(e,n,o),o}}function Jo(t,e){return $o(t)&&$o(e)&&!Ro(t)&&!Ro(e)&&t.tagName.toLowerCase()===e.tagName.toLowerCase()}function Zo(t,e,n){return e===n||(Ro(e)&&Ro(n)?e.data===n.data:!(!t.isBlockFiller(e)||!t.isBlockFiller(n)))}xn(Qo,Ui);var Xo={window:window,document:document};function tr(t){let e=0;for(;t.previousSibling;)t=t.previousSibling,e++;return e}function er(t){const e=[];for(;t&&t.nodeType!=Node.DOCUMENT_NODE;)e.unshift(t),t=t.parentNode;return e}const nr=Lo(document);class ir{constructor(t,e={}){this.document=t,this.blockFillerMode=e.blockFillerMode||"br",this.preElements=["pre"],this.blockElements=["p","div","h1","h2","h3","h4","h5","h6","li","dd","dt","figcaption"],this._blockFiller="br"==this.blockFillerMode?Lo:Do,this._domToViewMapping=new WeakMap,this._viewToDomMapping=new WeakMap,this._fakeSelectionMapping=new WeakMap}bindFakeSelection(t,e){this._fakeSelectionMapping.set(t,new no(e))}fakeSelectionToView(t){return this._fakeSelectionMapping.get(t)}bindElements(t,e){this._domToViewMapping.set(t,e),this._viewToDomMapping.set(e,t)}unbindDomElement(t){const e=this._domToViewMapping.get(t);if(e){this._domToViewMapping.delete(t),this._viewToDomMapping.delete(e);for(const e of t.childNodes)this.unbindDomElement(e)}}bindDocumentFragments(t,e){this._domToViewMapping.set(t,e),this._viewToDomMapping.set(e,t)}viewToDom(t,e,n={}){if(t.is("text")){const n=this._processDataFromViewText(t);return e.createTextNode(n)}{if(this.mapViewToDom(t))return this.mapViewToDom(t);let i;if(t.is("documentFragment"))i=e.createDocumentFragment(),n.bind&&this.bindDocumentFragments(i,t);else{if(t.is("uiElement"))return i=t.render(e),n.bind&&this.bindElements(i,t),i;i=t.hasAttribute("xmlns")?e.createElementNS(t.getAttribute("xmlns"),t.name):e.createElement(t.name),n.bind&&this.bindElements(i,t);for(const e of t.getAttributeKeys())i.setAttribute(e,t.getAttribute(e))}if(n.withChildren||void 0===n.withChildren)for(const o of this.viewChildrenToDom(t,e,n))i.appendChild(o);return i}}*viewChildrenToDom(t,e,n={}){const i=t.getFillerOffset&&t.getFillerOffset();let o=0;for(const r of t.getChildren())i===o&&(yield this._blockFiller(e)),yield this.viewToDom(r,e,n),o++;i===o&&(yield this._blockFiller(e))}viewRangeToDom(t){const e=this.viewPositionToDom(t.start),n=this.viewPositionToDom(t.end),i=document.createRange();return i.setStart(e.parent,e.offset),i.setEnd(n.parent,n.offset),i}viewPositionToDom(t){const e=t.parent;if(e.is("text")){const n=this.findCorrespondingDomText(e);if(!n)return null;let i=t.offset;return Vo(n)&&(i+=7),{parent:n,offset:i}}{let n,i,o;if(0===t.offset){if(n=this.mapViewToDom(e),!n)return null;o=n.childNodes[0]}else{const e=t.nodeBefore;if(i=e.is("text")?this.findCorrespondingDomText(e):this.mapViewToDom(t.nodeBefore),!i)return null;n=i.parentNode,o=i.nextSibling}if(Ro(o)&&Vo(o))return{parent:o,offset:7};return{parent:n,offset:i?tr(i)+1:0}}}domToView(t,e={}){if(this.isBlockFiller(t,this.blockFillerMode))return null;const n=this.getParentUIElement(t,this._domToViewMapping);if(n)return n;if(Ro(t)){if(zo(t))return null;{const e=this._processDataFromDomText(t);return""===e?null:new Rn(this.document,e)}}if(this.isComment(t))return null;{if(this.mapDomToView(t))return this.mapDomToView(t);let n;if(this.isDocumentFragment(t))n=new xo(this.document),e.bind&&this.bindDocumentFragments(t,n);else{const i=e.keepOriginalCase?t.tagName:t.tagName.toLowerCase();n=new Oi(this.document,i),e.bind&&this.bindElements(t,n);const o=t.attributes;for(let t=o.length-1;t>=0;t--)n._setAttribute(o[t].name,o[t].value)}if(e.withChildren||void 0===e.withChildren)for(const i of this.domChildrenToView(t,e))n._appendChild(i);return n}}*domChildrenToView(t,e={}){for(let n=0;n<t.childNodes.length;n++){const i=t.childNodes[n],o=this.domToView(i,e);null!==o&&(yield o)}}domSelectionToView(t){if(1===t.rangeCount){let e=t.getRangeAt(0).startContainer;Ro(e)&&(e=e.parentNode);const n=this.fakeSelectionToView(e);if(n)return n}const e=this.isDomSelectionBackward(t),n=[];for(let e=0;e<t.rangeCount;e++){const i=t.getRangeAt(e),o=this.domRangeToView(i);o&&n.push(o)}return new no(n,{backward:e})}domRangeToView(t){const e=this.domPositionToView(t.startContainer,t.startOffset),n=this.domPositionToView(t.endContainer,t.endOffset);return e&&n?new Xi(e,n):null}domPositionToView(t,e){if(this.isBlockFiller(t,this.blockFillerMode))return this.domPositionToView(t.parentNode,tr(t));const n=this.mapDomToView(t);if(n&&n.is("uiElement"))return Zi._createBefore(n);if(Ro(t)){if(zo(t))return this.domPositionToView(t.parentNode,tr(t));const n=this.findCorrespondingViewText(t);let i=e;return n?(Vo(t)&&(i-=7,i=i<0?0:i),new Zi(n,i)):null}if(0===e){const e=this.mapDomToView(t);if(e)return new Zi(e,0)}else{const n=t.childNodes[e-1],i=Ro(n)?this.findCorrespondingViewText(n):this.mapDomToView(n);if(i&&i.parent)return new Zi(i.parent,i.index+1)}return null}mapDomToView(t){return this.getParentUIElement(t)||this._domToViewMapping.get(t)}findCorrespondingViewText(t){if(zo(t))return null;const e=this.getParentUIElement(t);if(e)return e;const n=t.previousSibling;if(n){if(!this.isElement(n))return null;const t=this.mapDomToView(n);if(t){return t.nextSibling instanceof Rn?t.nextSibling:null}}else{const e=this.mapDomToView(t.parentNode);if(e){const t=e.getChild(0);return t instanceof Rn?t:null}}return null}mapViewToDom(t){return this._viewToDomMapping.get(t)}findCorrespondingDomText(t){const e=t.previousSibling;return e&&this.mapViewToDom(e)?this.mapViewToDom(e).nextSibling:!e&&t.parent&&this.mapViewToDom(t.parent)?this.mapViewToDom(t.parent).childNodes[0]:null}focus(t){const e=this.mapViewToDom(t);if(e&&e.ownerDocument.activeElement!==e){const{scrollX:t,scrollY:n}=Xo.window,i=[];rr(e,t=>{const{scrollLeft:e,scrollTop:n}=t;i.push([e,n])}),e.focus(),rr(e,t=>{const[e,n]=i.shift();t.scrollLeft=e,t.scrollTop=n}),Xo.window.scrollTo(t,n)}}isElement(t){return t&&t.nodeType==Node.ELEMENT_NODE}isDocumentFragment(t){return t&&t.nodeType==Node.DOCUMENT_FRAGMENT_NODE}isComment(t){return t&&t.nodeType==Node.COMMENT_NODE}isBlockFiller(t){return"br"==this.blockFillerMode?t.isEqualNode(nr):!("BR"!==t.tagName||!sr(t,this.blockElements)||1!==t.parentNode.childNodes.length)||function(t,e){return Ro(t)&&" "==t.data&&sr(t,e)&&1===t.parentNode.childNodes.length}(t,this.blockElements)}isDomSelectionBackward(t){if(t.isCollapsed)return!1;const e=document.createRange();e.setStart(t.anchorNode,t.anchorOffset),e.setEnd(t.focusNode,t.focusOffset);const n=e.collapsed;return e.detach(),n}getParentUIElement(t){const e=er(t);for(e.pop();e.length;){const t=e.pop(),n=this._domToViewMapping.get(t);if(n&&n.is("uiElement"))return n}return null}isDomSelectionCorrect(t){return this._isDomSelectionPositionCorrect(t.anchorNode,t.anchorOffset)&&this._isDomSelectionPositionCorrect(t.focusNode,t.focusOffset)}_isDomSelectionPositionCorrect(t,e){if(Ro(t)&&Vo(t)&&e<7)return!1;if(this.isElement(t)&&Vo(t.childNodes[e]))return!1;const n=this.mapDomToView(t);return!n||!n.is("uiElement")}_processDataFromViewText(t){let e=t.data;if(t.getAncestors().some(t=>this.preElements.includes(t.name)))return e;if(" "==e.charAt(0)){const n=this._getTouchingViewTextNode(t,!1);!(n&&this._nodeEndsWithSpace(n))&&n||(e=" "+e.substr(1))}if(" "==e.charAt(e.length-1)){const n=this._getTouchingViewTextNode(t,!0);" "!=e.charAt(e.length-2)&&n&&" "!=n.data.charAt(0)||(e=e.substr(0,e.length-1)+" ")}return e.replace(/ {2}/g,"  ")}_nodeEndsWithSpace(t){if(t.getAncestors().some(t=>this.preElements.includes(t.name)))return!1;const e=this._processDataFromViewText(t);return" "==e.charAt(e.length-1)}_processDataFromDomText(t){let e=t.data;if(or(t,this.preElements))return Bo(t);e=e.replace(/[ \n\t\r]{1,}/g," ");const n=this._getTouchingInlineDomNode(t,!1),i=this._getTouchingInlineDomNode(t,!0),o=this._checkShouldLeftTrimDomText(n),r=this._checkShouldRightTrimDomText(t,i);return o&&(e=e.replace(/^ /,"")),r&&(e=e.replace(/ $/,"")),e=Bo(new Text(e)),e=e.replace(/ \u00A0/g,"  "),(/( |\u00A0)\u00A0$/.test(e)||!i||i.data&&" "==i.data.charAt(0))&&(e=e.replace(/\u00A0$/," ")),o&&(e=e.replace(/^\u00A0/," ")),e}_checkShouldLeftTrimDomText(t){return!t||(!!nn(t)||/[^\S\u00A0]/.test(t.data.charAt(t.data.length-1)))}_checkShouldRightTrimDomText(t,e){return!e&&!Vo(t)}_getTouchingViewTextNode(t,e){const n=new Ji({startPosition:e?Zi._createAfter(t):Zi._createBefore(t),direction:e?"forward":"backward"});for(const t of n){if(t.item.is("containerElement"))return null;if(t.item.is("br"))return null;if(t.item.is("textProxy"))return t.item}return null}_getTouchingInlineDomNode(t,e){if(!t.parentNode)return null;const n=e?"nextNode":"previousNode",i=t.ownerDocument,o=er(t)[0],r=i.createTreeWalker(o,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode:t=>Ro(t)||"BR"==t.tagName?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP});r.currentNode=t;const s=r[n]();if(null!==s){const e=function(t,e){const n=er(t),i=er(e);let o=0;for(;n[o]==i[o]&&n[o];)o++;return 0===o?null:n[o-1]}(t,s);if(e&&!or(t,this.blockElements,e)&&!or(s,this.blockElements,e))return s}return null}}function or(t,e,n){let i=er(t);return n&&(i=i.slice(i.indexOf(n)+1)),i.some(t=>t.tagName&&e.includes(t.tagName.toLowerCase()))}function rr(t,e){for(;t&&t!=Xo.document;)e(t),t=t.parentNode}function sr(t,e){const n=t.parentNode;return n&&n.tagName&&e.includes(n.tagName.toLowerCase())}function ar(t){const e=Object.prototype.toString.apply(t);return"[object Window]"==e||"[object global]"==e}var cr=ji({},gn,{listenTo(t,...e){if($o(t)||ar(t)){const n=this._getProxyEmitter(t)||new lr(t);n.attach(...e),t=n}gn.listenTo.call(this,t,...e)},stopListening(t,e,n){if($o(t)||ar(t)){const e=this._getProxyEmitter(t);if(!e)return;t=e}gn.stopListening.call(this,t,e,n),t instanceof lr&&t.detach(e)},_getProxyEmitter(t){return e=this,n=dr(t),e[fn]&&e[fn][n]?e[fn][n].emitter:null;var e,n}});class lr{constructor(t){pn(this,dr(t)),this._domNode=t}}function dr(t){return t["data-ck-expando"]||(t["data-ck-expando"]=dn())}ji(lr.prototype,gn,{attach(t,e,n={}){if(this._domListeners&&this._domListeners[t])return;const i=this._createDomListener(t,!!n.useCapture);this._domNode.addEventListener(t,i,!!n.useCapture),this._domListeners||(this._domListeners={}),this._domListeners[t]=i},detach(t){let e;!this._domListeners[t]||(e=this._events[t])&&e.callbacks.length||this._domListeners[t].removeListener()},_createDomListener(t,e){const n=e=>{this.fire(t,e)};return n.removeListener=()=>{this._domNode.removeEventListener(t,n,e),delete this._domListeners[t]},n}});class ur{constructor(t){this.view=t,this.document=t.document,this.isEnabled=!1}enable(){this.isEnabled=!0}disable(){this.isEnabled=!1}destroy(){this.disable(),this.stopListening()}}xn(ur,cr);var hr=function(t){return this.__data__.set(t,"__lodash_hash_undefined__"),this};var fr=function(t){return this.__data__.has(t)};function mr(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new kt;++e<n;)this.add(t[e])}mr.prototype.add=mr.prototype.push=hr,mr.prototype.has=fr;var gr=mr;var pr=function(t,e){for(var n=-1,i=null==t?0:t.length;++n<i;)if(e(t[n],n,t))return!0;return!1};var br=function(t,e){return t.has(e)};var wr=function(t,e,n,i,o,r){var s=1&n,a=t.length,c=e.length;if(a!=c&&!(s&&c>a))return!1;var l=r.get(t);if(l&&r.get(e))return l==e;var d=-1,u=!0,h=2&n?new gr:void 0;for(r.set(t,e),r.set(e,t);++d<a;){var f=t[d],m=e[d];if(i)var g=s?i(m,f,d,e,t,r):i(f,m,d,t,e,r);if(void 0!==g){if(g)continue;u=!1;break}if(h){if(!pr(e,(function(t,e){if(!br(h,e)&&(f===t||o(f,t,n,i,r)))return h.push(e)}))){u=!1;break}}else if(f!==m&&!o(f,m,n,i,r)){u=!1;break}}return r.delete(t),r.delete(e),u};var kr=function(t){var e=-1,n=Array(t.size);return t.forEach((function(t,i){n[++e]=[i,t]})),n};var _r=function(t){var e=-1,n=Array(t.size);return t.forEach((function(t){n[++e]=t})),n},vr=o?o.prototype:void 0,yr=vr?vr.valueOf:void 0;var xr=function(t,e,n,i,o,r,s){switch(n){case"[object DataView]":if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case"[object ArrayBuffer]":return!(t.byteLength!=e.byteLength||!r(new Re(t),new Re(e)));case"[object Boolean]":case"[object Date]":case"[object Number]":return A(+t,+e);case"[object Error]":return t.name==e.name&&t.message==e.message;case"[object RegExp]":case"[object String]":return t==e+"";case"[object Map]":var a=kr;case"[object Set]":var c=1&i;if(a||(a=_r),t.size!=e.size&&!c)return!1;var l=s.get(t);if(l)return l==e;i|=2,s.set(t,e);var d=wr(a(t),a(e),i,o,r,s);return s.delete(t),d;case"[object Symbol]":if(yr)return yr.call(t)==yr.call(e)}return!1},Ar=Object.prototype.hasOwnProperty;var Tr=function(t,e,n,i,o,r){var s=1&n,a=ke(t),c=a.length;if(c!=ke(e).length&&!s)return!1;for(var l=c;l--;){var d=a[l];if(!(s?d in e:Ar.call(e,d)))return!1}var u=r.get(t);if(u&&r.get(e))return u==e;var h=!0;r.set(t,e),r.set(e,t);for(var f=s;++l<c;){var m=t[d=a[l]],g=e[d];if(i)var p=s?i(g,m,d,e,t,r):i(m,g,d,t,e,r);if(!(void 0===p?m===g||o(m,g,n,i,r):p)){h=!1;break}f||(f="constructor"==d)}if(h&&!f){var b=t.constructor,w=e.constructor;b==w||!("constructor"in t)||!("constructor"in e)||"function"==typeof b&&b instanceof b&&"function"==typeof w&&w instanceof w||(h=!1)}return r.delete(t),r.delete(e),h},Cr=Object.prototype.hasOwnProperty;var Pr=function(t,e,n,i,o,r){var s=Dt(t),a=Dt(e),c=s?"[object Array]":Ie(t),l=a?"[object Array]":Ie(e),d="[object Object]"==(c="[object Arguments]"==c?"[object Object]":c),u="[object Object]"==(l="[object Arguments]"==l?"[object Object]":l),h=c==l;if(h&&Object(Lt.a)(t)){if(!Object(Lt.a)(e))return!1;s=!0,d=!1}if(h&&!d)return r||(r=new yt),s||Wt(t)?wr(t,e,n,i,o,r):xr(t,e,c,n,i,o,r);if(!(1&n)){var f=d&&Cr.call(t,"__wrapped__"),m=u&&Cr.call(e,"__wrapped__");if(f||m){var g=f?t.value():t,p=m?e.value():e;return r||(r=new yt),o(g,p,n,i,r)}}return!!h&&(r||(r=new yt),Tr(t,e,n,i,o,r))};var Sr=function t(e,n,i,o,r){return e===n||(null==e||null==n||!p(e)&&!p(n)?e!=e&&n!=n:Pr(e,n,i,o,t,r))};var Mr=function(t,e,n){var i=(n="function"==typeof n?n:void 0)?n(t,e):void 0;return void 0===i?Sr(t,e,void 0,n):!!i};class Er extends ur{constructor(t){super(t),this._config={childList:!0,characterData:!0,characterDataOldValue:!0,subtree:!0},this.domConverter=t.domConverter,this.renderer=t._renderer,this._domElements=[],this._mutationObserver=new window.MutationObserver(this._onMutations.bind(this))}flush(){this._onMutations(this._mutationObserver.takeRecords())}observe(t){this._domElements.push(t),this.isEnabled&&this._mutationObserver.observe(t,this._config)}enable(){super.enable();for(const t of this._domElements)this._mutationObserver.observe(t,this._config)}disable(){super.disable(),this._mutationObserver.disconnect()}destroy(){super.destroy(),this._mutationObserver.disconnect()}_onMutations(t){if(0===t.length)return;const e=this.domConverter,n=new Map,i=new Set;for(const n of t)if("childList"===n.type){const t=e.mapDomToView(n.target);if(t&&t.is("uiElement"))continue;t&&!this._isBogusBrMutation(n)&&i.add(t)}for(const o of t){const t=e.mapDomToView(o.target);if((!t||!t.is("uiElement"))&&"characterData"===o.type){const t=e.findCorrespondingViewText(o.target);t&&!i.has(t.parent)?n.set(t,{type:"text",oldText:t.data,newText:Bo(o.target),node:t}):!t&&Vo(o.target)&&i.add(e.mapDomToView(o.target.parentNode))}}const o=[];for(const t of n.values())this.renderer.markToSync("text",t.node),o.push(t);for(const t of i){const n=e.mapViewToDom(t),i=Array.from(t.getChildren()),r=Array.from(e.domChildrenToView(n,{withChildren:!1}));Mr(i,r,a)||(this.renderer.markToSync("children",t),o.push({type:"children",oldChildren:i,newChildren:r,node:t}))}const r=t[0].target.ownerDocument.getSelection();let s=null;if(r&&r.anchorNode){const t=e.domPositionToView(r.anchorNode,r.anchorOffset),n=e.domPositionToView(r.focusNode,r.focusOffset);t&&n&&(s=new no(t),s.setFocus(n))}function a(t,e){if(!Array.isArray(t))return t===e||!(!t.is("text")||!e.is("text"))&&t.data===e.data}o.length&&(this.document.fire("mutations",o,s),this.view.forceRender())}_isBogusBrMutation(t){let e=null;return null===t.nextSibling&&0===t.removedNodes.length&&1==t.addedNodes.length&&(e=this.domConverter.domToView(t.addedNodes[0],{withChildren:!1})),e&&e.is("element","br")}}class Ir{constructor(t,e,n){this.view=t,this.document=t.document,this.domEvent=e,this.domTarget=e.target,ji(this,n)}get target(){return this.view.domConverter.mapDomToView(this.domTarget)}preventDefault(){this.domEvent.preventDefault()}stopPropagation(){this.domEvent.stopPropagation()}}class Nr extends ur{constructor(t){super(t),this.useCapture=!1}observe(t){("string"==typeof this.domEventType?[this.domEventType]:this.domEventType).forEach(e=>{this.listenTo(t,e,(t,e)=>{this.isEnabled&&this.onDomEvent(e)},{useCapture:this.useCapture})})}fire(t,e,n){this.isEnabled&&this.document.fire(t,new Ir(this.view,e,n))}}class Or extends Nr{constructor(t){super(t),this.domEventType=["keydown","keyup"]}onDomEvent(t){this.fire(t.type,t,{keyCode:t.keyCode,altKey:t.altKey,ctrlKey:t.ctrlKey||t.metaKey,shiftKey:t.shiftKey,get keystroke(){return po(this)}})}}var Rr=function(){return i.a.Date.now()},Dr=/^\s+|\s+$/g,Lr=/^[-+]0x[0-9a-f]+$/i,jr=/^0b[01]+$/i,Vr=/^0o[0-7]+$/i,zr=parseInt;var Br=function(t){if("number"==typeof t)return t;if(zn(t))return NaN;if(j(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=j(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(Dr,"");var n=jr.test(t);return n||Vr.test(t)?zr(t.slice(2),n?2:8):Lr.test(t)?NaN:+t},Fr=Math.max,Ur=Math.min;var Hr=function(t,e,n){var i,o,r,s,a,c,l=0,d=!1,u=!1,h=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function f(e){var n=i,r=o;return i=o=void 0,l=e,s=t.apply(r,n)}function m(t){return l=t,a=setTimeout(p,e),d?f(t):s}function g(t){var n=t-c;return void 0===c||n>=e||n<0||u&&t-l>=r}function p(){var t=Rr();if(g(t))return b(t);a=setTimeout(p,function(t){var n=e-(t-c);return u?Ur(n,r-(t-l)):n}(t))}function b(t){return a=void 0,h&&i?f(t):(i=o=void 0,s)}function w(){var t=Rr(),n=g(t);if(i=arguments,o=this,c=t,n){if(void 0===a)return m(c);if(u)return clearTimeout(a),a=setTimeout(p,e),f(c)}return void 0===a&&(a=setTimeout(p,e)),s}return e=Br(e)||0,j(n)&&(d=!!n.leading,r=(u="maxWait"in n)?Fr(Br(n.maxWait)||0,e):r,h="trailing"in n?!!n.trailing:h),w.cancel=function(){void 0!==a&&clearTimeout(a),l=0,i=c=o=a=void 0},w.flush=function(){return void 0===a?s:b(Rr())},w};class qr extends ur{constructor(t){super(t),this._fireSelectionChangeDoneDebounced=Hr(t=>this.document.fire("selectionChangeDone",t),200)}observe(){const t=this.document;t.on("keydown",(e,n)=>{var i;t.selection.isFake&&((i=n.keyCode)==go.arrowright||i==go.arrowleft||i==go.arrowup||i==go.arrowdown)&&this.isEnabled&&(n.preventDefault(),this._handleSelectionMove(n.keyCode))},{priority:"lowest"})}destroy(){super.destroy(),this._fireSelectionChangeDoneDebounced.cancel()}_handleSelectionMove(t){const e=this.document.selection,n=new no(e.getRanges(),{backward:e.isBackward,fake:!1});t!=go.arrowleft&&t!=go.arrowup||n.setTo(n.getFirstPosition()),t!=go.arrowright&&t!=go.arrowdown||n.setTo(n.getLastPosition());const i={oldSelection:e,newSelection:n,domSelection:null};this.document.fire("selectionChange",i),this._fireSelectionChangeDoneDebounced(i)}}class Wr extends ur{constructor(t){super(t),this.mutationObserver=t.getObserver(Er),this.selection=this.document.selection,this.domConverter=t.domConverter,this._documents=new WeakSet,this._fireSelectionChangeDoneDebounced=Hr(t=>this.document.fire("selectionChangeDone",t),200),this._clearInfiniteLoopInterval=setInterval(()=>this._clearInfiniteLoop(),1e3),this._loopbackCounter=0}observe(t){const e=t.ownerDocument;this._documents.has(e)||(this.listenTo(e,"selectionchange",()=>{this._handleSelectionChange(e)}),this._documents.add(e))}destroy(){super.destroy(),clearInterval(this._clearInfiniteLoopInterval),this._fireSelectionChangeDoneDebounced.cancel()}_handleSelectionChange(t){if(!this.isEnabled)return;this.mutationObserver.flush();const e=t.defaultView.getSelection(),n=this.domConverter.domSelectionToView(e);if(0!=n.rangeCount){if(this.view.hasDomSelection=!0,!(this.selection.isEqual(n)&&this.domConverter.isDomSelectionCorrect(e)||++this._loopbackCounter>60))if(this.selection.isSimilar(n))this.view.forceRender();else{const t={oldSelection:this.selection,newSelection:n,domSelection:e};this.document.fire("selectionChange",t),this._fireSelectionChangeDoneDebounced(t)}}else this.view.hasDomSelection=!1}_clearInfiniteLoop(){this._loopbackCounter=0}}class Yr extends Nr{constructor(t){super(t),this.domEventType=["focus","blur"],this.useCapture=!0;const e=this.document;e.on("focus",()=>{e.isFocused=!0,this._renderTimeoutId=setTimeout(()=>t.forceRender(),50)}),e.on("blur",(n,i)=>{const o=e.selection.editableElement;null!==o&&o!==i.target||(e.isFocused=!1,t.forceRender())})}onDomEvent(t){this.fire(t.type,t)}destroy(){this._renderTimeoutId&&clearTimeout(this._renderTimeoutId),super.destroy()}}class Gr extends Nr{constructor(t){super(t),this.domEventType=["compositionstart","compositionupdate","compositionend"];const e=this.document;e.on("compositionstart",()=>{e.isComposing=!0}),e.on("compositionend",()=>{e.isComposing=!1})}onDomEvent(t){this.fire(t.type,t)}}class $r extends Nr{constructor(t){super(t),this.domEventType=["beforeinput"]}onDomEvent(t){this.fire(t.type,t)}}function Qr(t){return"[object Range]"==Object.prototype.toString.apply(t)}function Kr(t){const e=t.ownerDocument.defaultView.getComputedStyle(t);return{top:parseInt(e.borderTopWidth,10),right:parseInt(e.borderRightWidth,10),bottom:parseInt(e.borderBottomWidth,10),left:parseInt(e.borderLeftWidth,10)}}const Jr=["top","right","bottom","left","width","height"];class Zr{constructor(t){const e=Qr(t);if(Object.defineProperty(this,"_source",{value:t._source||t,writable:!0,enumerable:!1}),nn(t)||e)Xr(this,e?Zr.getDomRangeRects(t)[0]:t.getBoundingClientRect());else if(ar(t)){const{innerWidth:e,innerHeight:n}=t;Xr(this,{top:0,right:e,bottom:n,left:0,width:e,height:n})}else Xr(this,t)}clone(){return new Zr(this)}moveTo(t,e){return this.top=e,this.right=t+this.width,this.bottom=e+this.height,this.left=t,this}moveBy(t,e){return this.top+=e,this.right+=t,this.left+=t,this.bottom+=e,this}getIntersection(t){const e={top:Math.max(this.top,t.top),right:Math.min(this.right,t.right),bottom:Math.min(this.bottom,t.bottom),left:Math.max(this.left,t.left)};return e.width=e.right-e.left,e.height=e.bottom-e.top,e.width<0||e.height<0?null:new Zr(e)}getIntersectionArea(t){const e=this.getIntersection(t);return e?e.getArea():0}getArea(){return this.width*this.height}getVisible(){const t=this._source;let e=this.clone();if(!ts(t)){let n=t.parentNode||t.commonAncestorContainer;for(;n&&!ts(n);){const t=new Zr(n),i=e.getIntersection(t);if(!i)return null;i.getArea()<e.getArea()&&(e=i),n=n.parentNode}}return e}isEqual(t){for(const e of Jr)if(this[e]!==t[e])return!1;return!0}contains(t){const e=this.getIntersection(t);return!(!e||!e.isEqual(t))}excludeScrollbarsAndBorders(){const t=this._source;let e,n,i;if(ar(t))e=t.innerWidth-t.document.documentElement.clientWidth,n=t.innerHeight-t.document.documentElement.clientHeight,i=t.getComputedStyle(t.document.documentElement).direction;else{const o=Kr(this._source);e=t.offsetWidth-t.clientWidth-o.left-o.right,n=t.offsetHeight-t.clientHeight-o.top-o.bottom,i=t.ownerDocument.defaultView.getComputedStyle(t).direction,this.left+=o.left,this.top+=o.top,this.right-=o.right,this.bottom-=o.bottom,this.width=this.right-this.left,this.height=this.bottom-this.top}return this.width-=e,"ltr"===i?this.right-=e:this.left+=e,this.height-=n,this.bottom-=n,this}static getDomRangeRects(t){const e=[],n=Array.from(t.getClientRects());if(n.length)for(const t of n)e.push(new Zr(t));else{let n=t.startContainer;Ro(n)&&(n=n.parentNode);const i=new Zr(n.getBoundingClientRect());i.right=i.left,i.width=0,e.push(i)}return e}}function Xr(t,e){for(const n of Jr)t[n]=e[n]}function ts(t){return!!nn(t)&&t===t.ownerDocument.body}function es({target:t,viewportOffset:e=0}){const n=cs(t);let i=n,o=null;for(;i;){let r;r=ls(i==n?t:o),is(r,()=>ds(t,i));const s=ds(t,i);if(ns(i,s,e),i.parent!=i){if(o=i.frameElement,i=i.parent,!o)return}else i=null}}function ns(t,e,n){const i=e.clone().moveBy(0,n),o=e.clone().moveBy(0,-n),r=new Zr(t).excludeScrollbarsAndBorders();if(![o,i].every(t=>r.contains(t))){let{scrollX:s,scrollY:a}=t;rs(o,r)?a-=r.top-e.top+n:os(i,r)&&(a+=e.bottom-r.bottom+n),ss(e,r)?s-=r.left-e.left+n:as(e,r)&&(s+=e.right-r.right+n),t.scrollTo(s,a)}}function is(t,e){const n=cs(t);let i,o;for(;t!=n.document.body;)o=e(),i=new Zr(t).excludeScrollbarsAndBorders(),i.contains(o)||(rs(o,i)?t.scrollTop-=i.top-o.top:os(o,i)&&(t.scrollTop+=o.bottom-i.bottom),ss(o,i)?t.scrollLeft-=i.left-o.left:as(o,i)&&(t.scrollLeft+=o.right-i.right)),t=t.parentNode}function os(t,e){return t.bottom>e.bottom}function rs(t,e){return t.top<e.top}function ss(t,e){return t.left<e.left}function as(t,e){return t.right>e.right}function cs(t){return Qr(t)?t.startContainer.ownerDocument.defaultView:t.ownerDocument.defaultView}function ls(t){if(Qr(t)){let e=t.commonAncestorContainer;return Ro(e)&&(e=e.parentNode),e}return t.parentNode}function ds(t,e){const n=cs(t),i=new Zr(t);if(n===e)return i;{let t=n;for(;t!=e;){const e=t.frameElement,n=new Zr(e).excludeScrollbarsAndBorders();i.moveBy(n.left,n.top),t=t.parent}}return i}Object.assign({},{scrollViewportToShowTarget:es,scrollAncestorsToShowTarget:function(t){is(ls(t),()=>new Zr(t))}});class us{constructor(t){this.document=new oo(t),this.domConverter=new ir(this.document),this.domRoots=new Map,this.set("isRenderingInProgress",!1),this.set("hasDomSelection",!1),this._renderer=new Qo(this.domConverter,this.document.selection),this._renderer.bind("isFocused").to(this.document),this._initialDomRootAttributes=new WeakMap,this._observers=new Map,this._ongoingChange=!1,this._postFixersInProgress=!1,this._renderingDisabled=!1,this._hasChangedSinceTheLastRendering=!1,this._writer=new Ao(this.document),this.addObserver(Er),this.addObserver(Wr),this.addObserver(Yr),this.addObserver(Or),this.addObserver(qr),this.addObserver(Gr),ho.isAndroid&&this.addObserver($r),this.document.on("keydown",Fo),vo(this),this.on("render",()=>{this._render(),this.document.fire("layoutChanged"),this._hasChangedSinceTheLastRendering=!1}),this.listenTo(this.document.selection,"change",()=>{this._hasChangedSinceTheLastRendering=!0})}attachDomRoot(t,e="main"){const n=this.document.getRoot(e);n._name=t.tagName.toLowerCase();const i={};for(const{name:e,value:o}of Array.from(t.attributes))i[e]=o,"class"===e?this._writer.addClass(o.split(" "),n):this._writer.setAttribute(e,o,n);this._initialDomRootAttributes.set(t,i);const o=()=>{this._writer.setAttribute("contenteditable",!n.isReadOnly,n),n.isReadOnly?this._writer.addClass("ck-read-only",n):this._writer.removeClass("ck-read-only",n)};o(),this.domRoots.set(e,t),this.domConverter.bindElements(t,n),this._renderer.markToSync("children",n),this._renderer.markToSync("attributes",n),this._renderer.domDocuments.add(t.ownerDocument),n.on("change:children",(t,e)=>this._renderer.markToSync("children",e)),n.on("change:attributes",(t,e)=>this._renderer.markToSync("attributes",e)),n.on("change:text",(t,e)=>this._renderer.markToSync("text",e)),n.on("change:isReadOnly",()=>this.change(o)),n.on("change",()=>{this._hasChangedSinceTheLastRendering=!0});for(const n of this._observers.values())n.observe(t,e)}detachDomRoot(t){const e=this.domRoots.get(t);Array.from(e.attributes).forEach(({name:t})=>e.removeAttribute(t));const n=this._initialDomRootAttributes.get(e);for(const t in n)e.setAttribute(t,n[t]);this.domRoots.delete(t),this.domConverter.unbindDomElement(e)}getDomRoot(t="main"){return this.domRoots.get(t)}addObserver(t){let e=this._observers.get(t);if(e)return e;e=new t(this),this._observers.set(t,e);for(const[t,n]of this.domRoots)e.observe(n,t);return e.enable(),e}getObserver(t){return this._observers.get(t)}disableObservers(){for(const t of this._observers.values())t.disable()}enableObservers(){for(const t of this._observers.values())t.enable()}scrollToTheSelection(){const t=this.document.selection.getFirstRange();t&&es({target:this.domConverter.viewRangeToDom(t),viewportOffset:20})}focus(){if(!this.document.isFocused){const t=this.document.selection.editableElement;t&&(this.domConverter.focus(t),this.forceRender())}}change(t){if(this.isRenderingInProgress||this._postFixersInProgress)throw new hn.b("cannot-change-view-tree: Attempting to make changes to the view when it is in an incorrect state: rendering or post-fixers are in progress. This may cause some unexpected behavior and inconsistency between the DOM and the view.",this);try{if(this._ongoingChange)return t(this._writer);this._ongoingChange=!0;const e=t(this._writer);return this._ongoingChange=!1,!this._renderingDisabled&&this._hasChangedSinceTheLastRendering&&(this._postFixersInProgress=!0,this.document._callPostFixers(this._writer),this._postFixersInProgress=!1,this.fire("render")),e}catch(t){hn.b.rethrowUnexpectedError(t,this)}}forceRender(){this._hasChangedSinceTheLastRendering=!0,this.change(()=>{})}destroy(){for(const t of this._observers.values())t.destroy();this.document.destroy(),this.stopListening()}createPositionAt(t,e){return Zi._createAt(t,e)}createPositionAfter(t){return Zi._createAfter(t)}createPositionBefore(t){return Zi._createBefore(t)}createRange(t,e){return new Xi(t,e)}createRangeOn(t){return Xi._createOn(t)}createRangeIn(t){return Xi._createIn(t)}createSelection(t,e,n){return new no(t,e,n)}_disableRendering(t){this._renderingDisabled=t,0==t&&this.change(()=>{})}_render(){this.isRenderingInProgress=!0,this.disableObservers(),this._renderer.render(),this.enableObservers(),this.isRenderingInProgress=!1}}xn(us,Ui);class hs{constructor(t){this.parent=null,this._attrs=Ln(t)}get index(){let t;if(!this.parent)return null;if(null===(t=this.parent.getChildIndex(this)))throw new hn.b("model-node-not-found-in-parent: The node's parent does not contain this node.",this);return t}get startOffset(){let t;if(!this.parent)return null;if(null===(t=this.parent.getChildStartOffset(this)))throw new hn.b("model-node-not-found-in-parent: The node's parent does not contain this node.",this);return t}get offsetSize(){return 1}get endOffset(){return this.parent?this.startOffset+this.offsetSize:null}get nextSibling(){const t=this.index;return null!==t&&this.parent.getChild(t+1)||null}get previousSibling(){const t=this.index;return null!==t&&this.parent.getChild(t-1)||null}get root(){let t=this;for(;t.parent;)t=t.parent;return t}isAttached(){return this.root.is("rootElement")}getPath(){const t=[];let e=this;for(;e.parent;)t.unshift(e.startOffset),e=e.parent;return t}getAncestors(t={includeSelf:!1,parentFirst:!1}){const e=[];let n=t.includeSelf?this:this.parent;for(;n;)e[t.parentFirst?"push":"unshift"](n),n=n.parent;return e}getCommonAncestor(t,e={}){const n=this.getAncestors(e),i=t.getAncestors(e);let o=0;for(;n[o]==i[o]&&n[o];)o++;return 0===o?null:n[o-1]}isBefore(t){if(this==t)return!1;if(this.root!==t.root)return!1;const e=this.getPath(),n=t.getPath(),i=In(e,n);switch(i){case"prefix":return!0;case"extension":return!1;default:return e[i]<n[i]}}isAfter(t){return this!=t&&(this.root===t.root&&!this.isBefore(t))}hasAttribute(t){return this._attrs.has(t)}getAttribute(t){return this._attrs.get(t)}getAttributes(){return this._attrs.entries()}getAttributeKeys(){return this._attrs.keys()}toJSON(){const t={};return this._attrs.size&&(t.attributes=Array.from(this._attrs).reduce((t,e)=>(t[e[0]]=e[1],t),{})),t}is(t){return"node"===t||"model:node"===t}_clone(){return new hs(this._attrs)}_remove(){this.parent._removeChildren(this.index)}_setAttribute(t,e){this._attrs.set(t,e)}_setAttributesTo(t){this._attrs=Ln(t)}_removeAttribute(t){return this._attrs.delete(t)}_clearAttributes(){this._attrs.clear()}}class fs extends hs{constructor(t,e){super(e),this._data=t||""}get offsetSize(){return this.data.length}get data(){return this._data}is(t){return"text"===t||"model:text"===t||"node"===t||"model:node"===t}toJSON(){const t=super.toJSON();return t.data=this.data,t}_clone(){return new fs(this.data,this.getAttributes())}static fromJSON(t){return new fs(t.data,t.attributes)}}class ms{constructor(t,e,n){if(this.textNode=t,e<0||e>t.offsetSize)throw new hn.b("model-textproxy-wrong-offsetintext: Given offsetInText value is incorrect.",this);if(n<0||e+n>t.offsetSize)throw new hn.b("model-textproxy-wrong-length: Given length value is incorrect.",this);this.data=t.data.substring(e,e+n),this.offsetInText=e}get startOffset(){return null!==this.textNode.startOffset?this.textNode.startOffset+this.offsetInText:null}get offsetSize(){return this.data.length}get endOffset(){return null!==this.startOffset?this.startOffset+this.offsetSize:null}get isPartial(){return this.offsetSize!==this.textNode.offsetSize}get parent(){return this.textNode.parent}get root(){return this.textNode.root}is(t){return"textProxy"===t||"model:textProxy"===t}getPath(){const t=this.textNode.getPath();return t.length>0&&(t[t.length-1]+=this.offsetInText),t}getAncestors(t={includeSelf:!1,parentFirst:!1}){const e=[];let n=t.includeSelf?this:this.parent;for(;n;)e[t.parentFirst?"push":"unshift"](n),n=n.parent;return e}hasAttribute(t){return this.textNode.hasAttribute(t)}getAttribute(t){return this.textNode.getAttribute(t)}getAttributes(){return this.textNode.getAttributes()}getAttributeKeys(){return this.textNode.getAttributeKeys()}}class gs{constructor(t){this._nodes=[],t&&this._insertNodes(0,t)}[Symbol.iterator](){return this._nodes[Symbol.iterator]()}get length(){return this._nodes.length}get maxOffset(){return this._nodes.reduce((t,e)=>t+e.offsetSize,0)}getNode(t){return this._nodes[t]||null}getNodeIndex(t){const e=this._nodes.indexOf(t);return-1==e?null:e}getNodeStartOffset(t){const e=this.getNodeIndex(t);return null===e?null:this._nodes.slice(0,e).reduce((t,e)=>t+e.offsetSize,0)}indexToOffset(t){if(t==this._nodes.length)return this.maxOffset;const e=this._nodes[t];if(!e)throw new hn.b("model-nodelist-index-out-of-bounds: Given index cannot be found in the node list.",this);return this.getNodeStartOffset(e)}offsetToIndex(t){let e=0;for(const n of this._nodes){if(t>=e&&t<e+n.offsetSize)return this.getNodeIndex(n);e+=n.offsetSize}if(e!=t)throw new hn.b("model-nodelist-offset-out-of-bounds: Given offset cannot be found in the node list.",this,{offset:t,nodeList:this});return this.length}_insertNodes(t,e){for(const t of e)if(!(t instanceof hs))throw new hn.b("model-nodelist-insertNodes-not-node: Trying to insert an object which is not a Node instance.",this);this._nodes.splice(t,0,...e)}_removeNodes(t,e=1){return this._nodes.splice(t,e)}toJSON(){return this._nodes.map(t=>t.toJSON())}}class ps extends hs{constructor(t,e,n){super(e),this.name=t,this._children=new gs,n&&this._insertChild(0,n)}get childCount(){return this._children.length}get maxOffset(){return this._children.maxOffset}get isEmpty(){return 0===this.childCount}is(t,e=null){return e?e===this.name&&("element"===t||"model:element"===t):"element"===t||"model:element"===t||t===this.name||t==="model:"+this.name||"node"===t||"model:node"===t}getChild(t){return this._children.getNode(t)}getChildren(){return this._children[Symbol.iterator]()}getChildIndex(t){return this._children.getNodeIndex(t)}getChildStartOffset(t){return this._children.getNodeStartOffset(t)}offsetToIndex(t){return this._children.offsetToIndex(t)}getNodeByPath(t){let e=this;for(const n of t)e=e.getChild(e.offsetToIndex(n));return e}toJSON(){const t=super.toJSON();if(t.name=this.name,this._children.length>0){t.children=[];for(const e of this._children)t.children.push(e.toJSON())}return t}_clone(t=!1){const e=t?Array.from(this._children).map(t=>t._clone(!0)):null;return new ps(this.name,this.getAttributes(),e)}_appendChild(t){this._insertChild(this.childCount,t)}_insertChild(t,e){const n=function(t){if("string"==typeof t)return[new fs(t)];yn(t)||(t=[t]);return Array.from(t).map(t=>"string"==typeof t?new fs(t):t instanceof ms?new fs(t.data,t.getAttributes()):t)}(e);for(const t of n)null!==t.parent&&t._remove(),t.parent=this;this._children._insertNodes(t,n)}_removeChildren(t,e=1){const n=this._children._removeNodes(t,e);for(const t of n)t.parent=null;return n}static fromJSON(t){let e=null;if(t.children){e=[];for(const n of t.children)n.name?e.push(ps.fromJSON(n)):e.push(fs.fromJSON(n))}return new ps(t.name,t.attributes,e)}}class bs{constructor(t={}){if(!t.boundaries&&!t.startPosition)throw new hn.b("model-tree-walker-no-start-position: Neither boundaries nor starting position have been defined.",null);const e=t.direction||"forward";if("forward"!=e&&"backward"!=e)throw new hn.b("model-tree-walker-unknown-direction: Only `backward` and `forward` direction allowed.",t,{direction:e});this.direction=e,this.boundaries=t.boundaries||null,t.startPosition?this.position=t.startPosition.clone():this.position=ks._createAt(this.boundaries["backward"==this.direction?"end":"start"]),this.position.stickiness="toNone",this.singleCharacters=!!t.singleCharacters,this.shallow=!!t.shallow,this.ignoreElementEnd=!!t.ignoreElementEnd,this._boundaryStartParent=this.boundaries?this.boundaries.start.parent:null,this._boundaryEndParent=this.boundaries?this.boundaries.end.parent:null,this._visitedParent=this.position.parent}[Symbol.iterator](){return this}skip(t){let e,n,i,o;do{i=this.position,o=this._visitedParent,({done:e,value:n}=this.next())}while(!e&&t(n));e||(this.position=i,this._visitedParent=o)}next(){return"forward"==this.direction?this._next():this._previous()}_next(){const t=this.position,e=this.position.clone(),n=this._visitedParent;if(null===n.parent&&e.offset===n.maxOffset)return{done:!0};if(n===this._boundaryEndParent&&e.offset==this.boundaries.end.offset)return{done:!0};const i=e.parent,o=_s(e,i),r=o||vs(e,i,o);if(r instanceof ps)return this.shallow?e.offset++:(e.path.push(0),this._visitedParent=r),this.position=e,ws("elementStart",r,t,e,1);if(r instanceof fs){let i;if(this.singleCharacters)i=1;else{let t=r.endOffset;this._boundaryEndParent==n&&this.boundaries.end.offset<t&&(t=this.boundaries.end.offset),i=t-e.offset}const o=e.offset-r.startOffset,s=new ms(r,o,i);return e.offset+=i,this.position=e,ws("text",s,t,e,i)}return e.path.pop(),e.offset++,this.position=e,this._visitedParent=n.parent,this.ignoreElementEnd?this._next():ws("elementEnd",n,t,e)}_previous(){const t=this.position,e=this.position.clone(),n=this._visitedParent;if(null===n.parent&&0===e.offset)return{done:!0};if(n==this._boundaryStartParent&&e.offset==this.boundaries.start.offset)return{done:!0};const i=e.parent,o=_s(e,i),r=o||ys(e,i,o);if(r instanceof ps)return e.offset--,this.shallow?(this.position=e,ws("elementStart",r,t,e,1)):(e.path.push(r.maxOffset),this.position=e,this._visitedParent=r,this.ignoreElementEnd?this._previous():ws("elementEnd",r,t,e));if(r instanceof fs){let i;if(this.singleCharacters)i=1;else{let t=r.startOffset;this._boundaryStartParent==n&&this.boundaries.start.offset>t&&(t=this.boundaries.start.offset),i=e.offset-t}const o=e.offset-r.startOffset,s=new ms(r,o-i,i);return e.offset-=i,this.position=e,ws("text",s,t,e,i)}return e.path.pop(),this.position=e,this._visitedParent=n.parent,ws("elementStart",n,t,e,1)}}function ws(t,e,n,i,o){return{done:!1,value:{type:t,item:e,previousPosition:n,nextPosition:i,length:o}}}class ks{constructor(t,e,n="toNone"){if(!t.is("element")&&!t.is("documentFragment"))throw new hn.b("model-position-root-invalid: Position root invalid.",t);if(!(e instanceof Array)||0===e.length)throw new hn.b("model-position-path-incorrect-format: Position path must be an array with at least one item.",t,{path:e});t.is("rootElement")?e=e.slice():(e=[...t.getPath(),...e],t=t.root),this.root=t,this.path=e,this.stickiness=n}get offset(){return this.path[this.path.length-1]}set offset(t){this.path[this.path.length-1]=t}get parent(){let t=this.root;for(let e=0;e<this.path.length-1;e++)if(t=t.getChild(t.offsetToIndex(this.path[e])),!t)throw new hn.b("model-position-path-incorrect: The position's path is incorrect.",this,{position:this});if(t.is("text"))throw new hn.b("model-position-path-incorrect: The position's path is incorrect.",this,{position:this});return t}get index(){return this.parent.offsetToIndex(this.offset)}get textNode(){return _s(this,this.parent)}get nodeAfter(){const t=this.parent;return vs(this,t,_s(this,t))}get nodeBefore(){const t=this.parent;return ys(this,t,_s(this,t))}get isAtStart(){return 0===this.offset}get isAtEnd(){return this.offset==this.parent.maxOffset}compareWith(t){if(this.root!=t.root)return"different";const e=In(this.path,t.path);switch(e){case"same":return"same";case"prefix":return"before";case"extension":return"after";default:return this.path[e]<t.path[e]?"before":"after"}}getLastMatchingPosition(t,e={}){e.startPosition=this;const n=new bs(e);return n.skip(t),n.position}getParentPath(){return this.path.slice(0,-1)}getAncestors(){const t=this.parent;return t.is("documentFragment")?[t]:t.getAncestors({includeSelf:!0})}getCommonPath(t){if(this.root!=t.root)return[];const e=In(this.path,t.path),n="string"==typeof e?Math.min(this.path.length,t.path.length):e;return this.path.slice(0,n)}getCommonAncestor(t){const e=this.getAncestors(),n=t.getAncestors();let i=0;for(;e[i]==n[i]&&e[i];)i++;return 0===i?null:e[i-1]}getShiftedBy(t){const e=this.clone(),n=e.offset+t;return e.offset=n<0?0:n,e}isAfter(t){return"after"==this.compareWith(t)}isBefore(t){return"before"==this.compareWith(t)}isEqual(t){return"same"==this.compareWith(t)}isTouching(t){let e=null,n=null;switch(this.compareWith(t)){case"same":return!0;case"before":e=ks._createAt(this),n=ks._createAt(t);break;case"after":e=ks._createAt(t),n=ks._createAt(this);break;default:return!1}let i=e.parent;for(;e.path.length+n.path.length;){if(e.isEqual(n))return!0;if(e.path.length>n.path.length){if(e.offset!==i.maxOffset)return!1;e.path=e.path.slice(0,-1),i=i.parent,e.offset++}else{if(0!==n.offset)return!1;n.path=n.path.slice(0,-1)}}}is(t){return"position"===t||"model:position"===t}hasSameParentAs(t){if(this.root!==t.root)return!1;return"same"==In(this.getParentPath(),t.getParentPath())}getTransformedByOperation(t){let e;switch(t.type){case"insert":e=this._getTransformedByInsertOperation(t);break;case"move":case"remove":case"reinsert":e=this._getTransformedByMoveOperation(t);break;case"split":e=this._getTransformedBySplitOperation(t);break;case"merge":e=this._getTransformedByMergeOperation(t);break;default:e=ks._createAt(this)}return e}_getTransformedByInsertOperation(t){return this._getTransformedByInsertion(t.position,t.howMany)}_getTransformedByMoveOperation(t){return this._getTransformedByMove(t.sourcePosition,t.targetPosition,t.howMany)}_getTransformedBySplitOperation(t){const e=t.movedRange;return e.containsPosition(this)||e.start.isEqual(this)&&"toNext"==this.stickiness?this._getCombined(t.splitPosition,t.moveTargetPosition):t.graveyardPosition?this._getTransformedByMove(t.graveyardPosition,t.insertionPosition,1):this._getTransformedByInsertion(t.insertionPosition,1)}_getTransformedByMergeOperation(t){const e=t.movedRange;let n;return e.containsPosition(this)||e.start.isEqual(this)?(n=this._getCombined(t.sourcePosition,t.targetPosition),t.sourcePosition.isBefore(t.targetPosition)&&(n=n._getTransformedByDeletion(t.deletionPosition,1))):n=this.isEqual(t.deletionPosition)?ks._createAt(t.deletionPosition):this._getTransformedByMove(t.deletionPosition,t.graveyardPosition,1),n}_getTransformedByDeletion(t,e){const n=ks._createAt(this);if(this.root!=t.root)return n;if("same"==In(t.getParentPath(),this.getParentPath())){if(t.offset<this.offset){if(t.offset+e>this.offset)return null;n.offset-=e}}else if("prefix"==In(t.getParentPath(),this.getParentPath())){const i=t.path.length-1;if(t.offset<=this.path[i]){if(t.offset+e>this.path[i])return null;n.path[i]-=e}}return n}_getTransformedByInsertion(t,e){const n=ks._createAt(this);if(this.root!=t.root)return n;if("same"==In(t.getParentPath(),this.getParentPath()))(t.offset<this.offset||t.offset==this.offset&&"toPrevious"!=this.stickiness)&&(n.offset+=e);else if("prefix"==In(t.getParentPath(),this.getParentPath())){const i=t.path.length-1;t.offset<=this.path[i]&&(n.path[i]+=e)}return n}_getTransformedByMove(t,e,n){if(e=e._getTransformedByDeletion(t,n),t.isEqual(e))return ks._createAt(this);const i=this._getTransformedByDeletion(t,n);return null===i||t.isEqual(this)&&"toNext"==this.stickiness||t.getShiftedBy(n).isEqual(this)&&"toPrevious"==this.stickiness?this._getCombined(t,e):i._getTransformedByInsertion(e,n)}_getCombined(t,e){const n=t.path.length-1,i=ks._createAt(e);return i.stickiness=this.stickiness,i.offset=i.offset+this.path[n]-t.offset,i.path=[...i.path,...this.path.slice(n+1)],i}toJSON(){return{root:this.root.toJSON(),path:Array.from(this.path),stickiness:this.stickiness}}clone(){return new this.constructor(this.root,this.path,this.stickiness)}static _createAt(t,e,n="toNone"){if(t instanceof ks)return new ks(t.root,t.path,t.stickiness);{const i=t;if("end"==e)e=i.maxOffset;else{if("before"==e)return this._createBefore(i,n);if("after"==e)return this._createAfter(i,n);if(0!==e&&!e)throw new hn.b("model-createPositionAt-offset-required: Model#createPositionAt() requires the offset when the first parameter is a model item.",[this,t])}if(!i.is("element")&&!i.is("documentFragment"))throw new hn.b("model-position-parent-incorrect: Position parent have to be a element or document fragment.",[this,t]);const o=i.getPath();return o.push(e),new this(i.root,o,n)}}static _createAfter(t,e){if(!t.parent)throw new hn.b("model-position-after-root: You cannot make a position after root.",[this,t],{root:t});return this._createAt(t.parent,t.endOffset,e)}static _createBefore(t,e){if(!t.parent)throw new hn.b("model-position-before-root: You cannot make a position before root.",t,{root:t});return this._createAt(t.parent,t.startOffset,e)}static fromJSON(t,e){if("$graveyard"===t.root){const n=new ks(e.graveyard,t.path);return n.stickiness=t.stickiness,n}if(!e.getRoot(t.root))throw new hn.b("model-position-fromjson-no-root: Cannot create position for document. Root with specified name does not exist.",e,{rootName:t.root});return new ks(e.getRoot(t.root),t.path,t.stickiness)}}function _s(t,e){const n=e.getChild(e.offsetToIndex(t.offset));return n&&n.is("text")&&n.startOffset<t.offset?n:null}function vs(t,e,n){return null!==n?null:e.getChild(e.offsetToIndex(t.offset))}function ys(t,e,n){return null!==n?null:e.getChild(e.offsetToIndex(t.offset)-1)}class xs{constructor(t,e=null){this.start=ks._createAt(t),this.end=e?ks._createAt(e):ks._createAt(t),this.start.stickiness=this.isCollapsed?"toNone":"toNext",this.end.stickiness=this.isCollapsed?"toNone":"toPrevious"}*[Symbol.iterator](){yield*new bs({boundaries:this,ignoreElementEnd:!0})}get isCollapsed(){return this.start.isEqual(this.end)}get isFlat(){return"same"==In(this.start.getParentPath(),this.end.getParentPath())}get root(){return this.start.root}containsPosition(t){return t.isAfter(this.start)&&t.isBefore(this.end)}containsRange(t,e=!1){t.isCollapsed&&(e=!1);const n=this.containsPosition(t.start)||e&&this.start.isEqual(t.start),i=this.containsPosition(t.end)||e&&this.end.isEqual(t.end);return n&&i}containsItem(t){const e=ks._createBefore(t);return this.containsPosition(e)||this.start.isEqual(e)}is(t){return"range"===t||"model:range"===t}isEqual(t){return this.start.isEqual(t.start)&&this.end.isEqual(t.end)}isIntersecting(t){return this.start.isBefore(t.end)&&this.end.isAfter(t.start)}getDifference(t){const e=[];return this.isIntersecting(t)?(this.containsPosition(t.start)&&e.push(new xs(this.start,t.start)),this.containsPosition(t.end)&&e.push(new xs(t.end,this.end))):e.push(new xs(this.start,this.end)),e}getIntersection(t){if(this.isIntersecting(t)){let e=this.start,n=this.end;return this.containsPosition(t.start)&&(e=t.start),this.containsPosition(t.end)&&(n=t.end),new xs(e,n)}return null}getMinimalFlatRanges(){const t=[],e=this.start.getCommonPath(this.end).length,n=ks._createAt(this.start);let i=n.parent;for(;n.path.length>e+1;){const e=i.maxOffset-n.offset;0!==e&&t.push(new xs(n,n.getShiftedBy(e))),n.path=n.path.slice(0,-1),n.offset++,i=i.parent}for(;n.path.length<=this.end.path.length;){const e=this.end.path[n.path.length-1],i=e-n.offset;0!==i&&t.push(new xs(n,n.getShiftedBy(i))),n.offset=e,n.path.push(0)}return t}getWalker(t={}){return t.boundaries=this,new bs(t)}*getItems(t={}){t.boundaries=this,t.ignoreElementEnd=!0;const e=new bs(t);for(const t of e)yield t.item}*getPositions(t={}){t.boundaries=this;const e=new bs(t);yield e.position;for(const t of e)yield t.nextPosition}getTransformedByOperation(t){switch(t.type){case"insert":return this._getTransformedByInsertOperation(t);case"move":case"remove":case"reinsert":return this._getTransformedByMoveOperation(t);case"split":return[this._getTransformedBySplitOperation(t)];case"merge":return[this._getTransformedByMergeOperation(t)]}return[new xs(this.start,this.end)]}getTransformedByOperations(t){const e=[new xs(this.start,this.end)];for(const n of t)for(let t=0;t<e.length;t++){const i=e[t].getTransformedByOperation(n);e.splice(t,1,...i),t+=i.length-1}for(let t=0;t<e.length;t++){const n=e[t];for(let i=t+1;i<e.length;i++){const t=e[i];(n.containsRange(t)||t.containsRange(n)||n.isEqual(t))&&e.splice(i,1)}}return e}getCommonAncestor(){return this.start.getCommonAncestor(this.end)}getContainedElement(){if(this.isCollapsed)return null;const t=this.start.nodeAfter,e=this.end.nodeBefore;return t&&t.is("element")&&t===e?t:null}toJSON(){return{start:this.start.toJSON(),end:this.end.toJSON()}}clone(){return new this.constructor(this.start,this.end)}_getTransformedByInsertOperation(t,e=!1){return this._getTransformedByInsertion(t.position,t.howMany,e)}_getTransformedByMoveOperation(t,e=!1){const n=t.sourcePosition,i=t.howMany,o=t.targetPosition;return this._getTransformedByMove(n,o,i,e)}_getTransformedBySplitOperation(t){const e=this.start._getTransformedBySplitOperation(t);let n=this.end._getTransformedBySplitOperation(t);return this.end.isEqual(t.insertionPosition)&&(n=this.end.getShiftedBy(1)),e.root!=n.root&&(n=this.end.getShiftedBy(-1)),new xs(e,n)}_getTransformedByMergeOperation(t){if(this.start.isEqual(t.targetPosition)&&this.end.isEqual(t.deletionPosition))return new xs(this.start);let e=this.start._getTransformedByMergeOperation(t),n=this.end._getTransformedByMergeOperation(t);return e.root!=n.root&&(n=this.end.getShiftedBy(-1)),e.isAfter(n)?(t.sourcePosition.isBefore(t.targetPosition)?(e=ks._createAt(n),e.offset=0):(t.deletionPosition.isEqual(e)||(n=t.deletionPosition),e=t.targetPosition),new xs(e,n)):new xs(e,n)}_getTransformedByInsertion(t,e,n=!1){if(n&&this.containsPosition(t))return[new xs(this.start,t),new xs(t.getShiftedBy(e),this.end._getTransformedByInsertion(t,e))];{const n=new xs(this.start,this.end);return n.start=n.start._getTransformedByInsertion(t,e),n.end=n.end._getTransformedByInsertion(t,e),[n]}}_getTransformedByMove(t,e,n,i=!1){if(this.isCollapsed){const i=this.start._getTransformedByMove(t,e,n);return[new xs(i)]}const o=xs._createFromPositionAndShift(t,n),r=e._getTransformedByDeletion(t,n);if(this.containsPosition(e)&&!i&&(o.containsPosition(this.start)||o.containsPosition(this.end))){const i=this.start._getTransformedByMove(t,e,n),o=this.end._getTransformedByMove(t,e,n);return[new xs(i,o)]}let s;const a=this.getDifference(o);let c=null;const l=this.getIntersection(o);if(1==a.length?c=new xs(a[0].start._getTransformedByDeletion(t,n),a[0].end._getTransformedByDeletion(t,n)):2==a.length&&(c=new xs(this.start,this.end._getTransformedByDeletion(t,n))),s=c?c._getTransformedByInsertion(r,n,null!==l||i):[],l){const t=new xs(l.start._getCombined(o.start,r),l.end._getCombined(o.start,r));2==s.length?s.splice(1,0,t):s.push(t)}return s}_getTransformedByDeletion(t,e){let n=this.start._getTransformedByDeletion(t,e),i=this.end._getTransformedByDeletion(t,e);return null==n&&null==i?null:(null==n&&(n=t),null==i&&(i=t),new xs(n,i))}static _createFromPositionAndShift(t,e){const n=t,i=t.getShiftedBy(e);return e>0?new this(n,i):new this(i,n)}static _createIn(t){return new this(ks._createAt(t,0),ks._createAt(t,t.maxOffset))}static _createOn(t){return this._createFromPositionAndShift(ks._createBefore(t),t.offsetSize)}static _createFromRanges(t){if(0===t.length)throw new hn.b("range-create-from-ranges-empty-array: At least one range has to be passed.",null);if(1==t.length)return t[0].clone();const e=t[0];t.sort((t,e)=>t.start.isAfter(e.start)?1:-1);const n=t.indexOf(e),i=new this(e.start,e.end);if(n>0)for(let e=n-1;t[e].end.isEqual(i.start);e++)i.start=ks._createAt(t[e].start);for(let e=n+1;e<t.length&&t[e].start.isEqual(i.end);e++)i.end=ks._createAt(t[e].end);return i}static fromJSON(t,e){return new this(ks.fromJSON(t.start,e),ks.fromJSON(t.end,e))}}class As{constructor(){this._modelToViewMapping=new WeakMap,this._viewToModelMapping=new WeakMap,this._viewToModelLengthCallbacks=new Map,this._markerNameToElements=new Map,this._elementToMarkerNames=new Map,this._unboundMarkerNames=new Set,this.on("modelToViewPosition",(t,e)=>{if(e.viewPosition)return;const n=this._modelToViewMapping.get(e.modelPosition.parent);e.viewPosition=this._findPositionIn(n,e.modelPosition.offset)},{priority:"low"}),this.on("viewToModelPosition",(t,e)=>{if(e.modelPosition)return;const n=this.findMappedViewAncestor(e.viewPosition),i=this._viewToModelMapping.get(n),o=this._toModelOffset(e.viewPosition.parent,e.viewPosition.offset,n);e.modelPosition=ks._createAt(i,o)},{priority:"low"})}bindElements(t,e){this._modelToViewMapping.set(t,e),this._viewToModelMapping.set(e,t)}unbindViewElement(t){const e=this.toModelElement(t);if(this._viewToModelMapping.delete(t),this._elementToMarkerNames.has(t))for(const e of this._elementToMarkerNames.get(t))this._unboundMarkerNames.add(e);this._modelToViewMapping.get(e)==t&&this._modelToViewMapping.delete(e)}unbindModelElement(t){const e=this.toViewElement(t);this._modelToViewMapping.delete(t),this._viewToModelMapping.get(e)==t&&this._viewToModelMapping.delete(e)}bindElementToMarker(t,e){const n=this._markerNameToElements.get(e)||new Set;n.add(t);const i=this._elementToMarkerNames.get(t)||new Set;i.add(e),this._markerNameToElements.set(e,n),this._elementToMarkerNames.set(t,i)}unbindElementFromMarkerName(t,e){const n=this._markerNameToElements.get(e);n&&(n.delete(t),0==n.size&&this._markerNameToElements.delete(e));const i=this._elementToMarkerNames.get(t);i&&(i.delete(e),0==i.size&&this._elementToMarkerNames.delete(t))}flushUnboundMarkerNames(){const t=Array.from(this._unboundMarkerNames);return this._unboundMarkerNames.clear(),t}clearBindings(){this._modelToViewMapping=new WeakMap,this._viewToModelMapping=new WeakMap,this._markerNameToElements=new Map,this._elementToMarkerNames=new Map,this._unboundMarkerNames=new Set}toModelElement(t){return this._viewToModelMapping.get(t)}toViewElement(t){return this._modelToViewMapping.get(t)}toModelRange(t){return new xs(this.toModelPosition(t.start),this.toModelPosition(t.end))}toViewRange(t){return new Xi(this.toViewPosition(t.start),this.toViewPosition(t.end))}toModelPosition(t){const e={viewPosition:t,mapper:this};return this.fire("viewToModelPosition",e),e.modelPosition}toViewPosition(t,e={isPhantom:!1}){const n={modelPosition:t,mapper:this,isPhantom:e.isPhantom};return this.fire("modelToViewPosition",n),n.viewPosition}markerNameToElements(t){const e=this._markerNameToElements.get(t);if(!e)return null;const n=new Set;for(const t of e)if(t.is("attributeElement"))for(const e of t.getElementsWithSameId())n.add(e);else n.add(t);return n}registerViewToModelLength(t,e){this._viewToModelLengthCallbacks.set(t,e)}findMappedViewAncestor(t){let e=t.parent;for(;!this._viewToModelMapping.has(e);)e=e.parent;return e}_toModelOffset(t,e,n){if(n!=t){return this._toModelOffset(t.parent,t.index,n)+this._toModelOffset(t,e,t)}if(t.is("text"))return e;let i=0;for(let n=0;n<e;n++)i+=this.getModelLength(t.getChild(n));return i}getModelLength(t){if(this._viewToModelLengthCallbacks.get(t.name)){return this._viewToModelLengthCallbacks.get(t.name)(t)}if(this._viewToModelMapping.has(t))return 1;if(t.is("text"))return t.data.length;if(t.is("uiElement"))return 0;{let e=0;for(const n of t.getChildren())e+=this.getModelLength(n);return e}}_findPositionIn(t,e){let n,i=0,o=0,r=0;if(t.is("text"))return new Zi(t,e);for(;o<e;)n=t.getChild(r),i=this.getModelLength(n),o+=i,r++;return o==e?this._moveViewPositionToTextNode(new Zi(t,r)):this._findPositionIn(n,e-(o-i))}_moveViewPositionToTextNode(t){const e=t.nodeBefore,n=t.nodeAfter;return e instanceof Rn?new Zi(e,e.data.length):n instanceof Rn?new Zi(n,0):t}}xn(As,gn);class Ts{constructor(){this._consumable=new Map,this._textProxyRegistry=new Map}add(t,e){e=Cs(e),t instanceof ms&&(t=this._getSymbolForTextProxy(t)),this._consumable.has(t)||this._consumable.set(t,new Map),this._consumable.get(t).set(e,!0)}consume(t,e){return e=Cs(e),t instanceof ms&&(t=this._getSymbolForTextProxy(t)),!!this.test(t,e)&&(this._consumable.get(t).set(e,!1),!0)}test(t,e){e=Cs(e),t instanceof ms&&(t=this._getSymbolForTextProxy(t));const n=this._consumable.get(t);if(void 0===n)return null;const i=n.get(e);return void 0===i?null:i}revert(t,e){e=Cs(e),t instanceof ms&&(t=this._getSymbolForTextProxy(t));const n=this.test(t,e);return!1===n?(this._consumable.get(t).set(e,!0),!0):!0!==n&&null}_getSymbolForTextProxy(t){let e=null;const n=this._textProxyRegistry.get(t.startOffset);if(n){const i=n.get(t.endOffset);i&&(e=i.get(t.parent))}return e||(e=this._addSymbolForTextProxy(t.startOffset,t.endOffset,t.parent)),e}_addSymbolForTextProxy(t,e,n){const i=Symbol("textProxySymbol");let o,r;return o=this._textProxyRegistry.get(t),o||(o=new Map,this._textProxyRegistry.set(t,o)),r=o.get(e),r||(r=new Map,o.set(e,r)),r.set(n,i),i}}function Cs(t){const e=t.split(":");return e.length>1?e[0]+":"+e[1]:e[0]}class Ps{constructor(t){this.conversionApi=ji({dispatcher:this},t)}convertChanges(t,e,n){for(const e of t.getMarkersToRemove())this.convertMarkerRemove(e.name,e.range,n);for(const e of t.getChanges())"insert"==e.type?this.convertInsert(xs._createFromPositionAndShift(e.position,e.length),n):"remove"==e.type?this.convertRemove(e.position,e.length,e.name,n):this.convertAttribute(e.range,e.attributeKey,e.attributeOldValue,e.attributeNewValue,n);for(const t of this.conversionApi.mapper.flushUnboundMarkerNames()){const i=e.get(t).getRange();this.convertMarkerRemove(t,i,n),this.convertMarkerAdd(t,i,n)}for(const e of t.getMarkersToAdd())this.convertMarkerAdd(e.name,e.range,n)}convertInsert(t,e){this.conversionApi.writer=e,this.conversionApi.consumable=this._createInsertConsumable(t);for(const e of t){const t=e.item,n={item:t,range:xs._createFromPositionAndShift(e.previousPosition,e.length)};this._testAndFire("insert",n);for(const e of t.getAttributeKeys())n.attributeKey=e,n.attributeOldValue=null,n.attributeNewValue=t.getAttribute(e),this._testAndFire("attribute:"+e,n)}this._clearConversionApi()}convertRemove(t,e,n,i){this.conversionApi.writer=i,this.fire("remove:"+n,{position:t,length:e},this.conversionApi),this._clearConversionApi()}convertAttribute(t,e,n,i,o){this.conversionApi.writer=o,this.conversionApi.consumable=this._createConsumableForRange(t,"attribute:"+e);for(const o of t){const t={item:o.item,range:xs._createFromPositionAndShift(o.previousPosition,o.length),attributeKey:e,attributeOldValue:n,attributeNewValue:i};this._testAndFire("attribute:"+e,t)}this._clearConversionApi()}convertSelection(t,e,n){const i=Array.from(e.getMarkersAtPosition(t.getFirstPosition()));if(this.conversionApi.writer=n,this.conversionApi.consumable=this._createSelectionConsumable(t,i),this.fire("selection",{selection:t},this.conversionApi),t.isCollapsed){for(const e of i){const n=e.getRange();if(!Ss(t.getFirstPosition(),e,this.conversionApi.mapper))continue;const i={item:t,markerName:e.name,markerRange:n};this.conversionApi.consumable.test(t,"addMarker:"+e.name)&&this.fire("addMarker:"+e.name,i,this.conversionApi)}for(const e of t.getAttributeKeys()){const n={item:t,range:t.getFirstRange(),attributeKey:e,attributeOldValue:null,attributeNewValue:t.getAttribute(e)};this.conversionApi.consumable.test(t,"attribute:"+n.attributeKey)&&this.fire("attribute:"+n.attributeKey+":$text",n,this.conversionApi)}this._clearConversionApi()}}convertMarkerAdd(t,e,n){if(!e.root.document||"$graveyard"==e.root.rootName)return;this.conversionApi.writer=n;const i="addMarker:"+t,o=new Ts;if(o.add(e,i),this.conversionApi.consumable=o,this.fire(i,{markerName:t,markerRange:e},this.conversionApi),o.test(e,i)){this.conversionApi.consumable=this._createConsumableForRange(e,i);for(const n of e.getItems()){if(!this.conversionApi.consumable.test(n,i))continue;const o={item:n,range:xs._createOn(n),markerName:t,markerRange:e};this.fire(i,o,this.conversionApi)}this._clearConversionApi()}}convertMarkerRemove(t,e,n){e.root.document&&"$graveyard"!=e.root.rootName&&(this.conversionApi.writer=n,this.fire("removeMarker:"+t,{markerName:t,markerRange:e},this.conversionApi),this._clearConversionApi())}_createInsertConsumable(t){const e=new Ts;for(const n of t){const t=n.item;e.add(t,"insert");for(const n of t.getAttributeKeys())e.add(t,"attribute:"+n)}return e}_createConsumableForRange(t,e){const n=new Ts;for(const i of t.getItems())n.add(i,e);return n}_createSelectionConsumable(t,e){const n=new Ts;n.add(t,"selection");for(const i of e)n.add(t,"addMarker:"+i.name);for(const e of t.getAttributeKeys())n.add(t,"attribute:"+e);return n}_testAndFire(t,e){if(!this.conversionApi.consumable.test(e.item,t))return;const n=e.item.name||"$text";this.fire(t+":"+n,e,this.conversionApi)}_clearConversionApi(){delete this.conversionApi.writer,delete this.conversionApi.consumable}}function Ss(t,e,n){const i=e.getRange(),o=Array.from(t.getAncestors());return o.shift(),o.reverse(),!o.some(t=>{if(i.containsItem(t)){return!!n.toViewElement(t).getCustomProperty("addHighlight")}})}xn(Ps,gn);class Ms{constructor(t,e,n){this._lastRangeBackward=!1,this._ranges=[],this._attrs=new Map,t&&this.setTo(t,e,n)}get anchor(){if(this._ranges.length>0){const t=this._ranges[this._ranges.length-1];return this._lastRangeBackward?t.end:t.start}return null}get focus(){if(this._ranges.length>0){const t=this._ranges[this._ranges.length-1];return this._lastRangeBackward?t.start:t.end}return null}get isCollapsed(){return 1===this._ranges.length&&this._ranges[0].isCollapsed}get rangeCount(){return this._ranges.length}get isBackward(){return!this.isCollapsed&&this._lastRangeBackward}isEqual(t){if(this.rangeCount!=t.rangeCount)return!1;if(0===this.rangeCount)return!0;if(!this.anchor.isEqual(t.anchor)||!this.focus.isEqual(t.focus))return!1;for(const e of this._ranges){let n=!1;for(const i of t._ranges)if(e.isEqual(i)){n=!0;break}if(!n)return!1}return!0}*getRanges(){for(const t of this._ranges)yield new xs(t.start,t.end)}getFirstRange(){let t=null;for(const e of this._ranges)t&&!e.start.isBefore(t.start)||(t=e);return t?new xs(t.start,t.end):null}getLastRange(){let t=null;for(const e of this._ranges)t&&!e.end.isAfter(t.end)||(t=e);return t?new xs(t.start,t.end):null}getFirstPosition(){const t=this.getFirstRange();return t?t.start.clone():null}getLastPosition(){const t=this.getLastRange();return t?t.end.clone():null}setTo(t,e,n){if(null===t)this._setRanges([]);else if(t instanceof Ms)this._setRanges(t.getRanges(),t.isBackward);else if(t&&"function"==typeof t.getRanges)this._setRanges(t.getRanges(),t.isBackward);else if(t instanceof xs)this._setRanges([t],!!e&&!!e.backward);else if(t instanceof ks)this._setRanges([new xs(t)]);else if(t instanceof hs){const i=!!n&&!!n.backward;let o;if("in"==e)o=xs._createIn(t);else if("on"==e)o=xs._createOn(t);else{if(void 0===e)throw new hn.b("model-selection-setTo-required-second-parameter: selection.setTo requires the second parameter when the first parameter is a node.",[this,t]);o=new xs(ks._createAt(t,e))}this._setRanges([o],i)}else{if(!yn(t))throw new hn.b("model-selection-setTo-not-selectable: Cannot set the selection to the given place.",[this,t]);this._setRanges(t,e&&!!e.backward)}}_setRanges(t,e=!1){const n=(t=Array.from(t)).some(e=>{if(!(e instanceof xs))throw new hn.b("model-selection-set-ranges-not-range: Selection range set to an object that is not an instance of model.Range.",[this,t]);return this._ranges.every(t=>!t.isEqual(e))});if(t.length!==this._ranges.length||n){this._removeAllRanges();for(const e of t)this._pushRange(e);this._lastRangeBackward=!!e,this.fire("change:range",{directChange:!0})}}setFocus(t,e){if(null===this.anchor)throw new hn.b("model-selection-setFocus-no-ranges: Cannot set selection focus if there are no ranges in selection.",[this,t]);const n=ks._createAt(t,e);if("same"==n.compareWith(this.focus))return;const i=this.anchor;this._ranges.length&&this._popRange(),"before"==n.compareWith(i)?(this._pushRange(new xs(n,i)),this._lastRangeBackward=!0):(this._pushRange(new xs(i,n)),this._lastRangeBackward=!1),this.fire("change:range",{directChange:!0})}getAttribute(t){return this._attrs.get(t)}getAttributes(){return this._attrs.entries()}getAttributeKeys(){return this._attrs.keys()}hasAttribute(t){return this._attrs.has(t)}removeAttribute(t){this.hasAttribute(t)&&(this._attrs.delete(t),this.fire("change:attribute",{attributeKeys:[t],directChange:!0}))}setAttribute(t,e){this.getAttribute(t)!==e&&(this._attrs.set(t,e),this.fire("change:attribute",{attributeKeys:[t],directChange:!0}))}getSelectedElement(){return 1!==this.rangeCount?null:this.getFirstRange().getContainedElement()}is(t){return"selection"===t||"model:selection"===t}*getSelectedBlocks(){const t=new WeakSet;for(const e of this.getRanges()){const n=Ns(e.start,t);n&&Os(n,e)&&(yield n);for(const n of e.getWalker()){const i=n.item;"elementEnd"==n.type&&Is(i,t,e)&&(yield i)}const i=Ns(e.end,t);i&&!e.end.isTouching(ks._createAt(i,0))&&Os(i,e)&&(yield i)}}containsEntireContent(t=this.anchor.root){const e=ks._createAt(t,0),n=ks._createAt(t,"end");return e.isTouching(this.getFirstPosition())&&n.isTouching(this.getLastPosition())}_pushRange(t){this._checkRange(t),this._ranges.push(new xs(t.start,t.end))}_checkRange(t){for(let e=0;e<this._ranges.length;e++)if(t.isIntersecting(this._ranges[e]))throw new hn.b("model-selection-range-intersects: Trying to add a range that intersects with another range in the selection.",[this,t],{addedRange:t,intersectingRange:this._ranges[e]})}_removeAllRanges(){for(;this._ranges.length>0;)this._popRange()}_popRange(){this._ranges.pop()}}function Es(t,e){return!e.has(t)&&(e.add(t),t.root.document.model.schema.isBlock(t)&&t.parent)}function Is(t,e,n){return Es(t,e)&&Os(t,n)}function Ns(t,e){const n=t.parent.root.document.model.schema,i=t.parent.getAncestors({parentFirst:!0,includeSelf:!0});let o=!1;const r=i.find(t=>!o&&(o=n.isLimit(t),!o&&Es(t,e)));return i.forEach(t=>e.add(t)),r}function Os(t,e){const n=function(t){const e=t.root.document.model.schema;let n=t.parent;for(;n;){if(e.isBlock(n))return n;n=n.parent}}(t);return!n||!e.containsRange(xs._createOn(n),!0)}xn(Ms,gn);class Rs extends xs{constructor(t,e){super(t,e),Ds.call(this)}detach(){this.stopListening()}is(t){return"liveRange"===t||"model:liveRange"===t||"range"==t||"model:range"===t}toRange(){return new xs(this.start,this.end)}static fromRange(t){return new Rs(t.start,t.end)}}function Ds(){this.listenTo(this.root.document.model,"applyOperation",(t,e)=>{const n=e[0];n.isDocumentOperation&&Ls.call(this,n)},{priority:"low"})}function Ls(t){const e=this.getTransformedByOperation(t),n=xs._createFromRanges(e),i=!n.isEqual(this),o=function(t,e){switch(e.type){case"insert":return t.containsPosition(e.position);case"move":case"remove":case"reinsert":case"merge":return t.containsPosition(e.sourcePosition)||t.start.isEqual(e.sourcePosition)||t.containsPosition(e.targetPosition);case"split":return t.containsPosition(e.splitPosition)||t.containsPosition(e.insertionPosition)}return!1}(this,t);let r=null;if(i){"$graveyard"==n.root.rootName&&(r="remove"==t.type?t.sourcePosition:t.deletionPosition);const e=this.toRange();this.start=n.start,this.end=n.end,this.fire("change:range",e,{deletionPosition:r})}else o&&this.fire("change:content",this.toRange(),{deletionPosition:r})}xn(Rs,gn);class js{constructor(t){this._selection=new Vs(t),this._selection.delegate("change:range").to(this),this._selection.delegate("change:attribute").to(this),this._selection.delegate("change:marker").to(this)}get isCollapsed(){return this._selection.isCollapsed}get anchor(){return this._selection.anchor}get focus(){return this._selection.focus}get rangeCount(){return this._selection.rangeCount}get hasOwnRange(){return this._selection.hasOwnRange}get isBackward(){return this._selection.isBackward}get isGravityOverridden(){return this._selection.isGravityOverridden}get markers(){return this._selection.markers}get _ranges(){return this._selection._ranges}getRanges(){return this._selection.getRanges()}getFirstPosition(){return this._selection.getFirstPosition()}getLastPosition(){return this._selection.getLastPosition()}getFirstRange(){return this._selection.getFirstRange()}getLastRange(){return this._selection.getLastRange()}getSelectedBlocks(){return this._selection.getSelectedBlocks()}getSelectedElement(){return this._selection.getSelectedElement()}containsEntireContent(t){return this._selection.containsEntireContent(t)}destroy(){this._selection.destroy()}getAttributeKeys(){return this._selection.getAttributeKeys()}getAttributes(){return this._selection.getAttributes()}getAttribute(t){return this._selection.getAttribute(t)}hasAttribute(t){return this._selection.hasAttribute(t)}refresh(){this._selection._updateMarkers(),this._selection._updateAttributes(!1)}is(t){return"selection"===t||"model:selection"==t||"documentSelection"==t||"model:documentSelection"==t}_setFocus(t,e){this._selection.setFocus(t,e)}_setTo(t,e,n){this._selection.setTo(t,e,n)}_setAttribute(t,e){this._selection.setAttribute(t,e)}_removeAttribute(t){this._selection.removeAttribute(t)}_getStoredAttributes(){return this._selection._getStoredAttributes()}_overrideGravity(){return this._selection.overrideGravity()}_restoreGravity(t){this._selection.restoreGravity(t)}static _getStoreAttributeKey(t){return"selection:"+t}static _isStoreAttributeKey(t){return t.startsWith("selection:")}}xn(js,gn);class Vs extends Ms{constructor(t){super(),this.markers=new An({idProperty:"name"}),this._model=t.model,this._document=t,this._attributePriority=new Map,this._fixGraveyardRangesData=[],this._hasChangedRange=!1,this._overriddenGravityRegister=new Set,this.listenTo(this._model,"applyOperation",(t,e)=>{const n=e[0];if(n.isDocumentOperation&&"marker"!=n.type&&"rename"!=n.type&&"noop"!=n.type){for(;this._fixGraveyardRangesData.length;){const{liveRange:t,sourcePosition:e}=this._fixGraveyardRangesData.shift();this._fixGraveyardSelection(t,e)}this._hasChangedRange&&(this._hasChangedRange=!1,this.fire("change:range",{directChange:!1}))}},{priority:"lowest"}),this.on("change:range",()=>{for(const t of this.getRanges())if(!this._document._validateSelectionRange(t))throw new hn.b("document-selection-wrong-position: Range from document selection starts or ends at incorrect position.",this,{range:t})}),this.listenTo(this._model.markers,"update",()=>this._updateMarkers()),this.listenTo(this._document,"change",(t,e)=>{!function(t,e){const n=t.document.differ;for(const i of n.getChanges()){if("insert"!=i.type)continue;const n=i.position.parent;i.length===n.maxOffset&&t.enqueueChange(e,t=>{const e=Array.from(n.getAttributeKeys()).filter(t=>t.startsWith("selection:"));for(const i of e)t.removeAttribute(i,n)})}}(this._model,e)})}get isCollapsed(){return 0===this._ranges.length?this._document._getDefaultRange().isCollapsed:super.isCollapsed}get anchor(){return super.anchor||this._document._getDefaultRange().start}get focus(){return super.focus||this._document._getDefaultRange().end}get rangeCount(){return this._ranges.length?this._ranges.length:1}get hasOwnRange(){return this._ranges.length>0}get isGravityOverridden(){return!!this._overriddenGravityRegister.size}destroy(){for(let t=0;t<this._ranges.length;t++)this._ranges[t].detach();this.stopListening()}*getRanges(){this._ranges.length?yield*super.getRanges():yield this._document._getDefaultRange()}getFirstRange(){return super.getFirstRange()||this._document._getDefaultRange()}getLastRange(){return super.getLastRange()||this._document._getDefaultRange()}setTo(t,e,n){super.setTo(t,e,n),this._updateAttributes(!0),this._updateMarkers()}setFocus(t,e){super.setFocus(t,e),this._updateAttributes(!0),this._updateMarkers()}setAttribute(t,e){if(this._setAttribute(t,e)){const e=[t];this.fire("change:attribute",{attributeKeys:e,directChange:!0})}}removeAttribute(t){if(this._removeAttribute(t)){const e=[t];this.fire("change:attribute",{attributeKeys:e,directChange:!0})}}overrideGravity(){const t=dn();return this._overriddenGravityRegister.add(t),1===this._overriddenGravityRegister.size&&this._updateAttributes(!0),t}restoreGravity(t){if(!this._overriddenGravityRegister.has(t))throw new hn.b("document-selection-gravity-wrong-restore: Attempting to restore the selection gravity for an unknown UID.",this,{uid:t});this._overriddenGravityRegister.delete(t),this.isGravityOverridden||this._updateAttributes(!0)}_popRange(){this._ranges.pop().detach()}_pushRange(t){const e=this._prepareRange(t);e&&this._ranges.push(e)}_prepareRange(t){if(this._checkRange(t),t.root==this._document.graveyard)return;const e=Rs.fromRange(t);return e.on("change:range",(t,n,i)=>{this._hasChangedRange=!0,e.root==this._document.graveyard&&this._fixGraveyardRangesData.push({liveRange:e,sourcePosition:i.deletionPosition})}),e}_updateMarkers(){const t=[];let e=!1;for(const e of this._model.markers){const n=e.getRange();for(const i of this.getRanges())n.containsRange(i,!i.isCollapsed)&&t.push(e)}const n=Array.from(this.markers);for(const n of t)this.markers.has(n)||(this.markers.add(n),e=!0);for(const n of Array.from(this.markers))t.includes(n)||(this.markers.remove(n),e=!0);e&&this.fire("change:marker",{oldMarkers:n,directChange:!1})}_updateAttributes(t){const e=Ln(this._getSurroundingAttributes()),n=Ln(this.getAttributes());if(t)this._attributePriority=new Map,this._attrs=new Map;else for(const[t,e]of this._attributePriority)"low"==e&&(this._attrs.delete(t),this._attributePriority.delete(t));this._setAttributesTo(e);const i=[];for(const[t,e]of this.getAttributes())n.has(t)&&n.get(t)===e||i.push(t);for(const[t]of n)this.hasAttribute(t)||i.push(t);i.length>0&&this.fire("change:attribute",{attributeKeys:i,directChange:!1})}_setAttribute(t,e,n=!0){const i=n?"normal":"low";return("low"!=i||"normal"!=this._attributePriority.get(t))&&(super.getAttribute(t)!==e&&(this._attrs.set(t,e),this._attributePriority.set(t,i),!0))}_removeAttribute(t,e=!0){const n=e?"normal":"low";return("low"!=n||"normal"!=this._attributePriority.get(t))&&(this._attributePriority.set(t,n),!!super.hasAttribute(t)&&(this._attrs.delete(t),!0))}_setAttributesTo(t){const e=new Set;for(const[e,n]of this.getAttributes())t.get(e)!==n&&this._removeAttribute(e,!1);for(const[n,i]of t){this._setAttribute(n,i,!1)&&e.add(n)}return e}*_getStoredAttributes(){const t=this.getFirstPosition().parent;if(this.isCollapsed&&t.isEmpty)for(const e of t.getAttributeKeys())if(e.startsWith("selection:")){const n=e.substr("selection:".length);yield[n,t.getAttribute(e)]}}_getSurroundingAttributes(){const t=this.getFirstPosition(),e=this._model.schema;let n=null;if(this.isCollapsed){const e=t.textNode?t.textNode:t.nodeBefore,i=t.textNode?t.textNode:t.nodeAfter;if(this.isGravityOverridden||(n=zs(e)),n||(n=zs(i)),!this.isGravityOverridden&&!n){let t=e;for(;t&&!n;)t=t.previousSibling,n=zs(t)}if(!n){let t=i;for(;t&&!n;)t=t.nextSibling,n=zs(t)}n||(n=this._getStoredAttributes())}else{const t=this.getFirstRange();for(const i of t){if(i.item.is("element")&&e.isObject(i.item))break;if("text"==i.type){n=i.item.getAttributes();break}}}return n}_fixGraveyardSelection(t,e){const n=e.clone(),i=this._model.schema.getNearestSelectionRange(n),o=this._ranges.indexOf(t);if(this._ranges.splice(o,1),t.detach(),i&&(r=i,this._ranges.every(t=>!r.isEqual(t)))){const t=this._prepareRange(i);this._ranges.splice(o,0,t)}var r}}function zs(t){return t instanceof ms||t instanceof fs?t.getAttributes():null}class Bs{constructor(t){this._dispatchers=t}add(t){for(const e of this._dispatchers)t(e);return this}}var Fs=function(t){return tn(t,5)};class Us extends Bs{elementToElement(t){return this.add(function(t){return(t=Fs(t)).view=qs(t.view,"container"),e=>{var n;e.on("insert:"+t.model,(n=t.view,(t,e,i)=>{const o=n(e.item,i.writer);if(!o)return;if(!i.consumable.consume(e.item,"insert"))return;const r=i.mapper.toViewPosition(e.range.start);i.mapper.bindElements(e.item,o),i.writer.insert(r,o)}),{priority:t.converterPriority||"normal"})}}(t))}attributeToElement(t){return this.add(function(t){let e="attribute:"+((t=Fs(t)).model.key?t.model.key:t.model);t.model.name&&(e+=":"+t.model.name);if(t.model.values)for(const e of t.model.values)t.view[e]=qs(t.view[e],"attribute");else t.view=qs(t.view,"attribute");const n=Ws(t);return i=>{i.on(e,function(t){return(e,n,i)=>{const o=t(n.attributeOldValue,i.writer),r=t(n.attributeNewValue,i.writer);if(!o&&!r)return;if(!i.consumable.consume(n.item,e.name))return;const s=i.writer,a=s.document.selection;if(n.item instanceof Ms||n.item instanceof js)s.wrap(a.getFirstRange(),r);else{let t=i.mapper.toViewRange(n.range);null!==n.attributeOldValue&&o&&(t=s.unwrap(t,o)),null!==n.attributeNewValue&&r&&s.wrap(t,r)}}}(n),{priority:t.converterPriority||"normal"})}}(t))}attributeToAttribute(t){return this.add(function(t){let e="attribute:"+((t=Fs(t)).model.key?t.model.key:t.model);t.model.name&&(e+=":"+t.model.name);if(t.model.values)for(const e of t.model.values)t.view[e]=Ys(t.view[e]);else t.view=Ys(t.view);const n=Ws(t);return i=>{var o;i.on(e,(o=n,(t,e,n)=>{const i=o(e.attributeOldValue,e),r=o(e.attributeNewValue,e);if(!i&&!r)return;if(!n.consumable.consume(e.item,t.name))return;const s=n.mapper.toViewElement(e.item),a=n.writer;if(!s)throw new hn.b("conversion-attribute-to-attribute-on-text: Trying to convert text node's attribute with attribute-to-attribute converter.",[e,n]);if(null!==e.attributeOldValue&&i)if("class"==i.key){const t=Array.isArray(i.value)?i.value:[i.value];for(const e of t)a.removeClass(e,s)}else if("style"==i.key){const t=Object.keys(i.value);for(const e of t)a.removeStyle(e,s)}else a.removeAttribute(i.key,s);if(null!==e.attributeNewValue&&r)if("class"==r.key){const t=Array.isArray(r.value)?r.value:[r.value];for(const e of t)a.addClass(e,s)}else if("style"==r.key){const t=Object.keys(r.value);for(const e of t)a.setStyle(e,r.value[e],s)}else a.setAttribute(r.key,r.value,s)}),{priority:t.converterPriority||"normal"})}}(t))}markerToElement(t){return this.add(function(t){return(t=Fs(t)).view=qs(t.view,"ui"),e=>{var n;e.on("addMarker:"+t.model,(n=t.view,(t,e,i)=>{e.isOpening=!0;const o=n(e,i.writer);e.isOpening=!1;const r=n(e,i.writer);if(!o||!r)return;const s=e.markerRange;if(s.isCollapsed&&!i.consumable.consume(s,t.name))return;for(const e of s)if(!i.consumable.consume(e.item,t.name))return;const a=i.mapper,c=i.writer;c.insert(a.toViewPosition(s.start),o),i.mapper.bindElementToMarker(o,e.markerName),s.isCollapsed||(c.insert(a.toViewPosition(s.end),r),i.mapper.bindElementToMarker(r,e.markerName)),t.stop()}),{priority:t.converterPriority||"normal"}),e.on("removeMarker:"+t.model,(t.view,(t,e,n)=>{const i=n.mapper.markerNameToElements(e.markerName);if(i){for(const t of i)n.mapper.unbindElementFromMarkerName(t,e.markerName),n.writer.clear(n.writer.createRangeOn(t),t);n.writer.clearClonedElementsGroup(e.markerName),t.stop()}}),{priority:t.converterPriority||"normal"})}}(t))}markerToHighlight(t){return this.add(function(t){return e=>{var n;e.on("addMarker:"+t.model,(n=t.view,(t,e,i)=>{if(!e.item)return;if(!(e.item instanceof Ms||e.item instanceof js||e.item.is("textProxy")))return;const o=Gs(n,e,i);if(!o)return;if(!i.consumable.consume(e.item,t.name))return;const r=i.writer,s=Hs(r,o),a=r.document.selection;if(e.item instanceof Ms||e.item instanceof js)r.wrap(a.getFirstRange(),s,a);else{const t=i.mapper.toViewRange(e.range),n=r.wrap(t,s);for(const t of n.getItems())if(t.is("attributeElement")&&t.isSimilar(s)){i.mapper.bindElementToMarker(t,e.markerName);break}}}),{priority:t.converterPriority||"normal"}),e.on("addMarker:"+t.model,function(t){return(e,n,i)=>{if(!n.item)return;if(!(n.item instanceof ps))return;const o=Gs(t,n,i);if(!o)return;if(!i.consumable.test(n.item,e.name))return;const r=i.mapper.toViewElement(n.item);if(r&&r.getCustomProperty("addHighlight")){i.consumable.consume(n.item,e.name);for(const t of xs._createIn(n.item))i.consumable.consume(t.item,e.name);r.getCustomProperty("addHighlight")(r,o,i.writer),i.mapper.bindElementToMarker(r,n.markerName)}}}(t.view),{priority:t.converterPriority||"normal"}),e.on("removeMarker:"+t.model,function(t){return(e,n,i)=>{if(n.markerRange.isCollapsed)return;const o=Gs(t,n,i);if(!o)return;const r=Hs(i.writer,o),s=i.mapper.markerNameToElements(n.markerName);if(s){for(const t of s)i.mapper.unbindElementFromMarkerName(t,n.markerName),t.is("attributeElement")?i.writer.unwrap(i.writer.createRangeOn(t),r):t.getCustomProperty("removeHighlight")(t,o.id,i.writer);i.writer.clearClonedElementsGroup(n.markerName),e.stop()}}}(t.view),{priority:t.converterPriority||"normal"})}}(t))}}function Hs(t,e){const n=t.createAttributeElement("span",e.attributes);return e.classes&&n._addClass(e.classes),e.priority&&(n._priority=e.priority),n._id=e.id,n}function qs(t,e){return"function"==typeof t?t:(n,i)=>function(t,e,n){"string"==typeof t&&(t={name:t});let i;const o=Object.assign({},t.attributes);if("container"==n)i=e.createContainerElement(t.name,o);else if("attribute"==n){const n={priority:t.priority||ro.DEFAULT_PRIORITY};i=e.createAttributeElement(t.name,o,n)}else i=e.createUIElement(t.name,o);if(t.styles){const n=Object.keys(t.styles);for(const o of n)e.setStyle(o,t.styles[o],i)}if(t.classes){const n=t.classes;if("string"==typeof n)e.addClass(n,i);else for(const t of n)e.addClass(t,i)}return i}(t,i,e)}function Ws(t){return t.model.values?(e,n)=>{const i=t.view[e];return i?i(e,n):null}:t.view}function Ys(t){return"string"==typeof t?e=>({key:t,value:e}):"object"==typeof t?t.value?()=>t:e=>({key:t.key,value:e}):t}function Gs(t,e,n){const i="function"==typeof t?t(e,n):t;return i?(i.priority||(i.priority=10),i.id||(i.id=e.markerName),i):null}class $s extends Bs{elementToElement(t){return this.add(Qs(t))}elementToAttribute(t){return this.add(function(t){Js(t=Fs(t));const e=Zs(t,!1),n=Ks(t.view),i=n?"element:"+n:"element";return n=>{n.on(i,e,{priority:t.converterPriority||"low"})}}(t))}attributeToAttribute(t){return this.add(function(t){t=Fs(t);let e=null;("string"==typeof t.view||t.view.key)&&(e=function(t){"string"==typeof t.view&&(t.view={key:t.view});const e=t.view.key;let n;if("class"==e||"style"==e){n={["class"==e?"classes":"styles"]:t.view.value}}else{const i=void 0===t.view.value?/[\s\S]*/:t.view.value;n={attributes:{[e]:i}}}t.view.name&&(n.name=t.view.name);return t.view=n,e}(t));Js(t,e);const n=Zs(t,!0);return e=>{e.on("element",n,{priority:t.converterPriority||"low"})}}(t))}elementToMarker(t){return this.add(function(t){return function(t){const e=t.model;t.model=(t,n)=>{const i="string"==typeof e?e:e(t);return n.createElement("$marker",{"data-name":i})}}(t=Fs(t)),Qs(t)}(t))}}function Qs(t){const e=function(t){const e=t.view?new jn(t.view):null;return(n,i,o)=>{let r={};if(e){const t=e.match(i.viewItem);if(!t)return;r=t.match}r.name=!0;const s=(a=t.model,c=i.viewItem,l=o.writer,a instanceof Function?a(c,l):l.createElement(a));var a,c,l;if(!s)return;if(!o.consumable.test(i.viewItem,r))return;const d=o.splitToAllowedParent(s,i.modelCursor);if(!d)return;o.writer.insert(s,d.position),o.convertChildren(i.viewItem,o.writer.createPositionAt(s,0)),o.consumable.consume(i.viewItem,r);const u=o.getSplitParts(s);i.modelRange=new xs(o.writer.createPositionBefore(s),o.writer.createPositionAfter(u[u.length-1])),d.cursorParent?i.modelCursor=o.writer.createPositionAt(d.cursorParent,0):i.modelCursor=i.modelRange.end}}(t=Fs(t)),n=Ks(t.view),i=n?"element:"+n:"element";return n=>{n.on(i,e,{priority:t.converterPriority||"normal"})}}function Ks(t){return"string"==typeof t?t:"object"==typeof t&&"string"==typeof t.name?t.name:null}function Js(t,e=null){const n=null===e||(t=>t.getAttribute(e)),i="object"!=typeof t.model?t.model:t.model.key,o="object"!=typeof t.model||void 0===t.model.value?n:t.model.value;t.model={key:i,value:o}}function Zs(t,e){const n=new jn(t.view);return(i,o,r)=>{const s=n.match(o.viewItem);if(!s)return;const a=t.model.key,c="function"==typeof t.model.value?t.model.value(o.viewItem):t.model.value;null!==c&&(!function(t,e){const n="function"==typeof t?t(e):t;if("object"==typeof n&&!Ks(n))return!1;return!n.classes&&!n.attributes&&!n.styles}(t.view,o.viewItem)?delete s.match.name:s.match.name=!0,r.consumable.test(o.viewItem,s.match)&&(o.modelRange||(o=Object.assign(o,r.convertChildren(o.viewItem,o.modelCursor))),function(t,e,n,i){let o=!1;for(const r of Array.from(t.getItems({shallow:n})))i.schema.checkAttribute(r,e.key)&&(i.writer.setAttribute(e.key,e.value,r),o=!0);return o}(o.modelRange,{key:a,value:c},e,r)&&r.consumable.consume(o.viewItem,s.match)))}}class Xs{constructor(t,e){this.model=t,this.view=new us(e),this.mapper=new As,this.downcastDispatcher=new Ps({mapper:this.mapper});const n=this.model.document,i=n.selection,o=this.model.markers;this.listenTo(this.model,"_beforeChanges",()=>{this.view._disableRendering(!0)},{priority:"highest"}),this.listenTo(this.model,"_afterChanges",()=>{this.view._disableRendering(!1)},{priority:"lowest"}),this.listenTo(n,"change",()=>{this.view.change(t=>{this.downcastDispatcher.convertChanges(n.differ,o,t),this.downcastDispatcher.convertSelection(i,o,t)})},{priority:"low"}),this.listenTo(this.view.document,"selectionChange",function(t,e){return(n,i)=>{const o=i.newSelection,r=new Ms,s=[];for(const t of o.getRanges())s.push(e.toModelRange(t));r.setTo(s,{backward:o.isBackward}),r.isEqual(t.document.selection)||t.change(t=>{t.setSelection(r)})}}(this.model,this.mapper)),this.downcastDispatcher.on("insert:$text",(t,e,n)=>{if(!n.consumable.consume(e.item,"insert"))return;const i=n.writer,o=n.mapper.toViewPosition(e.range.start),r=i.createText(e.item.data);i.insert(o,r)},{priority:"lowest"}),this.downcastDispatcher.on("remove",(t,e,n)=>{const i=n.mapper.toViewPosition(e.position),o=e.position.getShiftedBy(e.length),r=n.mapper.toViewPosition(o,{isPhantom:!0}),s=n.writer.createRange(i,r),a=n.writer.remove(s.getTrimmed());for(const t of n.writer.createRangeIn(a).getItems())n.mapper.unbindViewElement(t)},{priority:"low"}),this.downcastDispatcher.on("selection",(t,e,n)=>{const i=n.writer,o=i.document.selection;for(const t of o.getRanges())t.isCollapsed&&t.end.parent.isAttached()&&n.writer.mergeAttributes(t.start);i.setSelection(null)},{priority:"low"}),this.downcastDispatcher.on("selection",(t,e,n)=>{const i=e.selection;if(i.isCollapsed)return;if(!n.consumable.consume(i,"selection"))return;const o=[];for(const t of i.getRanges()){const e=n.mapper.toViewRange(t);o.push(e)}n.writer.setSelection(o,{backward:i.isBackward})},{priority:"low"}),this.downcastDispatcher.on("selection",(t,e,n)=>{const i=e.selection;if(!i.isCollapsed)return;if(!n.consumable.consume(i,"selection"))return;const o=n.writer,r=i.getFirstPosition(),s=n.mapper.toViewPosition(r),a=o.breakAttributes(s);o.setSelection(a)},{priority:"low"}),this.view.document.roots.bindTo(this.model.document.roots).using(t=>{if("$graveyard"==t.rootName)return null;const e=new Ki(this.view.document,t.name);return e.rootName=t.rootName,this.mapper.bindElements(t,e),e})}destroy(){this.view.destroy(),this.stopListening()}}xn(Xs,Ui);class ta{constructor(){this._commands=new Map}add(t,e){this._commands.set(t,e)}get(t){return this._commands.get(t)}execute(t,...e){const n=this.get(t);if(!n)throw new hn.b("commandcollection-command-not-found: Command does not exist.",this,{commandName:t});n.execute(...e)}*names(){yield*this._commands.keys()}*commands(){yield*this._commands.values()}[Symbol.iterator](){return this._commands[Symbol.iterator]()}destroy(){for(const t of this.commands())t.destroy()}}class ea{constructor(){this._consumables=new Map}add(t,e){let n;t.is("text")||t.is("documentFragment")?this._consumables.set(t,!0):(this._consumables.has(t)?n=this._consumables.get(t):(n=new na(t),this._consumables.set(t,n)),n.add(e))}test(t,e){const n=this._consumables.get(t);return void 0===n?null:t.is("text")||t.is("documentFragment")?n:n.test(e)}consume(t,e){return!!this.test(t,e)&&(t.is("text")||t.is("documentFragment")?this._consumables.set(t,!1):this._consumables.get(t).consume(e),!0)}revert(t,e){const n=this._consumables.get(t);void 0!==n&&(t.is("text")||t.is("documentFragment")?this._consumables.set(t,!0):n.revert(e))}static consumablesFromElement(t){const e={element:t,name:!0,attributes:[],classes:[],styles:[]},n=t.getAttributeKeys();for(const t of n)"style"!=t&&"class"!=t&&e.attributes.push(t);const i=t.getClassNames();for(const t of i)e.classes.push(t);const o=t.getStyleNames();for(const t of o)e.styles.push(t);return e}static createFrom(t,e){if(e||(e=new ea(t)),t.is("text"))return e.add(t),e;t.is("element")&&e.add(t,ea.consumablesFromElement(t)),t.is("documentFragment")&&e.add(t);for(const n of t.getChildren())e=ea.createFrom(n,e);return e}}class na{constructor(t){this.element=t,this._canConsumeName=null,this._consumables={attributes:new Map,styles:new Map,classes:new Map}}add(t){t.name&&(this._canConsumeName=!0);for(const e in this._consumables)e in t&&this._add(e,t[e])}test(t){if(t.name&&!this._canConsumeName)return this._canConsumeName;for(const e in this._consumables)if(e in t){const n=this._test(e,t[e]);if(!0!==n)return n}return!0}consume(t){t.name&&(this._canConsumeName=!1);for(const e in this._consumables)e in t&&this._consume(e,t[e])}revert(t){t.name&&(this._canConsumeName=!0);for(const e in this._consumables)e in t&&this._revert(e,t[e])}_add(t,e){const n=Dt(e)?e:[e],i=this._consumables[t];for(const e of n){if("attributes"===t&&("class"===e||"style"===e))throw new hn.b("viewconsumable-invalid-attribute: Classes and styles should be handled separately.",this);if(i.set(e,!0),"styles"===t)for(const t of this.element.document.stylesProcessor.getRelatedStyles(e))i.set(t,!0)}}_test(t,e){const n=Dt(e)?e:[e],i=this._consumables[t];for(const e of n)if("attributes"!==t||"class"!==e&&"style"!==e){const t=i.get(e);if(void 0===t)return null;if(!t)return!1}else{const t="class"==e?"classes":"styles",n=this._test(t,[...this._consumables[t].keys()]);if(!0!==n)return n}return!0}_consume(t,e){const n=Dt(e)?e:[e],i=this._consumables[t];for(const e of n)if("attributes"!==t||"class"!==e&&"style"!==e){if(i.set(e,!1),"styles"==t)for(const t of this.element.document.stylesProcessor.getRelatedStyles(e))i.set(t,!1)}else{const t="class"==e?"classes":"styles";this._consume(t,[...this._consumables[t].keys()])}}_revert(t,e){const n=Dt(e)?e:[e],i=this._consumables[t];for(const e of n)if("attributes"!==t||"class"!==e&&"style"!==e){!1===i.get(e)&&i.set(e,!0)}else{const t="class"==e?"classes":"styles";this._revert(t,[...this._consumables[t].keys()])}}}class ia{constructor(){this._sourceDefinitions={},this._attributeProperties={},this.decorate("checkChild"),this.decorate("checkAttribute"),this.on("checkAttribute",(t,e)=>{e[0]=new oa(e[0])},{priority:"highest"}),this.on("checkChild",(t,e)=>{e[0]=new oa(e[0]),e[1]=this.getDefinition(e[1])},{priority:"highest"})}register(t,e){if(this._sourceDefinitions[t])throw new hn.b("schema-cannot-register-item-twice: A single item cannot be registered twice in the schema.",this,{itemName:t});this._sourceDefinitions[t]=[Object.assign({},e)],this._clearCache()}extend(t,e){if(!this._sourceDefinitions[t])throw new hn.b("schema-cannot-extend-missing-item: Cannot extend an item which was not registered yet.",this,{itemName:t});this._sourceDefinitions[t].push(Object.assign({},e)),this._clearCache()}getDefinitions(){return this._compiledDefinitions||this._compile(),this._compiledDefinitions}getDefinition(t){let e;return e="string"==typeof t?t:t.is&&(t.is("text")||t.is("textProxy"))?"$text":t.name,this.getDefinitions()[e]}isRegistered(t){return!!this.getDefinition(t)}isBlock(t){const e=this.getDefinition(t);return!(!e||!e.isBlock)}isLimit(t){const e=this.getDefinition(t);return!!e&&!(!e.isLimit&&!e.isObject)}isObject(t){const e=this.getDefinition(t);return!(!e||!e.isObject)}isInline(t){const e=this.getDefinition(t);return!(!e||!e.isInline)}checkChild(t,e){return!!e&&this._checkContextMatch(e,t)}checkAttribute(t,e){const n=this.getDefinition(t.last);return!!n&&n.allowAttributes.includes(e)}checkMerge(t,e=null){if(t instanceof ks){const e=t.nodeBefore,n=t.nodeAfter;if(!(e instanceof ps))throw new hn.b("schema-check-merge-no-element-before: The node before the merge position must be an element.",this);if(!(n instanceof ps))throw new hn.b("schema-check-merge-no-element-after: The node after the merge position must be an element.",this);return this.checkMerge(e,n)}for(const n of e.getChildren())if(!this.checkChild(t,n))return!1;return!0}addChildCheck(t){this.on("checkChild",(e,[n,i])=>{if(!i)return;const o=t(n,i);"boolean"==typeof o&&(e.stop(),e.return=o)},{priority:"high"})}addAttributeCheck(t){this.on("checkAttribute",(e,[n,i])=>{const o=t(n,i);"boolean"==typeof o&&(e.stop(),e.return=o)},{priority:"high"})}setAttributeProperties(t,e){this._attributeProperties[t]=Object.assign(this.getAttributeProperties(t),e)}getAttributeProperties(t){return this._attributeProperties[t]||{}}getLimitElement(t){let e;if(t instanceof ks)e=t.parent;else{e=(t instanceof xs?[t]:Array.from(t.getRanges())).reduce((t,e)=>{const n=e.getCommonAncestor();return t?t.getCommonAncestor(n,{includeSelf:!0}):n},null)}for(;!this.isLimit(e)&&e.parent;)e=e.parent;return e}checkAttributeInSelection(t,e){if(t.isCollapsed){const n=[...t.getFirstPosition().getAncestors(),new fs("",t.getAttributes())];return this.checkAttribute(n,e)}{const n=t.getRanges();for(const t of n)for(const n of t)if(this.checkAttribute(n.item,e))return!0}return!1}*getValidRanges(t,e){t=function*(t){for(const e of t)yield*e.getMinimalFlatRanges()}(t);for(const n of t)yield*this._getValidRangesForRange(n,e)}getNearestSelectionRange(t,e="both"){if(this.checkChild(t,"$text"))return new xs(t);let n,i;const o=t.getAncestors().reverse().find(t=>this.isLimit(t))||t.root;"both"!=e&&"backward"!=e||(n=new bs({boundaries:xs._createIn(o),startPosition:t,direction:"backward"})),"both"!=e&&"forward"!=e||(i=new bs({boundaries:xs._createIn(o),startPosition:t}));for(const t of function*(t,e){let n=!1;for(;!n;){if(n=!0,t){const e=t.next();e.done||(n=!1,yield{walker:t,value:e.value})}if(e){const t=e.next();t.done||(n=!1,yield{walker:e,value:t.value})}}}(n,i)){const e=t.walker==n?"elementEnd":"elementStart",i=t.value;if(i.type==e&&this.isObject(i.item))return xs._createOn(i.item);if(this.checkChild(i.nextPosition,"$text"))return new xs(i.nextPosition)}return null}findAllowedParent(t,e){let n=t.parent;for(;n;){if(this.checkChild(n,e))return n;if(this.isLimit(n))return null;n=n.parent}return null}removeDisallowedAttributes(t,e){for(const n of t)if(n.is("text"))ga(this,n,e);else{const t=xs._createIn(n).getPositions();for(const n of t){ga(this,n.nodeBefore||n.parent,e)}}}createContext(t){return new oa(t)}_clearCache(){this._compiledDefinitions=null}_compile(){const t={},e=this._sourceDefinitions,n=Object.keys(e);for(const i of n)t[i]=ra(e[i],i);for(const e of n)sa(t,e);for(const e of n)aa(t,e);for(const e of n)ca(t,e),la(t,e);for(const e of n)da(t,e),ua(t,e);this._compiledDefinitions=t}_checkContextMatch(t,e,n=e.length-1){const i=e.getItem(n);if(t.allowIn.includes(i.name)){if(0==n)return!0;{const t=this.getDefinition(i);return this._checkContextMatch(t,e,n-1)}}return!1}*_getValidRangesForRange(t,e){let n=t.start,i=t.start;for(const o of t.getItems({shallow:!0}))o.is("element")&&(yield*this._getValidRangesForRange(xs._createIn(o),e)),this.checkAttribute(o,e)||(n.isEqual(i)||(yield new xs(n,i)),n=ks._createAfter(o)),i=ks._createAfter(o);n.isEqual(i)||(yield new xs(n,i))}}xn(ia,Ui);class oa{constructor(t){if(t instanceof oa)return t;"string"==typeof t?t=[t]:Array.isArray(t)||(t=t.getAncestors({includeSelf:!0})),t[0]&&"string"!=typeof t[0]&&t[0].is("documentFragment")&&t.shift(),this._items=t.map(ma)}get length(){return this._items.length}get last(){return this._items[this._items.length-1]}[Symbol.iterator](){return this._items[Symbol.iterator]()}push(t){const e=new oa([t]);return e._items=[...this._items,...e._items],e}getItem(t){return this._items[t]}*getNames(){yield*this._items.map(t=>t.name)}endsWith(t){return Array.from(this.getNames()).join(" ").endsWith(t)}startsWith(t){return Array.from(this.getNames()).join(" ").startsWith(t)}}function ra(t,e){const n={name:e,allowIn:[],allowContentOf:[],allowWhere:[],allowAttributes:[],allowAttributesOf:[],inheritTypesFrom:[]};return function(t,e){for(const n of t){const t=Object.keys(n).filter(t=>t.startsWith("is"));for(const i of t)e[i]=n[i]}}(t,n),ha(t,n,"allowIn"),ha(t,n,"allowContentOf"),ha(t,n,"allowWhere"),ha(t,n,"allowAttributes"),ha(t,n,"allowAttributesOf"),ha(t,n,"inheritTypesFrom"),function(t,e){for(const n of t){const t=n.inheritAllFrom;t&&(e.allowContentOf.push(t),e.allowWhere.push(t),e.allowAttributesOf.push(t),e.inheritTypesFrom.push(t))}}(t,n),n}function sa(t,e){for(const n of t[e].allowContentOf)if(t[n]){fa(t,n).forEach(t=>{t.allowIn.push(e)})}delete t[e].allowContentOf}function aa(t,e){for(const n of t[e].allowWhere){const i=t[n];if(i){const n=i.allowIn;t[e].allowIn.push(...n)}}delete t[e].allowWhere}function ca(t,e){for(const n of t[e].allowAttributesOf){const i=t[n];if(i){const n=i.allowAttributes;t[e].allowAttributes.push(...n)}}delete t[e].allowAttributesOf}function la(t,e){const n=t[e];for(const e of n.inheritTypesFrom){const i=t[e];if(i){const t=Object.keys(i).filter(t=>t.startsWith("is"));for(const e of t)e in n||(n[e]=i[e])}}delete n.inheritTypesFrom}function da(t,e){const n=t[e],i=n.allowIn.filter(e=>t[e]);n.allowIn=Array.from(new Set(i))}function ua(t,e){const n=t[e];n.allowAttributes=Array.from(new Set(n.allowAttributes))}function ha(t,e,n){for(const i of t)"string"==typeof i[n]?e[n].push(i[n]):Array.isArray(i[n])&&e[n].push(...i[n])}function fa(t,e){const n=t[e];return(i=t,Object.keys(i).map(t=>i[t])).filter(t=>t.allowIn.includes(n.name));var i}function ma(t){return"string"==typeof t?{name:t,*getAttributeKeys(){},getAttribute(){}}:{name:t.is("element")?t.name:"$text",*getAttributeKeys(){yield*t.getAttributeKeys()},getAttribute:e=>t.getAttribute(e)}}function ga(t,e,n){for(const i of e.getAttributeKeys())t.checkAttribute(e,i)||n.removeAttribute(i,e)}class pa{constructor(t={}){this._splitParts=new Map,this._modelCursor=null,this.conversionApi=Object.assign({},t),this.conversionApi.convertItem=this._convertItem.bind(this),this.conversionApi.convertChildren=this._convertChildren.bind(this),this.conversionApi.splitToAllowedParent=this._splitToAllowedParent.bind(this),this.conversionApi.getSplitParts=this._getSplitParts.bind(this)}convert(t,e,n=["$root"]){this.fire("viewCleanup",t),this._modelCursor=function(t,e){let n;for(const i of new oa(t)){const t={};for(const e of i.getAttributeKeys())t[e]=i.getAttribute(e);const o=e.createElement(i.name,t);n&&e.append(o,n),n=ks._createAt(o,0)}return n}(n,e),this.conversionApi.writer=e,this.conversionApi.consumable=ea.createFrom(t),this.conversionApi.store={};const{modelRange:i}=this._convertItem(t,this._modelCursor),o=e.createDocumentFragment();if(i){this._removeEmptyElements();for(const t of Array.from(this._modelCursor.parent.getChildren()))e.append(t,o);o.markers=function(t,e){const n=new Set,i=new Map,o=xs._createIn(t).getItems();for(const t of o)"$marker"==t.name&&n.add(t);for(const t of n){const n=t.getAttribute("data-name"),o=e.createPositionBefore(t);i.has(n)?i.get(n).end=o.clone():i.set(n,new xs(o.clone())),e.remove(t)}return i}(o,e)}return this._modelCursor=null,this._splitParts.clear(),this.conversionApi.writer=null,this.conversionApi.store=null,o}_convertItem(t,e){const n=Object.assign({viewItem:t,modelCursor:e,modelRange:null});if(t.is("element")?this.fire("element:"+t.name,n,this.conversionApi):t.is("text")?this.fire("text",n,this.conversionApi):this.fire("documentFragment",n,this.conversionApi),n.modelRange&&!(n.modelRange instanceof xs))throw new hn.b("view-conversion-dispatcher-incorrect-result: Incorrect conversion result was dropped.",this);return{modelRange:n.modelRange,modelCursor:n.modelCursor}}_convertChildren(t,e){const n=new xs(e);let i=e;for(const e of Array.from(t.getChildren())){const t=this._convertItem(e,i);t.modelRange instanceof xs&&(n.end=t.modelRange.end,i=t.modelCursor)}return{modelRange:n,modelCursor:i}}_splitToAllowedParent(t,e){const n=this.conversionApi.schema.findAllowedParent(e,t);if(!n)return null;if(n===e.parent)return{position:e};if(this._modelCursor.parent.getAncestors().includes(n))return null;const i=this.conversionApi.writer.split(e,n),o=[];for(const t of i.range.getWalker())if("elementEnd"==t.type)o.push(t.item);else{const e=o.pop(),n=t.item;this._registerSplitPair(e,n)}return{position:i.position,cursorParent:i.range.end.parent}}_registerSplitPair(t,e){this._splitParts.has(t)||this._splitParts.set(t,[t]);const n=this._splitParts.get(t);this._splitParts.set(e,n),n.push(e)}_getSplitParts(t){let e;return e=this._splitParts.has(t)?this._splitParts.get(t):[t],e}_removeEmptyElements(){let t=!1;for(const e of this._splitParts.keys())e.isEmpty&&(this.conversionApi.writer.remove(e),this._splitParts.delete(e),t=!0);t&&this._removeEmptyElements()}}xn(pa,gn);class ba{constructor(t,e){this.model=t,this.stylesProcessor=e,this.processor,this.mapper=new As,this.downcastDispatcher=new Ps({mapper:this.mapper}),this.downcastDispatcher.on("insert:$text",(t,e,n)=>{if(!n.consumable.consume(e.item,"insert"))return;const i=n.writer,o=n.mapper.toViewPosition(e.range.start),r=i.createText(e.item.data);i.insert(o,r)},{priority:"lowest"}),this.upcastDispatcher=new pa({schema:t.schema}),this.viewDocument=new oo(e),this._viewWriter=new Ao(this.viewDocument),this.upcastDispatcher.on("text",(t,e,n)=>{if(n.schema.checkChild(e.modelCursor,"$text")&&n.consumable.consume(e.viewItem)){const t=n.writer.createText(e.viewItem.data);n.writer.insert(t,e.modelCursor),e.modelRange=xs._createFromPositionAndShift(e.modelCursor,t.offsetSize),e.modelCursor=e.modelRange.end}},{priority:"lowest"}),this.upcastDispatcher.on("element",(t,e,n)=>{if(!e.modelRange&&n.consumable.consume(e.viewItem,{name:!0})){const{modelRange:t,modelCursor:i}=n.convertChildren(e.viewItem,e.modelCursor);e.modelRange=t,e.modelCursor=i}},{priority:"lowest"}),this.upcastDispatcher.on("documentFragment",(t,e,n)=>{if(!e.modelRange&&n.consumable.consume(e.viewItem,{name:!0})){const{modelRange:t,modelCursor:i}=n.convertChildren(e.viewItem,e.modelCursor);e.modelRange=t,e.modelCursor=i}},{priority:"lowest"}),this.decorate("init"),this.on("init",()=>{this.fire("ready")},{priority:"lowest"})}get(t){const{rootName:e="main",trim:n="empty"}=t||{};if(!this._checkIfRootsExists([e]))throw new hn.b("datacontroller-get-non-existent-root: Attempting to get data from a non-existing root.",this);const i=this.model.document.getRoot(e);return"empty"!==n||this.model.hasContent(i,{ignoreWhitespaces:!0})?this.stringify(i):""}stringify(t){const e=this.toView(t);return this.processor.toData(e)}toView(t){const e=this.viewDocument,n=this._viewWriter;this.mapper.clearBindings();const i=xs._createIn(t),o=new xo(e);if(this.mapper.bindElements(t,o),this.downcastDispatcher.convertInsert(i,n),!t.is("documentFragment")){const e=function(t){const e=[],n=t.root.document;if(!n)return[];const i=xs._createIn(t);for(const t of n.model.markers){const n=i.getIntersection(t.getRange());n&&e.push([t.name,n])}return e}(t);for(const[t,i]of e)this.downcastDispatcher.convertMarkerAdd(t,i,n)}return o}init(t){if(this.model.document.version)throw new hn.b("datacontroller-init-document-not-empty: Trying to set initial data to not empty document.",this);let e={};if("string"==typeof t?e.main=t:e=t,!this._checkIfRootsExists(Object.keys(e)))throw new hn.b("datacontroller-init-non-existent-root: Attempting to init data on a non-existing root.",this);return this.model.enqueueChange("transparent",t=>{for(const n of Object.keys(e)){const i=this.model.document.getRoot(n);t.insert(this.parse(e[n],i),i,0)}}),Promise.resolve()}set(t){let e={};if("string"==typeof t?e.main=t:e=t,!this._checkIfRootsExists(Object.keys(e)))throw new hn.b("datacontroller-set-non-existent-root: Attempting to set data on a non-existing root.",this);this.model.enqueueChange("transparent",t=>{t.setSelection(null),t.removeSelectionAttribute(this.model.document.selection.getAttributeKeys());for(const n of Object.keys(e)){const i=this.model.document.getRoot(n);t.remove(t.createRangeIn(i)),t.insert(this.parse(e[n],i),i,0)}})}parse(t,e="$root"){const n=this.processor.toView(t);return this.toModel(n,e)}toModel(t,e="$root"){return this.model.change(n=>this.upcastDispatcher.convert(t,n,e))}addStyleProcessorRules(t){t(this.stylesProcessor)}destroy(){this.stopListening()}_checkIfRootsExists(t){for(const e of t)if(!this.model.document.getRootNames().includes(e))return!1;return!0}}xn(ba,Ui);class wa{constructor(t,e){this._helpers=new Map,this._downcast=Array.isArray(t)?t:[t],this._createConversionHelpers({name:"downcast",dispatchers:this._downcast,isDowncast:!0}),this._upcast=Array.isArray(e)?e:[e],this._createConversionHelpers({name:"upcast",dispatchers:this._upcast,isDowncast:!1})}addAlias(t,e){const n=this._downcast.includes(e);if(!this._upcast.includes(e)&&!n)throw new hn.b("conversion-add-alias-dispatcher-not-registered: Trying to register and alias for a dispatcher that nas not been registered.",this);this._createConversionHelpers({name:t,dispatchers:[e],isDowncast:n})}for(t){if(!this._helpers.has(t))throw new hn.b("conversion-for-unknown-group: Trying to add a converter to an unknown dispatchers group.",this);return this._helpers.get(t)}elementToElement(t){this.for("downcast").elementToElement(t);for(const{model:e,view:n}of ka(t))this.for("upcast").elementToElement({model:e,view:n,converterPriority:t.converterPriority})}attributeToElement(t){this.for("downcast").attributeToElement(t);for(const{model:e,view:n}of ka(t))this.for("upcast").elementToAttribute({view:n,model:e,converterPriority:t.converterPriority})}attributeToAttribute(t){this.for("downcast").attributeToAttribute(t);for(const{model:e,view:n}of ka(t))this.for("upcast").attributeToAttribute({view:n,model:e})}_createConversionHelpers({name:t,dispatchers:e,isDowncast:n}){if(this._helpers.has(t))throw new hn.b("conversion-group-exists: Trying to register a group name that has already been registered.",this);const i=n?new Us(e):new $s(e);this._helpers.set(t,i)}}function*ka(t){if(t.model.values)for(const e of t.model.values){const n={key:t.model.key,value:e},i=t.view[e],o=t.upcastAlso?t.upcastAlso[e]:void 0;yield*_a(n,i,o)}else yield*_a(t.model,t.view,t.upcastAlso)}function*_a(t,e,n){if(yield{model:t,view:e},n){n=Array.isArray(n)?n:[n];for(const e of n)yield{model:t,view:e}}}class va{constructor(t="default"){this.operations=[],this.type=t}get baseVersion(){for(const t of this.operations)if(null!==t.baseVersion)return t.baseVersion;return null}addOperation(t){return t.batch=this,this.operations.push(t),t}}class ya{constructor(t){this.baseVersion=t,this.isDocumentOperation=null!==this.baseVersion,this.batch=null}_validate(){}toJSON(){const t=Object.assign({},this);return t.__className=this.constructor.className,delete t.batch,delete t.isDocumentOperation,t}static get className(){return"Operation"}static fromJSON(t){return new this(t.baseVersion)}}class xa{constructor(t){this.markers=new Map,this._children=new gs,t&&this._insertChild(0,t)}[Symbol.iterator](){return this.getChildren()}get childCount(){return this._children.length}get maxOffset(){return this._children.maxOffset}get isEmpty(){return 0===this.childCount}get root(){return this}get parent(){return null}is(t){return"documentFragment"===t||"model:documentFragment"===t}getChild(t){return this._children.getNode(t)}getChildren(){return this._children[Symbol.iterator]()}getChildIndex(t){return this._children.getNodeIndex(t)}getChildStartOffset(t){return this._children.getNodeStartOffset(t)}getPath(){return[]}getNodeByPath(t){let e=this;for(const n of t)e=e.getChild(e.offsetToIndex(n));return e}offsetToIndex(t){return this._children.offsetToIndex(t)}toJSON(){const t=[];for(const e of this._children)t.push(e.toJSON());return t}static fromJSON(t){const e=[];for(const n of t)n.name?e.push(ps.fromJSON(n)):e.push(fs.fromJSON(n));return new xa(e)}_appendChild(t){this._insertChild(this.childCount,t)}_insertChild(t,e){const n=function(t){if("string"==typeof t)return[new fs(t)];yn(t)||(t=[t]);return Array.from(t).map(t=>"string"==typeof t?new fs(t):t instanceof ms?new fs(t.data,t.getAttributes()):t)}(e);for(const t of n)null!==t.parent&&t._remove(),t.parent=this;this._children._insertNodes(t,n)}_removeChildren(t,e=1){const n=this._children._removeNodes(t,e);for(const t of n)t.parent=null;return n}}function Aa(t,e){const n=(e=Pa(e)).reduce((t,e)=>t+e.offsetSize,0),i=t.parent;Ma(t);const o=t.index;return i._insertChild(o,e),Sa(i,o+e.length),Sa(i,o),new xs(t,t.getShiftedBy(n))}function Ta(t){if(!t.isFlat)throw new hn.b("operation-utils-remove-range-not-flat: Trying to remove a range which starts and ends in different element.",this);const e=t.start.parent;Ma(t.start),Ma(t.end);const n=e._removeChildren(t.start.index,t.end.index-t.start.index);return Sa(e,t.start.index),n}function Ca(t,e){if(!t.isFlat)throw new hn.b("operation-utils-move-range-not-flat: Trying to move a range which starts and ends in different element.",this);const n=Ta(t);return Aa(e=e._getTransformedByDeletion(t.start,t.end.offset-t.start.offset),n)}function Pa(t){const e=[];t instanceof Array||(t=[t]);for(let n=0;n<t.length;n++)if("string"==typeof t[n])e.push(new fs(t[n]));else if(t[n]instanceof ms)e.push(new fs(t[n].data,t[n].getAttributes()));else if(t[n]instanceof xa||t[n]instanceof gs)for(const i of t[n])e.push(i);else t[n]instanceof hs&&e.push(t[n]);for(let t=1;t<e.length;t++){const n=e[t],i=e[t-1];n instanceof fs&&i instanceof fs&&Ea(n,i)&&(e.splice(t-1,2,new fs(i.data+n.data,i.getAttributes())),t--)}return e}function Sa(t,e){const n=t.getChild(e-1),i=t.getChild(e);if(n&&i&&n.is("text")&&i.is("text")&&Ea(n,i)){const o=new fs(n.data+i.data,n.getAttributes());t._removeChildren(e-1,2),t._insertChild(e-1,o)}}function Ma(t){const e=t.textNode,n=t.parent;if(e){const i=t.offset-e.startOffset,o=e.index;n._removeChildren(o,1);const r=new fs(e.data.substr(0,i),e.getAttributes()),s=new fs(e.data.substr(i),e.getAttributes());n._insertChild(o,[r,s])}}function Ea(t,e){const n=t.getAttributes(),i=e.getAttributes();for(const t of n){if(t[1]!==e.getAttribute(t[0]))return!1;i.next()}return i.next().done}var Ia=function(t,e){return Sr(t,e)};class Na extends ya{constructor(t,e,n,i,o){super(o),this.range=t.clone(),this.key=e,this.oldValue=void 0===n?null:n,this.newValue=void 0===i?null:i}get type(){return null===this.oldValue?"addAttribute":null===this.newValue?"removeAttribute":"changeAttribute"}clone(){return new Na(this.range,this.key,this.oldValue,this.newValue,this.baseVersion)}getReversed(){return new Na(this.range,this.key,this.newValue,this.oldValue,this.baseVersion+1)}toJSON(){const t=super.toJSON();return t.range=this.range.toJSON(),t}_validate(){if(!this.range.isFlat)throw new hn.b("attribute-operation-range-not-flat: The range to change is not flat.",this);for(const t of this.range.getItems({shallow:!0})){if(null!==this.oldValue&&!Ia(t.getAttribute(this.key),this.oldValue))throw new hn.b("attribute-operation-wrong-old-value: Changed node has different attribute value than operation's old attribute value.",this,{item:t,key:this.key,value:this.oldValue});if(null===this.oldValue&&null!==this.newValue&&t.hasAttribute(this.key))throw new hn.b("attribute-operation-attribute-exists: The attribute with given key already exists.",this,{node:t,key:this.key})}}_execute(){Ia(this.oldValue,this.newValue)||function(t,e,n){Ma(t.start),Ma(t.end);for(const i of t.getItems({shallow:!0})){const t=i.is("textProxy")?i.textNode:i;null!==n?t._setAttribute(e,n):t._removeAttribute(e),Sa(t.parent,t.index)}Sa(t.end.parent,t.end.index)}(this.range,this.key,this.newValue)}static get className(){return"AttributeOperation"}static fromJSON(t,e){return new Na(xs.fromJSON(t.range,e),t.key,t.oldValue,t.newValue,t.baseVersion)}}class Oa extends ya{constructor(t,e){super(null),this.sourcePosition=t.clone(),this.howMany=e}get type(){return"detach"}toJSON(){const t=super.toJSON();return t.sourcePosition=this.sourcePosition.toJSON(),t}_validate(){if(this.sourcePosition.root.document)throw new hn.b("detach-operation-on-document-node: Cannot detach document node.",this)}_execute(){Ta(xs._createFromPositionAndShift(this.sourcePosition,this.howMany))}static get className(){return"DetachOperation"}}class Ra extends ya{constructor(t,e,n,i){super(i),this.sourcePosition=t.clone(),this.sourcePosition.stickiness="toNext",this.howMany=e,this.targetPosition=n.clone(),this.targetPosition.stickiness="toNone"}get type(){return"$graveyard"==this.targetPosition.root.rootName?"remove":"$graveyard"==this.sourcePosition.root.rootName?"reinsert":"move"}clone(){return new this.constructor(this.sourcePosition,this.howMany,this.targetPosition,this.baseVersion)}getMovedRangeStart(){return this.targetPosition._getTransformedByDeletion(this.sourcePosition,this.howMany)}getReversed(){const t=this.sourcePosition._getTransformedByInsertion(this.targetPosition,this.howMany);return new this.constructor(this.getMovedRangeStart(),this.howMany,t,this.baseVersion+1)}_validate(){const t=this.sourcePosition.parent,e=this.targetPosition.parent,n=this.sourcePosition.offset,i=this.targetPosition.offset;if(n+this.howMany>t.maxOffset)throw new hn.b("move-operation-nodes-do-not-exist: The nodes which should be moved do not exist.",this);if(t===e&&n<i&&i<n+this.howMany)throw new hn.b("move-operation-range-into-itself: Trying to move a range of nodes to the inside of that range.",this);if(this.sourcePosition.root==this.targetPosition.root&&"prefix"==In(this.sourcePosition.getParentPath(),this.targetPosition.getParentPath())){const t=this.sourcePosition.path.length-1;if(this.targetPosition.path[t]>=n&&this.targetPosition.path[t]<n+this.howMany)throw new hn.b("move-operation-node-into-itself: Trying to move a range of nodes into one of nodes from that range.",this)}}_execute(){Ca(xs._createFromPositionAndShift(this.sourcePosition,this.howMany),this.targetPosition)}toJSON(){const t=super.toJSON();return t.sourcePosition=this.sourcePosition.toJSON(),t.targetPosition=this.targetPosition.toJSON(),t}static get className(){return"MoveOperation"}static fromJSON(t,e){const n=ks.fromJSON(t.sourcePosition,e),i=ks.fromJSON(t.targetPosition,e);return new this(n,t.howMany,i,t.baseVersion)}}class Da extends ya{constructor(t,e,n){super(n),this.position=t.clone(),this.position.stickiness="toNone",this.nodes=new gs(Pa(e)),this.shouldReceiveAttributes=!1}get type(){return"insert"}get howMany(){return this.nodes.maxOffset}clone(){const t=new gs([...this.nodes].map(t=>t._clone(!0))),e=new Da(this.position,t,this.baseVersion);return e.shouldReceiveAttributes=this.shouldReceiveAttributes,e}getReversed(){const t=this.position.root.document.graveyard,e=new ks(t,[0]);return new Ra(this.position,this.nodes.maxOffset,e,this.baseVersion+1)}_validate(){const t=this.position.parent;if(!t||t.maxOffset<this.position.offset)throw new hn.b("insert-operation-position-invalid: Insertion position is invalid.",this)}_execute(){const t=this.nodes;this.nodes=new gs([...t].map(t=>t._clone(!0))),Aa(this.position,t)}toJSON(){const t=super.toJSON();return t.position=this.position.toJSON(),t.nodes=this.nodes.toJSON(),t}static get className(){return"InsertOperation"}static fromJSON(t,e){const n=[];for(const e of t.nodes)e.name?n.push(ps.fromJSON(e)):n.push(fs.fromJSON(e));const i=new Da(ks.fromJSON(t.position,e),n,t.baseVersion);return i.shouldReceiveAttributes=t.shouldReceiveAttributes,i}}class La extends ya{constructor(t,e,n,i,o,r){super(r),this.name=t,this.oldRange=e?e.clone():null,this.newRange=n?n.clone():null,this.affectsData=o,this._markers=i}get type(){return"marker"}clone(){return new La(this.name,this.oldRange,this.newRange,this._markers,this.affectsData,this.baseVersion)}getReversed(){return new La(this.name,this.newRange,this.oldRange,this._markers,this.affectsData,this.baseVersion+1)}_execute(){const t=this.newRange?"_set":"_remove";this._markers[t](this.name,this.newRange,!0,this.affectsData)}toJSON(){const t=super.toJSON();return this.oldRange&&(t.oldRange=this.oldRange.toJSON()),this.newRange&&(t.newRange=this.newRange.toJSON()),delete t._markers,t}static get className(){return"MarkerOperation"}static fromJSON(t,e){return new La(t.name,t.oldRange?xs.fromJSON(t.oldRange,e):null,t.newRange?xs.fromJSON(t.newRange,e):null,e.model.markers,t.affectsData,t.baseVersion)}}class ja extends ya{constructor(t,e,n,i){super(i),this.position=t,this.position.stickiness="toNext",this.oldName=e,this.newName=n}get type(){return"rename"}clone(){return new ja(this.position.clone(),this.oldName,this.newName,this.baseVersion)}getReversed(){return new ja(this.position.clone(),this.newName,this.oldName,this.baseVersion+1)}_validate(){const t=this.position.nodeAfter;if(!(t instanceof ps))throw new hn.b("rename-operation-wrong-position: Given position is invalid or node after it is not an instance of Element.",this);if(t.name!==this.oldName)throw new hn.b("rename-operation-wrong-name: Element to change has different name than operation's old name.",this)}_execute(){this.position.nodeAfter.name=this.newName}toJSON(){const t=super.toJSON();return t.position=this.position.toJSON(),t}static get className(){return"RenameOperation"}static fromJSON(t,e){return new ja(ks.fromJSON(t.position,e),t.oldName,t.newName,t.baseVersion)}}class Va extends ya{constructor(t,e,n,i,o){super(o),this.root=t,this.key=e,this.oldValue=n,this.newValue=i}get type(){return null===this.oldValue?"addRootAttribute":null===this.newValue?"removeRootAttribute":"changeRootAttribute"}clone(){return new Va(this.root,this.key,this.oldValue,this.newValue,this.baseVersion)}getReversed(){return new Va(this.root,this.key,this.newValue,this.oldValue,this.baseVersion+1)}_validate(){if(this.root!=this.root.root||this.root.is("documentFragment"))throw new hn.b("rootattribute-operation-not-a-root: The element to change is not a root element.",this,{root:this.root,key:this.key});if(null!==this.oldValue&&this.root.getAttribute(this.key)!==this.oldValue)throw new hn.b("rootattribute-operation-wrong-old-value: Changed node has different attribute value than operation's old attribute value.",this,{root:this.root,key:this.key});if(null===this.oldValue&&null!==this.newValue&&this.root.hasAttribute(this.key))throw new hn.b("rootattribute-operation-attribute-exists: The attribute with given key already exists.",this,{root:this.root,key:this.key})}_execute(){null!==this.newValue?this.root._setAttribute(this.key,this.newValue):this.root._removeAttribute(this.key)}toJSON(){const t=super.toJSON();return t.root=this.root.toJSON(),t}static get className(){return"RootAttributeOperation"}static fromJSON(t,e){if(!e.getRoot(t.root))throw new hn.b("rootattribute-operation-fromjson-no-root: Cannot create RootAttributeOperation. Root with specified name does not exist.",this,{rootName:t.root});return new Va(e.getRoot(t.root),t.key,t.oldValue,t.newValue,t.baseVersion)}}class za extends ya{constructor(t,e,n,i,o){super(o),this.sourcePosition=t.clone(),this.sourcePosition.stickiness="toPrevious",this.howMany=e,this.targetPosition=n.clone(),this.targetPosition.stickiness="toNext",this.graveyardPosition=i.clone()}get type(){return"merge"}get deletionPosition(){return new ks(this.sourcePosition.root,this.sourcePosition.path.slice(0,-1))}get movedRange(){const t=this.sourcePosition.getShiftedBy(Number.POSITIVE_INFINITY);return new xs(this.sourcePosition,t)}clone(){return new this.constructor(this.sourcePosition,this.howMany,this.targetPosition,this.graveyardPosition,this.baseVersion)}getReversed(){const t=this.targetPosition._getTransformedByMergeOperation(this),e=this.sourcePosition.path.slice(0,-1),n=new ks(this.sourcePosition.root,e)._getTransformedByMergeOperation(this),i=new Ba(t,this.howMany,this.graveyardPosition,this.baseVersion+1);return i.insertionPosition=n,i}_validate(){const t=this.sourcePosition.parent,e=this.targetPosition.parent;if(!t.parent)throw new hn.b("merge-operation-source-position-invalid: Merge source position is invalid.",this);if(!e.parent)throw new hn.b("merge-operation-target-position-invalid: Merge target position is invalid.",this);if(this.howMany!=t.maxOffset)throw new hn.b("merge-operation-how-many-invalid: Merge operation specifies wrong number of nodes to move.",this)}_execute(){const t=this.sourcePosition.parent;Ca(xs._createIn(t),this.targetPosition),Ca(xs._createOn(t),this.graveyardPosition)}toJSON(){const t=super.toJSON();return t.sourcePosition=t.sourcePosition.toJSON(),t.targetPosition=t.targetPosition.toJSON(),t.graveyardPosition=t.graveyardPosition.toJSON(),t}static get className(){return"MergeOperation"}static fromJSON(t,e){const n=ks.fromJSON(t.sourcePosition,e),i=ks.fromJSON(t.targetPosition,e),o=ks.fromJSON(t.graveyardPosition,e);return new this(n,t.howMany,i,o,t.baseVersion)}}class Ba extends ya{constructor(t,e,n,i){super(i),this.splitPosition=t.clone(),this.splitPosition.stickiness="toNext",this.howMany=e,this.insertionPosition=Ba.getInsertionPosition(t),this.insertionPosition.stickiness="toNone",this.graveyardPosition=n?n.clone():null,this.graveyardPosition&&(this.graveyardPosition.stickiness="toNext")}get type(){return"split"}get moveTargetPosition(){const t=this.insertionPosition.path.slice();return t.push(0),new ks(this.insertionPosition.root,t)}get movedRange(){const t=this.splitPosition.getShiftedBy(Number.POSITIVE_INFINITY);return new xs(this.splitPosition,t)}clone(){const t=new this.constructor(this.splitPosition,this.howMany,this.graveyardPosition,this.baseVersion);return t.insertionPosition=this.insertionPosition,t}getReversed(){const t=this.splitPosition.root.document.graveyard,e=new ks(t,[0]);return new za(this.moveTargetPosition,this.howMany,this.splitPosition,e,this.baseVersion+1)}_validate(){const t=this.splitPosition.parent,e=this.splitPosition.offset;if(!t||t.maxOffset<e)throw new hn.b("split-operation-position-invalid: Split position is invalid.",this);if(!t.parent)throw new hn.b("split-operation-split-in-root: Cannot split root element.",this);if(this.howMany!=t.maxOffset-this.splitPosition.offset)throw new hn.b("split-operation-how-many-invalid: Split operation specifies wrong number of nodes to move.",this);if(this.graveyardPosition&&!this.graveyardPosition.nodeAfter)throw new hn.b("split-operation-graveyard-position-invalid: Graveyard position invalid.",this)}_execute(){const t=this.splitPosition.parent;if(this.graveyardPosition)Ca(xs._createFromPositionAndShift(this.graveyardPosition,1),this.insertionPosition);else{const e=t._clone();Aa(this.insertionPosition,e)}Ca(new xs(ks._createAt(t,this.splitPosition.offset),ks._createAt(t,t.maxOffset)),this.moveTargetPosition)}toJSON(){const t=super.toJSON();return t.splitPosition=this.splitPosition.toJSON(),t.insertionPosition=this.insertionPosition.toJSON(),this.graveyardPosition&&(t.graveyardPosition=this.graveyardPosition.toJSON()),t}static get className(){return"SplitOperation"}static getInsertionPosition(t){const e=t.path.slice(0,-1);return e[e.length-1]++,new ks(t.root,e)}static fromJSON(t,e){const n=ks.fromJSON(t.splitPosition,e),i=ks.fromJSON(t.insertionPosition,e),o=t.graveyardPosition?ks.fromJSON(t.graveyardPosition,e):null,r=new this(n,t.howMany,o,t.baseVersion);return r.insertionPosition=i,r}}class Fa extends ps{constructor(t,e,n="main"){super(e),this._document=t,this.rootName=n}get document(){return this._document}is(t,e){return e?e===this.name&&("rootElement"===t||"model:rootElement"===t||"element"===t||"model:element"===t):"rootElement"===t||"model:rootElement"===t||"element"===t||"model:element"===t||t===this.name||t==="model:"+this.name||"node"===t||"model:node"===t}toJSON(){return this.rootName}}class Ua{constructor(t,e){this.model=t,this.batch=e}createText(t,e){return new fs(t,e)}createElement(t,e){return new ps(t,e)}createDocumentFragment(){return new xa}insert(t,e,n=0){if(this._assertWriterUsedCorrectly(),t instanceof fs&&""==t.data)return;const i=ks._createAt(e,n);if(t.parent){if(Ga(t.root,i.root))return void this.move(xs._createOn(t),i);if(t.root.document)throw new hn.b("model-writer-insert-forbidden-move: Cannot move a node from a document to a different tree. It is forbidden to move a node that was already in a document outside of it.",this);this.remove(t)}const o=i.root.document?i.root.document.version:null,r=new Da(i,t,o);if(t instanceof fs&&(r.shouldReceiveAttributes=!0),this.batch.addOperation(r),this.model.applyOperation(r),t instanceof xa)for(const[e,n]of t.markers){const t=ks._createAt(n.root,0),o={range:new xs(n.start._getCombined(t,i),n.end._getCombined(t,i)),usingOperation:!0,affectsData:!0};this.model.markers.has(e)?this.updateMarker(e,o):this.addMarker(e,o)}}insertText(t,e,n,i){e instanceof xa||e instanceof ps||e instanceof ks?this.insert(this.createText(t),e,n):this.insert(this.createText(t,e),n,i)}insertElement(t,e,n,i){e instanceof xa||e instanceof ps||e instanceof ks?this.insert(this.createElement(t),e,n):this.insert(this.createElement(t,e),n,i)}append(t,e){this.insert(t,e,"end")}appendText(t,e,n){e instanceof xa||e instanceof ps?this.insert(this.createText(t),e,"end"):this.insert(this.createText(t,e),n,"end")}appendElement(t,e,n){e instanceof xa||e instanceof ps?this.insert(this.createElement(t),e,"end"):this.insert(this.createElement(t,e),n,"end")}setAttribute(t,e,n){if(this._assertWriterUsedCorrectly(),n instanceof xs){const i=n.getMinimalFlatRanges();for(const n of i)Ha(this,t,e,n)}else qa(this,t,e,n)}setAttributes(t,e){for(const[n,i]of Ln(t))this.setAttribute(n,i,e)}removeAttribute(t,e){if(this._assertWriterUsedCorrectly(),e instanceof xs){const n=e.getMinimalFlatRanges();for(const e of n)Ha(this,t,null,e)}else qa(this,t,null,e)}clearAttributes(t){this._assertWriterUsedCorrectly();const e=t=>{for(const e of t.getAttributeKeys())this.removeAttribute(e,t)};if(t instanceof xs)for(const n of t.getItems())e(n);else e(t)}move(t,e,n){if(this._assertWriterUsedCorrectly(),!(t instanceof xs))throw new hn.b("writer-move-invalid-range: Invalid range to move.",this);if(!t.isFlat)throw new hn.b("writer-move-range-not-flat: Range to move is not flat.",this);const i=ks._createAt(e,n);if(i.isEqual(t.start))return;if(this._addOperationForAffectedMarkers("move",t),!Ga(t.root,i.root))throw new hn.b("writer-move-different-document: Range is going to be moved between different documents.",this);const o=t.root.document?t.root.document.version:null,r=new Ra(t.start,t.end.offset-t.start.offset,i,o);this.batch.addOperation(r),this.model.applyOperation(r)}remove(t){this._assertWriterUsedCorrectly();const e=(t instanceof xs?t:xs._createOn(t)).getMinimalFlatRanges().reverse();for(const t of e)this._addOperationForAffectedMarkers("move",t),Ya(t.start,t.end.offset-t.start.offset,this.batch,this.model)}merge(t){this._assertWriterUsedCorrectly();const e=t.nodeBefore,n=t.nodeAfter;if(this._addOperationForAffectedMarkers("merge",t),!(e instanceof ps))throw new hn.b("writer-merge-no-element-before: Node before merge position must be an element.",this);if(!(n instanceof ps))throw new hn.b("writer-merge-no-element-after: Node after merge position must be an element.",this);t.root.document?this._merge(t):this._mergeDetached(t)}createPositionFromPath(t,e,n){return this.model.createPositionFromPath(t,e,n)}createPositionAt(t,e){return this.model.createPositionAt(t,e)}createPositionAfter(t){return this.model.createPositionAfter(t)}createPositionBefore(t){return this.model.createPositionBefore(t)}createRange(t,e){return this.model.createRange(t,e)}createRangeIn(t){return this.model.createRangeIn(t)}createRangeOn(t){return this.model.createRangeOn(t)}createSelection(t,e,n){return this.model.createSelection(t,e,n)}_mergeDetached(t){const e=t.nodeBefore,n=t.nodeAfter;this.move(xs._createIn(n),ks._createAt(e,"end")),this.remove(n)}_merge(t){const e=ks._createAt(t.nodeBefore,"end"),n=ks._createAt(t.nodeAfter,0),i=t.root.document.graveyard,o=new ks(i,[0]),r=t.root.document.version,s=new za(n,t.nodeAfter.maxOffset,e,o,r);this.batch.addOperation(s),this.model.applyOperation(s)}rename(t,e){if(this._assertWriterUsedCorrectly(),!(t instanceof ps))throw new hn.b("writer-rename-not-element-instance: Trying to rename an object which is not an instance of Element.",this);const n=t.root.document?t.root.document.version:null,i=new ja(ks._createBefore(t),t.name,e,n);this.batch.addOperation(i),this.model.applyOperation(i)}split(t,e){this._assertWriterUsedCorrectly();let n,i,o=t.parent;if(!o.parent)throw new hn.b("writer-split-element-no-parent: Element with no parent can not be split.",this);if(e||(e=o.parent),!t.parent.getAncestors({includeSelf:!0}).includes(e))throw new hn.b("writer-split-invalid-limit-element: Limit element is not a position ancestor.",this);do{const e=o.root.document?o.root.document.version:null,r=o.maxOffset-t.offset,s=new Ba(t,r,null,e);this.batch.addOperation(s),this.model.applyOperation(s),n||i||(n=o,i=t.parent.nextSibling),o=(t=this.createPositionAfter(t.parent)).parent}while(o!==e);return{position:t,range:new xs(ks._createAt(n,"end"),ks._createAt(i,0))}}wrap(t,e){if(this._assertWriterUsedCorrectly(),!t.isFlat)throw new hn.b("writer-wrap-range-not-flat: Range to wrap is not flat.",this);const n=e instanceof ps?e:new ps(e);if(n.childCount>0)throw new hn.b("writer-wrap-element-not-empty: Element to wrap with is not empty.",this);if(null!==n.parent)throw new hn.b("writer-wrap-element-attached: Element to wrap with is already attached to tree model.",this);this.insert(n,t.start);const i=new xs(t.start.getShiftedBy(1),t.end.getShiftedBy(1));this.move(i,ks._createAt(n,0))}unwrap(t){if(this._assertWriterUsedCorrectly(),null===t.parent)throw new hn.b("writer-unwrap-element-no-parent: Trying to unwrap an element which has no parent.",this);this.move(xs._createIn(t),this.createPositionAfter(t)),this.remove(t)}addMarker(t,e){if(this._assertWriterUsedCorrectly(),!e||"boolean"!=typeof e.usingOperation)throw new hn.b("writer-addMarker-no-usingOperation: The options.usingOperation parameter is required when adding a new marker.",this);const n=e.usingOperation,i=e.range,o=void 0!==e.affectsData&&e.affectsData;if(this.model.markers.has(t))throw new hn.b("writer-addMarker-marker-exists: Marker with provided name already exists.",this);if(!i)throw new hn.b("writer-addMarker-no-range: Range parameter is required when adding a new marker.",this);return n?(Wa(this,t,null,i,o),this.model.markers.get(t)):this.model.markers._set(t,i,n,o)}updateMarker(t,e){this._assertWriterUsedCorrectly();const n="string"==typeof t?t:t.name,i=this.model.markers.get(n);if(!i)throw new hn.b("writer-updateMarker-marker-not-exists: Marker with provided name does not exists.",this);if(!e)return void this.model.markers._refresh(i);const o="boolean"==typeof e.usingOperation,r="boolean"==typeof e.affectsData,s=r?e.affectsData:i.affectsData;if(!o&&!e.range&&!r)throw new hn.b("writer-updateMarker-wrong-options: One of the options is required - provide range, usingOperations or affectsData.",this);const a=i.getRange(),c=e.range?e.range:a;o&&e.usingOperation!==i.managedUsingOperations?e.usingOperation?Wa(this,n,null,c,s):(Wa(this,n,a,null,s),this.model.markers._set(n,c,void 0,s)):i.managedUsingOperations?Wa(this,n,a,c,s):this.model.markers._set(n,c,void 0,s)}removeMarker(t){this._assertWriterUsedCorrectly();const e="string"==typeof t?t:t.name;if(!this.model.markers.has(e))throw new hn.b("writer-removeMarker-no-marker: Trying to remove marker which does not exist.",this);const n=this.model.markers.get(e);n.managedUsingOperations?Wa(this,e,n.getRange(),null,n.affectsData):this.model.markers._remove(e)}setSelection(t,e,n){this._assertWriterUsedCorrectly(),this.model.document.selection._setTo(t,e,n)}setSelectionFocus(t,e){this._assertWriterUsedCorrectly(),this.model.document.selection._setFocus(t,e)}setSelectionAttribute(t,e){if(this._assertWriterUsedCorrectly(),"string"==typeof t)this._setSelectionAttribute(t,e);else for(const[e,n]of Ln(t))this._setSelectionAttribute(e,n)}removeSelectionAttribute(t){if(this._assertWriterUsedCorrectly(),"string"==typeof t)this._removeSelectionAttribute(t);else for(const e of t)this._removeSelectionAttribute(e)}overrideSelectionGravity(){return this.model.document.selection._overrideGravity()}restoreSelectionGravity(t){this.model.document.selection._restoreGravity(t)}_setSelectionAttribute(t,e){const n=this.model.document.selection;if(n.isCollapsed&&n.anchor.parent.isEmpty){const i=js._getStoreAttributeKey(t);this.setAttribute(i,e,n.anchor.parent)}n._setAttribute(t,e)}_removeSelectionAttribute(t){const e=this.model.document.selection;if(e.isCollapsed&&e.anchor.parent.isEmpty){const n=js._getStoreAttributeKey(t);this.removeAttribute(n,e.anchor.parent)}e._removeAttribute(t)}_assertWriterUsedCorrectly(){if(this.model._currentWriter!==this)throw new hn.b("writer-incorrect-use: Trying to use a writer outside the change() block.",this)}_addOperationForAffectedMarkers(t,e){for(const n of this.model.markers){if(!n.managedUsingOperations)continue;const i=n.getRange();let o=!1;if("move"===t)o=e.containsPosition(i.start)||e.start.isEqual(i.start)||e.containsPosition(i.end)||e.end.isEqual(i.end);else{const t=e.nodeBefore,n=e.nodeAfter,r=i.start.parent==t&&i.start.isAtEnd,s=i.end.parent==n&&0==i.end.offset,a=i.end.nodeAfter==n,c=i.start.nodeAfter==n;o=r||s||a||c}o&&this.updateMarker(n.name,{range:i})}}}function Ha(t,e,n,i){const o=t.model,r=o.document;let s,a,c,l=i.start;for(const t of i.getWalker({shallow:!0}))c=t.item.getAttribute(e),s&&a!=c&&(a!=n&&d(),l=s),s=t.nextPosition,a=c;function d(){const i=new xs(l,s),c=i.root.document?r.version:null,d=new Na(i,e,a,n,c);t.batch.addOperation(d),o.applyOperation(d)}s instanceof ks&&s!=l&&a!=n&&d()}function qa(t,e,n,i){const o=t.model,r=o.document,s=i.getAttribute(e);let a,c;if(s!=n){if(i.root===i){const t=i.document?r.version:null;c=new Va(i,e,s,n,t)}else{a=new xs(ks._createBefore(i),t.createPositionAfter(i));const o=a.root.document?r.version:null;c=new Na(a,e,s,n,o)}t.batch.addOperation(c),o.applyOperation(c)}}function Wa(t,e,n,i,o){const r=t.model,s=r.document,a=new La(e,n,i,r.markers,o,s.version);t.batch.addOperation(a),r.applyOperation(a)}function Ya(t,e,n,i){let o;if(t.root.document){const n=i.document,r=new ks(n.graveyard,[0]);o=new Ra(t,e,r,n.version)}else o=new Oa(t,e);n.addOperation(o),i.applyOperation(o)}function Ga(t,e){return t===e||t instanceof Fa&&e instanceof Fa}class $a{constructor(t){this._markerCollection=t,this._changesInElement=new Map,this._elementSnapshots=new Map,this._changedMarkers=new Map,this._changeCount=0,this._cachedChanges=null,this._cachedChangesWithGraveyard=null}get isEmpty(){return 0==this._changesInElement.size&&0==this._changedMarkers.size}refreshItem(t){if(this._isInInsertedElement(t.parent))return;this._markRemove(t.parent,t.startOffset,t.offsetSize),this._markInsert(t.parent,t.startOffset,t.offsetSize);const e=xs._createOn(t);for(const t of this._markerCollection.getMarkersIntersectingRange(e)){const e=t.getRange();this.bufferMarkerChange(t.name,e,e,t.affectsData)}this._cachedChanges=null}bufferOperation(t){switch(t.type){case"insert":if(this._isInInsertedElement(t.position.parent))return;this._markInsert(t.position.parent,t.position.offset,t.nodes.maxOffset);break;case"addAttribute":case"removeAttribute":case"changeAttribute":for(const e of t.range.getItems({shallow:!0}))this._isInInsertedElement(e.parent)||this._markAttribute(e);break;case"remove":case"move":case"reinsert":{if(t.sourcePosition.isEqual(t.targetPosition)||t.sourcePosition.getShiftedBy(t.howMany).isEqual(t.targetPosition))return;const e=this._isInInsertedElement(t.sourcePosition.parent),n=this._isInInsertedElement(t.targetPosition.parent);e||this._markRemove(t.sourcePosition.parent,t.sourcePosition.offset,t.howMany),n||this._markInsert(t.targetPosition.parent,t.getMovedRangeStart().offset,t.howMany);break}case"rename":{if(this._isInInsertedElement(t.position.parent))return;this._markRemove(t.position.parent,t.position.offset,1),this._markInsert(t.position.parent,t.position.offset,1);const e=xs._createFromPositionAndShift(t.position,1);for(const t of this._markerCollection.getMarkersIntersectingRange(e)){const e=t.getRange();this.bufferMarkerChange(t.name,e,e,t.affectsData)}break}case"split":{const e=t.splitPosition.parent;this._isInInsertedElement(e)||this._markRemove(e,t.splitPosition.offset,t.howMany),this._isInInsertedElement(t.insertionPosition.parent)||this._markInsert(t.insertionPosition.parent,t.insertionPosition.offset,1),t.graveyardPosition&&this._markRemove(t.graveyardPosition.parent,t.graveyardPosition.offset,1);break}case"merge":{const e=t.sourcePosition.parent;this._isInInsertedElement(e.parent)||this._markRemove(e.parent,e.startOffset,1);const n=t.graveyardPosition.parent;this._markInsert(n,t.graveyardPosition.offset,1);const i=t.targetPosition.parent;this._isInInsertedElement(i)||this._markInsert(i,t.targetPosition.offset,e.maxOffset);break}}this._cachedChanges=null}bufferMarkerChange(t,e,n,i){const o=this._changedMarkers.get(t);o?(o.newRange=n,o.affectsData=i,null==o.oldRange&&null==o.newRange&&this._changedMarkers.delete(t)):this._changedMarkers.set(t,{oldRange:e,newRange:n,affectsData:i})}getMarkersToRemove(){const t=[];for(const[e,n]of this._changedMarkers)null!=n.oldRange&&t.push({name:e,range:n.oldRange});return t}getMarkersToAdd(){const t=[];for(const[e,n]of this._changedMarkers)null!=n.newRange&&t.push({name:e,range:n.newRange});return t}getChangedMarkers(){return Array.from(this._changedMarkers).map(t=>({name:t[0],data:{oldRange:t[1].oldRange,newRange:t[1].newRange}}))}hasDataChanges(){for(const[,t]of this._changedMarkers)if(t.affectsData)return!0;return this._changesInElement.size>0}getChanges(t={includeChangesInGraveyard:!1}){if(this._cachedChanges)return t.includeChangesInGraveyard?this._cachedChangesWithGraveyard.slice():this._cachedChanges.slice();const e=[];for(const t of this._changesInElement.keys()){const n=this._changesInElement.get(t).sort((t,e)=>t.offset===e.offset?t.type!=e.type?"remove"==t.type?-1:1:0:t.offset<e.offset?-1:1),i=this._elementSnapshots.get(t),o=Qa(t.getChildren()),r=Ka(i.length,n);let s=0,a=0;for(const n of r)if("i"===n)e.push(this._getInsertDiff(t,s,o[s].name)),s++;else if("r"===n)e.push(this._getRemoveDiff(t,s,i[a].name)),a++;else if("a"===n){const n=o[s].attributes,r=i[a].attributes;let c;if("$text"==o[s].name)c=new xs(ks._createAt(t,s),ks._createAt(t,s+1));else{const e=t.offsetToIndex(s);c=new xs(ks._createAt(t,s),ks._createAt(t.getChild(e),0))}e.push(...this._getAttributesDiff(c,r,n)),s++,a++}else s++,a++}e.sort((t,e)=>t.position.root!=e.position.root?t.position.root.rootName<e.position.root.rootName?-1:1:t.position.isEqual(e.position)?t.changeCount-e.changeCount:t.position.isBefore(e.position)?-1:1);for(let t=1;t<e.length;t++){const n=e[t-1],i=e[t],o="remove"==n.type&&"remove"==i.type&&"$text"==n.name&&"$text"==i.name&&n.position.isEqual(i.position),r="insert"==n.type&&"insert"==i.type&&"$text"==n.name&&"$text"==i.name&&n.position.parent==i.position.parent&&n.position.offset+n.length==i.position.offset,s="attribute"==n.type&&"attribute"==i.type&&n.position.parent==i.position.parent&&n.range.isFlat&&i.range.isFlat&&n.position.offset+n.length==i.position.offset&&n.attributeKey==i.attributeKey&&n.attributeOldValue==i.attributeOldValue&&n.attributeNewValue==i.attributeNewValue;(o||r||s)&&(e[t-1].length++,s&&(e[t-1].range.end=e[t-1].range.end.getShiftedBy(1)),e.splice(t,1),t--)}for(const t of e)delete t.changeCount,"attribute"==t.type&&(delete t.position,delete t.length);return this._changeCount=0,this._cachedChangesWithGraveyard=e.slice(),this._cachedChanges=e.slice().filter(Ja),t.includeChangesInGraveyard?this._cachedChangesWithGraveyard:this._cachedChanges}reset(){this._changesInElement.clear(),this._elementSnapshots.clear(),this._changedMarkers.clear(),this._cachedChanges=null}_markInsert(t,e,n){const i={type:"insert",offset:e,howMany:n,count:this._changeCount++};this._markChange(t,i)}_markRemove(t,e,n){const i={type:"remove",offset:e,howMany:n,count:this._changeCount++};this._markChange(t,i),this._removeAllNestedChanges(t,e,n)}_markAttribute(t){const e={type:"attribute",offset:t.startOffset,howMany:t.offsetSize,count:this._changeCount++};this._markChange(t.parent,e)}_markChange(t,e){this._makeSnapshot(t);const n=this._getChangesForElement(t);this._handleChange(e,n),n.push(e);for(let t=0;t<n.length;t++)n[t].howMany<1&&(n.splice(t,1),t--)}_getChangesForElement(t){let e;return this._changesInElement.has(t)?e=this._changesInElement.get(t):(e=[],this._changesInElement.set(t,e)),e}_makeSnapshot(t){this._elementSnapshots.has(t)||this._elementSnapshots.set(t,Qa(t.getChildren()))}_handleChange(t,e){t.nodesToHandle=t.howMany;for(const n of e){const i=t.offset+t.howMany,o=n.offset+n.howMany;if("insert"==t.type&&("insert"==n.type&&(t.offset<=n.offset?n.offset+=t.howMany:t.offset<o&&(n.howMany+=t.nodesToHandle,t.nodesToHandle=0)),"remove"==n.type&&t.offset<n.offset&&(n.offset+=t.howMany),"attribute"==n.type))if(t.offset<=n.offset)n.offset+=t.howMany;else if(t.offset<o){const o=n.howMany;n.howMany=t.offset-n.offset,e.unshift({type:"attribute",offset:i,howMany:o-n.howMany,count:this._changeCount++})}if("remove"==t.type){if("insert"==n.type)if(i<=n.offset)n.offset-=t.howMany;else if(i<=o)if(t.offset<n.offset){const e=i-n.offset;n.offset=t.offset,n.howMany-=e,t.nodesToHandle-=e}else n.howMany-=t.nodesToHandle,t.nodesToHandle=0;else if(t.offset<=n.offset)t.nodesToHandle-=n.howMany,n.howMany=0;else if(t.offset<o){const e=o-t.offset;n.howMany-=e,t.nodesToHandle-=e}if("remove"==n.type&&(i<=n.offset?n.offset-=t.howMany:t.offset<n.offset&&(t.nodesToHandle+=n.howMany,n.howMany=0)),"attribute"==n.type)if(i<=n.offset)n.offset-=t.howMany;else if(t.offset<n.offset){const e=i-n.offset;n.offset=t.offset,n.howMany-=e}else if(t.offset<o)if(i<=o){const i=n.howMany;n.howMany=t.offset-n.offset;const o=i-n.howMany-t.nodesToHandle;e.unshift({type:"attribute",offset:t.offset,howMany:o,count:this._changeCount++})}else n.howMany-=o-t.offset}if("attribute"==t.type){if("insert"==n.type)if(t.offset<n.offset&&i>n.offset){if(i>o){const t={type:"attribute",offset:o,howMany:i-o,count:this._changeCount++};this._handleChange(t,e),e.push(t)}t.nodesToHandle=n.offset-t.offset,t.howMany=t.nodesToHandle}else t.offset>=n.offset&&t.offset<o&&(i>o?(t.nodesToHandle=i-o,t.offset=o):t.nodesToHandle=0);if("remove"==n.type&&t.offset<n.offset&&i>n.offset){const o={type:"attribute",offset:n.offset,howMany:i-n.offset,count:this._changeCount++};this._handleChange(o,e),e.push(o),t.nodesToHandle=n.offset-t.offset,t.howMany=t.nodesToHandle}"attribute"==n.type&&(t.offset>=n.offset&&i<=o?(t.nodesToHandle=0,t.howMany=0,t.offset=0):t.offset<=n.offset&&i>=o&&(n.howMany=0))}}t.howMany=t.nodesToHandle,delete t.nodesToHandle}_getInsertDiff(t,e,n){return{type:"insert",position:ks._createAt(t,e),name:n,length:1,changeCount:this._changeCount++}}_getRemoveDiff(t,e,n){return{type:"remove",position:ks._createAt(t,e),name:n,length:1,changeCount:this._changeCount++}}_getAttributesDiff(t,e,n){const i=[];n=new Map(n);for(const[o,r]of e){const e=n.has(o)?n.get(o):null;e!==r&&i.push({type:"attribute",position:t.start,range:t.clone(),length:1,attributeKey:o,attributeOldValue:r,attributeNewValue:e,changeCount:this._changeCount++}),n.delete(o)}for(const[e,o]of n)i.push({type:"attribute",position:t.start,range:t.clone(),length:1,attributeKey:e,attributeOldValue:null,attributeNewValue:o,changeCount:this._changeCount++});return i}_isInInsertedElement(t){const e=t.parent;if(!e)return!1;const n=this._changesInElement.get(e),i=t.startOffset;if(n)for(const t of n)if("insert"==t.type&&i>=t.offset&&i<t.offset+t.howMany)return!0;return this._isInInsertedElement(e)}_removeAllNestedChanges(t,e,n){const i=new xs(ks._createAt(t,e),ks._createAt(t,e+n));for(const t of i.getItems({shallow:!0}))t.is("element")&&(this._elementSnapshots.delete(t),this._changesInElement.delete(t),this._removeAllNestedChanges(t,0,t.maxOffset))}}function Qa(t){const e=[];for(const n of t)if(n.is("text"))for(let t=0;t<n.data.length;t++)e.push({name:"$text",attributes:new Map(n.getAttributes())});else e.push({name:n.name,attributes:new Map(n.getAttributes())});return e}function Ka(t,e){const n=[];let i=0,o=0;for(const t of e){if(t.offset>i){for(let e=0;e<t.offset-i;e++)n.push("e");o+=t.offset-i}if("insert"==t.type){for(let e=0;e<t.howMany;e++)n.push("i");i=t.offset+t.howMany}else if("remove"==t.type){for(let e=0;e<t.howMany;e++)n.push("r");i=t.offset,o+=t.howMany}else n.push(..."a".repeat(t.howMany).split("")),i=t.offset+t.howMany,o+=t.howMany}if(o<t)for(let e=0;e<t-o-i;e++)n.push("e");return n}function Ja(t){const e=t.position&&"$graveyard"==t.position.root.rootName,n=t.range&&"$graveyard"==t.range.root.rootName;return!e&&!n}class Za{constructor(){this._operations=[],this._undoPairs=new Map,this._undoneOperations=new Set}addOperation(t){this._operations.includes(t)||this._operations.push(t)}getOperations(t=0,e=Number.POSITIVE_INFINITY){return t<0?[]:this._operations.slice(t,e)}getOperation(t){return this._operations[t]}setOperationAsUndone(t,e){this._undoPairs.set(e,t),this._undoneOperations.add(t)}isUndoingOperation(t){return this._undoPairs.has(t)}isUndoneOperation(t){return this._undoneOperations.has(t)}getUndoneOperation(t){return this._undoPairs.get(t)}}function Xa(t,e){return!!(n=t.charAt(e-1))&&1==n.length&&/[\ud800-\udbff]/.test(n)&&function(t){return!!t&&1==t.length&&/[\udc00-\udfff]/.test(t)}(t.charAt(e));var n}function tc(t,e){return!!(n=t.charAt(e))&&1==n.length&&/[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/.test(n);var n}class ec{constructor(t){this.model=t,this.version=0,this.history=new Za(this),this.selection=new js(this),this.roots=new An({idProperty:"rootName"}),this.differ=new $a(t.markers),this._postFixers=new Set,this._hasSelectionChangedFromTheLastChangeBlock=!1,this.createRoot("$root","$graveyard"),this.listenTo(t,"applyOperation",(t,e)=>{const n=e[0];if(n.isDocumentOperation&&n.baseVersion!==this.version)throw new hn.b("model-document-applyOperation-wrong-version: Only operations with matching versions can be applied.",this,{operation:n})},{priority:"highest"}),this.listenTo(t,"applyOperation",(t,e)=>{const n=e[0];n.isDocumentOperation&&this.differ.bufferOperation(n)},{priority:"high"}),this.listenTo(t,"applyOperation",(t,e)=>{const n=e[0];n.isDocumentOperation&&(this.version++,this.history.addOperation(n))},{priority:"low"}),this.listenTo(this.selection,"change",()=>{this._hasSelectionChangedFromTheLastChangeBlock=!0}),this.listenTo(t.markers,"update",(t,e,n,i)=>{this.differ.bufferMarkerChange(e.name,n,i,e.affectsData),null===n&&e.on("change",(t,n)=>{this.differ.bufferMarkerChange(e.name,n,e.getRange(),e.affectsData)})})}get graveyard(){return this.getRoot("$graveyard")}createRoot(t="$root",e="main"){if(this.roots.get(e))throw new hn.b("model-document-createRoot-name-exists: Root with specified name already exists.",this,{name:e});const n=new Fa(this,t,e);return this.roots.add(n),n}destroy(){this.selection.destroy(),this.stopListening()}getRoot(t="main"){return this.roots.get(t)}getRootNames(){return Array.from(this.roots,t=>t.rootName).filter(t=>"$graveyard"!=t)}registerPostFixer(t){this._postFixers.add(t)}toJSON(){const t=Nn(this);return t.selection="[engine.model.DocumentSelection]",t.model="[engine.model.Model]",t}_handleChangeBlock(t){this._hasDocumentChangedFromTheLastChangeBlock()&&(this._callPostFixers(t),this.selection.refresh(),this.differ.hasDataChanges()?this.fire("change:data",t.batch):this.fire("change",t.batch),this.selection.refresh(),this.differ.reset()),this._hasSelectionChangedFromTheLastChangeBlock=!1}_hasDocumentChangedFromTheLastChangeBlock(){return!this.differ.isEmpty||this._hasSelectionChangedFromTheLastChangeBlock}_getDefaultRoot(){for(const t of this.roots)if(t!==this.graveyard)return t;return this.graveyard}_getDefaultRange(){const t=this._getDefaultRoot(),e=this.model,n=e.schema,i=e.createPositionFromPath(t,[0]);return n.getNearestSelectionRange(i)||e.createRange(i)}_validateSelectionRange(t){return nc(t.start)&&nc(t.end)}_callPostFixers(t){let e=!1;do{for(const n of this._postFixers)if(this.selection.refresh(),e=n(t),e)break}while(e)}}function nc(t){const e=t.textNode;if(e){const n=e.data,i=t.offset-e.startOffset;return!Xa(n,i)&&!tc(n,i)}return!0}xn(ec,gn);class ic{constructor(){this._markers=new Map}[Symbol.iterator](){return this._markers.values()}has(t){return this._markers.has(t)}get(t){return this._markers.get(t)||null}_set(t,e,n=!1,i=!1){const o=t instanceof oc?t.name:t,r=this._markers.get(o);if(r){const t=r.getRange();let s=!1;return t.isEqual(e)||(r._attachLiveRange(Rs.fromRange(e)),s=!0),n!=r.managedUsingOperations&&(r._managedUsingOperations=n,s=!0),"boolean"==typeof i&&i!=r.affectsData&&(r._affectsData=i,s=!0),s&&this.fire("update:"+o,r,t,e),r}const s=Rs.fromRange(e),a=new oc(o,s,n,i);return this._markers.set(o,a),this.fire("update:"+o,a,null,e),a}_remove(t){const e=t instanceof oc?t.name:t,n=this._markers.get(e);return!!n&&(this._markers.delete(e),this.fire("update:"+e,n,n.getRange(),null),this._destroyMarker(n),!0)}_refresh(t){const e=t instanceof oc?t.name:t,n=this._markers.get(e);if(!n)throw new hn.b("markercollection-refresh-marker-not-exists: Marker with provided name does not exists.",this);const i=n.getRange();this.fire("update:"+e,n,i,i,n.managedUsingOperations,n.affectsData)}*getMarkersAtPosition(t){for(const e of this)e.getRange().containsPosition(t)&&(yield e)}*getMarkersIntersectingRange(t){for(const e of this)null!==e.getRange().getIntersection(t)&&(yield e)}destroy(){for(const t of this._markers.values())this._destroyMarker(t);this._markers=null,this.stopListening()}*getMarkersGroup(t){for(const e of this._markers.values())e.name.startsWith(t+":")&&(yield e)}_destroyMarker(t){t.stopListening(),t._detachLiveRange()}}xn(ic,gn);class oc{constructor(t,e,n,i){this.name=t,this._liveRange=this._attachLiveRange(e),this._managedUsingOperations=n,this._affectsData=i}get managedUsingOperations(){if(!this._liveRange)throw new hn.b("marker-destroyed: Cannot use a destroyed marker instance.",this);return this._managedUsingOperations}get affectsData(){if(!this._liveRange)throw new hn.b("marker-destroyed: Cannot use a destroyed marker instance.",this);return this._affectsData}getStart(){if(!this._liveRange)throw new hn.b("marker-destroyed: Cannot use a destroyed marker instance.",this);return this._liveRange.start.clone()}getEnd(){if(!this._liveRange)throw new hn.b("marker-destroyed: Cannot use a destroyed marker instance.",this);return this._liveRange.end.clone()}getRange(){if(!this._liveRange)throw new hn.b("marker-destroyed: Cannot use a destroyed marker instance.",this);return this._liveRange.toRange()}is(t){return"marker"===t||"model:marker"===t}_attachLiveRange(t){return this._liveRange&&this._detachLiveRange(),t.delegate("change:range").to(this),t.delegate("change:content").to(this),this._liveRange=t,t}_detachLiveRange(){this._liveRange.stopDelegating("change:range",this),this._liveRange.stopDelegating("change:content",this),this._liveRange.detach(),this._liveRange=null}}xn(oc,gn);class rc extends ya{get type(){return"noop"}clone(){return new rc(this.baseVersion)}getReversed(){return new rc(this.baseVersion+1)}_execute(){}static get className(){return"NoOperation"}}const sc={};sc[Na.className]=Na,sc[Da.className]=Da,sc[La.className]=La,sc[Ra.className]=Ra,sc[rc.className]=rc,sc[ya.className]=ya,sc[ja.className]=ja,sc[Va.className]=Va,sc[Ba.className]=Ba,sc[za.className]=za;class ac extends ks{constructor(t,e,n="toNone"){if(super(t,e,n),!this.root.is("rootElement"))throw new hn.b("model-liveposition-root-not-rootelement: LivePosition's root has to be an instance of RootElement.",t);cc.call(this)}detach(){this.stopListening()}is(t){return"livePosition"===t||"model:livePosition"===t||"position"==t||"model:position"===t}toPosition(){return new ks(this.root,this.path.slice(),this.stickiness)}static fromPosition(t,e){return new this(t.root,t.path.slice(),e||t.stickiness)}}function cc(){this.listenTo(this.root.document.model,"applyOperation",(t,e)=>{const n=e[0];n.isDocumentOperation&&lc.call(this,n)},{priority:"low"})}function lc(t){const e=this.getTransformedByOperation(t);if(!this.isEqual(e)){const t=this.toPosition();this.path=e.path,this.root=e.root,this.fire("change",t)}}xn(ac,gn);class dc{constructor(t,e,n){this.model=t,this.writer=e,this.position=n,this.canMergeWith=new Set([this.position.parent]),this.schema=t.schema,this._filterAttributesOf=[],this._affectedStart=null,this._affectedEnd=null}handleNodes(t,e){t=Array.from(t);for(let n=0;n<t.length;n++){const i=t[n];this._handleNode(i,{isFirst:0===n&&e.isFirst,isLast:n===t.length-1&&e.isLast})}this.schema.removeDisallowedAttributes(this._filterAttributesOf,this.writer),this._filterAttributesOf=[]}getSelectionRange(){return this.nodeToSelect?xs._createOn(this.nodeToSelect):this.model.schema.getNearestSelectionRange(this.position)}getAffectedRange(){return this._affectedStart?new xs(this._affectedStart,this._affectedEnd):null}destroy(){this._affectedStart&&this._affectedStart.detach(),this._affectedEnd&&this._affectedEnd.detach()}_handleNode(t,e){if(this.schema.isObject(t))return void this._handleObject(t,e);this._checkAndSplitToAllowedPosition(t,e)?(this._insert(t),this._mergeSiblingsOf(t,e)):this._handleDisallowedNode(t,e)}_handleObject(t,e){this._checkAndSplitToAllowedPosition(t)?this._insert(t):this._tryAutoparagraphing(t,e)}_handleDisallowedNode(t,e){t.is("element")?this.handleNodes(t.getChildren(),e):this._tryAutoparagraphing(t,e)}_insert(t){if(!this.schema.checkChild(this.position,t))throw new hn.b("insertcontent-wrong-position: Given node cannot be inserted on the given position.",this,{node:t,position:this.position});const e=ac.fromPosition(this.position,"toNext");this._setAffectedBoundaries(this.position),this.writer.insert(t,this.position),this.position=e.toPosition(),e.detach(),this.schema.isObject(t)&&!this.schema.checkChild(this.position,"$text")?this.nodeToSelect=t:this.nodeToSelect=null,this._filterAttributesOf.push(t)}_setAffectedBoundaries(t){this._affectedStart||(this._affectedStart=ac.fromPosition(t,"toPrevious")),this._affectedEnd&&!this._affectedEnd.isBefore(t)||(this._affectedEnd&&this._affectedEnd.detach(),this._affectedEnd=ac.fromPosition(t,"toNext"))}_mergeSiblingsOf(t,e){if(!(t instanceof ps))return;const n=this._canMergeLeft(t,e),i=this._canMergeRight(t,e),o=ac._createBefore(t);o.stickiness="toNext";const r=ac._createAfter(t);if(r.stickiness="toNext",n){const t=ac.fromPosition(this.position);t.stickiness="toNext",this._affectedStart.isEqual(o)&&(this._affectedStart.detach(),this._affectedStart=ac._createAt(o.nodeBefore,"end","toPrevious")),this.writer.merge(o),o.isEqual(this._affectedEnd)&&e.isLast&&(this._affectedEnd.detach(),this._affectedEnd=ac._createAt(o.nodeBefore,"end","toNext")),this.position=t.toPosition(),t.detach()}if(i){if(!this.position.isEqual(r))throw new hn.b("insertcontent-invalid-insertion-position",this);this.position=ks._createAt(r.nodeBefore,"end");const t=ac.fromPosition(this.position,"toPrevious");this._affectedEnd.isEqual(r)&&(this._affectedEnd.detach(),this._affectedEnd=ac._createAt(r.nodeBefore,"end","toNext")),this.writer.merge(r),r.getShiftedBy(-1).isEqual(this._affectedStart)&&e.isFirst&&(this._affectedStart.detach(),this._affectedStart=ac._createAt(r.nodeBefore,0,"toPrevious")),this.position=t.toPosition(),t.detach()}(n||i)&&this._filterAttributesOf.push(this.position.parent),o.detach(),r.detach()}_canMergeLeft(t,e){const n=t.previousSibling;return e.isFirst&&n instanceof ps&&this.canMergeWith.has(n)&&this.model.schema.checkMerge(n,t)}_canMergeRight(t,e){const n=t.nextSibling;return e.isLast&&n instanceof ps&&this.canMergeWith.has(n)&&this.model.schema.checkMerge(t,n)}_tryAutoparagraphing(t,e){const n=this.writer.createElement("paragraph");this._getAllowedIn(n,this.position.parent)&&this.schema.checkChild(n,t)&&(n._appendChild(t),this._handleNode(n,e))}_checkAndSplitToAllowedPosition(t){const e=this._getAllowedIn(t,this.position.parent);if(!e)return!1;for(;e!=this.position.parent;){if(this.schema.isLimit(this.position.parent))return!1;if(this.position.isAtStart){const t=this.position.parent;this.position=this.writer.createPositionBefore(t),t.isEmpty&&t.parent===e&&this.writer.remove(t)}else if(this.position.isAtEnd)this.position=this.writer.createPositionAfter(this.position.parent);else{const t=this.writer.createPositionAfter(this.position.parent);this._setAffectedBoundaries(this.position),this.writer.split(this.position),this.position=t,this.canMergeWith.add(this.position.nodeAfter)}}return!0}_getAllowedIn(t,e){return this.schema.checkChild(e,t)?e:e.parent?this._getAllowedIn(t,e.parent):null}}function uc(t,e,n={}){if(e.isCollapsed)return;const i=e.getFirstRange();if("$graveyard"==i.root.rootName)return;const o=t.schema;t.change(t=>{if(!n.doNotResetEntireContent&&function(t,e){const n=t.getLimitElement(e);if(!e.containsEntireContent(n))return!1;const i=e.getFirstRange();if(i.start.parent==i.end.parent)return!1;return t.checkChild(n,"paragraph")}(o,e))return void function(t,e){const n=t.model.schema.getLimitElement(e);t.remove(t.createRangeIn(n)),hc(t,t.createPositionAt(n,0),e)}(t,e);const r=i.start,s=ac.fromPosition(i.end,"toNext");i.start.isTouching(i.end)||t.remove(i),n.leaveUnmerged||(!function t(e,n,i){const o=n.parent,r=i.parent;if(o==r)return;if(e.model.schema.isLimit(o)||e.model.schema.isLimit(r))return;if(!function(t,e,n){const i=new xs(t,e);for(const t of i.getWalker())if(n.isLimit(t.item))return!1;return!0}(n,i,e.model.schema))return;n=e.createPositionAfter(o),(i=e.createPositionBefore(r)).isEqual(n)||e.insert(r,n);e.merge(n);for(;i.parent.isEmpty;){const t=i.parent;i=e.createPositionBefore(t),e.remove(t)}t(e,n,i)}(t,r,s),o.removeDisallowedAttributes(r.parent.getChildren(),t)),fc(t,e,r),!n.doNotAutoparagraph&&function(t,e){const n=t.checkChild(e,"$text"),i=t.checkChild(e,"paragraph");return!n&&i}(o,r)&&hc(t,r,e),s.detach()})}function hc(t,e,n){const i=t.createElement("paragraph");t.insert(i,e),fc(t,n,t.createPositionAt(i,0))}function fc(t,e,n){e instanceof js?t.setSelection(n):e.setTo(n)}function mc(t,e){if("text"==e.type)return"word"===t.unit?function(t,e){let n=t.position.textNode;if(n){let i=t.position.offset-n.startOffset;for(;!pc(n.data,i,e)&&!bc(n,i,e);){t.next();const o=e?t.position.nodeAfter:t.position.nodeBefore;if(o&&o.is("text")){const i=o.data.charAt(e?0:o.data.length-1);' ,.?!:;"-()'.includes(i)||(t.next(),n=t.position.textNode)}i=t.position.offset-n.startOffset}}return t.position}(t.walker,t.isForward):function(t,e){const n=t.position.textNode;if(n){const i=n.data;let o=t.position.offset-n.startOffset;for(;Xa(i,o)||"character"==e&&tc(i,o);)t.next(),o=t.position.offset-n.startOffset}return t.position}(t.walker,t.unit,t.isForward);if(e.type==(t.isForward?"elementStart":"elementEnd")){if(t.schema.isObject(e.item))return ks._createAt(e.item,t.isForward?"after":"before");if(t.schema.checkChild(e.nextPosition,"$text"))return e.nextPosition}else{if(t.schema.isLimit(e.item))return void t.walker.skip(()=>!0);if(t.schema.checkChild(e.nextPosition,"$text"))return e.nextPosition}}function gc(t,e){const n=t.root,i=ks._createAt(n,e?"end":0);return e?new xs(t,i):new xs(i,t)}function pc(t,e,n){const i=e+(n?0:-1);return' ,.?!:;"-()'.includes(t.charAt(i))}function bc(t,e,n){return e===(n?t.endOffset:0)}function wc(t,e){const n=[];Array.from(t.getItems({direction:"backward"})).map(t=>e.createRangeOn(t)).filter(e=>(e.start.isAfter(t.start)||e.start.isEqual(t.start))&&(e.end.isBefore(t.end)||e.end.isEqual(t.end))).forEach(t=>{n.push(t.start.parent),e.remove(t)}),n.forEach(t=>{let n=t;for(;n.parent&&n.isEmpty;){const t=e.createRangeOn(n);n=n.parent,e.remove(t)}})}function kc(t){t.document.registerPostFixer(e=>function(t,e){const n=e.document.selection,i=e.schema,o=[];let r=!1;for(const t of n.getRanges()){const e=_c(t,i);e?(o.push(e),r=!0):o.push(t)}r&&t.setSelection(function(t){const e=[];e.push(t.shift());for(const n of t){const t=e.pop();if(n.isIntersecting(t)){const i=t.start.isAfter(n.start)?n.start:t.start,o=t.end.isAfter(n.end)?t.end:n.end,r=new xs(i,o);e.push(r)}else e.push(t),e.push(n)}return e}(o),{backward:n.isBackward})}(e,t))}function _c(t,e){return t.isCollapsed?function(t,e){const n=t.start,i=e.getNearestSelectionRange(n);if(!i)return null;if(!i.isCollapsed)return i;const o=i.start;if(n.isEqual(o))return null;return new xs(o)}(t,e):function(t,e){const n=t.start,i=t.end,o=e.checkChild(n,"$text"),r=e.checkChild(i,"$text"),s=e.getLimitElement(n),a=e.getLimitElement(i);if(s===a){if(o&&r)return null;if(function(t,e,n){const i=t.nodeAfter&&!n.isLimit(t.nodeAfter)||n.checkChild(t,"$text"),o=e.nodeBefore&&!n.isLimit(e.nodeBefore)||n.checkChild(e,"$text");return i||o}(n,i,e)){const t=n.nodeAfter&&e.isObject(n.nodeAfter)?null:e.getNearestSelectionRange(n,"forward"),o=i.nodeBefore&&e.isObject(i.nodeBefore)?null:e.getNearestSelectionRange(i,"backward"),r=t?t.start:n,s=o?o.start:i;return new xs(r,s)}}const c=s&&!s.is("rootElement"),l=a&&!a.is("rootElement");if(c||l){const t=n.nodeAfter&&i.nodeBefore&&n.nodeAfter.parent===i.nodeBefore.parent,o=c&&(!t||!yc(n.nodeAfter,e)),r=l&&(!t||!yc(i.nodeBefore,e));let d=n,u=i;return o&&(d=ks._createBefore(vc(s,e))),r&&(u=ks._createAfter(vc(a,e))),new xs(d,u)}return null}(t,e)}function vc(t,e){let n=t,i=n;for(;e.isLimit(i)&&i.parent;)n=i,i=i.parent;return n}function yc(t,e){return t&&e.isObject(t)}class xc{constructor(){this.markers=new ic,this.document=new ec(this),this.schema=new ia,this._pendingChanges=[],this._currentWriter=null,["insertContent","deleteContent","modifySelection","getSelectedContent","applyOperation"].forEach(t=>this.decorate(t)),this.on("applyOperation",(t,e)=>{e[0]._validate()},{priority:"highest"}),this.schema.register("$root",{isLimit:!0}),this.schema.register("$block",{allowIn:"$root",isBlock:!0}),this.schema.register("$text",{allowIn:"$block",isInline:!0}),this.schema.register("$clipboardHolder",{allowContentOf:"$root",isLimit:!0}),this.schema.extend("$text",{allowIn:"$clipboardHolder"}),this.schema.register("$marker"),this.schema.addChildCheck((t,e)=>{if("$marker"===e.name)return!0}),kc(this)}change(t){try{return 0===this._pendingChanges.length?(this._pendingChanges.push({batch:new va,callback:t}),this._runPendingChanges()[0]):t(this._currentWriter)}catch(t){hn.b.rethrowUnexpectedError(t,this)}}enqueueChange(t,e){try{"string"==typeof t?t=new va(t):"function"==typeof t&&(e=t,t=new va),this._pendingChanges.push({batch:t,callback:e}),1==this._pendingChanges.length&&this._runPendingChanges()}catch(t){hn.b.rethrowUnexpectedError(t,this)}}applyOperation(t){t._execute()}insertContent(t,e,n){return function(t,e,n,i){return t.change(o=>{let r;r=n?n instanceof Ms||n instanceof js?n:o.createSelection(n,i):t.document.selection,r.isCollapsed||t.deleteContent(r,{doNotAutoparagraph:!0});const s=new dc(t,o,r.anchor);let a;a=e.is("documentFragment")?e.getChildren():[e],s.handleNodes(a,{isFirst:!0,isLast:!0});const c=s.getSelectionRange();c&&(r instanceof js?o.setSelection(c):r.setTo(c));const l=s.getAffectedRange()||t.createRange(r.anchor);return s.destroy(),l})}(this,t,e,n)}deleteContent(t,e){uc(this,t,e)}modifySelection(t,e){!function(t,e,n={}){const i=t.schema,o="backward"!=n.direction,r=n.unit?n.unit:"character",s=e.focus,a=new bs({boundaries:gc(s,o),singleCharacters:!0,direction:o?"forward":"backward"}),c={walker:a,schema:i,isForward:o,unit:r};let l;for(;l=a.next();){if(l.done)return;const n=mc(c,l.value);if(n)return void(e instanceof js?t.change(t=>{t.setSelectionFocus(n)}):e.setFocus(n))}}(this,t,e)}getSelectedContent(t){return function(t,e){return t.change(t=>{const n=t.createDocumentFragment(),i=e.getFirstRange();if(!i||i.isCollapsed)return n;const o=i.start.root,r=i.start.getCommonPath(i.end),s=o.getNodeByPath(r);let a;a=i.start.parent==i.end.parent?i:t.createRange(t.createPositionAt(s,i.start.path[r.length]),t.createPositionAt(s,i.end.path[r.length]+1));const c=a.end.offset-a.start.offset;for(const e of a.getItems({shallow:!0}))e.is("textProxy")?t.appendText(e.data,e.getAttributes(),n):t.append(e._clone(!0),n);if(a!=i){const e=i._getTransformedByMove(a.start,t.createPositionAt(n,0),c)[0],o=t.createRange(t.createPositionAt(n,0),e.start);wc(t.createRange(e.end,t.createPositionAt(n,"end")),t),wc(o,t)}return n})}(this,t)}hasContent(t,e){const n=t instanceof ps?xs._createIn(t):t;if(n.isCollapsed)return!1;for(const t of this.markers.getMarkersIntersectingRange(n))if(t.affectsData)return!0;const{ignoreWhitespaces:i=!1}=e||{};for(const t of n.getItems())if(t.is("textProxy")){if(!i)return!0;if(-1!==t.data.search(/\S/))return!0}else if(this.schema.isObject(t))return!0;return!1}createPositionFromPath(t,e,n){return new ks(t,e,n)}createPositionAt(t,e){return ks._createAt(t,e)}createPositionAfter(t){return ks._createAfter(t)}createPositionBefore(t){return ks._createBefore(t)}createRange(t,e){return new xs(t,e)}createRangeIn(t){return xs._createIn(t)}createRangeOn(t){return xs._createOn(t)}createSelection(t,e,n){return new Ms(t,e,n)}createBatch(t){return new va(t)}createOperationFromJSON(t){return class{static fromJSON(t,e){return sc[t.__className].fromJSON(t,e)}}.fromJSON(t,this.document)}destroy(){this.document.destroy(),this.stopListening()}_runPendingChanges(){const t=[];for(this.fire("_beforeChanges");this._pendingChanges.length;){const e=this._pendingChanges[0].batch;this._currentWriter=new Ua(this,e);const n=this._pendingChanges[0].callback(this._currentWriter);t.push(n),this.document._handleChangeBlock(this._currentWriter),this._pendingChanges.shift(),this._currentWriter=null}return this.fire("_afterChanges"),t}}xn(xc,Ui);class Ac{constructor(){this._listener=Object.create(cr)}listenTo(t){this._listener.listenTo(t,"keydown",(t,e)=>{this._listener.fire("_keydown:"+po(e),e)})}set(t,e,n={}){const i=bo(t),o=n.priority;this._listener.listenTo(this._listener,"_keydown:"+i,(t,n)=>{e(n,()=>{n.preventDefault(),n.stopPropagation(),t.stop()}),t.return=!0},{priority:o})}press(t){return!!this._listener.fire("_keydown:"+po(t),t)}destroy(){this._listener.stopListening()}}class Tc extends Ac{constructor(t){super(),this.editor=t}set(t,e,n={}){if("string"==typeof e){const t=e;e=(e,n)=>{this.editor.execute(t),n()}}super.set(t,e,n)}}class Cc{constructor(t={}){this._context=t.context||new En({language:t.language}),this._context._addEditor(this,!t.context);const e=Array.from(this.constructor.builtinPlugins||[]);this.config=new on(t,this.constructor.defaultConfig),this.config.define("plugins",e),this.config.define(this._context._getEditorConfig()),this.plugins=new Tn(this,e,this._context.plugins),this.locale=this._context.locale,this.t=this.locale.t,this.commands=new ta,this.set("state","initializing"),this.once("ready",()=>this.state="ready",{priority:"high"}),this.once("destroy",()=>this.state="destroyed",{priority:"high"}),this.set("isReadOnly",!1),this.model=new xc;const n=new Ei;this.data=new ba(this.model,n),this.editing=new Xs(this.model,n),this.editing.view.document.bind("isReadOnly").to(this),this.conversion=new wa([this.editing.downcastDispatcher,this.data.downcastDispatcher],this.data.upcastDispatcher),this.conversion.addAlias("dataDowncast",this.data.downcastDispatcher),this.conversion.addAlias("editingDowncast",this.editing.downcastDispatcher),this.keystrokes=new Tc(this),this.keystrokes.listenTo(this.editing.view.document)}initPlugins(){const t=this.config,e=t.get("plugins"),n=t.get("removePlugins")||[],i=t.get("extraPlugins")||[];return this.plugins.init(e.concat(i),n)}destroy(){let t=Promise.resolve();return"initializing"==this.state&&(t=new Promise(t=>this.once("ready",t))),t.then(()=>{this.fire("destroy"),this.stopListening(),this.commands.destroy()}).then(()=>this.plugins.destroy()).then(()=>{this.model.destroy(),this.data.destroy(),this.editing.destroy(),this.keystrokes.destroy()}).then(()=>this._context._removeEditor(this))}execute(...t){try{this.commands.execute(...t)}catch(t){hn.b.rethrowUnexpectedError(t,this)}}}xn(Cc,Ui);var Pc={setData(t){this.data.set(t)},getData(t){return this.data.get(t)}};var Sc={updateSourceElement(){if(!this.sourceElement)throw new hn.b("editor-missing-sourceelement: Cannot update the source element of a detached editor.",this);var t,e;t=this.sourceElement,e=this.data.get(),t instanceof HTMLTextAreaElement&&(t.value=e),t.innerHTML=e}};class Mc{getHtml(t){const e=document.implementation.createHTMLDocument("").createElement("div");return e.appendChild(t),e.innerHTML}}class Ec{constructor(t){this._domParser=new DOMParser,this._domConverter=new ir(t,{blockFillerMode:"nbsp"}),this._htmlWriter=new Mc}toData(t){const e=this._domConverter.viewToDom(t,document);return this._htmlWriter.getHtml(e)}toView(t){const e=this._toDom(t);return this._domConverter.domToView(e)}_toDom(t){const e=this._domParser.parseFromString(t,"text/html"),n=e.createDocumentFragment(),i=e.body.childNodes;for(;i.length>0;)n.appendChild(i[0]);return n}}class Ic{constructor(t){this.editor=t,this._components=new Map}*names(){for(const t of this._components.values())yield t.originalName}add(t,e){if(this.has(t))throw new hn.b("componentfactory-item-exists: The item already exists in the component factory.",this,{name:t});this._components.set(Nc(t),{callback:e,originalName:t})}create(t){if(!this.has(t))throw new hn.b("componentfactory-item-missing: The required component is not registered in the factory.",this,{name:t});return this._components.get(Nc(t)).callback(this.editor.locale)}has(t){return this._components.has(Nc(t))}}function Nc(t){return String(t).toLowerCase()}class Oc{constructor(){this.set("isFocused",!1),this.set("focusedElement",null),this._elements=new Set,this._nextEventLoopTimeout=null}add(t){if(this._elements.has(t))throw new hn.b("focusTracker-add-element-already-exist",this);this.listenTo(t,"focus",()=>this._focus(t),{useCapture:!0}),this.listenTo(t,"blur",()=>this._blur(),{useCapture:!0}),this._elements.add(t)}remove(t){t===this.focusedElement&&this._blur(t),this._elements.has(t)&&(this.stopListening(t),this._elements.delete(t))}destroy(){this.stopListening()}_focus(t){clearTimeout(this._nextEventLoopTimeout),this.focusedElement=t,this.isFocused=!0}_blur(){clearTimeout(this._nextEventLoopTimeout),this._nextEventLoopTimeout=setTimeout(()=>{this.focusedElement=null,this.isFocused=!1},0)}}xn(Oc,cr),xn(Oc,Ui);class Rc{constructor(t){this.editor=t,this.componentFactory=new Ic(t),this.focusTracker=new Oc,this._editableElementsMap=new Map,this.listenTo(t.editing.view.document,"layoutChanged",()=>this.update())}get element(){return null}update(){this.fire("update")}destroy(){this.stopListening(),this.focusTracker.destroy();for(const t of this._editableElementsMap.values())t.ckeditorInstance=null;this._editableElementsMap=new Map}setEditableElement(t,e){this._editableElementsMap.set(t,e),e.ckeditorInstance||(e.ckeditorInstance=this.editor)}getEditableElement(t="main"){return this._editableElementsMap.get(t)}getEditableElementsNames(){return this._editableElementsMap.keys()}get _editableElements(){return console.warn("editor-ui-deprecated-editable-elements: The EditorUI#_editableElements property has been deprecated and will be removed in the near future.",{editorUI:this}),this._editableElementsMap}}xn(Rc,gn);n(13);const Dc=new WeakMap;function Lc(t){const{view:e,element:n,text:i,isDirectHost:o=!0}=t,r=e.document;Dc.has(r)||(Dc.set(r,new Map),r.registerPostFixer(t=>Vc(r,t))),Dc.get(r).set(n,{text:i,isDirectHost:o}),e.change(t=>Vc(r,t))}function jc(t,e){return!!e.hasClass("ck-placeholder")&&(t.removeClass("ck-placeholder",e),!0)}function Vc(t,e){const n=Dc.get(t);let i=!1;for(const[t,o]of n)zc(e,t,o)&&(i=!0);return i}function zc(t,e,n){const{text:i,isDirectHost:o}=n,r=o?e:function(t){if(1===t.childCount){const e=t.getChild(0);if(e.is("element")&&!e.is("uiElement"))return e}return null}(e);let s=!1;return!!r&&(n.hostElement=r,r.getAttribute("data-placeholder")!==i&&(t.setAttribute("data-placeholder",i,r),s=!0),!function(t){if(!t.isAttached())return!1;const e=!Array.from(t.getChildren()).some(t=>!t.is("uiElement")),n=t.document;if(!n.isFocused&&e)return!0;const i=n.selection.anchor;return!(!e||!i||i.parent===t)}(r)?jc(t,r)&&(s=!0):function(t,e){return!e.hasClass("ck-placeholder")&&(t.addClass("ck-placeholder",e),!0)}(t,r)&&(s=!0),s)}class Bc{constructor(){this._replacedElements=[]}replace(t,e){this._replacedElements.push({element:t,newElement:e}),t.style.display="none",e&&t.parentNode.insertBefore(e,t.nextSibling)}restore(){this._replacedElements.forEach(({element:t,newElement:e})=>{t.style.display="",e&&e.remove()}),this._replacedElements=[]}}class Fc extends Rc{constructor(t,e){var n;super(t),this.view=e,this._toolbarConfig=(n=t.config.get("toolbar"),Array.isArray(n)?{items:n}:n?Object.assign({items:[]},n):{items:[]}),this._elementReplacer=new Bc}get element(){return this.view.element}init(t){const e=this.editor,n=this.view,i=e.editing.view,o=n.editable,r=i.document.getRoot();o.name=r.rootName,n.render();const s=o.element;this.setEditableElement(o.name,s),this.focusTracker.add(s),n.editable.bind("isFocused").to(this.focusTracker),i.attachDomRoot(s),t&&this._elementReplacer.replace(t,this.element),this._initPlaceholder(),this._initToolbar(),this.fire("ready")}destroy(){const t=this.view,e=this.editor.editing.view;this._elementReplacer.restore(),e.detachDomRoot(t.editable.name),t.destroy(),super.destroy()}_initToolbar(){const t=this.editor,e=this.view,n=t.editing.view;e.stickyPanel.bind("isActive").to(this.focusTracker,"isFocused"),e.stickyPanel.limiterElement=e.element,this._toolbarConfig.viewportTopOffset&&(e.stickyPanel.viewportTopOffset=this._toolbarConfig.viewportTopOffset),e.toolbar.fillFromConfig(this._toolbarConfig.items,this.componentFactory),function({origin:t,originKeystrokeHandler:e,originFocusTracker:n,toolbar:i,beforeFocus:o,afterBlur:r}){n.add(i.element),e.set("Alt+F10",(t,e)=>{n.isFocused&&!i.focusTracker.isFocused&&(o&&o(),i.focus(),e())}),i.keystrokes.set("Esc",(e,n)=>{i.focusTracker.isFocused&&(t.focus(),r&&r(),n())})}({origin:n,originFocusTracker:this.focusTracker,originKeystrokeHandler:t.keystrokes,toolbar:e.toolbar})}_initPlaceholder(){const t=this.editor,e=t.editing.view,n=e.document.getRoot(),i=t.sourceElement,o=t.config.get("placeholder")||i&&"textarea"===i.tagName.toLowerCase()&&i.getAttribute("placeholder");o&&Lc({view:e,element:n,text:o,isDirectHost:!1})}}class Uc extends An{constructor(t=[]){super(t,{idProperty:"viewUid"}),this.on("add",(t,e,n)=>{this._renderViewIntoCollectionParent(e,n)}),this.on("remove",(t,e)=>{e.element&&this._parentElement&&e.element.remove()}),this._parentElement=null}destroy(){this.map(t=>t.destroy())}setParent(t){this._parentElement=t;for(const t of this)this._renderViewIntoCollectionParent(t)}delegate(...t){if(!t.length||!t.every(t=>"string"==typeof t))throw new hn.b("ui-viewcollection-delegate-wrong-events: All event names must be strings.",this);return{to:e=>{for(const n of this)for(const i of t)n.delegate(i).to(e);this.on("add",(n,i)=>{for(const n of t)i.delegate(n).to(e)}),this.on("remove",(n,i)=>{for(const n of t)i.stopDelegating(n,e)})}}}_renderViewIntoCollectionParent(t,e){t.isRendered||t.render(),t.element&&this._parentElement&&this._parentElement.insertBefore(t.element,this._parentElement.children[e])}}class Hc{constructor(t){Object.assign(this,Xc(Zc(t))),this._isRendered=!1,this._revertData=null}render(){const t=this._renderNode({intoFragment:!0});return this._isRendered=!0,t}apply(t){return this._revertData={children:[],bindings:[],attributes:{}},this._renderNode({node:t,isApplying:!0,revertData:this._revertData}),t}revert(t){if(!this._revertData)throw new hn.b("ui-template-revert-not-applied: Attempting to revert a template which has not been applied yet.",[this,t]);this._revertTemplateFromNode(t,this._revertData)}*getViews(){yield*function*t(e){if(e.children)for(const n of e.children)ol(n)?yield n:rl(n)&&(yield*t(n))}(this)}static bind(t,e){return{to:(n,i)=>new Wc({eventNameOrFunction:n,attribute:n,observable:t,emitter:e,callback:i}),if:(n,i,o)=>new Yc({observable:t,emitter:e,attribute:n,valueIfTrue:i,callback:o})}}static extend(t,e){if(t._isRendered)throw new hn.b("template-extend-render: Attempting to extend a template which has already been rendered.",[this,t]);!function t(e,n){n.attributes&&(e.attributes||(e.attributes={}),nl(e.attributes,n.attributes));n.eventListeners&&(e.eventListeners||(e.eventListeners={}),nl(e.eventListeners,n.eventListeners));n.text&&e.text.push(...n.text);if(n.children&&n.children.length){if(e.children.length!=n.children.length)throw new hn.b("ui-template-extend-children-mismatch: The number of children in extended definition does not match.",e);let i=0;for(const o of n.children)t(e.children[i++],o)}}(t,Xc(Zc(e)))}_renderNode(t){let e;if(e=t.node?this.tag&&this.text:this.tag?this.text:!this.text,e)throw new hn.b('ui-template-wrong-syntax: Node definition must have either "tag" or "text" when rendering a new Node.',this);return this.text?this._renderText(t):this._renderElement(t)}_renderElement(t){let e=t.node;return e||(e=t.node=document.createElementNS(this.ns||"http://www.w3.org/1999/xhtml",this.tag)),this._renderAttributes(t),this._renderElementChildren(t),this._setUpListeners(t),e}_renderText(t){let e=t.node;return e?t.revertData.text=e.textContent:e=t.node=document.createTextNode(""),Gc(this.text)?this._bindToObservable({schema:this.text,updater:Qc(e),data:t}):e.textContent=this.text.join(""),e}_renderAttributes(t){let e,n,i,o;if(!this.attributes)return;const r=t.node,s=t.revertData;for(e in this.attributes)if(i=r.getAttribute(e),n=this.attributes[e],s&&(s.attributes[e]=i),o=j(n[0])&&n[0].ns?n[0].ns:null,Gc(n)){const a=o?n[0].value:n;s&&al(e)&&a.unshift(i),this._bindToObservable({schema:a,updater:Kc(r,e,o),data:t})}else"style"==e&&"string"!=typeof n[0]?this._renderStyleAttribute(n[0],t):(s&&i&&al(e)&&n.unshift(i),n=n.map(t=>t&&t.value||t).reduce((t,e)=>t.concat(e),[]).reduce(el,""),il(n)||r.setAttributeNS(o,e,n))}_renderStyleAttribute(t,e){const n=e.node;for(const i in t){const o=t[i];Gc(o)?this._bindToObservable({schema:[o],updater:Jc(n,i),data:e}):n.style[i]=o}}_renderElementChildren(t){const e=t.node,n=t.intoFragment?document.createDocumentFragment():e,i=t.isApplying;let o=0;for(const r of this.children)if(sl(r)){if(!i){r.setParent(e);for(const t of r)n.appendChild(t.element)}}else if(ol(r))i||(r.isRendered||r.render(),n.appendChild(r.element));else if($o(r))n.appendChild(r);else if(i){const e={children:[],bindings:[],attributes:{}};t.revertData.children.push(e),r._renderNode({node:n.childNodes[o++],isApplying:!0,revertData:e})}else n.appendChild(r.render());t.intoFragment&&e.appendChild(n)}_setUpListeners(t){if(this.eventListeners)for(const e in this.eventListeners){const n=this.eventListeners[e].map(n=>{const[i,o]=e.split("@");return n.activateDomEventListener(i,o,t)});t.revertData&&t.revertData.bindings.push(n)}}_bindToObservable({schema:t,updater:e,data:n}){const i=n.revertData;$c(t,e,n);const o=t.filter(t=>!il(t)).filter(t=>t.observable).map(i=>i.activateAttributeListener(t,e,n));i&&i.bindings.push(o)}_revertTemplateFromNode(t,e){for(const t of e.bindings)for(const e of t)e();if(e.text)t.textContent=e.text;else{for(const n in e.attributes){const i=e.attributes[n];null===i?t.removeAttribute(n):t.setAttribute(n,i)}for(let n=0;n<e.children.length;++n)this._revertTemplateFromNode(t.childNodes[n],e.children[n])}}}xn(Hc,gn);class qc{constructor(t){Object.assign(this,t)}getValue(t){const e=this.observable[this.attribute];return this.callback?this.callback(e,t):e}activateAttributeListener(t,e,n){const i=()=>$c(t,e,n);return this.emitter.listenTo(this.observable,"change:"+this.attribute,i),()=>{this.emitter.stopListening(this.observable,"change:"+this.attribute,i)}}}class Wc extends qc{activateDomEventListener(t,e,n){const i=(t,n)=>{e&&!n.target.matches(e)||("function"==typeof this.eventNameOrFunction?this.eventNameOrFunction(n):this.observable.fire(this.eventNameOrFunction,n))};return this.emitter.listenTo(n.node,t,i),()=>{this.emitter.stopListening(n.node,t,i)}}}class Yc extends qc{getValue(t){return!il(super.getValue(t))&&(this.valueIfTrue||!0)}}function Gc(t){return!!t&&(t.value&&(t=t.value),Array.isArray(t)?t.some(Gc):t instanceof qc)}function $c(t,e,{node:n}){let i=function(t,e){return t.map(t=>t instanceof qc?t.getValue(e):t)}(t,n);i=1==t.length&&t[0]instanceof Yc?i[0]:i.reduce(el,""),il(i)?e.remove():e.set(i)}function Qc(t){return{set(e){t.textContent=e},remove(){t.textContent=""}}}function Kc(t,e,n){return{set(i){t.setAttributeNS(n,e,i)},remove(){t.removeAttributeNS(n,e)}}}function Jc(t,e){return{set(n){t.style[e]=n},remove(){t.style[e]=null}}}function Zc(t){return en(t,t=>{if(t&&(t instanceof qc||rl(t)||ol(t)||sl(t)))return t})}function Xc(t){if("string"==typeof t?t=function(t){return{text:[t]}}(t):t.text&&function(t){Array.isArray(t.text)||(t.text=[t.text])}(t),t.on&&(t.eventListeners=function(t){for(const e in t)tl(t,e);return t}(t.on),delete t.on),!t.text){t.attributes&&function(t){for(const e in t)t[e].value&&(t[e].value=[].concat(t[e].value)),tl(t,e)}(t.attributes);const e=[];if(t.children)if(sl(t.children))e.push(t.children);else for(const n of t.children)rl(n)||ol(n)||$o(n)?e.push(n):e.push(new Hc(n));t.children=e}return t}function tl(t,e){Array.isArray(t[e])||(t[e]=[t[e]])}function el(t,e){return il(e)?t:il(t)?e:`${t} ${e}`}function nl(t,e){for(const n in e)t[n]?t[n].push(...e[n]):t[n]=e[n]}function il(t){return!t&&0!==t}function ol(t){return t instanceof cl}function rl(t){return t instanceof Hc}function sl(t){return t instanceof Uc}function al(t){return"class"==t||"style"==t}n(15);class cl{constructor(t){this.element=null,this.isRendered=!1,this.locale=t,this.t=t&&t.t,this._viewCollections=new An,this._unboundChildren=this.createCollection(),this._viewCollections.on("add",(e,n)=>{n.locale=t}),this.decorate("render")}get bindTemplate(){return this._bindTemplate?this._bindTemplate:this._bindTemplate=Hc.bind(this,this)}createCollection(t){const e=new Uc(t);return this._viewCollections.add(e),e}registerChild(t){yn(t)||(t=[t]);for(const e of t)this._unboundChildren.add(e)}deregisterChild(t){yn(t)||(t=[t]);for(const e of t)this._unboundChildren.remove(e)}setTemplate(t){this.template=new Hc(t)}extendTemplate(t){Hc.extend(this.template,t)}render(){if(this.isRendered)throw new hn.b("ui-view-render-already-rendered: This View has already been rendered.",this);this.template&&(this.element=this.template.render(),this.registerChild(this.template.getViews())),this.isRendered=!0}destroy(){this.stopListening(),this._viewCollections.map(t=>t.destroy()),this.template&&this.template._revertData&&this.template.revert(this.element)}}xn(cl,cr),xn(cl,Ui);var ll=function(t){return"string"==typeof t||!Dt(t)&&p(t)&&"[object String]"==f(t)};class dl extends Uc{constructor(t,e=[]){super(e),this.locale=t}attachToDom(){this._bodyCollectionContainer=new Hc({tag:"div",attributes:{class:["ck","ck-reset_all","ck-body","ck-rounded-corners"],dir:this.locale.uiLanguageDirection},children:this}).render();let t=document.querySelector(".ck-body-wrapper");t||(t=function(t,e,n={},i=[]){const o=n&&n.xmlns,r=o?t.createElementNS(o,e):t.createElement(e);for(const t in n)r.setAttribute(t,n[t]);!ll(i)&&yn(i)||(i=[i]);for(let e of i)ll(e)&&(e=t.createTextNode(e)),r.appendChild(e);return r}(document,"div",{class:"ck-body-wrapper"}),document.body.appendChild(t)),t.appendChild(this._bodyCollectionContainer)}detachFromDom(){super.destroy(),this._bodyCollectionContainer&&this._bodyCollectionContainer.remove();const t=document.querySelector(".ck-body-wrapper");t&&0==t.childElementCount&&t.remove()}}n(17);class ul extends cl{constructor(t){super(t),this.body=new dl(t)}render(){super.render(),this.body.attachToDom()}destroy(){return this.body.detachFromDom(),super.destroy()}}n(19);class hl extends cl{constructor(t){super(t),this.set("text"),this.set("for"),this.id="ck-editor__label_"+dn();const e=this.bindTemplate;this.setTemplate({tag:"label",attributes:{class:["ck","ck-label"],id:this.id,for:e.to("for")},children:[{text:e.to("text")}]})}}class fl extends ul{constructor(t){super(t),this.top=this.createCollection(),this.main=this.createCollection(),this._voiceLabelView=this._createVoiceLabel(),this.setTemplate({tag:"div",attributes:{class:["ck","ck-reset","ck-editor","ck-rounded-corners"],role:"application",dir:t.uiLanguageDirection,lang:t.uiLanguage,"aria-labelledby":this._voiceLabelView.id},children:[this._voiceLabelView,{tag:"div",attributes:{class:["ck","ck-editor__top","ck-reset_all"],role:"presentation"},children:this.top},{tag:"div",attributes:{class:["ck","ck-editor__main"],role:"presentation"},children:this.main}]})}_createVoiceLabel(){const t=this.t,e=new hl;return e.text=t("Rich Text Editor"),e.extendTemplate({attributes:{class:"ck-voice-label"}}),e}}class ml extends cl{constructor(t,e,n){super(t),this.setTemplate({tag:"div",attributes:{class:["ck","ck-content","ck-editor__editable","ck-rounded-corners"],lang:t.contentLanguage,dir:t.contentLanguageDirection}}),this.name=null,this.set("isFocused",!1),this._editableElement=n,this._hasExternalElement=!!this._editableElement,this._editingView=e}render(){super.render(),this._hasExternalElement?this.template.apply(this.element=this._editableElement):this._editableElement=this.element,this.on("change:isFocused",()=>this._updateIsFocusedClasses()),this._updateIsFocusedClasses()}destroy(){this._hasExternalElement&&this.template.revert(this._editableElement),super.destroy()}_updateIsFocusedClasses(){const t=this._editingView;function e(e){t.change(n=>{const i=t.document.getRoot(e.name);n.addClass(e.isFocused?"ck-focused":"ck-blurred",i),n.removeClass(e.isFocused?"ck-blurred":"ck-focused",i)})}t.isRenderingInProgress?function n(i){t.once("change:isRenderingInProgress",(t,o,r)=>{r?n(i):e(i)})}(this):e(this)}}class gl extends ml{constructor(t,e,n){super(t,e,n),this.extendTemplate({attributes:{role:"textbox",class:"ck-editor__editable_inline"}})}render(){super.render();const t=this._editingView,e=this.t;t.change(n=>{const i=t.document.getRoot(this.name);n.setAttribute("aria-label",e("Rich Text Editor, %0",[this.name]),i)})}}function pl(t){return e=>e+t}n(21);const bl=pl("px");class wl extends cl{constructor(t){super(t);const e=this.bindTemplate;this.set("isActive",!1),this.set("isSticky",!1),this.set("limiterElement",null),this.set("limiterBottomOffset",50),this.set("viewportTopOffset",0),this.set("_marginLeft",null),this.set("_isStickyToTheLimiter",!1),this.set("_hasViewportTopOffset",!1),this.content=this.createCollection(),this._contentPanelPlaceholder=new Hc({tag:"div",attributes:{class:["ck","ck-sticky-panel__placeholder"],style:{display:e.to("isSticky",t=>t?"block":"none"),height:e.to("isSticky",t=>t?bl(this._panelRect.height):null)}}}).render(),this._contentPanel=new Hc({tag:"div",attributes:{class:["ck","ck-sticky-panel__content",e.if("isSticky","ck-sticky-panel__content_sticky"),e.if("_isStickyToTheLimiter","ck-sticky-panel__content_sticky_bottom-limit")],style:{width:e.to("isSticky",t=>t?bl(this._contentPanelPlaceholder.getBoundingClientRect().width):null),top:e.to("_hasViewportTopOffset",t=>t?bl(this.viewportTopOffset):null),bottom:e.to("_isStickyToTheLimiter",t=>t?bl(this.limiterBottomOffset):null),marginLeft:e.to("_marginLeft")}},children:this.content}).render(),this.setTemplate({tag:"div",attributes:{class:["ck","ck-sticky-panel"]},children:[this._contentPanelPlaceholder,this._contentPanel]})}render(){super.render(),this._checkIfShouldBeSticky(),this.listenTo(Xo.window,"scroll",()=>{this._checkIfShouldBeSticky()}),this.listenTo(this,"change:isActive",()=>{this._checkIfShouldBeSticky()})}_checkIfShouldBeSticky(){const t=this._panelRect=this._contentPanel.getBoundingClientRect();let e;this.limiterElement?(e=this._limiterRect=this.limiterElement.getBoundingClientRect(),this.isSticky=this.isActive&&e.top<this.viewportTopOffset&&this._panelRect.height+this.limiterBottomOffset<e.height):this.isSticky=!1,this.isSticky?(this._isStickyToTheLimiter=e.bottom<t.height+this.limiterBottomOffset+this.viewportTopOffset,this._hasViewportTopOffset=!this._isStickyToTheLimiter&&!!this.viewportTopOffset,this._marginLeft=this._isStickyToTheLimiter?null:bl(-Xo.window.scrollX)):(this._isStickyToTheLimiter=!1,this._hasViewportTopOffset=!1,this._marginLeft=null)}}class kl{constructor(t){if(Object.assign(this,t),t.actions&&t.keystrokeHandler)for(const e in t.actions){let n=t.actions[e];"string"==typeof n&&(n=[n]);for(const i of n)t.keystrokeHandler.set(i,(t,n)=>{this[e](),n()})}}get first(){return this.focusables.find(_l)||null}get last(){return this.focusables.filter(_l).slice(-1)[0]||null}get next(){return this._getFocusableItem(1)}get previous(){return this._getFocusableItem(-1)}get current(){let t=null;return null===this.focusTracker.focusedElement?null:(this.focusables.find((e,n)=>{const i=e.element===this.focusTracker.focusedElement;return i&&(t=n),i}),t)}focusFirst(){this._focus(this.first)}focusLast(){this._focus(this.last)}focusNext(){this._focus(this.next)}focusPrevious(){this._focus(this.previous)}_focus(t){t&&t.focus()}_getFocusableItem(t){const e=this.current,n=this.focusables.length;if(!n)return null;if(null===e)return this[1===t?"first":"last"];let i=(e+n+t)%n;do{const e=this.focusables.get(i);if(_l(e))return e;i=(i+n+t)%n}while(i!==e);return null}}function _l(t){return!(!t.focus||"none"==Xo.window.getComputedStyle(t.element).display)}class vl extends cl{constructor(t){super(t),this.setTemplate({tag:"span",attributes:{class:["ck","ck-toolbar__separator"]}})}}class yl{constructor(t,e){yl._observerInstance||yl._createObserver(),this._element=t,this._callback=e,yl._addElementCallback(t,e),yl._observerInstance.observe(t)}destroy(){yl._deleteElementCallback(this._element,this._callback)}static _addElementCallback(t,e){yl._elementCallbacks||(yl._elementCallbacks=new Map);let n=yl._elementCallbacks.get(t);n||(n=new Set,yl._elementCallbacks.set(t,n)),n.add(e)}static _deleteElementCallback(t,e){const n=yl._getElementCallbacks(t);n&&(n.delete(e),n.size||(yl._elementCallbacks.delete(t),yl._observerInstance.unobserve(t))),yl._elementCallbacks&&!yl._elementCallbacks.size&&(yl._observerInstance=null,yl._elementCallbacks=null)}static _getElementCallbacks(t){return yl._elementCallbacks?yl._elementCallbacks.get(t):null}static _createObserver(){let t;t="function"==typeof Xo.window.ResizeObserver?Xo.window.ResizeObserver:xl,yl._observerInstance=new t(t=>{for(const e of t){if(!e.target.offsetParent)continue;const t=yl._getElementCallbacks(e.target);if(t)for(const n of t)n(e)}})}}yl._observerInstance=null,yl._elementCallbacks=null;class xl{constructor(t){this._callback=t,this._elements=new Set,this._previousRects=new Map,this._periodicCheckTimeout=null}observe(t){this._elements.add(t),this._checkElementRectsAndExecuteCallback(),1===this._elements.size&&this._startPeriodicCheck()}unobserve(t){this._elements.delete(t),this._previousRects.delete(t),this._elements.size||this._stopPeriodicCheck()}_startPeriodicCheck(){const t=()=>{this._checkElementRectsAndExecuteCallback(),this._periodicCheckTimeout=setTimeout(t,100)};this.listenTo(Xo.window,"resize",()=>{this._checkElementRectsAndExecuteCallback()}),this._periodicCheckTimeout=setTimeout(t,100)}_stopPeriodicCheck(){clearTimeout(this._periodicCheckTimeout),this.stopListening(),this._previousRects.clear()}_checkElementRectsAndExecuteCallback(){const t=[];for(const e of this._elements)this._hasRectChanged(e)&&t.push({target:e,contentRect:this._previousRects.get(e)});t.length&&this._callback(t)}_hasRectChanged(t){if(!t.ownerDocument.body.contains(t))return!1;const e=new Zr(t),n=this._previousRects.get(t),i=!n||!n.isEqual(e);return this._previousRects.set(t,e),i}}xn(xl,cr);class Al extends cl{constructor(t){super(t);const e=this.bindTemplate;this.set("isVisible",!1),this.set("position","se"),this.children=this.createCollection(),this.setTemplate({tag:"div",attributes:{class:["ck","ck-reset","ck-dropdown__panel",e.to("position",t=>"ck-dropdown__panel_"+t),e.if("isVisible","ck-dropdown__panel-visible")]},children:this.children,on:{selectstart:e.to(t=>t.preventDefault())}})}focus(){this.children.length&&this.children.first.focus()}focusLast(){if(this.children.length){const t=this.children.last;"function"==typeof t.focusLast?t.focusLast():t.focus()}}}n(23);function Tl({element:t,target:e,positions:n,limiter:i,fitInViewport:o}){z(e)&&(e=e()),z(i)&&(i=i());const r=function(t){return t&&t.parentNode?t.offsetParent===Xo.document.body?null:t.offsetParent:null}(t),s=new Zr(t),a=new Zr(e);let c,l;if(i||o){const t=function(t,e){const{elementRect:n,viewportRect:i}=e,o=n.getArea(),r=function(t,{targetRect:e,elementRect:n,limiterRect:i,viewportRect:o}){const r=[],s=n.getArea();for(const a of t){const[t,c]=Cl(a,e,n);let l=0,d=0;if(i)if(o){const t=i.getIntersection(o);t&&(l=t.getIntersectionArea(c))}else l=i.getIntersectionArea(c);o&&(d=o.getIntersectionArea(c));const u={positionName:t,positionRect:c,limiterIntersectArea:l,viewportIntersectArea:d};if(l===s)return[u];r.push(u)}return r}(t,e);if(i){const t=Pl(r.filter(({viewportIntersectArea:t})=>t===o),o);if(t)return t}return Pl(r,o)}(n,{targetRect:a,elementRect:s,limiterRect:i&&new Zr(i).getVisible(),viewportRect:o&&new Zr(Xo.window)});[l,c]=t||Cl(n[0],a,s)}else[l,c]=Cl(n[0],a,s);let d=Sl(c);return r&&(d=function({left:t,top:e},n){const i=Sl(new Zr(n)),o=Kr(n);return t-=i.left,e-=i.top,t+=n.scrollLeft,e+=n.scrollTop,t-=o.left,e-=o.top,{left:t,top:e}}(d,r)),{left:d.left,top:d.top,name:l}}function Cl(t,e,n){const{left:i,top:o,name:r}=t(e,n);return[r,n.clone().moveTo(i,o)]}function Pl(t,e){let n,i,o=0;for(const{positionName:r,positionRect:s,limiterIntersectArea:a,viewportIntersectArea:c}of t){if(a===e)return[r,s];const t=c**2+a**2;t>o&&(o=t,n=s,i=r)}return n?[i,n]:null}function Sl({left:t,top:e}){const{scrollX:n,scrollY:i}=Xo.window;return{left:t+n,top:e+i}}class Ml extends cl{constructor(t,e,n){super(t);const i=this.bindTemplate;this.buttonView=e,this.panelView=n,this.set("isOpen",!1),this.set("isEnabled",!0),this.set("class"),this.set("id"),this.set("panelPosition","auto"),this.keystrokes=new Ac,this.setTemplate({tag:"div",attributes:{class:["ck","ck-dropdown",i.to("class"),i.if("isEnabled","ck-disabled",t=>!t)],id:i.to("id"),"aria-describedby":i.to("ariaDescribedById")},children:[e,n]}),e.extendTemplate({attributes:{class:["ck-dropdown__button"]}})}render(){super.render(),this.listenTo(this.buttonView,"open",()=>{this.isOpen=!this.isOpen}),this.panelView.bind("isVisible").to(this,"isOpen"),this.on("change:isOpen",()=>{this.isOpen&&("auto"===this.panelPosition?this.panelView.position=Ml._getOptimalPosition({element:this.panelView.element,target:this.buttonView.element,fitInViewport:!0,positions:this._panelPositions}).name:this.panelView.position=this.panelPosition)}),this.keystrokes.listenTo(this.element);const t=(t,e)=>{this.isOpen&&(this.buttonView.focus(),this.isOpen=!1,e())};this.keystrokes.set("arrowdown",(t,e)=>{this.buttonView.isEnabled&&!this.isOpen&&(this.isOpen=!0,e())}),this.keystrokes.set("arrowright",(t,e)=>{this.isOpen&&e()}),this.keystrokes.set("arrowleft",t),this.keystrokes.set("esc",t)}focus(){this.buttonView.focus()}get _panelPositions(){const{southEast:t,southWest:e,northEast:n,northWest:i}=Ml.defaultPanelPositions;return"ltr"===this.locale.uiLanguageDirection?[t,e,n,i]:[e,t,i,n]}}Ml.defaultPanelPositions={southEast:t=>({top:t.bottom,left:t.left,name:"se"}),southWest:(t,e)=>({top:t.bottom,left:t.left-e.width+t.width,name:"sw"}),northEast:(t,e)=>({top:t.top-e.height,left:t.left,name:"ne"}),northWest:(t,e)=>({top:t.bottom-e.height,left:t.left-e.width+t.width,name:"nw"})},Ml._getOptimalPosition=Tl;n(25);class El extends cl{constructor(){super();const t=this.bindTemplate;this.set("content",""),this.set("viewBox","0 0 20 20"),this.set("fillColor",""),this.setTemplate({tag:"svg",ns:"http://www.w3.org/2000/svg",attributes:{class:["ck","ck-icon"],viewBox:t.to("viewBox")}})}render(){super.render(),this._updateXMLContent(),this._colorFillPaths(),this.on("change:content",()=>{this._updateXMLContent(),this._colorFillPaths()}),this.on("change:fillColor",()=>{this._colorFillPaths()})}_updateXMLContent(){if(this.content){const t=(new DOMParser).parseFromString(this.content.trim(),"image/svg+xml").querySelector("svg"),e=t.getAttribute("viewBox");for(e&&(this.viewBox=e),this.element.innerHTML="";t.childNodes.length>0;)this.element.appendChild(t.childNodes[0])}}_colorFillPaths(){this.fillColor&&this.element.querySelectorAll(".ck-icon__fill").forEach(t=>{t.style.fill=this.fillColor})}}n(27);class Il extends cl{constructor(t){super(t),this.set("text",""),this.set("position","s");const e=this.bindTemplate;this.setTemplate({tag:"span",attributes:{class:["ck","ck-tooltip",e.to("position",t=>"ck-tooltip_"+t),e.if("text","ck-hidden",t=>!t.trim())]},children:[{tag:"span",attributes:{class:["ck","ck-tooltip__text"]},children:[{text:e.to("text")}]}]})}}n(29);class Nl extends cl{constructor(t){super(t);const e=this.bindTemplate,n=dn();this.set("class"),this.set("labelStyle"),this.set("icon"),this.set("isEnabled",!0),this.set("isOn",!1),this.set("isVisible",!0),this.set("isToggleable",!1),this.set("keystroke"),this.set("label"),this.set("tabindex",-1),this.set("tooltip"),this.set("tooltipPosition","s"),this.set("type","button"),this.set("withText",!1),this.set("withKeystroke",!1),this.children=this.createCollection(),this.tooltipView=this._createTooltipView(),this.labelView=this._createLabelView(n),this.iconView=new El,this.iconView.extendTemplate({attributes:{class:"ck-button__icon"}}),this.keystrokeView=this._createKeystrokeView(),this.bind("_tooltipString").to(this,"tooltip",this,"label",this,"keystroke",this._getTooltipString.bind(this)),this.setTemplate({tag:"button",attributes:{class:["ck","ck-button",e.to("class"),e.if("isEnabled","ck-disabled",t=>!t),e.if("isVisible","ck-hidden",t=>!t),e.to("isOn",t=>t?"ck-on":"ck-off"),e.if("withText","ck-button_with-text"),e.if("withKeystroke","ck-button_with-keystroke")],type:e.to("type",t=>t||"button"),tabindex:e.to("tabindex"),"aria-labelledby":"ck-editor__aria-label_"+n,"aria-disabled":e.if("isEnabled",!0,t=>!t),"aria-pressed":e.to("isOn",t=>!!this.isToggleable&&String(t))},children:this.children,on:{mousedown:e.to(t=>{t.preventDefault()}),click:e.to(t=>{this.isEnabled?this.fire("execute"):t.preventDefault()})}})}render(){super.render(),this.icon&&(this.iconView.bind("content").to(this,"icon"),this.children.add(this.iconView)),this.children.add(this.tooltipView),this.children.add(this.labelView),this.withKeystroke&&this.children.add(this.keystrokeView)}focus(){this.element.focus()}_createTooltipView(){const t=new Il;return t.bind("text").to(this,"_tooltipString"),t.bind("position").to(this,"tooltipPosition"),t}_createLabelView(t){const e=new cl,n=this.bindTemplate;return e.setTemplate({tag:"span",attributes:{class:["ck","ck-button__label"],style:n.to("labelStyle"),id:"ck-editor__aria-label_"+t},children:[{text:this.bindTemplate.to("label")}]}),e}_createKeystrokeView(){const t=new cl;return t.setTemplate({tag:"span",attributes:{class:["ck","ck-button__keystroke"]},children:[{text:this.bindTemplate.to("keystroke",t=>wo(t))}]}),t}_getTooltipString(t,e,n){return t?"string"==typeof t?t:(n&&(n=wo(n)),t instanceof Function?t(e,n):`${e}${n?` (${n})`:""}`):""}}var Ol='<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.941 4.523a.75.75 0 1 1 1.06-1.06l3.006 3.005 3.005-3.005a.75.75 0 1 1 1.06 1.06l-3.549 3.55a.75.75 0 0 1-1.168-.136L.941 4.523z"/></svg>';class Rl extends Nl{constructor(t){super(t),this.arrowView=this._createArrowView(),this.extendTemplate({attributes:{"aria-haspopup":!0}}),this.delegate("execute").to(this,"open")}render(){super.render(),this.children.add(this.arrowView)}_createArrowView(){const t=new El;return t.content=Ol,t.extendTemplate({attributes:{class:"ck-dropdown__arrow"}}),t}}n(31);class Dl extends cl{constructor(){super(),this.items=this.createCollection(),this.focusTracker=new Oc,this.keystrokes=new Ac,this._focusCycler=new kl({focusables:this.items,focusTracker:this.focusTracker,keystrokeHandler:this.keystrokes,actions:{focusPrevious:"arrowup",focusNext:"arrowdown"}}),this.setTemplate({tag:"ul",attributes:{class:["ck","ck-reset","ck-list"]},children:this.items})}render(){super.render();for(const t of this.items)this.focusTracker.add(t.element);this.items.on("add",(t,e)=>{this.focusTracker.add(e.element)}),this.items.on("remove",(t,e)=>{this.focusTracker.remove(e.element)}),this.keystrokes.listenTo(this.element)}focus(){this._focusCycler.focusFirst()}focusLast(){this._focusCycler.focusLast()}}class Ll extends cl{constructor(t){super(t),this.children=this.createCollection(),this.setTemplate({tag:"li",attributes:{class:["ck","ck-list__item"]},children:this.children})}focus(){this.children.first.focus()}}class jl extends cl{constructor(t){super(t),this.setTemplate({tag:"li",attributes:{class:["ck","ck-list__separator"]}})}}n(33);class Vl extends Nl{constructor(t){super(t),this.isToggleable=!0,this.toggleSwitchView=this._createToggleView(),this.extendTemplate({attributes:{class:"ck-switchbutton"}})}render(){super.render(),this.children.add(this.toggleSwitchView)}_createToggleView(){const t=new cl;return t.setTemplate({tag:"span",attributes:{class:["ck","ck-button__toggle"]},children:[{tag:"span",attributes:{class:["ck","ck-button__toggle__inner"]}}]}),t}}function zl({emitter:t,activator:e,callback:n,contextElements:i}){t.listenTo(document,"mousedown",(t,{target:o})=>{if(e()){for(const t of i)if(t.contains(o))return;n()}})}n(35),n(37);function Bl(t,e=Rl){const n=new e(t),i=new Al(t),o=new Ml(t,n,i);return n.bind("isEnabled").to(o),n instanceof Rl?n.bind("isOn").to(o,"isOpen"):n.arrowView.bind("isOn").to(o,"isOpen"),function(t){(function(t){t.on("render",()=>{zl({emitter:t,activator:()=>t.isOpen,callback:()=>{t.isOpen=!1},contextElements:[t.element]})})})(t),function(t){t.on("execute",e=>{e.source instanceof Vl||(t.isOpen=!1)})}(t),function(t){t.keystrokes.set("arrowdown",(e,n)=>{t.isOpen&&(t.panelView.focus(),n())}),t.keystrokes.set("arrowup",(e,n)=>{t.isOpen&&(t.panelView.focusLast(),n())})}(t)}(o),o}function Fl(t,e){const n=t.locale,i=t.listView=new Dl(n);i.items.bindTo(e).using(({type:t,model:e})=>{if("separator"===t)return new jl(n);if("button"===t||"switchbutton"===t){const i=new Ll(n);let o;return o="button"===t?new Nl(n):new Vl(n),o.bind(...Object.keys(e)).to(e),o.delegate("execute").to(i),i.children.add(o),i}}),t.panelView.children.add(i),i.items.delegate("execute").to(t)}n(39);class Ul extends cl{constructor(t,e){super(t);const n=this.bindTemplate,i=this.t;var o;this.options=e||{},this.set("ariaLabel",i("Editor toolbar")),this.set("maxWidth","auto"),this.items=this.createCollection(),this.focusTracker=new Oc,this.keystrokes=new Ac,this.set("class"),this.set("isCompact",!1),this.itemsView=new Hl(t),this.children=this.createCollection(),this.children.add(this.itemsView),this.focusables=this.createCollection(),this._focusCycler=new kl({focusables:this.focusables,focusTracker:this.focusTracker,keystrokeHandler:this.keystrokes,actions:{focusPrevious:["arrowleft","arrowup"],focusNext:["arrowright","arrowdown"]}}),this.setTemplate({tag:"div",attributes:{class:["ck","ck-toolbar",n.to("class"),n.if("isCompact","ck-toolbar_compact")],role:"toolbar","aria-label":n.to("ariaLabel"),style:{maxWidth:n.to("maxWidth")}},children:this.children,on:{mousedown:(o=this,o.bindTemplate.to(t=>{t.target===o.element&&t.preventDefault()}))}}),this._behavior=this.options.shouldGroupWhenFull?new Wl(this):new ql(this)}render(){super.render();for(const t of this.items)this.focusTracker.add(t.element);this.items.on("add",(t,e)=>{this.focusTracker.add(e.element)}),this.items.on("remove",(t,e)=>{this.focusTracker.remove(e.element)}),this.keystrokes.listenTo(this.element),this._behavior.render(this)}destroy(){return this._behavior.destroy(),super.destroy()}focus(){this._focusCycler.focusFirst()}focusLast(){this._focusCycler.focusLast()}fillFromConfig(t,e){t.map(t=>{"|"==t?this.items.add(new vl):e.has(t)?this.items.add(e.create(t)):console.warn(Object(hn.a)("toolbarview-item-unavailable: The requested toolbar item is unavailable."),{name:t})})}}class Hl extends cl{constructor(t){super(t),this.children=this.createCollection(),this.setTemplate({tag:"div",attributes:{class:["ck","ck-toolbar__items"]},children:this.children})}}class ql{constructor(t){const e=t.bindTemplate;t.set("isVertical",!1),t.itemsView.children.bindTo(t.items).using(t=>t),t.focusables.bindTo(t.items).using(t=>t),t.extendTemplate({attributes:{class:[e.if("isVertical","ck-toolbar_vertical")]}})}render(){}destroy(){}}class Wl{constructor(t){this.viewChildren=t.children,this.viewFocusables=t.focusables,this.viewItemsView=t.itemsView,this.viewFocusTracker=t.focusTracker,this.viewLocale=t.locale,this.ungroupedItems=t.createCollection(),this.groupedItems=t.createCollection(),this.groupedItemsDropdown=this._createGroupedItemsDropdown(),this.resizeObserver=null,this.cachedPadding=null,this.shouldUpdateGroupingOnNextResize=!1,t.itemsView.children.bindTo(this.ungroupedItems).using(t=>t),this.ungroupedItems.on("add",this._updateFocusCycleableItems.bind(this)),this.ungroupedItems.on("remove",this._updateFocusCycleableItems.bind(this)),t.children.on("add",this._updateFocusCycleableItems.bind(this)),t.children.on("remove",this._updateFocusCycleableItems.bind(this)),t.items.on("add",(t,e,n)=>{n>this.ungroupedItems.length?this.groupedItems.add(e,n-this.ungroupedItems.length):this.ungroupedItems.add(e,n),this._updateGrouping()}),t.items.on("remove",(t,e,n)=>{n>this.ungroupedItems.length?this.groupedItems.remove(e):this.ungroupedItems.remove(e),this._updateGrouping()}),t.extendTemplate({attributes:{class:["ck-toolbar_grouping"]}})}render(t){this.viewElement=t.element,this._enableGroupingOnResize(),this._enableGroupingOnMaxWidthChange(t)}destroy(){this.groupedItemsDropdown.destroy(),this.resizeObserver.destroy()}_updateGrouping(){if(!this.viewElement.ownerDocument.body.contains(this.viewElement))return;if(!this.viewElement.offsetParent)return void(this.shouldUpdateGroupingOnNextResize=!0);let t;for(;this._areItemsOverflowing;)this._groupLastItem(),t=!0;if(!t&&this.groupedItems.length){for(;this.groupedItems.length&&!this._areItemsOverflowing;)this._ungroupFirstItem();this._areItemsOverflowing&&this._groupLastItem()}}get _areItemsOverflowing(){if(!this.ungroupedItems.length)return!1;const t=this.viewElement,e=this.viewLocale.uiLanguageDirection,n=new Zr(t.lastChild),i=new Zr(t);if(!this.cachedPadding){const n=Xo.window.getComputedStyle(t),i="ltr"===e?"paddingRight":"paddingLeft";this.cachedPadding=Number.parseInt(n[i])}return"ltr"===e?n.right>i.right-this.cachedPadding:n.left<i.left+this.cachedPadding}_enableGroupingOnResize(){let t;this.resizeObserver=new yl(this.viewElement,e=>{t&&t===e.contentRect.width&&!this.shouldUpdateGroupingOnNextResize||(this.shouldUpdateGroupingOnNextResize=!1,this._updateGrouping(),t=e.contentRect.width)}),this._updateGrouping()}_enableGroupingOnMaxWidthChange(t){t.on("change:maxWidth",()=>{this._updateGrouping()})}_groupLastItem(){this.groupedItems.length||(this.viewChildren.add(new vl),this.viewChildren.add(this.groupedItemsDropdown),this.viewFocusTracker.add(this.groupedItemsDropdown.element)),this.groupedItems.add(this.ungroupedItems.remove(this.ungroupedItems.last),0)}_ungroupFirstItem(){this.ungroupedItems.add(this.groupedItems.remove(this.groupedItems.first)),this.groupedItems.length||(this.viewChildren.remove(this.groupedItemsDropdown),this.viewChildren.remove(this.viewChildren.last),this.viewFocusTracker.remove(this.groupedItemsDropdown.element))}_createGroupedItemsDropdown(){const t=this.viewLocale,e=t.t,n=Bl(t);return n.class="ck-toolbar__grouped-dropdown",n.panelPosition="ltr"===t.uiLanguageDirection?"sw":"se",function(t,e){const n=t.locale,i=n.t,o=t.toolbarView=new Ul(n);o.set("ariaLabel",i("Dropdown toolbar")),t.extendTemplate({attributes:{class:["ck-toolbar-dropdown"]}}),e.map(t=>o.items.add(t)),t.panelView.children.add(o),o.items.delegate("execute").to(t)}(n,[]),n.buttonView.set({label:e("Show more items"),tooltip:!0,icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="9.5" cy="4.5" r="1.5"/><circle cx="9.5" cy="10.5" r="1.5"/><circle cx="9.5" cy="16.5" r="1.5"/></svg>'}),n.toolbarView.items.bindTo(this.groupedItems).using(t=>t),n}_updateFocusCycleableItems(){this.viewFocusables.clear(),this.ungroupedItems.map(t=>{this.viewFocusables.add(t)}),this.groupedItems.length&&this.viewFocusables.add(this.groupedItemsDropdown)}}n(41);class Yl extends fl{constructor(t,e,n={}){super(t),this.stickyPanel=new wl(t),this.toolbar=new Ul(t,{shouldGroupWhenFull:n.shouldToolbarGroupWhenFull}),this.editable=new gl(t,e)}render(){super.render(),this.stickyPanel.content.add(this.toolbar),this.top.add(this.stickyPanel),this.main.add(this.editable)}}class Gl extends Cc{constructor(t,e){super(e),nn(t)&&(this.sourceElement=t),this.data.processor=new Ec(this.data.viewDocument),this.model.document.createRoot();const n=!this.config.get("toolbar.shouldNotGroupWhenFull"),i=new Yl(this.locale,this.editing.view,{shouldToolbarGroupWhenFull:n});this.ui=new Fc(this,i),function(t){if(!z(t.updateSourceElement))throw new hn.b("attachtoform-missing-elementapi-interface: Editor passed to attachToForm() must implement ElementApi.",t);const e=t.sourceElement;if(e&&"textarea"===e.tagName.toLowerCase()&&e.form){let n;const i=e.form,o=()=>t.updateSourceElement();z(i.submit)&&(n=i.submit,i.submit=()=>{o(),n.apply(i)}),i.addEventListener("submit",o),t.on("destroy",()=>{i.removeEventListener("submit",o),n&&(i.submit=n)})}}(this)}destroy(){return this.sourceElement&&this.updateSourceElement(),this.ui.destroy(),super.destroy()}static create(t,e={}){return new Promise(n=>{const i=new this(t,e);n(i.initPlugins().then(()=>i.ui.init(nn(t)?t:null)).then(()=>{if(!nn(t)&&e.initialData)throw new hn.b("editor-create-initial-data: The config.initialData option cannot be used together with initial data passed in Editor.create().",null);const n=e.initialData||function(t){return nn(t)?(e=t,e instanceof HTMLTextAreaElement?e.value:e.innerHTML):t;var e}(t);return i.data.init(n)}).then(()=>i.fire("ready")).then(()=>i))})}}xn(Gl,Pc),xn(Gl,Sc);class $l{constructor(t){this.editor=t,this.set("isEnabled",!0),this._disableStack=new Set}forceDisabled(t){this._disableStack.add(t),1==this._disableStack.size&&(this.on("set:isEnabled",Ql,{priority:"highest"}),this.isEnabled=!1)}clearForceDisabled(t){this._disableStack.delete(t),0==this._disableStack.size&&(this.off("set:isEnabled",Ql),this.isEnabled=!0)}destroy(){this.stopListening()}static get isContextPlugin(){return!1}}function Ql(t){t.return=!1,t.stop()}xn($l,Ui);class Kl{constructor(t){this.files=function(t){const e=t.files?Array.from(t.files):[],n=t.items?Array.from(t.items):[];if(e.length)return e;return n.filter(t=>"file"===t.kind).map(t=>t.getAsFile())}(t),this._native=t}get types(){return this._native.types}getData(t){return this._native.getData(t)}setData(t,e){this._native.setData(t,e)}}class Jl extends Nr{constructor(t){super(t);const e=this.document;function n(t,n){n.preventDefault();const i=n.dropRange?[n.dropRange]:Array.from(e.selection.getRanges()),o=new cn(e,"clipboardInput");e.fire(o,{dataTransfer:n.dataTransfer,targetRanges:i}),o.stop.called&&n.stopPropagation()}this.domEventType=["paste","copy","cut","drop","dragover"],this.listenTo(e,"paste",n,{priority:"low"}),this.listenTo(e,"drop",n,{priority:"low"})}onDomEvent(t){const e={dataTransfer:new Kl(t.clipboardData?t.clipboardData:t.dataTransfer)};"drop"==t.type&&(e.dropRange=function(t,e){const n=e.target.ownerDocument,i=e.clientX,o=e.clientY;let r;n.caretRangeFromPoint&&n.caretRangeFromPoint(i,o)?r=n.caretRangeFromPoint(i,o):e.rangeParent&&(r=n.createRange(),r.setStart(e.rangeParent,e.rangeOffset),r.collapse(!0));return r?t.domConverter.domRangeToView(r):t.document.selection.getFirstRange()}(this.view,t)),this.fire(t.type,t,e)}}const Zl=["figcaption","li"];class Xl extends $l{static get pluginName(){return"Clipboard"}init(){const t=this.editor,e=t.model.document,n=t.editing.view,i=n.document;function o(n,o){const r=o.dataTransfer;o.preventDefault();const s=t.data.toView(t.model.getSelectedContent(e.selection));i.fire("clipboardOutput",{dataTransfer:r,content:s,method:n.name})}this._htmlDataProcessor=new Ec(i),n.addObserver(Jl),this.listenTo(i,"clipboardInput",e=>{t.isReadOnly&&e.stop()},{priority:"highest"}),this.listenTo(i,"clipboardInput",(t,e)=>{const i=e.dataTransfer;let o="";var r;i.getData("text/html")?o=function(t){return t.replace(/<span(?: class="Apple-converted-space"|)>(\s+)<\/span>/g,(t,e)=>1==e.length?" ":e)}(i.getData("text/html")):i.getData("text/plain")&&((r=(r=i.getData("text/plain")).replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"</p><p>").replace(/^\s/,"&nbsp;").replace(/\s$/,"&nbsp;").replace(/\s\s/g," &nbsp;")).indexOf("</p><p>")>-1&&(r=`<p>${r}</p>`),o=r),o=this._htmlDataProcessor.toView(o);const s=new cn(this,"inputTransformation");this.fire(s,{content:o,dataTransfer:i}),s.stop.called&&t.stop(),n.scrollToTheSelection()},{priority:"low"}),this.listenTo(this,"inputTransformation",(t,e)=>{if(!e.content.isEmpty){const n=this.editor.data,i=this.editor.model,o=n.toModel(e.content,"$clipboardHolder");if(0==o.childCount)return;i.insertContent(o),t.stop()}},{priority:"low"}),this.listenTo(i,"copy",o,{priority:"low"}),this.listenTo(i,"cut",(e,n)=>{t.isReadOnly?n.preventDefault():o(e,n)},{priority:"low"}),this.listenTo(i,"clipboardOutput",(n,i)=>{i.content.isEmpty||(i.dataTransfer.setData("text/html",this._htmlDataProcessor.toData(i.content)),i.dataTransfer.setData("text/plain",function t(e){let n="";if(e.is("text")||e.is("textProxy"))n=e.data;else if(e.is("img")&&e.hasAttribute("alt"))n=e.getAttribute("alt");else{let i=null;for(const o of e.getChildren()){const e=t(o);i&&(i.is("containerElement")||o.is("containerElement"))&&(Zl.includes(i.name)||Zl.includes(o.name)?n+="\n":n+="\n\n"),n+=e,i=o}}return n}(i.content))),"cut"==i.method&&t.model.deleteContent(e.selection)},{priority:"low"})}}class td{constructor(t){this.editor=t,this.set("value",void 0),this.set("isEnabled",!1),this._disableStack=new Set,this.decorate("execute"),this.listenTo(this.editor.model.document,"change",()=>{this.refresh()}),this.on("execute",t=>{this.isEnabled||t.stop()},{priority:"high"}),this.listenTo(t,"change:isReadOnly",(t,e,n)=>{n?this.forceDisabled("readOnlyMode"):this.clearForceDisabled("readOnlyMode")})}refresh(){this.isEnabled=!0}forceDisabled(t){this._disableStack.add(t),1==this._disableStack.size&&(this.on("set:isEnabled",ed,{priority:"highest"}),this.isEnabled=!1)}clearForceDisabled(t){this._disableStack.delete(t),0==this._disableStack.size&&(this.off("set:isEnabled",ed),this.refresh())}execute(){}destroy(){this.stopListening()}}function ed(t){t.return=!1,t.stop()}function*nd(t,e){for(const n of e)n&&t.getAttributeProperties(n[0]).copyOnEnter&&(yield n)}xn(td,Ui);class id extends td{execute(){const t=this.editor.model,e=t.document;t.change(n=>{!function(t,e,n,i){const o=n.isCollapsed,r=n.getFirstRange(),s=r.start.parent,a=r.end.parent;if(i.isLimit(s)||i.isLimit(a))return void(o||s!=a||t.deleteContent(n));if(o){const t=nd(e.model.schema,n.getAttributes());od(e,r.start),e.setSelectionAttribute(t)}else{const i=!(r.start.isAtStart&&r.end.isAtEnd),o=s==a;t.deleteContent(n,{leaveUnmerged:i}),i&&(o?od(e,n.focus):e.setSelection(a,0))}}(this.editor.model,n,e.selection,t.schema),this.fire("afterExecute",{writer:n})})}}function od(t,e){t.split(e),t.setSelection(e.parent.nextSibling,0)}class rd extends ur{constructor(t){super(t);const e=this.document;e.on("keydown",(t,n)=>{if(this.isEnabled&&n.keyCode==go.enter){let i;e.once("enter",t=>i=t,{priority:"highest"}),e.fire("enter",new Ir(e,n.domEvent,{isSoft:n.shiftKey})),i&&i.stop.called&&t.stop()}})}observe(){}}class sd extends $l{static get pluginName(){return"Enter"}init(){const t=this.editor,e=t.editing.view,n=e.document;e.addObserver(rd),t.commands.add("enter",new id(t)),this.listenTo(n,"enter",(n,i)=>{i.preventDefault(),i.isSoft||(t.execute("enter"),e.scrollToTheSelection())},{priority:"low"})}}class ad extends td{execute(){const t=this.editor.model,e=t.document;t.change(n=>{!function(t,e,n){const i=n.isCollapsed,o=n.getFirstRange(),r=o.start.parent,s=o.end.parent,a=r==s;if(i){const i=nd(t.schema,n.getAttributes());cd(t,e,o.end),e.removeSelectionAttribute(n.getAttributeKeys()),e.setSelectionAttribute(i)}else{const i=!(o.start.isAtStart&&o.end.isAtEnd);t.deleteContent(n,{leaveUnmerged:i}),a?cd(t,e,n.focus):i&&e.setSelection(s,0)}}(t,n,e.selection),this.fire("afterExecute",{writer:n})})}refresh(){const t=this.editor.model,e=t.document;this.isEnabled=function(t,e){if(e.rangeCount>1)return!1;const n=e.anchor;if(!n||!t.checkChild(n,"softBreak"))return!1;const i=e.getFirstRange(),o=i.start.parent,r=i.end.parent;if((ld(o,t)||ld(r,t))&&o!==r)return!1;return!0}(t.schema,e.selection)}}function cd(t,e,n){const i=e.createElement("softBreak");t.insertContent(i,n),e.setSelection(i,"after")}function ld(t,e){return!t.is("rootElement")&&(e.isLimit(t)||ld(t.parent,e))}class dd extends $l{static get pluginName(){return"ShiftEnter"}init(){const t=this.editor,e=t.model.schema,n=t.conversion,i=t.editing.view,o=i.document;e.register("softBreak",{allowWhere:"$text",isInline:!0}),n.for("upcast").elementToElement({model:"softBreak",view:"br"}),n.for("downcast").elementToElement({model:"softBreak",view:(t,e)=>e.createEmptyElement("br")}),i.addObserver(rd),t.commands.add("shiftEnter",new ad(t)),this.listenTo(o,"enter",(e,n)=>{n.preventDefault(),n.isSoft&&(t.execute("shiftEnter"),i.scrollToTheSelection())},{priority:"low"})}}class ud extends td{execute(){const t=this.editor.model,e=t.schema.getLimitElement(t.document.selection);t.change(t=>{t.setSelection(e,"in")})}}const hd=bo("Ctrl+A");class fd extends $l{static get pluginName(){return"SelectAllEditing"}init(){const t=this.editor,e=t.editing.view.document;t.commands.add("selectAll",new ud(t)),this.listenTo(e,"keydown",(e,n)=>{po(n)===hd&&(t.execute("selectAll"),n.preventDefault())})}}class md extends $l{static get pluginName(){return"SelectAllUI"}init(){const t=this.editor;t.ui.componentFactory.add("selectAll",e=>{const n=t.commands.get("selectAll"),i=new Nl(e),o=e.t;return i.set({label:o("Select all"),icon:'<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M.75 15.5a.75.75 0 0 1 .75.75V18l.008.09A.5.5 0 0 0 2 18.5h1.75a.75.75 0 1 1 0 1.5H1.5l-.144-.007a1.5 1.5 0 0 1-1.35-1.349L0 18.5v-2.25a.75.75 0 0 1 .75-.75zm18.5 0a.75.75 0 0 1 .75.75v2.25l-.007.144a1.5 1.5 0 0 1-1.349 1.35L18.5 20h-2.25a.75.75 0 1 1 0-1.5H18a.5.5 0 0 0 .492-.41L18.5 18v-1.75a.75.75 0 0 1 .75-.75zm-10.45 3c.11 0 .2.09.2.2v1.1a.2.2 0 0 1-.2.2H7.2a.2.2 0 0 1-.2-.2v-1.1c0-.11.09-.2.2-.2h1.6zm4 0c.11 0 .2.09.2.2v1.1a.2.2 0 0 1-.2.2h-1.6a.2.2 0 0 1-.2-.2v-1.1c0-.11.09-.2.2-.2h1.6zm.45-5.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5h8.5zM1.3 11c.11 0 .2.09.2.2v1.6a.2.2 0 0 1-.2.2H.2a.2.2 0 0 1-.2-.2v-1.6c0-.11.09-.2.2-.2h1.1zm18.5 0c.11 0 .2.09.2.2v1.6a.2.2 0 0 1-.2.2h-1.1a.2.2 0 0 1-.2-.2v-1.6c0-.11.09-.2.2-.2h1.1zm-4.55-2a.75.75 0 1 1 0 1.5H4.75a.75.75 0 1 1 0-1.5h10.5zM1.3 7c.11 0 .2.09.2.2v1.6a.2.2 0 0 1-.2.2H.2a.2.2 0 0 1-.2-.2V7.2c0-.11.09-.2.2-.2h1.1zm18.5 0c.11 0 .2.09.2.2v1.6a.2.2 0 0 1-.2.2h-1.1a.2.2 0 0 1-.2-.2V7.2c0-.11.09-.2.2-.2h1.1zm-4.55-2a.75.75 0 1 1 0 1.5h-2.5a.75.75 0 1 1 0-1.5h2.5zm-5 0a.75.75 0 1 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5h5.5zm-6.5-5a.75.75 0 0 1 0 1.5H2a.5.5 0 0 0-.492.41L1.5 2v1.75a.75.75 0 0 1-1.5 0V1.5l.007-.144A1.5 1.5 0 0 1 1.356.006L1.5 0h2.25zM18.5 0l.144.007a1.5 1.5 0 0 1 1.35 1.349L20 1.5v2.25a.75.75 0 1 1-1.5 0V2l-.008-.09A.5.5 0 0 0 18 1.5h-1.75a.75.75 0 1 1 0-1.5h2.25zM8.8 0c.11 0 .2.09.2.2v1.1a.2.2 0 0 1-.2.2H7.2a.2.2 0 0 1-.2-.2V.2c0-.11.09-.2.2-.2h1.6zm4 0c.11 0 .2.09.2.2v1.1a.2.2 0 0 1-.2.2h-1.6a.2.2 0 0 1-.2-.2V.2c0-.11.09-.2.2-.2h1.6z"/></svg>',keystroke:"Ctrl+A",tooltip:!0}),i.bind("isOn","isEnabled").to(n,"value","isEnabled"),this.listenTo(i,"execute",()=>{t.execute("selectAll"),t.editing.view.focus()}),i})}}class gd extends $l{static get requires(){return[fd,md]}static get pluginName(){return"SelectAll"}}class pd{constructor(t,e=20){this.model=t,this.size=0,this.limit=e,this.isLocked=!1,this._changeCallback=(t,e)=>{"transparent"!=e.type&&e!==this._batch&&this._reset(!0)},this._selectionChangeCallback=()=>{this._reset()},this.model.document.on("change",this._changeCallback),this.model.document.selection.on("change:range",this._selectionChangeCallback),this.model.document.selection.on("change:attribute",this._selectionChangeCallback)}get batch(){return this._batch||(this._batch=this.model.createBatch()),this._batch}input(t){this.size+=t,this.size>=this.limit&&this._reset(!0)}lock(){this.isLocked=!0}unlock(){this.isLocked=!1}destroy(){this.model.document.off("change",this._changeCallback),this.model.document.selection.off("change:range",this._selectionChangeCallback),this.model.document.selection.off("change:attribute",this._selectionChangeCallback)}_reset(t){this.isLocked&&!t||(this._batch=null,this.size=0)}}class bd extends td{constructor(t,e){super(t),this._buffer=new pd(t.model,e),this._batches=new WeakSet}get buffer(){return this._buffer}destroy(){super.destroy(),this._buffer.destroy()}execute(t={}){const e=this.editor.model,n=e.document,i=t.text||"",o=i.length,r=t.range?e.createSelection(t.range):n.selection,s=t.resultRange;e.enqueueChange(this._buffer.batch,t=>{this._buffer.lock(),e.deleteContent(r),i&&e.insertContent(t.createText(i,n.selection.getAttributes()),r),s?t.setSelection(s):r.is("documentSelection")||t.setSelection(r),this._buffer.unlock(),this._buffer.input(o),this._batches.add(this._buffer.batch)})}}function wd(t){let e=null;const n=t.model,i=t.editing.view,o=t.commands.get("input");function r(t){const r=n.document,a=i.document.isComposing,c=e&&e.isEqual(r.selection);e=null,o.isEnabled&&(function(t){if(t.ctrlKey)return!0;return kd.includes(t.keyCode)}(t)||r.selection.isCollapsed||a&&229===t.keyCode||!a&&229===t.keyCode&&c||s())}function s(){const t=o.buffer;t.lock(),n.enqueueChange(t.batch,()=>{n.deleteContent(n.document.selection)}),t.unlock()}ho.isAndroid?i.document.on("beforeinput",(t,e)=>r(e),{priority:"lowest"}):i.document.on("keydown",(t,e)=>r(e),{priority:"lowest"}),i.document.on("compositionstart",(function(){const t=n.document,e=1!==t.selection.rangeCount||t.selection.getFirstRange().isFlat;if(t.selection.isCollapsed||e)return;s()}),{priority:"lowest"}),i.document.on("compositionend",()=>{e=n.createSelection(n.document.selection)},{priority:"lowest"})}const kd=[po("arrowUp"),po("arrowRight"),po("arrowDown"),po("arrowLeft"),9,16,17,18,19,20,27,33,34,35,36,45,91,93,144,145,173,174,175,176,177,178,179,255];for(let t=112;t<=135;t++)kd.push(t);function _d(t){if(t.newChildren.length-t.oldChildren.length!=1)return;const e=function(t,e){const n=[];let i,o=0;return t.forEach(t=>{"equal"==t?(r(),o++):"insert"==t?(s("insert")?i.values.push(e[o]):(r(),i={type:"insert",index:o,values:[e[o]]}),o++):s("delete")?i.howMany++:(r(),i={type:"delete",index:o,howMany:1})}),r(),n;function r(){i&&(n.push(i),i=null)}function s(t){return i&&i.type==t}}(Wo(t.oldChildren,t.newChildren,vd),t.newChildren);if(e.length>1)return;const n=e[0];return n.values[0]&&n.values[0].is("text")?n:void 0}function vd(t,e){return t&&t.is("text")&&e&&e.is("text")?t.data===e.data:t===e}class yd{constructor(t){this.editor=t,this.editing=this.editor.editing}handle(t,e){if(function(t){if(0==t.length)return!1;for(const e of t)if("children"===e.type&&!_d(e))return!0;return!1}(t))this._handleContainerChildrenMutations(t,e);else for(const n of t)this._handleTextMutation(n,e),this._handleTextNodeInsertion(n)}_handleContainerChildrenMutations(t,e){const n=function(t){const e=t.map(t=>t.node).reduce((t,e)=>t.getCommonAncestor(e,{includeSelf:!0}));if(!e)return;return e.getAncestors({includeSelf:!0,parentFirst:!0}).find(t=>t.is("containerElement")||t.is("rootElement"))}(t);if(!n)return;const i=this.editor.editing.view.domConverter.mapViewToDom(n),o=new ir(this.editor.editing.view.document),r=this.editor.data.toModel(o.domToView(i)).getChild(0),s=this.editor.editing.mapper.toModelElement(n);if(!s)return;const a=Array.from(r.getChildren()),c=Array.from(s.getChildren()),l=a[a.length-1],d=c[c.length-1];l&&l.is("softBreak")&&d&&!d.is("softBreak")&&a.pop();const u=this.editor.model.schema;if(!xd(a,u)||!xd(c,u))return;const h=a.map(t=>t.is("text")?t.data:"@").join("").replace(/\u00A0/g," "),f=c.map(t=>t.is("text")?t.data:"@").join("").replace(/\u00A0/g," ");if(f===h)return;const m=Wo(f,h),{firstChangeAt:g,insertions:p,deletions:b}=Ad(m);let w=null;e&&(w=this.editing.mapper.toModelRange(e.getFirstRange()));const k=h.substr(g,p),_=this.editor.model.createRange(this.editor.model.createPositionAt(s,g),this.editor.model.createPositionAt(s,g+b));this.editor.execute("input",{text:k,range:_,resultRange:w})}_handleTextMutation(t,e){if("text"!=t.type)return;const n=t.newText.replace(/\u00A0/g," "),i=t.oldText.replace(/\u00A0/g," ");if(i===n)return;const o=Wo(i,n),{firstChangeAt:r,insertions:s,deletions:a}=Ad(o);let c=null;e&&(c=this.editing.mapper.toModelRange(e.getFirstRange()));const l=this.editing.view.createPositionAt(t.node,r),d=this.editing.mapper.toModelPosition(l),u=this.editor.model.createRange(d,d.getShiftedBy(a)),h=n.substr(r,s);this.editor.execute("input",{text:h,range:u,resultRange:c})}_handleTextNodeInsertion(t){if("children"!=t.type)return;const e=_d(t),n=this.editing.view.createPositionAt(t.node,e.index),i=this.editing.mapper.toModelPosition(n),o=e.values[0].data;this.editor.execute("input",{text:o.replace(/\u00A0/g," "),range:this.editor.model.createRange(i)})}}function xd(t,e){return t.every(t=>e.isInline(t))}function Ad(t){let e=null,n=null;for(let i=0;i<t.length;i++){"equal"!=t[i]&&(e=null===e?i:e,n=i)}let i=0,o=0;for(let r=e;r<=n;r++)"insert"!=t[r]&&i++,"delete"!=t[r]&&o++;return{insertions:o,deletions:i,firstChangeAt:e}}class Td extends $l{static get pluginName(){return"Input"}init(){const t=this.editor,e=new bd(t,t.config.get("typing.undoStep")||20);t.commands.add("input",e),wd(t),function(t){t.editing.view.document.on("mutations",(e,n,i)=>{new yd(t).handle(n,i)})}(t)}isInput(t){return this.editor.commands.get("input")._batches.has(t)}}class Cd extends td{constructor(t,e){super(t),this.direction=e,this._buffer=new pd(t.model,t.config.get("typing.undoStep"))}get buffer(){return this._buffer}execute(t={}){const e=this.editor.model,n=e.document;e.enqueueChange(this._buffer.batch,i=>{this._buffer.lock();const o=i.createSelection(t.selection||n.selection),r=o.isCollapsed;if(o.isCollapsed&&e.modifySelection(o,{direction:this.direction,unit:t.unit}),this._shouldEntireContentBeReplacedWithParagraph(t.sequence||1))return void this._replaceEntireContentWithParagraph(i);if(o.isCollapsed)return;let s=0;o.getFirstRange().getMinimalFlatRanges().forEach(t=>{s+=eo(t.getWalker({singleCharacters:!0,ignoreElementEnd:!0,shallow:!0}))}),e.deleteContent(o,{doNotResetEntireContent:r,direction:this.direction}),this._buffer.input(s),i.setSelection(o),this._buffer.unlock()})}_shouldEntireContentBeReplacedWithParagraph(t){if(t>1)return!1;const e=this.editor.model,n=e.document.selection,i=e.schema.getLimitElement(n);if(!(n.isCollapsed&&n.containsEntireContent(i)))return!1;if(!e.schema.checkChild(i,"paragraph"))return!1;const o=i.getChild(0);return!o||"paragraph"!==o.name}_replaceEntireContentWithParagraph(t){const e=this.editor.model,n=e.document.selection,i=e.schema.getLimitElement(n),o=t.createElement("paragraph");t.remove(t.createRangeIn(i)),t.insert(o,i),t.setSelection(o,0)}}class Pd extends ur{constructor(t){super(t);const e=t.document;let n=0;function i(t,n,i){let o;e.once("delete",t=>o=t,{priority:Number.POSITIVE_INFINITY}),e.fire("delete",new Ir(e,n,i)),o&&o.stop.called&&t.stop()}e.on("keyup",(t,e)=>{e.keyCode!=go.delete&&e.keyCode!=go.backspace||(n=0)}),e.on("keydown",(t,e)=>{const o={};if(e.keyCode==go.delete)o.direction="forward",o.unit="character";else{if(e.keyCode!=go.backspace)return;o.direction="backward",o.unit="codePoint"}const r=ho.isMac?e.altKey:e.ctrlKey;o.unit=r?"word":o.unit,o.sequence=++n,i(t,e.domEvent,o)}),ho.isAndroid&&e.on("beforeinput",(e,n)=>{if("deleteContentBackward"!=n.domEvent.inputType)return;const o={unit:"codepoint",direction:"backward",sequence:1},r=n.domTarget.ownerDocument.defaultView.getSelection();r.anchorNode==r.focusNode&&r.anchorOffset+1!=r.focusOffset&&(o.selectionToRemove=t.domConverter.domSelectionToView(r)),i(e,n.domEvent,o)})}observe(){}}class Sd extends $l{static get pluginName(){return"Delete"}init(){const t=this.editor,e=t.editing.view,n=e.document;if(e.addObserver(Pd),t.commands.add("forwardDelete",new Cd(t,"forward")),t.commands.add("delete",new Cd(t,"backward")),this.listenTo(n,"delete",(n,i)=>{const o={unit:i.unit,sequence:i.sequence};if(i.selectionToRemove){const e=t.model.createSelection(),n=[];for(const e of i.selectionToRemove.getRanges())n.push(t.editing.mapper.toModelRange(e));e.setTo(n),o.selection=e}t.execute("forward"==i.direction?"forwardDelete":"delete",o),i.preventDefault(),e.scrollToTheSelection()}),ho.isAndroid){let t=null;this.listenTo(n,"delete",(e,n)=>{const i=n.domTarget.ownerDocument.defaultView.getSelection();t={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}},{priority:"lowest"}),this.listenTo(n,"keyup",(e,n)=>{if(t){const e=n.domTarget.ownerDocument.defaultView.getSelection();e.collapse(t.anchorNode,t.anchorOffset),e.extend(t.focusNode,t.focusOffset),t=null}})}}}class Md extends $l{static get requires(){return[Td,Sd]}static get pluginName(){return"Typing"}}const Ed=new Map;function Id(t,e,n){let i=Ed.get(t);i||(i=new Map,Ed.set(t,i)),i.set(e,n)}function Nd(t){return[t]}function Od(t,e,n={}){const i=function(t,e){const n=Ed.get(t);return n&&n.has(e)?n.get(e):Nd}(t.constructor,e.constructor);try{return i(t=t.clone(),e,n)}catch(t){throw t}}function Rd(t,e,n){t=t.slice(),e=e.slice();const i=new Dd(n.document,n.useRelations,n.forceWeakRemove);i.setOriginalOperations(t),i.setOriginalOperations(e);const o=i.originalOperations;if(0==t.length||0==e.length)return{operationsA:t,operationsB:e,originalOperations:o};const r=new WeakMap;for(const e of t)r.set(e,0);const s={nextBaseVersionA:t[t.length-1].baseVersion+1,nextBaseVersionB:e[e.length-1].baseVersion+1,originalOperationsACount:t.length,originalOperationsBCount:e.length};let a=0;for(;a<t.length;){const n=t[a],o=r.get(n);if(o==e.length){a++;continue}const s=e[o],c=Od(n,s,i.getContext(n,s,!0)),l=Od(s,n,i.getContext(s,n,!1));i.updateRelation(n,s),i.setOriginalOperations(c,n),i.setOriginalOperations(l,s);for(const t of c)r.set(t,o+l.length);t.splice(a,1,...c),e.splice(o,1,...l)}if(n.padWithNoOps){const n=t.length-s.originalOperationsACount,i=e.length-s.originalOperationsBCount;jd(t,i-n),jd(e,n-i)}return Ld(t,s.nextBaseVersionB),Ld(e,s.nextBaseVersionA),{operationsA:t,operationsB:e,originalOperations:o}}class Dd{constructor(t,e,n=!1){this.originalOperations=new Map,this._history=t.history,this._useRelations=e,this._forceWeakRemove=!!n,this._relations=new Map}setOriginalOperations(t,e=null){const n=e?this.originalOperations.get(e):null;for(const e of t)this.originalOperations.set(e,n||e)}updateRelation(t,e){switch(t.constructor){case Ra:switch(e.constructor){case za:t.targetPosition.isEqual(e.sourcePosition)||e.movedRange.containsPosition(t.targetPosition)?this._setRelation(t,e,"insertAtSource"):t.targetPosition.isEqual(e.deletionPosition)?this._setRelation(t,e,"insertBetween"):t.targetPosition.isAfter(e.sourcePosition)&&this._setRelation(t,e,"moveTargetAfter");break;case Ra:t.targetPosition.isEqual(e.sourcePosition)||t.targetPosition.isBefore(e.sourcePosition)?this._setRelation(t,e,"insertBefore"):this._setRelation(t,e,"insertAfter")}break;case Ba:switch(e.constructor){case za:t.splitPosition.isBefore(e.sourcePosition)&&this._setRelation(t,e,"splitBefore");break;case Ra:(t.splitPosition.isEqual(e.sourcePosition)||t.splitPosition.isBefore(e.sourcePosition))&&this._setRelation(t,e,"splitBefore")}break;case za:switch(e.constructor){case za:t.targetPosition.isEqual(e.sourcePosition)||this._setRelation(t,e,"mergeTargetNotMoved"),t.sourcePosition.isEqual(e.targetPosition)&&this._setRelation(t,e,"mergeSourceNotMoved"),t.sourcePosition.isEqual(e.sourcePosition)&&this._setRelation(t,e,"mergeSameElement");break;case Ba:t.sourcePosition.isEqual(e.splitPosition)&&this._setRelation(t,e,"splitAtSource")}break;case La:{const n=t.newRange;if(!n)return;switch(e.constructor){case Ra:{const i=xs._createFromPositionAndShift(e.sourcePosition,e.howMany),o=i.containsPosition(n.start)||i.start.isEqual(n.start),r=i.containsPosition(n.end)||i.end.isEqual(n.end);!o&&!r||i.containsRange(n)||this._setRelation(t,e,{side:o?"left":"right",path:o?n.start.path.slice():n.end.path.slice()});break}case za:{const i=n.start.isEqual(e.targetPosition),o=n.start.isEqual(e.deletionPosition),r=n.end.isEqual(e.deletionPosition),s=n.end.isEqual(e.sourcePosition);(i||o||r||s)&&this._setRelation(t,e,{wasInLeftElement:i,wasStartBeforeMergedElement:o,wasEndBeforeMergedElement:r,wasInRightElement:s});break}}break}}}getContext(t,e,n){return{aIsStrong:n,aWasUndone:this._wasUndone(t),bWasUndone:this._wasUndone(e),abRelation:this._useRelations?this._getRelation(t,e):null,baRelation:this._useRelations?this._getRelation(e,t):null,forceWeakRemove:this._forceWeakRemove}}_wasUndone(t){const e=this.originalOperations.get(t);return e.wasUndone||this._history.isUndoneOperation(e)}_getRelation(t,e){const n=this.originalOperations.get(e),i=this._history.getUndoneOperation(n);if(!i)return null;const o=this.originalOperations.get(t),r=this._relations.get(o);return r&&r.get(i)||null}_setRelation(t,e,n){const i=this.originalOperations.get(t),o=this.originalOperations.get(e);let r=this._relations.get(i);r||(r=new Map,this._relations.set(i,r)),r.set(o,n)}}function Ld(t,e){for(const n of t)n.baseVersion=e++}function jd(t,e){for(let n=0;n<e;n++)t.push(new rc(0))}function Vd(t,e,n){const i=t.nodes.getNode(0).getAttribute(e);if(i==n)return null;const o=new xs(t.position,t.position.getShiftedBy(t.howMany));return new Na(o,e,i,n,0)}function zd(t,e){return null===t.targetPosition._getTransformedByDeletion(e.sourcePosition,e.howMany)}function Bd(t,e){const n=[];for(let i=0;i<t.length;i++){const o=t[i],r=new Ra(o.start,o.end.offset-o.start.offset,e,0);n.push(r);for(let e=i+1;e<t.length;e++)t[e]=t[e]._getTransformedByMove(r.sourcePosition,r.targetPosition,r.howMany)[0];e=e._getTransformedByMove(r.sourcePosition,r.targetPosition,r.howMany)}return n}Id(Na,Na,(t,e,n)=>{if(t.key===e.key&&t.range.start.hasSameParentAs(e.range.start)){const i=t.range.getDifference(e.range).map(e=>new Na(e,t.key,t.oldValue,t.newValue,0)),o=t.range.getIntersection(e.range);return o&&n.aIsStrong&&i.push(new Na(o,e.key,e.newValue,t.newValue,0)),0==i.length?[new rc(0)]:i}return[t]}),Id(Na,Da,(t,e)=>{if(t.range.start.hasSameParentAs(e.position)&&t.range.containsPosition(e.position)){const n=t.range._getTransformedByInsertion(e.position,e.howMany,!e.shouldReceiveAttributes).map(e=>new Na(e,t.key,t.oldValue,t.newValue,t.baseVersion));if(e.shouldReceiveAttributes){const i=Vd(e,t.key,t.oldValue);i&&n.unshift(i)}return n}return t.range=t.range._getTransformedByInsertion(e.position,e.howMany,!1)[0],[t]}),Id(Na,za,(t,e)=>{const n=[];t.range.start.hasSameParentAs(e.deletionPosition)&&(t.range.containsPosition(e.deletionPosition)||t.range.start.isEqual(e.deletionPosition))&&n.push(xs._createFromPositionAndShift(e.graveyardPosition,1));const i=t.range._getTransformedByMergeOperation(e);return i.isCollapsed||n.push(i),n.map(e=>new Na(e,t.key,t.oldValue,t.newValue,t.baseVersion))}),Id(Na,Ra,(t,e)=>function(t,e){const n=xs._createFromPositionAndShift(e.sourcePosition,e.howMany);let i=null,o=[];n.containsRange(t,!0)?i=t:t.start.hasSameParentAs(n.start)?(o=t.getDifference(n),i=t.getIntersection(n)):o=[t];const r=[];for(let t of o){t=t._getTransformedByDeletion(e.sourcePosition,e.howMany);const n=e.getMovedRangeStart(),i=t.start.hasSameParentAs(n);t=t._getTransformedByInsertion(n,e.howMany,i),r.push(...t)}i&&r.push(i._getTransformedByMove(e.sourcePosition,e.targetPosition,e.howMany,!1)[0]);return r}(t.range,e).map(e=>new Na(e,t.key,t.oldValue,t.newValue,t.baseVersion))),Id(Na,Ba,(t,e)=>{if(t.range.end.isEqual(e.insertionPosition))return e.graveyardPosition||t.range.end.offset++,[t];if(t.range.start.hasSameParentAs(e.splitPosition)&&t.range.containsPosition(e.splitPosition)){const n=t.clone();return n.range=new xs(e.moveTargetPosition.clone(),t.range.end._getCombined(e.splitPosition,e.moveTargetPosition)),t.range.end=e.splitPosition.clone(),t.range.end.stickiness="toPrevious",[t,n]}return t.range=t.range._getTransformedBySplitOperation(e),[t]}),Id(Da,Na,(t,e)=>{const n=[t];if(t.shouldReceiveAttributes&&t.position.hasSameParentAs(e.range.start)&&e.range.containsPosition(t.position)){const i=Vd(t,e.key,e.newValue);i&&n.push(i)}return n}),Id(Da,Da,(t,e,n)=>(t.position.isEqual(e.position)&&n.aIsStrong||(t.position=t.position._getTransformedByInsertOperation(e)),[t])),Id(Da,Ra,(t,e)=>(t.position=t.position._getTransformedByMoveOperation(e),[t])),Id(Da,Ba,(t,e)=>(t.position=t.position._getTransformedBySplitOperation(e),[t])),Id(Da,za,(t,e)=>(t.position=t.position._getTransformedByMergeOperation(e),[t])),Id(La,Da,(t,e)=>(t.oldRange&&(t.oldRange=t.oldRange._getTransformedByInsertOperation(e)[0]),t.newRange&&(t.newRange=t.newRange._getTransformedByInsertOperation(e)[0]),[t])),Id(La,La,(t,e,n)=>{if(t.name==e.name){if(!n.aIsStrong)return[new rc(0)];t.oldRange=e.newRange?e.newRange.clone():null}return[t]}),Id(La,za,(t,e)=>(t.oldRange&&(t.oldRange=t.oldRange._getTransformedByMergeOperation(e)),t.newRange&&(t.newRange=t.newRange._getTransformedByMergeOperation(e)),[t])),Id(La,Ra,(t,e,n)=>{if(t.oldRange&&(t.oldRange=xs._createFromRanges(t.oldRange._getTransformedByMoveOperation(e))),t.newRange){if(n.abRelation){const i=xs._createFromRanges(t.newRange._getTransformedByMoveOperation(e));if("left"==n.abRelation.side&&e.targetPosition.isEqual(t.newRange.start))return t.newRange.start.path=n.abRelation.path,t.newRange.end=i.end,[t];if("right"==n.abRelation.side&&e.targetPosition.isEqual(t.newRange.end))return t.newRange.start=i.start,t.newRange.end.path=n.abRelation.path,[t]}t.newRange=xs._createFromRanges(t.newRange._getTransformedByMoveOperation(e))}return[t]}),Id(La,Ba,(t,e,n)=>{if(t.oldRange&&(t.oldRange=t.oldRange._getTransformedBySplitOperation(e)),t.newRange){if(n.abRelation){const i=t.newRange._getTransformedBySplitOperation(e);return t.newRange.start.isEqual(e.splitPosition)&&n.abRelation.wasStartBeforeMergedElement?t.newRange.start=ks._createAt(e.insertionPosition):t.newRange.start.isEqual(e.splitPosition)&&!n.abRelation.wasInLeftElement&&(t.newRange.start=ks._createAt(e.moveTargetPosition)),t.newRange.end.isEqual(e.splitPosition)&&n.abRelation.wasInRightElement?t.newRange.end=ks._createAt(e.moveTargetPosition):t.newRange.end.isEqual(e.splitPosition)&&n.abRelation.wasEndBeforeMergedElement?t.newRange.end=ks._createAt(e.insertionPosition):t.newRange.end=i.end,[t]}t.newRange=t.newRange._getTransformedBySplitOperation(e)}return[t]}),Id(za,Da,(t,e)=>(t.sourcePosition.hasSameParentAs(e.position)&&(t.howMany+=e.howMany),t.sourcePosition=t.sourcePosition._getTransformedByInsertOperation(e),t.targetPosition=t.targetPosition._getTransformedByInsertOperation(e),[t])),Id(za,za,(t,e,n)=>{if(t.sourcePosition.isEqual(e.sourcePosition)&&t.targetPosition.isEqual(e.targetPosition)){if(n.bWasUndone){const n=e.graveyardPosition.path.slice();return n.push(0),t.sourcePosition=new ks(e.graveyardPosition.root,n),t.howMany=0,[t]}return[new rc(0)]}if(t.sourcePosition.isEqual(e.sourcePosition)&&!t.targetPosition.isEqual(e.targetPosition)&&!n.bWasUndone&&"splitAtSource"!=n.abRelation){const i="$graveyard"==t.targetPosition.root.rootName,o="$graveyard"==e.targetPosition.root.rootName,r=i&&!o;if(o&&!i||!r&&n.aIsStrong){const n=e.targetPosition._getTransformedByMergeOperation(e),i=t.targetPosition._getTransformedByMergeOperation(e);return[new Ra(n,t.howMany,i,0)]}return[new rc(0)]}return t.sourcePosition.hasSameParentAs(e.targetPosition)&&(t.howMany+=e.howMany),t.sourcePosition=t.sourcePosition._getTransformedByMergeOperation(e),t.targetPosition=t.targetPosition._getTransformedByMergeOperation(e),t.graveyardPosition.isEqual(e.graveyardPosition)&&n.aIsStrong||(t.graveyardPosition=t.graveyardPosition._getTransformedByMergeOperation(e)),[t]}),Id(za,Ra,(t,e,n)=>{const i=xs._createFromPositionAndShift(e.sourcePosition,e.howMany);return"remove"==e.type&&!n.bWasUndone&&!n.forceWeakRemove&&t.deletionPosition.hasSameParentAs(e.sourcePosition)&&i.containsPosition(t.sourcePosition)?[new rc(0)]:(t.sourcePosition.hasSameParentAs(e.targetPosition)&&(t.howMany+=e.howMany),t.sourcePosition.hasSameParentAs(e.sourcePosition)&&(t.howMany-=e.howMany),t.sourcePosition=t.sourcePosition._getTransformedByMoveOperation(e),t.targetPosition=t.targetPosition._getTransformedByMoveOperation(e),t.graveyardPosition.isEqual(e.targetPosition)||(t.graveyardPosition=t.graveyardPosition._getTransformedByMoveOperation(e)),[t])}),Id(za,Ba,(t,e,n)=>{if(e.graveyardPosition&&(t.graveyardPosition=t.graveyardPosition._getTransformedByDeletion(e.graveyardPosition,1),t.deletionPosition.isEqual(e.graveyardPosition)&&(t.howMany=e.howMany)),t.targetPosition.isEqual(e.splitPosition)){const i=0!=e.howMany,o=e.graveyardPosition&&t.deletionPosition.isEqual(e.graveyardPosition);if(i||o||"mergeTargetNotMoved"==n.abRelation)return t.sourcePosition=t.sourcePosition._getTransformedBySplitOperation(e),[t]}if(t.sourcePosition.isEqual(e.splitPosition)){if("mergeSourceNotMoved"==n.abRelation)return t.howMany=0,t.targetPosition=t.targetPosition._getTransformedBySplitOperation(e),[t];if("mergeSameElement"==n.abRelation||t.sourcePosition.offset>0)return t.sourcePosition=e.moveTargetPosition.clone(),t.targetPosition=t.targetPosition._getTransformedBySplitOperation(e),[t]}return t.sourcePosition.hasSameParentAs(e.splitPosition)&&(t.howMany=e.splitPosition.offset),t.sourcePosition=t.sourcePosition._getTransformedBySplitOperation(e),t.targetPosition=t.targetPosition._getTransformedBySplitOperation(e),[t]}),Id(Ra,Da,(t,e)=>{const n=xs._createFromPositionAndShift(t.sourcePosition,t.howMany)._getTransformedByInsertOperation(e,!1)[0];return t.sourcePosition=n.start,t.howMany=n.end.offset-n.start.offset,t.targetPosition.isEqual(e.position)||(t.targetPosition=t.targetPosition._getTransformedByInsertOperation(e)),[t]}),Id(Ra,Ra,(t,e,n)=>{const i=xs._createFromPositionAndShift(t.sourcePosition,t.howMany),o=xs._createFromPositionAndShift(e.sourcePosition,e.howMany);let r,s=n.aIsStrong,a=!n.aIsStrong;if("insertBefore"==n.abRelation||"insertAfter"==n.baRelation?a=!0:"insertAfter"!=n.abRelation&&"insertBefore"!=n.baRelation||(a=!1),r=t.targetPosition.isEqual(e.targetPosition)&&a?t.targetPosition._getTransformedByDeletion(e.sourcePosition,e.howMany):t.targetPosition._getTransformedByMove(e.sourcePosition,e.targetPosition,e.howMany),zd(t,e)&&zd(e,t))return[e.getReversed()];if(i.containsPosition(e.targetPosition)&&i.containsRange(o,!0))return i.start=i.start._getTransformedByMove(e.sourcePosition,e.targetPosition,e.howMany),i.end=i.end._getTransformedByMove(e.sourcePosition,e.targetPosition,e.howMany),Bd([i],r);if(o.containsPosition(t.targetPosition)&&o.containsRange(i,!0))return i.start=i.start._getCombined(e.sourcePosition,e.getMovedRangeStart()),i.end=i.end._getCombined(e.sourcePosition,e.getMovedRangeStart()),Bd([i],r);const c=In(t.sourcePosition.getParentPath(),e.sourcePosition.getParentPath());if("prefix"==c||"extension"==c)return i.start=i.start._getTransformedByMove(e.sourcePosition,e.targetPosition,e.howMany),i.end=i.end._getTransformedByMove(e.sourcePosition,e.targetPosition,e.howMany),Bd([i],r);"remove"!=t.type||"remove"==e.type||n.aWasUndone||n.forceWeakRemove?"remove"==t.type||"remove"!=e.type||n.bWasUndone||n.forceWeakRemove||(s=!1):s=!0;const l=[],d=i.getDifference(o);for(const t of d){t.start=t.start._getTransformedByDeletion(e.sourcePosition,e.howMany),t.end=t.end._getTransformedByDeletion(e.sourcePosition,e.howMany);const n="same"==In(t.start.getParentPath(),e.getMovedRangeStart().getParentPath()),i=t._getTransformedByInsertion(e.getMovedRangeStart(),e.howMany,n);l.push(...i)}const u=i.getIntersection(o);return null!==u&&s&&(u.start=u.start._getCombined(e.sourcePosition,e.getMovedRangeStart()),u.end=u.end._getCombined(e.sourcePosition,e.getMovedRangeStart()),0===l.length?l.push(u):1==l.length?o.start.isBefore(i.start)||o.start.isEqual(i.start)?l.unshift(u):l.push(u):l.splice(1,0,u)),0===l.length?[new rc(t.baseVersion)]:Bd(l,r)}),Id(Ra,Ba,(t,e,n)=>{let i=t.targetPosition.clone();t.targetPosition.isEqual(e.insertionPosition)&&e.graveyardPosition&&"moveTargetAfter"!=n.abRelation||(i=t.targetPosition._getTransformedBySplitOperation(e));const o=xs._createFromPositionAndShift(t.sourcePosition,t.howMany);if(o.end.isEqual(e.insertionPosition))return e.graveyardPosition||t.howMany++,t.targetPosition=i,[t];if(o.start.hasSameParentAs(e.splitPosition)&&o.containsPosition(e.splitPosition)){let t=new xs(e.splitPosition,o.end);return t=t._getTransformedBySplitOperation(e),Bd([new xs(o.start,e.splitPosition),t],i)}t.targetPosition.isEqual(e.splitPosition)&&"insertAtSource"==n.abRelation&&(i=e.moveTargetPosition),t.targetPosition.isEqual(e.insertionPosition)&&"insertBetween"==n.abRelation&&(i=t.targetPosition);const r=[o._getTransformedBySplitOperation(e)];if(e.graveyardPosition){const i=o.start.isEqual(e.graveyardPosition)||o.containsPosition(e.graveyardPosition);t.howMany>1&&i&&!n.aWasUndone&&r.push(xs._createFromPositionAndShift(e.insertionPosition,1))}return Bd(r,i)}),Id(Ra,za,(t,e,n)=>{const i=xs._createFromPositionAndShift(t.sourcePosition,t.howMany);if(e.deletionPosition.hasSameParentAs(t.sourcePosition)&&i.containsPosition(e.sourcePosition))if("remove"!=t.type||n.forceWeakRemove){if(1==t.howMany)return n.bWasUndone?(t.sourcePosition=e.graveyardPosition.clone(),t.targetPosition=t.targetPosition._getTransformedByMergeOperation(e),[t]):[new rc(0)]}else if(!n.aWasUndone){const n=[];let i=e.graveyardPosition.clone(),o=e.targetPosition._getTransformedByMergeOperation(e);t.howMany>1&&(n.push(new Ra(t.sourcePosition,t.howMany-1,t.targetPosition,0)),i=i._getTransformedByMove(t.sourcePosition,t.targetPosition,t.howMany-1),o=o._getTransformedByMove(t.sourcePosition,t.targetPosition,t.howMany-1));const r=e.deletionPosition._getCombined(t.sourcePosition,t.targetPosition),s=new Ra(i,1,r,0),a=s.getMovedRangeStart().path.slice();a.push(0);const c=new ks(s.targetPosition.root,a);o=o._getTransformedByMove(i,r,1);const l=new Ra(o,e.howMany,c,0);return n.push(s),n.push(l),n}const o=xs._createFromPositionAndShift(t.sourcePosition,t.howMany)._getTransformedByMergeOperation(e);return t.sourcePosition=o.start,t.howMany=o.end.offset-o.start.offset,t.targetPosition=t.targetPosition._getTransformedByMergeOperation(e),[t]}),Id(ja,Da,(t,e)=>(t.position=t.position._getTransformedByInsertOperation(e),[t])),Id(ja,za,(t,e)=>t.position.isEqual(e.deletionPosition)?(t.position=e.graveyardPosition.clone(),t.position.stickiness="toNext",[t]):(t.position=t.position._getTransformedByMergeOperation(e),[t])),Id(ja,Ra,(t,e)=>(t.position=t.position._getTransformedByMoveOperation(e),[t])),Id(ja,ja,(t,e,n)=>{if(t.position.isEqual(e.position)){if(!n.aIsStrong)return[new rc(0)];t.oldName=e.newName}return[t]}),Id(ja,Ba,(t,e)=>{if("same"==In(t.position.path,e.splitPosition.getParentPath())&&!e.graveyardPosition){const e=new ja(t.position.getShiftedBy(1),t.oldName,t.newName,0);return[t,e]}return t.position=t.position._getTransformedBySplitOperation(e),[t]}),Id(Va,Va,(t,e,n)=>{if(t.root===e.root&&t.key===e.key){if(!n.aIsStrong||t.newValue===e.newValue)return[new rc(0)];t.oldValue=e.newValue}return[t]}),Id(Ba,Da,(t,e)=>(t.splitPosition.hasSameParentAs(e.position)&&t.splitPosition.offset<e.position.offset&&(t.howMany+=e.howMany),t.splitPosition=t.splitPosition._getTransformedByInsertOperation(e),t.insertionPosition=Ba.getInsertionPosition(t.splitPosition),[t])),Id(Ba,za,(t,e,n)=>{if(!t.graveyardPosition&&!n.bWasUndone&&t.splitPosition.hasSameParentAs(e.sourcePosition)){const n=e.graveyardPosition.path.slice();n.push(0);const i=new ks(e.graveyardPosition.root,n),o=Ba.getInsertionPosition(new ks(e.graveyardPosition.root,n)),r=new Ba(i,0,null,0);return r.insertionPosition=o,t.splitPosition=t.splitPosition._getTransformedByMergeOperation(e),t.insertionPosition=Ba.getInsertionPosition(t.splitPosition),t.graveyardPosition=r.insertionPosition.clone(),t.graveyardPosition.stickiness="toNext",[r,t]}return t.splitPosition.hasSameParentAs(e.deletionPosition)&&!t.splitPosition.isAfter(e.deletionPosition)&&t.howMany--,t.splitPosition.hasSameParentAs(e.targetPosition)&&(t.howMany+=e.howMany),t.splitPosition=t.splitPosition._getTransformedByMergeOperation(e),t.insertionPosition=Ba.getInsertionPosition(t.splitPosition),t.graveyardPosition&&(t.graveyardPosition=t.graveyardPosition._getTransformedByMergeOperation(e)),[t]}),Id(Ba,Ra,(t,e,n)=>{const i=xs._createFromPositionAndShift(e.sourcePosition,e.howMany);if(t.graveyardPosition){const o=i.start.isEqual(t.graveyardPosition)||i.containsPosition(t.graveyardPosition);if(!n.bWasUndone&&o){const n=t.splitPosition._getTransformedByMoveOperation(e),i=t.graveyardPosition._getTransformedByMoveOperation(e),o=i.path.slice();o.push(0);const r=new ks(i.root,o);return[new Ra(n,t.howMany,r,0)]}t.graveyardPosition=t.graveyardPosition._getTransformedByMoveOperation(e)}if(t.splitPosition.hasSameParentAs(e.sourcePosition)&&i.containsPosition(t.splitPosition)){const n=e.howMany-(t.splitPosition.offset-e.sourcePosition.offset);return t.howMany-=n,t.splitPosition.hasSameParentAs(e.targetPosition)&&t.splitPosition.offset<e.targetPosition.offset&&(t.howMany+=e.howMany),t.splitPosition=e.sourcePosition.clone(),t.insertionPosition=Ba.getInsertionPosition(t.splitPosition),[t]}return!t.splitPosition.isEqual(e.targetPosition)||"insertAtSource"!=n.baRelation&&"splitBefore"!=n.abRelation?(e.sourcePosition.isEqual(e.targetPosition)||(t.splitPosition.hasSameParentAs(e.sourcePosition)&&t.splitPosition.offset<=e.sourcePosition.offset&&(t.howMany-=e.howMany),t.splitPosition.hasSameParentAs(e.targetPosition)&&t.splitPosition.offset<e.targetPosition.offset&&(t.howMany+=e.howMany)),t.splitPosition.stickiness="toNone",t.splitPosition=t.splitPosition._getTransformedByMoveOperation(e),t.splitPosition.stickiness="toNext",t.graveyardPosition?t.insertionPosition=t.insertionPosition._getTransformedByMoveOperation(e):t.insertionPosition=Ba.getInsertionPosition(t.splitPosition),[t]):(t.howMany+=e.howMany,t.splitPosition=t.splitPosition._getTransformedByDeletion(e.sourcePosition,e.howMany),t.insertionPosition=Ba.getInsertionPosition(t.splitPosition),[t])}),Id(Ba,Ba,(t,e,n)=>{if(t.splitPosition.isEqual(e.splitPosition)){if(!t.graveyardPosition&&!e.graveyardPosition)return[new rc(0)];if(t.graveyardPosition&&e.graveyardPosition&&t.graveyardPosition.isEqual(e.graveyardPosition))return[new rc(0)];if("splitBefore"==n.abRelation)return t.howMany=0,t.graveyardPosition=t.graveyardPosition._getTransformedBySplitOperation(e),[t]}if(t.graveyardPosition&&e.graveyardPosition&&t.graveyardPosition.isEqual(e.graveyardPosition)){const i="$graveyard"==t.splitPosition.root.rootName,o="$graveyard"==e.splitPosition.root.rootName,r=i&&!o;if(o&&!i||!r&&n.aIsStrong){const n=[];return e.howMany&&n.push(new Ra(e.moveTargetPosition,e.howMany,e.splitPosition,0)),t.howMany&&n.push(new Ra(t.splitPosition,t.howMany,t.moveTargetPosition,0)),n}return[new rc(0)]}if(t.graveyardPosition&&(t.graveyardPosition=t.graveyardPosition._getTransformedBySplitOperation(e)),t.splitPosition.isEqual(e.insertionPosition)&&"splitBefore"==n.abRelation)return t.howMany++,[t];if(e.splitPosition.isEqual(t.insertionPosition)&&"splitBefore"==n.baRelation){const n=e.insertionPosition.path.slice();n.push(0);const i=new ks(e.insertionPosition.root,n);return[t,new Ra(t.insertionPosition,1,i,0)]}return t.splitPosition.hasSameParentAs(e.splitPosition)&&t.splitPosition.offset<e.splitPosition.offset&&(t.howMany-=e.howMany),t.splitPosition=t.splitPosition._getTransformedBySplitOperation(e),t.insertionPosition=Ba.getInsertionPosition(t.splitPosition),[t]});class Fd extends td{constructor(t){super(t),this._stack=[],this._createdBatches=new WeakSet,this.refresh()}refresh(){this.isEnabled=this._stack.length>0}addBatch(t){const e=this.editor.model.document.selection,n={ranges:e.hasOwnRange?Array.from(e.getRanges()):[],isBackward:e.isBackward};this._stack.push({batch:t,selection:n}),this.refresh()}clearStack(){this._stack=[],this.refresh()}_restoreSelection(t,e,n){const i=this.editor.model,o=i.document,r=[];for(const e of t){const t=Ud(e,n).find(t=>t.start.root!=o.graveyard);t&&r.push(t)}r.length&&i.change(t=>{t.setSelection(r,{backward:e})})}_undo(t,e){const n=this.editor.model,i=n.document;this._createdBatches.add(e);const o=t.operations.slice().filter(t=>t.isDocumentOperation);o.reverse();for(const t of o){const o=t.baseVersion+1,r=Array.from(i.history.getOperations(o)),s=Rd([t.getReversed()],r,{useRelations:!0,document:this.editor.model.document,padWithNoOps:!1,forceWeakRemove:!0}).operationsA;for(const o of s)e.addOperation(o),n.applyOperation(o),i.history.setOperationAsUndone(t,o)}}}function Ud(t,e){const n=t.getTransformedByOperations(e);n.sort((t,e)=>t.start.isBefore(e.start)?-1:1);for(let t=1;t<n.length;t++){const e=n[t-1],i=n[t];e.end.isTouching(i.start)&&(e.end=i.end,n.splice(t,1),t--)}return n}class Hd extends Fd{execute(t=null){const e=t?this._stack.findIndex(e=>e.batch==t):this._stack.length-1,n=this._stack.splice(e,1)[0],i=this.editor.model.createBatch("transparent");this.editor.model.enqueueChange(i,()=>{this._undo(n.batch,i);const t=this.editor.model.document.history.getOperations(n.batch.baseVersion);this._restoreSelection(n.selection.ranges,n.selection.isBackward,t),this.fire("revert",n.batch,i)}),this.refresh()}}class qd extends Fd{execute(){const t=this._stack.pop(),e=this.editor.model.createBatch("transparent");this.editor.model.enqueueChange(e,()=>{const n=t.batch.operations[t.batch.operations.length-1].baseVersion+1,i=this.editor.model.document.history.getOperations(n);this._restoreSelection(t.selection.ranges,t.selection.isBackward,i),this._undo(t.batch,e)}),this.refresh()}}class Wd extends $l{static get pluginName(){return"UndoEditing"}constructor(t){super(t),this._batchRegistry=new WeakSet}init(){const t=this.editor;this._undoCommand=new Hd(t),this._redoCommand=new qd(t),t.commands.add("undo",this._undoCommand),t.commands.add("redo",this._redoCommand),this.listenTo(t.model,"applyOperation",(t,e)=>{const n=e[0];if(!n.isDocumentOperation)return;const i=n.batch,o=this._redoCommand._createdBatches.has(i),r=this._undoCommand._createdBatches.has(i);this._batchRegistry.has(i)||"transparent"==i.type&&!o&&!r||(o?this._undoCommand.addBatch(i):r||(this._undoCommand.addBatch(i),this._redoCommand.clearStack()),this._batchRegistry.add(i))},{priority:"highest"}),this.listenTo(this._undoCommand,"revert",(t,e,n)=>{this._redoCommand.addBatch(n)}),t.keystrokes.set("CTRL+Z","undo"),t.keystrokes.set("CTRL+Y","redo"),t.keystrokes.set("CTRL+SHIFT+Z","redo")}}var Yd='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.042 9.367l2.189 1.837a.75.75 0 0 1-.965 1.149l-3.788-3.18a.747.747 0 0 1-.21-.284.75.75 0 0 1 .17-.945L6.23 4.762a.75.75 0 1 1 .964 1.15L4.863 7.866h8.917A.75.75 0 0 1 14 7.9a4 4 0 1 1-1.477 7.718l.344-1.489a2.5 2.5 0 1 0 1.094-4.73l.008-.032H5.042z"/></svg>',Gd='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.958 9.367l-2.189 1.837a.75.75 0 0 0 .965 1.149l3.788-3.18a.747.747 0 0 0 .21-.284.75.75 0 0 0-.17-.945L13.77 4.762a.75.75 0 1 0-.964 1.15l2.331 1.955H6.22A.75.75 0 0 0 6 7.9a4 4 0 1 0 1.477 7.718l-.344-1.489A2.5 2.5 0 1 1 6.039 9.4l-.008-.032h8.927z"/></svg>';class $d extends $l{init(){const t=this.editor,e=t.locale,n=t.t,i="ltr"==e.uiLanguageDirection?Yd:Gd,o="ltr"==e.uiLanguageDirection?Gd:Yd;this._addButton("undo",n("Undo"),"CTRL+Z",i),this._addButton("redo",n("Redo"),"CTRL+Y",o)}_addButton(t,e,n,i){const o=this.editor;o.ui.componentFactory.add(t,r=>{const s=o.commands.get(t),a=new Nl(r);return a.set({label:e,icon:i,keystroke:n,tooltip:!0}),a.bind("isEnabled").to(s,"isEnabled"),this.listenTo(a,"execute",()=>{o.execute(t),o.editing.view.focus()}),a})}}class Qd extends $l{static get requires(){return[Wd,$d]}static get pluginName(){return"Undo"}}class Kd{constructor(t){this.context=t}destroy(){this.stopListening()}static get isContextPlugin(){return!0}}xn(Kd,Ui);class Jd extends Kd{static get pluginName(){return"PendingActions"}init(){this.set("hasAny",!1),this._actions=new An({idProperty:"_id"}),this._actions.delegate("add","remove").to(this)}add(t){if("string"!=typeof t)throw new hn.b("pendingactions-add-invalid-message: The message must be a string.",this);const e=Object.create(Ui);return e.set("message",t),this._actions.add(e),this.hasAny=!0,e}remove(t){this._actions.remove(t),this.hasAny=!!this._actions.length}get first(){return this._actions.get(0)}[Symbol.iterator](){return this._actions[Symbol.iterator]()}}class Zd{constructor(){const t=new window.FileReader;this._reader=t,this._data=void 0,this.set("loaded",0),t.onprogress=t=>{this.loaded=t.loaded}}get error(){return this._reader.error}get data(){return this._data}read(t){const e=this._reader;return this.total=t.size,new Promise((n,i)=>{e.onload=()=>{const t=e.result;this._data=t,n(t)},e.onerror=()=>{i("error")},e.onabort=()=>{i("aborted")},this._reader.readAsDataURL(t)})}abort(){this._reader.abort()}}xn(Zd,Ui);class Xd extends $l{static get pluginName(){return"FileRepository"}static get requires(){return[Jd]}init(){this.loaders=new An,this.loaders.on("add",()=>this._updatePendingAction()),this.loaders.on("remove",()=>this._updatePendingAction()),this._loadersMap=new Map,this._pendingAction=null,this.set("uploaded",0),this.set("uploadTotal",null),this.bind("uploadedPercent").to(this,"uploaded",this,"uploadTotal",(t,e)=>e?t/e*100:0)}getLoader(t){return this._loadersMap.get(t)||null}createLoader(t){if(!this.createUploadAdapter)return console.warn(Object(hn.a)("filerepository-no-upload-adapter: Upload adapter is not defined.")),null;const e=new tu(Promise.resolve(t),this.createUploadAdapter);return this.loaders.add(e),this._loadersMap.set(t,e),t instanceof Promise&&e.file.then(t=>{this._loadersMap.set(t,e)}).catch(()=>{}),e.on("change:uploaded",()=>{let t=0;for(const e of this.loaders)t+=e.uploaded;this.uploaded=t}),e.on("change:uploadTotal",()=>{let t=0;for(const e of this.loaders)e.uploadTotal&&(t+=e.uploadTotal);this.uploadTotal=t}),e}destroyLoader(t){const e=t instanceof tu?t:this.getLoader(t);e._destroy(),this.loaders.remove(e),this._loadersMap.forEach((t,n)=>{t===e&&this._loadersMap.delete(n)})}_updatePendingAction(){const t=this.editor.plugins.get(Jd);if(this.loaders.length){if(!this._pendingAction){const e=this.editor.t,n=t=>`${e("Upload in progress")} ${parseInt(t)}%.`;this._pendingAction=t.add(n(this.uploadedPercent)),this._pendingAction.bind("message").to(this,"uploadedPercent",n)}}else t.remove(this._pendingAction),this._pendingAction=null}}xn(Xd,Ui);class tu{constructor(t,e){this.id=dn(),this._filePromiseWrapper=this._createFilePromiseWrapper(t),this._adapter=e(this),this._reader=new Zd,this.set("status","idle"),this.set("uploaded",0),this.set("uploadTotal",null),this.bind("uploadedPercent").to(this,"uploaded",this,"uploadTotal",(t,e)=>e?t/e*100:0),this.set("uploadResponse",null)}get file(){return this._filePromiseWrapper?this._filePromiseWrapper.promise.then(t=>this._filePromiseWrapper?t:null):Promise.resolve(null)}get data(){return this._reader.data}read(){if("idle"!=this.status)throw new hn.b("filerepository-read-wrong-status: You cannot call read if the status is different than idle.",this);return this.status="reading",this.file.then(t=>this._reader.read(t)).then(t=>{if("reading"!==this.status)throw this.status;return this.status="idle",t}).catch(t=>{if("aborted"===t)throw this.status="aborted","aborted";throw this.status="error",this._reader.error?this._reader.error:t})}upload(){if("idle"!=this.status)throw new hn.b("filerepository-upload-wrong-status: You cannot call upload if the status is different than idle.",this);return this.status="uploading",this.file.then(()=>this._adapter.upload()).then(t=>(this.uploadResponse=t,this.status="idle",t)).catch(t=>{if("aborted"===this.status)throw"aborted";throw this.status="error",t})}abort(){const t=this.status;this.status="aborted",this._filePromiseWrapper.isFulfilled?"reading"==t?this._reader.abort():"uploading"==t&&this._adapter.abort&&this._adapter.abort():(this._filePromiseWrapper.promise.catch(()=>{}),this._filePromiseWrapper.rejecter("aborted")),this._destroy()}_destroy(){this._filePromiseWrapper=void 0,this._reader=void 0,this._adapter=void 0,this.uploadResponse=void 0}_createFilePromiseWrapper(t){const e={};return e.promise=new Promise((n,i)=>{e.rejecter=i,e.isFulfilled=!1,t.then(t=>{e.isFulfilled=!0,n(t)}).catch(t=>{e.isFulfilled=!0,i(t)})}),e}}xn(tu,Ui);function eu(){let t=function(t){t=t.toLowerCase();const e=document.cookie.split(";");for(const n of e){const e=n.split("=");if(decodeURIComponent(e[0].trim().toLowerCase())===t)return decodeURIComponent(e[1])}return null}("ckCsrfToken");var e,n;return t&&40==t.length||(t=function(t){let e="";const n=new Uint8Array(t);window.crypto.getRandomValues(n);for(let t=0;t<n.length;t++){const i="abcdefghijklmnopqrstuvwxyz0123456789".charAt(n[t]%"abcdefghijklmnopqrstuvwxyz0123456789".length);e+=Math.random()>.5?i.toUpperCase():i}return e}(40),e="ckCsrfToken",n=t,document.cookie=encodeURIComponent(e)+"="+encodeURIComponent(n)+";path=/"),t}class nu extends $l{static get requires(){return[Xd]}static get pluginName(){return"CKFinderUploadAdapter"}init(){const t=this.editor.config.get("ckfinder.uploadUrl");t&&(this.editor.plugins.get(Xd).createUploadAdapter=e=>new iu(e,t,this.editor.t))}}class iu{constructor(t,e,n){this.loader=t,this.url=e,this.t=n}upload(){return this.loader.file.then(t=>new Promise((e,n)=>{this._initRequest(),this._initListeners(e,n,t),this._sendRequest(t)}))}abort(){this.xhr&&this.xhr.abort()}_initRequest(){const t=this.xhr=new XMLHttpRequest;t.open("POST",this.url,!0),t.responseType="json"}_initListeners(t,e,n){const i=this.xhr,o=this.loader,r=(0,this.t)("Cannot upload file:")+` ${n.name}.`;i.addEventListener("error",()=>e(r)),i.addEventListener("abort",()=>e()),i.addEventListener("load",()=>{const n=i.response;if(!n||!n.uploaded)return e(n&&n.error&&n.error.message?n.error.message:r);t({default:n.url})}),i.upload&&i.upload.addEventListener("progress",t=>{t.lengthComputable&&(o.uploadTotal=t.total,o.uploaded=t.loaded)})}_sendRequest(t){const e=new FormData;e.append("upload",t),e.append("ckCsrfToken",eu()),this.xhr.send(e)}}class ou{static get pluginName(){return"BlockAutoformatEditing"}constructor(t,e,n){let i,o=null;"function"==typeof n?i=n:(o=t.commands.get(n),i=()=>{t.execute(n)}),t.model.document.on("change",(n,r)=>{if(o&&!o.isEnabled)return;if("transparent"==r.type)return;const s=Array.from(t.model.document.differ.getChanges()),a=s[0];if(1!=s.length||"insert"!==a.type||"$text"!=a.name||1!=a.length)return;const c=a.position.parent;if(!c.is("paragraph")||1!==c.childCount)return;const l=e.exec(c.getChild(0).data);l&&t.model.enqueueChange(t=>{const e=t.createPositionAt(c,0),n=t.createPositionAt(c,l[0].length),o=new Rs(e,n);!1!==i({match:l})&&t.remove(o),o.detach()})})}}function ru(t,e){let n=t.start;return{text:Array.from(t.getItems()).reduce((t,i)=>i.is("text")||i.is("textProxy")?t+i.data:(n=e.createPositionAfter(i),""),""),range:e.createRange(n,t.end)}}class su{static get pluginName(){return"InlineAutoformatEditing"}constructor(t,e,n){let i,o,r,s;e instanceof RegExp?i=e:r=e,"string"==typeof n?o=n:s=n,r=r||(t=>{let e;const n=[],o=[];for(;null!==(e=i.exec(t))&&!(e&&e.length<4);){let{index:t,1:i,2:r,3:s}=e;const a=i+r+s;t+=e[0].length-a.length;const c=[t,t+i.length],l=[t+i.length+r.length,t+i.length+r.length+s.length];n.push(c),n.push(l),o.push([t+i.length,t+i.length+r.length])}return{remove:n,format:o}}),s=s||((e,n)=>{const i=t.model.schema.getValidRanges(n,o);for(const t of i)e.setAttribute(o,!0,t);e.removeSelectionAttribute(o)}),t.model.document.on("change",(e,n)=>{if("transparent"==n.type)return;const i=t.model,o=i.document.selection;if(!o.isCollapsed)return;const a=Array.from(i.document.differ.getChanges()),c=a[0];if(1!=a.length||"insert"!==c.type||"$text"!=c.name||1!=c.length)return;const l=o.focus,d=l.parent,{text:u,range:h}=ru(i.createRange(i.createPositionAt(d,0),l),i),f=r(u),m=au(h.start,f.format,i),g=au(h.start,f.remove,i);m.length&&g.length&&i.enqueueChange(t=>{if(!1!==s(t,m))for(const e of g.reverse())t.remove(e)})})}}function au(t,e,n){return e.filter(t=>void 0!==t[0]&&void 0!==t[1]).map(e=>n.createRange(t.getShiftedBy(e[0]),t.getShiftedBy(e[1])))}function cu(t,e){return(n,i)=>{if(!t.commands.get(e).isEnabled)return!1;const o=t.model.schema.getValidRanges(i,e);for(const t of o)n.setAttribute(e,!0,t);n.removeSelectionAttribute(e)}}class lu extends td{constructor(t,e){super(t),this.attributeKey=e}refresh(){const t=this.editor.model,e=t.document;this.value=this._getValueFromFirstAllowedNode(),this.isEnabled=t.schema.checkAttributeInSelection(e.selection,this.attributeKey)}execute(t={}){const e=this.editor.model,n=e.document.selection,i=void 0===t.forceValue?!this.value:t.forceValue;e.change(t=>{if(n.isCollapsed)i?t.setSelectionAttribute(this.attributeKey,!0):t.removeSelectionAttribute(this.attributeKey);else{const o=e.schema.getValidRanges(n.getRanges(),this.attributeKey);for(const e of o)i?t.setAttribute(this.attributeKey,i,e):t.removeAttribute(this.attributeKey,e)}})}_getValueFromFirstAllowedNode(){const t=this.editor.model,e=t.schema,n=t.document.selection;if(n.isCollapsed)return n.hasAttribute(this.attributeKey);for(const t of n.getRanges())for(const n of t.getItems())if(e.checkAttribute(n,this.attributeKey))return n.hasAttribute(this.attributeKey);return!1}}class du extends $l{static get pluginName(){return"BoldEditing"}init(){const t=this.editor;t.model.schema.extend("$text",{allowAttributes:"bold"}),t.model.schema.setAttributeProperties("bold",{isFormatting:!0,copyOnEnter:!0}),t.conversion.attributeToElement({model:"bold",view:"strong",upcastAlso:["b",t=>{const e=t.getStyle("font-weight");return e?"bold"==e||Number(e)>=600?{name:!0,styles:["font-weight"]}:void 0:null}]}),t.commands.add("bold",new lu(t,"bold")),t.keystrokes.set("CTRL+B","bold")}}class uu extends $l{init(){const t=this.editor,e=t.t;t.ui.componentFactory.add("bold",n=>{const i=t.commands.get("bold"),o=new Nl(n);return o.set({label:e("Bold"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.187 17H5.773c-.637 0-1.092-.138-1.364-.415-.273-.277-.409-.718-.409-1.323V4.738c0-.617.14-1.062.419-1.332.279-.27.73-.406 1.354-.406h4.68c.69 0 1.288.041 1.793.124.506.083.96.242 1.36.478.341.197.644.447.906.75a3.262 3.262 0 0 1 .808 2.162c0 1.401-.722 2.426-2.167 3.075C15.05 10.175 16 11.315 16 13.01a3.756 3.756 0 0 1-2.296 3.504 6.1 6.1 0 0 1-1.517.377c-.571.073-1.238.11-2 .11zm-.217-6.217H7v4.087h3.069c1.977 0 2.965-.69 2.965-2.072 0-.707-.256-1.22-.768-1.537-.512-.319-1.277-.478-2.296-.478zM7 5.13v3.619h2.606c.729 0 1.292-.067 1.69-.2a1.6 1.6 0 0 0 .91-.765c.165-.267.247-.566.247-.897 0-.707-.26-1.176-.778-1.409-.519-.232-1.31-.348-2.375-.348H7z"/></svg>',keystroke:"CTRL+B",tooltip:!0,isToggleable:!0}),o.bind("isOn","isEnabled").to(i,"value","isEnabled"),this.listenTo(o,"execute",()=>{t.execute("bold"),t.editing.view.focus()}),o})}}class hu extends $l{static get pluginName(){return"ItalicEditing"}init(){const t=this.editor;t.model.schema.extend("$text",{allowAttributes:"italic"}),t.model.schema.setAttributeProperties("italic",{isFormatting:!0,copyOnEnter:!0}),t.conversion.attributeToElement({model:"italic",view:"i",upcastAlso:["em",{styles:{"font-style":"italic"}}]}),t.commands.add("italic",new lu(t,"italic")),t.keystrokes.set("CTRL+I","italic")}}class fu extends $l{init(){const t=this.editor,e=t.t;t.ui.componentFactory.add("italic",n=>{const i=t.commands.get("italic"),o=new Nl(n);return o.set({label:e("Italic"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.586 14.633l.021.004c-.036.335.095.655.393.962.082.083.173.15.274.201h1.474a.6.6 0 1 1 0 1.2H5.304a.6.6 0 0 1 0-1.2h1.15c.474-.07.809-.182 1.005-.334.157-.122.291-.32.404-.597l2.416-9.55a1.053 1.053 0 0 0-.281-.823 1.12 1.12 0 0 0-.442-.296H8.15a.6.6 0 0 1 0-1.2h6.443a.6.6 0 1 1 0 1.2h-1.195c-.376.056-.65.155-.823.296-.215.175-.423.439-.623.79l-2.366 9.347z"/></svg>',keystroke:"CTRL+I",tooltip:!0,isToggleable:!0}),o.bind("isOn","isEnabled").to(i,"value","isEnabled"),this.listenTo(o,"execute",()=>{t.execute("italic"),t.editing.view.focus()}),o})}}function mu(t){const e=t.next();return e.done?null:e.value}class gu extends td{refresh(){this.value=this._getValue(),this.isEnabled=this._checkEnabled()}execute(t={}){const e=this.editor.model,n=e.schema,i=e.document.selection,o=Array.from(i.getSelectedBlocks()),r=void 0===t.forceValue?!this.value:t.forceValue;e.change(t=>{if(r){const e=o.filter(t=>pu(t)||wu(n,t));this._applyQuote(t,e)}else this._removeQuote(t,o.filter(pu))})}_getValue(){const t=mu(this.editor.model.document.selection.getSelectedBlocks());return!(!t||!pu(t))}_checkEnabled(){if(this.value)return!0;const t=this.editor.model.document.selection,e=this.editor.model.schema,n=mu(t.getSelectedBlocks());return!!n&&wu(e,n)}_removeQuote(t,e){bu(t,e).reverse().forEach(e=>{if(e.start.isAtStart&&e.end.isAtEnd)return void t.unwrap(e.start.parent);if(e.start.isAtStart){const n=t.createPositionBefore(e.start.parent);return void t.move(e,n)}e.end.isAtEnd||t.split(e.end);const n=t.createPositionAfter(e.end.parent);t.move(e,n)})}_applyQuote(t,e){const n=[];bu(t,e).reverse().forEach(e=>{let i=pu(e.start);i||(i=t.createElement("blockQuote"),t.wrap(e,i)),n.push(i)}),n.reverse().reduce((e,n)=>e.nextSibling==n?(t.merge(t.createPositionAfter(e)),e):n)}}function pu(t){return"blockQuote"==t.parent.name?t.parent:null}function bu(t,e){let n,i=0;const o=[];for(;i<e.length;){const r=e[i],s=e[i+1];n||(n=t.createPositionBefore(r)),s&&r.nextSibling==s||(o.push(t.createRange(n,t.createPositionAfter(r))),n=null),i++}return o}function wu(t,e){const n=t.checkChild(e.parent,"blockQuote"),i=t.checkChild(["$root","blockQuote"],e);return n&&i}class ku extends $l{static get pluginName(){return"BlockQuoteEditing"}init(){const t=this.editor,e=t.model.schema;t.commands.add("blockQuote",new gu(t)),e.register("blockQuote",{allowWhere:"$block",allowContentOf:"$root"}),e.addChildCheck((t,e)=>{if(t.endsWith("blockQuote")&&"blockQuote"==e.name)return!1}),t.conversion.elementToElement({model:"blockQuote",view:"blockquote"}),t.model.document.registerPostFixer(n=>{const i=t.model.document.differ.getChanges();for(const t of i)if("insert"==t.type){const i=t.position.nodeAfter;if(!i)continue;if(i.is("blockQuote")&&i.isEmpty)return n.remove(i),!0;if(i.is("blockQuote")&&!e.checkChild(t.position,i))return n.unwrap(i),!0;if(i.is("element")){const t=n.createRangeIn(i);for(const i of t.getItems())if(i.is("blockQuote")&&!e.checkChild(n.createPositionBefore(i),i))return n.unwrap(i),!0}}else if("remove"==t.type){const e=t.position.parent;if(e.is("blockQuote")&&e.isEmpty)return n.remove(e),!0}return!1})}afterInit(){const t=this.editor.commands.get("blockQuote");this.listenTo(this.editor.editing.view.document,"enter",(e,n)=>{const i=this.editor.model.document,o=i.selection.getLastPosition().parent;i.selection.isCollapsed&&o.isEmpty&&t.value&&(this.editor.execute("blockQuote"),this.editor.editing.view.scrollToTheSelection(),n.preventDefault(),e.stop())})}}n(43);class _u extends $l{init(){const t=this.editor,e=t.t;t.ui.componentFactory.add("blockQuote",n=>{const i=t.commands.get("blockQuote"),o=new Nl(n);return o.set({label:e("Block quote"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 10.423a6.5 6.5 0 0 1 6.056-6.408l.038.67C6.448 5.423 5.354 7.663 5.22 10H9c.552 0 .5.432.5.986v4.511c0 .554-.448.503-1 .503h-5c-.552 0-.5-.449-.5-1.003v-4.574zm8 0a6.5 6.5 0 0 1 6.056-6.408l.038.67c-2.646.739-3.74 2.979-3.873 5.315H17c.552 0 .5.432.5.986v4.511c0 .554-.448.503-1 .503h-5c-.552 0-.5-.449-.5-1.003v-4.574z"/></svg>',tooltip:!0,isToggleable:!0}),o.bind("isOn","isEnabled").to(i,"value","isEnabled"),this.listenTo(o,"execute",()=>{t.execute("blockQuote"),t.editing.view.focus()}),o})}}class vu extends $l{static get pluginName(){return"CKFinderUI"}init(){const t=this.editor,e=t.ui.componentFactory,n=t.t;e.add("ckfinder",e=>{const i=t.commands.get("ckfinder"),o=new Nl(e);return o.set({label:n("Insert image or file"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.627 16.5zm5.873-.196zm0-7.001V8h-13v8.5h4.341c.191.54.457 1.044.785 1.5H2a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 2 2h4.5a1.5 1.5 0 0 1 1.06.44L9.122 4H16a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 19 8v2.531a6.027 6.027 0 0 0-1.5-1.228zM16 6.5v-1H8.5l-2-2H2v13h1V8a1.5 1.5 0 0 1 1.5-1.5H16z"/><path d="M14.5 19.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM15 14v-2h-1v2h-2v1h2v2h1v-2h2v-1h-2z"/></svg>',tooltip:!0}),o.bind("isEnabled").to(i),o.on("execute",()=>{t.execute("ckfinder"),t.editing.view.focus()}),o})}}class yu extends ur{observe(t){this.listenTo(t,"load",(t,e)=>{"IMG"==e.target.tagName&&this._fireEvents(e)},{useCapture:!0})}_fireEvents(t){this.isEnabled&&(this.document.fire("layoutChanged"),this.document.fire("imageLoaded",t))}}class xu{constructor(){this._stack=[]}add(t,e){const n=this._stack,i=n[0];this._insertDescriptor(t);const o=n[0];i===o||Au(i,o)||this.fire("change:top",{oldDescriptor:i,newDescriptor:o,writer:e})}remove(t,e){const n=this._stack,i=n[0];this._removeDescriptor(t);const o=n[0];i===o||Au(i,o)||this.fire("change:top",{oldDescriptor:i,newDescriptor:o,writer:e})}_insertDescriptor(t){const e=this._stack,n=e.findIndex(e=>e.id===t.id);if(Au(t,e[n]))return;n>-1&&e.splice(n,1);let i=0;for(;e[i]&&Tu(e[i],t);)i++;e.splice(i,0,t)}_removeDescriptor(t){const e=this._stack,n=e.findIndex(e=>e.id===t);n>-1&&e.splice(n,1)}}function Au(t,e){return t&&e&&t.priority==e.priority&&Cu(t.classes)==Cu(e.classes)}function Tu(t,e){return t.priority>e.priority||!(t.priority<e.priority)&&Cu(t.classes)>Cu(e.classes)}function Cu(t){return Array.isArray(t)?t.sort().join(","):t}xn(xu,gn);function Pu(t){return!!t.is("element")&&!!t.getCustomProperty("widget")}function Su(t,e,n={}){return e.setAttribute("contenteditable","false",t),e.addClass("ck-widget",t),e.setCustomProperty("widget",!0,t),t.getFillerOffset=Nu,n.label&&function(t,e,n){n.setCustomProperty("widgetLabel",e,t)}(t,n.label,e),n.hasSelectionHandle&&function(t,e){const n=e.createUIElement("div",{class:"ck ck-widget__selection-handle"},(function(t){const e=this.toDomElement(t),n=new El;return n.set("content",'<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4 0v1H1v3H0V.5A.5.5 0 0 1 .5 0H4zm8 0h3.5a.5.5 0 0 1 .5.5V4h-1V1h-3V0zM4 16H.5a.5.5 0 0 1-.5-.5V12h1v3h3v1zm8 0v-1h3v-3h1v3.5a.5.5 0 0 1-.5.5H12z"/><path fill-opacity=".256" d="M1 1h14v14H1z"/><g class="ck-icon__selected-indicator"><path d="M7 0h2v1H7V0zM0 7h1v2H0V7zm15 0h1v2h-1V7zm-8 8h2v1H7v-1z"/><path fill-opacity=".254" d="M1 1h14v14H1z"/></g></svg>'),n.render(),e.appendChild(n.element),e}));e.insert(e.createPositionAt(t,0),n),e.addClass(["ck-widget_with-selection-handle"],t)}(t,e),function(t,e,n,i){const o=new xu;o.on("change:top",(e,o)=>{o.oldDescriptor&&i(t,o.oldDescriptor,o.writer),o.newDescriptor&&n(t,o.newDescriptor,o.writer)}),e.setCustomProperty("addHighlight",(t,e,n)=>o.add(e,n),t),e.setCustomProperty("removeHighlight",(t,e,n)=>o.remove(e,n),t)}(t,e,(t,e,n)=>n.addClass(i(e.classes),t),(t,e,n)=>n.removeClass(i(e.classes),t)),t;function i(t){return Array.isArray(t)?t:[t]}}function Mu(t){const e=t.getCustomProperty("widgetLabel");return e?"function"==typeof e?e():e:""}function Eu(t,e){return e.addClass(["ck-editor__editable","ck-editor__nested-editable"],t),e.setAttribute("contenteditable",t.isReadOnly?"false":"true",t),t.on("change:isReadOnly",(n,i,o)=>{e.setAttribute("contenteditable",o?"false":"true",t)}),t.on("change:isFocused",(n,i,o)=>{o?e.addClass("ck-editor__nested-editable_focused",t):e.removeClass("ck-editor__nested-editable_focused",t)}),t}function Iu(t,e){const n=t.getSelectedElement();if(n&&e.schema.isBlock(n))return e.createPositionAfter(n);const i=t.getSelectedBlocks().next().value;if(i){if(i.isEmpty)return e.createPositionAt(i,0);const n=e.createPositionAfter(i);return t.focus.isTouching(n)?n:e.createPositionBefore(i)}return t.focus}function Nu(){return null}function Ou(t){const e=t.getSelectedElement();return e&&function(t){return!!t.getCustomProperty("image")&&Pu(t)}(e)?e:null}function Ru(t){return!!t&&t.is("image")}function Du(t,e,n={}){const i=t.createElement("image",n),o=Iu(e.document.selection,e);e.insertContent(i,o),i.parent&&t.setSelection(i,"on")}function Lu(t){const e=t.schema,n=t.document.selection;return function(t,e,n){const i=function(t,e){const n=Iu(t,e).parent;if(n.isEmpty&&!n.is("$root"))return n.parent;return n}(t,n);return e.checkChild(i,"image")}(n,e,t)&&!function(t,e){const n=t.getSelectedElement();return n&&e.isObject(n)}(n,e)&&function(t){return[...t.focus.getAncestors()].every(t=>!t.is("image"))}(n)}function ju(t){return Array.from(t.getChildren()).find(t=>t.is("img"))}function Vu(t){return n=>{n.on(`attribute:${t}:image`,e)};function e(t,e,n){if(!n.consumable.consume(e.item,t.name))return;const i=n.writer,o=ju(n.mapper.toViewElement(e.item));null!==e.attributeNewValue?i.setAttribute(e.attributeKey,e.attributeNewValue,o):i.removeAttribute(e.attributeKey,o)}}class zu extends td{refresh(){this.isEnabled=Lu(this.editor.model)}execute(t){const e=this.editor.model;e.change(n=>{const i=Array.isArray(t.source)?t.source:[t.source];for(const t of i)Du(n,e,{src:t})})}}class Bu extends $l{static get pluginName(){return"ImageEditing"}init(){const t=this.editor,e=t.model.schema,n=t.t,i=t.conversion;t.editing.view.addObserver(yu),e.register("image",{isObject:!0,isBlock:!0,allowWhere:"$block",allowAttributes:["alt","src","srcset"]}),i.for("dataDowncast").elementToElement({model:"image",view:(t,e)=>Fu(e)}),i.for("editingDowncast").elementToElement({model:"image",view:(t,e)=>{return i=Fu(e),o=e,r=n("image widget"),o.setCustomProperty("image",!0,i),Su(i,o,{label:function(){const t=ju(i).getAttribute("alt");return t?`${t} ${r}`:r}});var i,o,r}}),i.for("downcast").add(Vu("src")).add(Vu("alt")).add(function(){return e=>{e.on("attribute:srcset:image",t)};function t(t,e,n){if(!n.consumable.consume(e.item,t.name))return;const i=n.writer,o=ju(n.mapper.toViewElement(e.item));if(null===e.attributeNewValue){const t=e.attributeOldValue;t.data&&(i.removeAttribute("srcset",o),i.removeAttribute("sizes",o),t.width&&i.removeAttribute("width",o))}else{const t=e.attributeNewValue;t.data&&(i.setAttribute("srcset",t.data,o),i.setAttribute("sizes","100vw",o),t.width&&i.setAttribute("width",t.width,o))}}}()),i.for("upcast").elementToElement({view:{name:"img",attributes:{src:!0}},model:(t,e)=>e.createElement("image",{src:t.getAttribute("src")})}).attributeToAttribute({view:{name:"img",key:"alt"},model:"alt"}).attributeToAttribute({view:{name:"img",key:"srcset"},model:{key:"srcset",value:t=>{const e={data:t.getAttribute("srcset")};return t.hasAttribute("width")&&(e.width=t.getAttribute("width")),e}}}).add(function(){return e=>{e.on("element:figure",t)};function t(t,e,n){if(!n.consumable.test(e.viewItem,{name:!0,classes:"image"}))return;const i=ju(e.viewItem);if(!i||!i.hasAttribute("src")||!n.consumable.test(i,{name:!0}))return;const o=n.convertItem(i,e.modelCursor),r=mu(o.modelRange.getItems());r&&(n.convertChildren(e.viewItem,n.writer.createPositionAt(r,0)),e.modelRange=o.modelRange,e.modelCursor=o.modelCursor)}}()),t.commands.add("imageInsert",new zu(t))}}function Fu(t){const e=t.createEmptyElement("img"),n=t.createContainerElement("figure",{class:"image"});return t.insert(t.createPositionAt(n,0),e),n}function Uu(t,e,n){return n.createRange(Hu(t,e,!0,n),Hu(t,e,!1,n))}function Hu(t,e,n,i){let o=t.textNode||(n?t.nodeBefore:t.nodeAfter),r=null;for(;o&&o.getAttribute("linkHref")==e;)r=o,o=n?o.previousSibling:o.nextSibling;return r?i.createPositionAt(r,n?"before":"after"):t}class qu extends td{constructor(t){super(t),this.manualDecorators=new An}restoreManualDecoratorStates(){for(const t of this.manualDecorators)t.value=this._getDecoratorStateFromModel(t.id)}refresh(){const t=this.editor.model,e=t.document;this.value=e.selection.getAttribute("linkHref");for(const t of this.manualDecorators)t.value=this._getDecoratorStateFromModel(t.id);this.isEnabled=t.schema.checkAttributeInSelection(e.selection,"linkHref")}execute(t,e={}){const n=this.editor.model,i=n.document.selection,o=[],r=[];for(const t in e)e[t]?o.push(t):r.push(t);n.change(e=>{if(i.isCollapsed){const s=i.getFirstPosition();if(i.hasAttribute("linkHref")){const a=Uu(s,i.getAttribute("linkHref"),n);e.setAttribute("linkHref",t,a),o.forEach(t=>{e.setAttribute(t,!0,a)}),r.forEach(t=>{e.removeAttribute(t,a)}),e.setSelection(a)}else if(""!==t){const r=Ln(i.getAttributes());r.set("linkHref",t),o.forEach(t=>{r.set(t,!0)});const a=e.createText(t,r);n.insertContent(a,s),e.setSelection(e.createRangeOn(a))}}else{const s=n.schema.getValidRanges(i.getRanges(),"linkHref");for(const n of s)e.setAttribute("linkHref",t,n),o.forEach(t=>{e.setAttribute(t,!0,n)}),r.forEach(t=>{e.removeAttribute(t,n)})}})}_getDecoratorStateFromModel(t){return this.editor.model.document.selection.getAttribute(t)}}class Wu extends td{refresh(){this.isEnabled=this.editor.model.document.selection.hasAttribute("linkHref")}execute(){const t=this.editor,e=this.editor.model,n=e.document.selection,i=t.commands.get("link");e.change(t=>{const o=n.isCollapsed?[Uu(n.getFirstPosition(),n.getAttribute("linkHref"),e)]:n.getRanges();for(const e of o)if(t.removeAttribute("linkHref",e),i)for(const n of i.manualDecorators)t.removeAttribute(n.id,e)})}}var Yu=function(t,e,n){var i=t.length;return n=void 0===n?i:n,!e&&n>=i?t:ii(t,e,n)},Gu=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");var $u=function(t){return Gu.test(t)};var Qu=function(t){return t.split("")},Ku="[\\ud800-\\udfff]",Ju="[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",Zu="\\ud83c[\\udffb-\\udfff]",Xu="[^\\ud800-\\udfff]",th="(?:\\ud83c[\\udde6-\\uddff]){2}",eh="[\\ud800-\\udbff][\\udc00-\\udfff]",nh="(?:"+Ju+"|"+Zu+")"+"?",ih="[\\ufe0e\\ufe0f]?"+nh+("(?:\\u200d(?:"+[Xu,th,eh].join("|")+")[\\ufe0e\\ufe0f]?"+nh+")*"),oh="(?:"+[Xu+Ju+"?",Ju,th,eh,Ku].join("|")+")",rh=RegExp(Zu+"(?="+Zu+")|"+oh+ih,"g");var sh=function(t){return t.match(rh)||[]};var ah=function(t){return $u(t)?sh(t):Qu(t)};var ch=function(t){return function(e){e=Zn(e);var n=$u(e)?ah(e):void 0,i=n?n[0]:e.charAt(0),o=n?Yu(n,1).join(""):e.slice(1);return i[t]()+o}}("toUpperCase");const lh=/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g,dh=/^(?:(?:https?|ftps?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i;function uh(t,e){const n=e.createAttributeElement("a",{href:t},{priority:5});return e.setCustomProperty("link",!0,n),n}function hh(t){return function(t){return t.replace(lh,"").match(dh)}(t=String(t))?t:"#"}class fh{constructor(){this._definitions=new Set}get length(){return this._definitions.size}add(t){Array.isArray(t)?t.forEach(t=>this._definitions.add(t)):this._definitions.add(t)}getDispatcher(){return t=>{t.on("attribute:linkHref",(t,e,n)=>{if(!n.consumable.test(e.item,"attribute:linkHref"))return;const i=n.writer,o=i.document.selection;for(const t of this._definitions){const r=i.createAttributeElement("a",t.attributes,{priority:5});i.setCustomProperty("link",!0,r),t.callback(e.attributeNewValue)?e.item.is("selection")?i.wrap(o.getFirstRange(),r):i.wrap(n.mapper.toViewRange(e.range),r):i.unwrap(n.mapper.toViewRange(e.range),r)}},{priority:"high"})}}}class mh{constructor({id:t,label:e,attributes:n,defaultValue:i}){this.id=t,this.set("value"),this.defaultValue=i,this.label=e,this.attributes=n}}xn(mh,Ui);class gh{constructor(t,e,n){this.model=t,this.attribute=n,this._modelSelection=t.document.selection,this._overrideUid=null,this._isNextGravityRestorationSkipped=!1,e.listenTo(this._modelSelection,"change:range",(t,e)=>{this._isNextGravityRestorationSkipped?this._isNextGravityRestorationSkipped=!1:this._isGravityOverridden&&(!e.directChange&&ph(this._modelSelection.getFirstPosition(),n)||this._restoreGravity())})}handleForwardMovement(t,e){const n=this.attribute;if(!(this._isGravityOverridden||t.isAtStart&&this._hasSelectionAttribute))return kh(t,n)&&this._hasSelectionAttribute?(this._preventCaretMovement(e),this._removeSelectionAttribute(),!0):bh(t,n)||wh(t,n)&&this._hasSelectionAttribute?(this._preventCaretMovement(e),this._overrideGravity(),!0):void 0}handleBackwardMovement(t,e){const n=this.attribute;return this._isGravityOverridden?kh(t,n)&&this._hasSelectionAttribute?(this._preventCaretMovement(e),this._restoreGravity(),this._removeSelectionAttribute(),!0):(this._preventCaretMovement(e),this._restoreGravity(),t.isAtStart&&this._removeSelectionAttribute(),!0):kh(t,n)&&!this._hasSelectionAttribute?(this._preventCaretMovement(e),this._setSelectionAttributeFromTheNodeBefore(t),!0):t.isAtEnd&&wh(t,n)?this._hasSelectionAttribute?void(_h(t,n)&&(this._skipNextAutomaticGravityRestoration(),this._overrideGravity())):(this._preventCaretMovement(e),this._setSelectionAttributeFromTheNodeBefore(t),!0):t.isAtStart?this._hasSelectionAttribute?(this._removeSelectionAttribute(),this._preventCaretMovement(e),!0):void 0:void(_h(t,n)&&(this._skipNextAutomaticGravityRestoration(),this._overrideGravity()))}get _isGravityOverridden(){return!!this._overrideUid}get _hasSelectionAttribute(){return this._modelSelection.hasAttribute(this.attribute)}_overrideGravity(){this._overrideUid=this.model.change(t=>t.overrideSelectionGravity())}_restoreGravity(){this.model.change(t=>{t.restoreSelectionGravity(this._overrideUid),this._overrideUid=null})}_preventCaretMovement(t){t.preventDefault()}_removeSelectionAttribute(){this.model.change(t=>{t.removeSelectionAttribute(this.attribute)})}_setSelectionAttributeFromTheNodeBefore(t){const e=this.attribute;this.model.change(n=>{n.setSelectionAttribute(this.attribute,t.nodeBefore.getAttribute(e))})}_skipNextAutomaticGravityRestoration(){this._isNextGravityRestorationSkipped=!0}}function ph(t,e){return bh(t,e)||wh(t,e)}function bh(t,e){const{nodeBefore:n,nodeAfter:i}=t,o=!!n&&n.hasAttribute(e);return!!i&&i.hasAttribute(e)&&(!o||n.getAttribute(e)!==i.getAttribute(e))}function wh(t,e){const{nodeBefore:n,nodeAfter:i}=t,o=!!n&&n.hasAttribute(e),r=!!i&&i.hasAttribute(e);return o&&(!r||n.getAttribute(e)!==i.getAttribute(e))}function kh(t,e){const{nodeBefore:n,nodeAfter:i}=t,o=!!n&&n.hasAttribute(e);if(!!i&&i.hasAttribute(e)&&o)return i.getAttribute(e)!==n.getAttribute(e)}function _h(t,e){return ph(t.getShiftedBy(-1),e)}n(45);const vh=/^(https?:)?\/\//;class yh extends $l{static get pluginName(){return"LinkEditing"}constructor(t){super(t),t.config.define("link",{addTargetToExternalLinks:!1})}init(){const t=this.editor,e=t.locale;t.model.schema.extend("$text",{allowAttributes:"linkHref"}),t.conversion.for("dataDowncast").attributeToElement({model:"linkHref",view:uh}),t.conversion.for("editingDowncast").attributeToElement({model:"linkHref",view:(t,e)=>uh(hh(t),e)}),t.conversion.for("upcast").elementToAttribute({view:{name:"a",attributes:{href:!0}},model:{key:"linkHref",value:t=>t.getAttribute("href")}}),t.commands.add("link",new qu(t)),t.commands.add("unlink",new Wu(t));const n=function(t,e){const n={"Open in a new tab":t("Open in a new tab"),Downloadable:t("Downloadable")};return e.forEach(t=>(t.label&&n[t.label]&&(t.label=n[t.label]),t)),e}(t.t,function(t){const e=[];if(t)for(const[n,i]of Object.entries(t)){const t=Object.assign({},i,{id:"link"+ch(n)});e.push(t)}return e}(t.config.get("link.decorators")));this._enableAutomaticDecorators(n.filter(t=>"automatic"===t.mode)),this._enableManualDecorators(n.filter(t=>"manual"===t.mode)),function({view:t,model:e,emitter:n,attribute:i,locale:o}){const r=new gh(e,n,i),s=e.document.selection;n.listenTo(t.document,"keydown",(t,e)=>{if(!s.isCollapsed)return;if(e.shiftKey||e.altKey||e.ctrlKey)return;const n=e.keyCode==go.arrowright,i=e.keyCode==go.arrowleft;if(!n&&!i)return;const a=s.getFirstPosition(),c=o.contentLanguageDirection;let l;l="ltr"===c&&n||"rtl"===c&&i?r.handleForwardMovement(a,e):r.handleBackwardMovement(a,e),l&&t.stop()},{priority:un.get("high")+1})}({view:t.editing.view,model:t.model,emitter:this,attribute:"linkHref",locale:e}),this._setupLinkHighlight(),this._enableInsertContentSelectionAttributesFixer()}_enableAutomaticDecorators(t){const e=this.editor,n=new fh;e.config.get("link.addTargetToExternalLinks")&&n.add({id:"linkIsExternal",mode:"automatic",callback:t=>vh.test(t),attributes:{target:"_blank",rel:"noopener noreferrer"}}),n.add(t),n.length&&e.conversion.for("downcast").add(n.getDispatcher())}_enableManualDecorators(t){if(!t.length)return;const e=this.editor,n=e.commands.get("link").manualDecorators;t.forEach(t=>{e.model.schema.extend("$text",{allowAttributes:t.id}),n.add(new mh(t)),e.conversion.for("downcast").attributeToElement({model:t.id,view:(e,i)=>{if(e){const e=n.get(t.id).attributes,o=i.createAttributeElement("a",e,{priority:5});return i.setCustomProperty("link",!0,o),o}}}),e.conversion.for("upcast").elementToAttribute({view:{name:"a",attributes:n.get(t.id).attributes},model:{key:t.id}})})}_setupLinkHighlight(){const t=this.editor,e=t.editing.view,n=new Set;e.document.registerPostFixer(e=>{const i=t.model.document.selection;let o=!1;if(i.hasAttribute("linkHref")){const r=Uu(i.getFirstPosition(),i.getAttribute("linkHref"),t.model),s=t.editing.mapper.toViewRange(r);for(const t of s.getItems())t.is("a")&&!t.hasClass("ck-link_selected")&&(e.addClass("ck-link_selected",t),n.add(t),o=!0)}return o}),t.conversion.for("editingDowncast").add(t=>{function i(){e.change(t=>{for(const e of n.values())t.removeClass("ck-link_selected",e),n.delete(e)})}t.on("insert",i,{priority:"highest"}),t.on("remove",i,{priority:"highest"}),t.on("attribute",i,{priority:"highest"}),t.on("selection",i,{priority:"highest"})})}_enableInsertContentSelectionAttributesFixer(){const t=this.editor.model,e=t.document.selection;t.on("insertContent",()=>{const n=e.anchor.nodeBefore,i=e.anchor.nodeAfter;e.hasAttribute("linkHref")&&n&&n.hasAttribute("linkHref")&&(i&&i.hasAttribute("linkHref")||t.change(e=>{[...t.document.selection.getAttributeKeys()].filter(t=>t.startsWith("link")).forEach(t=>e.removeSelectionAttribute(t))}))},{priority:"low"})}}class xh extends Kd{static get pluginName(){return"Notification"}init(){this.on("show:warning",(t,e)=>{window.alert(e.message)},{priority:"lowest"})}showSuccess(t,e={}){this._showNotification({message:t,type:"success",namespace:e.namespace,title:e.title})}showInfo(t,e={}){this._showNotification({message:t,type:"info",namespace:e.namespace,title:e.title})}showWarning(t,e={}){this._showNotification({message:t,type:"warning",namespace:e.namespace,title:e.title})}_showNotification(t){const e="show:"+t.type+(t.namespace?":"+t.namespace:"");this.fire(e,{message:t.message,type:t.type,title:t.title||""})}}class Ah extends td{constructor(t){super(t),this.stopListening(this.editor.model.document,"change"),this.listenTo(this.editor.model.document,"change",()=>this.refresh(),{priority:"low"})}refresh(){const t=this.editor.commands.get("imageInsert"),e=this.editor.commands.get("link");this.isEnabled=t.isEnabled||e.isEnabled}execute(){const t=this.editor,e=this.editor.config.get("ckfinder.openerMethod")||"modal";if("popup"!=e&&"modal"!=e)throw new hn.b('ckfinder-unknown-openerMethod: The openerMethod config option must by "popup" or "modal".',t);const n=this.editor.config.get("ckfinder.options")||{};n.chooseFiles=!0;const i=n.onInit;n.language||(n.language=t.locale.uiLanguage),n.onInit=e=>{i&&i(e),e.on("files:choose",n=>{const i=n.data.files.toArray(),o=i.filter(t=>!t.isImage()),r=i.filter(t=>t.isImage());for(const e of o)t.execute("link",e.getUrl());const s=[];for(const t of r){const n=t.getUrl();s.push(n||e.request("file:getProxyUrl",{file:t}))}s.length&&Th(t,s)}),e.on("file:choose:resizedImage",e=>{const n=e.data.resizedUrl;if(n)Th(t,[n]);else{const e=t.plugins.get("Notification"),n=t.locale.t;e.showWarning(n("Could not obtain resized image URL."),{title:n("Selecting resized image failed"),namespace:"ckfinder"})}})},window.CKFinder[e](n)}}function Th(t,e){if(t.commands.get("imageInsert").isEnabled)t.execute("imageInsert",{source:e});else{const e=t.plugins.get("Notification"),n=t.locale.t;e.showWarning(n("Could not insert image at the current position."),{title:n("Inserting image failed"),namespace:"ckfinder"})}}class Ch extends $l{static get pluginName(){return"CKFinderEditing"}static get requires(){return[xh,Bu,yh]}init(){const t=this.editor;t.commands.add("ckfinder",new Ah(t))}}const Ph=/^data:(\S*?);base64,/;class Sh{constructor(t,e,n){if(!t)throw new hn.b("fileuploader-missing-file: File must be provided as the first argument",null);if(!e)throw new hn.b("fileuploader-missing-token: Token must be provided as the second argument.",null);if(!n)throw new hn.b("fileuploader-missing-api-address: Api address must be provided as the third argument.",null);this.file=function(t){if("string"!=typeof t)return!1;const e=t.match(Ph);return!(!e||!e.length)}(t)?function(t,e=512){try{const n=t.match(Ph)[1],i=atob(t.replace(Ph,"")),o=[];for(let t=0;t<i.length;t+=e){const n=i.slice(t,t+e),r=new Array(n.length);for(let t=0;t<n.length;t++)r[t]=n.charCodeAt(t);o.push(new Uint8Array(r))}return new Blob(o,{type:n})}catch(t){throw new hn.b("fileuploader-decoding-image-data-error: Problem with decoding Base64 image data.",null)}}(t):t,this._token=e,this._apiAddress=n}onProgress(t){return this.on("progress",(e,n)=>t(n)),this}onError(t){return this.once("error",(e,n)=>t(n)),this}abort(){this.xhr.abort()}send(){return this._prepareRequest(),this._attachXHRListeners(),this._sendRequest()}_prepareRequest(){const t=new XMLHttpRequest;t.open("POST",this._apiAddress),t.setRequestHeader("Authorization",this._token.value),t.responseType="json",this.xhr=t}_attachXHRListeners(){const t=this,e=this.xhr;function n(e){return()=>t.fire("error",e)}e.addEventListener("error",n("Network Error")),e.addEventListener("abort",n("Abort")),e.upload&&e.upload.addEventListener("progress",t=>{t.lengthComputable&&this.fire("progress",{total:t.total,uploaded:t.loaded})}),e.addEventListener("load",()=>{const t=e.status,n=e.response;if(t<200||t>299)return this.fire("error",n.message||n.error)})}_sendRequest(){const t=new FormData,e=this.xhr;return t.append("file",this.file),new Promise((n,i)=>{e.addEventListener("load",()=>{const t=e.status,o=e.response;return t<200||t>299?o.message?i(new hn.b("fileuploader-uploading-data-failed: Uploading file failed.",this,{message:o.message})):i(o.error):n(o)}),e.addEventListener("error",()=>i(new Error("Network Error"))),e.addEventListener("abort",()=>i(new Error("Abort"))),e.send(t)})}}xn(Sh,gn);const Mh={refreshInterval:36e5,autoRefresh:!0};class Eh{constructor(t,e=Mh){if(!t)throw new hn.b("token-missing-token-url: A `tokenUrl` must be provided as the first constructor argument.",this);this.set("value",e.initValue),this._refresh="function"==typeof t?t:()=>{return e=t,new Promise((t,n)=>{const i=new XMLHttpRequest;i.open("GET",e),i.addEventListener("load",()=>{const e=i.status,o=i.response;return e<200||e>299?n(new hn.b("token-cannot-download-new-token: Cannot download new token from the provided url.",null)):t(o)}),i.addEventListener("error",()=>n(new Error("Network Error"))),i.addEventListener("abort",()=>n(new Error("Abort"))),i.send()});var e},this._options=Object.assign({},Mh,e)}init(){return new Promise((t,e)=>{this._options.autoRefresh&&this._startRefreshing(),this.value?t(this):this.refreshToken().then(t).catch(e)})}refreshToken(){return this._refresh().then(t=>this.set("value",t)).then(()=>this)}destroy(){this._stopRefreshing()}_startRefreshing(){this._refreshInterval=setInterval(()=>this.refreshToken(),this._options.refreshInterval)}_stopRefreshing(){clearInterval(this._refreshInterval)}static create(t,e=Mh){return new Eh(t,e).init()}}xn(Eh,Ui);var Ih=Eh;class Nh extends Kd{static get pluginName(){return"CloudServices"}init(){const t=this.context.config.get("cloudServices")||{};for(const e in t)this[e]=t[e];if(this.tokenUrl)return this.token=new Nh.Token(this.tokenUrl),this.token.init();this.token=null}}Nh.Token=Ih;class Oh extends $l{static get requires(){return[Xd,Nh]}init(){const t=this.editor,e=t.plugins.get(Nh),n=e.token,i=e.uploadUrl;n&&(this._uploadGateway=new Oh._UploadGateway(n,i),t.plugins.get(Xd).createUploadAdapter=t=>new Rh(this._uploadGateway,t))}}class Rh{constructor(t,e){this.uploadGateway=t,this.loader=e}upload(){return this.loader.file.then(t=>(this.fileUploader=this.uploadGateway.upload(t),this.fileUploader.on("progress",(t,e)=>{this.loader.uploadTotal=e.total,this.loader.uploaded=e.uploaded}),this.fileUploader.send()))}abort(){this.fileUploader.abort()}}Oh._UploadGateway=class{constructor(t,e){if(!t)throw new hn.b("uploadgateway-missing-token: Token must be provided.",null);if(!e)throw new hn.b("uploadgateway-missing-api-address: Api address must be provided.",null);this._token=t,this._apiAddress=e}upload(t){return new Sh(t,this._token,this._apiAddress)}};class Dh extends Nr{constructor(t){super(t),this.domEventType="mousedown"}onDomEvent(t){this.fire(t.type,t)}}n(47);class Lh extends $l{static get pluginName(){return"Widget"}init(){const t=this.editor.editing.view,e=t.document;this._previouslySelected=new Set,this.editor.editing.downcastDispatcher.on("selection",(t,e,n)=>{this._clearPreviouslySelectedWidgets(n.writer);const i=n.writer,o=i.document.selection,r=o.getSelectedElement();let s=null;for(const t of o.getRanges())for(const e of t){const t=e.item;Pu(t)&&!jh(t,s)&&(i.addClass("ck-widget_selected",t),this._previouslySelected.add(t),s=t,t==r&&i.setSelection(o.getRanges(),{fake:!0,label:Mu(r)}))}},{priority:"low"}),t.addObserver(Dh),this.listenTo(e,"mousedown",(...t)=>this._onMousedown(...t)),this.listenTo(e,"keydown",(...t)=>this._onKeydown(...t),{priority:"high"}),this.listenTo(e,"delete",(t,e)=>{this._handleDelete("forward"==e.direction)&&(e.preventDefault(),t.stop())},{priority:"high"})}_onMousedown(t,e){const n=this.editor,i=n.editing.view,o=i.document;let r=e.target;if(function(t){for(;t;){if(t.is("editableElement")&&!t.is("rootElement"))return!0;if(Pu(t))return!1;t=t.parent}return!1}(r)){if(ho.isSafari&&e.domEvent.detail>=3){const t=n.editing.mapper.toModelElement(r);this.editor.model.change(n=>{e.preventDefault(),n.setSelection(t,"in")})}return}if(!Pu(r)&&(r=r.findAncestor(Pu),!r))return;e.preventDefault(),o.isFocused||i.focus();const s=n.editing.mapper.toModelElement(r);this._setSelectionOverElement(s)}_onKeydown(t,e){const n=e.keyCode,i="ltr"===this.editor.locale.contentLanguageDirection,o=n==go.arrowdown||n==go[i?"arrowright":"arrowleft"];let r=!1;!function(t){return t==go.arrowright||t==go.arrowleft||t==go.arrowup||t==go.arrowdown}(n)?n===go.enter&&(r=this._handleEnterKey(e.shiftKey)):r=this._handleArrowKeys(o),r&&(e.preventDefault(),t.stop())}_handleDelete(t){if(this.editor.isReadOnly)return;const e=this.editor.model.document.selection;if(!e.isCollapsed)return;const n=this._getObjectElementNextToSelection(t);return n?(this.editor.model.change(t=>{let i=e.anchor.parent;for(;i.isEmpty;){const e=i;i=e.parent,t.remove(e)}this._setSelectionOverElement(n)}),!0):void 0}_handleArrowKeys(t){const e=this.editor.model,n=e.schema,i=e.document.selection,o=i.getSelectedElement();if(o&&n.isObject(o)){const o=t?i.getLastPosition():i.getFirstPosition(),r=n.getNearestSelectionRange(o,t?"forward":"backward");return r&&e.change(t=>{t.setSelection(r)}),!0}if(!i.isCollapsed)return;const r=this._getObjectElementNextToSelection(t);return r&&n.isObject(r)?(this._setSelectionOverElement(r),!0):void 0}_handleEnterKey(t){const e=this.editor.model,n=e.document.selection.getSelectedElement();if(i=n,o=e.schema,i&&o.isObject(i)&&!o.isInline(i))return e.change(i=>{let o=i.createPositionAt(n,t?"before":"after");const r=i.createElement("paragraph");if(e.schema.isBlock(n.parent)){const t=e.schema.findAllowedParent(o,r);o=i.split(o,t).position}i.insert(r,o),i.setSelection(r,"in")}),!0;var i,o}_setSelectionOverElement(t){this.editor.model.change(e=>{e.setSelection(e.createRangeOn(t))})}_getObjectElementNextToSelection(t){const e=this.editor.model,n=e.schema,i=e.document.selection,o=e.createSelection(i);e.modifySelection(o,{direction:t?"forward":"backward"});const r=t?o.focus.nodeBefore:o.focus.nodeAfter;return r&&n.isObject(r)?r:null}_clearPreviouslySelectedWidgets(t){for(const e of this._previouslySelected)t.removeClass("ck-widget_selected",e);this._previouslySelected.clear()}}function jh(t,e){return!!e&&Array.from(t.getAncestors()).includes(e)}class Vh extends td{refresh(){const t=this.editor.model.document.selection.getSelectedElement();this.isEnabled=Ru(t),Ru(t)&&t.hasAttribute("alt")?this.value=t.getAttribute("alt"):this.value=!1}execute(t){const e=this.editor.model,n=e.document.selection.getSelectedElement();e.change(e=>{e.setAttribute("alt",t.newValue,n)})}}class zh extends $l{static get pluginName(){return"ImageTextAlternativeEditing"}init(){this.editor.commands.add("imageTextAlternative",new Vh(this.editor))}}n(49);class Bh extends cl{constructor(t,e){super(t);const n="ck-labeled-field-view-"+dn(),i="ck-labeled-field-view-status-"+dn();this.fieldView=e(this,n,i),this.set("label"),this.set("isEnabled",!0),this.set("errorText",null),this.set("infoText",null),this.set("class"),this.labelView=this._createLabelView(n),this.statusView=this._createStatusView(i),this.bind("_statusText").to(this,"errorText",this,"infoText",(t,e)=>t||e);const o=this.bindTemplate;this.setTemplate({tag:"div",attributes:{class:["ck","ck-labeled-field-view",o.to("class"),o.if("isEnabled","ck-disabled",t=>!t)]},children:[this.labelView,this.fieldView,this.statusView]})}_createLabelView(t){const e=new hl(this.locale);return e.for=t,e.bind("text").to(this,"label"),e}_createStatusView(t){const e=new cl(this.locale),n=this.bindTemplate;return e.setTemplate({tag:"div",attributes:{class:["ck","ck-labeled-field-view__status",n.if("errorText","ck-labeled-field-view__status_error"),n.if("_statusText","ck-hidden",t=>!t)],id:t,role:n.if("errorText","alert")},children:[{text:n.to("_statusText")}]}),e}focus(){this.fieldView.focus()}}n(51);class Fh extends cl{constructor(t){super(t),this.set("value"),this.set("id"),this.set("placeholder"),this.set("isReadOnly",!1),this.set("hasError",!1),this.set("ariaDescribedById");const e=this.bindTemplate;this.setTemplate({tag:"input",attributes:{type:"text",class:["ck","ck-input","ck-input-text",e.if("hasError","ck-error")],id:e.to("id"),placeholder:e.to("placeholder"),readonly:e.to("isReadOnly"),"aria-invalid":e.if("hasError",!0),"aria-describedby":e.to("ariaDescribedById")},on:{input:e.to("input")}})}render(){super.render();const t=t=>{this.element.value=t||0===t?t:""};t(this.value),this.on("change:value",(e,n,i)=>{t(i)})}select(){this.element.select()}focus(){this.element.focus()}}function Uh(t,e,n){const i=new Fh(t.locale);return i.set({id:e,ariaDescribedById:n}),i.bind("isReadOnly").to(t,"isEnabled",t=>!t),i.bind("hasError").to(t,"errorText",t=>!!t),i.on("input",()=>{t.errorText=null}),i}function Hh({view:t}){t.listenTo(t.element,"submit",(e,n)=>{n.preventDefault(),t.fire("submit")},{useCapture:!0})}var qh='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.972 16.615a.997.997 0 0 1-.744-.292l-4.596-4.596a1 1 0 1 1 1.414-1.414l3.926 3.926 9.937-9.937a1 1 0 0 1 1.414 1.415L7.717 16.323a.997.997 0 0 1-.745.292z"/></svg>',Wh='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.591 10.177l4.243 4.242a1 1 0 0 1-1.415 1.415l-4.242-4.243-4.243 4.243a1 1 0 0 1-1.414-1.415l4.243-4.242L4.52 5.934A1 1 0 0 1 5.934 4.52l4.243 4.243 4.242-4.243a1 1 0 1 1 1.415 1.414l-4.243 4.243z"/></svg>';n(53);class Yh extends cl{constructor(t){super(t);const e=this.locale.t;this.focusTracker=new Oc,this.keystrokes=new Ac,this.labeledInput=this._createLabeledInputView(),this.saveButtonView=this._createButton(e("Save"),qh,"ck-button-save"),this.saveButtonView.type="submit",this.cancelButtonView=this._createButton(e("Cancel"),Wh,"ck-button-cancel","cancel"),this._focusables=new Uc,this._focusCycler=new kl({focusables:this._focusables,focusTracker:this.focusTracker,keystrokeHandler:this.keystrokes,actions:{focusPrevious:"shift + tab",focusNext:"tab"}}),this.setTemplate({tag:"form",attributes:{class:["ck","ck-text-alternative-form"],tabindex:"-1"},children:[this.labeledInput,this.saveButtonView,this.cancelButtonView]})}render(){super.render(),this.keystrokes.listenTo(this.element),Hh({view:this}),[this.labeledInput,this.saveButtonView,this.cancelButtonView].forEach(t=>{this._focusables.add(t),this.focusTracker.add(t.element)})}_createButton(t,e,n,i){const o=new Nl(this.locale);return o.set({label:t,icon:e,tooltip:!0}),o.extendTemplate({attributes:{class:n}}),i&&o.delegate("execute").to(this,i),o}_createLabeledInputView(){const t=this.locale.t,e=new Bh(this.locale,Uh);return e.label=t("Text alternative"),e.fieldView.placeholder=t("Text alternative"),e}}n(55);const Gh=pl("px"),$h=Xo.document.body;class Qh extends cl{constructor(t){super(t);const e=this.bindTemplate;this.set("top",0),this.set("left",0),this.set("position","arrow_nw"),this.set("isVisible",!1),this.set("withArrow",!0),this.set("class"),this.content=this.createCollection(),this.setTemplate({tag:"div",attributes:{class:["ck","ck-balloon-panel",e.to("position",t=>"ck-balloon-panel_"+t),e.if("isVisible","ck-balloon-panel_visible"),e.if("withArrow","ck-balloon-panel_with-arrow"),e.to("class")],style:{top:e.to("top",Gh),left:e.to("left",Gh)}},children:this.content})}show(){this.isVisible=!0}hide(){this.isVisible=!1}attachTo(t){this.show();const e=Qh.defaultPositions,n=Object.assign({},{element:this.element,positions:[e.southArrowNorth,e.southArrowNorthMiddleWest,e.southArrowNorthMiddleEast,e.southArrowNorthWest,e.southArrowNorthEast,e.northArrowSouth,e.northArrowSouthMiddleWest,e.northArrowSouthMiddleEast,e.northArrowSouthWest,e.northArrowSouthEast],limiter:$h,fitInViewport:!0},t),i=Qh._getOptimalPosition(n),o=parseInt(i.left),r=parseInt(i.top),s=i.name;Object.assign(this,{top:r,left:o,position:s})}pin(t){this.unpin(),this._pinWhenIsVisibleCallback=()=>{this.isVisible?this._startPinning(t):this._stopPinning()},this._startPinning(t),this.listenTo(this,"change:isVisible",this._pinWhenIsVisibleCallback)}unpin(){this._pinWhenIsVisibleCallback&&(this._stopPinning(),this.stopListening(this,"change:isVisible",this._pinWhenIsVisibleCallback),this._pinWhenIsVisibleCallback=null,this.hide())}_startPinning(t){this.attachTo(t);const e=Kh(t.target),n=t.limiter?Kh(t.limiter):$h;this.listenTo(Xo.document,"scroll",(i,o)=>{const r=o.target,s=e&&r.contains(e),a=n&&r.contains(n);!s&&!a&&e&&n||this.attachTo(t)},{useCapture:!0}),this.listenTo(Xo.window,"resize",()=>{this.attachTo(t)})}_stopPinning(){this.stopListening(Xo.document,"scroll"),this.stopListening(Xo.window,"resize")}}function Kh(t){return nn(t)?t:Qr(t)?t.commonAncestorContainer:"function"==typeof t?Kh(t()):null}function Jh(t,e){return t.top-e.height-Qh.arrowVerticalOffset}function Zh(t){return t.bottom+Qh.arrowVerticalOffset}Qh.arrowHorizontalOffset=25,Qh.arrowVerticalOffset=10,Qh._getOptimalPosition=Tl,Qh.defaultPositions={northWestArrowSouthWest:(t,e)=>({top:Jh(t,e),left:t.left-Qh.arrowHorizontalOffset,name:"arrow_sw"}),northWestArrowSouthMiddleWest:(t,e)=>({top:Jh(t,e),left:t.left-.25*e.width-Qh.arrowHorizontalOffset,name:"arrow_smw"}),northWestArrowSouth:(t,e)=>({top:Jh(t,e),left:t.left-e.width/2,name:"arrow_s"}),northWestArrowSouthMiddleEast:(t,e)=>({top:Jh(t,e),left:t.left-.75*e.width+Qh.arrowHorizontalOffset,name:"arrow_sme"}),northWestArrowSouthEast:(t,e)=>({top:Jh(t,e),left:t.left-e.width+Qh.arrowHorizontalOffset,name:"arrow_se"}),northArrowSouthWest:(t,e)=>({top:Jh(t,e),left:t.left+t.width/2-Qh.arrowHorizontalOffset,name:"arrow_sw"}),northArrowSouthMiddleWest:(t,e)=>({top:Jh(t,e),left:t.left+t.width/2-.25*e.width-Qh.arrowHorizontalOffset,name:"arrow_smw"}),northArrowSouth:(t,e)=>({top:Jh(t,e),left:t.left+t.width/2-e.width/2,name:"arrow_s"}),northArrowSouthMiddleEast:(t,e)=>({top:Jh(t,e),left:t.left+t.width/2-.75*e.width+Qh.arrowHorizontalOffset,name:"arrow_sme"}),northArrowSouthEast:(t,e)=>({top:Jh(t,e),left:t.left+t.width/2-e.width+Qh.arrowHorizontalOffset,name:"arrow_se"}),northEastArrowSouthWest:(t,e)=>({top:Jh(t,e),left:t.right-Qh.arrowHorizontalOffset,name:"arrow_sw"}),northEastArrowSouthMiddleWest:(t,e)=>({top:Jh(t,e),left:t.right-.25*e.width-Qh.arrowHorizontalOffset,name:"arrow_smw"}),northEastArrowSouth:(t,e)=>({top:Jh(t,e),left:t.right-e.width/2,name:"arrow_s"}),northEastArrowSouthMiddleEast:(t,e)=>({top:Jh(t,e),left:t.right-.75*e.width+Qh.arrowHorizontalOffset,name:"arrow_sme"}),northEastArrowSouthEast:(t,e)=>({top:Jh(t,e),left:t.right-e.width+Qh.arrowHorizontalOffset,name:"arrow_se"}),southWestArrowNorthWest:(t,e)=>({top:Zh(t),left:t.left-Qh.arrowHorizontalOffset,name:"arrow_nw"}),southWestArrowNorthMiddleWest:(t,e)=>({top:Zh(t),left:t.left-.25*e.width-Qh.arrowHorizontalOffset,name:"arrow_nmw"}),southWestArrowNorth:(t,e)=>({top:Zh(t),left:t.left-e.width/2,name:"arrow_n"}),southWestArrowNorthMiddleEast:(t,e)=>({top:Zh(t),left:t.left-.75*e.width+Qh.arrowHorizontalOffset,name:"arrow_nme"}),southWestArrowNorthEast:(t,e)=>({top:Zh(t),left:t.left-e.width+Qh.arrowHorizontalOffset,name:"arrow_ne"}),southArrowNorthWest:(t,e)=>({top:Zh(t),left:t.left+t.width/2-Qh.arrowHorizontalOffset,name:"arrow_nw"}),southArrowNorthMiddleWest:(t,e)=>({top:Zh(t),left:t.left+t.width/2-.25*e.width-Qh.arrowHorizontalOffset,name:"arrow_nmw"}),southArrowNorth:(t,e)=>({top:Zh(t),left:t.left+t.width/2-e.width/2,name:"arrow_n"}),southArrowNorthMiddleEast:(t,e)=>({top:Zh(t),left:t.left+t.width/2-.75*e.width+Qh.arrowHorizontalOffset,name:"arrow_nme"}),southArrowNorthEast:(t,e)=>({top:Zh(t),left:t.left+t.width/2-e.width+Qh.arrowHorizontalOffset,name:"arrow_ne"}),southEastArrowNorthWest:(t,e)=>({top:Zh(t),left:t.right-Qh.arrowHorizontalOffset,name:"arrow_nw"}),southEastArrowNorthMiddleWest:(t,e)=>({top:Zh(t),left:t.right-.25*e.width-Qh.arrowHorizontalOffset,name:"arrow_nmw"}),southEastArrowNorth:(t,e)=>({top:Zh(t),left:t.right-e.width/2,name:"arrow_n"}),southEastArrowNorthMiddleEast:(t,e)=>({top:Zh(t),left:t.right-.75*e.width+Qh.arrowHorizontalOffset,name:"arrow_nme"}),southEastArrowNorthEast:(t,e)=>({top:Zh(t),left:t.right-e.width+Qh.arrowHorizontalOffset,name:"arrow_ne"})};n(57),n(59);const Xh=pl("px");class tf extends $l{static get pluginName(){return"ContextualBalloon"}constructor(t){super(t),this.positionLimiter=()=>{const t=this.editor.editing.view,e=t.document.selection.editableElement;return e?t.domConverter.mapViewToDom(e.root):null},this.set("visibleView",null),this.view=new Qh(t.locale),t.ui.view.body.add(this.view),t.ui.focusTracker.add(this.view.element),this._viewToStack=new Map,this._idToStack=new Map,this.set("_numberOfStacks",0),this.set("_singleViewMode",!1),this._rotatorView=this._createRotatorView(),this._fakePanelsView=this._createFakePanelsView()}hasView(t){return Array.from(this._viewToStack.keys()).includes(t)}add(t){if(this.hasView(t.view))throw new hn.b("contextualballoon-add-view-exist: Cannot add configuration of the same view twice.",[this,t]);const e=t.stackId||"main";if(!this._idToStack.has(e))return this._idToStack.set(e,new Map([[t.view,t]])),this._viewToStack.set(t.view,this._idToStack.get(e)),this._numberOfStacks=this._idToStack.size,void(this._visibleStack&&!t.singleViewMode||this.showStack(e));const n=this._idToStack.get(e);t.singleViewMode&&this.showStack(e),n.set(t.view,t),this._viewToStack.set(t.view,n),n===this._visibleStack&&this._showView(t)}remove(t){if(!this.hasView(t))throw new hn.b("contextualballoon-remove-view-not-exist: Cannot remove the configuration of a non-existent view.",[this,t]);const e=this._viewToStack.get(t);this._singleViewMode&&this.visibleView===t&&(this._singleViewMode=!1),this.visibleView===t&&(1===e.size?this._idToStack.size>1?this._showNextStack():(this.view.hide(),this.visibleView=null,this._rotatorView.hideView()):this._showView(Array.from(e.values())[e.size-2])),1===e.size?(this._idToStack.delete(this._getStackId(e)),this._numberOfStacks=this._idToStack.size):e.delete(t),this._viewToStack.delete(t)}updatePosition(t){t&&(this._visibleStack.get(this.visibleView).position=t),this.view.pin(this._getBalloonPosition()),this._fakePanelsView.updatePosition()}showStack(t){this.visibleStack=t;const e=this._idToStack.get(t);if(!e)throw new hn.b("contextualballoon-showstack-stack-not-exist: Cannot show a stack that does not exist.",this);this._visibleStack!==e&&this._showView(Array.from(e.values()).pop())}get _visibleStack(){return this._viewToStack.get(this.visibleView)}_getStackId(t){return Array.from(this._idToStack.entries()).find(e=>e[1]===t)[0]}_showNextStack(){const t=Array.from(this._idToStack.values());let e=t.indexOf(this._visibleStack)+1;t[e]||(e=0),this.showStack(this._getStackId(t[e]))}_showPrevStack(){const t=Array.from(this._idToStack.values());let e=t.indexOf(this._visibleStack)-1;t[e]||(e=t.length-1),this.showStack(this._getStackId(t[e]))}_createRotatorView(){const t=new ef(this.editor.locale),e=this.editor.locale.t;return this.view.content.add(t),t.bind("isNavigationVisible").to(this,"_numberOfStacks",this,"_singleViewMode",(t,e)=>!e&&t>1),t.on("change:isNavigationVisible",()=>this.updatePosition(),{priority:"low"}),t.bind("counter").to(this,"visibleView",this,"_numberOfStacks",(t,n)=>{if(n<2)return"";const i=Array.from(this._idToStack.values()).indexOf(this._visibleStack)+1;return e("%0 of %1",[i,n])}),t.buttonNextView.on("execute",()=>{t.focusTracker.isFocused&&this.editor.editing.view.focus(),this._showNextStack()}),t.buttonPrevView.on("execute",()=>{t.focusTracker.isFocused&&this.editor.editing.view.focus(),this._showPrevStack()}),t}_createFakePanelsView(){const t=new nf(this.editor.locale,this.view);return t.bind("numberOfPanels").to(this,"_numberOfStacks",this,"_singleViewMode",(t,e)=>!e&&t>=2?Math.min(t-1,2):0),t.listenTo(this.view,"change:top",()=>t.updatePosition()),t.listenTo(this.view,"change:left",()=>t.updatePosition()),this.editor.ui.view.body.add(t),t}_showView({view:t,balloonClassName:e="",withArrow:n=!0,singleViewMode:i=!1}){this.view.class=e,this.view.withArrow=n,this._rotatorView.showView(t),this.visibleView=t,this.view.pin(this._getBalloonPosition()),this._fakePanelsView.updatePosition(),i&&(this._singleViewMode=!0)}_getBalloonPosition(){let t=Array.from(this._visibleStack.values()).pop().position;return t&&!t.limiter&&(t=Object.assign({},t,{limiter:this.positionLimiter})),t}}class ef extends cl{constructor(t){super(t);const e=t.t,n=this.bindTemplate;this.set("isNavigationVisible",!0),this.focusTracker=new Oc,this.buttonPrevView=this._createButtonView(e("Previous"),'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.463 5.187a.888.888 0 1 1 1.254 1.255L9.16 10l3.557 3.557a.888.888 0 1 1-1.254 1.255L7.26 10.61a.888.888 0 0 1 .16-1.382l4.043-4.042z"/></svg>'),this.buttonNextView=this._createButtonView(e("Next"),'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.537 14.813a.888.888 0 1 1-1.254-1.255L10.84 10 7.283 6.442a.888.888 0 1 1 1.254-1.255L12.74 9.39a.888.888 0 0 1-.16 1.382l-4.043 4.042z"/></svg>'),this.content=this.createCollection(),this.setTemplate({tag:"div",attributes:{class:["ck","ck-balloon-rotator"],"z-index":"-1"},children:[{tag:"div",attributes:{class:["ck-balloon-rotator__navigation",n.to("isNavigationVisible",t=>t?"":"ck-hidden")]},children:[this.buttonPrevView,{tag:"span",attributes:{class:["ck-balloon-rotator__counter"]},children:[{text:n.to("counter")}]},this.buttonNextView]},{tag:"div",attributes:{class:"ck-balloon-rotator__content"},children:this.content}]})}render(){super.render(),this.focusTracker.add(this.element)}showView(t){this.hideView(),this.content.add(t)}hideView(){this.content.clear()}_createButtonView(t,e){const n=new Nl(this.locale);return n.set({label:t,icon:e,tooltip:!0}),n}}class nf extends cl{constructor(t,e){super(t);const n=this.bindTemplate;this.set("top",0),this.set("left",0),this.set("height",0),this.set("width",0),this.set("numberOfPanels",0),this.content=this.createCollection(),this._balloonPanelView=e,this.setTemplate({tag:"div",attributes:{class:["ck-fake-panel",n.to("numberOfPanels",t=>t?"":"ck-hidden")],style:{top:n.to("top",Xh),left:n.to("left",Xh),width:n.to("width",Xh),height:n.to("height",Xh)}},children:this.content}),this.on("change:numberOfPanels",(t,e,n,i)=>{n>i?this._addPanels(n-i):this._removePanels(i-n),this.updatePosition()})}_addPanels(t){for(;t--;){const t=new cl;t.setTemplate({tag:"div"}),this.content.add(t),this.registerChild(t)}}_removePanels(t){for(;t--;){const t=this.content.last;this.content.remove(t),this.deregisterChild(t),t.destroy()}}updatePosition(){if(this.numberOfPanels){const{top:t,left:e}=this._balloonPanelView,{width:n,height:i}=new Zr(this._balloonPanelView.element);Object.assign(this,{top:t,left:e,width:n,height:i})}}}function of(t){const e=t.editing.view,n=Qh.defaultPositions;return{target:e.domConverter.viewToDom(e.document.selection.getSelectedElement()),positions:[n.northArrowSouth,n.northArrowSouthWest,n.northArrowSouthEast,n.southArrowNorth,n.southArrowNorthWest,n.southArrowNorthEast]}}class rf extends $l{static get requires(){return[tf]}static get pluginName(){return"ImageTextAlternativeUI"}init(){this._createButton(),this._createForm()}destroy(){super.destroy(),this._form.destroy()}_createButton(){const t=this.editor,e=t.t;t.ui.componentFactory.add("imageTextAlternative",n=>{const i=t.commands.get("imageTextAlternative"),o=new Nl(n);return o.set({label:e("Change image text alternative"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.085 6.22L2.943 4.078a.75.75 0 1 1 1.06-1.06l2.592 2.59A11.094 11.094 0 0 1 10 5.068c4.738 0 8.578 3.101 8.578 5.083 0 1.197-1.401 2.803-3.555 3.887l1.714 1.713a.75.75 0 0 1-.09 1.138.488.488 0 0 1-.15.084.75.75 0 0 1-.821-.16L6.17 7.304c-.258.11-.51.233-.757.365l6.239 6.24-.006.005.78.78c-.388.094-.78.166-1.174.215l-1.11-1.11h.011L4.55 8.197a7.2 7.2 0 0 0-.665.514l-.112.098 4.897 4.897-.005.006 1.276 1.276a10.164 10.164 0 0 1-1.477-.117l-.479-.479-.009.009-4.863-4.863-.022.031a2.563 2.563 0 0 0-.124.2c-.043.077-.08.158-.108.241a.534.534 0 0 0-.028.133.29.29 0 0 0 .008.072.927.927 0 0 0 .082.226c.067.133.145.26.234.379l3.242 3.365.025.01.59.623c-3.265-.918-5.59-3.155-5.59-4.668 0-1.194 1.448-2.838 3.663-3.93zm7.07.531a4.632 4.632 0 0 1 1.108 5.992l.345.344.046-.018a9.313 9.313 0 0 0 2-1.112c.256-.187.5-.392.727-.613.137-.134.27-.277.392-.431.072-.091.141-.185.203-.286.057-.093.107-.19.148-.292a.72.72 0 0 0 .036-.12.29.29 0 0 0 .008-.072.492.492 0 0 0-.028-.133.999.999 0 0 0-.036-.096 2.165 2.165 0 0 0-.071-.145 2.917 2.917 0 0 0-.125-.2 3.592 3.592 0 0 0-.263-.335 5.444 5.444 0 0 0-.53-.523 7.955 7.955 0 0 0-1.054-.768 9.766 9.766 0 0 0-1.879-.891c-.337-.118-.68-.219-1.027-.301zm-2.85.21l-.069.002a.508.508 0 0 0-.254.097.496.496 0 0 0-.104.679.498.498 0 0 0 .326.199l.045.005c.091.003.181.003.272.012a2.45 2.45 0 0 1 2.017 1.513c.024.061.043.125.069.185a.494.494 0 0 0 .45.287h.008a.496.496 0 0 0 .35-.158.482.482 0 0 0 .13-.335.638.638 0 0 0-.048-.219 3.379 3.379 0 0 0-.36-.723 3.438 3.438 0 0 0-2.791-1.543l-.028-.001h-.013z"/></svg>',tooltip:!0}),o.bind("isEnabled").to(i,"isEnabled"),this.listenTo(o,"execute",()=>{this._showForm()}),o})}_createForm(){const t=this.editor,e=t.editing.view.document;this._balloon=this.editor.plugins.get("ContextualBalloon"),this._form=new Yh(t.locale),this._form.render(),this.listenTo(this._form,"submit",()=>{t.execute("imageTextAlternative",{newValue:this._form.labeledInput.fieldView.element.value}),this._hideForm(!0)}),this.listenTo(this._form,"cancel",()=>{this._hideForm(!0)}),this._form.keystrokes.set("Esc",(t,e)=>{this._hideForm(!0),e()}),this.listenTo(t.ui,"update",()=>{Ou(e.selection)?this._isVisible&&function(t){const e=t.plugins.get("ContextualBalloon");if(Ou(t.editing.view.document.selection)){const n=of(t);e.updatePosition(n)}}(t):this._hideForm(!0)}),zl({emitter:this._form,activator:()=>this._isVisible,contextElements:[this._balloon.view.element],callback:()=>this._hideForm()})}_showForm(){if(this._isVisible)return;const t=this.editor,e=t.commands.get("imageTextAlternative"),n=this._form.labeledInput;this._isInBalloon||this._balloon.add({view:this._form,position:of(t)}),n.fieldView.value=n.fieldView.element.value=e.value||"",this._form.labeledInput.fieldView.select()}_hideForm(t){this._isInBalloon&&(this._form.focusTracker.isFocused&&this._form.saveButtonView.focus(),this._balloon.remove(this._form),t&&this.editor.editing.view.focus())}get _isVisible(){return this._balloon.visibleView===this._form}get _isInBalloon(){return this._balloon.hasView(this._form)}}class sf extends $l{static get requires(){return[zh,rf]}static get pluginName(){return"ImageTextAlternative"}}n(61);class af extends $l{static get requires(){return[Bu,Lh,sf]}static get pluginName(){return"Image"}}class cf extends cl{constructor(t){super(t),this.buttonView=new Nl(t),this._fileInputView=new lf(t),this._fileInputView.bind("acceptedType").to(this),this._fileInputView.bind("allowMultipleFiles").to(this),this._fileInputView.delegate("done").to(this),this.setTemplate({tag:"span",attributes:{class:"ck-file-dialog-button"},children:[this.buttonView,this._fileInputView]}),this.buttonView.on("execute",()=>{this._fileInputView.open()})}focus(){this.buttonView.focus()}}class lf extends cl{constructor(t){super(t),this.set("acceptedType"),this.set("allowMultipleFiles",!1);const e=this.bindTemplate;this.setTemplate({tag:"input",attributes:{class:["ck-hidden"],type:"file",tabindex:"-1",accept:e.to("acceptedType"),multiple:e.to("allowMultipleFiles")},on:{change:e.to(()=>{this.element&&this.element.files&&this.element.files.length&&this.fire("done",this.element.files),this.element.value=""})}})}open(){this.element.click()}}function df(t){const e=t.map(t=>t.replace("+","\\+"));return new RegExp(`^image\\/(${e.join("|")})$`)}class uf extends $l{init(){const t=this.editor,e=t.t;t.ui.componentFactory.add("imageUpload",n=>{const i=new cf(n),o=t.commands.get("imageUpload"),r=t.config.get("image.upload.types"),s=df(r);return i.set({acceptedType:r.map(t=>"image/"+t).join(","),allowMultipleFiles:!0}),i.buttonView.set({label:e("Insert image"),icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z"/></svg>',tooltip:!0}),i.buttonView.bind("isEnabled").to(o),i.on("done",(e,n)=>{const i=Array.from(n).filter(t=>s.test(t.type));i.length&&t.execute("imageUpload",{file:i})}),i})}}n(63),n(65),n(67);class hf extends $l{constructor(t){super(t),this.placeholder="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 250"><rect rx="4"/></svg>')}init(){this.editor.editing.downcastDispatcher.on("attribute:uploadStatus:image",(...t)=>this.uploadStatusChange(...t))}uploadStatusChange(t,e,n){const i=this.editor,o=e.item,r=o.getAttribute("uploadId");if(!n.consumable.consume(e.item,t.name))return;const s=i.plugins.get(Xd),a=r?e.attributeNewValue:null,c=this.placeholder,l=i.editing.mapper.toViewElement(o),d=n.writer;if("reading"==a)return ff(l,d),void mf(c,l,d);if("uploading"==a){const t=s.loaders.get(r);return ff(l,d),void(t?(gf(l,d),function(t,e,n,i){const o=function(t){const e=t.createUIElement("div",{class:"ck-progress-bar"});return t.setCustomProperty("progressBar",!0,e),e}(e);e.insert(e.createPositionAt(t,"end"),o),n.on("change:uploadedPercent",(t,e,n)=>{i.change(t=>{t.setStyle("width",n+"%",o)})})}(l,d,t,i.editing.view),function(t,e,n){if(n.data){const i=ju(t);e.setAttribute("src",n.data,i)}}(l,d,t)):mf(c,l,d))}"complete"==a&&s.loaders.get(r)&&function(t,e,n){const i=e.createUIElement("div",{class:"ck-image-upload-complete-icon"});e.insert(e.createPositionAt(t,"end"),i),setTimeout(()=>{n.change(t=>t.remove(t.createRangeOn(i)))},3e3)}(l,d,i.editing.view),function(t,e){bf(t,e,"progressBar")}(l,d),gf(l,d),function(t,e){e.removeClass("ck-appear",t)}(l,d)}}function ff(t,e){t.hasClass("ck-appear")||e.addClass("ck-appear",t)}function mf(t,e,n){e.hasClass("ck-image-upload-placeholder")||n.addClass("ck-image-upload-placeholder",e);const i=ju(e);i.getAttribute("src")!==t&&n.setAttribute("src",t,i),pf(e,"placeholder")||n.insert(n.createPositionAfter(i),function(t){const e=t.createUIElement("div",{class:"ck-upload-placeholder-loader"});return t.setCustomProperty("placeholder",!0,e),e}(n))}function gf(t,e){t.hasClass("ck-image-upload-placeholder")&&e.removeClass("ck-image-upload-placeholder",t),bf(t,e,"placeholder")}function pf(t,e){for(const n of t.getChildren())if(n.getCustomProperty(e))return n}function bf(t,e,n){const i=pf(t,n);i&&e.remove(e.createRangeOn(i))}class wf{constructor(t){this.document=t}createDocumentFragment(t){return new xo(this.document,t)}createElement(t,e,n){return new Oi(this.document,t,e,n)}createText(t){return new Rn(this.document,t)}clone(t,e=!1){return t._clone(e)}appendChild(t,e){return e._appendChild(t)}insertChild(t,e,n){return n._insertChild(t,e)}removeChildren(t,e,n){return n._removeChildren(t,e)}remove(t){const e=t.parent;return e?this.removeChildren(e.getChildIndex(t),1,e):[]}replace(t,e){const n=t.parent;if(n){const i=n.getChildIndex(t);return this.removeChildren(i,1,n),this.insertChild(i,e,n),!0}return!1}unwrapElement(t){const e=t.parent;if(e){const n=e.getChildIndex(t);this.remove(t),this.insertChild(n,t.getChildren(),e)}}rename(t,e){const n=new Oi(this.document,t,e.getAttributes(),e.getChildren());return this.replace(e,n)?n:null}setAttribute(t,e,n){n._setAttribute(t,e)}removeAttribute(t,e){e._removeAttribute(t)}addClass(t,e){e._addClass(t)}removeClass(t,e){e._removeClass(t)}setStyle(t,e,n){y(t)&&void 0===n&&(n=e),n._setStyle(t,e)}removeStyle(t,e){e._removeStyle(t)}setCustomProperty(t,e,n){n._setCustomProperty(t,e)}removeCustomProperty(t,e){return e._removeCustomProperty(t)}createPositionAt(t,e){return Zi._createAt(t,e)}createPositionAfter(t){return Zi._createAfter(t)}createPositionBefore(t){return Zi._createBefore(t)}createRange(t,e){return new Xi(t,e)}createRangeOn(t){return Xi._createOn(t)}createRangeIn(t){return Xi._createIn(t)}createSelection(t,e,n){return new no(t,e,n)}}class kf extends td{refresh(){this.isEnabled=Lu(this.editor.model)}execute(t){const e=this.editor,n=e.model,i=e.plugins.get(Xd);n.change(e=>{const o=Array.isArray(t.file)?t.file:[t.file];for(const t of o)_f(e,n,i,t)})}}function _f(t,e,n,i){const o=n.createLoader(i);o&&Du(t,e,{uploadId:o.id})}class vf extends $l{static get requires(){return[Xd,xh,Xl]}static get pluginName(){return"ImageUploadEditing"}constructor(t){super(t),t.config.define("image",{upload:{types:["jpeg","png","gif","bmp","webp","tiff"]}})}init(){const t=this.editor,e=t.model.document,n=t.model.schema,i=t.conversion,o=t.plugins.get(Xd),r=df(t.config.get("image.upload.types"));n.extend("image",{allowAttributes:["uploadId","uploadStatus"]}),t.commands.add("imageUpload",new kf(t)),i.for("upcast").attributeToAttribute({view:{name:"img",key:"uploadId"},model:"uploadId"}),this.listenTo(t.editing.view.document,"clipboardInput",(e,n)=>{if(i=n.dataTransfer,Array.from(i.types).includes("text/html")&&""!==i.getData("text/html"))return;var i;const o=Array.from(n.dataTransfer.files).filter(t=>!!t&&r.test(t.type)),s=n.targetRanges.map(e=>t.editing.mapper.toModelRange(e));t.model.change(n=>{n.setSelection(s),o.length&&(e.stop(),t.model.enqueueChange("default",()=>{t.execute("imageUpload",{file:o})}))})}),this.listenTo(t.plugins.get(Xl),"inputTransformation",(e,n)=>{const i=Array.from(t.editing.view.createRangeIn(n.content)).filter(t=>{return!(!(e=t.item).is("element","img")||!e.getAttribute("src"))&&(e.getAttribute("src").match(/^data:image\/\w+;base64,/g)||e.getAttribute("src").match(/^blob:/g))&&!t.item.getAttribute("uploadProcessed");var e}).map(t=>{return{promise:(e=t.item,new Promise((t,n)=>{const i=e.getAttribute("src");fetch(i).then(t=>t.blob()).then(e=>{const n=function(t,e){return t.type?t.type:e.match(/data:(image\/\w+);base64/)?e.match(/data:(image\/\w+);base64/)[1].toLowerCase():"image/jpeg"}(e,i),o=n.replace("image/",""),r=new File([e],"image."+o,{type:n});t(r)}).catch(n)})),imageElement:t.item};var e});if(!i.length)return;const r=new wf(t.editing.view.document);for(const t of i){r.setAttribute("uploadProcessed",!0,t.imageElement);const e=o.createLoader(t.promise);e&&(r.setAttribute("src","",t.imageElement),r.setAttribute("uploadId",e.id,t.imageElement))}}),t.editing.view.document.on("dragover",(t,e)=>{e.preventDefault()}),e.on("change",()=>{const n=e.differ.getChanges({includeChangesInGraveyard:!0});for(const e of n)if("insert"==e.type&&"$text"!=e.name){const n=e.position.nodeAfter,i="$graveyard"==e.position.root.rootName;for(const e of yf(t,n)){const t=e.getAttribute("uploadId");if(!t)continue;const n=o.loaders.get(t);n&&(i?n.abort():"idle"==n.status&&this._readAndUpload(n,e))}}})}_readAndUpload(t,e){const n=this.editor,i=n.model,o=n.locale.t,r=n.plugins.get(Xd),s=n.plugins.get(xh);return i.enqueueChange("transparent",t=>{t.setAttribute("uploadStatus","reading",e)}),t.read().then(()=>{const o=t.upload();if(ho.isSafari){const t=ju(n.editing.mapper.toViewElement(e));n.editing.view.once("render",()=>{if(!t.parent)return;const e=n.editing.view.domConverter.mapViewToDom(t.parent);if(!e)return;const i=e.style.display;e.style.display="none",e._ckHack=e.offsetHeight,e.style.display=i})}return i.enqueueChange("transparent",t=>{t.setAttribute("uploadStatus","uploading",e)}),o}).then(t=>{i.enqueueChange("transparent",n=>{n.setAttributes({uploadStatus:"complete",src:t.default},e),this._parseAndSetSrcsetAttributeOnImage(t,e,n)}),a()}).catch(n=>{if("error"!==t.status&&"aborted"!==t.status)throw n;"error"==t.status&&n&&s.showWarning(n,{title:o("Upload failed"),namespace:"upload"}),a(),i.enqueueChange("transparent",t=>{t.remove(e)})});function a(){i.enqueueChange("transparent",t=>{t.removeAttribute("uploadId",e),t.removeAttribute("uploadStatus",e)}),r.destroyLoader(t)}}_parseAndSetSrcsetAttributeOnImage(t,e,n){let i=0;const o=Object.keys(t).filter(t=>{const e=parseInt(t,10);if(!isNaN(e))return i=Math.max(i,e),!0}).map(e=>`${t[e]} ${e}w`).join(", ");""!=o&&n.setAttribute("srcset",{data:o,width:i},e)}}function yf(t,e){return Array.from(t.model.createRangeOn(e)).filter(t=>t.item.is("image")).map(t=>t.item)}class xf extends $l{static get pluginName(){return"ImageUpload"}static get requires(){return[vf,uf,hf]}}class Af extends td{refresh(){const t=this.editor.model,e=mu(t.document.selection.getSelectedBlocks());this.value=!!e&&e.is("paragraph"),this.isEnabled=!!e&&Tf(e,t.schema)}execute(t={}){const e=this.editor.model,n=e.document;e.change(i=>{const o=(t.selection||n.selection).getSelectedBlocks();for(const t of o)!t.is("paragraph")&&Tf(t,e.schema)&&i.rename(t,"paragraph")})}}function Tf(t,e){return e.checkChild(t.parent,"paragraph")&&!e.isObject(t)}class Cf extends $l{static get pluginName(){return"Paragraph"}init(){const t=this.editor,e=t.model,n=t.data;t.commands.add("paragraph",new Af(t)),e.schema.register("paragraph",{inheritAllFrom:"$block"}),t.conversion.elementToElement({model:"paragraph",view:"p"}),t.conversion.for("upcast").elementToElement({model:(t,e)=>Cf.paragraphLikeElements.has(t.name)?t.isEmpty?null:e.createElement("paragraph"):null,converterPriority:"low"}),n.upcastDispatcher.on("element",(t,e,n)=>{n.consumable.test(e.viewItem,{name:e.viewItem.name})&&Sf(e.viewItem,e.modelCursor,n.schema)&&Object.assign(e,Pf(e.viewItem,e.modelCursor,n))},{priority:"low"}),n.upcastDispatcher.on("text",(t,e,n)=>{e.modelRange||Sf(e.viewItem,e.modelCursor,n.schema)&&Object.assign(e,Pf(e.viewItem,e.modelCursor,n))},{priority:"lowest"}),e.document.registerPostFixer(t=>this._autoparagraphEmptyRoots(t)),t.data.on("ready",()=>{e.enqueueChange("transparent",t=>this._autoparagraphEmptyRoots(t))},{priority:"lowest"})}_autoparagraphEmptyRoots(t){const e=this.editor.model;for(const n of e.document.getRootNames()){const i=e.document.getRoot(n);if(i.isEmpty&&"$graveyard"!=i.rootName&&e.schema.checkChild(i,"paragraph"))return t.insertElement("paragraph",i),!0}}}function Pf(t,e,n){const i=n.writer.createElement("paragraph");return n.writer.insert(i,e),n.convertItem(t,n.writer.createPositionAt(i,0))}function Sf(t,e,n){const i=n.createContext(e);return!!n.checkChild(i,"paragraph")&&!!n.checkChild(i.push("paragraph"),t)}Cf.paragraphLikeElements=new Set(["blockquote","dd","div","dt","h1","h2","h3","h4","h5","h6","li","p","td"]);class Mf extends td{constructor(t,e){super(t),this.modelElements=e}refresh(){const t=mu(this.editor.model.document.selection.getSelectedBlocks());this.value=!!t&&this.modelElements.includes(t.name)&&t.name,this.isEnabled=!!t&&this.modelElements.some(e=>Ef(t,e,this.editor.model.schema))}execute(t){const e=this.editor.model,n=e.document,i=t.value;e.change(t=>{const o=Array.from(n.selection.getSelectedBlocks()).filter(t=>Ef(t,i,e.schema));for(const e of o)e.is(i)||t.rename(e,i)})}}function Ef(t,e,n){return n.checkChild(t.parent,e)&&!n.isObject(t)}class If extends $l{static get pluginName(){return"HeadingEditing"}constructor(t){super(t),t.config.define("heading",{options:[{model:"paragraph",title:"Paragraph",class:"ck-heading_paragraph"},{model:"heading1",view:"h2",title:"Heading 1",class:"ck-heading_heading1"},{model:"heading2",view:"h3",title:"Heading 2",class:"ck-heading_heading2"},{model:"heading3",view:"h4",title:"Heading 3",class:"ck-heading_heading3"}]})}static get requires(){return[Cf]}init(){const t=this.editor,e=t.config.get("heading.options"),n=[];for(const i of e)"paragraph"!==i.model&&(t.model.schema.register(i.model,{inheritAllFrom:"$block"}),t.conversion.elementToElement(i),n.push(i.model));this._addDefaultH1Conversion(t),t.commands.add("heading",new Mf(t,n))}afterInit(){const t=this.editor,e=t.commands.get("enter"),n=t.config.get("heading.options");e&&this.listenTo(e,"afterExecute",(e,i)=>{const o=t.model.document.selection.getFirstPosition().parent;n.some(t=>o.is(t.model))&&!o.is("paragraph")&&0===o.childCount&&i.writer.rename(o,"paragraph")})}_addDefaultH1Conversion(t){t.conversion.for("upcast").elementToElement({model:"heading1",view:"h1",converterPriority:un.get("low")+1})}}class Nf{constructor(t,e){e&&ji(this,e),t&&this.set(t)}}xn(Nf,Ui);n(11);class Of extends $l{init(){const t=this.editor,e=t.t,n=function(t){const e=t.t,n={Paragraph:e("Paragraph"),"Heading 1":e("Heading 1"),"Heading 2":e("Heading 2"),"Heading 3":e("Heading 3"),"Heading 4":e("Heading 4"),"Heading 5":e("Heading 5"),"Heading 6":e("Heading 6")};return t.config.get("heading.options").map(t=>{const e=n[t.title];return e&&e!=t.title&&(t.title=e),t})}(t),i=e("Choose heading"),o=e("Heading");t.ui.componentFactory.add("heading",e=>{const r={},s=new An,a=t.commands.get("heading"),c=t.commands.get("paragraph"),l=[a];for(const t of n){const e={type:"button",model:new Nf({label:t.title,class:t.class,withText:!0})};"paragraph"===t.model?(e.model.bind("isOn").to(c,"value"),e.model.set("commandName","paragraph"),l.push(c)):(e.model.bind("isOn").to(a,"value",e=>e===t.model),e.model.set({commandName:"heading",commandValue:t.model})),s.add(e),r[t.model]=t.title}const d=Bl(e);return Fl(d,s),d.buttonView.set({isOn:!1,withText:!0,tooltip:o}),d.extendTemplate({attributes:{class:["ck-heading-dropdown"]}}),d.bind("isEnabled").toMany(l,"isEnabled",(...t)=>t.some(t=>t)),d.buttonView.bind("label").to(a,"value",c,"value",(t,e)=>{const n=t||e&&"paragraph";return r[n]?r[n]:i}),this.listenTo(d,"execute",e=>{t.execute(e.source.commandName,e.source.commandValue?{value:e.source.commandValue}:void 0),t.editing.view.focus()}),d})}}function Rf(t){for(const e of t.getChildren())if(e&&e.is("caption"))return e;return null}function Df(t){const e=t.parent;return"figcaption"==t.name&&e&&"figure"==e.name&&e.hasClass("image")?{name:!0}:null}class Lf extends $l{static get pluginName(){return"ImageCaptionEditing"}init(){const t=this.editor,e=t.editing.view,n=t.model.schema,i=t.data,o=t.editing,r=t.t;n.register("caption",{allowIn:"image",allowContentOf:"$block",isLimit:!0}),t.model.document.registerPostFixer(t=>this._insertMissingModelCaptionElement(t)),t.conversion.for("upcast").elementToElement({view:Df,model:"caption"});i.downcastDispatcher.on("insert:caption",jf(t=>t.createContainerElement("figcaption"),!1));const s=function(t,e){return n=>{const i=n.createEditableElement("figcaption");return n.setCustomProperty("imageCaption",!0,i),Lc({view:t,element:i,text:e}),Eu(i,n)}}(e,r("Enter image caption"));o.downcastDispatcher.on("insert:caption",jf(s)),o.downcastDispatcher.on("insert",this._fixCaptionVisibility(t=>t.item),{priority:"high"}),o.downcastDispatcher.on("remove",this._fixCaptionVisibility(t=>t.position.parent),{priority:"high"}),e.document.registerPostFixer(t=>this._updateCaptionVisibility(t))}_updateCaptionVisibility(t){const e=this.editor.editing.mapper,n=this._lastSelectedCaption;let i;const o=this.editor.model.document.selection,r=o.getSelectedElement();if(r&&r.is("image")){const t=Rf(r);i=e.toViewElement(t)}const s=Vf(o.getFirstPosition().parent);if(s&&(i=e.toViewElement(s)),i)return n?(n===i||(zf(n,t),this._lastSelectedCaption=i),Bf(i,t)):(this._lastSelectedCaption=i,Bf(i,t));if(n){const e=zf(n,t);return this._lastSelectedCaption=null,e}return!1}_fixCaptionVisibility(t){return(e,n,i)=>{const o=Vf(t(n)),r=this.editor.editing.mapper,s=i.writer;if(o){const t=r.toViewElement(o);t&&(o.childCount?s.removeClass("ck-hidden",t):s.addClass("ck-hidden",t))}}}_insertMissingModelCaptionElement(t){const e=this.editor.model,n=e.document.differ.getChanges(),i=[];for(const t of n)if("insert"==t.type&&"$text"!=t.name){const n=t.position.nodeAfter;if(n.is("image")&&!Rf(n)&&i.push(n),!n.is("image")&&n.childCount)for(const t of e.createRangeIn(n).getItems())t.is("image")&&!Rf(t)&&i.push(t)}for(const e of i)t.appendElement("caption",e);return!!i.length}}function jf(t,e=!0){return(n,i,o)=>{const r=i.item;if((r.childCount||e)&&Ru(r.parent)){if(!o.consumable.consume(i.item,"insert"))return;const e=o.mapper.toViewElement(i.range.start.parent),n=t(o.writer),s=o.writer;r.childCount||s.addClass("ck-hidden",n),function(t,e,n,i){const o=i.writer.createPositionAt(n,"end");i.writer.insert(o,t),i.mapper.bindElements(e,t)}(n,i.item,e,o)}}}function Vf(t){const e=t.getAncestors({includeSelf:!0}).find(t=>"caption"==t.name);return e&&e.parent&&"image"==e.parent.name?e:null}function zf(t,e){return!t.childCount&&!t.hasClass("ck-hidden")&&(e.addClass("ck-hidden",t),!0)}function Bf(t,e){return!!t.hasClass("ck-hidden")&&(e.removeClass("ck-hidden",t),!0)}n(70);class Ff extends td{constructor(t,e){super(t),this.defaultStyle=!1,this.styles=e.reduce((t,e)=>(t[e.name]=e,e.isDefault&&(this.defaultStyle=e.name),t),{})}refresh(){const t=this.editor.model.document.selection.getSelectedElement();if(this.isEnabled=Ru(t),t)if(t.hasAttribute("imageStyle")){const e=t.getAttribute("imageStyle");this.value=!!this.styles[e]&&e}else this.value=this.defaultStyle;else this.value=!1}execute(t){const e=t.value,n=this.editor.model,i=n.document.selection.getSelectedElement();n.change(t=>{this.styles[e].isDefault?t.removeAttribute("imageStyle",i):t.setAttribute("imageStyle",e,i)})}}function Uf(t,e){for(const n of e)if(n.name===t)return n}var Hf='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 4.5V3h16v1.5zm2.5 3V12h11V7.5h-11zM4.061 6H15.94c.586 0 1.061.407 1.061.91v5.68c0 .503-.475.91-1.061.91H4.06c-.585 0-1.06-.407-1.06-.91V6.91C3 6.406 3.475 6 4.061 6zM2 16.5V15h16v1.5z"/></svg>',qf='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M18 4.5V3H2v1.5h16zm0 3V6h-5.674v1.5H18zm0 3V9h-5.674v1.5H18zm0 3V12h-5.674v1.5H18zm-8.5-6V12h-6V7.5h6zm.818-1.5H2.682C2.305 6 2 6.407 2 6.91v5.68c0 .503.305.91.682.91h7.636c.377 0 .682-.407.682-.91V6.91c0-.503-.305-.91-.682-.91zM18 16.5V15H2v1.5h16z"/></svg>',Wf='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 4.5V3h16v1.5zm4.5 3V12h7V7.5h-7zM5.758 6h8.484c.419 0 .758.407.758.91v5.681c0 .502-.34.909-.758.909H5.758c-.419 0-.758-.407-.758-.91V6.91c0-.503.34-.91.758-.91zM2 16.5V15h16v1.5z"/></svg>',Yf='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 4.5V3h16v1.5zm0 3V6h5.674v1.5zm0 3V9h5.674v1.5zm0 3V12h5.674v1.5zm8.5-6V12h6V7.5h-6zM9.682 6h7.636c.377 0 .682.407.682.91v5.68c0 .503-.305.91-.682.91H9.682c-.377 0-.682-.407-.682-.91V6.91c0-.503.305-.91.682-.91zM2 16.5V15h16v1.5z"/></svg>';const Gf={full:{name:"full",title:"Full size image",icon:Hf,isDefault:!0},side:{name:"side",title:"Side image",icon:Yf,className:"image-style-side"},alignLeft:{name:"alignLeft",title:"Left aligned image",icon:qf,className:"image-style-align-left"},alignCenter:{name:"alignCenter",title:"Centered image",icon:Wf,className:"image-style-align-center"},alignRight:{name:"alignRight",title:"Right aligned image",icon:Yf,className:"image-style-align-right"}},$f={full:Hf,left:qf,right:Yf,center:Wf};function Qf(t=[]){return t.map(Kf)}function Kf(t){if("string"==typeof t){const e=t;Gf[e]?t=Object.assign({},Gf[e]):(console.warn(Object(hn.a)("image-style-not-found: There is no such image style of given name."),{name:e}),t={name:e})}else if(Gf[t.name]){const e=Gf[t.name],n=Object.assign({},t);for(const i in e)t.hasOwnProperty(i)||(n[i]=e[i]);t=n}return"string"==typeof t.icon&&$f[t.icon]&&(t.icon=$f[t.icon]),t}class Jf extends $l{static get pluginName(){return"ImageStyleEditing"}init(){const t=this.editor,e=t.model.schema,n=t.data,i=t.editing;t.config.define("image.styles",["full","side"]);const o=Qf(t.config.get("image.styles"));e.extend("image",{allowAttributes:"imageStyle"});const r=function(t){return(e,n,i)=>{if(!i.consumable.consume(n.item,e.name))return;const o=Uf(n.attributeNewValue,t),r=Uf(n.attributeOldValue,t),s=i.mapper.toViewElement(n.item),a=i.writer;r&&a.removeClass(r.className,s),o&&a.addClass(o.className,s)}}(o);i.downcastDispatcher.on("attribute:imageStyle:image",r),n.downcastDispatcher.on("attribute:imageStyle:image",r),n.upcastDispatcher.on("element:figure",function(t){const e=t.filter(t=>!t.isDefault);return(t,n,i)=>{if(!n.modelRange)return;const o=n.viewItem,r=mu(n.modelRange.getItems());if(i.schema.checkAttribute(r,"imageStyle"))for(const t of e)i.consumable.consume(o,{classes:t.className})&&i.writer.setAttribute("imageStyle",t.name,r)}}(o),{priority:"low"}),t.commands.add("imageStyle",new Ff(t,o))}}n(72);class Zf extends $l{static get pluginName(){return"ImageStyleUI"}get localizedDefaultStylesTitles(){const t=this.editor.t;return{"Full size image":t("Full size image"),"Side image":t("Side image"),"Left aligned image":t("Left aligned image"),"Centered image":t("Centered image"),"Right aligned image":t("Right aligned image")}}init(){const t=function(t,e){for(const n of t)e[n.title]&&(n.title=e[n.title]);return t}(Qf(this.editor.config.get("image.styles")),this.localizedDefaultStylesTitles);for(const e of t)this._createButton(e)}_createButton(t){const e=this.editor,n="imageStyle:"+t.name;e.ui.componentFactory.add(n,n=>{const i=e.commands.get("imageStyle"),o=new Nl(n);return o.set({label:t.title,icon:t.icon,tooltip:!0,isToggleable:!0}),o.bind("isEnabled").to(i,"isEnabled"),o.bind("isOn").to(i,"value",e=>e===t.name),this.listenTo(o,"execute",()=>{e.execute("imageStyle",{value:t.name}),e.editing.view.focus()}),o})}}class Xf extends $l{static get requires(){return[tf]}static get pluginName(){return"WidgetToolbarRepository"}init(){const t=this.editor;if(t.plugins.has("BalloonToolbar")){const e=t.plugins.get("BalloonToolbar");this.listenTo(e,"show",e=>{(function(t){const e=t.getSelectedElement();return!(!e||!Pu(e))})(t.editing.view.document.selection)&&e.stop()},{priority:"high"})}this._toolbarDefinitions=new Map,this._balloon=this.editor.plugins.get("ContextualBalloon"),this.on("change:isEnabled",()=>{this._updateToolbarsVisibility()}),this.listenTo(t.ui,"update",()=>{this._updateToolbarsVisibility()}),this.listenTo(t.ui.focusTracker,"change:isFocused",()=>{this._updateToolbarsVisibility()},{priority:"low"})}destroy(){super.destroy();for(const t of this._toolbarDefinitions.values())t.view.destroy()}register(t,{ariaLabel:e,items:n,getRelatedElement:i,balloonClassName:o="ck-toolbar-container"}){const r=this.editor,s=r.t,a=new Ul(r.locale);if(a.ariaLabel=e||s("Widget toolbar"),this._toolbarDefinitions.has(t))throw new hn.b("widget-toolbar-duplicated: Toolbar with the given id was already added.",this,{toolbarId:t});a.fillFromConfig(n,r.ui.componentFactory),this._toolbarDefinitions.set(t,{view:a,getRelatedElement:i,balloonClassName:o})}_updateToolbarsVisibility(){let t=0,e=null,n=null;for(const i of this._toolbarDefinitions.values()){const o=i.getRelatedElement(this.editor.editing.view.document.selection);if(this.isEnabled&&o)if(this.editor.ui.focusTracker.isFocused){const r=o.getAncestors().length;r>t&&(t=r,e=o,n=i)}else this._isToolbarVisible(i)&&this._hideToolbar(i);else this._isToolbarInBalloon(i)&&this._hideToolbar(i)}n&&this._showToolbar(n,e)}_hideToolbar(t){this._balloon.remove(t.view),this.stopListening(this._balloon,"change:visibleView")}_showToolbar(t,e){this._isToolbarVisible(t)?tm(this.editor,e):this._isToolbarInBalloon(t)||(this._balloon.add({view:t.view,position:em(this.editor,e),balloonClassName:t.balloonClassName}),this.listenTo(this._balloon,"change:visibleView",()=>{for(const t of this._toolbarDefinitions.values())if(this._isToolbarVisible(t)){const e=t.getRelatedElement(this.editor.editing.view.document.selection);tm(this.editor,e)}}))}_isToolbarVisible(t){return this._balloon.visibleView===t.view}_isToolbarInBalloon(t){return this._balloon.hasView(t.view)}}function tm(t,e){const n=t.plugins.get("ContextualBalloon"),i=em(t,e);n.updatePosition(i)}function em(t,e){const n=t.editing.view,i=Qh.defaultPositions;return{target:n.domConverter.mapViewToDom(e),positions:[i.northArrowSouth,i.northArrowSouthWest,i.northArrowSouthEast,i.southArrowNorth,i.southArrowNorthWest,i.southArrowNorthEast]}}class nm extends td{constructor(t){super(t),this._childCommands=[]}refresh(){}execute(...t){this._getFirstEnabledCommand().execute(t)}registerChildCommand(t){this._childCommands.push(t),t.on("change:isEnabled",()=>this._checkEnabled()),this._checkEnabled()}_checkEnabled(){this.isEnabled=!!this._getFirstEnabledCommand()}_getFirstEnabledCommand(){return this._childCommands.find(t=>t.isEnabled)}}class im extends $l{static get pluginName(){return"IndentEditing"}init(){const t=this.editor;t.commands.add("indent",new nm(t)),t.commands.add("outdent",new nm(t))}}var om='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm5 6c0 .414.336.75.75.75h9.5a.75.75 0 1 0 0-1.5h-9.5a.75.75 0 0 0-.75.75zM2.75 16.5h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 1 0 0 1.5zM1.632 6.95L5.02 9.358a.4.4 0 0 1-.013.661l-3.39 2.207A.4.4 0 0 1 1 11.892V7.275a.4.4 0 0 1 .632-.326z"/></svg>',rm='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm5 6c0 .414.336.75.75.75h9.5a.75.75 0 1 0 0-1.5h-9.5a.75.75 0 0 0-.75.75zM2.75 16.5h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 1 0 0 1.5zm1.618-9.55L.98 9.358a.4.4 0 0 0 .013.661l3.39 2.207A.4.4 0 0 0 5 11.892V7.275a.4.4 0 0 0-.632-.326z"/></svg>';class sm extends $l{static get pluginName(){return"IndentUI"}init(){const t=this.editor,e=t.locale,n=t.t,i="ltr"==e.uiLanguageDirection?om:rm,o="ltr"==e.uiLanguageDirection?rm:om;this._defineButton("indent",n("Increase indent"),i),this._defineButton("outdent",n("Decrease indent"),o)}_defineButton(t,e,n){const i=this.editor;i.ui.componentFactory.add(t,o=>{const r=i.commands.get(t),s=new Nl(o);return s.set({label:e,icon:n,tooltip:!0}),s.bind("isOn","isEnabled").to(r,"value","isEnabled"),this.listenTo(s,"execute",()=>{i.execute(t),i.editing.view.focus()}),s})}}class am extends Nr{constructor(t){super(t),this.domEventType="click"}onDomEvent(t){this.fire(t.type,t)}}n(74);class cm extends cl{constructor(t,e){super(t);const n=t.t;this.focusTracker=new Oc,this.keystrokes=new Ac,this.urlInputView=this._createUrlInput(),this.saveButtonView=this._createButton(n("Save"),qh,"ck-button-save"),this.saveButtonView.type="submit",this.cancelButtonView=this._createButton(n("Cancel"),Wh,"ck-button-cancel","cancel"),this._manualDecoratorSwitches=this._createManualDecoratorSwitches(e),this.children=this._createFormChildren(e.manualDecorators),this._focusables=new Uc,this._focusCycler=new kl({focusables:this._focusables,focusTracker:this.focusTracker,keystrokeHandler:this.keystrokes,actions:{focusPrevious:"shift + tab",focusNext:"tab"}});const i=["ck","ck-link-form"];e.manualDecorators.length&&i.push("ck-link-form_layout-vertical"),this.setTemplate({tag:"form",attributes:{class:i,tabindex:"-1"},children:this.children})}getDecoratorSwitchesState(){return Array.from(this._manualDecoratorSwitches).reduce((t,e)=>(t[e.name]=e.isOn,t),{})}render(){super.render(),Hh({view:this}),[this.urlInputView,...this._manualDecoratorSwitches,this.saveButtonView,this.cancelButtonView].forEach(t=>{this._focusables.add(t),this.focusTracker.add(t.element)}),this.keystrokes.listenTo(this.element)}focus(){this._focusCycler.focusFirst()}_createUrlInput(){const t=this.locale.t,e=new Bh(this.locale,Uh);return e.label=t("Link URL"),e.fieldView.placeholder="https://example.com",e}_createButton(t,e,n,i){const o=new Nl(this.locale);return o.set({label:t,icon:e,tooltip:!0}),o.extendTemplate({attributes:{class:n}}),i&&o.delegate("execute").to(this,i),o}_createManualDecoratorSwitches(t){const e=this.createCollection();for(const n of t.manualDecorators){const i=new Vl(this.locale);i.set({name:n.id,label:n.label,withText:!0}),i.bind("isOn").toMany([n,t],"value",(t,e)=>void 0===e&&void 0===t?n.defaultValue:t),i.on("execute",()=>{n.set("value",!i.isOn)}),e.add(i)}return e}_createFormChildren(t){const e=this.createCollection();if(e.add(this.urlInputView),t.length){const t=new cl;t.setTemplate({tag:"ul",children:this._manualDecoratorSwitches.map(t=>({tag:"li",children:[t],attributes:{class:["ck","ck-list__item"]}})),attributes:{class:["ck","ck-reset","ck-list"]}}),e.add(t)}return e.add(this.saveButtonView),e.add(this.cancelButtonView),e}}n(76);class lm extends cl{constructor(t){super(t);const e=t.t;this.focusTracker=new Oc,this.keystrokes=new Ac,this.previewButtonView=this._createPreviewButton(),this.unlinkButtonView=this._createButton(e("Unlink"),'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.077 15l.991-1.416a.75.75 0 1 1 1.229.86l-1.148 1.64a.748.748 0 0 1-.217.206 5.251 5.251 0 0 1-8.503-5.955.741.741 0 0 1 .12-.274l1.147-1.639a.75.75 0 1 1 1.228.86L4.933 10.7l.006.003a3.75 3.75 0 0 0 6.132 4.294l.006.004zm5.494-5.335a.748.748 0 0 1-.12.274l-1.147 1.639a.75.75 0 1 1-1.228-.86l.86-1.23a3.75 3.75 0 0 0-6.144-4.301l-.86 1.229a.75.75 0 0 1-1.229-.86l1.148-1.64a.748.748 0 0 1 .217-.206 5.251 5.251 0 0 1 8.503 5.955zm-4.563-2.532a.75.75 0 0 1 .184 1.045l-3.155 4.505a.75.75 0 1 1-1.229-.86l3.155-4.506a.75.75 0 0 1 1.045-.184zm4.919 10.562l-1.414 1.414a.75.75 0 1 1-1.06-1.06l1.414-1.415-1.415-1.414a.75.75 0 0 1 1.061-1.06l1.414 1.414 1.414-1.415a.75.75 0 0 1 1.061 1.061l-1.414 1.414 1.414 1.415a.75.75 0 0 1-1.06 1.06l-1.415-1.414z"/></svg>',"unlink"),this.editButtonView=this._createButton(e("Edit link"),'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.3 17.37l-.061.088a1.518 1.518 0 0 1-.934.535l-4.178.663-.806-4.153a1.495 1.495 0 0 1 .187-1.058l.056-.086L8.77 2.639c.958-1.351 2.803-1.076 4.296-.03 1.497 1.047 2.387 2.693 1.433 4.055L7.3 17.37zM9.14 4.728l-5.545 8.346 3.277 2.294 5.544-8.346L9.14 4.728zM6.07 16.512l-3.276-2.295.53 2.73 2.746-.435zM9.994 3.506L13.271 5.8c.316-.452-.16-1.333-1.065-1.966-.905-.634-1.895-.78-2.212-.328zM8 18.5L9.375 17H19v1.5H8z"/></svg>',"edit"),this.set("href"),this._focusables=new Uc,this._focusCycler=new kl({focusables:this._focusables,focusTracker:this.focusTracker,keystrokeHandler:this.keystrokes,actions:{focusPrevious:"shift + tab",focusNext:"tab"}}),this.setTemplate({tag:"div",attributes:{class:["ck","ck-link-actions"],tabindex:"-1"},children:[this.previewButtonView,this.editButtonView,this.unlinkButtonView]})}render(){super.render(),[this.previewButtonView,this.editButtonView,this.unlinkButtonView].forEach(t=>{this._focusables.add(t),this.focusTracker.add(t.element)}),this.keystrokes.listenTo(this.element)}focus(){this._focusCycler.focusFirst()}_createButton(t,e,n){const i=new Nl(this.locale);return i.set({label:t,icon:e,tooltip:!0}),i.delegate("execute").to(this,n),i}_createPreviewButton(){const t=new Nl(this.locale),e=this.bindTemplate,n=this.t;return t.set({withText:!0,tooltip:n("Open link in new tab")}),t.extendTemplate({attributes:{class:["ck","ck-link-actions__preview"],href:e.to("href",t=>t&&hh(t)),target:"_blank",rel:"noopener noreferrer"}}),t.bind("label").to(this,"href",t=>t||n("This link has no URL")),t.bind("isEnabled").to(this,"href",t=>!!t),t.template.tag="a",t.template.eventListeners={},t}}class dm extends $l{static get requires(){return[tf]}static get pluginName(){return"LinkUI"}init(){const t=this.editor;t.editing.view.addObserver(am),this.actionsView=this._createActionsView(),this.formView=this._createFormView(),this._balloon=t.plugins.get(tf),this._createToolbarLinkButton(),this._enableUserBalloonInteractions()}destroy(){super.destroy(),this.formView.destroy()}_createActionsView(){const t=this.editor,e=new lm(t.locale),n=t.commands.get("link"),i=t.commands.get("unlink");return e.bind("href").to(n,"value"),e.editButtonView.bind("isEnabled").to(n),e.unlinkButtonView.bind("isEnabled").to(i),this.listenTo(e,"edit",()=>{this._addFormView()}),this.listenTo(e,"unlink",()=>{t.execute("unlink"),this._hideUI()}),e.keystrokes.set("Esc",(t,e)=>{this._hideUI(),e()}),e.keystrokes.set("Ctrl+K",(t,e)=>{this._addFormView(),e()}),e}_createFormView(){const t=this.editor,e=t.commands.get("link"),n=new cm(t.locale,e);return n.urlInputView.fieldView.bind("value").to(e,"value"),n.urlInputView.bind("isReadOnly").to(e,"isEnabled",t=>!t),n.saveButtonView.bind("isEnabled").to(e),this.listenTo(n,"submit",()=>{t.execute("link",n.urlInputView.fieldView.element.value,n.getDecoratorSwitchesState()),this._closeFormView()}),this.listenTo(n,"cancel",()=>{this._closeFormView()}),n.keystrokes.set("Esc",(t,e)=>{this._closeFormView(),e()}),n}_createToolbarLinkButton(){const t=this.editor,e=t.commands.get("link"),n=t.t;t.keystrokes.set("Ctrl+K",(t,e)=>{e(),this._showUI(!0)}),t.ui.componentFactory.add("link",t=>{const i=new Nl(t);return i.isEnabled=!0,i.label=n("Link"),i.icon='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.077 15l.991-1.416a.75.75 0 1 1 1.229.86l-1.148 1.64a.748.748 0 0 1-.217.206 5.251 5.251 0 0 1-8.503-5.955.741.741 0 0 1 .12-.274l1.147-1.639a.75.75 0 1 1 1.228.86L4.933 10.7l.006.003a3.75 3.75 0 0 0 6.132 4.294l.006.004zm5.494-5.335a.748.748 0 0 1-.12.274l-1.147 1.639a.75.75 0 1 1-1.228-.86l.86-1.23a3.75 3.75 0 0 0-6.144-4.301l-.86 1.229a.75.75 0 0 1-1.229-.86l1.148-1.64a.748.748 0 0 1 .217-.206 5.251 5.251 0 0 1 8.503 5.955zm-4.563-2.532a.75.75 0 0 1 .184 1.045l-3.155 4.505a.75.75 0 1 1-1.229-.86l3.155-4.506a.75.75 0 0 1 1.045-.184z"/></svg>',i.keystroke="Ctrl+K",i.tooltip=!0,i.isToggleable=!0,i.bind("isEnabled").to(e,"isEnabled"),i.bind("isOn").to(e,"value",t=>!!t),this.listenTo(i,"execute",()=>this._showUI(!0)),i})}_enableUserBalloonInteractions(){const t=this.editor.editing.view.document;this.listenTo(t,"click",()=>{this._getSelectedLinkElement()&&this._showUI()}),this.editor.keystrokes.set("Tab",(t,e)=>{this._areActionsVisible&&!this.actionsView.focusTracker.isFocused&&(this.actionsView.focus(),e())},{priority:"high"}),this.editor.keystrokes.set("Esc",(t,e)=>{this._isUIVisible&&(this._hideUI(),e())}),zl({emitter:this.formView,activator:()=>this._isUIInPanel,contextElements:[this._balloon.view.element],callback:()=>this._hideUI()})}_addActionsView(){this._areActionsInPanel||this._balloon.add({view:this.actionsView,position:this._getBalloonPositionData()})}_addFormView(){if(this._isFormInPanel)return;const t=this.editor.commands.get("link");this._balloon.add({view:this.formView,position:this._getBalloonPositionData()}),this._balloon.visibleView===this.formView&&this.formView.urlInputView.fieldView.select(),this.formView.urlInputView.fieldView.element.value=t.value||""}_closeFormView(){const t=this.editor.commands.get("link");t.restoreManualDecoratorStates(),void 0!==t.value?this._removeFormView():this._hideUI()}_removeFormView(){this._isFormInPanel&&(this.formView.saveButtonView.focus(),this._balloon.remove(this.formView),this.editor.editing.view.focus())}_showUI(t=!1){this._getSelectedLinkElement()?(this._areActionsVisible?this._addFormView():this._addActionsView(),t&&this._balloon.showStack("main")):(this._addActionsView(),t&&this._balloon.showStack("main"),this._addFormView()),this._startUpdatingUI()}_hideUI(){if(!this._isUIInPanel)return;const t=this.editor;this.stopListening(t.ui,"update"),this.stopListening(this._balloon,"change:visibleView"),t.editing.view.focus(),this._removeFormView(),this._balloon.remove(this.actionsView)}_startUpdatingUI(){const t=this.editor,e=t.editing.view.document;let n=this._getSelectedLinkElement(),i=r();const o=()=>{const t=this._getSelectedLinkElement(),e=r();n&&!t||!n&&e!==i?this._hideUI():this._isUIVisible&&this._balloon.updatePosition(this._getBalloonPositionData()),n=t,i=e};function r(){return e.selection.focus.getAncestors().reverse().find(t=>t.is("element"))}this.listenTo(t.ui,"update",o),this.listenTo(this._balloon,"change:visibleView",o)}get _isFormInPanel(){return this._balloon.hasView(this.formView)}get _areActionsInPanel(){return this._balloon.hasView(this.actionsView)}get _areActionsVisible(){return this._balloon.visibleView===this.actionsView}get _isUIInPanel(){return this._isFormInPanel||this._areActionsInPanel}get _isUIVisible(){return this._balloon.visibleView==this.formView||this._areActionsVisible}_getBalloonPositionData(){const t=this.editor.editing.view,e=t.document,n=this._getSelectedLinkElement();return{target:n?t.domConverter.mapViewToDom(n):t.domConverter.viewRangeToDom(e.selection.getFirstRange())}}_getSelectedLinkElement(){const t=this.editor.editing.view,e=t.document.selection;if(e.isCollapsed)return um(e.getFirstPosition());{const n=e.getFirstRange().getTrimmed(),i=um(n.start),o=um(n.end);return i&&i==o&&t.createRangeIn(i).getTrimmed().isEqual(n)?i:null}}}function um(t){return t.getAncestors().find(t=>{return(e=t).is("attributeElement")&&!!e.getCustomProperty("link");var e})}class hm extends td{constructor(t,e){super(t),this.type=e}refresh(){this.value=this._getValue(),this.isEnabled=this._checkEnabled()}execute(){const t=this.editor.model,e=t.document,n=Array.from(e.selection.getSelectedBlocks()).filter(e=>mm(e,t.schema)),i=!0===this.value;t.change(t=>{if(i){let e=n[n.length-1].nextSibling,i=Number.POSITIVE_INFINITY,o=[];for(;e&&"listItem"==e.name&&0!==e.getAttribute("listIndent");){const t=e.getAttribute("listIndent");t<i&&(i=t);const n=t-i;o.push({element:e,listIndent:n}),e=e.nextSibling}o=o.reverse();for(const e of o)t.setAttribute("listIndent",e.listIndent,e.element)}if(!i){let t=Number.POSITIVE_INFINITY;for(const e of n)e.is("listItem")&&e.getAttribute("listIndent")<t&&(t=e.getAttribute("listIndent"));t=0===t?1:t,fm(n,!0,t),fm(n,!1,t)}for(const e of n.reverse())i&&"listItem"==e.name?t.rename(e,"paragraph"):i||"listItem"==e.name?i||"listItem"!=e.name||e.getAttribute("listType")==this.type||t.setAttribute("listType",this.type,e):(t.setAttributes({listType:this.type,listIndent:0},e),t.rename(e,"listItem"))})}_getValue(){const t=mu(this.editor.model.document.selection.getSelectedBlocks());return!!t&&t.is("listItem")&&t.getAttribute("listType")==this.type}_checkEnabled(){if(this.value)return!0;const t=this.editor.model.document.selection,e=this.editor.model.schema,n=mu(t.getSelectedBlocks());return!!n&&mm(n,e)}}function fm(t,e,n){const i=e?t[0]:t[t.length-1];if(i.is("listItem")){let o=i[e?"previousSibling":"nextSibling"],r=i.getAttribute("listIndent");for(;o&&o.is("listItem")&&o.getAttribute("listIndent")>=n;)r>o.getAttribute("listIndent")&&(r=o.getAttribute("listIndent")),o.getAttribute("listIndent")==r&&t[e?"unshift":"push"](o),o=o[e?"previousSibling":"nextSibling"]}}function mm(t,e){return e.checkChild(t.parent,"listItem")&&!e.isObject(t)}class gm extends td{constructor(t,e){super(t),this._indentBy="forward"==e?1:-1}refresh(){this.isEnabled=this._checkEnabled()}execute(){const t=this.editor.model,e=t.document;let n=Array.from(e.selection.getSelectedBlocks());t.change(t=>{const e=n[n.length-1];let i=e.nextSibling;for(;i&&"listItem"==i.name&&i.getAttribute("listIndent")>e.getAttribute("listIndent");)n.push(i),i=i.nextSibling;this._indentBy<0&&(n=n.reverse());for(const e of n){const n=e.getAttribute("listIndent")+this._indentBy;n<0?t.rename(e,"paragraph"):t.setAttribute("listIndent",n,e)}})}_checkEnabled(){const t=mu(this.editor.model.document.selection.getSelectedBlocks());if(!t||!t.is("listItem"))return!1;if(this._indentBy>0){const e=t.getAttribute("listIndent"),n=t.getAttribute("listType");let i=t.previousSibling;for(;i&&i.is("listItem")&&i.getAttribute("listIndent")>=e;){if(i.getAttribute("listIndent")==e)return i.getAttribute("listType")==n;i=i.previousSibling}return!1}return!0}}function pm(t,e){const n=e.mapper,i=e.writer,o="numbered"==t.getAttribute("listType")?"ol":"ul",r=function(t){const e=t.createContainerElement("li");return e.getFillerOffset=ym,e}(i),s=i.createContainerElement(o,null);return i.insert(i.createPositionAt(s,0),r),n.bindElements(t,r),r}function bm(t,e,n,i){const o=e.parent,r=n.mapper,s=n.writer;let a=r.toViewPosition(i.createPositionBefore(t));const c=_m(t.previousSibling,{sameIndent:!0,smallerIndent:!0,listIndent:t.getAttribute("listIndent")}),l=t.previousSibling;if(c&&c.getAttribute("listIndent")==t.getAttribute("listIndent")){const t=r.toViewElement(c);a=s.breakContainer(s.createPositionAfter(t))}else a=l&&"listItem"==l.name?r.toViewPosition(i.createPositionAt(l,"end")):r.toViewPosition(i.createPositionBefore(t));if(a=km(a),s.insert(a,o),l&&"listItem"==l.name){const t=r.toViewElement(l),n=s.createRange(s.createPositionAt(t,0),a).getWalker({ignoreElementEnd:!0});for(const t of n)if(t.item.is("li")){const i=s.breakContainer(s.createPositionBefore(t.item)),o=t.item.parent,r=s.createPositionAt(e,"end");wm(s,r.nodeBefore,r.nodeAfter),s.move(s.createRangeOn(o),r),n.position=i}}else{const n=o.nextSibling;if(n&&(n.is("ul")||n.is("ol"))){let i=null;for(const e of n.getChildren()){const n=r.toModelElement(e);if(!(n&&n.getAttribute("listIndent")>t.getAttribute("listIndent")))break;i=e}i&&(s.breakContainer(s.createPositionAfter(i)),s.move(s.createRangeOn(i.parent),s.createPositionAt(e,"end")))}}wm(s,o,o.nextSibling),wm(s,o.previousSibling,o)}function wm(t,e,n){return!e||!n||"ul"!=e.name&&"ol"!=e.name||e.name!=n.name||e.getAttribute("class")!==n.getAttribute("class")?null:t.mergeContainers(t.createPositionAfter(e))}function km(t){return t.getLastMatchingPosition(t=>t.item.is("uiElement"))}function _m(t,e){const n=!!e.sameIndent,i=!!e.smallerIndent,o=e.listIndent;let r=t;for(;r&&"listItem"==r.name;){const t=r.getAttribute("listIndent");if(n&&o==t||i&&o>t)return r;r=r.previousSibling}return null}function vm(t,e,n,i){t.ui.componentFactory.add(e,o=>{const r=t.commands.get(e),s=new Nl(o);return s.set({label:n,icon:i,tooltip:!0,isToggleable:!0}),s.bind("isOn","isEnabled").to(r,"value","isEnabled"),s.on("execute",()=>{t.execute(e),t.editing.view.focus()}),s})}function ym(){const t=!this.isEmpty&&("ul"==this.getChild(0).name||"ol"==this.getChild(0).name);return this.isEmpty||t?0:Li.call(this)}function xm(t){return(e,n,i)=>{const o=i.consumable;if(!o.test(n.item,"insert")||!o.test(n.item,"attribute:listType")||!o.test(n.item,"attribute:listIndent"))return;o.consume(n.item,"insert"),o.consume(n.item,"attribute:listType"),o.consume(n.item,"attribute:listIndent");const r=n.item;bm(r,pm(r,i),i,t)}}function Am(t,e,n){if(!n.consumable.consume(e.item,"attribute:listType"))return;const i=n.mapper.toViewElement(e.item),o=n.writer;o.breakContainer(o.createPositionBefore(i)),o.breakContainer(o.createPositionAfter(i));const r=i.parent,s="numbered"==e.attributeNewValue?"ol":"ul";o.rename(s,r)}function Tm(t,e,n){const i=n.mapper.toViewElement(e.item).parent,o=n.writer;wm(o,i,i.nextSibling),wm(o,i.previousSibling,i);for(const t of e.item.getChildren())n.consumable.consume(t,"insert")}function Cm(t,e,n){if("listItem"!=e.item.name){let t=n.mapper.toViewPosition(e.range.start);const i=n.writer,o=[];for(;("ul"==t.parent.name||"ol"==t.parent.name)&&(t=i.breakContainer(t),"li"==t.parent.name);){const e=t,n=i.createPositionAt(t.parent,"end");if(!e.isEqual(n)){const t=i.remove(i.createRange(e,n));o.push(t)}t=i.createPositionAfter(t.parent)}if(o.length>0){for(let e=0;e<o.length;e++){const n=t.nodeBefore;if(t=i.insert(t,o[e]).end,e>0){const e=wm(i,n,n.nextSibling);e&&e.parent==n&&t.offset--}}wm(i,t.nodeBefore,t.nodeAfter)}}}function Pm(t,e,n){const i=n.mapper.toViewPosition(e.position),o=i.nodeBefore,r=i.nodeAfter;wm(n.writer,o,r)}function Sm(t,e,n){if(n.consumable.consume(e.viewItem,{name:!0})){const t=n.writer,i=t.createElement("listItem"),o=function(t){let e=0,n=t.parent;for(;n;){if(n.is("li"))e++;else{const t=n.previousSibling;t&&t.is("li")&&e++}n=n.parent}return e}(e.viewItem);t.setAttribute("listIndent",o,i);const r=e.viewItem.parent&&"ol"==e.viewItem.parent.name?"numbered":"bulleted";t.setAttribute("listType",r,i);const s=n.splitToAllowedParent(i,e.modelCursor);if(!s)return;t.insert(i,s.position);const a=function(t,e,n){const{writer:i,schema:o}=n;let r=i.createPositionAfter(t);for(const s of e)if("ul"==s.name||"ol"==s.name)r=n.convertItem(s,r).modelCursor;else{const e=n.convertItem(s,i.createPositionAt(t,"end")),a=e.modelRange.start.nodeAfter;a&&a.is("element")&&!o.checkChild(t,a.name)&&(t=e.modelCursor.parent.is("listItem")?e.modelCursor.parent:Om(e.modelCursor),r=i.createPositionAfter(t))}return r}(i,e.viewItem.getChildren(),n);e.modelRange=t.createRange(e.modelCursor,a),s.cursorParent?e.modelCursor=t.createPositionAt(s.cursorParent,0):e.modelCursor=e.modelRange.end}}function Mm(t,e,n){if(n.consumable.test(e.viewItem,{name:!0})){const t=Array.from(e.viewItem.getChildren());for(const e of t){!(e.is("li")||Dm(e))&&e._remove()}}}function Em(t,e,n){if(n.consumable.test(e.viewItem,{name:!0})){if(0===e.viewItem.childCount)return;const t=[...e.viewItem.getChildren()];let n=!1,i=!0;for(const e of t)n&&!Dm(e)&&e._remove(),e.is("text")?(i&&(e._data=e.data.replace(/^\s+/,"")),e.nextSibling&&!Dm(e.nextSibling)||(e._data=e.data.replace(/\s+$/,""))):Dm(e)&&(n=!0),i=!1}}function Im(t){return(e,n)=>{if(n.isPhantom)return;const i=n.modelPosition.nodeBefore;if(i&&i.is("listItem")){const e=n.mapper.toViewElement(i),o=e.getAncestors().find(Dm),r=t.createPositionAt(e,0).getWalker();for(const t of r){if("elementStart"==t.type&&t.item.is("li")){n.viewPosition=t.previousPosition;break}if("elementEnd"==t.type&&t.item==o){n.viewPosition=t.nextPosition;break}}}}}function Nm(t,[e,n]){let i,o=e.is("documentFragment")?e.getChild(0):e;if(i=n?this.createSelection(n):this.document.selection,o&&o.is("listItem")){const t=i.getFirstPosition();let e=null;if(t.parent.is("listItem")?e=t.parent:t.nodeBefore&&t.nodeBefore.is("listItem")&&(e=t.nodeBefore),e){const t=e.getAttribute("listIndent");if(t>0)for(;o&&o.is("listItem");)o._setAttribute("listIndent",o.getAttribute("listIndent")+t),o=o.nextSibling}}}function Om(t){const e=new bs({startPosition:t});let n;do{n=e.next()}while(!n.value.item.is("listItem"));return n.value.item}function Rm(t,e,n,i,o,r){const s=_m(e.nodeBefore,{sameIndent:!0,smallerIndent:!0,listIndent:t,foo:"b"}),a=o.mapper,c=o.writer,l=s?s.getAttribute("listIndent"):null;let d;if(s)if(l==t){const t=a.toViewElement(s).parent;d=c.createPositionAfter(t)}else{const t=r.createPositionAt(s,"end");d=a.toViewPosition(t)}else d=n;d=km(d);for(const t of[...i.getChildren()])Dm(t)&&(d=c.move(c.createRangeOn(t),d).end,wm(c,t,t.nextSibling),wm(c,t.previousSibling,t))}function Dm(t){return t.is("ol")||t.is("ul")}class Lm extends $l{static get pluginName(){return"ListEditing"}static get requires(){return[Cf]}init(){const t=this.editor;t.model.schema.register("listItem",{inheritAllFrom:"$block",allowAttributes:["listType","listIndent"]});const e=t.data,n=t.editing;var i;t.model.document.registerPostFixer(e=>function(t,e){const n=t.document.differ.getChanges(),i=new Map;let o=!1;for(const i of n)if("insert"==i.type&&"listItem"==i.name)r(i.position);else if("insert"==i.type&&"listItem"!=i.name){if("$text"!=i.name){const n=i.position.nodeAfter;n.hasAttribute("listIndent")&&(e.removeAttribute("listIndent",n),o=!0),n.hasAttribute("listType")&&(e.removeAttribute("listType",n),o=!0);for(const e of Array.from(t.createRangeIn(n)).filter(t=>t.item.is("listItem")))r(e.previousPosition)}r(i.position.getShiftedBy(i.length))}else"remove"==i.type&&"listItem"==i.name?r(i.position):("attribute"==i.type&&"listIndent"==i.attributeKey||"attribute"==i.type&&"listType"==i.attributeKey)&&r(i.range.start);for(const t of i.values())s(t),a(t);return o;function r(t){const e=t.nodeBefore;if(e&&e.is("listItem")){let t=e;if(i.has(t))return;for(let e=t.previousSibling;e&&e.is("listItem");e=t.previousSibling)if(t=e,i.has(t))return;i.set(e,t)}else{const e=t.nodeAfter;e&&e.is("listItem")&&i.set(e,e)}}function s(t){let n=0,i=null;for(;t&&t.is("listItem");){const r=t.getAttribute("listIndent");if(r>n){let s;null===i?(i=r-n,s=n):(i>r&&(i=r),s=r-i),e.setAttribute("listIndent",s,t),o=!0}else i=null,n=t.getAttribute("listIndent")+1;t=t.nextSibling}}function a(t){let n=[],i=null;for(;t&&t.is("listItem");){const r=t.getAttribute("listIndent");if(i&&i.getAttribute("listIndent")>r&&(n=n.slice(0,r+1)),0!=r)if(n[r]){const i=n[r];t.getAttribute("listType")!=i&&(e.setAttribute("listType",i,t),o=!0)}else n[r]=t.getAttribute("listType");i=t,t=t.nextSibling}}}(t.model,e)),n.mapper.registerViewToModelLength("li",jm),e.mapper.registerViewToModelLength("li",jm),n.mapper.on("modelToViewPosition",Im(n.view)),n.mapper.on("viewToModelPosition",(i=t.model,(t,e)=>{const n=e.viewPosition,o=n.parent,r=e.mapper;if("ul"==o.name||"ol"==o.name){if(n.isAtEnd){const t=r.toModelElement(n.nodeBefore),o=r.getModelLength(n.nodeBefore);e.modelPosition=i.createPositionBefore(t).getShiftedBy(o)}else{const t=r.toModelElement(n.nodeAfter);e.modelPosition=i.createPositionBefore(t)}t.stop()}else if("li"==o.name&&n.nodeBefore&&("ul"==n.nodeBefore.name||"ol"==n.nodeBefore.name)){const s=r.toModelElement(o);let a=1,c=n.nodeBefore;for(;c&&Dm(c);)a+=r.getModelLength(c),c=c.previousSibling;e.modelPosition=i.createPositionBefore(s).getShiftedBy(a),t.stop()}})),e.mapper.on("modelToViewPosition",Im(n.view)),t.conversion.for("editingDowncast").add(e=>{e.on("insert",Cm,{priority:"high"}),e.on("insert:listItem",xm(t.model)),e.on("attribute:listType:listItem",Am,{priority:"high"}),e.on("attribute:listType:listItem",Tm,{priority:"low"}),e.on("attribute:listIndent:listItem",function(t){return(e,n,i)=>{if(!i.consumable.consume(n.item,"attribute:listIndent"))return;const o=i.mapper.toViewElement(n.item),r=i.writer;r.breakContainer(r.createPositionBefore(o)),r.breakContainer(r.createPositionAfter(o));const s=o.parent,a=s.previousSibling,c=r.createRangeOn(s);r.remove(c),a&&a.nextSibling&&wm(r,a,a.nextSibling),Rm(n.attributeOldValue+1,n.range.start,c.start,o,i,t),bm(n.item,o,i,t);for(const t of n.item.getChildren())i.consumable.consume(t,"insert")}}(t.model)),e.on("remove:listItem",function(t){return(e,n,i)=>{const o=i.mapper.toViewPosition(n.position).getLastMatchingPosition(t=>!t.item.is("li")).nodeAfter,r=i.writer;r.breakContainer(r.createPositionBefore(o)),r.breakContainer(r.createPositionAfter(o));const s=o.parent,a=s.previousSibling,c=r.createRangeOn(s),l=r.remove(c);a&&a.nextSibling&&wm(r,a,a.nextSibling),Rm(i.mapper.toModelElement(o).getAttribute("listIndent")+1,n.position,c.start,o,i,t);for(const t of r.createRangeIn(l).getItems())i.mapper.unbindViewElement(t);e.stop()}}(t.model)),e.on("remove",Pm,{priority:"low"})}),t.conversion.for("dataDowncast").add(e=>{e.on("insert",Cm,{priority:"high"}),e.on("insert:listItem",xm(t.model))}),t.conversion.for("upcast").add(t=>{t.on("element:ul",Mm,{priority:"high"}),t.on("element:ol",Mm,{priority:"high"}),t.on("element:li",Em,{priority:"high"}),t.on("element:li",Sm)}),t.model.on("insertContent",Nm,{priority:"high"}),t.commands.add("numberedList",new hm(t,"numbered")),t.commands.add("bulletedList",new hm(t,"bulleted")),t.commands.add("indentList",new gm(t,"forward")),t.commands.add("outdentList",new gm(t,"backward"));const o=n.view.document;this.listenTo(o,"enter",(t,e)=>{const n=this.editor.model.document,i=n.selection.getLastPosition().parent;n.selection.isCollapsed&&"listItem"==i.name&&i.isEmpty&&(this.editor.execute("outdentList"),e.preventDefault(),t.stop())}),this.listenTo(o,"delete",(t,e)=>{if("backward"!==e.direction)return;const n=this.editor.model.document.selection;if(!n.isCollapsed)return;const i=n.getFirstPosition();if(!i.isAtStart)return;const o=i.parent;"listItem"===o.name&&(o.previousSibling&&"listItem"===o.previousSibling.name||(this.editor.execute("outdentList"),e.preventDefault(),t.stop()))},{priority:"high"});const r=t=>(e,n)=>{this.editor.commands.get(t).isEnabled&&(this.editor.execute(t),n())};t.keystrokes.set("Tab",r("indentList")),t.keystrokes.set("Shift+Tab",r("outdentList"))}afterInit(){const t=this.editor.commands,e=t.get("indent"),n=t.get("outdent");e&&e.registerChildCommand(t.get("indentList")),n&&n.registerChildCommand(t.get("outdentList"))}}function jm(t){let e=1;for(const n of t.getChildren())if("ul"==n.name||"ol"==n.name)for(const t of n.getChildren())e+=jm(t);return e}class Vm extends $l{init(){const t=this.editor.t;vm(this.editor,"numberedList",t("Numbered List"),'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 5.75c0 .414.336.75.75.75h9.5a.75.75 0 1 0 0-1.5h-9.5a.75.75 0 0 0-.75.75zM3.5 3v5H2V3.7H1v-1h2.5V3zM.343 17.857l2.59-3.257H2.92a.6.6 0 1 0-1.04 0H.302a2 2 0 1 1 3.995 0h-.001c-.048.405-.16.734-.333.988-.175.254-.59.692-1.244 1.312H4.3v1h-4l.043-.043zM7 14.75a.75.75 0 0 1 .75-.75h9.5a.75.75 0 1 1 0 1.5h-9.5a.75.75 0 0 1-.75-.75z"/></svg>'),vm(this.editor,"bulletedList",t("Bulleted List"),'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 5.75c0 .414.336.75.75.75h9.5a.75.75 0 1 0 0-1.5h-9.5a.75.75 0 0 0-.75.75zm-6 0C1 4.784 1.777 4 2.75 4c.966 0 1.75.777 1.75 1.75 0 .966-.777 1.75-1.75 1.75C1.784 7.5 1 6.723 1 5.75zm6 9c0 .414.336.75.75.75h9.5a.75.75 0 1 0 0-1.5h-9.5a.75.75 0 0 0-.75.75zm-6 0c0-.966.777-1.75 1.75-1.75.966 0 1.75.777 1.75 1.75 0 .966-.777 1.75-1.75 1.75-.966 0-1.75-.777-1.75-1.75z"/></svg>')}}function zm(t,e){return t=>{t.on("attribute:url:media",n)};function n(n,i,o){if(!o.consumable.consume(i.item,n.name))return;const r=i.attributeNewValue,s=o.writer,a=o.mapper.toViewElement(i.item);s.remove(s.createRangeIn(a));const c=t.getMediaViewElement(s,r,e);s.insert(s.createPositionAt(a,0),c)}}function Bm(t,e,n,i){const o=t.createContainerElement("figure",{class:"media"});return o.getFillerOffset=Hm,t.insert(t.createPositionAt(o,0),e.getMediaViewElement(t,n,i)),o}function Fm(t){const e=t.getSelectedElement();return e&&e.is("media")?e:null}function Um(t,e,n){t.change(i=>{const o=i.createElement("media",{url:e});t.insertContent(o,n),i.setSelection(o,"on")})}function Hm(){return null}class qm extends td{refresh(){const t=this.editor.model,e=t.document.selection,n=t.schema,i=e.getFirstPosition(),o=Fm(e);let r=i.parent;r!=r.root&&(r=r.parent),this.value=o?o.getAttribute("url"):null,this.isEnabled=n.checkChild(r,"media")}execute(t){const e=this.editor.model,n=e.document.selection,i=Fm(n);if(i)e.change(e=>{e.setAttribute("url",t,i)});else{const i=Iu(n,e);Um(e,t,i)}}}class Wm{constructor(t,e){const n=e.providers,i=e.extraProviders||[],o=new Set(e.removeProviders),r=n.concat(i).filter(t=>{const e=t.name;return e?!o.has(e):(console.warn(Object(hn.a)("media-embed-no-provider-name: The configured media provider has no name and cannot be used."),{provider:t}),!1)});this.locale=t,this.providerDefinitions=r}hasMedia(t){return!!this._getMedia(t)}getMediaViewElement(t,e,n){return this._getMedia(e).getViewElement(t,n)}_getMedia(t){if(!t)return new Ym(this.locale);t=t.trim();for(const e of this.providerDefinitions){const n=e.html;let i=e.url;Array.isArray(i)||(i=[i]);for(const e of i){const i=this._getUrlMatches(t,e);if(i)return new Ym(this.locale,t,i,n)}}return null}_getUrlMatches(t,e){let n=t.match(e);if(n)return n;let i=t.replace(/^https?:\/\//,"");return n=i.match(e),n||(i=i.replace(/^www\./,""),n=i.match(e),n||null)}}class Ym{constructor(t,e,n,i){this.url=this._getValidUrl(e),this._t=t.t,this._match=n,this._previewRenderer=i}getViewElement(t,e){const n={};if(e.renderForEditingView||e.renderMediaPreview&&this.url&&this._previewRenderer){this.url&&(n["data-oembed-url"]=this.url),e.renderForEditingView&&(n.class="ck-media__wrapper");const i=this._getPreviewHtml(e);return t.createUIElement("div",n,(function(t){const e=this.toDomElement(t);return e.innerHTML=i,e}))}return this.url&&(n.url=this.url),t.createEmptyElement("oembed",n)}_getPreviewHtml(t){return this._previewRenderer?this._previewRenderer(this._match):this.url&&t.renderForEditingView?this._getPlaceholderHtml():""}_getPlaceholderHtml(){const t=new Il,e=new El;return t.text=this._t("Open media in new tab"),e.content='<svg viewBox="0 0 64 42" xmlns="http://www.w3.org/2000/svg"><path d="M47.426 17V3.713L63.102 0v19.389h-.001l.001.272c0 1.595-2.032 3.43-4.538 4.098-2.506.668-4.538-.083-4.538-1.678 0-1.594 2.032-3.43 4.538-4.098.914-.244 2.032-.565 2.888-.603V4.516L49.076 7.447v9.556A1.014 1.014 0 0 0 49 17h-1.574zM29.5 17h-8.343a7.073 7.073 0 1 0-4.657 4.06v3.781H3.3a2.803 2.803 0 0 1-2.8-2.804V8.63a2.803 2.803 0 0 1 2.8-2.805h4.082L8.58 2.768A1.994 1.994 0 0 1 10.435 1.5h8.985c.773 0 1.477.448 1.805 1.149l1.488 3.177H26.7c1.546 0 2.8 1.256 2.8 2.805V17zm-11.637 0H17.5a1 1 0 0 0-1 1v.05A4.244 4.244 0 1 1 17.863 17zm29.684 2c.97 0 .953-.048.953.889v20.743c0 .953.016.905-.953.905H19.453c-.97 0-.953.048-.953-.905V19.89c0-.937-.016-.889.97-.889h28.077zm-4.701 19.338V22.183H24.154v16.155h18.692zM20.6 21.375v1.616h1.616v-1.616H20.6zm0 3.231v1.616h1.616v-1.616H20.6zm0 3.231v1.616h1.616v-1.616H20.6zm0 3.231v1.616h1.616v-1.616H20.6zm0 3.231v1.616h1.616v-1.616H20.6zm0 3.231v1.616h1.616V37.53H20.6zm24.233-16.155v1.616h1.615v-1.616h-1.615zm0 3.231v1.616h1.615v-1.616h-1.615zm0 3.231v1.616h1.615v-1.616h-1.615zm0 3.231v1.616h1.615v-1.616h-1.615zm0 3.231v1.616h1.615v-1.616h-1.615zm0 3.231v1.616h1.615V37.53h-1.615zM29.485 25.283a.4.4 0 0 1 .593-.35l9.05 4.977a.4.4 0 0 1 0 .701l-9.05 4.978a.4.4 0 0 1-.593-.35v-9.956z"/></svg>',e.viewBox="0 0 64 42",new Hc({tag:"div",attributes:{class:"ck ck-reset_all ck-media__placeholder"},children:[{tag:"div",attributes:{class:"ck-media__placeholder__icon"},children:[e]},{tag:"a",attributes:{class:"ck-media__placeholder__url",target:"_blank",rel:"noopener noreferrer",href:this.url},children:[{tag:"span",attributes:{class:"ck-media__placeholder__url__text"},children:[this.url]},t]}]}).render().outerHTML}_getValidUrl(t){return t?t.match(/^https?/)?t:"https://"+t:null}}n(78);class Gm extends $l{static get pluginName(){return"MediaEmbedEditing"}constructor(t){super(t),t.config.define("mediaEmbed",{providers:[{name:"dailymotion",url:/^dailymotion\.com\/video\/(\w+)/,html:t=>`<div style="position: relative; padding-bottom: 100%; height: 0; "><iframe src="https://www.dailymotion.com/embed/video/${t[1]}" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" width="480" height="270" allowfullscreen allow="autoplay"></iframe></div>`},{name:"spotify",url:[/^open\.spotify\.com\/(artist\/\w+)/,/^open\.spotify\.com\/(album\/\w+)/,/^open\.spotify\.com\/(track\/\w+)/],html:t=>`<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 126%;"><iframe src="https://open.spotify.com/embed/${t[1]}" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`},{name:"youtube",url:[/^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)/,/^(?:m\.)?youtube\.com\/v\/([\w-]+)/,/^youtube\.com\/embed\/([\w-]+)/,/^youtu\.be\/([\w-]+)/],html:t=>`<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;"><iframe src="https://www.youtube.com/embed/${t[1]}" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`},{name:"vimeo",url:[/^vimeo\.com\/(\d+)/,/^vimeo\.com\/[^/]+\/[^/]+\/video\/(\d+)/,/^vimeo\.com\/album\/[^/]+\/video\/(\d+)/,/^vimeo\.com\/channels\/[^/]+\/(\d+)/,/^vimeo\.com\/groups\/[^/]+\/videos\/(\d+)/,/^vimeo\.com\/ondemand\/[^/]+\/(\d+)/,/^player\.vimeo\.com\/video\/(\d+)/],html:t=>`<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;"><iframe src="https://player.vimeo.com/video/${t[1]}" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>`},{name:"instagram",url:/^instagram\.com\/p\/(\w+)/},{name:"twitter",url:/^twitter\.com/},{name:"googleMaps",url:/^google\.com\/maps/},{name:"flickr",url:/^flickr\.com/},{name:"facebook",url:/^facebook\.com/}]}),this.registry=new Wm(t.locale,t.config.get("mediaEmbed"))}init(){const t=this.editor,e=t.model.schema,n=t.t,i=t.conversion,o=t.config.get("mediaEmbed.previewsInData"),r=this.registry;t.commands.add("mediaEmbed",new qm(t)),e.register("media",{isObject:!0,isBlock:!0,allowWhere:"$block",allowAttributes:["url"]}),i.for("dataDowncast").elementToElement({model:"media",view:(t,e)=>{const n=t.getAttribute("url");return Bm(e,r,n,{renderMediaPreview:n&&o})}}),i.for("dataDowncast").add(zm(r,{renderMediaPreview:o})),i.for("editingDowncast").elementToElement({model:"media",view:(t,e)=>{const i=t.getAttribute("url"),o=Bm(e,r,i,{renderForEditingView:!0});return s=o,a=e,c=n("media widget"),a.setCustomProperty("media",!0,s),Su(s,a,{label:c});var s,a,c}}),i.for("editingDowncast").add(zm(r,{renderForEditingView:!0})),i.for("upcast").elementToElement({view:{name:"oembed",attributes:{url:!0}},model:(t,e)=>{const n=t.getAttribute("url");if(r.hasMedia(n))return e.createElement("media",{url:n})}}).elementToElement({view:{name:"div",attributes:{"data-oembed-url":!0}},model:(t,e)=>{const n=t.getAttribute("data-oembed-url");if(r.hasMedia(n))return e.createElement("media",{url:n})}})}}const $m=/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/;class Qm extends $l{static get requires(){return[Xl,Qd]}static get pluginName(){return"AutoMediaEmbed"}constructor(t){super(t),this._timeoutId=null,this._positionToInsert=null}init(){const t=this.editor,e=t.model.document;this.listenTo(t.plugins.get(Xl),"inputTransformation",()=>{const t=e.selection.getFirstRange(),n=ac.fromPosition(t.start);n.stickiness="toPrevious";const i=ac.fromPosition(t.end);i.stickiness="toNext",e.once("change:data",()=>{this._embedMediaBetweenPositions(n,i),n.detach(),i.detach()},{priority:"high"})}),t.commands.get("undo").on("execute",()=>{this._timeoutId&&(Xo.window.clearTimeout(this._timeoutId),this._positionToInsert.detach(),this._timeoutId=null,this._positionToInsert=null)},{priority:"high"})}_embedMediaBetweenPositions(t,e){const n=this.editor,i=n.plugins.get(Gm).registry,o=new Rs(t,e),r=o.getWalker({ignoreElementEnd:!0});let s="";for(const t of r)t.item.is("textProxy")&&(s+=t.item.data);if(s=s.trim(),!s.match($m))return;if(!i.hasMedia(s))return;n.commands.get("mediaEmbed").isEnabled&&(this._positionToInsert=ac.fromPosition(t),this._timeoutId=Xo.window.setTimeout(()=>{n.model.change(t=>{let e;this._timeoutId=null,t.remove(o),"$graveyard"!==this._positionToInsert.root.rootName&&(e=this._positionToInsert),Um(n.model,s,e),this._positionToInsert.detach(),this._positionToInsert=null})},100))}}n(80);class Km extends cl{constructor(t,e){super(e);const n=e.t;this.focusTracker=new Oc,this.keystrokes=new Ac,this.urlInputView=this._createUrlInput(),this.saveButtonView=this._createButton(n("Save"),qh,"ck-button-save"),this.saveButtonView.type="submit",this.cancelButtonView=this._createButton(n("Cancel"),Wh,"ck-button-cancel","cancel"),this._focusables=new Uc,this._focusCycler=new kl({focusables:this._focusables,focusTracker:this.focusTracker,keystrokeHandler:this.keystrokes,actions:{focusPrevious:"shift + tab",focusNext:"tab"}}),this._validators=t,this.setTemplate({tag:"form",attributes:{class:["ck","ck-media-form"],tabindex:"-1"},children:[this.urlInputView,this.saveButtonView,this.cancelButtonView]})}render(){super.render(),Hh({view:this}),[this.urlInputView,this.saveButtonView,this.cancelButtonView].forEach(t=>{this._focusables.add(t),this.focusTracker.add(t.element)}),this.keystrokes.listenTo(this.element);const t=t=>t.stopPropagation();this.keystrokes.set("arrowright",t),this.keystrokes.set("arrowleft",t),this.keystrokes.set("arrowup",t),this.keystrokes.set("arrowdown",t),this.listenTo(this.urlInputView.element,"selectstart",(t,e)=>{e.stopPropagation()},{priority:"high"})}focus(){this._focusCycler.focusFirst()}get url(){return this.urlInputView.fieldView.element.value.trim()}set url(t){this.urlInputView.fieldView.element.value=t.trim()}isValid(){this.resetFormStatus();for(const t of this._validators){const e=t(this);if(e)return this.urlInputView.errorText=e,!1}return!0}resetFormStatus(){this.urlInputView.errorText=null,this.urlInputView.infoText=this._urlInputViewInfoDefault}_createUrlInput(){const t=this.locale.t,e=new Bh(this.locale,Uh),n=e.fieldView;return this._urlInputViewInfoDefault=t("Paste the media URL in the input."),this._urlInputViewInfoTip=t("Tip: Paste the URL into the content to embed faster."),e.label=t("Media URL"),e.infoText=this._urlInputViewInfoDefault,n.placeholder="https://example.com",n.on("input",()=>{e.infoText=n.element.value?this._urlInputViewInfoTip:this._urlInputViewInfoDefault}),e}_createButton(t,e,n,i){const o=new Nl(this.locale);return o.set({label:t,icon:e,tooltip:!0}),o.extendTemplate({attributes:{class:n}}),i&&o.delegate("execute").to(this,i),o}}class Jm extends $l{static get requires(){return[Gm]}static get pluginName(){return"MediaEmbedUI"}init(){const t=this.editor,e=t.commands.get("mediaEmbed"),n=t.plugins.get(Gm).registry;this.form=new Km(function(t,e){return[e=>{if(!e.url.length)return t("The URL must not be empty.")},n=>{if(!e.hasMedia(n.url))return t("This media URL is not supported.")}]}(t.t,n),t.locale),t.ui.componentFactory.add("mediaEmbed",n=>{const i=Bl(n);return this._setUpDropdown(i,this.form,e,t),this._setUpForm(this.form,i,e),i})}_setUpDropdown(t,e,n){const i=this.editor,o=i.t,r=t.buttonView;function s(){i.editing.view.focus(),t.isOpen=!1}t.bind("isEnabled").to(n),t.panelView.children.add(e),r.set({label:o("Insert media"),icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18.68 3.03c.6 0 .59-.03.59.55v12.84c0 .59.01.56-.59.56H1.29c-.6 0-.59.03-.59-.56V3.58c0-.58-.01-.55.6-.55h17.38zM15.77 15V5H4.2v10h11.57zM2 4v1h1V4H2zm0 2v1h1V6H2zm0 2v1h1V8H2zm0 2v1h1v-1H2zm0 2v1h1v-1H2zm0 2v1h1v-1H2zM17 4v1h1V4h-1zm0 2v1h1V6h-1zm0 2v1h1V8h-1zm0 2v1h1v-1h-1zm0 2v1h1v-1h-1zm0 2v1h1v-1h-1zM7.5 7.177a.4.4 0 01.593-.351l5.133 2.824a.4.4 0 010 .7l-5.133 2.824a.4.4 0 01-.593-.35V7.176v.001z"/></svg>\n',tooltip:!0}),r.on("open",()=>{e.url=n.value||"",e.urlInputView.fieldView.select(),e.focus()},{priority:"low"}),t.on("submit",()=>{e.isValid()&&(i.execute("mediaEmbed",e.url),s())}),t.on("change:isOpen",()=>e.resetFormStatus()),t.on("cancel",()=>s())}_setUpForm(t,e,n){t.delegate("submit","cancel").to(e),t.urlInputView.bind("value").to(n,"value"),t.urlInputView.bind("isReadOnly").to(n,"isEnabled",t=>!t),t.saveButtonView.bind("isEnabled").to(n)}}n(82);function Zm(t,e){if(!t.childCount)return;const n=new wf(t.document),i=function(t,e){const n=e.createRangeIn(t),i=new jn({name:/^p|h\d+$/,styles:{"mso-list":/.*/}}),o=[];for(const t of n)if("elementStart"===t.type&&i.match(t.item)){const e=tg(t.item);o.push({element:t.item,id:e.id,order:e.order,indent:e.indent})}return o}(t,n);if(!i.length)return;let o=null,r=1;i.forEach((t,s)=>{const a=function(t,e){if(!t)return!0;if(t.id!==e.id)return!0;const n=e.element.previousSibling;if(!n)return!0;return i=n,!(i.is("ol")||i.is("ul"));var i}(i[s-1],t),c=a?null:i[s-1],l=(u=t,(d=c)?u.indent-d.indent:u.indent-1);var d,u;if(a&&(o=null,r=1),!o||0!==l){const i=function(t,e){const n=new RegExp(`@list l${t.id}:level${t.indent}\\s*({[^}]*)`,"gi"),i=/mso-level-number-format:([^;]*);/gi,o=n.exec(e);let r="decimal";if(o&&o[1]){const t=i.exec(o[1]);t&&t[1]&&(r=t[1].trim())}return{type:"bullet"!==r&&"image"!==r?"ol":"ul",style:r}}(t,e);if(o){if(t.indent>r){const t=o.getChild(o.childCount-1),e=t.getChild(t.childCount-1);o=Xm(i,e,n),r+=1}else if(t.indent<r){const e=r-t.indent;o=function(t,e){const n=t.getAncestors({parentFirst:!0});let i=null,o=0;for(const t of n)if("ul"!==t.name&&"ol"!==t.name||o++,o===e){i=t;break}return i}(o,e),r=parseInt(t.indent)}}else o=Xm(i,t.element,n);t.indent<=r&&(o.is(i.type)||(o=n.rename(i.type,o)))}const h=function(t,e){return function(t,e){const n=new jn({name:"span",styles:{"mso-list":"Ignore"}}),i=e.createRangeIn(t);for(const t of i)"elementStart"===t.type&&n.match(t.item)&&e.remove(t.item)}(t,e),e.rename("li",t)}(t.element,n);n.appendChild(h,o)})}function Xm(t,e,n){const i=e.parent,o=n.createElement(t.type),r=i.getChildIndex(e)+1;return n.insertChild(r,o,i),o}function tg(t){const e={},n=t.getStyle("mso-list");if(n){const t=n.match(/(^|\s+)l(\d+)/i),i=n.match(/\s*lfo(\d+)/i),o=n.match(/\s*level(\d+)/i);t&&i&&o&&(e.id=t[2],e.order=i[1],e.indent=o[1])}return e}const eg=/id=("|')docs-internal-guid-[-0-9a-f]+("|')/i;class ng{constructor(t){this.document=t}isActive(t){return eg.test(t)}execute(t){const e=new wf(this.document);!function(t,e){for(const n of t.getChildren())if(n.is("b")&&"normal"===n.getStyle("font-weight")){const i=t.getChildIndex(n);e.remove(n),e.insertChild(i,n.getChildren(),t)}}(t.content,e),function(t,e){for(const n of e.createRangeIn(t)){const t=n.item;if(t.is("li")){const n=t.getChild(0);n.is("p")&&e.unwrapElement(n)}}}(t.content,e)}}function ig(t){return t.replace(/<span(?: class="Apple-converted-space"|)>(\s+)<\/span>/g,(t,e)=>1===e.length?" ":Array(e.length+1).join("  ").substr(0,e.length))}function og(t){const e=new DOMParser,n=function(t){return ig(ig(t)).replace(/(<span\s+style=['"]mso-spacerun:yes['"]>[\s]*?)[\r\n]+(\s*<\/span>)/g,"$1$2").replace(/<span\s+style=['"]mso-spacerun:yes['"]><\/span>/g,"").replace(/ <\//g," </").replace(/ <o:p><\/o:p>/g," <o:p></o:p>").replace(/<o:p>(&nbsp;|\u00A0)<\/o:p>/g,"").replace(/>(\s*[\r\n]\s*)</g,"><")}(function(t){const e=t.match(/<\/body>(.*?)(<\/html>|$)/);e&&e[1]&&(t=t.slice(0,e.index)+t.slice(e.index).replace(e[1],""));return t}(t=t.replace(/<!--\[if gte vml 1]>/g,""))),i=e.parseFromString(n,"text/html");!function(t){t.querySelectorAll("span[style*=spacerun]").forEach(t=>{const e=t.innerText.length||0;t.innerHTML=Array(e+1).join("  ").substr(0,e)})}(i);const o=i.body.innerHTML,r=function(t){const e=new oo(new Ei),n=new ir(e,{blockFillerMode:"nbsp"}),i=t.createDocumentFragment(),o=t.body.childNodes;for(;o.length>0;)i.appendChild(o[0]);return n.domToView(i)}(i),s=function(t){const e=[],n=[],i=Array.from(t.getElementsByTagName("style"));for(const t of i)t.sheet&&t.sheet.cssRules&&t.sheet.cssRules.length&&(e.push(t.sheet),n.push(t.innerHTML));return{styles:e,stylesString:n.join(" ")}}(i);return{body:r,bodyString:o,styles:s.styles,stylesString:s.stylesString}}function rg(t,e){if(!t.childCount)return;const n=new wf;!function(t,e,n){const i=n.createRangeIn(e),o=new jn({name:"img"}),r=[];for(const e of i)if(o.match(e.item)){const n=e.item,i=n.getAttribute("v:shapes")?n.getAttribute("v:shapes").split(" "):[];i.length&&i.every(e=>t.indexOf(e)>-1)?r.push(n):n.getAttribute("src")||r.push(n)}for(const t of r)n.remove(t)}(function(t,e){const n=e.createRangeIn(t),i=new jn({name:/v:(.+)/}),o=[];for(const t of n){const e=t.item,n=e.previousSibling&&e.previousSibling.name||null;i.match(e)&&e.getAttribute("o:gfxdata")&&"v:shapetype"!==n&&o.push(t.item.getAttribute("id"))}return o}(t,n),t,n),function(t,e){const n=e.createRangeIn(t),i=new jn({name:/v:(.+)/}),o=[];for(const t of n)i.match(t.item)&&o.push(t.item);for(const t of o)e.remove(t)}(t,n);const i=function(t,e){const n=e.createRangeIn(t),i=new jn({name:"img"}),o=[];for(const t of n)i.match(t.item)&&t.item.getAttribute("src").startsWith("file://")&&o.push(t.item);return o}(t,n);i.length&&function(t,e,n){if(t.length===e.length)for(let o=0;o<t.length;o++){const r=`data:${e[o].type};base64,${i=e[o].hex,btoa(i.match(/\w{2}/g).map(t=>String.fromCharCode(parseInt(t,16))).join(""))}`;n.setAttribute("src",r,t[o])}var i}(i,function(t){if(!t)return[];const e=/{\\pict[\s\S]+?\\bliptag-?\d+(\\blipupi-?\d+)?({\\\*\\blipuid\s?[\da-fA-F]+)?[\s}]*?/,n=new RegExp("(?:("+e.source+"))([\\da-fA-F\\s]+)\\}","g"),i=t.match(n),o=[];if(i)for(const t of i){let n=!1;t.includes("\\pngblip")?n="image/png":t.includes("\\jpegblip")&&(n="image/jpeg"),n&&o.push({hex:t.replace(e,"").replace(/[^\da-fA-F]/g,""),type:n})}return o}(e),n)}const sg=/<meta\s*name="?generator"?\s*content="?microsoft\s*word\s*\d+"?\/?>/i,ag=/xmlns:o="urn:schemas-microsoft-com/i;class cg{isActive(t){return sg.test(t)||ag.test(t)}execute(t){const{body:e,stylesString:n}=og(t.dataTransfer.getData("text/html"));Zm(e,n),rg(e,t.dataTransfer.getData("text/rtf")),t.content=e}}function lg(t,e){let n=e.parent;for(;n;){if(n.name===t)return n;n=n.parent}}function dg(t,e,n,i,o=1){e>o?i.setAttribute(t,e,n):i.removeAttribute(t,n)}function ug(t,e,n={}){const i=t.createElement("tableCell",n);t.insertElement("paragraph",i),t.insert(i,e)}function hg(t,e){const n=e.parent.parent,i=parseInt(n.getAttribute("headingColumns")||0),{column:o}=t.getCellLocation(e);return!!i&&o<i}function fg(){return t=>{t.on("element:table",(t,e,n)=>{const i=e.viewItem;if(!n.consumable.test(i,{name:!0}))return;const{rows:o,headingRows:r,headingColumns:s}=function(t){const e={headingRows:0,headingColumns:0},n=[],i=[];let o;for(const r of Array.from(t.getChildren()))if("tbody"===r.name||"thead"===r.name||"tfoot"===r.name){"thead"!==r.name||o||(o=r);const t=Array.from(r.getChildren()).filter(t=>t.is("element","tr"));for(const r of t)if("thead"===r.parent.name&&r.parent===o)e.headingRows++,n.push(r);else{i.push(r);const t=gg(r);t>e.headingColumns&&(e.headingColumns=t)}}return e.rows=[...n,...i],e}(i),a={};s&&(a.headingColumns=s),r&&(a.headingRows=r);const c=n.writer.createElement("table",a),l=n.splitToAllowedParent(c,e.modelCursor);if(l){if(n.writer.insert(c,l.position),n.consumable.consume(i,{name:!0}),o.length)o.forEach(t=>n.convertItem(t,n.writer.createPositionAt(c,"end")));else{const t=n.writer.createElement("tableRow");n.writer.insert(t,n.writer.createPositionAt(c,"end")),ug(n.writer,n.writer.createPositionAt(t,"end"))}e.modelRange=n.writer.createRange(n.writer.createPositionBefore(c),n.writer.createPositionAfter(c)),l.cursorParent?e.modelCursor=n.writer.createPositionAt(l.cursorParent,0):e.modelCursor=e.modelRange.end}})}}function mg(t){return e=>{e.on("element:"+t,(t,e,n)=>{const i=e.viewItem;if(!n.consumable.test(i,{name:!0}))return;const o=n.writer.createElement("tableCell"),r=n.splitToAllowedParent(o,e.modelCursor);if(!r)return;n.writer.insert(o,r.position),n.consumable.consume(i,{name:!0});const s=n.writer.createPositionAt(o,0);n.convertChildren(i,s),o.childCount||n.writer.insertElement("paragraph",s),e.modelRange=n.writer.createRange(n.writer.createPositionBefore(o),n.writer.createPositionAfter(o)),e.modelCursor=e.modelRange.end})}}function gg(t){let e=0,n=0;const i=Array.from(t.getChildren()).filter(t=>"th"===t.name||"td"===t.name);for(;n<i.length&&"th"===i[n].name;){const t=i[n];e+=parseInt(t.getAttribute("colspan")||1),n++}return e}class pg{constructor(t,e={}){this.table=t,this.startRow=e.startRow||0,this.endRow="number"==typeof e.endRow?e.endRow:void 0,this.includeSpanned=!!e.includeSpanned,this.column="number"==typeof e.column?e.column:void 0,this._skipRows=new Set,this._row=0,this._column=0,this._cellIndex=0,this._spannedCells=new Map,this._nextCellAtColumn=-1}[Symbol.iterator](){return this}next(){const t=this.table.getChild(this._row);if(!t||this._isOverEndRow())return{done:!0};let e,n,i;if(this._isSpanned(this._row,this._column))e=this._getSpanned(this._row,this._column),n=!this.includeSpanned||this._shouldSkipRow()||this._shouldSkipColumn(),i=this._formatOutValue(e,this._column,!0);else{if(e=t.getChild(this._cellIndex),!e)return this._row++,this._column=0,this._cellIndex=0,this._nextCellAtColumn=-1,this.next();const o=parseInt(e.getAttribute("colspan")||1),r=parseInt(e.getAttribute("rowspan")||1);(o>1||r>1)&&this._recordSpans(this._row,this._column,r,o,e),this._nextCellAtColumn=this._column+o,n=this._shouldSkipRow()||this._shouldSkipColumn(),i=this._formatOutValue(e,this._column,!1,r,o)}return this._column++,this._column==this._nextCellAtColumn&&this._cellIndex++,n?this.next():i}skipRow(t){this._skipRows.add(t)}_isOverEndRow(){return void 0!==this.endRow&&this._row>this.endRow}_formatOutValue(t,e,n,i=1,o=1){return{done:!1,value:{cell:t,row:this._row,column:e,isSpanned:n,rowspan:i,colspan:o,cellIndex:this._cellIndex}}}_shouldSkipRow(){const t=this._row<this.startRow,e=this._skipRows.has(this._row);return t||e}_shouldSkipColumn(){return void 0!==this.column&&this.column!=this._column}_isSpanned(t,e){if(!this._spannedCells.has(t))return!1;return this._spannedCells.get(t).has(e)}_getSpanned(t,e){return this._spannedCells.get(t).get(e)}_recordSpans(t,e,n,i,o){for(let n=e+1;n<=e+i-1;n++)this._markSpannedCell(t,n,o);for(let r=t+1;r<t+n;r++)for(let t=e;t<=e+i-1;t++)this._markSpannedCell(r,t,o)}_markSpannedCell(t,e,n){this._spannedCells.has(t)||this._spannedCells.set(t,new Map),this._spannedCells.get(t).set(e,n)}}function bg(t){return!!t.getCustomProperty("table")&&Pu(t)}function wg(t){const e=t.getSelectedElement();return e&&bg(e)?e:null}function kg(t){const e=lg("table",t.getFirstPosition());return e&&bg(e.parent)?e.parent:null}function _g(t){const e=[];for(const i of(n=t.getRanges(),Array.from(n).sort(Cg))){const t=i.getContainedElement();t&&t.is("tableCell")&&e.push(t)}var n;return e}function vg(t){const e=[];for(const n of t.getRanges()){const t=lg("tableCell",n.start);t&&e.push(t)}return e}function yg(t){const e=_g(t);return e.length?e:vg(t)}function xg(t){return Tg(t.map(t=>t.parent.index))}function Ag(t){const e=lg("table",t[0]);return Tg([...new pg(e)].filter(e=>t.includes(e.cell)).map(t=>t.column))}function Tg(t){const e=t.sort((t,e)=>t-e);return{first:e[0],last:e[e.length-1]}}function Cg(t,e){const n=t.start,i=e.start;return n.isBefore(i)?-1:1}function Pg(t={}){return e=>e.on("insert:table",(e,n,i)=>{const o=n.item;if(!i.consumable.consume(o,"insert"))return;i.consumable.consume(o,"attribute:headingRows:table"),i.consumable.consume(o,"attribute:headingColumns:table");const r=t&&t.asWidget,s=i.writer.createContainerElement("figure",{class:"table"}),a=i.writer.createContainerElement("table");let c;var l,d;i.writer.insert(i.writer.createPositionAt(s,0),a),r&&(l=s,(d=i.writer).setCustomProperty("table",!0,l),c=Su(l,d,{hasSelectionHandle:!0}));const u=new pg(o),h={headingRows:o.getAttribute("headingRows")||0,headingColumns:o.getAttribute("headingColumns")||0},f=new Map;for(const e of u){const{row:n,cell:r}=e,s=Vg(jg(n,h),a,i),c=o.getChild(n),l=f.get(n)||Dg(c,n,s,i);f.set(n,l),i.consumable.consume(r,"insert"),Rg(e,h,i.writer.createPositionAt(l,"end"),i,t)}const m=i.mapper.toViewPosition(n.range.start);i.mapper.bindElements(o,r?c:s),i.writer.insert(m,r?c:s)})}function Sg(t={}){return e=>e.on("insert:tableRow",(e,n,i)=>{const o=n.item;if(!i.consumable.consume(o,"insert"))return;const r=o.parent,s=Ug(i.mapper.toViewElement(r)),a=r.getChildIndex(o),c=new pg(r,{startRow:a,endRow:a}),l={headingRows:r.getAttribute("headingRows")||0,headingColumns:r.getAttribute("headingColumns")||0},d=new Map;for(const e of c){const n=Vg(jg(a,l),s,i),r=d.get(a)||Dg(o,a,n,i);d.set(a,r),i.consumable.consume(e.cell,"insert"),Rg(e,l,i.writer.createPositionAt(r,"end"),i,t)}})}function Mg(t={}){return e=>e.on("insert:tableCell",(e,n,i)=>{const o=n.item;if(!i.consumable.consume(o,"insert"))return;const r=o.parent,s=r.parent,a=s.getChildIndex(r),c=new pg(s,{startRow:a,endRow:a}),l={headingRows:s.getAttribute("headingRows")||0,headingColumns:s.getAttribute("headingColumns")||0};for(const e of c)if(e.cell===o){const n=i.mapper.toViewElement(r);return void Rg(e,l,i.writer.createPositionAt(n,r.getChildIndex(o)),i,t)}})}function Eg(t={}){const e=!!t.asWidget;return t=>t.on("attribute:headingRows:table",(t,n,i)=>{const o=n.item;if(!i.consumable.consume(n.item,t.name))return;const r=Ug(i.mapper.toViewElement(o)),s=n.attributeOldValue,a=n.attributeNewValue;if(a>s){const t=Array.from(o.getChildren()).filter(({index:t})=>c(t,s-1,a));Fg(t,Vg("thead",r,i),i,"end");for(const n of t)for(const t of n.getChildren())Ng(t,"th",i,e)}else{Fg(Array.from(o.getChildren()).filter(({index:t})=>c(t,a-1,s)).reverse(),Vg("tbody",r,i),i,0);const t=new pg(o,{startRow:a?a-1:a,endRow:s-1}),n={headingRows:o.getAttribute("headingRows")||0,headingColumns:o.getAttribute("headingColumns")||0};for(const o of t)Og(o,n,i,e)}function c(t,e,n){return t>e&&t<n}Bg("thead",r,i),Bg("tbody",r,i)})}function Ig(t={}){const e=!!t.asWidget;return t=>t.on("attribute:headingColumns:table",(t,n,i)=>{const o=n.item;if(!i.consumable.consume(n.item,t.name))return;const r={headingRows:o.getAttribute("headingRows")||0,headingColumns:o.getAttribute("headingColumns")||0},s=n.attributeOldValue,a=n.attributeNewValue,c=(s>a?s:a)-1;for(const t of new pg(o))t.column>c||Og(t,r,i,e)})}function Ng(t,e,n,i){const o=n.writer,r=n.mapper.toViewElement(t);if(!r)return;let s;if(i){s=Eu(o.createEditableElement(e,r.getAttributes()),o),o.insert(o.createPositionAfter(r),s),o.move(o.createRangeIn(r),o.createPositionAt(s,0)),o.remove(o.createRangeOn(r))}else s=o.rename(e,r);n.mapper.unbindViewElement(r),n.mapper.bindElements(t,s)}function Og(t,e,n,i){const{cell:o}=t,r=Lg(t,e),s=n.mapper.toViewElement(o);s&&s.name!==r&&Ng(o,r,n,i)}function Rg(t,e,n,i,o){const r=o&&o.asWidget,s=Lg(t,e),a=r?Eu(i.writer.createEditableElement(s),i.writer):i.writer.createContainerElement(s),c=t.cell,l=c.getChild(0),d=1===c.childCount&&"paragraph"===l.name;if(i.writer.insert(n,a),d&&![...l.getAttributeKeys()].length){const t=c.getChild(0),e=i.writer.createPositionAt(a,"end");if(i.consumable.consume(t,"insert"),o.asWidget){const n=i.writer.createContainerElement("span",{style:"display:inline-block"});i.mapper.bindElements(t,n),i.writer.insert(e,n),i.mapper.bindElements(c,a)}else i.mapper.bindElements(c,a),i.mapper.bindElements(t,a)}else i.mapper.bindElements(c,a)}function Dg(t,e,n,i){i.consumable.consume(t,"insert");const o=i.writer.createContainerElement("tr");i.mapper.bindElements(t,o);const r=t.parent.getAttribute("headingRows")||0,s=r>0&&e>=r?e-r:e,a=i.writer.createPositionAt(n,s);return i.writer.insert(a,o),o}function Lg(t,e){const{row:n,column:i}=t,{headingColumns:o,headingRows:r}=e;return r&&r>n||o&&o>i?"th":"td"}function jg(t,e){return t<e.headingRows?"thead":"tbody"}function Vg(t,e,n){const i=zg(t,e);return i||function(t,e,n){const i=n.writer.createContainerElement(t),o=n.writer.createPositionAt(e,"tbody"==t?"end":0);return n.writer.insert(o,i),i}(t,e,n)}function zg(t,e){for(const n of e.getChildren())if(n.name==t)return n}function Bg(t,e,n){const i=zg(t,e);i&&0===i.childCount&&n.writer.remove(n.writer.createRangeOn(i))}function Fg(t,e,n,i){for(const o of t){const t=n.mapper.toViewElement(o);t&&n.writer.move(n.writer.createRangeOn(t),n.writer.createPositionAt(e,i))}}function Ug(t){for(const e of t.getChildren())if("table"===e.name)return e}class Hg extends td{refresh(){const t=this.editor.model,e=t.document.selection,n=t.schema,i=function(t){const e=t.parent;return e===e.root?e:e.parent}(e.getFirstPosition());this.isEnabled=n.checkChild(i,"table")}execute(t={}){const e=this.editor.model,n=e.document.selection,i=this.editor.plugins.get("TableUtils"),o=parseInt(t.rows)||2,r=parseInt(t.columns)||2,s=Iu(n,e);e.change(t=>{const n=i.createTable(t,o,r);e.insertContent(n,s),t.setSelection(t.createPositionAt(n.getNodeByPath([0,0,0]),0))})}}class qg extends td{constructor(t,e={}){super(t),this.order=e.order||"below"}refresh(){const t=lg("table",this.editor.model.document.selection.getFirstPosition());this.isEnabled=!!t}execute(){const t=this.editor,e=t.model.document.selection,n=t.plugins.get("TableUtils"),i="above"===this.order,o=i?e.getFirstPosition():e.getLastPosition(),r=((i?e.getFirstRange():e.getLastRange()).getContainedElement()||lg("tableCell",o)).parent,s=r.parent,a=s.getChildIndex(r);n.insertRows(s,{rows:1,at:"below"===this.order?a+1:a})}}class Wg extends td{constructor(t,e={}){super(t),this.order=e.order||"right"}refresh(){const t=lg("table",this.editor.model.document.selection.getFirstPosition());this.isEnabled=!!t}execute(){const t=this.editor,e=t.model.document.selection,n=t.plugins.get("TableUtils"),i="left"===this.order,o=i?e.getFirstPosition():e.getLastPosition(),r=(i?e.getFirstRange():e.getLastRange()).getContainedElement()||lg("tableCell",o),s=r.parent.parent,{column:a}=n.getCellLocation(r);n.insertColumns(s,{columns:1,at:i?a:a+1})}}class Yg extends td{constructor(t,e={}){super(t),this.direction=e.direction||"horizontally"}refresh(){const t=yg(this.editor.model.document.selection);this.isEnabled=1===t.length}execute(){const t=yg(this.editor.model.document.selection)[0],e="horizontally"===this.direction,n=this.editor.plugins.get("TableUtils");e?n.splitCellHorizontally(t,2):n.splitCellVertically(t,2)}}class Gg extends td{constructor(t,e){super(t),this.direction=e.direction,this.isHorizontal="right"==this.direction||"left"==this.direction}refresh(){const t=this._getMergeableCell();this.value=t,this.isEnabled=!!t}execute(){const t=this.editor.model,e=vg(t.document.selection)[0],n=this.value,i=this.direction;t.change(t=>{const o="right"==i||"down"==i,r=o?e:n,s=o?n:e,a=s.parent;!function(t,e,n){$g(t)||($g(e)&&n.remove(n.createRangeIn(e)),n.move(n.createRangeIn(t),n.createPositionAt(e,"end")));n.remove(t)}(s,r,t);const c=this.isHorizontal?"colspan":"rowspan",l=parseInt(e.getAttribute(c)||1),d=parseInt(n.getAttribute(c)||1);t.setAttribute(c,l+d,r),t.setSelection(t.createRangeIn(r)),a.childCount||function(t,e){const n=t.parent,i=n.getChildIndex(t);for(const{cell:t,row:o,rowspan:r}of new pg(n,{endRow:i})){o+r-1>=i&&dg("rowspan",r-1,t,e)}e.remove(t)}(a,t)})}_getMergeableCell(){const t=vg(this.editor.model.document.selection)[0];if(!t)return;const e=this.editor.plugins.get("TableUtils"),n=this.isHorizontal?function(t,e,n){const i=t.parent.parent,o="right"==e?t.nextSibling:t.previousSibling,r=(i.getAttribute("headingColumns")||0)>0;if(!o)return;const s="right"==e?t:o,a="right"==e?o:t,{column:c}=n.getCellLocation(s),{column:l}=n.getCellLocation(a),d=parseInt(s.getAttribute("colspan")||1),u=hg(n,s),h=hg(n,a);if(r&&u!=h)return;return c+d===l?o:void 0}(t,this.direction,e):function(t,e){const n=t.parent,i=n.parent,o=i.getChildIndex(n);if("down"==e&&o===i.childCount-1||"up"==e&&0===o)return;const r=parseInt(t.getAttribute("rowspan")||1),s=i.getAttribute("headingRows")||0,a="down"==e&&o+r===s,c="up"==e&&o===s;if(s&&(a||c))return;const l=parseInt(t.getAttribute("rowspan")||1),d="down"==e?o+l:o,u=[...new pg(i,{endRow:d})],h=u.find(e=>e.cell===t).column,f=u.find(({row:t,rowspan:n,column:i})=>i===h&&("down"==e?t===d:d===t+n));return f&&f.cell}(t,this.direction);if(!n)return;const i=this.isHorizontal?"rowspan":"colspan",o=parseInt(t.getAttribute(i)||1);return parseInt(n.getAttribute(i)||1)===o?n:void 0}}function $g(t){return 1==t.childCount&&t.getChild(0).is("paragraph")&&t.getChild(0).isEmpty}class Qg extends td{refresh(){const t=yg(this.editor.model.document.selection),e=t[0];if(e){const n=lg("table",e),i=this.editor.plugins.get("TableUtils").getRows(n)-1,o=xg(t),r=0===o.first&&o.last===i;this.isEnabled=!r}else this.isEnabled=!1}execute(){const t=this.editor.model,e=yg(t.document.selection),n=xg(e),i=e[0],o=lg("table",i),r=this.editor.plugins.get("TableUtils").getCellLocation(i).column,s=t.createBatch();t.enqueueChange(s,t=>{t.setSelection(t.createSelection(o,"on"));const e=n.last-n.first+1;this.editor.plugins.get("TableUtils").removeRows(o,{at:n.first,rows:e,batch:s})}),t.enqueueChange(s,t=>{const e=function(t,e,n){const i=t.getChild(e)||t.getChild(t.childCount-1);let o=i.getChild(0),r=0;for(const t of i.getChildren()){if(r>n)return o;o=t,r+=parseInt(t.getAttribute("colspan")||1)}return o}(o,n.first,r);t.setSelection(t.createPositionAt(e,0))})}}class Kg extends td{refresh(){const t=yg(this.editor.model.document.selection),e=t[0];if(e){const n=lg("table",e),i=this.editor.plugins.get("TableUtils").getColumns(n),{first:o,last:r}=Ag(t);this.isEnabled=r-o<i-1}else this.isEnabled=!1}execute(){const[t,e]=function(t){const e=yg(t),n=e[0],i=e.pop(),o=[n,i];return n.isBefore(i)?o:o.reverse()}(this.editor.model.document.selection),n=t.parent.parent,i=[...new pg(n)],o={first:i.find(e=>e.cell===t).column,last:i.find(t=>t.cell===e).column},r=function(t,e,n,i){return parseInt(n.getAttribute("colspan")||1)>1?n:e.previousSibling||n.nextSibling?n.nextSibling||e.previousSibling:i.first?t.reverse().find(({column:t})=>t<i.first).cell:t.reverse().find(({column:t})=>t>i.last).cell}(i,t,e,o);this.editor.model.change(t=>{const e=o.last-o.first+1;this.editor.plugins.get("TableUtils").removeColumns(n,{at:o.first,columns:e}),t.setSelection(t.createPositionAt(r,0))})}}class Jg extends td{refresh(){const t=yg(this.editor.model.document.selection),e=t.length>0;this.isEnabled=e,this.value=e&&t.every(t=>this._isInHeading(t,t.parent.parent))}execute(t={}){if(t.forceValue===this.value)return;const e=this.editor.model,n=yg(e.document.selection),i=lg("table",n[0]),{first:o,last:r}=xg(n),s=this.value?o:r+1,a=i.getAttribute("headingRows")||0;e.change(t=>{if(s){const e=function(t,e,n){const i=[],o=new pg(t,{startRow:e>n?n:0,endRow:e-1});for(const{row:t,rowspan:n,cell:r}of o)n>1&&t+n>e&&i.push(r);return i}(i,s,a);for(const n of e)Zg(n,s,t)}dg("headingRows",s,i,t,0)})}_isInHeading(t,e){const n=parseInt(e.getAttribute("headingRows")||0);return!!n&&t.parent.index<n}}function Zg(t,e,n){const i=t.parent,o=i.parent,r=e-i.index,s={},a=parseInt(t.getAttribute("rowspan"))-r;a>1&&(s.rowspan=a);const c=parseInt(t.getAttribute("colspan")||1);c>1&&(s.colspan=c);const l=o.getChildIndex(i),d=l+r,u=[...new pg(o,{startRow:l,endRow:d,includeSpanned:!0})];let h;for(const{row:e,column:i,cell:r,cellIndex:a}of u)if(r===t&&void 0===h&&(h=i),void 0!==h&&h===i&&e===d){const t=o.getChild(e),i=n.createPositionAt(t,a);ug(n,i,s)}dg("rowspan",r,t,n)}class Xg extends td{refresh(){const t=yg(this.editor.model.document.selection),e=this.editor.plugins.get("TableUtils"),n=t.length>0;this.isEnabled=n,this.value=n&&t.every(t=>hg(e,t))}execute(t={}){if(t.forceValue===this.value)return;const e=this.editor.model,n=yg(e.document.selection),{first:i,last:o}=Ag(n),r=this.value?i:o+1;e.change(t=>{const e=lg("table",n[0]);dg("headingColumns",r,e,t,0)})}}class tp extends $l{static get pluginName(){return"TableUtils"}getCellLocation(t){const e=t.parent,n=e.parent,i=n.getChildIndex(e),o=new pg(n,{startRow:i,endRow:i});for(const{cell:e,row:n,column:i}of o)if(e===t)return{row:n,column:i}}createTable(t,e,n){const i=t.createElement("table");return ep(t,i,0,e,n),i}insertRows(t,e={}){const n=this.editor.model,i=e.at||0,o=e.rows||1;n.change(e=>{const n=t.getAttribute("headingRows")||0;if(n>i&&e.setAttribute("headingRows",n+o,t),0===i||i===t.childCount)return void ep(e,t,i,o,this.getColumns(t));const r=new pg(t,{endRow:i});let s=0;for(const{row:t,rowspan:n,colspan:a,cell:c}of r){const r=t+n>i;t<i&&r&&e.setAttribute("rowspan",n+o,c),t===i&&(s+=a)}ep(e,t,i,o,s)})}insertColumns(t,e={}){const n=this.editor.model,i=e.at||0,o=e.columns||1;n.change(e=>{const n=t.getAttribute("headingColumns");i<n&&e.setAttribute("headingColumns",n+o,t);const r=this.getColumns(t);if(0===i||r===i){for(const n of t.getChildren())np(o,e,e.createPositionAt(n,i?"end":0));return}const s=new pg(t,{column:i,includeSpanned:!0});for(const{row:n,cell:r,cellIndex:a}of s){const c=parseInt(r.getAttribute("rowspan")||1),l=parseInt(r.getAttribute("colspan")||1);if(a!==i&&l>1){if(e.setAttribute("colspan",l+o,r),s.skipRow(n),c>1)for(let t=n+1;t<n+c;t++)s.skipRow(t)}else{const i=e.createPositionAt(t.getChild(n),a);np(o,e,i)}}})}removeRows(t,e){const n=this.editor.model,i=e.rows||1,o=e.at,r=o+i-1,s=e.batch||"default",{cellsToMove:a,cellsToTrim:c}=function(t,e,n){const i=new Map,o=[];for(const{row:r,column:s,rowspan:a,cell:c}of new pg(t,{endRow:n})){const t=r+a-1;if(r>=e&&r<=n&&t>n){const t=a-(n-r+1);i.set(s,{cell:c,rowspan:t})}if(r<e&&t>=e){let i;i=t>=n?n-e+1:t-e+1,o.push({cell:c,rowspan:a-i})}}return{cellsToMove:i,cellsToTrim:o}}(t,o,r);n.enqueueChange(s,e=>{!function(t,e,n,i){const o=[...new pg(t,{includeSpanned:!0,startRow:e,endRow:e})],r=t.getChild(e);let s;for(const{column:t,cell:e,isSpanned:a}of o)if(n.has(t)){const{cell:e,rowspan:o}=n.get(t),a=s?i.createPositionAfter(s):i.createPositionAt(r,0);i.move(i.createRangeOn(e),a),dg("rowspan",o,e,i),s=e}else a||(s=e)}(t,r+1,a,e);for(let n=r;n>=o;n--)e.remove(t.getChild(n));for(const{rowspan:t,cell:n}of c)dg("rowspan",t,n,e);!function(t,e,n,i,o){const r=t.getAttribute("headingRows")||0;if(e<r){const s=n<r?r-(n-e+1):e;i.enqueueChange(o,e=>{dg("headingRows",s,t,e,0)})}}(t,o,r,n,s)})}removeColumns(t,e){const n=this.editor.model,i=e.at,o=e.columns||1,r=e.at+o-1;n.change(e=>{!function(t,e,n){const i=t.getAttribute("headingColumns")||0;if(i&&e.first<i){const o=Math.min(i-1,e.last)-e.first+1;n.setAttribute("headingColumns",i-o,t)}}(t,{first:i,last:r},e);for(let n=r;n>=i;n--)for(const{cell:i,column:o,colspan:r}of[...new pg(t)])if(o<=n&&r>1&&o+r>n)dg("colspan",r-1,i,e);else if(o===n){const n=i.parent;e.remove(i),n.childCount||this.removeRows(t,{at:n.index})}})}splitCellVertically(t,e=2){const n=this.editor.model,i=t.parent.parent,o=parseInt(t.getAttribute("rowspan")||1),r=parseInt(t.getAttribute("colspan")||1);n.change(n=>{if(r>1){const{newCellsSpan:i,updatedSpan:s}=ip(r,e);dg("colspan",s,t,n);const a={};i>1&&(a.colspan=i),o>1&&(a.rowspan=o),np(r>e?e-1:r-1,n,n.createPositionAfter(t),a)}if(r<e){const s=e-r,a=[...new pg(i)],{column:c}=a.find(({cell:e})=>e===t),l=a.filter(({cell:e,colspan:n,column:i})=>e!==t&&i===c||i<c&&i+n>c);for(const{cell:t,colspan:e}of l)n.setAttribute("colspan",e+s,t);const d={};o>1&&(d.rowspan=o),np(s,n,n.createPositionAfter(t),d);const u=i.getAttribute("headingColumns")||0;u>c&&dg("headingColumns",u+s,i,n)}})}splitCellHorizontally(t,e=2){const n=this.editor.model,i=t.parent,o=i.parent,r=o.getChildIndex(i),s=parseInt(t.getAttribute("rowspan")||1),a=parseInt(t.getAttribute("colspan")||1);n.change(n=>{if(s>1){const i=[...new pg(o,{startRow:r,endRow:r+s-1,includeSpanned:!0})],{newCellsSpan:c,updatedSpan:l}=ip(s,e);dg("rowspan",l,t,n);const{column:d}=i.find(({cell:e})=>e===t),u={};c>1&&(u.rowspan=c),a>1&&(u.colspan=a);for(const{column:t,row:e,cellIndex:s}of i){const i=t===d,a=(e+r+l)%c==0;if(e>=r+l&&i&&a){const t=n.createPositionAt(o.getChild(e),s);np(1,n,t,u)}}}if(s<e){const i=e-s,c=[...new pg(o,{startRow:0,endRow:r})];for(const{cell:e,rowspan:o,row:s}of c)if(e!==t&&s+o>r){const t=o+i;n.setAttribute("rowspan",t,e)}const l={};a>1&&(l.colspan=a),ep(n,o,r+1,i,1,l);const d=o.getAttribute("headingRows")||0;d>r&&dg("headingRows",d+i,o,n)}})}getColumns(t){return[...t.getChild(0).getChildren()].reduce((t,e)=>t+parseInt(e.getAttribute("colspan")||1),0)}getRows(t){return t.childCount}}function ep(t,e,n,i,o,r={}){for(let s=0;s<i;s++){const i=t.createElement("tableRow");t.insert(i,e,n),np(o,t,t.createPositionAt(i,"end"),r)}}function np(t,e,n,i={}){for(let o=0;o<t;o++)ug(e,n,i)}function ip(t,e){if(t<e)return{newCellsSpan:1,updatedSpan:1};const n=Math.floor(t/e);return{newCellsSpan:n,updatedSpan:t-n*e+n}}class op extends td{refresh(){this.isEnabled=function(t,e){const n=_g(t);if(n.length<2||!function(t){const e=lg("table",t[0]),n=xg(t),i=parseInt(e.getAttribute("headingRows")||0);if(!cp(n,i))return!1;const o=parseInt(e.getAttribute("headingColumns")||0);return cp(Ag(t),o)}(n))return!1;const i=new Set,o=new Set;let r=0;for(const t of n){const{row:n,column:s}=e.getCellLocation(t),a=parseInt(t.getAttribute("rowspan")||1),c=parseInt(t.getAttribute("colspan")||1);i.add(n),o.add(s),a>1&&i.add(n+a-1),c>1&&o.add(s+c-1),r+=a*c}return function(t,e){const n=Array.from(t.values()),i=Array.from(e.values()),o=Math.max(...n),r=Math.min(...n),s=Math.max(...i),a=Math.min(...i);return(o-r+1)*(s-a+1)}(i,o)==r}(this.editor.model.document.selection,this.editor.plugins.get(tp))}execute(){const t=this.editor.model,e=this.editor.plugins.get(tp);t.change(n=>{const i=_g(t.document.selection),o=i.shift();n.setSelection(o,0);const{mergeWidth:r,mergeHeight:s}=function(t,e,n){let i=0,o=0;for(const t of e){const{row:e,column:r}=n.getCellLocation(t);i=lp(t,r,i,"colspan"),o=lp(t,e,o,"rowspan")}const{row:r,column:s}=n.getCellLocation(t);return{mergeWidth:i-s,mergeHeight:o-r}}(o,i,e);dg("colspan",r,o,n),dg("rowspan",s,o,n);for(const t of i){const e=t.parent;sp(t,o,n),rp(e,n)}n.setSelection(o,"in")})}}function rp(t,e){if(t.childCount)return;const n=t.parent,i=n.getChildIndex(t);for(const{cell:t,row:o,rowspan:r}of new pg(n,{endRow:i})){o+r-1>=i&&dg("rowspan",r-1,t,e)}e.remove(t)}function sp(t,e,n){ap(t)||(ap(e)&&n.remove(n.createRangeIn(e)),n.move(n.createRangeIn(t),n.createPositionAt(e,"end"))),n.remove(t)}function ap(t){return 1==t.childCount&&t.getChild(0).is("paragraph")&&t.getChild(0).isEmpty}function cp({first:t,last:e},n){return t<n===e<n}function lp(t,e,n,i){const o=parseInt(t.getAttribute(i)||1);return Math.max(n,e+o)}class dp extends td{refresh(){const t=yg(this.editor.model.document.selection);this.isEnabled=t.length>0}execute(){const t=this.editor.model,e=yg(t.document.selection),n=xg(e),i=lg("table",e[0]),o=[];for(let e=n.first;e<=n.last;e++)for(const n of i.getChild(e).getChildren())o.push(t.createRangeOn(n));t.change(t=>{t.setSelection(o)})}}class up extends td{refresh(){const t=yg(this.editor.model.document.selection);this.isEnabled=t.length>0}execute(){const t=this.editor.model,e=yg(t.document.selection),n=e[0],i=e.pop(),o=this.editor.plugins.get("TableUtils"),r=o.getCellLocation(n),s=o.getCellLocation(i),a=Math.min(r.column,s.column),c=Math.max(r.column,s.column),l=[];for(const e of new pg(lg("table",n)))e.column>=a&&e.column<=c&&l.push(t.createRangeOn(e.cell));t.change(t=>{t.setSelection(l)})}}function hp(t){t.document.registerPostFixer(e=>function(t,e){const n=e.document.differ.getChanges();let i=!1;const o=new Set;for(const e of n){let n;"table"==e.name&&"insert"==e.type&&(n=e.position.nodeAfter),"tableRow"!=e.name&&"tableCell"!=e.name||(n=lg("table",e.position)),gp(e)&&(n=lg("table",e.range.start)),n&&!o.has(n)&&(i=fp(n,t)||i,i=mp(n,t)||i,o.add(n))}return i}(e,t))}function fp(t,e){let n=!1;const i=function(t){const e=parseInt(t.getAttribute("headingRows")||0),n=t.childCount,i=[];for(const{row:o,rowspan:r,cell:s}of new pg(t)){if(r<2)continue;const t=o<e?e:n;if(o+r>t){const e=t-o;i.push({cell:s,rowspan:e})}}return i}(t);if(i.length){n=!0;for(const t of i)dg("rowspan",t.rowspan,t.cell,e,1)}return n}function mp(t,e){let n=!1;const i=function(t){const e={};for(const{row:n}of new pg(t,{includeSpanned:!0}))e[n]||(e[n]=0),e[n]+=1;return e}(t),o=i[0];if(!Object.values(i).every(t=>t===o)){const o=Object.values(i).reduce((t,e)=>e>t?e:t,0);for(const[r,s]of Object.entries(i)){const i=o-s;if(i){for(let n=0;n<i;n++)ug(e,e.createPositionAt(t.getChild(r),"end"));n=!0}}}return n}function gp(t){const e="attribute"===t.type,n=t.attributeKey;return e&&("headingRows"===n||"colspan"===n||"rowspan"===n)}function pp(t){t.document.registerPostFixer(e=>function(t,e){const n=e.document.differ.getChanges();let i=!1;for(const e of n)"insert"==e.type&&"table"==e.name&&(i=bp(e.position.nodeAfter,t)||i),"insert"==e.type&&"tableRow"==e.name&&(i=wp(e.position.nodeAfter,t)||i),"insert"==e.type&&"tableCell"==e.name&&(i=kp(e.position.nodeAfter,t)||i),_p(e)&&(i=kp(e.position.parent,t)||i);return i}(e,t))}function bp(t,e){let n=!1;for(const i of t.getChildren())n=wp(i,e)||n;return n}function wp(t,e){let n=!1;for(const i of t.getChildren())n=kp(i,e)||n;return n}function kp(t,e){if(0==t.childCount)return e.insertElement("paragraph",t),!0;const n=Array.from(t.getChildren()).filter(t=>t.is("text"));for(const t of n)e.wrap(e.createRangeOn(t),"paragraph");return!!n.length}function _p(t){return!(!t.position||!t.position.parent.is("tableCell"))&&("insert"==t.type&&"$text"==t.name||"remove"==t.type)}function vp(t){t.document.registerPostFixer(()=>function(t){const e=t.document.differ,n=new Set;for(const t of e.getChanges()){const e="insert"==t.type||"remove"==t.type?t.position.parent:t.range.start.parent;e.is("tableCell")&&yp(e,t.type)&&n.add(e)}if(n.size){for(const t of n.values())e.refreshItem(t);return!0}return!1}(t))}function yp(t,e){if(!Array.from(t.getChildren()).some(t=>t.is("paragraph")))return!1;if("attribute"==e){const e=Array.from(t.getChild(0).getAttributeKeys()).length;return 1===t.childCount&&e<2}return t.childCount<=("insert"==e?2:1)}n(84);class xp extends $l{static get pluginName(){return"TableEditing"}init(){const t=this.editor,e=t.model,n=e.schema,i=t.conversion;n.register("table",{allowWhere:"$block",allowAttributes:["headingRows","headingColumns"],isLimit:!0,isObject:!0,isBlock:!0}),n.register("tableRow",{allowIn:"table",isLimit:!0}),n.register("tableCell",{allowIn:"tableRow",allowAttributes:["colspan","rowspan"],isObject:!0}),n.extend("$block",{allowIn:"tableCell"}),n.addChildCheck((t,e)=>{if("table"==e.name&&Array.from(t.getNames()).includes("table"))return!1}),i.for("upcast").add(fg()),i.for("editingDowncast").add(Pg({asWidget:!0})),i.for("dataDowncast").add(Pg()),i.for("upcast").elementToElement({model:"tableRow",view:"tr"}),i.for("editingDowncast").add(Sg({asWidget:!0})),i.for("dataDowncast").add(Sg()),i.for("downcast").add(t=>t.on("remove:tableRow",(t,e,n)=>{t.stop();const i=n.writer,o=n.mapper,r=o.toViewPosition(e.position).getLastMatchingPosition(t=>!t.item.is("tr")).nodeAfter,s=r.parent.parent,a=i.createRangeOn(r),c=i.remove(a);for(const t of i.createRangeIn(c).getItems())o.unbindViewElement(t);Bg("thead",s,n),Bg("tbody",s,n)},{priority:"higher"})),i.for("upcast").add(mg("td")),i.for("upcast").add(mg("th")),i.for("editingDowncast").add(Mg({asWidget:!0})),i.for("dataDowncast").add(Mg()),i.attributeToAttribute({model:"colspan",view:"colspan"}),i.attributeToAttribute({model:"rowspan",view:"rowspan"}),i.for("editingDowncast").add(Ig({asWidget:!0})),i.for("dataDowncast").add(Ig()),i.for("editingDowncast").add(Eg({asWidget:!0})),i.for("dataDowncast").add(Eg()),t.commands.add("insertTable",new Hg(t)),t.commands.add("insertTableRowAbove",new qg(t,{order:"above"})),t.commands.add("insertTableRowBelow",new qg(t,{order:"below"})),t.commands.add("insertTableColumnLeft",new Wg(t,{order:"left"})),t.commands.add("insertTableColumnRight",new Wg(t,{order:"right"})),t.commands.add("removeTableRow",new Qg(t)),t.commands.add("removeTableColumn",new Kg(t)),t.commands.add("splitTableCellVertically",new Yg(t,{direction:"vertically"})),t.commands.add("splitTableCellHorizontally",new Yg(t,{direction:"horizontally"})),t.commands.add("mergeTableCells",new op(t)),t.commands.add("mergeTableCellRight",new Gg(t,{direction:"right"})),t.commands.add("mergeTableCellLeft",new Gg(t,{direction:"left"})),t.commands.add("mergeTableCellDown",new Gg(t,{direction:"down"})),t.commands.add("mergeTableCellUp",new Gg(t,{direction:"up"})),t.commands.add("setTableColumnHeader",new Xg(t)),t.commands.add("setTableRowHeader",new Jg(t)),t.commands.add("selectTableRow",new dp(t)),t.commands.add("selectTableColumn",new up(t)),hp(e),vp(e),pp(e)}static get requires(){return[tp]}}n(86);class Ap extends cl{constructor(t){super(t);const e=this.bindTemplate;this.set("icon"),this.set("isEnabled",!0),this.set("isOn",!1),this.set("isToggleable",!1),this.set("isVisible",!0),this.set("keystroke"),this.set("label"),this.set("tabindex",-1),this.set("tooltip"),this.set("tooltipPosition","s"),this.set("type","button"),this.set("withText",!1),this.children=this.createCollection(),this.actionView=this._createActionView(),this.arrowView=this._createArrowView(),this.keystrokes=new Ac,this.focusTracker=new Oc,this.setTemplate({tag:"div",attributes:{class:["ck","ck-splitbutton",e.if("isVisible","ck-hidden",t=>!t),this.arrowView.bindTemplate.if("isOn","ck-splitbutton_open")]},children:this.children})}render(){super.render(),this.children.add(this.actionView),this.children.add(this.arrowView),this.focusTracker.add(this.actionView.element),this.focusTracker.add(this.arrowView.element),this.keystrokes.listenTo(this.element),this.keystrokes.set("arrowright",(t,e)=>{this.focusTracker.focusedElement===this.actionView.element&&(this.arrowView.focus(),e())}),this.keystrokes.set("arrowleft",(t,e)=>{this.focusTracker.focusedElement===this.arrowView.element&&(this.actionView.focus(),e())})}focus(){this.actionView.focus()}_createActionView(){const t=new Nl;return t.bind("icon","isEnabled","isOn","isToggleable","keystroke","label","tabindex","tooltip","tooltipPosition","type","withText").to(this),t.extendTemplate({attributes:{class:"ck-splitbutton__action"}}),t.delegate("execute").to(this),t}_createArrowView(){const t=new Nl,e=t.bindTemplate;return t.icon=Ol,t.extendTemplate({attributes:{class:"ck-splitbutton__arrow","aria-haspopup":!0,"aria-expanded":e.to("isOn",t=>String(t))}}),t.bind("isEnabled").to(this),t.delegate("execute").to(this,"open"),t}}n(88);class Tp extends cl{constructor(t){super(t);const e=this.bindTemplate;this.items=this._createGridCollection(),this.set("rows",0),this.set("columns",0),this.bind("label").to(this,"columns",this,"rows",(t,e)=>`${e} × ${t}`),this.setTemplate({tag:"div",attributes:{class:["ck"]},children:[{tag:"div",attributes:{class:["ck-insert-table-dropdown__grid"]},on:{"mouseover@.ck-insert-table-dropdown-grid-box":e.to("boxover")},children:this.items},{tag:"div",attributes:{class:["ck-insert-table-dropdown__label"]},children:[{text:e.to("label")}]}],on:{mousedown:e.to(t=>{t.preventDefault()}),click:e.to(()=>{this.fire("execute")})}}),this.on("boxover",(t,e)=>{const{row:n,column:i}=e.target.dataset;this.set({rows:parseInt(n),columns:parseInt(i)})}),this.on("change:columns",()=>{this._highlightGridBoxes()}),this.on("change:rows",()=>{this._highlightGridBoxes()})}focus(){}focusLast(){}_highlightGridBoxes(){const t=this.rows,e=this.columns;this.items.map((n,i)=>{const o=Math.floor(i/10)<t&&i%10<e;n.set("isOn",o)})}_createGridCollection(){const t=[];for(let e=0;e<100;e++){const n=Math.floor(e/10),i=e%10;t.push(new Cp(this.locale,n+1,i+1))}return this.createCollection(t)}}class Cp extends cl{constructor(t,e,n){super(t);const i=this.bindTemplate;this.set("isOn",!1),this.setTemplate({tag:"div",attributes:{class:["ck-insert-table-dropdown-grid-box",i.if("isOn","ck-on")],"data-row":e,"data-column":n}})}}class Pp extends $l{init(){const t=this.editor,e=this.editor.t,n="ltr"===t.locale.contentLanguageDirection;t.ui.componentFactory.add("insertTable",n=>{const i=t.commands.get("insertTable"),o=Bl(n);let r;return o.bind("isEnabled").to(i),o.buttonView.set({icon:'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 6v3h4V6H3zm0 4v3h4v-3H3zm0 4v3h4v-3H3zm5 3h4v-3H8v3zm5 0h4v-3h-4v3zm4-4v-3h-4v3h4zm0-4V6h-4v3h4zm1.5 8a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 17V4c.222-.863 1.068-1.5 2-1.5h13c.932 0 1.778.637 2 1.5v13zM12 13v-3H8v3h4zm0-4V6H8v3h4z"/></svg>',label:e("Insert table"),tooltip:!0}),o.on("change:isOpen",()=>{r||(r=new Tp(n),o.panelView.children.add(r),r.delegate("execute").to(o),o.buttonView.on("open",()=>{r.rows=0,r.columns=0}),o.on("execute",()=>{t.execute("insertTable",{rows:r.rows,columns:r.columns}),t.editing.view.focus()}))}),o}),t.ui.componentFactory.add("tableColumn",t=>{const i=[{type:"switchbutton",model:{commandName:"setTableColumnHeader",label:e("Header column"),bindIsOn:!0}},{type:"separator"},{type:"button",model:{commandName:n?"insertTableColumnLeft":"insertTableColumnRight",label:e("Insert column left")}},{type:"button",model:{commandName:n?"insertTableColumnRight":"insertTableColumnLeft",label:e("Insert column right")}},{type:"button",model:{commandName:"removeTableColumn",label:e("Delete column")}},{type:"button",model:{commandName:"selectTableColumn",label:e("Select column")}}];return this._prepareDropdown(e("Column"),'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 1h15A1.5 1.5 0 0 1 19 2.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 1 17.5v-15A1.5 1.5 0 0 1 2.5 1zM2 2v16h16V2H2z" opacity=".6"/><path d="M18 7v1H2V7h16zm0 5v1H2v-1h16z" opacity=".6"/><path d="M14 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1zm-2 1H8v4h4V2zm0 6H8v4h4V8zm0 6H8v4h4v-4z"/></svg>',i,t)}),t.ui.componentFactory.add("tableRow",t=>{const n=[{type:"switchbutton",model:{commandName:"setTableRowHeader",label:e("Header row"),bindIsOn:!0}},{type:"separator"},{type:"button",model:{commandName:"insertTableRowBelow",label:e("Insert row below")}},{type:"button",model:{commandName:"insertTableRowAbove",label:e("Insert row above")}},{type:"button",model:{commandName:"removeTableRow",label:e("Delete row")}},{type:"button",model:{commandName:"selectTableRow",label:e("Select row")}}];return this._prepareDropdown(e("Row"),'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 1h15A1.5 1.5 0 0 1 19 2.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 1 17.5v-15A1.5 1.5 0 0 1 2.5 1zM2 2v16h16V2H2z" opacity=".6"/><path d="M7 2h1v16H7V2zm5 0h1v16h-1V2z" opacity=".6"/><path d="M1 6h18a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm1 2v4h4V8H2zm6 0v4h4V8H8zm6 0v4h4V8h-4z"/></svg>',n,t)}),t.ui.componentFactory.add("mergeTableCells",t=>{const i=[{type:"button",model:{commandName:"mergeTableCellUp",label:e("Merge cell up")}},{type:"button",model:{commandName:n?"mergeTableCellRight":"mergeTableCellLeft",label:e("Merge cell right")}},{type:"button",model:{commandName:"mergeTableCellDown",label:e("Merge cell down")}},{type:"button",model:{commandName:n?"mergeTableCellLeft":"mergeTableCellRight",label:e("Merge cell left")}},{type:"separator"},{type:"button",model:{commandName:"splitTableCellVertically",label:e("Split cell vertically")}},{type:"button",model:{commandName:"splitTableCellHorizontally",label:e("Split cell horizontally")}}];return this._prepareMergeSplitButtonDropdown(e("Merge cells"),'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 1h15A1.5 1.5 0 0 1 19 2.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 1 17.5v-15A1.5 1.5 0 0 1 2.5 1zM2 2v16h16V2H2z" opacity=".6"/><path d="M7 2h1v16H7V2zm5 0h1v7h-1V2zm6 5v1H2V7h16zM8 12v1H2v-1h6z" opacity=".6"/><path d="M7 7h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm1 2v9h10V9H8z"/></svg>',i,t)})}_prepareDropdown(t,e,n,i){const o=this.editor,r=Bl(i),s=this._fillDropdownWithListOptions(r,n);return r.buttonView.set({label:t,icon:e,tooltip:!0}),r.bind("isEnabled").toMany(s,"isEnabled",(...t)=>t.some(t=>t)),this.listenTo(r,"execute",t=>{o.execute(t.source.commandName),o.editing.view.focus()}),r}_prepareMergeSplitButtonDropdown(t,e,n,i){const o=this.editor,r=Bl(i,Ap);return this._fillDropdownWithListOptions(r,n),r.buttonView.set({label:t,icon:e,tooltip:!0,isEnabled:!0}),this.listenTo(r.buttonView,"execute",()=>{o.execute("mergeTableCells"),o.editing.view.focus()}),this.listenTo(r,"execute",t=>{o.execute(t.source.commandName),o.editing.view.focus()}),r}_fillDropdownWithListOptions(t,e){const n=this.editor,i=[],o=new An;for(const t of e)Sp(t,n,i,o);return Fl(t,o,n.ui.componentFactory),i}}function Sp(t,e,n,i){const o=t.model=new Nf(t.model),{commandName:r,bindIsOn:s}=t.model;if("button"===t.type||"switchbutton"===t.type){const t=e.commands.get(r);n.push(t),o.set({commandName:r}),o.bind("isEnabled").to(t),s&&o.bind("isOn").to(t,"value")}o.set({withText:!0}),i.add(t)}class Mp extends Nr{constructor(t){super(t),this.domEventType=["mousemove","mouseup","mouseleave"]}onDomEvent(t){this.fire(t.type,t)}}function Ep(t,e,n){const i=Array.from(t),o=i[0],r=i[i.length-1],{row:s,column:a}=e.getCellLocation(o),c=function(t,e,n,i){const o=n.createElement("table"),r=new Map,s=new Map;for(const e of t){const t=lg("tableRow",e);if(!r.has(t)){const e=t._clone();n.append(e,o),r.set(t,e)}const a=e._clone(!0),{column:c}=i.getCellLocation(e);s.set(a,c),n.append(a,r.get(t))}return function(t,e,n,i,o){for(const r of t.getChildren())for(const t of Array.from(r.getChildren())){const{column:r}=o.getCellLocation(t),s=n.get(t)-e;if(r!==s)for(let e=0;e<s-r;e++){const e=i.createElement("tableCell");i.insert(e,i.createPositionBefore(t));const n=i.createElement("paragraph");i.insert(n,e,0),i.insertText("",n,0)}}}(o,e,s,n,i),o}(i,a,n,e),{row:l,column:d}=e.getCellLocation(r);return function(t,e,n,i,o){for(const r of t.getChildren())for(const t of r.getChildren()){const r=parseInt(t.getAttribute("colspan")||1),s=parseInt(t.getAttribute("rowspan")||1),{row:a,column:c}=o.getCellLocation(t);if(c+r>e){const n=e-c;n>1?i.setAttribute("colspan",n,t):i.removeAttribute("colspan",t)}if(a+s>n){const e=n-a;e>1?i.setAttribute("rowspan",e,t):i.removeAttribute("rowspan",t)}}}(c,d-a+1,l-s+1,n,e),function(t,e,n,i,o){const r=parseInt(e.getAttribute("headingRows")||0);if(r>0){const e=r-n;o.setAttribute("headingRows",e,t)}const s=parseInt(e.getAttribute("headingColumns")||0);if(s>0){const e=s-i;o.setAttribute("headingColumns",e,t)}}(c,lg("table",o),s,a,n),c}n(90);class Ip extends $l{static get pluginName(){return"TableSelection"}static get requires(){return[tp]}init(){const t=this.editor,e=t.model;this.listenTo(e,"deleteContent",(t,e)=>this._handleDeleteContent(t,e),{priority:"high"}),t.editing.view.addObserver(Mp),this._defineSelectionConverter(),this._enableShiftClickSelection(),this._enableMouseDragSelection(),this._enablePluginDisabling()}getSelectedTableCells(){const t=_g(this.editor.model.document.selection);return 0==t.length?null:t}getSelectionAsFragment(){const t=this.getSelectedTableCells();return t?this.editor.model.change(e=>{const n=e.createDocumentFragment(),i=Ep(t,this.editor.plugins.get("TableUtils"),e);return e.insert(i,n,0),n}):null}_defineSelectionConverter(){const t=this.editor,e=new Set;t.conversion.for("editingDowncast").add(t=>t.on("selection",(t,n,i)=>{const o=i.writer;!function(t){for(const n of e)t.removeClass("ck-editor__editable_selected",n);e.clear()}(o);const r=this.getSelectedTableCells();if(!r)return;for(const t of r){const n=i.mapper.toViewElement(t);o.addClass("ck-editor__editable_selected",n),e.add(n)}const s=i.mapper.toViewElement(r[r.length-1]);o.setSelection(s,0)},{priority:"lowest"}))}_enableShiftClickSelection(){const t=this.editor;let e=!1;this.listenTo(t.editing.view.document,"mousedown",(n,i)=>{if(!this.isEnabled)return;if(!i.domEvent.shiftKey)return;const o=vg(t.model.document.selection)[0];if(!o)return;const r=this._getModelTableCellFromDomEvent(i);r&&Np(o,r)&&(e=!0,this._setCellSelection(o,r),i.preventDefault())}),this.listenTo(t.editing.view.document,"mouseup",()=>{e=!1}),this.listenTo(t.editing.view.document,"selectionChange",t=>{e&&t.stop()},{priority:"highest"})}_enableMouseDragSelection(){const t=this.editor;let e,n,i=!1,o=!1;this.listenTo(t.editing.view.document,"mousedown",(t,n)=>{this.isEnabled&&(n.domEvent.shiftKey||n.domEvent.ctrlKey||n.domEvent.altKey||(e=this._getModelTableCellFromDomEvent(n)))}),this.listenTo(t.editing.view.document,"mousemove",(t,r)=>{if(!r.domEvent.buttons)return;if(!e)return;const s=this._getModelTableCellFromDomEvent(r);s&&Np(e,s)&&(n=s,i||n==e||(i=!0)),i&&(o=!0,this._setCellSelection(e,n),r.preventDefault())}),this.listenTo(t.editing.view.document,"mouseup",()=>{i=!1,o=!1,e=null,n=null}),this.listenTo(t.editing.view.document,"selectionChange",t=>{o&&t.stop()},{priority:"highest"})}_enablePluginDisabling(){const t=this.editor;this.on("change:isEnabled",()=>{if(!this.isEnabled){const e=this.getSelectedTableCells();if(!e)return;t.model.change(n=>{const i=n.createPositionAt(e[0],0),o=t.model.schema.getNearestSelectionRange(i);n.setSelection(o)})}})}_handleDeleteContent(t,e){const[n,i]=e,o=this.editor.model,r=!i||"backward"==i.direction,s=_g(n);s.length&&(t.stop(),o.change(t=>{const e=s[r?s.length-1:0];o.change(t=>{for(const e of s)o.deleteContent(t.createSelection(e,"in"))});const i=o.schema.getNearestSelectionRange(t.createPositionAt(e,0));n.is("documentSelection")?t.setSelection(i):n.setTo(i)}))}_setCellSelection(t,e){const n=this._getCellsToSelect(t,e);this.editor.model.change(t=>{t.setSelection(n.cells.map(e=>t.createRangeOn(e)),{backward:n.backward})})}_getModelTableCellFromDomEvent(t){const e=t.target,n=this.editor.editing.view.createPositionAt(e,0),i=this.editor.editing.mapper.toModelPosition(n).parent;return i.is("tableCell")?i:lg("tableCell",i)}_getCellsToSelect(t,e){const n=this.editor.plugins.get("TableUtils"),i=n.getCellLocation(t),o=n.getCellLocation(e),r=Math.min(i.row,o.row),s=Math.max(i.row,o.row),a=Math.min(i.column,o.column),c=Math.max(i.column,o.column),l=[];for(const e of new pg(lg("table",t),{startRow:r,endRow:s}))e.column>=a&&e.column<=c&&l.push(e.cell);return function(t,e){if(t.row>e.row)return!0;if(t.row==e.row&&t.column>e.column)return!0;return!1}(i,o)?{cells:l.reverse(),backward:!0}:{cells:l,backward:!1}}}function Np(t,e){return t.parent.parent==e.parent.parent}class Op extends $l{static get pluginName(){return"TableClipboard"}static get requires(){return[Ip]}init(){const t=this.editor.editing.view.document;this.listenTo(t,"copy",(t,e)=>this._onCopyCut(t,e)),this.listenTo(t,"cut",(t,e)=>this._onCopyCut(t,e))}_onCopyCut(t,e){const n=this.editor.plugins.get("TableSelection");if(!n.getSelectedTableCells())return;if("cut"==t.name&&this.editor.isReadOnly)return;e.preventDefault(),t.stop();const i=this.editor.data,o=this.editor.editing.view.document,r=i.toView(n.getSelectionAsFragment());o.fire("clipboardOutput",{dataTransfer:e.dataTransfer,content:r,method:t.name})}}class Rp extends $l{static get pluginName(){return"TableNavigation"}init(){const t=this.editor.editing.view.document;this.editor.keystrokes.set("Tab",(...t)=>this._handleTabOnSelectedTable(...t),{priority:"low"}),this.editor.keystrokes.set("Tab",this._getTabHandler(!0),{priority:"low"}),this.editor.keystrokes.set("Shift+Tab",this._getTabHandler(!1),{priority:"low"}),this.listenTo(t,"keydown",(...t)=>this._onKeydown(...t),{priority:un.get("high")+1})}_handleTabOnSelectedTable(t,e){const n=this.editor,i=n.model.document.selection;if(!i.isCollapsed&&1===i.rangeCount&&i.getFirstRange().isFlat){const t=i.getSelectedElement();if(!t||!t.is("table"))return;e(),n.model.change(e=>{e.setSelection(e.createRangeIn(t.getChild(0).getChild(0)))})}}_getTabHandler(t){const e=this.editor;return(n,i)=>{const o=vg(e.model.document.selection)[0];if(!o)return;i();const r=o.parent,s=r.parent,a=s.getChildIndex(r),c=r.getChildIndex(o),l=0===c;if(!t&&l&&0===a)return;const d=c===r.childCount-1,u=a===s.childCount-1;if(t&&u&&d&&(e.execute("insertTableRowBelow"),a===s.childCount-1))return;let h;if(t&&d){const t=s.getChild(a+1);h=t.getChild(0)}else if(!t&&l){const t=s.getChild(a-1);h=t.getChild(t.childCount-1)}else h=r.getChild(c+(t?1:-1));e.model.change(t=>{t.setSelection(t.createRangeIn(h))})}}_onKeydown(t,e){const n=e.keyCode;(function(t){return t==go.arrowright||t==go.arrowleft||t==go.arrowup||t==go.arrowdown})(n)&&this._handleArrowKeys(function(t,e){const n="ltr"===e;switch(t){case go.arrowleft:return n?"left":"right";case go.arrowright:return n?"right":"left";case go.arrowup:return"up";case go.arrowdown:return"down"}}(n,this.editor.locale.contentLanguageDirection))&&(e.preventDefault(),e.stopPropagation(),t.stop())}_handleArrowKeys(t){const e=this.editor.model,n=e.document.selection,i=["right","down"].includes(t),o=_g(n);if(o.length){const e=i?o[o.length-1]:o[0];return this._navigateFromCellInDirection(e,t),!0}const r=lg("tableCell",n.focus);if(!r)return!1;const s=e.createRangeIn(r);if(this._isSelectionAtCellEdge(n,i))return this._navigateFromCellInDirection(r,t),!0;const a=n.getSelectedElement();if(a&&e.schema.isObject(a))return!1;if(this._isObjectElementNextToSelection(n,i))return!1;const c=this._findTextRangeFromSelection(s,n,i);return c?!["left","right"].includes(t)&&(this._isSingleLineRange(c,i)?(e.change(t=>{t.setSelection(i?s.end:s.start)}),!0):void 0):(this._navigateFromCellInDirection(r,t),!0)}_isSelectionAtCellEdge(t,e){const n=this.editor.model,i=this.editor.model.schema,o=e?t.getLastPosition():t.getFirstPosition();if(!i.getLimitElement(o).is("tableCell"))return!1;const r=n.createSelection(o);return n.modifySelection(r,{direction:e?"forward":"backward"}),o.isEqual(r.focus)}_isObjectElementNextToSelection(t,e){const n=this.editor.model,i=n.schema,o=n.createSelection(t);n.modifySelection(o,{direction:e?"forward":"backward"});const r=e?o.focus.nodeBefore:o.focus.nodeAfter;return r&&i.isObject(r)}_findTextRangeFromSelection(t,e,n){const i=this.editor.model;if(n){const n=e.getLastPosition(),o=this._getNearestVisibleTextPosition(t,"backward");return o&&n.isBefore(o)?i.createRange(n,o):null}{const n=e.getFirstPosition(),o=this._getNearestVisibleTextPosition(t,"forward");return o&&n.isAfter(o)?i.createRange(o,n):null}}_getNearestVisibleTextPosition(t,e){const n=this.editor.model.schema,i=this.editor.editing.mapper;for(const{nextPosition:o,item:r}of t.getWalker({direction:e}))if(n.checkChild(o,"$text")){const t=i.toViewElement(r);if(t&&!t.hasClass("ck-hidden"))return o}}_isSingleLineRange(t,e){const n=this.editor.model,i=this.editor.editing,o=i.view.domConverter;if(e){const e=n.createSelection(t.start);n.modifySelection(e),e.focus.isAtEnd||t.start.isEqual(e.focus)||(t=n.createRange(e.focus,t.end))}const r=i.mapper.toViewRange(t),s=o.viewRangeToDom(r),a=Zr.getDomRangeRects(s);let c;for(const t of a)if(void 0!==c){if(Math.round(t.top)>=c)return!1;c=Math.max(c,Math.round(t.bottom))}else c=Math.round(t.bottom);return!0}_navigateFromCellInDirection(t,e){const n=this.editor.model,i=lg("table",t),o=[...new pg(i,{includeSpanned:!0})],{row:r,column:s}=o[o.length-1],a=o.find(({cell:e})=>e==t);let{row:c,column:l}=a;switch(e){case"left":l--;break;case"up":c--;break;case"right":l+=a.colspan;break;case"down":c+=a.rowspan}if(c<0||c>r||l<0&&c<=0||l>s&&c>=r)return void n.change(t=>{t.setSelection(t.createRangeOn(i))});l<0?(l=s,c--):l>s&&(l=0,c++);const d=o.find(t=>t.row==c&&t.column==l).cell,u=["right","down"].includes(e),h=n.createPositionAt(d,u?0:"end");n.change(t=>{t.setSelection(h)})}}n(92);class Dp{constructor(t,e){this.model=t,this.testCallback=e,this.hasMatch=!1,this.set("isEnabled",!0),this.on("change:isEnabled",()=>{this.isEnabled?this._startListening():(this.stopListening(t.document.selection),this.stopListening(t.document))}),this._startListening()}_startListening(){const t=this.model.document;this.listenTo(t.selection,"change:range",(e,{directChange:n})=>{n&&(t.selection.isCollapsed?this._evaluateTextBeforeSelection("selection"):this.hasMatch&&(this.fire("unmatched"),this.hasMatch=!1))}),this.listenTo(t,"change:data",(t,e)=>{"transparent"!=e.type&&this._evaluateTextBeforeSelection("data",{batch:e})})}_evaluateTextBeforeSelection(t,e={}){const n=this.model,i=n.document.selection,o=n.createRange(n.createPositionAt(i.focus.parent,0),i.focus),{text:r,range:s}=ru(o,n),a=this.testCallback(r);if(!a&&this.hasMatch&&this.fire("unmatched"),this.hasMatch=!!a,a){const n=Object.assign(e,{text:r,range:s});"object"==typeof a&&Object.assign(n,a),this.fire("matched:"+t,n)}}}xn(Dp,Ui);var Lp=/[\\^$.*+?()[\]{}|]/g,jp=RegExp(Lp.source);var Vp=function(t){return(t=Zn(t))&&jp.test(t)?t.replace(Lp,"\\$&"):t};const zp={copyright:{from:"(c)",to:"©"},registeredTrademark:{from:"(r)",to:"®"},trademark:{from:"(tm)",to:"™"},oneHalf:{from:"1/2",to:"½"},oneThird:{from:"1/3",to:"⅓"},twoThirds:{from:"2/3",to:"⅔"},oneForth:{from:"1/4",to:"¼"},threeQuarters:{from:"3/4",to:"¾"},lessThanOrEqual:{from:"<=",to:"≤"},greaterThanOrEqual:{from:">=",to:"≥"},notEqual:{from:"!=",to:"≠"},arrowLeft:{from:"<-",to:"←"},arrowRight:{from:"->",to:"→"},horizontalEllipsis:{from:"...",to:"…"},enDash:{from:/(^| )(--)( )$/,to:[null,"–",null]},emDash:{from:/(^| )(---)( )$/,to:[null,"—",null]},quotesPrimary:{from:Wp('"'),to:[null,"“",null,"”"]},quotesSecondary:{from:Wp("'"),to:[null,"‘",null,"’"]},quotesPrimaryEnGb:{from:Wp("'"),to:[null,"‘",null,"’"]},quotesSecondaryEnGb:{from:Wp('"'),to:[null,"“",null,"”"]},quotesPrimaryPl:{from:Wp('"'),to:[null,"„",null,"”"]},quotesSecondaryPl:{from:Wp("'"),to:[null,"‚",null,"’"]}},Bp={symbols:["copyright","registeredTrademark","trademark"],mathematical:["oneHalf","oneThird","twoThirds","oneForth","threeQuarters","lessThanOrEqual","greaterThanOrEqual","notEqual","arrowLeft","arrowRight"],typography:["horizontalEllipsis","enDash","emDash"],quotes:["quotesPrimary","quotesSecondary"]},Fp=["symbols","mathematical","typography","quotes"];function Up(t){return"string"==typeof t?new RegExp(`(${Vp(t)})$`):t}function Hp(t){return"string"==typeof t?()=>[t]:t instanceof Array?()=>t:t}function qp(t){return(t.textNode?t.textNode:t.nodeAfter).getAttributes()}function Wp(t){return new RegExp(`(^|\\s)(${t})([^${t}]*)(${t})$`)}class Yp extends Gl{}Yp.builtinPlugins=[class extends $l{static get requires(){return[Xl,sd,gd,dd,Md,Qd]}static get pluginName(){return"Essentials"}},nu,class extends $l{static get pluginName(){return"Autoformat"}afterInit(){this._addListAutoformats(),this._addBasicStylesAutoformats(),this._addHeadingAutoformats(),this._addBlockQuoteAutoformats(),this._addCodeBlockAutoformats()}_addListAutoformats(){const t=this.editor.commands;t.get("bulletedList")&&new ou(this.editor,/^[*-]\s$/,"bulletedList"),t.get("numberedList")&&new ou(this.editor,/^1[.|)]\s$/,"numberedList")}_addBasicStylesAutoformats(){const t=this.editor.commands;if(t.get("bold")){const t=cu(this.editor,"bold");new su(this.editor,/(\*\*)([^*]+)(\*\*)$/g,t),new su(this.editor,/(__)([^_]+)(__)$/g,t)}if(t.get("italic")){const t=cu(this.editor,"italic");new su(this.editor,/(?:^|[^*])(\*)([^*_]+)(\*)$/g,t),new su(this.editor,/(?:^|[^_])(_)([^_]+)(_)$/g,t)}if(t.get("code")){const t=cu(this.editor,"code");new su(this.editor,/(`)([^`]+)(`)$/g,t)}if(t.get("strikethrough")){const t=cu(this.editor,"strikethrough");new su(this.editor,/(~~)([^~]+)(~~)$/g,t)}}_addHeadingAutoformats(){const t=this.editor.commands.get("heading");t&&t.modelElements.filter(t=>t.match(/^heading[1-6]$/)).forEach(e=>{const n=e[7],i=new RegExp(`^(#{${n}})\\s$`);new ou(this.editor,i,()=>{if(!t.isEnabled)return!1;this.editor.execute("heading",{value:e})})})}_addBlockQuoteAutoformats(){this.editor.commands.get("blockQuote")&&new ou(this.editor,/^>\s$/,"blockQuote")}_addCodeBlockAutoformats(){this.editor.commands.get("codeBlock")&&new ou(this.editor,/^```$/,"codeBlock")}},class extends $l{static get requires(){return[du,uu]}static get pluginName(){return"Bold"}},class extends $l{static get requires(){return[hu,fu]}static get pluginName(){return"Italic"}},class extends $l{static get requires(){return[ku,_u]}static get pluginName(){return"BlockQuote"}},class extends $l{static get pluginName(){return"CKFinder"}static get requires(){return[Ch,vu,nu]}},class extends $l{static get requires(){return[Oh,af,xf]}static get pluginName(){return"EasyImage"}},class extends $l{static get requires(){return[If,Of]}static get pluginName(){return"Heading"}},af,class extends $l{static get requires(){return[Lf]}static get pluginName(){return"ImageCaption"}},class extends $l{static get requires(){return[Jf,Zf]}static get pluginName(){return"ImageStyle"}},class extends $l{static get requires(){return[Xf]}static get pluginName(){return"ImageToolbar"}afterInit(){const t=this.editor,e=t.t;t.plugins.get(Xf).register("image",{ariaLabel:e("Image toolbar"),items:t.config.get("image.toolbar")||[],getRelatedElement:Ou})}},xf,class extends $l{static get pluginName(){return"Indent"}static get requires(){return[im,sm]}},class extends $l{static get requires(){return[yh,dm]}static get pluginName(){return"Link"}},class extends $l{static get requires(){return[Lm,Vm]}static get pluginName(){return"List"}},class extends $l{static get requires(){return[Gm,Jm,Qm,Lh]}static get pluginName(){return"MediaEmbed"}},Cf,class extends $l{static get pluginName(){return"PasteFromOffice"}static get requires(){return[Xl]}init(){const t=this.editor,e=[];e.push(new cg),e.push(new ng(t.editing.view.document)),t.plugins.get("Clipboard").on("inputTransformation",(t,n)=>{if(n.isTransformedWithPasteFromOffice)return;const i=n.dataTransfer.getData("text/html"),o=e.find(t=>t.isActive(i));o&&(o.execute(n),n.isTransformedWithPasteFromOffice=!0)},{priority:"high"})}},class extends $l{static get requires(){return[xp,Pp,Ip,Op,Rp,Lh]}static get pluginName(){return"Table"}},class extends $l{static get requires(){return[Xf]}static get pluginName(){return"TableToolbar"}afterInit(){const t=this.editor,e=t.t,n=t.plugins.get(Xf),i=t.config.get("table.contentToolbar"),o=t.config.get("table.tableToolbar");i&&n.register("tableContent",{ariaLabel:e("Table toolbar"),items:i,getRelatedElement:kg}),o&&n.register("table",{ariaLabel:e("Table toolbar"),items:o,getRelatedElement:wg})}},class extends $l{static get pluginName(){return"TextTransformation"}constructor(t){super(t),t.config.define("typing",{transformations:{include:Fp}})}init(){const t=this.editor.model.document.selection;t.on("change:range",()=>{this.isEnabled=!t.anchor.parent.is("codeBlock")}),this._enableTransformationWatchers()}_enableTransformationWatchers(){const t=this.editor,e=t.model,n=t.plugins.get("Input"),i=function(t){const e=t.extra||[],n=t.remove||[],i=t=>!n.includes(t);return function(t){const e=new Set;for(const n of t)if(Bp[n])for(const t of Bp[n])e.add(t);else e.add(n);return Array.from(e)}(t.include.concat(e).filter(i)).filter(i).map(t=>zp[t]||t).map(t=>({from:Up(t.from),to:Hp(t.to)}))}(t.config.get("typing.transformations")),o=new Dp(t.model,t=>{for(const e of i){if(e.from.test(t))return{normalizedTransformation:e}}});o.on("matched:data",(t,i)=>{if(!n.isInput(i.batch))return;const{from:o,to:r}=i.normalizedTransformation,s=o.exec(i.text),a=r(s.slice(1)),c=i.range;let l=s.index;e.enqueueChange(t=>{for(let n=1;n<s.length;n++){const i=s[n],o=a[n-1];if(null==o){l+=i.length;continue}const r=c.start.getShiftedBy(l),d=e.createRange(r,r.getShiftedBy(i.length)),u=qp(r);e.insertContent(t.createText(o,u),d),l+=o.length}})}),o.bind("isEnabled").to(this)}}],Yp.defaultConfig={toolbar:{items:["heading","|","bold","italic","link","bulletedList","numberedList","|","indent","outdent","|","imageUpload","blockQuote","insertTable","mediaEmbed","undo","redo"]},image:{toolbar:["imageStyle:full","imageStyle:side","|","imageTextAlternative"]},table:{contentToolbar:["tableColumn","tableRow","mergeTableCells"]},language:"en"}}]).default}));
//# sourceMappingURL=ckeditor.js.map

/***/ })

/******/ });
//# sourceMappingURL=vue-json-schema-form.common.js.map