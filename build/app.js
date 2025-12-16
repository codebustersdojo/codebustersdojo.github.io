(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.T.F === region.Y.F)
	{
		return 'on line ' + region.T.F;
	}
	return 'on lines ' + region.T.F + ' through ' + region.Y.F;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aN,
		impl.a_,
		impl.aX,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		p: func(record.p),
		U: record.U,
		R: record.R
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.p;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.U;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.R) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aN,
		impl.a_,
		impl.aX,
		function(sendToApp, initialModel) {
			var view = impl.a$;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aN,
		impl.a_,
		impl.aX,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.S && impl.S(sendToApp)
			var view = impl.a$;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.az);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.aZ) && (_VirtualDom_doc.title = title = doc.aZ);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.aR;
	var onUrlRequest = impl.aS;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		S: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.am === next.am
							&& curr.ac === next.ac
							&& curr.aj.a === next.aj.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		aN: function(flags)
		{
			return A3(impl.aN, flags, _Browser_getUrl(), key);
		},
		a$: impl.a$,
		a_: impl.a_,
		aX: impl.aX
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { aK: 'hidden', aA: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { aK: 'mozHidden', aA: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { aK: 'msHidden', aA: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { aK: 'webkitHidden', aA: 'webkitvisibilitychange' }
		: { aK: 'hidden', aA: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aq: _Browser_getScene(),
		at: {
			av: _Browser_window.pageXOffset,
			aw: _Browser_window.pageYOffset,
			au: _Browser_doc.documentElement.clientWidth,
			ab: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		au: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		ab: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aq: {
				au: node.scrollWidth,
				ab: node.scrollHeight
			},
			at: {
				av: node.scrollLeft,
				aw: node.scrollTop,
				au: node.clientWidth,
				ab: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aq: _Browser_getScene(),
			at: {
				av: x,
				aw: y,
				au: _Browser_doc.documentElement.clientWidth,
				ab: _Browser_doc.documentElement.clientHeight
			},
			aE: {
				av: x + rect.left,
				aw: y + rect.top,
				au: rect.width,
				ab: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.a) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.c);
		} else {
			var treeLen = builder.a * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.d) : builder.d;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.a);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.c);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{d: nodeList, a: (len / $elm$core$Array$branchFactor) | 0, c: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {_: fragment, ac: host, ah: path, aj: port_, am: protocol, an: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Main$Loading = {$: 0};
var $author$project$Interface$RandomCipher = 0;
var $author$project$Main$NewProblem = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$float = F2(
	function (a, b) {
		return function (seed0) {
			var seed1 = $elm$random$Random$next(seed0);
			var range = $elm$core$Basics$abs(b - a);
			var n1 = $elm$random$Random$peel(seed1);
			var n0 = $elm$random$Random$peel(seed0);
			var lo = (134217727 & n1) * 1.0;
			var hi = (67108863 & n0) * 1.0;
			var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
			var scaled = (val * range) + a;
			return _Utils_Tuple2(
				scaled,
				$elm$random$Random$next(seed1));
		};
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{d: nodeList, a: nodeListSize, c: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.c)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.c, tail);
		return (notAppended < 0) ? {
			d: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.d),
			a: builder.a + 1,
			c: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			d: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.d),
			a: builder.a + 1,
			c: $elm$core$Elm$JsArray$empty
		} : {d: builder.d, a: builder.a, c: appended});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						d: _List_Nil,
						a: 0,
						c: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_v0.$) {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_v0.$) {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$generateRandomInput = A2(
	$elm$random$Random$map,
	function (xs) {
		return {
			B: A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Array$get, 0, xs)),
			D: A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Array$get, 1, xs)),
			aL: $elm$core$Array$toList(
				A3($elm$core$Array$slice, 2, 102, xs))
		};
	},
	A2(
		$elm$random$Random$map,
		$elm$core$Array$fromList,
		A2(
			$elm$random$Random$list,
			102,
			A2($elm$random$Random$float, 0, 1))));
var $author$project$Main$newProblemCmd = function (input) {
	return A2(
		$elm$random$Random$generate,
		$author$project$Main$NewProblem(input),
		$author$project$Main$generateRandomInput);
};
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		$author$project$Main$Loading,
		$author$project$Main$newProblemCmd(
			{aC: 0, aJ: false}));
};
var $author$project$Main$KeyDown = function (a) {
	return {$: 3, a: a};
};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {ai: pids, ar: subs};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {Z: event, y: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.ai,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.y;
		var event = _v0.Z;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.ar);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$browser$Browser$Events$onKeyDown(
		A2($elm$json$Json$Decode$map, $author$project$Main$KeyDown, $elm$html$Html$Events$keyCode));
};
var $author$project$Main$ProblemLetter = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$Ready = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$SetEndTime = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$SetStartTime = function (a) {
	return {$: 6, a: a};
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Interface$setGuess = F2(
	function (guess_, d) {
		return _Utils_update(
			d,
			{aI: guess_});
	});
var $author$project$Interface$clearGuess = $author$project$Interface$setGuess($elm$core$Maybe$Nothing);
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$Interface$Aristocrat = 2;
var $author$project$Interface$AristocratK1 = 3;
var $author$project$Interface$Affine = 1;
var $author$project$Interface$Atbash = 4;
var $author$project$Interface$Baconian = 5;
var $author$project$Interface$Caesar = 6;
var $author$project$Interface$Nihilist = 7;
var $author$project$Interface$Porta = 8;
var $author$project$Interface$allCiphers = $elm$core$Array$fromList(
	_List_fromArray(
		[1, 2, 3, 4, 5, 6, 7, 8]));
var $author$project$Key$Key = $elm$core$Basics$identity;
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Key$isValidSubstitution = function (_v0) {
	var p = _v0.a;
	var c = _v0.b;
	return !_Utils_eq(p, c);
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Key$tryCreateAt = F2(
	function (idx, ps) {
		var cs = _Utils_ap(
			A2($elm$core$List$range, idx, 25),
			A2($elm$core$List$range, 0, idx - 1));
		var mappings = A3($elm$core$List$map2, $elm$core$Tuple$pair, ps, cs);
		return A2($elm$core$List$all, $author$project$Key$isValidSubstitution, mappings) ? $elm$core$Maybe$Just(
			$elm$core$Dict$fromList(mappings)) : $elm$core$Maybe$Nothing;
	});
var $author$project$Key$allMappings = function (cs) {
	return A2(
		$elm$core$List$filterMap,
		function (idx) {
			return A2($author$project$Key$tryCreateAt, idx, cs);
		},
		A2($elm$core$List$range, 0, 25));
};
var $author$project$ListEx$itemAt = F2(
	function (idx, items) {
		itemAt:
		while (true) {
			if (!items.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = items.a;
				var xs = items.b;
				if (!idx) {
					return $elm$core$Maybe$Just(x);
				} else {
					var $temp$idx = idx - 1,
						$temp$items = xs;
					idx = $temp$idx;
					items = $temp$items;
					continue itemAt;
				}
			}
		}
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$Extra$randomInt = F3(
	function (rand, lo, hi) {
		return lo + $elm$core$Basics$round(rand * (hi - lo));
	});
var $author$project$Extra$randomIdx = F2(
	function (rand, length) {
		return A3($author$project$Extra$randomInt, rand, 0, length - 1);
	});
var $author$project$Key$createHelper = F2(
	function (randomInput, shuffled) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Dict$empty,
			function (ms) {
				return A2(
					$author$project$ListEx$itemAt,
					A2(
						$author$project$Extra$randomIdx,
						randomInput.B,
						$elm$core$List$length(ms)),
					ms);
			}(
				$author$project$Key$allMappings(shuffled)));
	});
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $author$project$ListEx$dedupeHelper = F3(
	function (input, seen, output) {
		dedupeHelper:
		while (true) {
			if (!input.b) {
				return output;
			} else {
				var x = input.a;
				var xs = input.b;
				if (A2($elm$core$Set$member, x, seen)) {
					var $temp$input = xs,
						$temp$seen = seen,
						$temp$output = output;
					input = $temp$input;
					seen = $temp$seen;
					output = $temp$output;
					continue dedupeHelper;
				} else {
					var $temp$input = xs,
						$temp$seen = A2($elm$core$Set$insert, x, seen),
						$temp$output = _Utils_ap(
						output,
						_List_fromArray(
							[x]));
					input = $temp$input;
					seen = $temp$seen;
					output = $temp$output;
					continue dedupeHelper;
				}
			}
		}
	});
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $author$project$ListEx$dedupe = function (items) {
	return A3($author$project$ListEx$dedupeHelper, items, $elm$core$Set$empty, _List_Nil);
};
var $author$project$Data$keywords = $elm$core$Array$fromList(
	_List_fromArray(
		['Add', 'Auth', 'Bits', 'Byte', 'Book', 'Box', 'Break', 'Brute', 'Bugs', 'Caesar', 'Cast', 'Chain', 'Char', 'Code', 'Con', 'Cover', 'Crack', 'Cross', 'Cube', 'Cycle', 'Data', 'Deck', 'Decode', 'Deep', 'DES', 'Digit', 'Disk', 'Div', 'Door', 'ECB', 'Encode', 'Enigma', 'Entry', 'Fax', 'Field', 'Figure', 'File', 'Gate', 'Hash', 'Hide', 'Hill', 'Hop', 'IV', 'Jazz', 'Jitter', 'Key', 'Keys', 'Layer', 'Len', 'Line', 'Link', 'Log', 'Logic', 'Loop', 'MAC', 'Map', 'Mark', 'Math', 'Meet', 'Melon', 'Mode', 'Mod', 'Mono', 'Msg', 'Nil', 'Nix', 'Noise', 'Nonce', 'Null', 'Pad', 'Pass', 'Pipe', 'Plan', 'Poly', 'Porta', 'Prep', 'Pub', 'RSA', 'Run', 'Rune', 'Salt', 'Scram', 'Seal', 'Sec', 'Secret', 'Send', 'Shift', 'Sign', 'Spy', 'Sub', 'Suite', 'Sync', 'Sym', 'Text', 'Trap', 'Vail', 'XOR', 'Zero', 'AES', 'Arc', 'Args', 'Atom', 'Band', 'Base', 'Batch', 'Bind', 'Blob', 'Block', 'Cipher', 'Close', 'Cloud', 'Combo', 'Comp', 'Core', 'Crc', 'Curve', 'Diffie', 'Digest', 'Diff', 'ECC', 'End', 'Engage', 'Equal', 'Evt', 'Flow', 'Func', 'Gamma', 'Gen', 'Hand', 'Head', 'Hex', 'Info', 'Input', 'Inte', 'Ip', 'Item', 'Join', 'Jump', 'Kb', 'Lck', 'Lead', 'Left', 'List', 'Lock', 'Mask', 'Max', 'Min', 'Mix', 'Msgid', 'Net', 'New', 'Next', 'Node', 'Open', 'Output', 'Pair', 'Param', 'Part', 'Path', 'Perm', 'Pin', 'Post', 'Priv', 'Proc', 'Prot', 'Prng', 'Psk', 'Pto', 'Rand', 'Recv', 'Reg', 'Rem', 'Rnd', 'Root', 'Seed', 'Select', 'Semi', 'Sha', 'Skip', 'Slice', 'Slot', 'Src', 'Start', 'Step', 'Stop', 'Tag', 'Tls', 'Token', 'Topo', 'Tup', 'Type', 'Udp', 'Unic', 'Url', 'Val', 'Var', 'Vector', 'Verify', 'View', 'Void', 'Wan', 'Word']));
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $author$project$Data$randomKeyword = function (r) {
	var k = A2(
		$elm$core$Maybe$withDefault,
		'key',
		function (i) {
			return A2($elm$core$Array$get, i, $author$project$Data$keywords);
		}(
			A2(
				$author$project$Extra$randomIdx,
				r,
				$elm$core$Array$length($author$project$Data$keywords))));
	return k;
};
var $author$project$Alpha$lowerACode = $elm$core$Char$toCode('a');
var $author$project$Alpha$lowerZCode = $elm$core$Char$toCode('z');
var $elm$core$Char$toLower = _Char_toLower;
var $author$project$Alpha$toValHelper = function (c) {
	var code = $elm$core$Char$toCode(
		$elm$core$Char$toLower(c));
	return ((_Utils_cmp(code, $author$project$Alpha$lowerACode) > -1) && (_Utils_cmp(code, $author$project$Alpha$lowerZCode) < 1)) ? $elm$core$Maybe$Just(code - $author$project$Alpha$lowerACode) : $elm$core$Maybe$Nothing;
};
var $author$project$Alpha$toVal = function (_v0) {
	var c = _v0;
	return A2(
		$elm$core$Maybe$withDefault,
		-1,
		$author$project$Alpha$toValHelper(c));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Token$isPunctuation = function (c) {
	return (c === '.') || ((c === '!') || ((c === '?') || ((c === ',') || ((c === ':') || ((c === ';') || ((c === '-') || (c === '\'')))))));
};
var $author$project$Token$isAllowChar = function (c) {
	return $elm$core$Char$isAlpha(c) || ($author$project$Token$isPunctuation(c) || (c === ' '));
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $elm$core$Char$toUpper = _Char_toUpper;
var $author$project$Token$Interactive = function (a) {
	return {$: 0, a: a};
};
var $author$project$Token$Punctuation = function (a) {
	return {$: 1, a: a};
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Alpha$Alpha = $elm$core$Basics$identity;
var $author$project$Alpha$parse = function (c) {
	return $elm$core$Char$isAlpha(c) ? $elm$core$Maybe$Just(
		$elm$core$Char$toLower(c)) : $elm$core$Maybe$Nothing;
};
var $author$project$Token$tokenizeHelper = F4(
	function (input, currentIdx, currentWord, output) {
		tokenizeHelper:
		while (true) {
			if (!input.b) {
				return $elm$core$List$isEmpty(currentWord) ? output : _Utils_ap(
					output,
					_List_fromArray(
						[currentWord]));
			} else {
				if (' ' === input.a) {
					var xs = input.b;
					if (!$elm$core$List$isEmpty(currentWord)) {
						var $temp$input = xs,
							$temp$currentIdx = currentIdx,
							$temp$currentWord = _List_Nil,
							$temp$output = _Utils_ap(
							output,
							_List_fromArray(
								[currentWord]));
						input = $temp$input;
						currentIdx = $temp$currentIdx;
						currentWord = $temp$currentWord;
						output = $temp$output;
						continue tokenizeHelper;
					} else {
						var $temp$input = xs,
							$temp$currentIdx = currentIdx,
							$temp$currentWord = _List_Nil,
							$temp$output = output;
						input = $temp$input;
						currentIdx = $temp$currentIdx;
						currentWord = $temp$currentWord;
						output = $temp$output;
						continue tokenizeHelper;
					}
				} else {
					var x = input.a;
					var xs = input.b;
					if ($author$project$Token$isPunctuation(x)) {
						var $temp$input = xs,
							$temp$currentIdx = currentIdx,
							$temp$currentWord = _Utils_ap(
							currentWord,
							_List_fromArray(
								[
									$author$project$Token$Punctuation(
									{
										O: $elm$core$String$fromChar(x)
									})
								])),
							$temp$output = output;
						input = $temp$input;
						currentIdx = $temp$currentIdx;
						currentWord = $temp$currentWord;
						output = $temp$output;
						continue tokenizeHelper;
					} else {
						var _v1 = $author$project$Alpha$parse(x);
						if (_v1.$ === 1) {
							var $temp$input = xs,
								$temp$currentIdx = currentIdx,
								$temp$currentWord = currentWord,
								$temp$output = output;
							input = $temp$input;
							currentIdx = $temp$currentIdx;
							currentWord = $temp$currentWord;
							output = $temp$output;
							continue tokenizeHelper;
						} else {
							var c = _v1.a;
							var $temp$input = xs,
								$temp$currentIdx = currentIdx + 1,
								$temp$currentWord = _Utils_ap(
								currentWord,
								_List_fromArray(
									[
										$author$project$Token$Interactive(
										{O: c, ad: currentIdx})
									])),
								$temp$output = output;
							input = $temp$input;
							currentIdx = $temp$currentIdx;
							currentWord = $temp$currentWord;
							output = $temp$output;
							continue tokenizeHelper;
						}
					}
				}
			}
		}
	});
var $author$project$Token$tokenize = function (str) {
	return function (input) {
		return A4($author$project$Token$tokenizeHelper, input, 0, _List_Nil, _List_Nil);
	}(
		A2(
			$elm$core$List$map,
			$elm$core$Char$toUpper,
			A2(
				$elm$core$List$filter,
				$author$project$Token$isAllowChar,
				$elm$core$String$toList(str))));
};
var $author$project$Token$tokenizeWord = function (str) {
	return A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		$elm$core$List$head(
			$author$project$Token$tokenize(str)));
};
var $author$project$Token$tryGetTokenData = function (t) {
	if (!t.$) {
		var d = t.a;
		return $elm$core$Maybe$Just(d);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Key$createK1 = function (randomInput) {
	return A2(
		$author$project$Key$createHelper,
		randomInput,
		$author$project$ListEx$dedupe(
			function (xs) {
				return _Utils_ap(
					xs,
					A2($elm$core$List$range, 0, 25));
			}(
				A2(
					$elm$core$List$map,
					function (t) {
						return $author$project$Alpha$toVal(t.O);
					},
					A2(
						$elm$core$List$filterMap,
						$author$project$Token$tryGetTokenData,
						$author$project$Token$tokenizeWord(
							$author$project$Data$randomKeyword(randomInput.B)))))));
};
var $author$project$Interface$Interactive = function (a) {
	return {$: 0, a: a};
};
var $author$project$Interface$Punctuation = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Char$fromCode = _Char_fromCode;
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Alpha$fromVal = function (idx) {
	return $elm$core$Char$fromCode(
		A2($elm$core$Basics$modBy, 26, idx) + $author$project$Alpha$lowerACode);
};
var $author$project$Key$encode = F2(
	function (plainText, _v0) {
		var d = _v0;
		return $author$project$Alpha$fromVal(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				function (val) {
					return A2($elm$core$Dict$get, val, d);
				}(
					$author$project$Alpha$toVal(plainText))));
	});
var $author$project$Alpha$toStr = function (_v0) {
	var c = _v0;
	return $elm$core$String$fromChar(c);
};
var $author$project$Aristocrat$encrypt = F2(
	function (params, _char) {
		return $author$project$Alpha$toStr(
			A2($author$project$Key$encode, _char, params.y));
	});
var $author$project$Aristocrat$encryptLetter = F2(
	function (params, t) {
		if (!t.$) {
			var d = t.a;
			return $author$project$Interface$Interactive(
				{
					aB: A2($author$project$Aristocrat$encrypt, params, d.O),
					aH: $author$project$Alpha$toStr(d.O),
					aI: $elm$core$Maybe$Nothing,
					ad: d.ad,
					aU: $author$project$Alpha$toStr(d.O)
				});
		} else {
			var d = t.a;
			return $author$project$Interface$Punctuation(d);
		}
	});
var $author$project$DictEx$getOrZero = F2(
	function (targetKey, dict) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Dict$get, targetKey, dict));
	});
var $author$project$DictEx$increment = F2(
	function (targetKey, dict) {
		return function (val) {
			return A3($elm$core$Dict$insert, targetKey, val + 1, dict);
		}(
			A2($author$project$DictEx$getOrZero, targetKey, dict));
	});
var $author$project$Interface$tryGetLetterData = function (l) {
	if (!l.$) {
		var d = l.a;
		return $elm$core$Maybe$Just(d);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$WordEx$frequencies = function (ws) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (l, freq) {
				return {
					aB: A2($author$project$DictEx$increment, l.aB, freq.aB),
					aU: A2($author$project$DictEx$increment, l.aU, freq.aU)
				};
			}),
		{aB: $elm$core$Dict$empty, aU: $elm$core$Dict$empty},
		A2(
			$elm$core$List$filterMap,
			$author$project$Interface$tryGetLetterData,
			A2(
				$elm$core$List$concatMap,
				function (w) {
					return w.aP;
				},
				ws)));
};
var $author$project$Alpha$fromValToStr = function (val) {
	return $author$project$Alpha$toStr(
		$author$project$Alpha$fromVal(val));
};
var $author$project$Key$list = function (_v0) {
	var d = _v0;
	var reverseMap = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (_v1) {
				var k = _v1.a;
				var v = _v1.b;
				return _Utils_Tuple2(v, k);
			},
			$elm$core$Dict$toList(d)));
	return A2(
		$elm$core$List$map,
		function (idx) {
			var plainVal = A2($author$project$DictEx$getOrZero, idx, reverseMap);
			var cipherVal = idx;
			return $author$project$Interface$Interactive(
				{
					aB: $author$project$Alpha$fromValToStr(cipherVal),
					aH: $author$project$Alpha$fromValToStr(plainVal),
					aI: $elm$core$Maybe$Nothing,
					ad: idx,
					aU: $author$project$Alpha$fromValToStr(plainVal)
				});
		},
		A2($elm$core$List$range, 0, 25));
};
var $author$project$Aristocrat$createK1Problem = F2(
	function (randomInput, words) {
		var params = {
			y: $author$project$Key$createK1(randomInput)
		};
		var words_ = A2(
			$elm$core$List$map,
			function (w) {
				return {
					aP: A2(
						$elm$core$List$map,
						$author$project$Aristocrat$encryptLetter(params),
						w)
				};
			},
			words);
		return {
			aC: 3,
			aO: 'Aristocrat (K1)',
			aY: $elm$core$Maybe$Just(
				{
					aa: $author$project$WordEx$frequencies(words_),
					ae: $author$project$Key$list(params.y)
				}),
			a0: words_
		};
	});
