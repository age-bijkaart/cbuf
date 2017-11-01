'use strict';

/** Name for the property in a circular buffer object that refers to the array
 * containing the elements present in the circular
 * buffer. An 'empty' index in the array contains <b>undefined</b>
 * @example
 *   import CBUF from 'cbuf';
 *  let c = CBUF.create(10);
 *  console.log(c[CBUF.DATA][0]); // print 'undefined'
 */

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _iterator = require('babel-runtime/core-js/symbol/iterator');

var _iterator2 = _interopRequireDefault(_iterator);

var _slice = require('babel-runtime/core-js/array/slice');

var _slice2 = _interopRequireDefault(_slice);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _seal = require('babel-runtime/core-js/object/seal');

var _seal2 = _interopRequireDefault(_seal);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATA = (0, _symbol2.default)('data');

/** Property name for the 'population' property in a circular buffer object.
 * The property contains the number of elements currently available in the
 * circular buffer.
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(10);
 *  console.log(c[CBUF.POP]); // print 0
 *  console.log(c[CBUF.DATA].length); // print 10
 *  CBUF.push(c, 'something');
 *  console.log(c[CBUF.POP]); // print 1
 *  console.log(c[CBUF.DATA][0]); // print 'something'
 */
var POP = (0, _symbol2.default)('pop');

/** Name for the property in a circular buffer object that refers to the index
 * in the DATA array of the first (oldest) element of the circular buffer,
 * if this buffer is not empty (POP > 0). 
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(10);
 *  CBUF.push(c, 'something');
 *  console.log(c[CBUF.BEGIN]); // print 'something';
 */
var BEGIN = (0, _symbol2.default)('begin');

/** Create a new circular buffer (FIFO queue) with a fixed <b>capacity</b>.
 * At no point can the circular buffer contain more than <b>capacity</b>
 * elements.
 * <br/>
 * Although not available as a direct property of the buffer -- the only
 * such properties are [DATA]{@link DATA}, [POP]{@link POP} and 
 * [BEGIN]{@link BEGIN} --
 * it can easily be accessed using the expression 
 * <code>c[CBUF.DATA].length</code> where <code>c</code> is the
 * circular buffer.
 * <br/>
 * The function also [seals](
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
 * the DATA array, so it cannot be extended.
 *
 * @param {integer} capacity the size of the DATA array, i.e.
 * the maximal capacity. Must be strictly positive, obviously 
 * (but this is not verified by the implementation).
 *
 * @returns {CircularBuffer} A newly created empty circular buffer with a
 *  capacity equal to the parameter
 *
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(10);
 *  // postcondition: 
 *  assert( c[CBUF.POP] === 0 && c[CBUF.BEGIN] === 0 && 
 *    c[CBUF.DATA].length === capacity &&
 *    foreach 0 <= i < c[CBUF.DATA].length : c[CBUF.DATA][i] === undefined
 *    );
 */
function cbuf_create(capacity) {
  var _ref;

  // Creates data as a array of size 'capacity' filled with '<b>undefined</b>' values
  // See
  // https://stackoverflow.com/questions/28416547/difference-between-array-applynull-arrayx-and-arrayx
  // 
  // const data = Array.apply(null, {length: capacity});
  // The above line can be rewritten as:
  var data = [].concat((0, _toConsumableArray3.default)({ length: capacity }));
  /** Makes cbuf[DATA] fixed length. */
  (0, _seal2.default)(data);
  return _ref = {}, (0, _defineProperty3.default)(_ref, POP, 0), (0, _defineProperty3.default)(_ref, BEGIN, 0), (0, _defineProperty3.default)(_ref, DATA, data), _ref;
}