var $author$project$Affine$encrypt = F2(
	function (params, _char) {
		return $author$project$Alpha$toStr(
			$author$project$Alpha$fromVal(
				(params.B * $author$project$Alpha$toVal(_char)) + params.D));
	});
var $author$project$Affine$encryptLetter = F2(
	function (params, t) {
		if (!t.$) {
			var d = t.a;
			return $author$project$Interface$Interactive(
				{
					aB: A2($author$project$Affine$encrypt, params, d.O),
					aH: $author$project$Alpha$toStr(d.O),
					aI: $elm$core$Maybe$Nothing,
					ad: d.ad,
					aU: $author$project$Alpha$toStr(d.O)
				});
		} else {
			var d = t.a;
			return $author$project$Interface$Punctuation(d);
		}
	});
var $author$project$Affine$maxValueOfB = 25;
var $author$project$Affine$valuesOfA = $elm$core$Array$fromList(
	_List_fromArray(
		[1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]));
var $author$project$Affine$createProblem = F2(
	function (randomInput, words) {
		var params = {
			B: A2(
				$elm$core$Maybe$withDefault,
				1,
				function (idx) {
					return A2($elm$core$Array$get, idx, $author$project$Affine$valuesOfA);
				}(
					A2(
						$author$project$Extra$randomIdx,
						randomInput.B,
						$elm$core$Array$length($author$project$Affine$valuesOfA)))),
			D: A3($author$project$Extra$randomInt, randomInput.D, 1, $author$project$Affine$maxValueOfB)
		};
		return {
			aC: 1,
			aO: 'Affine (A = ' + ($elm$core$String$fromInt(params.B) + (', B = ' + ($elm$core$String$fromInt(params.D) + ')'))),
			aY: $elm$core$Maybe$Nothing,
			a0: A2(
				$elm$core$List$map,
				function (w) {
					return {
						aP: A2(
							$elm$core$List$map,
							$author$project$Affine$encryptLetter(params),
							w)
					};
				},
				words)
		};
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$ListEx$partitionAtHelper = F3(
	function (idx, items, before) {
		partitionAtHelper:
		while (true) {
			if (!items.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = items.a;
				var xs = items.b;
				if (!idx) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple3(
							$elm$core$List$reverse(before),
							x,
							xs));
				} else {
					var $temp$idx = idx - 1,
						$temp$items = xs,
						$temp$before = A2($elm$core$List$cons, x, before);
					idx = $temp$idx;
					items = $temp$items;
					before = $temp$before;
					continue partitionAtHelper;
				}
			}
		}
	});
var $author$project$ListEx$partitionAt = F2(
	function (idx, items) {
		return (idx >= 0) ? A3($author$project$ListEx$partitionAtHelper, idx, items, _List_Nil) : $elm$core$Maybe$Nothing;
	});
var $author$project$ListEx$shuffleHelper = F3(
	function (randoms, items, output) {
		if ($elm$core$List$isEmpty(items)) {
			return $elm$core$Maybe$Just(output);
		} else {
			if (!randoms.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var r = randoms.a;
				var rs = randoms.b;
				return A2(
					$elm$core$Maybe$andThen,
					function (_v1) {
						var before = _v1.a;
						var x = _v1.b;
						var after = _v1.c;
						return A3(
							$author$project$ListEx$shuffleHelper,
							rs,
							_Utils_ap(before, after),
							_Utils_ap(
								output,
								_List_fromArray(
									[x])));
					},
					function (idx) {
						return A2($author$project$ListEx$partitionAt, idx, items);
					}(
						A2(
							$author$project$Extra$randomIdx,
							r,
							$elm$core$List$length(items))));
			}
		}
	});
var $author$project$ListEx$shuffle = F2(
	function (randoms, items) {
		return A3($author$project$ListEx$shuffleHelper, randoms, items, _List_Nil);
	});
var $author$project$Key$create = function (randomInput) {
	return A2(
		$author$project$Key$createHelper,
		randomInput,
		A2(
			$elm$core$Maybe$withDefault,
			A2($elm$core$List$range, 0, 25),
			A2(
				$author$project$ListEx$shuffle,
				randomInput.aL,
				A2($elm$core$List$range, 0, 25))));
};
var $author$project$Aristocrat$createProblem = F2(
	function (randomInput, words) {
		var params = {
			y: $author$project$Key$create(randomInput)
		};
		var words_ = A2(
			$elm$core$List$map,
			function (w) {
				return {
					aP: A2(
						$elm$core$List$map,
						$author$project$Aristocrat$encryptLetter(params),
						w)
				};
			},
			words);
		return {
			aC: 2,
			aO: 'Aristocrat',
			aY: $elm$core$Maybe$Just(
				{
					aa: $author$project$WordEx$frequencies(words_),
					ae: $author$project$Key$list(params.y)
				}),
			a0: words_
		};
	});
var $author$project$Atbash$encrypt = function (_char) {
	return $author$project$Alpha$toStr(
		$author$project$Alpha$fromVal(
			25 - $author$project$Alpha$toVal(_char)));
};
var $author$project$Atbash$encryptLetter = function (t) {
	if (!t.$) {
		var d = t.a;
		return $author$project$Interface$Interactive(
			{
				aB: $author$project$Atbash$encrypt(d.O),
				aH: $author$project$Alpha$toStr(d.O),
				aI: $elm$core$Maybe$Nothing,
				ad: d.ad,
				aU: $author$project$Alpha$toStr(d.O)
			});
	} else {
		var d = t.a;
		return $author$project$Interface$Punctuation(d);
	}
};
var $author$project$Atbash$createProblem = F2(
	function (_v0, words) {
		return {
			aC: 4,
			aO: 'Atbash',
			aY: $elm$core$Maybe$Nothing,
			a0: A2(
				$elm$core$List$map,
				function (w) {
					return {
						aP: A2($elm$core$List$map, $author$project$Atbash$encryptLetter, w)
					};
				},
				words)
		};
	});
var $elm$core$String$fromList = _String_fromList;
var $elm$core$String$reverse = _String_reverse;
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Common$letterACode = $elm$core$Char$toCode('a');
var $author$project$Common$letterZCode = $elm$core$Char$toCode('z');
var $author$project$Common$toLetterIndex = function (letter) {
	var code = $elm$core$Char$toCode(
		$elm$core$Char$toLower(letter));
	return ((_Utils_cmp(code, $author$project$Common$letterACode) > -1) && (_Utils_cmp(code, $author$project$Common$letterZCode) < 1)) ? $elm$core$Maybe$Just(code - $author$project$Common$letterACode) : $elm$core$Maybe$Nothing;
};
var $author$project$Common$toLetterIndexUnsafe = function (letter) {
	return A2(
		$elm$core$Maybe$withDefault,
		-1,
		$author$project$Common$toLetterIndex(letter));
};
var $author$project$Baconian$toBaconianBinary = function (n) {
	var n_ = (_Utils_cmp(
		n,
		$author$project$Common$toLetterIndexUnsafe('v')) > -1) ? (n - 2) : ((_Utils_cmp(
		n,
		$author$project$Common$toLetterIndexUnsafe('j')) > -1) ? (n - 1) : n);
	return $elm$core$String$reverse(
		$elm$core$String$fromList(
			A3(
				$elm$core$List$foldl,
				F2(
					function (pv, _v0) {
						var cur = _v0.a;
						var bs = _v0.b;
						return (_Utils_cmp(cur, pv) > -1) ? _Utils_Tuple2(
							cur - pv,
							A2($elm$core$List$cons, 'B', bs)) : _Utils_Tuple2(
							cur,
							A2($elm$core$List$cons, 'A', bs));
					}),
				_Utils_Tuple2(n_, _List_Nil),
				_List_fromArray(
					[16, 8, 4, 2, 1])).b));
};
var $author$project$Baconian$encrypt = function (_char) {
	return $author$project$Baconian$toBaconianBinary(
		$author$project$Alpha$toVal(_char));
};
var $author$project$Baconian$encryptLetter = function (t) {
	if (!t.$) {
		var d = t.a;
		return $author$project$Interface$Interactive(
			{
				aB: $author$project$Baconian$encrypt(d.O),
				aH: $author$project$Alpha$toStr(d.O),
				aI: $elm$core$Maybe$Nothing,
				ad: d.ad,
				aU: $author$project$Alpha$toStr(d.O)
			});
	} else {
		var d = t.a;
		return $author$project$Interface$Punctuation(d);
	}
};
var $author$project$Baconian$createProblem = F2(
	function (_v0, words) {
		return {
			aC: 5,
			aO: 'Baconian',
			aY: $elm$core$Maybe$Nothing,
			a0: A2(
				$elm$core$List$map,
				function (w) {
					return {
						aP: A2($elm$core$List$map, $author$project$Baconian$encryptLetter, w)
					};
				},
				words)
		};
	});
var $author$project$Caesar$encrypt = F2(
	function (offset, _char) {
		return $author$project$Alpha$toStr(
			$author$project$Alpha$fromVal(
				offset + $author$project$Alpha$toVal(_char)));
	});
var $author$project$Caesar$encryptLetter = F2(
	function (offset, t) {
		if (!t.$) {
			var d = t.a;
			return $author$project$Interface$Interactive(
				{
					aB: A2($author$project$Caesar$encrypt, offset, d.O),
					aH: $author$project$Alpha$toStr(d.O),
					aI: $elm$core$Maybe$Nothing,
					ad: d.ad,
					aU: $author$project$Alpha$toStr(d.O)
				});
		} else {
			var d = t.a;
			return $author$project$Interface$Punctuation(d);
		}
	});
var $author$project$Caesar$maxOffset = 25;
var $author$project$Caesar$minOffset = 1;
var $author$project$Caesar$createProblem = F2(
	function (randomInput, words) {
		var offset = A3($author$project$Extra$randomInt, randomInput.B, $author$project$Caesar$minOffset, $author$project$Caesar$maxOffset);
		return {
			aC: 6,
			aO: 'Caesar',
			aY: $elm$core$Maybe$Nothing,
			a0: A2(
				$elm$core$List$map,
				function (w) {
					return {
						aP: A2(
							$elm$core$List$map,
							$author$project$Caesar$encryptLetter(offset),
							w)
					};
				},
				words)
		};
	});
var $author$project$Polybius$Polybius = $elm$core$Basics$identity;
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$Extra$combine = A2(
	$elm$core$List$foldr,
	$elm$core$Maybe$map2($elm$core$List$cons),
	$elm$core$Maybe$Just(_List_Nil));
var $author$project$Extra$dedupeHelper = F3(
	function (source, seen, output) {
		dedupeHelper:
		while (true) {
			var _v0 = $elm$core$String$uncons(source);
			if (_v0.$ === 1) {
				return output;
			} else {
				var _v1 = _v0.a;
				var x = _v1.a;
				var xs = _v1.b;
				if (A2($elm$core$Set$member, x, seen)) {
					var $temp$source = xs,
						$temp$seen = seen,
						$temp$output = output;
					source = $temp$source;
					seen = $temp$seen;
					output = $temp$output;
					continue dedupeHelper;
				} else {
					var $temp$source = xs,
						$temp$seen = A2($elm$core$Set$insert, x, seen),
						$temp$output = _Utils_ap(
						output,
						$elm$core$String$fromChar(x));
					source = $temp$source;
					seen = $temp$seen;
					output = $temp$output;
					continue dedupeHelper;
				}
			}
		}
	});
var $author$project$Extra$dedupe = function (source) {
	return A3($author$project$Extra$dedupeHelper, source, $elm$core$Set$empty, '');
};
var $author$project$Polybius$defaultPolybius = function (cs) {
	return _Utils_Tuple2('ABC', cs);
}(
	A2(
		$elm$core$List$map,
		$author$project$Alpha$fromVal,
		A2($elm$core$List$range, 0, 25)));
var $elm$core$String$filter = _String_filter;
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $author$project$Extra$filterOut = function (input) {
	var exclude_ = $elm$core$Set$fromList(
		$elm$core$String$toList(input.aF));
	return A2(
		$elm$core$String$filter,
		function (c) {
			return !A2($elm$core$Set$member, c, exclude_);
		},
		input.aW);
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$core$String$toLower = _String_toLower;
var $author$project$Polybius$create = function (keyword) {
	var keyword_ = $author$project$Extra$dedupe(
		A3(
			$elm$core$String$replace,
			'j',
			'i',
			$elm$core$String$toLower(
				A2($elm$core$String$filter, $elm$core$Char$isAlpha, keyword))));
	var alphabet = $author$project$Extra$filterOut(
		{aF: keyword_, aW: 'abcdefghiklmnopqrstuvwxyz'});
	return A2(
		$elm$core$Maybe$withDefault,
		$author$project$Polybius$defaultPolybius,
		A2(
			$elm$core$Maybe$map,
			function (cs) {
				return _Utils_Tuple2(keyword, cs);
			},
			$author$project$Extra$combine(
				A2(
					$elm$core$List$map,
					$author$project$Alpha$parse,
					$elm$core$String$toList(
						_Utils_ap(keyword_, alphabet))))));
};
var $author$project$Keyword$Keyword = $elm$core$Basics$identity;
var $author$project$Keyword$create = function (str) {
	return $elm$core$String$isEmpty(str) ? $elm$core$Maybe$Nothing : A2(
		$elm$core$Maybe$map,
		function (cs) {
			return _Utils_Tuple2(str, cs);
		},
		A2(
			$elm$core$Maybe$map,
			$elm$core$Array$fromList,
			$author$project$Extra$combine(
				A2(
					$elm$core$List$map,
					$author$project$Alpha$parse,
					$elm$core$String$toList(str)))));
};
var $author$project$Keyword$defaultKeyword = function (cs) {
	return _Utils_Tuple2('HI', cs);
}(
	$elm$core$Array$fromList(
		_List_fromArray(
			[
				$author$project$Alpha$fromVal(7),
				$author$project$Alpha$fromVal(8)
			])));
var $author$project$Keyword$createOrDefault = function (str) {
	return A2(
		$elm$core$Maybe$withDefault,
		$author$project$Keyword$defaultKeyword,
		$author$project$Keyword$create(str));
};
var $author$project$Keyword$dummyAlpha = $author$project$Alpha$fromVal(0);
var $author$project$Keyword$getAt = F2(
	function (_v0, idx) {
		var _v1 = _v0;
		var cs = _v1.b;
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$Keyword$dummyAlpha,
			function (i) {
				return A2($elm$core$Array$get, i, cs);
			}(
				A2(
					$elm$core$Basics$modBy,
					$elm$core$Array$length(cs),
					idx)));
	});
var $author$project$Alpha$compare = F2(
	function (_v0, _v1) {
		var x = _v0;
		var y = _v1;
		return A2($elm$core$Basics$compare, x, y);
	});
var $author$project$Alpha$eq = F2(
	function (x, y) {
		return 1 === A2($author$project$Alpha$compare, x, y);
	});
var $author$project$Polybius$iChar = $author$project$Alpha$fromVal(8);
var $author$project$ListEx$indexOfHelper = F3(
	function (fn, items, currentIdx) {
		indexOfHelper:
		while (true) {
			if (!items.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = items.a;
				var xs = items.b;
				if (fn(x)) {
					return $elm$core$Maybe$Just(currentIdx);
				} else {
					var $temp$fn = fn,
						$temp$items = xs,
						$temp$currentIdx = currentIdx + 1;
					fn = $temp$fn;
					items = $temp$items;
					currentIdx = $temp$currentIdx;
					continue indexOfHelper;
				}
			}
		}
	});
var $author$project$ListEx$indexOf = F2(
	function (fn, items) {
		return A3($author$project$ListEx$indexOfHelper, fn, items, 0);
	});
var $author$project$Polybius$jChar = $author$project$Alpha$fromVal(9);
var $author$project$Polybius$toVal = F2(
	function (_v0, _char) {
		var _v1 = _v0;
		var cs = _v1.b;
		var char_ = A2($author$project$Alpha$eq, _char, $author$project$Polybius$jChar) ? $author$project$Polybius$iChar : _char;
		var _v2 = A2(
			$author$project$ListEx$indexOf,
			$author$project$Alpha$eq(char_),
			cs);
		if (_v2.$ === 1) {
			return 1000;
		} else {
			var idx = _v2.a;
			var tens = 10 * (((idx / 5) | 0) + 1);
			var ones = 1 + A2($elm$core$Basics$modBy, 5, idx);
			return tens + ones;
		}
	});
var $author$project$Polybius$encode = F3(
	function (p, k, t) {
		var tVal = A2($author$project$Polybius$toVal, p, t.O);
		var kVal = A2(
			$author$project$Polybius$toVal,
			p,
			A2($author$project$Keyword$getAt, k, t.ad));
		return kVal + tVal;
	});
var $author$project$Nihilist$encrypt = F2(
	function (params, t) {
		return $elm$core$String$fromInt(
			A3($author$project$Polybius$encode, params.M, params.E, t));
	});
var $author$project$Nihilist$encryptLetter = F2(
	function (params, t) {
		if (!t.$) {
			var d = t.a;
			return $author$project$Interface$Interactive(
				{
					aB: A2($author$project$Nihilist$encrypt, params, d),
					aH: $author$project$Alpha$toStr(
						A2($author$project$Keyword$getAt, params.E, d.ad)) + ('--' + $author$project$Alpha$toStr(d.O)),
					aI: $elm$core$Maybe$Nothing,
					ad: d.ad,
					aU: $author$project$Alpha$toStr(d.O)
				});
		} else {
			var d = t.a;
			return $author$project$Interface$Punctuation(d);
		}
	});
var $elm$core$String$toUpper = _String_toUpper;
var $author$project$Polybius$toKeywordStr = function (_v0) {
	var _v1 = _v0;
	var kw = _v1.a;
	return $elm$core$String$toUpper(kw);
};
var $author$project$Keyword$toStr = function (_v0) {
	var _v1 = _v0;
	var str = _v1.a;
	return $elm$core$String$toUpper(str);
};
var $author$project$Nihilist$createProblem = F2(
	function (randomInput, words) {
		var params = {
			E: $author$project$Keyword$createOrDefault(
				$author$project$Data$randomKeyword(randomInput.B)),
			M: $author$project$Polybius$create(
				$author$project$Data$randomKeyword(randomInput.D))
		};
		return {
			aC: 7,
			aO: 'Nihilist (polybius key = ' + ($author$project$Polybius$toKeywordStr(params.M) + (', keyword = ' + ($author$project$Keyword$toStr(params.E) + ')'))),
			aY: $elm$core$Maybe$Nothing,
			a0: A2(
				$elm$core$List$map,
				function (w) {
					return {
						aP: A2(
							$elm$core$List$map,
							$author$project$Nihilist$encryptLetter(params),
							w)
					};
				},
				words)
		};
	});
var $author$project$Alpha$m = $author$project$Alpha$fromVal(12);
var $author$project$Porta$encrypt = F2(
	function (params, t) {
		var offset = function (k) {
			return ((k / 2) | 0) + 13;
		}(
			$author$project$Alpha$toVal(
				A2($author$project$Keyword$getAt, params.E, t.ad)));
		var cVal = $author$project$Alpha$toVal(t.O);
		var val = (_Utils_cmp(
			cVal,
			$author$project$Alpha$toVal($author$project$Alpha$m)) < 1) ? (cVal + offset) : (cVal - offset);
		var val_ = ((val >= 0) && (val <= 25)) ? val : ((val < 0) ? (val + 13) : (val - 13));
		return $author$project$Alpha$toStr(
			$author$project$Alpha$fromVal(val_));
	});
var $author$project$Porta$encryptLetter = F2(
	function (params, t) {
		if (!t.$) {
			var d = t.a;
			return $author$project$Interface$Interactive(
				{
					aB: A2($author$project$Porta$encrypt, params, d),
					aH: $author$project$Alpha$toStr(
						A2($author$project$Keyword$getAt, params.E, d.ad)) + ('--' + $author$project$Alpha$toStr(d.O)),
					aI: $elm$core$Maybe$Nothing,
					ad: d.ad,
					aU: $author$project$Alpha$toStr(d.O)
				});
		} else {
			var d = t.a;
			return $author$project$Interface$Punctuation(d);
		}
	});
var $author$project$Porta$createProblem = F2(
	function (randomInput, words) {
		var params = {
			E: $author$project$Keyword$createOrDefault(
				$author$project$Data$randomKeyword(randomInput.B))
		};
		return {
			aC: 8,
			aO: 'Porta (keyword = ' + ($author$project$Keyword$toStr(params.E) + ')'),
			aY: $elm$core$Maybe$Nothing,
			a0: A2(
				$elm$core$List$map,
				function (w) {
					return {
						aP: A2(
							$elm$core$List$map,
							$author$project$Porta$encryptLetter(params),
							w)
					};
				},
				words)
		};
	});
var $author$project$Maker$getCreateProblemFn = F2(
	function (cipher, randomInput) {
		switch (cipher) {
			case 0:
				return $author$project$Maker$randomCreateProblemFn(randomInput);
			case 1:
				return $author$project$Affine$createProblem;
			case 2:
				return $author$project$Aristocrat$createProblem;
			case 3:
				return $author$project$Aristocrat$createK1Problem;
			case 4:
				return $author$project$Atbash$createProblem;
			case 5:
				return $author$project$Baconian$createProblem;
			case 6:
				return $author$project$Caesar$createProblem;
			case 7:
				return $author$project$Nihilist$createProblem;
			default:
				return $author$project$Porta$createProblem;
		}
	});