/** Clone a circular buffer.
 * Note that the result is not a 'deep' copy, the DATA
 * array is cloned using [slice](
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice).
 * <br/>
 * Note that cloning a 'subclass', i.e. a circular buffer with extra data
 * properties, will usually work using <code>CBUF.clone</code> but this should be verified.
 * E.g. an extra array data property will need extra code to clone its
 * contents.
 *
 * @param {CircularBuffer} cbuf  a valid circular buffer.
 *
 * @returns {CircularBuffer} A shallow clone of the argument. 
 *
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(10);
 *  ... // do stuff with c
 *  let cc = CBUF.clone(c);
 *  assert(
 *    cc[CBUF.POP] === c[CBUF.POP] && 
 *    cc[CBUF.BEGIN] === c[CBUF.BEGIN] && 
 *    cc[CBUF.DATA] !== c[CBUF.DATA]) &&
 *    c[CBUF.DATA].foreach(c[CBUF.DATA][i] === cc[CBUF.DATA][i])
 *    );
 *  // the last line above shows it's a 'shallow' copy
 *
 */
function cbuf_clone(cbuf) {
  // First copy all properties: POP, BEGIN, DATA 
  var clone = (0, _assign2.default)({}, cbuf);
  // Next replace DATA with a new array that is a copy of the original one */
  clone[DATA] = (0, _slice2.default)(cbuf[DATA]);
  return clone;
}

/** Check whether a circular buffer is empty
 *
 * @param {CircularBuffer} cbuf a valid circular buffer
 *
 * @returns {Boolean} true iff <code>cbuf[CBUF.POP] === 0</code>
 *
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(10);
 *  ... // do stuff with c
 *  if (CBUF.empty(c))
 *    assert(c[CBUF.DATA].forEach(c[CBUF.DATA][i] === undefined));
 */
var cbuf_empty = function cbuf_empty(cbuf) {
  return cbuf[POP] === 0;
};

/** Check whether a circular buffer is full, i.e. whether it is impossible
 * to append more elements to it.
 *
 * @param {CircularBuffer} cbuf a valid circular buffer
 *
 * @returns {Boolean} true iff  
 *  <code>cbuf[CBUF.POP] === cbuf[CBUF.DATA].length</code>
 *
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(10);
 *  ... // do stuff with c
 *  // make room by removing the oldest element, if it is not 'in use', e.g. by
 *  // a cursor pointing into it
 *  if ( CBUF.full(c) ) {
 *    let el = c[CBUF.DATA][CBUF.BEGIN]; // oldest element
 *    if (el_is_not_referred_to)
 *      CBUF.shift(c);
 *  }
 */
var cbuf_full = function cbuf_full(cbuf) {
  return cbuf[POP] === cbuf[DATA].length;
};

/** Retrieve the last element (most recently added in [FIFO](
 * https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) terms)
 * from the circular buffer. 
 * If the buffer is empty, <b>undefined</b> is returned.
 * <br/>
 * If the buffer is not empty, the index of the last element in DATA is
 * <blockquote>
 * <code>
 *  cbuf[DATA][(cbuf[BEGIN] + cbuf[POP] - 1) % cbuf[DATA].length]);
 * </code>
 * </blockquote>
 *
 * @param {CircularBuffer} cbuf a valid circular buffer
 *
 * @returns {Object} the last element of the circular buffer 
 *  or <b>undefined</b> if cbuf is empty 
 */
var cbuf_last = function cbuf_last(cbuf) {
  return cbuf_empty(cbuf) ? undefined : cbuf[DATA][(cbuf[BEGIN] + cbuf[POP] - 1) % cbuf[DATA].length];
};

/** Increment its second argument modulo cbuf[DATA].length. While this function
 * is used internally, it is also useful to
 * access elements of the <b>DATA</b> array while ignoring the circular buffer
 * that lives in it. 
 *
 * @param {CircularBuffer} cbuf a valid circular buffer 
 *
 * @param {Integer} an integer from <code>[0 .. cbuf[DATA].length[</code>
 *
 * @returns {Integer} the index following the parameter index
 *  <code>i</code> in <code>cbuf[DATA][i]</code>. 
 *  The return value <code>r</code> also sits in
 *  <code>[0 .. cbuf[DATA].length[</code>
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(10);
 *  const n = c[CBUF.DATA].length - 1;
 *  const next = CBUF.inc(c, n) ;
 *  assert(next === 0);
 *  for (const i = 0; (i<c[CBUF.DATA].length); ++i) {
 *    let r = CBUF.inc(c, i);
 *    assert(0 <= r && r < c[CBUF.DATA].length);
 *  }
 */