var $author$project$Maker$randomCreateProblemFn = function (randomInput) {
	return A2(
		$elm$core$Maybe$withDefault,
		A2($author$project$Maker$getCreateProblemFn, 1, randomInput),
		A2(
			$elm$core$Maybe$map,
			function (cipher) {
				return A2($author$project$Maker$getCreateProblemFn, cipher, randomInput);
			},
			function (idx) {
				return A2($elm$core$Array$get, idx, $author$project$Interface$allCiphers);
			}(
				A2(
					$author$project$Extra$randomIdx,
					randomInput.B,
					$elm$core$Array$length($author$project$Interface$allCiphers)))));
};
var $author$project$Data$longQuotes = $elm$core$Array$fromList(
	_List_fromArray(
		['i discovered life sometimes has a way of giving you what you need but not in the form you expect.', 'next time you\'re faced with a choice do the right thing. it hurts everyone less in the long run.', 'a banker is a fellow who lends you his umbrella when the sun is shining but wants it back the minute it begins to rain.', 'a clear vision backed by definite plans gives you a tremendous feeling of confidence and personal power.', 'a companion is but another self; wherefore it is an argument that a man is wicked if he keep company with the wicked.', 'a daily dose of daydreaming heals the heart soothes the soul and strengthens the imagination.', 'a dream is a seed. vision plants it. imagination nurtures growth. opportunities create blooms. thoughts become things!', 'a family is a place where principles are hammered and honed on the anvil of everyday living.', 'a friend of mine tried to annoy me with bird puns but i soon realized that toucan play at that game.', 'a good book should leave you slightly exhausted at the end. you live several lives while reading it.', 'a good friend can tell you what is the matter with you in a minute. he may not seem such a good friend after telling.', 'a hundred failures would not matter when one single success could change the destiny of the world.', 'a life spent making mistakes is not only more honorable but more useful than a life spent doing nothing.', 'a little rebellion now and then is a medicine necessary for the sound health of government.', 'a lot of people have gone further than they thought they could because someone else thought they could', 'a man has a hard time feeling fulfilled when he lives a life that does not serve a purpose that is more than himself.', 'a man\'s respect for law and order exists in precise relationship to the size of his paycheck.', 'a mathematician believes that describing the speed of mercury with equations amounts to science.', 'a mediocre idea that generates enthusiasm will go further than a great idea that inspires no one.', 'a minute of perfection was worth the effort. a moment was the most you could ever expect from perfection.', 'a politician was a person with whose politics you did not agree. when you did agree he was a statesman.', 'a real decision is measured by the fact that you\'ve taken a new action. if there\'s no action you haven\'t truly decided.', 'a scientist can discover a new star but he cannot make one. he would have to ask an engineer to do it for him.', 'a single bad habit will mar an otherwise faultless character as an ink drop soileth the pure white page.', 'a sub-clerk in the post-office is the equal of a conqueror if consciousness is common to them.', 'a subtle thought that is in error may yet give rise to fruitful inquiry that can establish truths of great value.', 'a tiger only needs three things to be comfortable. lots of food sleep andactually no it\'s just those two things.', 'accept whatever comes to you woven in the pattern of your destiny for what could more aptly fit your needs?', 'accept yourself love yourself and keep moving forward. if you want to fly you have to give up what weighs you down.', 'accept yourself your strengths your weaknesses your truths and know what tools you have to fulfill your purpose.', 'actions speak louder than words and a smile says i like you. you make me happy. i am glad to see you.', 'acts of kindness: a random act of kindness no matter how small can make a tremendous impact on someone else\'s life.', 'advertising is fundamentally persuasion and persuasion happens to be not a science but an art.', 'advertising: the science of arresting the human intelligence long enough to get money from it.', 'advice is like snow; the softer it falls the longer it dwells upon and the deeper it sinks into the mind.', 'aerodynamically the bumble bee shouldn\'t be able to fly but the bumble bee doesn\'t know it so it goes on flying anyway.', 'affection is a garden and without it there would not be a verdant spot on the surface of the globe.', 'after several annoying incidents our school finally implemented thorough security upgrades for their devices', 'all progress is based upon a universal innate desire on the part of every organism to live beyond its income.', 'all these observations fascinate us and fill us with an intense desire to know more about the nature of these phenomena.', 'always be like a water. float in the times of pain or dance like waves along the wind which touches its surface.', 'always bear in mind that your own resolution to succeed is more important than any other one thing.', 'america is a country that doesn\'t know where it is going but is determined to set a speed record getting there.', 'america is a nation with many flaws but hopes so vast that only the cowardly would refuse to acknowledge them.', 'an apple a day keeps the doctor away. but eating too many is quite enough-plenty. and you\'ll have to go see the good doc anyway.', 'an approximate answer to the right problem is worth a good deal more than an exact answer to an approximate problem.', 'an army without culture is a dull-witted army and a dull-witted army cannot defeat the enemy.', 'an attentive reader will always learn more and more quickly from good authors than from life.', 'an attitude of gratitude is the best outfit to wear when looking for success and happiness.', 'an engineer is someone who is good with figures but doesn\'t have the personality of an accountant.', 'an expanding universe does not preclude a creator but it does place limits on when he might have carried out his job!', 'an idealist is one who on noticing that a rose smells better than a cabbage concludes that it makes a better soup.', 'an inconvenience is only an adventure wrongly considered; an adventure is an inconvenience rightly considered.', 'and i remembered something else that makes us human: faith the only weapon in our arsenal to battle doubt.', 'and to all this she must yet add something more substantial in the improvement of her mind by extensive reading.', 'and believe me if i were again beginning my studies i should follow the advice of plato and start with mathematics.', 'any book that helps a child to form a habit of reading to make reading one of his deep and continuing needs is good for him.', 'anybody caught selling macrame in public should be dyed a natural color and hung out to dry.', 'anyone who attempts to generate random numbers by deterministic means is of course living in a state of sin.', 'appreciation can change a day even change a life. your willingness to put it into words is all that is necessary.', 'appreciation is a wonderful thing. it makes what is excellent in others belong to us as well.', 'arguments are like firearms which a man may keep at home but should not carry about with him.', 'arithmetic is numbers you squeeze from your head to your hand to your pencil to your paper till you get the answer.', 'as i get older and remember all the people i\'ve lost along the way. i think to myself maybe a career as a tour guide wasn\'t for me.', 'as i review the events of my past life i realize how subtle are the influences that shape our destinies.', 'as love without esteem is capricious and volatile; esteem without love is languid and cold.', 'as we express our gratitude we must never forget that the highest appreciation is not to utter words but to live by them.', 'as you fight any war sometimes the result may be defeat. learn to be heroic even in your defeats.', 'astronomers say the universe is finite which is a comforting thought for those people who can\'t remember where they leave things.', 'at its heart engineering is about using science to find creative practical solutions. it is a noble profession.', 'at the end of the day friendship proves itself more through your deeds than words could ever speak.', 'at there blackest wehn thinsg are two myself i say \'cheer up worse things could bee. \' and sure enuf worse they get.', 'baseball fans love numbers. they love to swirl them around their mouths like bordeaux wine.', 'be armed with purpose persistence and intention and the enemy called defeat will choose another to battle.', 'be dramatically willing to focus on the customer at all costs even at the cost of obsoleting your own stuff.', 'be idealistic about the future be realistic about the present and never forget the lessons of the past.', 'be more dedicated to making solid achievements than in running after swift but synthetic happiness.', 'be patient and open-minded in your interactions with others; find the positive attributes that they possess.', 'before you criticize a man walk a mile in his shoes. that way when you do criticize him you\'ll be a mile away and have his shoes.', 'before you\'ve practiced the theory is useless. after you\'ve practiced the theory is obvious.', 'being articulate is not the same as being wise. truth devoid of conscience is worthless in human existence.', 'being elected to congress though i am very grateful to our friends for having done it has not pleased me as much as i expected.', 'being irish he had an abiding sense of tragedy which sustained him through temporary periods of joy.', 'being selective - doing less - is the path of the productive. focus on the important few and ignore the rest.', 'being thankful should be an unwritten rule of life because there are several things to be thankful for.', 'believe in your heart. believe in your heart that you\'re meant to live a life full of passion purpose magic and miracles.', 'believe that your life is not ordinary and never look down on what you can do to impact a life.', 'blessed is the man who having nothing to say abstains from giving wordy evidence of the fact.', 'books are like seeds. they can lie dormant for centuries and then flower in the most unpromising soil.', 'books are more than educational - they are the quiet friends loyal companions and untiring teachers.', 'books have the same enemies as people - fire humidity animals weather and their own content.', 'both the man of science and the man of action live always at the edge of mystery surrounded by it.', 'breathing and sitting in silence allows you the space to find your joy and what matters most to you.', 'but i love halloween and i love that feeling: the cold air the spooky dangers lurking around the corner.', 'but in science the credit goes to the man who convinces the world not to the man to whom the idea first occurs.', 'but man has still another powerful resource: natural science with its strictly objective methods.', 'but then the course of events takes no account of verisimilitude. fiction has to be probable; fact does not.', 'calamities reveal your capabilities. take note of this and when times get odd prepare and shine.', 'carve your name on hearts not tombstones. a legacy is etched into the minds of others and the stories they share about you.', 'celebrate every day every moment every success and every failure. life is a celebration of love and consciousness.', 'champions aren\'t made in gyms. champions are made from something they have deep inside them.', 'champions know the emotions you want to feel and help you feel them by remaining genuine to a noble intention.', 'change is inevitable but choice defines the direction of change. so define choice to find success and happiness.', 'children pay little attention to their parents\' teachings but reproduce their characters faithfully', 'christmas is the joyous time of year when a box could equally contain a puzzle socks or computer game.', 'come out my friend. come out from the narrow lanes of darkness into the vivacious light of the day.', 'common sense is the most widely shared commodity in the world for every man is convinced that he is well supplied with it.', 'comparing science and religion isn\'t like comparing apples and oranges - it\'s more like apples and sewing machines.', 'computers are better than we are at arithmetic not because computers are so good at it but because we are so bad at it.', 'consider the lichen. lichens are just about the hardiest visible organisms on earth but the least ambitious.', 'courage and perseverance have a magical talisman before which difficulties disappear and obstacles vanish into air.', 'dance above the surface of the world. let your thoughts lift you into creativity that is not hampered by opinion.', 'deep breath. positive thought. firm resolve. now go out there and grab that dream with your name already on it.', 'deliberate with caution but act with decision; and yield with graciousness or oppose with firmness.', 'did you hear about the math teacher who\'s afraid of negative numbers? he will stop at nothing to avoid them.', 'disciples be damned. it\'s not interesting. it\'s only the masters that matter. those who create.', 'discovering while doing is natural but doing immediately after discovering is the attitude of winners!', 'discovery consists of looking at the same thing as everyone else and thinking something different.', 'do not despise your own place and hour. every place is under the stars every place is the center of the world.', 'do not give way to useless alarm; though it is right to be prepared for the worst there is no occasion to look on it as certain.', 'do not waste your days. be one of those people who accomplish more in a week than others do in a year!', 'do not worry about your difficulties in mathematics. i can assure you mine are still greater.', 'do you know what breakfast cereal is made of? it\'s made of all those little curly wooden shavings you find in pencil sharpeners!', 'do you not see how necessary a world of pains and troubles is to school an intelligence and make it a soul?', 'do you think there are smartphones in the afterlife? because if not lots of people are going to be very miserable in heaven.', 'don\'t be afraid to make mistakes. but if you do make new ones. life is too short to make the wrong choice twice.', 'don\'t bother just to be better than your contemporaries or predecessors. try to be better than yourself.', 'don\'t confuse excitement with happiness. the former is feverish and combustible. the latter is serene and long-lasting.', 'don\'t go into the new year holding a grudge from last year. leave the hurts and disappointments behind.', 'don\'t let goal setting become heavy weights. remain flexible and allow room for intuitive changes.', 'don\'t let mental blocks control you. set yourself free. confront your fear and turn the mental blocks into building blocks.', 'don\'t let the expectations and opinions of other people affect your decisions. it\'s your life not theirs.', 'don\'t only practice your art but force your way into its secrets for it and knowledge can raise men to the divine.', 'don\'t wait for success to become stronger and confident. be strong and confident success will automatically chase you', 'don\'t waste your time hating a failure. failure is a greater teacher than success. listen learn go on.', 'don\'t waste your time in anger regrets worries and grudges. life is too short to be unhappy.', 'dreams are hopeful because they exist as pure possibility. unlike memories which are fossils long dead and buried deep.', 'each person deserves a day away in which no problems are confronted no solutions searched for.', 'early scientists were often ridiculed for their theories. be open to replacing outdated belief systems with new ones.', 'eat alive frog first thing in teh mourning and nothing worst will happne to you teh wrest of the day.', 'educate the masses elevate their standard of intelligence and you will certainly have a successful nation.', 'education consists primarily in perfecting the artscience of connecting apparently disparate dots.', 'einstein said that if quantum mechanics were correct then the world would be crazy. einstein was right - the world is crazy.', 'engenuity cap chored arial photographs of teh reked remains of its landign kraft on teh sir face of mars', 'engineering is the art of directing the great sources of power in nature for the use and convenience of man.', 'eternal law has arranged nothing better than this that it has given us one way in to life but many ways out.', 'even during a mid-life crisis do not deviate from your goal. history remembers only those who succeed.', 'even if ninety-nine percent of what you discover is later proven wrong it is the one percent that is right that matters.', 'even when we do not actively participate in our destiny we are still on a chosen path. life has a way of making decisions for us.', 'ever since happiness heard your name it has been running through the streets trying to find you.', 'every blade of grass is a study; and to produce two where there was but one is both a profit and a pleasure.', 'every day i get up and look through the forbes list of the richest people in america. if i\'m not there i go to work.', 'every hour a scientist spends trying to raise funds is an hour lost from important thought and research.', 'every intelligent being whether it breathes or not coughs nervously at some time in its life.', 'every man has a right to life. that means that he also has a right to make a comfortable living.', 'every science begins as philosophy and ends as art; it arises in hypothesis and flows into achievement.', 'every success whether it is the biggest or the smallest inspires the joy and the beauty of life.', 'every thing a bout my crow scopic life is terra plea upsetting. how can things sew small bee sew important?', 'every time a champion makes a decision they have a chance to learn something new regardless of the outcome.', 'every year it takes less time to fly across the atlantic and more time to drive to the office.', 'everyone has his faults which he continually repeats: neither fear nor shame can cure them.', 'everyone is a genius at least once a year; a real genius has his original ideas closer together.', 'everything about microscopic life is terribly upsetting. how can things so small be so important?', 'everything else in life can be confusing but what is clear is the importance of looking after yourself.', 'everything we care about lies somewhere in the middle where pattern and randomness interlace.', 'evil thoughts intrude in an unemployed mind as naturally as worms are generated in a stagnant pool.', 'examinations are formidable even to the best prepared for the greatest fool may ask more than the wisest man can answer.', 'except responsibility four you\'re life. no that it is ewe who will get ewe wear ewe wont two go know won else.', 'excuse me captain. are you two going to weep salty tears of admiration over a helmet all night or do we have matters to discuss?', 'expressing authentic appreciation doesn\'t cost you anything and the outcomes are simply wonderful.', 'eye feal very adventuruos.  their are sew many doors to be opended and i\'m not afriad to look behidn them.', 'eye had know talent four science. what was infinitely worse: awl my fraternity brothers whir engineers.', 'eye lived inn fear that other engineers wood stop me inn the street and ask me a math question and eye wouldn\'t no the answer.', 'eye recently heared about a manakin that lost all of his freinds becuse he was so clothes minderd!', 'facts are a heap of bricks and timber. it is only a successful theory that can convert the heap into a stately mansion', 'facts mean nothing when they are preempted by appearance. do not underestimate the power of impression over reality.', 'failure is constructive feedback that tells you to try a different approach to accomplish what you want.', 'faith and mathematics don\'t only bring you back to the people you love. they can also bring you to the people you hate.', 'fantasy is a necessary ingredient in living it\'s a way of looking at life through the wrong end of a telescope.', 'fear is the main source of superstition and one of the main sources of cruelty. to conquer fear is the beginning of wisdom.', 'fifty percent of all doctors graduate in the bottom half of their class - hope your surgery went well!', 'finally from so little sleeping and so much reading his brain dried up and he went completely out of his mind.', 'find a group of people who challenge and inspire you; spend a lot of time with them and it will change your life.', 'find as much knowledge as you can. do not forget to share the knowledge that has been obtained to others', 'finding the lesson behind every adversity will be the one important thing that helps get you through it.', 'flowers always make people better happier and more helpful; they are sunshine food and medicine to the mind.', 'focus on making choices to lead your life that aligns with your core values in the most purposeful way possible.', 'for it is not needful to use a common proverb that one should drink up the ocean who wishes to learn that its water is salt.', 'for my part now i consider supper as a turnpike through which one must pass in order to get to bed.', 'freedom is found within in the shape of our laughter and the way we love in the truths that we live by and the stories we become', 'freedom is the only worthy goal in life. it is won by disregarding things that lie beyond our control.', 'freedom is the willingness and ability to choose your own path and experience your life as your true self.', 'freinds come and go lkie teh wayvs of teh oshun but teh tru ones stay lkie an octopous on you\'re face.', 'friendship with oneself is all important because without it one cannot be friends with anyone else in the world.', 'from the moment i picked up your book until i put it down i was convulsed with laughter. some day i intend reading it.', 'gentleman is a term which does not apply to any station but to the mind and the feelings in every station.', 'getting to know who you are is the secret to ensuring that your life will not be dull and unnoticed', 'give a bowl of rice to a man and you will feed him for a day. teach him how to grow his own rice and you will save his life.', 'give me the liberty to know to utter and to argue freely according to conscience above all liberties.', 'give me the positions and velocities of all the particles in the universe and i will predict the future.', 'going to church doesn\'t make you a christian any more than going to the garage makes you a car.', 'good advice for anyone wanting to make an impact with a product a service or even a message is to differentiate yourself.', 'grant me a sense of humor lord the saving grace to see a joke to win some happiness from life and pass it on to other folks.', 'gratitude makes sense of our past brings peace for today and creates a vision for tomorrow.', 'great achievement is usually born of great sacrifice and is never the result of selfishness.', 'great powers and natural gifts do not bring privileges to their possessor so much as they bring duties.', 'great things are done when men and mountains meet. this is not done by jostling in the street.', 'guard your heart mind and time. those three things will determine the health of everything else in your life.', 'hapliness will grow if ewe plant teh seeds of luv in teh garden of hope with compassoin and kare.', 'happiness is a state of mind a choice a way of living; it is not something to be achieved it is something to be experienced.', 'happiness is standalone element. it\'s not connected to anything. least of all to power wealth fame or material objects.', 'having fun at what you do for work is going to substantially increase the possibility of you becoming successful.', 'help others without any reason and give without the expectation of receiving anything in return.', 'heres to freedom cheers to art. heres to having an excellent adventure and may the stopping never start.', 'his imagination resembled the wings of an ostrich. it enabled him to run though not to soar.', 'history is filled with the sound of silken slippers going downstairs and wooden shoes coming up.', 'history is full of the dead weight of things which have escaped the control of the mind yet drive man on with a blind force.', 'history tells us who accomplished great feats with studious research can we discover their motivation.', 'hope is not a feeling of certainty that everything ends well. hope is just a feeling that life and work have a meaning.', 'how do you tell the psychiatrists from the patients in the hospital? the patients get better and leave.', 'how ghastly for her people actually thinking with their brains and right next door. oh the travesty of it all.', 'how grief and the passage of years can leave their mark. how the burden of duty can wear away the body\'s resilience', 'how important things you will achieve in life will be determined by how many times you shall act bravely in life!', 'how is something authorised as \'feng shui compliant\' he wondered. is there a chinese ministry of magic?', 'how satisfying it is to leave a mark on a blank surface. to make a map of my movement - no matter how temporary.', 'how wonderful it is that nobody need wait a single moment before starting to improve the world.', 'however bad life may seem there is always something you can do and succeed at. where there\'s life there\'s hope.', 'human beings can easily destroy every elephant on earth but we are helpless against the mosquito.', 'hurdles can be leapt over or plowed through.  rarely does one deploy monster trucks for the task.', 'i always pass on good advice. it is the only thing to do with it. it is never of any use to oneself.', 'i am a believer in free will. if my dog chooses to hate the whole human race except myself it must be free to do so.', 'i am a detective i am a decipherer and i am a finder of lost souls. my life is my own. and the future is up to us.', 'i am always sorry when any language is lost because languages are the pedigrees of nations.', 'i am never without my lyric book. if anything inspirational happens i have it there so nothing\'s forgotten.', 'i believe in the possibility of miracles but more to the point i believe in our need for them.', 'i bought a book titled \"how to scam people online\" about three months ago. it still hasn\'t arrived.', 'i can\'t change the direction of the wind but i can adjust my sails to always reach my destination.', 'i can\'t give you a sure-fire formula for success but i can give you a formula for failure: try to please everybody all the time.', 'i didn\'t invent forensic science and medicine. i just was one of the first people to recognize how interesting it is.', 'i do like alternative rock and rap but as far as inspirational then i go full-on orchestra. it fills up your entire being.', 'i do not want people to be very agreeable as it saves me the trouble of liking them a great deal.', 'i don\'t care too much what happened in the past. i prefer to focus on what is coming next and i am really looking forward to it.', 'i don\'t eat pumpkin pie. it\'s made from the guts of jack-o-lanterns and that\'s just spooky.', 'i feel an almost overwhelming interest in the methods of daylight abduction employed by the modern youth.', 'i find television very educational. every time someone turns it on i go in the other room and read a book.', 'i firmly believe that unless one has tasted the bitter pill of failure one cannot aspire enough for success.', 'i fully appreciate the present peril the country is in and the weight of responsibility on me.', 'i had no talent for science. what was infinitely worse: all my fraternity brothers were engineers.', 'i have just returned from boston. it is the only sane thing to do if you find yourself up there.', 'i have tried too in my time to be a philosopher; but i don\'t know how cheerfulness was always breaking in.', 'i have understood well that the duty of self-preservation rests solely with the american people.', 'i heard a definition once: happiness is health and a short memory! i wish i\'d invented it because it is very true.', 'i just got out of the hospital. i was in a speed reading accident. i hit a book mark and flew across the room.', 'i knew a mathematician who said \'i do not know as much as god. but i know as much as god knew at my age\'.', 'i like pop music. earnestly. most of the greatest technicians mix engineers and players are working in pop music.', 'i liked math - that was my favorite subject - and i was very interested in astronomy and in physical science.', 'i lived in fear that other engineers would stop me in the street and ask me a math question and i wouldn\'t know the answer.', 'i love the valiant; but it is not enough to wield a broadsword one must also know against whom.', 'i may not have gone where i intended to go but i think i have ended up where i needed to be.', 'i must have a prodigious amount of mind; it takes me as much as a week sometimes to make it up!', 'i never did very well in math - i could never seem to persuade the teacher that i hadn\'t meant my answers literally.', 'i never travel without my diary. one should always have something sensational to read in the train.', 'i often considered whether there could perhaps be found a more reasonable arrangement of circles.', 'i pray for your kindness more than your success because the latter without the former is a tragedy.', 'i put tape on the mirrors in my house so i don\'t accidentally walk through into another dimension.', 'i read somewhere how important it is in life not necessarily to be strong but to feel strong. to measure yourself at least once.', 'i rode an elevator with a guy who was whistling the tune of \'this is the song that never ends\'. putting that on me? come on dude..', 'i speak to everyone in the same way whether he is the garbage man or the president of the university.', 'i think animal testing is a terrible idea; they get all nervous and give the wrong answers.', 'i think anyone who has a passion for what they love to do and who pursue it is inspirational for me.', 'i think i\'ve discovered the secret of life -- you just hang around until you get used to it.', 'i think the discomfort that some people feel in going to the monkey cages at the zoo is a warning sign.', 'i think with the romans that the general of today should be a soldier tomorrow if necessary.', 'i was always very interested in science and i knew that for me science was a better long-term career than tennis.', 'i was halfway across america at the dividing line between the east of my youth and the west of my future.', 'i wish i could make him understand that a loving good heart is riches enough and that without it intellect is poverty.', 'i wonder he said whether the stars are set alight in heaven so that one day each one of us may find his own again.', 'i would like to speak in terms of praise due to the many brave officers and soldiers who have fought in the cause of the war.', 'if being happy is important to you try this: instead of regretting all you lack celebrate all you\'ve got.', 'if difficult times teach us the most important lessons we should then learn to read difficult books.', 'if education were the same as information the encyclopedias would be the greatest sages in the world.', 'if ewe see an aunty madder version of yoursefl runnign twoards ewe think twice befoer embarcing.', 'if eye whir ever abducted buy aliens the first thing eye\'d ask is weather they came from a planet wear people also deny science.', 'if god had wanted us to be concerned for the plight of the toads he would have made them cute and furry.', 'if i have the belief that i can do it i shall surely acquire the capacity to do it even if i may not have it at the beginning.', 'if i were ever abducted by aliens the first thing i\'d ask is whether they came from a planet where people also deny science.', 'if it\'s a good idea go ahead and do it. it\'s much easier to apologize than it is to get permission.', 'if life throws you a few bad notes or vibrations don\'t let them interrupt or alter your song.', 'if our brains were simple enough for us to understand them we\'d be so simple that we couldn\'t.', 'if our founding fathers wanted us to care about the rest of the world they wouldn\'t have declared their independence from it.', 'if people are good only because they fear punishment and hope for reward then we are a sorry lot indeed.', 'if people do not believe that mathematics is simple it is only because they do not realize how complicated life is.', 'if people learn something about the news by watching the show that is incidental to my goal.', 'if possible try to avoid pushing each other over the edge as that would cause me extra paperwork.', 'if the world should blow itself up the last audible voice would be that of an expert saying it can\'t be done.', 'if there was one advantage of the numerous lifetimes he\'d been forced to endure it was undoubtedly knowledge.', 'if there was one thing that life has taught me it\'s to accept the most foolish and unthinkable happiness.', 'if there were formula for success mathematicians would have definitely held the top spot in the world\'s richest list.', 'if there were no schools to take the children away from home part of the time the insane asylums would be filled with mothers.', 'if there\'s a better way of showing thanks than eating a large bird followed by pie i\'d like to see it.', 'if time travel were possible the future would have already taught the present to teach the past how to do it.', 'if we all did the things we are really capable of doing we would literally astound ourselves.', 'if we had no faults of our own we should not take so much pleasure in noticing those in others.', 'if you act for self-gain then no good can come of it. if you act selflessly then you act well for all and you must not be afraid.', 'if you are lazy and accept your lot you may live in it. if you are willing to work you can write your name anywhere you choose.', 'if you blame others for something that happens in your life then you must wait until they change in order to get better.', 'if you can\'t be honest with your friends and colleagues and loved ones then what is life all about?', 'if you don\'t synthesize knowledge scientific journals become spare-parts catalogues for machines that are never built.', 'if you feel inferior all the time this means that you regularly let people say and do to you whatever they feel like.', 'if you follow reason far enough it always leads to conclusions that are contrary to reason.', 'if you hang out with chickens you\'re going to cluck and if you hang out with eagles you\'re going to fly.', 'if you haven\'t had at least a slight poetic crack in the heart you have been cheated by nature.', 'if you knew that hope and despair were paths to the same destination which would you choose?', 'if you really love if you really know how to laugh the result is the same - you forget yourself.', 'if you reject the food ignore the customs fear the religion and avoid the people you might better stay home.', 'if you removed all the arteries veins  capillaries from a person\'s body and tied them end-to-endthe person will die.', 'if you surrender completely to the moments as they pass you live more richly those moments.', 'if you think of building your life the way you build a house it can help you see how important having a strong foundation is', 'if you think there are no new frontiers watch a boy ring the front doorbell on his first date.', 'if you\'re reading this congratulations you\'re alive. if that\'s not something to smile about then i don\'t know what is.', 'im learning more that some of life lessons are well hidden but im reporting today to seek the value of the unwritten.', 'i\'m not much of a math and science guy. i spent most of my time in school daydreaming and managed to turn it into a living.', 'i\'m thankful for each and every one of you. now stop hiding in the broom closet reading tweets and get back with your family.', 'imagination was given to man to compensate him for what he is not; a sense of humor to console him for what he is.', 'in elementary school i did well in science but i was a poor writer. when i got to high school i failed all my courses.', 'in finding the courage and confidence to escape our cages and shine we help others do the same.', 'in life there is no lesson greater than patience; and so there is no teacher greater than a fool.', 'in madders of cnoscience first thouhgts are bets in madders of prudnece last thoughst aer bset.', 'in recalling their school years students mostly remember their teachers and not the courses they took.', 'in school they told me practice makes perfect. and then they told me nobody\'s perfect so then i stopped practicing.', 'in the action business when you don\'t want to say you ran like a mouse you call it \'taking cover.\' it\'s more heroic.', 'in the battle between science and storytelling there is simply no competition: storytelling wins every time.', 'in the beginning the poets and philosophers taught the world to see. then after that any form of education was no longer free.', 'in the hearts and minds of the people the grapes of wrath were growing heavy for the vintage.', 'in theory it was around now literature. susan hated literature. she\'d much prefer to read a good book.', 'in this thing one man is superior to another that he is better able to bear adversity and prosperity.', 'in today\'s world human desires far supersede human needs. waste as you can see is the result of that disparity.', 'inability to deal with a different ideology than one\'s own is the biggest disability a human can posses.', 'individuals should take personal responsibility for knowledge acquisition and campaigns against ignorance.', 'intelligence and wisdom are certainly compatible however they are rarely seen in each other\'s company.', 'intelligence is like an underwear. it is important that you have it but not necessary that you show it off.', 'is it better to be the lover or the loved one? neither if your cholesterol is over six hundred.', 'is there any knowledge in the world which is so certain that no reasonable man could doubt it?', 'isn\'t it interesting that the same people who laugh at science fiction listen to weather forecasts and economists?', 'it can hardly be a coincidence that no language on earth has ever produced the expression \'as pretty as an airport.', 'it doesn\'t matter how many times you get knocked down. all that matters is you get up one more time than you were knocked down.', 'it doesn\'t matter how wealthy you may be in material things what matters is do you know what to do with those wealth?', 'it doesn\'t matter where you come from. it only matters where you are and where you want to go.', 'it has been said that man is a rational animal. all my life i have been searching for evidence which could support this.', 'it is a much shallower and more ignoble occupation to detect faults than to discover beauties.', 'it is a sign of our power and our criminal folly that we can pollute the vast ocean and are doing so.', 'it is a tragedy of modern life that the light of truth scares the society much more than the darkness of ignorance.', 'it is better to be respected than it is to be popular. popularity ends on yearbook day but respect lasts forever.', 'it is hard to understand how a cemetery raised its burial cost and blamed it on the cost of living.', 'it is impossible to transcend the laws of nature. you can only determine that your understanding of nature has changed.', 'it is more difficult and it calls for higher energies of soul to live a martyr than to die one.', 'it is nobler to declare oneself wrong than to insist on being right --especially when one is right.', 'it is not the job of mathematicians to do correct arithmetical operations. it is the job of bank accountants.', 'it is now common knowledge that the average american gains seven pounds between thanksgiving and new year\'s day.', 'it is one of the beautiful compensations of life that no man can sincerely try to help another without helping himself.', 'it is one of those lessons that every child should learn: don\'t play with fire sharp objects or ancient artifacts.', 'it is science and not religion which has taught men that things are complex and difficult to understand.', 'it is strange that only extraordinary men make the discoveries which later appear so easy and simple.', 'it is strange but rocks properly chosen and polished can be as beautiful as flowers and much more durable.', 'it is the duty of the president to propose and it is the privilege of the congress to dispose.', 'it is the easiest thing in the world to deny a fact. people do it all the time. yet it remains a fact just the same.', 'it is the greatest possible praise to be praised by a man who is himself deserving of praise.', 'it is the man who carefully advances step by step who is bound to succeed in the greatest degree.', 'it is the privilege of genius that life never grows commonplace as it does for the rest of us.', 'it is the rare fortune of these days that one may think what one likes and say what one thinks.', 'it is through cooperation rather than conflict that your greatest successes will be derived.', 'it only takes a split second to smile and forget yet to someone that needed it it can last a lifetime.', 'it seems to me that at this time we need education in the obvious more than investigation of the obscure.', 'it seems two me that at this thyme wee knead edukashun inn the obvious more than investigation of the obscure.', 'it was amazing how many books one could fit into a room assuming one didn\'t want to move around very much.', 'it\'s a delightful thing to think of perfection; but it\'s vastly more amusing to talk of errors and absurdities.', 'it\'s a lack of clarity that creates chaos and frustration. those emotions are poison to any living goal.', 'it\'s humbling to think that all animals including human beings are parasites of the plant world.', 'its impossible two walk through solid rock. you have to walk between the molecules that make up the rock.', 'it\'s much easier on the emotions when one sees life as an experiment rather than a struggle for popularity.', 'it\'s much easier to not know things sometimes. things change and friends leave. and life doesn\'t stop for anybody.', 'it\'s not always what we don\'t know that gets in our way; sometimes it\'s what we think we know that keeps us from learning.', 'it\'s only after you\'ve stepped outside your comfort zone that you begin to change grow and transform.', 'i\'ve always been very one-sided about science and when i was younger i concentrated almost all my effort on it.', 'i\'ve always thought people would find a lot more pleasure in their routines if they burst into song at significant moments.', 'i\'ve been lucky. opportunities don\'t often come along. so when they do you have to grab them.', 'i\'ve been smoking nearly fifty years now. i just don\'t feel safe breathing anything i can\'t see!', 'i\'ve never seen a job being done by a five-hundred-person engineering team that couldn\'t be done better by fifty people.', 'i\'ve noticed that when people are joking they\'re usually dead serious and when they\'re serious they\'re usually pretty funny.', 'just as graphite and diamonds have the same composition that which seems quite obvious may also not be', 'just living is not enough\" said the butterfly \"one must have sunshine freedom and a little flower.', 'keep away from the kinship of the individuals who continually ask and examine the imperfections of others.', 'keeping the box closed just keeps you in the dark not the universe but failing to open the box doesn\'t kill the cat.', 'kids are really inspired to not just apply senses to robots and machines but to try them on themselves.', 'knowledge must come through action - you can have no test which is not fanciful save by trial.', 'lace up those shoes breathe deep and get out there. you\'ve got miracles to make happen today.', 'laughter is good for you. nine out of ten stand-up comedians recommend laughter in the face of intense stupidity.', 'leaders cannot build a successful nation once they are yoked to these two evils ignorance and greed.', 'leadership is the art of getting someone else to do something you want done because he wants to do it.', 'learn everything you can anytime you can from anyone you can there will always come a time when you will be grateful you did.', 'learning to distance yourself from all the negativity is one of the greatest lessons to achieve inner peace.', 'leonardo da vinci combined art and science and aesthetics and engineering that kind of unity is needed once again.', 'let me never fall into the vulgar mistake of dreaming that i am persecuted whenever i am contradicted.', 'let us attend to the present and as to the future we shall know how to manage when the occasion arrives.', 'let us be of good cheer remembering that the misfortunes hardest to bear are those which never happen.', 'let us then turn this government back into the channel in which the framers of the constitution originally placed it.', 'life does not accommodate you; it shatters you. every seed destroys its container or else there would be no fruition.', 'life has a cruel way of reminding one and all it stops for no one and simply marches on dragging everyone with it.', 'life is about accepting the challenges along the way choosing to keep moving forward and savoring the journey.', 'life is an endless trial and death its certain verdict but there are many recesses to enjoy before then.', 'life is essentially a circus and we are just playing our roles. remember life makes everyone \'joker\' once in a while.', 'life is going to give you just what you put in it. put your whole heart in everything you do and pray then you can wait.', 'life is like a novel. it\'s filled with suspense. you have no idea what is going to happen until you turn the page.', 'life is like a steering wheel it only takes one small move to change your entire direction.', 'life is not like water. things in life don\'t necessarily flow over the shortest possible route.', 'life is short. focus on what really matters most. you have to change your priorities over time.', 'life is to be lived not controlled; and humanity is won by continuing to play in face of certain defeat.', 'life\' wrote a friend of mine \'is a public performance on the violin in which you must learn the instrument as you go along.', 'life\'s trail can double back and retrace it\'s path several times but when it does you learn more. what is the same is also different.', 'like all science psychology is knowledge; and like science again it is knowledge of a definite thing the mind.', 'listen to me dear. when life hands you something you take it for in all likelihood there\'s a large crisis heading your way.', 'lite travles faster then sound.  this is why some poeple appeer brite until you here them speek.', 'live authentically. why would you continue to compromise something that\'s beautiful to create something that is fake?', 'live in the present remember the past and fear not the future for it doesn\'t exist and never shall. there is only now.', 'lord where we are wrong make us willing to change; where we are right make us easy to live with.', 'losing is a learning experience. it teaches you humility. it teaches you to work harder. it\'s also a powerful motivator.', 'losing your life is not the worst thing that can happen. the worst thing is to lose your reason for living.', 'love is the color in your life. enjoy all the shades and new sensations that come with it making you feel alive.', 'love only grows by sharing. you can only have more for yourself by giving it away to others.', 'love yourself. forgive yourself. be true to yourself. how you treat yourself sets the standard for how others will treat you.', 'make plans for your new goals. and press towards achieving the goals with all your strength.', 'man has to awaken to wonder - and so perhaps do peoples. science is a way of sending him to sleep again.', 'man will occasionally stumble over the truth but most of the time he will pick himself up and continue on.', 'man i was tame compared to what they do now are you kidding? all that i ever did was just jiggle.', 'many of life\'s failures are people who did not realise how close they were to success when they gave up.', 'many people say i\'m the best women\'s soccer player in the world. i don\'t think so. and because of that someday i just might be.', 'many plays are like blank checks. the actors and directors put their own signatures on them.', 'many years ago i resolved never to bother with new year\'s resolutions and i\'ve stuck with it ever since.', 'mars is the only place in the solar system where it\'s possible for life to become multi-planetarian.', 'materialism: buying things we don\'t need with money we don\'t have to impress people that don\'t matter.', 'mathematical knowledge adds a manly vigour to the mind frees it from prejudice credulity and superstition.', 'mathematics expresses values that reflect the cosmos including orderliness balance harmony logic and abstract beauty.', 'mathematics is like checkers in being suitable for the young not too difficult amusing and without peril to the state.', 'may the knowledge gained in one\'s lifetime become the new wisdom that will last for a thousand years.', 'maybe this is why we read and why in moments of darkness we return to books: to find words for what we already know.', 'medicine the only profession that labors incessantly to destroy the reason for its own existence.', 'midnight on new year\'s eve is a unique kind of magic where just for a moment the past and the future exist at once in the present.', 'millions of spiritual creatures walk the earth unseen both when we sleep and when we awake.', 'mindset is everything. like the eye of a storm -find the sunshine and calm within you even if there is chaos outside of you.', 'most people know nothing about learning; many despise it. dummies reject as too hard whatever is not dumb.', 'most people overestimate what they can do in one year and underestimate what they can do in ten years.', 'most people say that it is the intellect which makes a great scientist. they are wrong: it is character.', 'music is not math. it\'s science. you keep mixing the stuff up until it blows up on you or it becomes this incredible potion.', 'my belief is firm in a law of compensation. the true rewards are ever in proportion to the labor and sacrifices made.', 'my best mates and i played a game of hiding and seek. it went on for hours. well good friends are hard to find.', 'my dad finally left me a voicemail where he didn\'t introduce himself. i think we\'re getting closer.', 'my doctor told me to stop having intimate dinners for four. unless there are three other people.', 'my favorite part of fall is walking through a hundred spider webs a day and screaming every single time.', 'my goal is simple. it is a complete understanding of the universe why it is as it is and why it exists at all.', 'my grandpa always said asking a question is embarrass for a moment but not asking a question is embarrasing for a life time', 'my heart which is so full to overflowing has often been solaced and refreshed by music when sick and weary.', 'my idea of walking into the jaws of death is marrying some woman who has lost three husbands.', 'my mother was like a cat who could never catch the tail of happiness because she never stopped chasing it.', 'my new year\'s resolution this year is to make a resolution that i can actually keep like drink a glass of water before bed tonight.', 'my novels are written with the purpose of taking all of my character\'s mess and turning it into a beautiful masterpiece.', 'my prince is not coming on a white horse. he\'s obviously riding a turtle and definitely lost.', 'my tattooing is indestructible. it is an everlasting gem that you will take into your grave.', 'my view is that if your philosophy is not unsettled daily then you are blind to all the universe has to offer.', 'nations consist of people. and with their effort a nation can accomplish all it could ever want.', 'nations that have successfully converted better are those ones we refer to as developed nations today', 'neither a man nor a crowd nor a nation can be trusted to act humanely or to think sanely under the influence of a great fear.', 'never apologize for burning too brightly or collapsing into yourself every night. that is how galaxies are made.', 'never give up on what you really want to do. the person with big dreams is more powerful than one with all the facts.', 'never give up your desire to be what you want to be. stay focused persistent and relentless.', 'never let hard lessons harden your heart; the hard lessons of life are meant to make you better not bitter.', 'never respond to an angry person with a fiery comeback even if he deserves it. don\'t allow his anger to become your anger.', 'never sit back and wait for a opportunity to find you get up and search for one it exists find it!', 'never stop just because you feel defeated. the journey to the other side is attainable only after great suffering.', 'never take life for granted. savor every sunrise because no one is promised tomorrowor even the rest of today.', 'no adolescent ever wants to be understood which is why they complain about being misunderstood all the time.', 'no amount of experimentation can ever prove me right; a single experiment can prove me wrong.', 'no man can reveal to you aught but that which already lies half asleep in the dawning of your knowledge.', 'no matter how old a mother is she watches her middle-aged children for signs of improvement.', 'no matter how your heart is grieving if you keep on believing the dreams that you wish will come true.', 'no matter what happened yesterday it is insignificant when compared to what lies within the core of your being today.', 'no matter what role you play in a meeting how you show up in that role is critical to the meeting\'s success.', 'no matter what your history has been your destiny is what you create today. what are you going to create?', 'no name-calling truly bites deep unless in some dark part of us we believe it. if we are confident enough then it is just noise.', 'no offense apu but when they were handing out religions you must have been out taking a whiz.', 'no one disputes that seeming order can come out of the application of simple rules. but who wrote the rules?', 'no one wants to learn from mistakes but we cannot learn enough from successes to go beyond the state of the art.', 'no place affords a more striking conviction of the vanity of human hopes than a public library.', 'no it is a very interesting number it is the smallest number expressible as a sum of two cubes in two different ways.', 'nothing can resist the human will that will stake even its existence on its stated purpose.', 'nothing has any power over me other than that which i give it through my conscious thoughts.', 'nothing in life is more remarkable than the unnecessary anxiety which we endure and generally occasion ourselves.', 'nothing in life is to be feared it is only to be understood. now is the time to understand more so that we may fear less.', 'nothing in the universe can travel at the speed of light they say forgetful of the shadows speed.', 'nothing is faster than the speed of light. to prove this to yourself try opening the refrigerator door before the light comes on.', 'nothing much happens without a dream. for something really great to happen it takes a really great dream.', 'nowadays focusing on transferring applicable knowledge is a very challenging task that all teachers face.', 'o what fine thought we had because we thought that the worst rogues and rascals had died out.', 'obsticalls aer tohes frightning thinsg that beecmoe vsiible wen we take are eyes off ar goles.', 'of course there is learning without teaching. it\'s just commonly referred to by another name: science.', 'old lady failure died giving birth to twin giants named confidence  optimism but her name lives on as the mother of success.', 'on an occasion of this kind it becomes more than a moral duty to speak one\'s mind. it becomes a pleasure.', 'once you can accept the universe as matter expanding into nothing that is something wearing stripes with plaid comes easy.', 'once you have explored a fear it becomes less terrifying. part of courage comes from extending our knowledge.', 'one day can change your life. one day can ruin your life. all life is is three or four big days that change everything.', 'one good husband is worth two good wives for the scarcer things are the more they are valued.', 'one of the advantages of science is that one\'s work ultimately is either replicated or it is not.', 'one of the inescapable encumbrances of leading an interesting life is that there have to be moments when you almost lose it.', 'one of the problems with having time to read all that you want is that your interests become so eclectic it\'s hard to focus.', 'one of the wonders of science is that it is completely universal. it crosses national boundaries with total ease.', 'one resolution i have made and try always to keep is this  to rise above the little things.', 'one word of encouragement can be enough to spark someone\'s motivation to continue with a difficult challenge.', 'optimism is the faith that leads to achievement. nothing can be done without hope and confidence.', 'organizing is what you do before you do something so that when you do it it is not all mixed up.', 'our battered suitcases were piled on the sidewalk again; we had longer ways to go. but no matter the road is life', 'our greatest fear should not be of failure but of succeeding at things in life that don\'t really matter.', 'our obstacles are tough so are our potentials. if we don\'t unleash our potentials our obstacles will cripple us!', 'our prejudices are like physical infirmities - we cannot do what they prevent us from doing.', 'our species needs and deserves a citizenry with minds wide awake and a basic understanding of how the world works.', 'our virtues and our failings are inseparable like force and matter. when they separate man is no more', 'people are more comfortable with a familiar discomfort than they are with an unfamiliar new possibility.', 'people are successful today because they work hard with an incredible faith in themselves in converting their time', 'people don\'t need love. what they need is success in one form or another. it can be love but it needn\'t be.', 'people often say that motivation doesn\'t last. well neither does bathing  that\'s why we recommend it daily.', 'people who are going to be successful know it\'s gonna happen. and those people tend to hustle until it does happen.', 'people who tell you to stop living in a fairytale world are very likely people who live in a horror movie.', 'perfect is determined in shortened measures of time not over long periods of time or lifetimes. it would be unnatural.', 'perfection is achieved not when there is nothing more to add but when there is nothing left to take away.', 'perfection is not just about control. it\'s also about letting go. surprise yourself so you can surprise the audience.', 'perhaps i know best why it is man alone who laughs; he alone suffers so deeply that he had to invent laughter.', 'philosophy from the earliest times has made greater claims and achieved fewer results than any other branch of learning.', 'plant seeds of happiness hope success and love; it will all come back to you in abundance. this is the law of nature.', 'police have arrested the world tongue-twister champion. i imagine he\'ll be given a tough sentence.', 'possibility of life on any planet needs availability of air water sunrays and vegetation not money and property.', 'previous journeys in search of treasure have taught me that a zigzag strategy is the best way to get ahead.', 'problems are the price of progress. don\'t bring me anything but trouble. good news weakens me.', 'procrastination should not be linked with failure just as early action should not be tied to success.', 'product management really is the fusion between technology what engineers do - and the business side.', 'professors of literature collect books the way a ship collects barnacles without seeming effort.', 'progress of the human society is predicated upon the proper functioning of a key element of the human mind that is reasoning.', 'psychology is the science of the intellects characters and behavior of animals including man.', 'psychology marks the triumph of human evolution. how many other species would need a science of the mind?', 'put off thy cares with thy clothes; so shall thy rest strengthen thy labor; and so shall thy labor sweeten thy rest.', 'puzzles are sort of like life because you can mess up and rebuild later and you\'re likely smarter the next time around.', 'questions you cannot answer are usually far better for you than answers you cannot question.', 'radical historians now tell the story of thanksgiving from the point of view of the turkey.', 'rash decisions will more often than not result in the demise of the chances you could have had with a situation; now foregone.', 'read books. care about things. get excited. try not to be too down on yourself. enjoy the ever present game of knowing.', 'real ballplayers pass the stuffing by rolling it up in a ball and batting it across the table with a turkey leg.', 'real education must ultimately be limited to one who insists on knowing the rest is mere sheep-herding.', 'reality provides us with facts so romantic that imagination itself could add nothing to them.', 'regret is one the scariest words in any language and success is one of the most beautiful ones. what are you waiting for?', 'remember that life is not measured by the number of breaths we take but by the moments that take our breath away!', 'remember that things are not always as they appear to be curiosity creates possibilities and opportunities.', 'respect other people\'s feelings. it might mean nothing to you but it could mean everything to them.', 'results! why man i have gotten a lot of results. i know several thousand things that won\'t work.', 'revere those things beyond science which really matter and about which it is so difficult to speak.', 'save more than you spend but do not hoard. reinvest. grow. focus on replowing your fields so they bear fruit.', 'science fiction encourages us to explore all the futures good and bad that the human mind can envision.', 'science fiction is no more written for scientists that ghost stories are written for ghosts.', 'science has confirmed what athletes have always believed: that there\'s more in thereif you\'re willing to believe it.', 'science has now determined there is a direct relationship between the way the ball bounces and the cookie crumbles.', 'science is a first-rate piece of furniture for a man\'s upper chamber if he has common sense on the ground floor.', 'science is a good thing. news reporters are good things too. but it\'s never a good idea to put them in the same room.', 'science is not about making predictions or performing experiments. science is about explaining.', 'science is the human endeavor to elevate the self and the society from the darkness of ignorance into the light of wisdom.', 'science is what we understand well enough to explain to a computer. art is everything else we do.', 'science isn\'t just about blowing things up. rather it\'s about blowing things up and knowing how you did it.', 'self-consciousness is the enemy of all art be it acting writing painting or living itself which is the greatest art of all.', 'siblings: children of the same parents each of whom is perfectly normal until they get together.', 'sin lies only in hurting other people unnecessarily. all other \"sins\" are invented nonsense.', 'so early in my life i had learned that if you want something you had better make some noise.', 'so many wish for magic so many beg for fame but if you could manifest anything you want life would be a boring game.', 'so the story of man runs in a dreary circle because he is not yet master of the earth that holds him.', 'software engineering might be science; but that\'s not what i do. i\'m a hacker not an engineer.', 'some days are like this. and the only way to get through them is to remember that they are only one day and that every day ends.', 'some may feel a bittersweet pricking of malicious delight while contemplating misfortune by others.', 'some people only gets called by their nicknames. usually it sounds weird to even say their real name.', 'someday i must read this scholar everyone. he seems to have written so much: all of it wrong.', 'sometimes i lie awake at night and i ask \"why me?\" then a voice answers \"nothing personal your name just happened to come up.', 'sometimes i think we\'re alone in the universe and sometimes i think we\'re not. in either case the idea is quite staggering.', 'sometimes in life a sudden situation a moment in time alters your whole life forever changes the road ahead.', 'sometimes it\'s better to stop trying to make sense of things. life isn\'t clear cut there are always gray areas.', 'sometimes love is nothing more than a sticky web; illusions spun from clever minds and bitter hearts.', 'sometimes the only way to find the answers is not to travel far away but to venture deeper within ourselves.', 'sometimes we have to soak ourselves in the tears and fears of the past to water our future gardens.', 'sometimes you can see things happen right in front of your eyes and still jump to the wrong conclusions.', 'sometimes you don\'t need a goal in life you don\'t need to know the big picture. you just need to know what you\'re going to do next!', 'sometimes you need a little crisis to get your adrenaline flowing and help you realize your potential.', 'sometimes you\'re not ready to give the world quite what it wants. and that\'s okay because the earth is generously patient.', 'sometimes you\'ve got to be able to listen to yourself and be okay with no one else understanding.', 'sorry about last year when i gave your thanksgiving dinner a bad yelp review but those potatoes were \"whipped\" not \"mashed.', 'start by doing what\'s necessary; then do what\'s possible; and suddenly you are doing the impossible.', 'statistics: the only science that enables different experts using the same figures to draw different conclusions.', 'stop sitting on the sidelines of everyone else\'s life and become and active participant in your own life.', 'strong as our passions are they may be starved into submission and conquered without being killed.', 'success and failure come and go but don\'t let them define you. it\'s who you are that matters.', 'success in life is a matter not so much of talent or opportunity as of concentration and perseverance.', 'success is a game which we measure not by the intentions of our opponents but by the effects of their play.', 'success is a tale of obstacles overcome and for every obstacle overcome an excuse not used.', 'success is complete only when it does not change who we are and neither pulls us away from our true friends.', 'success is not just to be at peace with your achievements. it is also developing the ability to inspire people around you.', 'success is not to discover what others like it is to acquire and practise the skills that help one gain their love.', 'success means we go to sleep at night knowing that our talents and ablities were used in a way that served others.', 'successful people don\'t have fewer problems. they have determined that nothing will stop them from going forward.', 'such is the respect for physicians that most people are astonished when one of them falls sickand yet they do.', 'talents are best nurtured in solitude; character is best formed in the stormy billows of the world.', 'teachers need to be more inspirational. but it\'s also up to engineering to make itself more interesting.', 'technology was supposed to be the help in life instead it has become the major driving force behind life.', 'teh hgihest intallex like teh tops of mountains are the frist to ctach an two reflect teh dawn.', 'thanksgiving would be better if the pilgrims had shot a lobster and the indians brought french fries.', 'that\'s the problem with nature. something\'s always stinging you or oozing mucus on you. let\'s go watch tv.', 'that\'s what i do. watch movies and read. sometimes i even pretend to write but i\'m not fooling anyone. oh and i go to the mailbox.', 'the ability to go from one failure to another without loss of enthusiasm is the ultimate foundation of success and strength.', 'the achievemenst of an oragnizashun aer the rezults of teh combnied effrot of each indavidule.', 'the atoms of the earth are formed inside of stars. nothing really dies everything is transformed.', 'the backbone of the electrical grid is largely massive numbers of steam driven engines that turn electrical generators.', 'the belief in their actions can mend constellations. the ambition in their thirst for knowledge can both create and destroy.', 'the best things in life are never rationed. friendship loyalty love do not require coupons.', 'the card-player begins by arranging his hand for maximum sense. scientists do the same with the facts they gather.', 'the challenge of life is to find a reason to be thankful in what seems on the surface to be a reason to complain.', 'the champion wins first then walks into the arena. everybody else walks into the arena and then tries to figure out what to do.', 'the corruption in reporting starts very early. it\'s like the police reporting on the police.', 'the democrats are very bad at selling their own product. the republicans are geniuses at it.', 'the desire to take medicine is perhaps the greatest feature which distinguishes man from animals.', 'the diseases which destroy a man are no less natural than the instincts which preserve him.', 'the dream was always running ahead of me. to catch up to live for a moment in unison was the miracle.', 'the dynamic nature of knowledge is reflected in human progress and technological achievements.', 'the ego relies on the familiar. it is reluctant to experience the unknown which is they very essence of life.', 'the enchanting charms of this sublime science reveal only to those who have the courage to go deeply into it.', 'the engineer\'s first problem in any design situation is to discover what the problem really is.', 'the first civilized being is not the one who wore a suit but the one who stood up and said i\'ll correct myself.', 'the function of science fiction is not always to predict the future but sometimes to prevent it.', 'the goal of science and engineering is to build better mousetraps. the goal of nature is to build better mice.', 'the good thing about the laws of physics is that they require no law enforcement agencies to maintain them', 'the government will see that human spaceflight is useful - for science and the economy - and inspirational.', 'the greatest danger for most of us is not that we aim too high and we miss it but we aim too low and reach it.', 'the greatest discovery of all time is that a person can change his future by merely changing his attitude.', 'the greatest love stories are not those in which love is only spoken but those in which it is acted upon.', 'the greatest pleasure i know is to do a good action by stealth and to have it found out by accident.', 'the greatest shortcoming of the human race is our inability to understand the exponential function.', 'the habit of being happy enables one to be freed or largely freed from the domination of outward conditions.', 'the heart of a mother is a deep abyss at the bottom of which you will always find forgiveness.', 'the height of your success will be measured with reference to the depth from which you started.', 'the house smelled musty and damp and a little sweet as if it were haunted by the ghosts of long-dead cookies.', 'the human brain is one of the most complex objects in the universe. is it any wonder that so many people never learn to use it.', 'the human mechanism is marvelous. but why not it is the result of three-and-a-half billion years of tinkering.', 'the imaginary friends i had as a kid dropped me because their friends thought i didn\'t exist.', 'the important thing in science is not so much to obtain new facts as to discover new ways of thinking about them.', 'the increase of disorder or entropy is what distinguishes the past from the future giving a direction to time.', 'the indispensable first step to getting the things you want out of life is this: decide what you want.', 'the journey of the freedom seeker isn\'t always easy. but it is essential and it is urgent for it is the path to coming alive again.', 'the leaders have the responsibility to protect and hold in high esteem the law and virtues of the land.', 'the level of success you achieve will be in direct proportion to the depth of your commitment.', 'the man of worth is really great without being proud; the mean man is proud without being really great.', 'the measure of a man\'s real character is what he would do if he knew he would never be found out.', 'the measure of greatness in a scientific idea is the extent to which it stimulates thought and opens up new lines of research.', 'the mere existence of nuclear weapons by the thousands is an incontrovertible sign of human insanity.', 'the mirrors of capitalism will never reflect us as wealthy successful or even worthy. - change perception', 'the mole is a quantity of substance. the new prefix \' guaca \' is defined such that one guacamole equals avocado\'s number.', 'the moon will guide you through the night with her brightness but she will always dwell in the darkness in order to be seen.', 'the most beautiful discovery true friends make is that they can grow separately without growing apart.', 'the most beautiful thing we can experience is the mysterious. it is the source of all true art and science.', 'the most exciting phrase to hear in science the one that heralds new discoveries is not \'eureka!\' but \'that\'s funny...\'', 'the most exciting phrase to hear in science the one that heralds the most discoveries is not \'eureka!\' but \'that\'s funny...\'', 'the most important goal of education is to pursue the ultimate purpose of life to achieve success with happiness.', 'the most important key to achieving great success is to decide upon your goal and launch get started take action move.', 'the most important point: that the universe is governed by a set of rational laws that we can discover and understand.', 'the natural order of life is not the thinking and imagination but living in the moment with absolute trust.', 'the nice part about being a pessimist is that you are constantly being either proven right or pleasantly surprised.', 'the nice thing about being a celebrity is that if you bore people they think it\'s their fault.', 'the object of life is not to be on the side of the majority but to escape finding oneself in the ranks of the insane.', 'the one who falls and gets up is stronger than the one who never tried. do not fear failure but rather fear not trying.', 'the only true test of values either of men or of things is that of their ability to make the world a better place in which to live.', 'the only way of discovering the limits of the possible is to venture a little way past them into the impossible.', 'the optimist says the glass is half full the pessimist say the glass is half empty the engineer says the glass is too large.', 'the overlooked expert is the person who\'s fully capable of starting and running a profitable business.', 'the person born with a talent they are meant to use will find their greatest happiness in using it.', 'the person who makes a success of living is the one who sees his goal steadily and aims for it unswervingly. that is dedication.', 'the place to improve the world is first in one\'s own heart and head and hands and then work outward from there.', 'the power of accurate observation is frequently called cynicism by those who don\'t have it.', 'the present contains nothing more than the past and what is found in the effect was already in the cause.', 'the present is a rope stretched over the past. the secret to walking it is you never look down.', 'the problem with people is they forget that most of the time it\'s the small things that count.', 'the pursuit of truth and beauty is a sphere of activity in which we are permitted to remain children all our lives.', 'the real and legitimate goal of the sciences is the endowment of human life with new commodities.', 'the real trouble with war modern war is that it gives no one a chance to kill the right people.', 'the reason so few people are successful is no one has yet found a way for someone to sit down and slide uphill.', 'the right idea at the right time is like a dandelion... you may hack it down but you only spread the seeds abroad.', 'the scientific method is nothing more than a system of rules to keep us from lying to each other.', 'the scientific theory i like best is that the rings of saturn are composed entirely of lost airline luggage.', 'the scientist and engineers who are building the future need the poets to make sense of it.', 'the scientist only imposes two things namely truth and sincerity imposes them upon himself and upon other scientists.', 'the significant problems of our time cannot be solved by the same level of thinking that created them.', 'the significant problems we have cannot be solved at the same level of thinking with which we created them.', 'the signs of the zodiac are karmic patterns; the planets are the looms; the will is the weaver.', 'the single most powerful element of youth is that you don\'t have the life experiences to know what can\'t be done.', 'the soul is placed in the body like a rough diamond and must be polished or the lustre of it will never appear.', 'the state of that man\'s mind who feels too intense an interest as to future events must be most deplorable.', 'the surest way of concealing from others the boundaries of one\'s own knowledge is not to overstep them.', 'the thing that doesn\'t fit is the thing that\'s the most interesting: the part that doesn\'t go according to what you expected.', 'the three great essentials of success are first try; second try again; and third keep trying.', 'the time is near at hand which must determine whether americans are to be free men or slaves.', 'the time to be happy is now. the place to be happy is here. the way to be happy is to make others so.', 'the ultimate reason for setting goals is to entice you to become the person it takes to achieve them.', 'the universe doesn\'t give you what you ask for with your thoughts - it gives you what you demand with your actions.', 'the universe is like a safe to which there is a combination - but the combination is locked up in the safe.', 'the unrecorded past is none other than our old friend the tree in the primeval forest which fell without being heard.', 'the way to wealth is as plain as the road to market. it depends chiefly on two words industry and frugality.', 'the wish to believe even against evidence fuels all the pseudosciences from astrology to creationism.', 'the world can only be grasped by action not by contemplation. the hand is the cutting edge of the mind.', 'the world is moving so fast these days that the man who says it can\'t be done is generally interrupted by someone doing it.', 'the world keeps happening in accordance with its rules; it\'s up to us to make sense of it and give it value.', 'the world keeps on spinning repeating itself over and over until something changes which it doesn\'t because we can\'t.', 'the world must be made safe for democracy. its peace must be planted upon the tested foundations of political liberty.', 'the worlds of our solar system are widely different but all share a common gravitational tie to the sun.', 'the youth of america is their oldest tradition. it has been going on now for three hundred years.', 'there are to ways to pass a hurdle: leaping over or plowing through. there needs to be a monster truck option.', 'theirs a nowledge tath is beynod teh mnid adn the intellect it is the wisdum of consciousness.', 'there are always sides. there is always a winner and a loser. for every person who gets there\'s someone who must give.', 'there are eight planets unless of course you still count pluto in which case there are nine million planets.', 'there are in fact two things science and opinion; the former begets knowledge the later ignorance.', 'there are in fact two things science and opinion; the former begets knowledge the latter ignorance.', 'there are no classes in life for beginners: right away you are always asked to deal with what is most difficult.', 'there are no secrets to success. it is the result of preparation hard work and learning from failure.', 'there are people whose watch stops at a certain hour and who remain permanently at that age.', 'there are some choices you can only make once. you can\'t go back to where you made a choice and then take the other one.', 'there are souls in this world who have the gift of finding joy everywhere and leaving it behind them when they go.', 'there are those who reason well but they are greatly outnumbered by those who reason badly.', 'there are two ways to live your life. one is as though nothing is a miracle. the other is as though everything is a miracle.', 'there came a time when you realized that moving on was pointless. that you took yourself with you wherever you went.', 'there comes a time in your life when you have to choose to turn the page write another book or simply close it.', 'there could be whole antiworlds and antipeople made out of antiparticles. however if you meet your antiself don\'t shake hands!', 'there is a certain seductiveness about dead things. you can ill treat alter and recolour what\'s dead. it won\'t complain.', 'there is a gap between dreams and reality. don\'t fear this gap but zap it with action persistence and perseverance.', 'there is a loftier ambition than merely to stand high in the world. it is to stoop down and lift mankind a little higher.', 'there is a looming chasm between what your brain knows and what your mind is capable of accessing.', 'there is a very easy way to return from a casino with a small fortune: go there with a large one.', 'there is an art to science and science in art; the two are not enemies but different aspects of the whole.', 'there is no good in arguing with the inevitable. the only argument available with an east wind is to put on your overcoat.', 'there is no great invention from fire to flying which has not been hailed as an insult to some god.', 'there is no meaning to life except the meaning man gives his life by unfolding of his powers.', 'there is no passion to be found playing small - in settling for a life that is less than the one you are capable of living.', 'there is no science in creativity. if you don\'t give yourself room to fail you won\'t innovate.', 'there is no such thing as a child who hates to read; there are only children who have not found the right book.', 'there is no u-turn in life what is done is done what you have missed you missed. you can\'t go back and revisit it', 'there is no way that we can predict the weather six months ahead beyond giving the seasonal average', 'there is nothing in the path of life that we don\'t already know before we start. nothing is learned; it is simply remembered.', 'there is nothing like desire for preventing the thing one says from bearing any resemblance to what one has in mind.', 'there is nothing ridiculous in seeming to be what you really are but a good deal in affecting to be what you are not.', 'there is nothing that will kill a man so soon as having nobody to find fault with but himself.', 'there is one other reason for dressing well namely that dogs respect it and will not attack you in good clothes.', 'there is real magic in enthusiasm. it spells the difference between mediocrity and accomplishment.', 'there is something incredibly nostalgic and significant about the annual cascade of autumn leaves.', 'there is something particularly human about using tools; the first and most important tool being language.', 'there is strange comfort in knowing that no matter what happens today the sun will rise again tomorrow.', 'there was beauty in the idea of freedom but it was an illusion. every human heart was chained by love.', 'there was nothing to be ashamed of in doing jobs simply to make a living so long as those jobs fueled other creative efforts', 'there\'s a common myth that evidence speaks for itself. it doesn\'t. it just sits there on the lab table incapable of speaking.', 'there\'s a limit to how many times you can read how great you are and what an inspiration you are but i\'m not there yet.', 'there\'s joy in every circumstance. the beginning is bitter but in between there are valuable lessons that bring joy.', 'there\'s no tragedy in life like the death of a child. things never get back to the way they were.', 'they say i\'m old-fashioned and live in the past but sometimes i think progress progresses too fast!', 'they say that not matter how old you become when you are with your siblings you revert back to childhood.', 'things get done only if the data we gather can inform and inspire those in a position to make difference.', 'think big and don\'t listen to people who tell you it can\'t be done. life\'s too short to think small.', 'this bright new year is given me to live each day with zest to daily grow and try to be my highest and my best!', 'this college would probably have the same problem as the last one did.\"i frowned \"what\'s that?\"\"homework.', 'this i conceive to be the chemical function of humor - to change the character of our thought.', 'those irritations and uneasiness you are faced with are evidence that you have an assignment to fulfill.', 'those things which i am saying now may be obscure yet they will be made clearer in their proper place.', 'those who fight for social justice and the rights of people will count any other thing as unimportant.', 'thoughtful men must feel that the fate of civilization upon this continent is involved in the issue of our contest.', 'three things have a limited threshold: time pain and death. while truth love and knowledge \'', 'throughout my life i have not done things just because somebody deemed important; this why i am successful today.', 'thyme and space - thyme two bee alone space two move about - these may well bee the grate scarcities of tomorrow', 'time is the real emperor and there is no space for any pride since time flies and blows away anything.', 'time is the single most important resource that we have. every single minute we lose is never coming back.', 'to be humane we must ever be ready to pronounce that wise ingenious and modest statement \'i do not know\'.', 'to find a mountain path all by oneself gives a greater feeling of strength than to take a path that is shown.', 'to love someone deeply gives you strength. being loved by someone deeply gives you courage.', 'to me there has never been a higher source of earthly honor or distinction than that connected with advances in science.', 'to me mathematics computer science and the arts are insanely related. they\'re all creative expressions.', 'to protect themselves the weak focus on the \"bad\" in people. conversely the strong who fear little focus on the \"good\".', 'to some extent it is almost blasphemous to think that insult anger and irritation could be a positive force.', 'to test a perfect theory with imperfect instruments did not impress the greek philosophers as a valid way to gain knowledge.', 'too many people seem to believe that silence was a void that needed to be filled even if nothing important was said.', 'too often people get stuck in a state of overthinking the result is that they never reach a decision.', 'treat everyone in every situation with kindness; it is the ultimate purpose and wisdom of life.', 'trees make me beleve taht wee can also renew and reshape hour lives know madder wat wee face inn lyfe', 'trees make me believe that we can also renew and reshape our lives no matter what we face in life.', 'trust your inner guidance and follow your heart for your soul has your blueprint and the universe has your back.', 'truth ain\'t be in secret site to be found. it lies within certain levels of understanding and knowledge.', 'truth ain\'t bee inn secret site two bee found. it lies within certain levels of under standign and now ledge.', 'two snowmen in a field one turned to the other and said \"i don\'t know about you but i can smell carrots!\"', 'two things prevent you from becoming a success: dwelling in the past with regret and following others blindly.', 'uh hall mark of siecnce is seting out two discoevr won thing and then discovering somthin else.', 'uh strate face and a sincere sounding \"huh?\" have gotten meow of more trouble than eye can remember.', 'unlocking some secrets of the universe needs thinking in terms of energy frequency and vibration.', 'until you deal with the core of the problemnothing changes. life is about choices; choices make a change.', 'upon achieving a lifelong dream i thought this is the way to live your life -- in the moment and to the fullest.', 'victories that are easy are cheap. those only are worth having which come as the result of hard fighting.', 'waiting around to be perfect never amounts to anything. don\'t be a waiter or you\'ll be serving other people.', 'waiting to develop courage is just another form of procrastination. the most successful people take action while they\'re afraid!', 'war is the statesman\'s game the priest\'s delight the lawyer\'s jest the hired assassin\'s trade.', 'watt ever is at teh centa of hour life will bee teh source of hour securaty guidance wiz dumb and power', 'we all as engineers doctors have a big responsibility to bring smiles on the faces of suffering humanity.', 'we are continually faced with a series of great opportunities brilliantly disguised as insoluble problems.', 'we are so busy teaching small things about life to children that we forget to learn big things from them.', 'we are the sum of all people we have ever met; you change the tribe and the tribe changes you.', 'we believe in ordinary acts of bravery in the courage that drives one person to stand up for another.', 'we can prostrate ourselves in the dust when we have committed a fault but it is not best to remain there.', 'we delight in the beauty of the butterfly but rarely admit the changes it has gone through to achieve that beauty.', 'we don\'t have to be thankful for an adverse situation but we can be thankful for all the good things that sustain us.', 'we each exist for but a short time and in that time explore but a small part of the whole universe', 'we especially need imagination in science. it is not all mathematics nor all logic but it is somewhat beauty and poetry.', 'we feel that even if all possible scientific questions be answered the problems of life have still not been touched at all.', 'we hate to have some people give us advice because we know how badly they need it themselves.', 'we have all a better guide in ourselves if we would attend to it than any other person can be.', 'we have normality. i repeat we have normality. anything you still can\'t cope with is therefore your own problem.', 'we long for permanence but everything in the known universe is transient. that\'s a fact but one we fight.', 'we may place blame give reasons and even have excuses; but in the end it is an act of cowardice to not follow your dreams.', 'we must understand the cosmos as it is and not confuse how it is with how we wish it to be.', 'we prepare ourselves for sudden deeds by the reiterated choice of good or evil that gradually determines character.', 'we\'re seeing the arrival of conversational robots that can walk in our world. it\'s a golden age of invention.', 'we\'re so busy watching out for what\'s just ahead of us that we don\'t take time to enjoy where we are.', 'we\'ve lost all geographical frontiers on earth but new and far larger ones exist at earth\'s doorstep.', 'we\'ve made great medical progress in the last generation. what used to be merely an itch is now an allergy.', 'what are the odds that you are the first generation of humans who will understand reality ?', 'what can be more important than the science of life to any intelligent being who has the good fortune to be alive?', 'what does it matter? science has achieved some wonderful things of course but i\'d far rather be happy than right any day.', 'what i call a good patient is one who having found a good physician sticks to him till he dies.', 'what i love about science is that as you learn you don\'t really get answers. you just get better questions.', 'what lies behind us and what lies before us are tiny matters compared to what lies within us.', 'what should scare you is not knowing what you don\'t know. always be eager to learn for knowledge is power.', 'what would you get if you crossed a athlete and the invisible man? sports like no one has ever seen.', 'what you do makes a difference and you have to decide what kind of difference you want to make.', 'what you have told us is rubbish. the world is really a flat plate supported on the back of a giant tortoise.', 'whatever else astronomy may or may not be who can doubt it to be the most beautiful of the sciences?', 'whee our the cosmos made conchus and lief is teh measn by witch the uinverse undertsands istelf.', 'when a distinguished but elderly scientist states that something is possible he is almost certainly right.', 'when a stone is dropped into a pond the water continues quivering even after the stone has sunk to the bottom.', 'when a true genius appears in the world you may know him by this sign that the dunces are all in confederacy against him.', 'when an idea reaches critical mass there is no stopping the shift its presence will induce.', 'when i hear music i fear no danger. i am invulnerable. i see no foe. i am related to the earliest times and to the latest.', 'when in a frying pan thank your stars. you will reminisce about it moments later when you fall in the fire.', 'when it rains it pours. maybe the art of life is to convert tough times to great experiences: we can choose to hate the rain or dance in it.', 'when once the itch of literature comes over a man nothing can cure it but the scratching of a pen.', 'when people think about computer science they imagine people with pocket protectors and thick glasses who code all night.', 'when science finally locates the center of the universe some people will be surprised to learn they\'re not it.', 'when seeing life for what it is becomes more important than seeing it your way you\'ll finally understand what courage means.', 'when the going gets tough put one foot in front of the other and just keep going. don\'t give up.', 'when the grass looks greener on the other side of the fence it may be that they take better care of it there.', 'when things are at their blackest i say to myself \'cheer up things could be worse.\' and sure enough they get worse.', 'when we look up at night and view the stars everything we see is shinning because of distant nuclear fusion.', 'when what you are insulted by meets what you have a strong desire to do then that would bring you significance.', 'when you become the image of your own imagination it\'s the most powerful thing you could ever do.', 'when you have a group of engineers and designers they are not exactly the best to deal with copyright law.', 'when you look up at the sky you have a feeling of unity which delights you and makes you giddy.', 'when you open your mind you open new doors to new possibilities for yourself and new opportunities to help others.', 'when your children are teenagers it\'s important to have a dog so that someone in the house is happy to see you.', 'where the facts themselves are highly interesting the explanation of them must be still more so.', 'whether we like it or not modern ways are going to alter and in part destroy traditional customs and values.', 'whoever holds the keys to house of knowledge must open the door for those who search for light of knowledge to enter.', 'whoever is careless with the truth in small matters cannot be trusted with important matters', 'whoever would overthrow the liberty of a nation must begin by subduing the freeness of speech.', 'why do shepherds never learn to count? because if they did they would always be falling asleep.', 'why does someone who runs marathons make a good student? because education pays off in the long run!', 'with time we learn that the things we\'re better off without have the ability to lead us somewhere better than we were before.', 'with words at your disposal you can see more clearly. finding the words is another step in learning to see.', 'without ambition one starts nothing. without work one finishes nothing. the prize will not be sent to you. you have to win it.', 'words have an immeasurable impact they can either build or destroy so be careful of your words.', 'yesterday i was clever so i wanted to change the world. today i am wise so i am changing myself.', 'yoga is an exact science in the form of poetry when we measure the flow of neurotransmitters in the brain.', 'you are today where your thoughts have brought you; you will be tomorrow where your thoughts take you.', 'you aren\'t doing \"nothing\" when you choose to put your wellbeing first. in fact this is the key to having everything.', 'you can do only one thing at a time. i simply tackle one problem and concentrate all efforts on what i am doing at the moment.', 'you cannot score a goal when you are sitting on the bench. to do so you have to dress up and enter the game.', 'you can\'t destroy knowledge. you can stamp it under and burn it up and forbid it to be but somewhere it will survive.', 'you can\'t know a father. they\'re all magicians. got two million years of strings and mirrors in their pockets.', 'you can\'t learn too soon that the most useful thing about a principle is that it can always be sacrificed to expediency.', 'you can\'t teach anybody anything only make them realize the answers are already inside them.', 'you could not erase everything that caused you pain with recollection. every memory was valuable; even the bad ones', 'you got to insist on your success resist every obstacle and persist in times of difficulty and you will get there.', 'you lose nothing when fighting for a cause. in my mind the losers are those who don\'t have a cause they care about.', 'you move forward. you face up to your challenges. you don\'t retreat. you\'re young and sometimes you\'ll wish you could. but don\'t.', 'you need to spend time crawling alone through shadows to truly appreciate what it is to stand in the sun.', 'you never change your life until you step out of your comfort zone; change begins at the end of your comfort zone.', 'you only have to do a very few things right in your life so long as you don\'t do too many things wrong.', 'you see my ambition was not to confound the engineering world but simply to create a beautiful piece of art.', 'you\'d think that with nsa reading our tweets all the time they could star or retweet some of the good ones.', 'your assumptions are your windows on the world. scrub them off every once in a while or the light won\'t come in.', 'your life isn\'t behind you; your memories are behind you. your life is always ahead of you. today is a new day - seize it!', 'your mission or purpose is like a magnet that keeps you moving is a well established direction', 'your ordinary acts of love and hope point to the extraordinary promise that every human life is of inestimable value.', 'you\'re no good unless you are a good assistant; and if you are you\'re too good to be an assistant.', 'you\'ve got to make a conscious choice every day to shed the old - whatever \'the old\' means for you.', 'an attitude of gratitude is the best outfit to wear when you\'re looking for success and happiness.', 'do you realize how hard it is to keep your mind clear when somebody\'s telling you to keep your mind clear?', 'i think the essence of wisdom is emancipation as far as possible from the tyranny of the here and now.', 'lyrical poetry is much the same in every age as the songs of the nightingales in every spring-time.', 'my theory is that if you look confident you can pull off anything - even if you have no clue what you\'re doing.', 'nobody with style measures success in money. they measure it on the good impact they have on others.', 'there is as much eloquence in the tone of voice in the eyes and in the air of a speaker as in his choice of words.', 'the role of science should be to investigate the unexplained not explain the uninvestigated.', 'whenever something bad happens keep calm take a few deep breaths and shift the focus to something positive.', 'reflect upon your present blessings of which every man has plenty; not on your past misfortunes of which all men have some.', 'anyone who thinks onions are the only vegetable that can make you cry has never dropped a cabbage on their toe.', 'do just once what others say you can\'t do and you will never pay attention to their limitations again.', 'gravity explains the motions of the planets but it cannot explain who sets the planets in motion.', 'i read recipes the same way i read science fiction. i get to the end and i think well that\'s not going to happen.', 'i think of myself as a bad writer with big ideas but i\'d rather be that than a big writer with bad ideas.', 'selfishness is that detestable vice which no one will forgive in others and no one is without in himself.', 'the constant man loses not his virtue in misfortune. a torch may point towards the ground but its flame will still point upwards.', 'to me all research is exploring the universe understanding it deeper one finding at a time.', 'you are not born with knowledge; you have to learn it. you are not born with wisdom; you have to earn it.', 'education makes a people easy to lead but difficult to drive; easy to govern but impossible to enslave.', 'every evil to which we do not succumb is a benefactor; we gain the strength of the temptation we resist.', 'i didn\'t go to the moon i went much further. for time is the longest distance between two places.', 'inflict not on an enemy every injury in your power for he may afterwards become your friend.', 'one needs to be slow to form convictions but once formed they must be defended against the heaviest odds.', 'projects we have completed demonstrate what we know - future projects decide what we will learn.', 'there is more mental health cure found in a pile of dirt than in all the behavioral therapy and drugs in modern medical science.', 'we have to go for what we think we\'re fully capable of not limit ourselves by what we\'ve been in the past.', 'when you have a number of disagreeable duties to perform always do the most disagreeable first.', 'you don\'t get strong by standing at the finish line you get strong with every step you take to get there.', 'adults are always asking little kids what they want to be when they grow up because they\'re looking for ideas.', 'all ambitions are lawful except those which climb upwards on the miseries or credulities of mankind.', 'covetousness like jealousy when it has once taken root never leaves a man but with his life.', 'even if yesterday was wildly successful i still don\'t want to repeat it. rather i want to build on it.', 'it\'s always a good idea to make friends with babies. that\'s free cake once a year for a lifetime.', 'life is beautiful. cherish every moment appreciate what you have and find joy in the present.', 'look forward to failure. fail quickly. if it does not start with failure it is probably not meant to be', 'our mistakes when met with awareness and personal responsibility are actually what introduces us to our best selves.', 'people often belittle the place where they were born but heaven can be found in the most unlikely places.', 'stop waiting for the perfect day or the perfect moment. take this day this moment and lead it to perfection.', 'there is no such thing as work-life balance. everything worth fighting for unbalances your life.', 'your life is your story so make choices that will write it the way you want it to be written', 'all you have to do is put one word after another and remember how great it feels to be a writer.', 'an act of kindness may take only a moment of our time but when captured in the heart the memory lives forever.', 'by nothing do men more show what they are than by their appreciation of what is and what is not ridiculous.', 'emotions such as disappointments or regrets after failures may be common but trying again and again will overcome these feelings.', 'if you want to be seen stand up. if you want to be heard speak up. if you want to be appreciated shut up.', 'it is better to remain silent at the risk of being thought a fool than to speak and remove all doubt', 'most people when they come to you for advice come to have their own opinions strengthened not corrected.', 'no human investigation can be called real science if it cannot be demonstrated mathematically.', 'remember happiness doesn\'t depend upon who you are or what you have; it depends solely on what you think.', 'you are what you believe you are. your thoughts become reality. i can and i will should always be your mentality.', 'a great soul is proof against injustice pain and mockery; and it would be invulnerable if it were not open to compassion.', 'be the kind of person who dares to face life\'s challenges and overcome them rather than dodging them.', 'everything you invent is true: you can be sure of that. poetry is a subject as precise as geometry.', 'i\'m a success today because i had a friend who believed in me and i didn\'t have the heart to let him down.', 'i was bold in the pursuit of knowledge never fearing to follow truth and reason to whatever results they led.', 'live life as though nobody is watching and express yourself as though everyone is listening.', 'success is not about achieving perfection; it\'s about making progress and learning from failures.', 'the greatest happiness you can have is knowing that you do not necessarily require happiness.', 'the most incredible service you can render to yourself is to clearly define why you are here and live it out.', 'we had to start somewhere either succeed or fail and then build what we knew as we went along.', 'a focused man will walk a straighter path to all his successes and therefore will have more to gain.', 'anyone who writes about science must know about science which cuts down competition considerably.', 'charity is the temple of which justice is the foundation but you can\'t have the top without the bottom.', 'having somebody help you doesn\'t mean that you have failed. it just means that you\'re not in it alone', 'make yourself an honest man and then you may be sure that there is one rascal less in the world.', 'my daughter told me she wants to be a secret agent. based on that alone i don\'t think she\'d be a good secret agent.', 'only start something if you intend to finish it otherwise it is going to be a waste of resources.', 'poetry was given to us to hide the little discords of life and to make man contented with the world and his condition.', 'the older i get the more i start to think that life is something to experience not a game to win or lose', 'what we think determines what happens to us so if we want to change our lives we need to stretch our minds.', 'apparently saying \"wow you\'ve grown since i last saw you\" isn\'t deemed socially acceptable when said to adults.', 'every great genius has a special vocation and when he has fulfilled it he is no longer needed.', 'in many ways being happy is the culmination of many other states of being such as feeling calm pleasure satisfaction and joy.', 'i try to stay in a constant state of confusion just because of the expression it leaves on my face.', 'i was talking aloud to myself. a habit of the old: they choose the wisest person present to speak to', 'most men make little other use of their speech than to give evidence against their own understanding.', 'the trouble with unemployment is that the minute you wake up in the morning you\'re on the job.', 'every joy that comes to us is only to strengthen us for some greater labor that is to succeed.', 'it is only the finite that has wrought and suffered; the infinite lies stretched in smiling repose.', 'i want to be something really scary for halloween this year so i\'m dressing up as a phone battery at two percent.', 'mathematics is a game played according to certain simple rules with meaningless marks on paper.', 'our greatest weakness lies in giving up. the most certain way to succeed is always to try just one more time.', 'success is not guaranteed but neither is failure. take a chance and see where it leads you.', 'the circumstances surrounding your birth is not as important as the opportunity to live life.', 'yes vanity is a weakness indeed. but pride - where there is a real superiority of mind pride will be always under good regulation.', 'friendship is the only thing in the world concerning the usefulness of which all mankind are agreed.', 'if you can show people how to build castles make sure you do not neglect building and nurturing your own.', 'i\'ve never been very good at geography. but i can name at least one city in france which is nice.', 'one of the most rewarding things that you can do in life is to help someone unconditionally.', 'speed is not always a constituent to great work the process of creation should be given time and thought.', 'there are a lot of things i wish i would have done instead of just sitting around and complaining about having a boring life.', 'there are moments on stage when everything comes together. then the kid in the front row coughs.', 'the successful entrepreneur manages to strike the right balance between preservation and renewal.', 'you can see it but it\'s not really there. just like the end of a rainbow the horizon is an illusion.', 'beauty is about being comfortable in your own skin. it\'s about knowing and accepting who you are.', 'climbing to the top demands strength whether it is to the top of mount everest or to the top of your career.', 'every age has a kind of universal genius which inclines those that live in it to some particular studies.', 'everyone wants to live on top of the mountain but all the happiness and growth occurs while you\'re climbing it.', 'every traveller has a home of his own and he learns to appreciate it the more from his wandering.', 'one of the chief triumphs of modern mathematics consists in having discovered what mathematics really is.', 'success is focusing the full power of all you are on what you have a burning desire to achieve.', 'we live out our lives as we are meant to live them. with some choice with some chance but mostly as a result of the persons we are.', 'yes victory is sweet but it doesn\'t necessarily make life any easier the next season or even the next day.', 'america is a large friendly dog in a small room. every time it wags its tail it knocks over a chair.', 'big fires flare up in a wind but little ones are blown out unless they are carried in under cover.', 'if you want to achieve anything you must first see the result in your own mind before it will become a reality.', 'most people are paralyzed by fear. overcome it and you take charge of your life and your world.', 'somehow difficulties are easier to endure when you know your dream is waiting for you at the end.', 'what a person praises is perhaps a surer standard even than what he condemns of his own character information and abilities.', 'what drives a teacher is never what lies behind. at the heart of teaching is hope and hope looks forward.', 'a huge dog tied by a chain was painted on the wall and over it was written in capital letters \'beware of the dog.\'', 'a universe that can be easily understood would logically be too simple to evolve into beings capable of understanding it.', 'doing things that you are not supposed to do at work makes your vision hearing and alertness much better.', 'having what you want may give you achievement. but wanting what you have will give you fulfillment.', 'i\'ve never once been able to explain my car trouble to a mechanic without resorting to sound effects.', 'music is the only one of the fine arts in which not only man but all other animals have a common property.', 'oh what a feeling when you happen upon a book that seems to pour truth directly into your head.', 'we have inherited from our forefathers the keen longing for unified all-embracing knowledge.', 'anyone who wanted to sell fish had to get permission from grandpa. he was known as the cod father.', 'a scientist can discover a new star but he cannot make one. he would have to ask an engineer to do that.', 'courage doesn\'t bring you success but it lets you persist to face adversity with boldness and poise.', 'i have made this letter a rather long one only because i had not the leisure to make it shorter.', 'let us attend to the present and as to the future we shall know how to manage when the occasion arrives.', 'life shows us a mirror at various stages. it is up to us whether to learn from the reality in the reflection or to sulk at its ugliness', 'when i was young i was afraid of the dark. now when i get my electric bill i am afraid of the light.', 'your past including your failures simply offers feedback that makes you wiser and stronger than before.']));