var cbuf_inc = function cbuf_inc(cbuf, i) {
  return (i + 1) % cbuf[DATA].length;
};

/** Append a defined element to the end of the circular buffer. The operation
 * only succeeds if the circular buffer is not [full]{@link cbuf_full}.
 * The return value is a boolean indicating the success or failure of the 
 * append operation.
 *
 * @param {CircularBuffer} cbuf a valid circular buffer
 *
 * @param {Any} x a <b>defined</b> object (the implementation checks this)
 *
 * @returns {Boolean} <code>true</code> iff the operation succeeded,
 *  <code>false</code> otherwise, including when <code>x === undefined</code>.
 *
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(2);
 *  let x; 
 *  let y;
 *  let z;
 *  .. // do stuff with x, y and z
 *  assert(CBUF.push(cbuf,x));
 *  assert(CBUF.push(cbuf,y));
 *  assert(!CBUF.push(cbuf,z));
 *  assert(CBUF.full(cbuf));
 */
function cbuf_push(cbuf, x) {
  if (x === undefined || cbuf_full(cbuf)) {
    return false;
  }
  cbuf[DATA][(cbuf[BEGIN] + cbuf[POP]) % cbuf[DATA].length] = x;
  ++cbuf[POP];
  return true;
}

/** Retrieve and remove the element at the front of the circular buffer (the
 * oldest one in * [FIFO](
 * https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics))) terms).
 * If the operation fails, and this can only happen if the buffer is empty,
 * <b>undefined</b> is returned.
 * <br/>
 * If the operation succeeds and returns a defined object <code>x</code> from 
 * index <code>cbuf[DATA][BEGIN]</code>, the contents of <code>x</code>'s 
 * index will be set
 * to <b>undefined</b>. That way, the circular buffer will not be in the
 * way of a possible garbage collection of <code>x</code>
 *
 * @param {CircularBuffer} cbuf a valid circular buffer
 *
 * @return {Any} the defined first element 
 *  <code>(cbuf[CBUF.DATA][CBUF.BEGIN])</code> shifted out of cbuf 
 *  or <b>undefined</b> if the buffer is [empty]{@link cbuf_empty}
 *
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(2);
 *  let x; 
 *  let y;
 *  let z;
 *  .. // do stuff with x, y and z
 *  assert(CBUF.push(cbuf,x));
 *  assert(CBUF.push(cbuf,y));
 *  const u = CBUF.shift(cbuf);
 *  assert(u === x);
 *  assert(CBUF.push(cbuf,z));
 *  assert(CBUF.full(cbuf));
 *  assert(cbuf[CBUF.BEGIN] == 1); // not 0
 *  assert(cbuf[0] === z); // last element
 *  assert(CBUF.last(cbuf) === z);
 */
function cbuf_shift(cbuf) {
  if (cbuf_empty(cbuf)) {
    return undefined;
  }
  var x = cbuf[DATA][cbuf[BEGIN]];
  cbuf[DATA][cbuf[BEGIN]] = undefined;
  cbuf[BEGIN] = cbuf_inc(cbuf, cbuf[BEGIN]);
  --cbuf[POP];
  return x;
}