var $author$project$Data$randomLongQuote = function (r) {
	var q = A2(
		$elm$core$Maybe$withDefault,
		'a perfect quote',
		function (i) {
			return A2($elm$core$Array$get, i, $author$project$Data$longQuotes);
		}(
			A2(
				$author$project$Extra$randomIdx,
				r,
				$elm$core$Array$length($author$project$Data$longQuotes))));
	return q;
};
var $author$project$Data$quotes = $elm$core$Array$fromList(
	_List_fromArray(
		['pencils and quadrille pads', 'all flourishing is mutual', 'a goal without a plan is just a wish', 'a library is more precious than a bank', 'a library is thought in cold storage', 'a man is known by the books he reads', 'a penny saved is a penny earned', 'a stumble may prevent a fall', 'a true friend is the best possession', 'a witty saying proves nothing', 'achievement has no color', 'action expresses priorities', 'affection is catching', 'aim higher in case you fall short', 'all knowledge is worth having', 'all the funs in how you say a thing', 'always do what you are afraid to do', 'an artist is his own fault', 'anything worthy is worth the fight', 'art is science made clear', 'assertion is not proof', 'awake arise or be for ever falln', 'baking is both an art and a science', 'be so good they cant ignore you', 'birds dont eat canned worms', 'books are a uniquely portable magic', 'books do furnish a room', 'but what is life if you dont live it', 'can we survive technology', 'cleverness is not wisdom', 'conflicts are expensive', 'conflicts have small beginnings', 'darkness feeds on apathy', 'do you need space join nasa', 'dont act your role be yourself', 'dont just listen understand it', 'dont just wish for success earn it', 'dont spell part backwards its a trap', 'dont try to fix me im not broken', 'encourage your own greatness', 'enough talk now read', 'even a child is known by his doings', 'excuse me while i succeed', 'failure has its successes', 'fake life is expensive', 'find a voice in a whisper', 'fortune assists the bold', 'give me a museum and ill fill it', 'gravity always wins', 'habit is ten times nature', 'happiness is answering your calling', 'happiness lies in hope', 'happy is as happy does', 'hardships make or break people', 'he who is good is happy', 'helpfulness is the enemy of greed', 'history is a great dust heap', 'i am not omniscient but i know a lot', 'i am the captain of my soul', 'i dont like lollipops', 'i dwell in possibility', 'i know certain truths about life', 'i only know that i know nothing', 'i think that success is having fun', 'i worship the quicksand he walks in', 'ideas shape the course of history', 'if obstacles are large jump higher', 'if we listen we shall learn', 'if you cant win by reason go for volume', 'if you dont laugh youll cry', 'if you want to be happy be', 'im in the mood to multiply', 'im not stubborn my way is just better', 'imagine others complexly', 'in all things give thanks', 'in order to fail you must try first', 'its always too soon to quit', 'its not over until you win', 'its pretty confusing', 'ive got nothing to do today but smile', 'just be yourself there is no one better', 'keep calm and eat cookies', 'know what youre talking about', 'knowledge is power as well as fame', 'knowledge is strength', 'knowledge not shared remains unknown', 'leaders prioritize what they want', 'lets get things straight', 'life is a journey worth making', 'life is like a box of chocolates', 'life is more fun if you play games', 'living is more than just a pulse', 'living is my job and my art', 'love is the absence of judgment', 'luck is believing youre lucky', 'make today worth remembering', 'man is a toolmaking animal', 'math puns are the first sine of madness', 'may success knock your door always', 'meow means woof in cat', 'momentum builds success', 'more matter with less art', 'morning will come it has no choice', 'my geekness is aquivering', 'my main focus is on my game', 'mystery is never disproof', 'never confuse belief with knowledge', 'never fire a laser at a mirror', 'never follow the crowd', 'never forget your past', 'never ruin an apology with an excuse', 'nothing is fun until youre good at it', 'of all things i liked books best', 'ok so whats the speed of dark', 'once i get on a puzzle i cant get off', 'one can never have enough socks', 'one planet one experiment', 'order is heavens first law', 'our future is up to us', 'our true mentor in life is science', 'peace begins when expectations end', 'people are sheep tv is the shepherd', 'perfect is the enemy of good', 'perfection is an undiscovered jewel', 'quiet people have the loudest minds', 'reach for the stars', 'said sirius seriously', 'science doesnt take sides does it', 'science is magic that works', 'science is organized knowledge', 'science is the poetry of reality', 'shut your eyes and see', 'snoring keeps the monsters away', 'somewhere the zebra is dancing', 'start small and keep going', 'storms make trees take deeper roots', 'success is a decision not a gift', 'that was the week that was', 'the beautiful is always bizarre', 'the book you dont read wont help', 'the gods too are fond of a joke', 'the greatest ideas are the simplest', 'the medium is the message', 'the only joy in the world is to begin', 'the past can not be cured', 'the perfect is the enemy of the good', 'the present is a point just passed', 'the purpose of fun is to live it', 'the river is everywhere', 'the universe in a nutshell', 'there was i found always more to learn', 'think with your whole body', 'this book fills a muchneeded gap', 'those who dont jump will never fly', 'to be a success think of happiness', 'to be noble help others to succeed', 'to be too knowing is a downfall', 'to have hope is to be happy', 'to live is to be haunted', 'to those who will see the world waits', 'too many locks not enough keys', 'travel far enough you meet yourself', 'unbeing dead isnt being alive', 'universe consists of frozen light', 'we cannot just live any how', 'we convince by our presence', 'we made too many wrong mistakes', 'we must work while we have strength', 'we need no language to laugh', 'well done is better than well said', 'what dog cant bark a hot dog', 'what is a rebel a man who says no', 'what we think we become', 'which was to be proved', 'who can count the sand by the sea', 'whose life is it anyway', 'why dont you light that candle', 'why learn and innovate', 'wisdom is the daughter of experience', 'without knowledge we are weak', 'wonder is the seed of knowledge', 'written words can also sing', 'you can know a lot and still be stupid', 'you cannot predict the future', 'you may delay but time will not', 'your story is important', 'fortune does not change nature', 'the only journey is the one within', 'without hope there we fail to be happy', 'a good king is a public servant', 'good manners are part of good morals', 'patience is the key of content', 'some things better left unspoken', 'better ask twice than go wrong once', 'out of clutter find simplicity', 'glory is the reward of victory', 'peace is liberty in tranquility', 'age is a matter of feeling not of years', 'light not your candle at both ends', 'you cannot see beauty you feel it', 'let my honour be without stain', 'understanding develops slowly', 'necessity unites hearts', 'better leave than lack', 'boldness is an ill keeper of promise', 'boredom is the fear of self', 'a friend is a second self', 'nothing in this world happens by chance', 'distance lends enchantment to the view', 'how my achievements mock me', 'books are a life to ones soul', 'a mans fate is his own temper']));
var $author$project$Data$randomQuote = function (r) {
	var q = A2(
		$elm$core$Maybe$withDefault,
		'a perfect quote',
		function (i) {
			return A2($elm$core$Array$get, i, $author$project$Data$quotes);
		}(
			A2(
				$author$project$Extra$randomIdx,
				r,
				$elm$core$Array$length($author$project$Data$quotes))));
	return q;
};
var $author$project$Maker$createProblem = F2(
	function (problemInput, randomInput) {
		var q = (problemInput.aJ || ((problemInput.aC === 2) || (problemInput.aC === 3))) ? $author$project$Token$tokenize(
			$author$project$Data$randomLongQuote(randomInput.B)) : $author$project$Token$tokenize(
			$author$project$Data$randomQuote(randomInput.B));
		var fn = A2($author$project$Maker$getCreateProblemFn, problemInput.aC, randomInput);
		return A2(fn, randomInput, q);
	});
var $author$project$Interface$invalidLetter = {aB: '', aH: '', aI: $elm$core$Maybe$Nothing, ad: -1, aU: ''};
var $author$project$Extra$equalsIgnoreCase = F2(
	function (s1, s2) {
		return _Utils_eq(
			$elm$core$String$toUpper(s1),
			$elm$core$String$toUpper(s2));
	});