/** A generator function that supports retrieving all elements in the circular
 * buffer/FIFO queue in
 * order by repeated calling this function.
 *
 * @param {CircularBuffer} a valid circular buffer
 *
 * @returns {Iterable} an <a
 * href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols">
 * iterable</a>
 *
 * @example
 *  import CBUF from 'cbuf';
 *  let c = CBUF.create(3);
 *  let x = { 'a', 'b', 'c', 'd' };
 *  assert(CBUF.push(cbuf,x[0])); // 'a'
 *  assert(CBUF.push(cbuf,x[1])); // 'b'
 *  assert(CBUF.push(cbuf,x[2])); // 'c'
 *  const u = CBUF.shift(cbuf); // => 'a'
 *  assert(u === x[0]);
 *  assert(CBUF.push(cbuf,x[3])); // 'd'
 *  assert(cbuf[CBUF.BEGIN] === 1);
 *  assert(cbuf[CBUF.POP] === 3);
 *  assert(CBUF.full(cbuf));
 *
 *  let q = [];
 *  for (const z of CBUF.iterable(cbuf)) 
 *    q.push(z);
 *  // q === [ 'b', 'c', 'd' ];
 *
 *  // alternative
 *  q = [];
 *  let p = 0;
 *    while (p < cbuf[CBUF.POP])
 *      q.push(cbuf[CBUF.DATA][(CBUF.inc(cbuf, cbuf[CBUF.BEGIN] + p++)))
 *  // q === [ 'b', 'c', 'd' ];
 *
 */
function cbuf_iterable(cbuf) {
  // note the use of 'yield' indicating
  // that the function remembers where it was for the next call.
  var it = {};
  it[_iterator2.default] = /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var i, pop;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            i = cbuf[BEGIN];
            pop = cbuf[POP];

          case 2:
            if (!(pop > 0)) {
              _context.next = 9;
              break;
            }

            _context.next = 5;
            return cbuf[DATA][i];

          case 5:
            i = cbuf_inc(cbuf, i);
            --pop;
            _context.next = 2;
            break;

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  });
  return it;
}

/** Make a human-readable string representation of a circular buffer.
 *
 * @param {CircularBuffer} cbuf a valid circular buffer
 *
 * @returns {String} a string representation of <code>cbuf</code>
 *
 * @example
 * Example output:
 *
 *  '3 items in [1..0[: data = 
 *    0: '"d"'
 *    1: '"b"'
 *    2: '"c"'
 *    ]'
 */
function cbuf_tostring(cbuf) {
  var s = 'CBUF ' + cbuf[POP] + ' items in ' + ('[' + cbuf[BEGIN] + ' .. ' + (cbuf[BEGIN] + cbuf[POP]) % cbuf[DATA].length + '[') + ': data = [';
  cbuf[DATA].forEach(
  /*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
  function (el, i, _) {
    return s += '\n' + i + ': ' + (el ? (0, _stringify2.default)(el) : el) + ', ';
  });
  s += '\n]';
  return s;
}

/** All functions/constants in this file are exported. Note that the naming
 * strategy is such that an 'internal' call
 * <blockquote>
 * <code>
 * cbuf_push(c, x);
 * </code>
 * </blockquote>
 * becomes
 * <blockquote>
 * <code>
 *    CBUF.push(c,x);
 * </code>
 * </blockquote>
 * which is not too far from a 'class based'
 * <code>c.push(x)</code> 
 * where the
 * '<code>this</code>' argument is always the first argument in the 
 * '<code>CBUF.push(c, .. )</code> call. Except that the object is not called
 * '<code>this</code>' and its binding is trivial, unlike that of 
 * '<code>this</code>'.
 * </blockquote>
 * The above depends on an import statement such as
 * <blockquote>
 * <code>
 * import CBUF from 'cbuf';
 * </code>
 * </blockquote>
 *
 * @exports CBUF
 */
module.exports = {
  POP: POP, BEGIN: BEGIN, DATA: DATA,
  create: cbuf_create, clone: cbuf_clone,
  empty: cbuf_empty, full: cbuf_full, last: cbuf_last, iterable: cbuf_iterable,
  push: cbuf_push, inc: cbuf_inc, shift: cbuf_shift,
  tostring: cbuf_tostring
};