var $author$project$Interface$isGuessCorrect = function (l) {
	if (!l.$) {
		var d = l.a;
		var _v1 = d.aI;
		if (!_v1.$) {
			var g = _v1.a;
			return A2($author$project$Extra$equalsIgnoreCase, d.aU, g);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
var $author$project$Interface$mutateLetter = F2(
	function (fn, l) {
		if (!l.$) {
			var d = l.a;
			return $author$project$Interface$Interactive(
				fn(d));
		} else {
			var d = l.a;
			return $author$project$Interface$Punctuation(d);
		}
	});
var $author$project$Interface$mutateWord = F2(
	function (fn, w) {
		return _Utils_update(
			w,
			{
				aP: A2(
					$elm$core$List$map,
					$author$project$Interface$mutateLetter(fn),
					w.aP)
			});
	});
var $author$project$Interface$mutate = F2(
	function (fn, words) {
		return A2(
			$elm$core$List$map,
			$author$project$Interface$mutateWord(fn),
			words);
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$Left = {$: 3};
var $author$project$Main$Right = {$: 4};
var $author$project$Main$TableLetter = function (a) {
	return {$: 1, a: a};
};
var $author$project$Interface$getByIdxInWord = F2(
	function (idx, letters) {
		getByIdxInWord:
		while (true) {
			if (!letters.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var l = letters.a;
				var ls = letters.b;
				if (!l.$) {
					var d = l.a;
					if (_Utils_eq(d.ad, idx)) {
						return $elm$core$Maybe$Just(d);
					} else {
						var $temp$idx = idx,
							$temp$letters = ls;
						idx = $temp$idx;
						letters = $temp$letters;
						continue getByIdxInWord;
					}
				} else {
					var $temp$idx = idx,
						$temp$letters = ls;
					idx = $temp$idx;
					letters = $temp$letters;
					continue getByIdxInWord;
				}
			}
		}
	});
var $author$project$Interface$getByIdx = F2(
	function (idx, words) {
		getByIdx:
		while (true) {
			if (!words.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var w = words.a;
				var ws = words.b;
				var _v1 = A2($author$project$Interface$getByIdxInWord, idx, w.aP);
				if (_v1.$ === 1) {
					var $temp$idx = idx,
						$temp$words = ws;
					idx = $temp$idx;
					words = $temp$words;
					continue getByIdx;
				} else {
					var d = _v1.a;
					return $elm$core$Maybe$Just(d);
				}
			}
		}
	});
var $author$project$Main$onKeyDownInner = F2(
	function (s, guess_) {
		var setTableLetterIfMatch = function (d) {
			var _v1 = s.g;
			if (!_v1.$) {
				var selected = _v1.a;
				return ((!s.aJ) && _Utils_eq(selected.aH, d.aH)) ? A2($author$project$Interface$setGuess, guess_, d) : d;
			} else {
				var selected = _v1.a;
				return _Utils_eq(selected.ad, d.ad) ? A2($author$project$Interface$setGuess, guess_, d) : (((!s.aJ) && _Utils_eq(selected.aH, d.aH)) ? A2($author$project$Interface$setGuess, guess_, d) : d);
			}
		};
		var table_ = A2(
			$elm$core$Maybe$andThen,
			function (t) {
				return A2(
					$elm$core$Maybe$map,
					function (w) {
						return {aa: t.aa, ae: w.aP};
					},
					$elm$core$List$head(
						A2(
							$author$project$Interface$mutate,
							setTableLetterIfMatch,
							_List_fromArray(
								[
									{aP: t.ae}
								]))));
			},
			s.aY);
		var setProblemLetterIfMatch = function (d) {
			var _v0 = s.g;
			if (!_v0.$) {
				var selected = _v0.a;
				return _Utils_eq(selected.ad, d.ad) ? A2($author$project$Interface$setGuess, guess_, d) : (((!s.aJ) && _Utils_eq(selected.aH, d.aH)) ? A2($author$project$Interface$setGuess, guess_, d) : d);
			} else {
				var selected = _v0.a;
				return ((!s.aJ) && _Utils_eq(selected.aH, d.aH)) ? A2($author$project$Interface$setGuess, guess_, d) : d;
			}
		};
		var words_ = A2($author$project$Interface$mutate, setProblemLetterIfMatch, s.a0);
		return _Utils_update(
			s,
			{aY: table_, a0: words_});
	});
var $author$project$Main$onKeyDown = F2(
	function (s, op) {
		onKeyDown:
		while (true) {
			switch (op.$) {
				case 0:
					return s;
				case 1:
					var $temp$s = A2($author$project$Main$onKeyDownInner, s, $elm$core$Maybe$Nothing),
						$temp$op = $author$project$Main$Left;
					s = $temp$s;
					op = $temp$op;
					continue onKeyDown;
				case 2:
					var letter = op.a;
					var $temp$s = A2(
						$author$project$Main$onKeyDownInner,
						s,
						$elm$core$Maybe$Just(letter)),
						$temp$op = $author$project$Main$Right;
					s = $temp$s;
					op = $temp$op;
					continue onKeyDown;
				case 3:
					var _v1 = s.g;
					if (!_v1.$) {
						var selected = _v1.a;
						return A2(
							$elm$core$Maybe$withDefault,
							s,
							A2(
								$elm$core$Maybe$map,
								function (l_) {
									return _Utils_update(
										s,
										{
											g: $author$project$Main$ProblemLetter(l_)
										});
								},
								A2($author$project$Interface$getByIdx, selected.ad - 1, s.a0)));
					} else {
						var selected = _v1.a;
						return A2(
							$elm$core$Maybe$withDefault,
							s,
							A2(
								$elm$core$Maybe$map,
								function (l_) {
									return _Utils_update(
										s,
										{
											g: $author$project$Main$TableLetter(l_)
										});
								},
								A2(
									$elm$core$Maybe$andThen,
									$author$project$Interface$getByIdx(selected.ad - 1),
									A2(
										$elm$core$Maybe$map,
										function (t) {
											return _List_fromArray(
												[
													{aP: t.ae}
												]);
										},
										s.aY))));
					}
				default:
					var _v2 = s.g;
					if (!_v2.$) {
						var selected = _v2.a;
						return A2(
							$elm$core$Maybe$withDefault,
							s,
							A2(
								$elm$core$Maybe$map,
								function (l_) {
									return _Utils_update(
										s,
										{
											g: $author$project$Main$ProblemLetter(l_)
										});
								},
								A2($author$project$Interface$getByIdx, selected.ad + 1, s.a0)));
					} else {
						var selected = _v2.a;
						return A2(
							$elm$core$Maybe$withDefault,
							s,
							A2(
								$elm$core$Maybe$map,
								function (l_) {
									return _Utils_update(
										s,
										{
											g: $author$project$Main$TableLetter(l_)
										});
								},
								A2(
									$elm$core$Maybe$andThen,
									$author$project$Interface$getByIdx(selected.ad + 1),
									A2(
										$elm$core$Maybe$map,
										function (t) {
											return _List_fromArray(
												[
													{aP: t.ae}
												]);
										},
										s.aY))));
					}
			}
		}
	});
var $author$project$Main$Clear = {$: 1};
var $author$project$Main$Noop = {$: 0};
var $author$project$Main$Set = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$toKeyOp = function (val) {
	var keyChar = $elm$core$Char$fromCode(val);
	return ((val === 8) || (val === 46)) ? $author$project$Main$Clear : ((val === 37) ? $author$project$Main$Left : ((val === 38) ? $author$project$Main$Right : ((val === 39) ? $author$project$Main$Right : ((val === 40) ? $author$project$Main$Left : ($elm$core$Char$isAlpha(keyChar) ? $author$project$Main$Set(
		$elm$core$String$fromChar(
			$elm$core$Char$toUpper(keyChar))) : $author$project$Main$Noop)))));
};
var $author$project$Main$update = F2(
	function (msg, m) {
		switch (msg.$) {
			case 0:
				if (!m.$) {
					return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
				} else {
					var s = m.a;
					return _Utils_Tuple2(
						$author$project$Main$Ready(
							_Utils_update(
								s,
								{
									a0: A2($author$project$Interface$mutate, $author$project$Interface$clearGuess, s.a0)
								})),
						$elm$core$Platform$Cmd$none);
				}
			case 3:
				var code = msg.a;
				if (!m.$) {
					return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
				} else {
					var s = m.a;
					return _Utils_Tuple2(
						$author$project$Main$Ready(
							A2(
								$author$project$Main$onKeyDown,
								s,
								$author$project$Main$toKeyOp(code))),
						$elm$core$Platform$Cmd$none);
				}
			case 2:
				var input = msg.a;
				return _Utils_Tuple2(
					$author$project$Main$Loading,
					A2(
						$elm$random$Random$generate,
						$author$project$Main$NewProblem(input),
						$author$project$Main$generateRandomInput));
			case 4:
				var problemInput = msg.a;
				var randomInput = msg.b;
				var p = A2($author$project$Maker$createProblem, problemInput, randomInput);
				return _Utils_Tuple2(
					$author$project$Main$Ready(
						{
							s: 0,
							aC: p.aC,
							L: $elm$core$Maybe$Nothing,
							aJ: problemInput.aJ,
							aO: p.aO,
							g: $author$project$Main$ProblemLetter(
								A2(
									$elm$core$Maybe$withDefault,
									$author$project$Interface$invalidLetter,
									$elm$core$List$head(
										A2(
											$elm$core$List$filterMap,
											$author$project$Interface$tryGetLetterData,
											A2(
												$elm$core$List$concatMap,
												function (w) {
													return w.aP;
												},
												p.a0))))),
							G: false,
							N: $elm$core$Maybe$Nothing,
							aY: p.aY,
							a0: p.a0
						}),
					A2($elm$core$Task$perform, $author$project$Main$SetStartTime, $elm$time$Time$now));
			case 1:
				if (!m.$) {
					return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
				} else {
					var s = m.a;
					var solved = A2(
						$elm$core$List$all,
						$author$project$Interface$isGuessCorrect,
						A2(
							$elm$core$List$concatMap,
							function (w) {
								return w.aP;
							},
							s.a0));
					return _Utils_Tuple2(
						$author$project$Main$Ready(
							_Utils_update(
								s,
								{s: s.s + 1, G: solved})),
						solved ? A2($elm$core$Task$perform, $author$project$Main$SetEndTime, $elm$time$Time$now) : $elm$core$Platform$Cmd$none);
				}
			case 5:
				var selected = msg.a;
				if (!m.$) {
					return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
				} else {
					var s = m.a;
					return _Utils_Tuple2(
						$author$project$Main$Ready(
							_Utils_update(
								s,
								{g: selected})),
						$elm$core$Platform$Cmd$none);
				}
			case 6:
				var p = msg.a;
				if (!m.$) {
					return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
				} else {
					var s = m.a;
					return _Utils_Tuple2(
						$author$project$Main$Ready(
							_Utils_update(
								s,
								{
									N: $elm$core$Maybe$Just(p)
								})),
						$elm$core$Platform$Cmd$none);
				}
			case 7:
				var p = msg.a;
				if (!m.$) {
					return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
				} else {
					var s = m.a;
					return _Utils_Tuple2(
						$author$project$Main$Ready(
							_Utils_update(
								s,
								{
									L: $elm$core$Maybe$Just(p)
								})),
						$elm$core$Platform$Cmd$none);
				}
			default:
				var checked = msg.a;
				if (!m.$) {
					return _Utils_Tuple2(
						$author$project$Main$Loading,
						A2(
							$elm$random$Random$generate,
							$author$project$Main$NewProblem(
								{aC: 0, aJ: checked}),
							$author$project$Main$generateRandomInput));
				} else {
					var s = m.a;
					return _Utils_Tuple2(
						$author$project$Main$Loading,
						A2(
							$elm$random$Random$generate,
							$author$project$Main$NewProblem(
								{aC: s.aC, aJ: checked}),
							$author$project$Main$generateRandomInput));
				}
		}
	});
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$Reset = {$: 0};
var $author$project$Main$Submit = {$: 1};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Main$viewButtons = function (s) {
	return s.G ? _List_Nil : _List_fromArray(
		[
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('checkBtn'),
					$elm$html$Html$Events$onClick($author$project$Main$Submit)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Check Solution')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('resetBtn'),
					$elm$html$Html$Events$onClick($author$project$Main$Reset)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Reset')
				]))
		]);
};
var $author$project$Main$Select = function (a) {
	return {$: 5, a: a};
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Main$viewFrequencyTable = function (s) {
	var _v0 = s.aY;
	if (_v0.$ === 1) {
		return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	} else {
		var t = _v0.a;
		var ms = A2($elm$core$List$filterMap, $author$project$Interface$tryGetLetterData, t.ae);
		var topRow = A2(
			$elm$core$List$map,
			function (l) {
				return A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('pt')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(l.aB)
						]));
			},
			ms);
		var midRow = A2(
			$elm$core$List$map,
			function (l) {
				return A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(
								A2($author$project$DictEx$getOrZero, l.aB, t.aa.aB)))
						]));
			},
			ms);
		var botRow = A2(
			$elm$core$List$map,
			function (l) {
				var selectedClass = function () {
					var _v1 = s.g;
					if (!_v1.$) {
						var selected = _v1.a;
						return ((!s.aJ) && _Utils_eq(selected.aH, l.aH)) ? 'ingroup' : '';
					} else {
						var selected = _v1.a;
						return _Utils_eq(selected.ad, l.ad) ? 'selected' : (((!s.aJ) && _Utils_eq(selected.aH, l.aH)) ? 'ingroup' : '');
					}
				}();
				return A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							$author$project$Main$Select(
								$author$project$Main$TableLetter(l)))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$class(selectedClass)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($elm$core$Maybe$withDefault, '', l.aI))
								]))
						]));
			},
			ms);
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$table,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$tbody,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									A2(
										$elm$core$List$cons,
										A2(
											$elm$html$Html$td,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('topLeftCell')
												]),
											_List_Nil),
										topRow)),
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									A2(
										$elm$core$List$cons,
										A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Frequency')
												])),
										midRow)),
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									A2(
										$elm$core$List$cons,
										A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Replacement')
												])),
										botRow))
								]))
						]))
				]));
	}
};
var $author$project$Main$ToggleHardMode = function (a) {
	return {$: 8, a: a};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Main$viewHardModeToggle = function (s) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('checkbox-wrapper-14')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('checkbox'),
						$elm$html$Html$Attributes$id('hardModeToggle'),
						$elm$html$Html$Attributes$class('switch'),
						$elm$html$Html$Attributes$checked(s.aJ),
						$elm$html$Html$Events$onCheck($author$project$Main$ToggleHardMode)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$for('hardModeToggle')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Hard Mode')
					]))
			]));
};
var $author$project$Main$viewInfo = function (s) {
	var durationInSecs = $elm$core$String$fromInt(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			A3(
				$elm$core$Maybe$map2,
				F2(
					function (start, end) {
						return (($elm$time$Time$posixToMillis(end) - $elm$time$Time$posixToMillis(start)) / 1000) | 0;
					}),
				s.N,
				s.L)));
	return s.G ? _List_fromArray(
		[
			$elm$html$Html$text(
			'🎉🎉 Solved! (Attempts: ' + ($elm$core$String$fromInt(s.s) + (', Time: ' + (durationInSecs + ' seconds)'))))
		]) : ((s.s > 0) ? _List_fromArray(
		[
			$elm$html$Html$text(
			'Not quite. (Attempts: ' + ($elm$core$String$fromInt(s.s) + ')'))
		]) : _List_Nil);
};
var $author$project$Main$InitNewProblem = function (a) {
	return {$: 2, a: a};
};
var $author$project$Interface$cipherToString = function (cipher) {
	switch (cipher) {
		case 0:
			return 'Random';
		case 1:
			return 'Affine';
		case 2:
			return 'Aristocrat';
		case 3:
			return 'Aristocrat K1';
		case 4:
			return 'Atbash';
		case 5:
			return 'Baconian';
		case 6:
			return 'Caesar';
		case 7:
			return 'Nihilist';
		default:
			return 'Porta';
	}
};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $author$project$Main$viewNavBarButtons = function (s) {
	return $elm$core$Array$toList(
		A2(
			$elm$core$Array$map,
			function (c) {
				return A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							$author$project$Main$InitNewProblem(
								{aC: c, aJ: s.aJ}))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'New ' + $author$project$Interface$cipherToString(c))
						]));
			},
			$author$project$Interface$allCiphers));
};
var $author$project$Main$viewInteractiveLetter = F2(
	function (s, l) {
		var selectedClass = function () {
			var _v0 = s.g;
			if (!_v0.$) {
				var selected = _v0.a;
				return _Utils_eq(selected.ad, l.ad) ? 'selected' : (((!s.aJ) && _Utils_eq(selected.aH, l.aH)) ? 'ingroup' : '');
			} else {
				var selected = _v0.a;
				return ((!s.aJ) && _Utils_eq(selected.aH, l.aH)) ? 'ingroup' : '';
			}
		}();
		return A2(
			$elm$html$Html$td,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('letterContainer')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$class(selectedClass),
									$elm$html$Html$Events$onClick(
									$author$project$Main$Select(
										$author$project$Main$ProblemLetter(l)))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($elm$core$Maybe$withDefault, '', l.aI))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('cipherText')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(l.aB)
								]))
						]))
				]));
	});
var $author$project$Main$viewPunctuation = F2(
	function (_v0, _char) {
		return A2(
			$elm$html$Html$td,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('letterContainer')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('punctuation')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(_char)
								])),
							A2($elm$html$Html$div, _List_Nil, _List_Nil)
						]))
				]));
	});
var $author$project$Main$viewLetter = F2(
	function (s, l) {
		if (!l.$) {
			var d = l.a;
			return A2($author$project$Main$viewInteractiveLetter, s, d);
		} else {
			var d = l.a;
			return A2($author$project$Main$viewPunctuation, s, d.O);
		}
	});
var $author$project$Main$viewWord = F2(
	function (s, w) {
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('word')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$tbody,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$tr,
							_List_Nil,
							A2(
								$elm$core$List$map,
								$author$project$Main$viewLetter(s),
								w.aP))
						]))
				]));
	});
var $author$project$Main$viewMain = function (s) {
	return A2(
		$elm$html$Html$main_,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('navBar')
					]),
				A2(
					$elm$core$List$cons,
					$author$project$Main$viewHardModeToggle(s),
					$author$project$Main$viewNavBarButtons(s))),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('topContainer')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('instructionsContainer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(s.aO)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('problemContainer')
							]),
						A2(
							$elm$core$List$map,
							$author$project$Main$viewWord(s),
							s.a0)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('frequencyContainer')
							]),
						_List_fromArray(
							[
								$author$project$Main$viewFrequencyTable(s)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btnContainer')
							]),
						$author$project$Main$viewButtons(s)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('infoContainer')
							]),
						$author$project$Main$viewInfo(s))
					]))
			]));
};
var $author$project$Main$view = function (m) {
	if (!m.$) {
		return A2($elm$html$Html$main_, _List_Nil, _List_Nil);
	} else {
		var s = m.a;
		return $author$project$Main$viewMain(s);
	}
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{aN: $author$project$Main$init, aX: $author$project$Main$subscriptions, a_: $author$project$Main$update, a$: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$float)(0)}});}(this));