#!/usr/bin/env node


/** @file
 * @description Test program for the [cbuf](./README.md) 
 * (circular buffer) module.
 */
'use strict';

/* Invariant and pre/post conditions for operations on circular buffer */

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _assertTest = require('./assert-test.js');

var _cbuf = require('./cbuf.js');

var _cbuf2 = _interopRequireDefault(_cbuf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Interval(from, size, n): generates the indices in the DATA array of a
 * circular buffer that
 * <ul>
 * <li> has `from` as the index of the first element
 * <li> and that contains `size` elements out of
 * <li> an underlying array of size `n`
 * </ul>
 * E.g. for n = 3, from = 2, size = 2, we'll obtain [ 2, 0 ].
 * consisting of 'buf[2] buf[0]' represented by the interval [2..1[.
 *
 * The result is obtained as follows:
 * <blockquote>
 *   `[2 .. (2 + size)[ =  [2 .. 4 [`
 *   <br/>
 *     `=>  mod (n == 3) => [2 ..  1 [`
 * </blockquote>
```javascript
let interval = 
  (from, size, n) => 
    Array.from(Array(from + size).keys())
      .filter((el, i, _) => from <= i)
      .map((el) => (el % n));
```
 * The precondition is
 * <blockquote>
 * `from >= 0 && n > 0 &&  0 >= size < n`
 * </blockquote>
 *
 * @param {Integer} from starting index
 * @param {Integer} size number of elements in the buffer
 * @param {Integer} n maximal size of the (array underlying the) buffer
 * @return {Array} [from % n .. (from+size)%n [
 */
var interval = function interval(from, size, n) {
  return (0, _from2.default)(Array(from + size).keys())
  /*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
  .filter(function (el, i, _) {
    return from <= i;
  }).map(function (el) {
    return el % n;
  });
};

/** Shorthand.
```javascript
const begin = (cbuf) => cbuf[CBUF.BEGIN];
```
 * @param {CircularBuffer} cbuf
 * @returns {Integer} `cbuf[CBUF.BEGIN]`
 */
var begin = function begin(cbuf) {
  return cbuf[_cbuf2.default.BEGIN];
};

/** Shorthand.
```javascript
const pop = (cbuf) => cbuf[CBUF.POP];
```
 *  @param {CircularBuffer} cbuf
 * @returns {Integer} `cbuf[CBUF.POP]`
 */
var pop = function pop(cbuf) {
  return cbuf[_cbuf2.default.POP];
};

/** Shorthand.
```javascript
const data = (cbuf) => cbuf[CBUF.DATA];
```
 * @param {CircularBuffer} cbuf
 * @returns {Array} `cbuf[CBUF.DATA]`
 */
var data = function data(cbuf) {
  return cbuf[_cbuf2.default.DATA];
};

/** Shorthand.
```javascript
const length = (cbuf) => data(cbuf).length;
```
 * @param {CircularBuffer} cbuf
 * @returns {Integer} `cbuf[CBUF.DATA].length`
 */
var length = function length(cbuf) {
  return data(cbuf).length;
};

/** Shorthand.
```javascript
const last = (cbuf) => CBUF.last(cbuf);
```
 * @param {CircularBuffer} cbuf
 * @returns {Any} `CBUF.last(cbuf)]`.
 */
var last = function last(cbuf) {
  return _cbuf2.default.last(cbuf);
};

/** Size of unoccupied part of `cbuf[CBUF.DATA]`, each element of this 'free'
 * part is `undefined`.
```javascript
const freesz = (cbuf) => length(cbuf) - pop(cbuf);
```
 * @param {CircularBuffer} cbuf
 * @returns {Integer} `cbuf[CBUF.DATA].length - cbuf{CBUF.POP]`.
 */
var freesz = function freesz(cbuf) {
  return length(cbuf) - pop(cbuf);
};

/** The contents of a circular buffer is an array of elements, starting with
 * the oldest (FIFO, `CBUF.shift` will return the starting element)
 * and ending with the most recently added.
```javascript
const contents = (cbuf) => interval(begin(cbuf), pop(cbuf), length(cbuf)).map((i) => data(cbuf)[i]); 
```
 * This corresponds to the FIFO operations on the buffer: 
 * `CBUF.push` will append at the end while `CBUF.shift`
 * will remove from the front.
 * This function will return this contents as an array of elements in FIFO
 * order.
 * @param {CircularBuffer} cbuf
 * @return {Array} array of elements in circular buffer, from oldest to
 * youngest 
 */
var contents = function contents(cbuf) {
  return interval(begin(cbuf), pop(cbuf), length(cbuf)).map(function (i) {
    return data(cbuf)[i];
  });
};

/* Rest of circular buffer, i.e. list of cbuf[DATA] elements that are not
 * part of the circular buffer.
```javascript
const rest = (cbuf) => interval(begin(cbuf) + pop(cbuf), freesz(cbuf), length(cbuf)).map((i) => data(cbuf)[i]); 
```
 * @param {CircularBuffer} cbuf
 * @return {Array} array of non-elements, i.e. 
 * `cbuf[CBUF.DATA][i]` where `i` is not an index 'in use'
 * If all is well, this should be an array of 'undefined'.
 */
var rest = function rest(cbuf) {
  return interval(begin(cbuf) + pop(cbuf), freesz(cbuf), length(cbuf)).map(function (i) {
    return data(cbuf)[i];
  });
};

/** Circular buffer invariant.
```javascript
const invariant = (cbuf) => 
      length(cbuf) > 0
    && 
      ( 0 <= pop(cbuf) && pop(cbuf) <= length(cbuf) ) 
    && 
      ( 0 <= begin(cbuf) && begin(cbuf) < length(cbuf) )
    && 
      contents(cbuf).every((x)=> x !== undefined)
    && 
      rest(cbuf).every((x)=> x === undefined)
```
 * @param {CircularBuffer} cbuf 
 * @returns {Boolean} true iff the invariant holds on `cbuf`
 */
var invariant = function invariant(cbuf) {
  return true && // silly JS thinks return by itself ends the statement
  length(cbuf) > 0 && pop(cbuf) >= 0 && pop(cbuf) <= length(cbuf) && begin(cbuf) >= 0 && begin(cbuf) < length(cbuf) && contents(cbuf).every(function (x) {
    return x !== undefined;
  }) && rest(cbuf).every(function (x) {
    return x === undefined;
  });
};

/** Shallow comparison of arrays, maybe it's built in but I couldn't find it 
```javascript
const array_eq = (a1, a2) => 
  (a1.length !== a2.length ? false : a1.every((x, i) => x === a2[i]));
```
 * @param {Array} a1 to be compared with `a2`
 * @param {Array} a2 to be compared with `a1`
 * @returns {Boolean} true iff arrays have the same size and identical
 * elements.
 */
var array_eq = function array_eq(a1, a2) {
  return a1.length !== a2.length ? false : a1.every(function (x, i) {
    return x === a2[i];
  });
};

/**  Version of the standard
 * <a
 * href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push">
 * Array.push</a> that returns a copy of the array with the element appended
```javascript
const array_push = (a, x) => {
  let b = Array.from(a); b.push(x); return b;
```
 * @param {Array} a array on a copy of which an element will be pushed
 * @param {Any} x element to be appended (pushed) to array
 * @returns {Array} copy of `a` with `x` appended
 */
var array_push = function array_push(a, x) {
  var b = (0, _from2.default)(a);b.push(x);return b;
};

/** Specification (contract) of push operation 
 * Essentially, the specification says that 
 * <ul>
 * <li>either orig is full and then
 *
 *   `contents(next) == contents(orig)`
 *
 * <li>or
 *
 *   `contents(next) == array_push(contents(orig), x)`
 * </ul>
 *
 * Of course, the invariant must be true before and after the operation.
 *
```javascript
const cbuf_push_contract = (orig, x, next) => 
  (
      invariant(orig)
    && 
      invariant(next) 
    && 
      (
            array_eq(array_push(contents(orig), x), contents(next)) && last(next) === x 
      || 
            CBUF.full(orig) && array_eq(contents(orig), contents(next)) 
      )
  );
```
 * @see [array_push](#array_push)
 * @param {CircularBuffer} orig circular buffer before the push
 * @param {Any} x element to be pushed, must be defined
 * @param {CircularBuffer} next circular buffer after push
 * @returns {Boolean} true iff the contract is satisfied
 */
var cbuf_push_contract = function cbuf_push_contract(orig, x, next) {
  return invariant(orig) && invariant(next) && (array_eq(array_push(contents(orig), x), contents(next)) && last(next) === x || _cbuf2.default.full(orig) && array_eq(contents(orig), contents(next)));
};

/** Execute the push operation and check that its contract is satisfied 
 * The contract is checked by [assert](./assert-test.md#assert).
 * @param {CircularBuffer} cbuf circular buffer on which an element will be
 * pushed
 * @param {Any} x element to be pushed, must not be `undefined`,
 * @param {Boolean} result of the push operation
 * @returns {Boolean} true iff `CBUF.push(cbuf, x)` succeeded
 * @see [cbuf_push](./cbuf.md#cbuf_push)
 */
var checked_cbuf_push = function checked_cbuf_push(cbuf, x) {
  var orig = _cbuf2.default.clone(cbuf);
  var ok = _cbuf2.default.push(cbuf, x);
  (0, _assertTest.assert)(cbuf_push_contract(orig, x, cbuf), 'check_cbuf_push contract CBUF.push(' + _cbuf2.default.tostring(orig) + ', ' + x + ') holds', 'check_cbuf_push contract CBUF.push(' + _cbuf2.default.tostring(orig) + ', ' + x + ') fails');
  return ok;
};

/** Specification (contract) of the 'shift' operation.
 * Essentially, the specification says that:
 * <ul>
 * <li> either orig is empty:
 *   `x === undefined && next === orig`
 * <li> or
 *   `contents(orig) == x ++ contents(next)`
 *   where '++' means ``append''
 * </ul>
 * Naturally, both `orig` and `next` should satisfy the
 * invariant.
 *
```javascript
const cbuf_shift_contract = (orig, x, next) =>
      invariant(orig)
   && invariant(next)
   && (
        pop(orig) === 0 && array_eq(contents(next), contents(orig)) && x === undefined
      || 
        array_eq(contents(orig).slice(1), contents(next)) && array_eq([x], contents(orig).slice(0, 1))
    )
```
 * @param {CircularBuffer} orig buffer before shift operation
 * @param {Any} x return of `cbuf_shift(orig)`
 * @param {CircularBuffer} next buffer after shift operation
 * @returns {Boolean} true iff the contract is satisfied
 */
var cbuf_shift_contract = function cbuf_shift_contract(orig, x, next) {
  return invariant(orig) && invariant(next) && (pop(orig) === 0 && array_eq(contents(next), contents(orig)) && x === undefined || array_eq(contents(orig).slice(1), contents(next)) && array_eq([x], contents(orig).slice(0, 1)));
};

/** Execute the shift operation and check that its contract is satisfied.
 * If the contract is not satisfied, the errors is noted using
 * [assert](./assert-test.md#assert).
 * @param {CircularBuffer} orig buffer before shift operation
 * @returns {Any} the first element of `orig` or
 * `undefined` if the latter is empty.
 * @see [cbuf_shift](./cbuf.md#cbuf_shift)
 */
var checked_cbuf_shift = function checked_cbuf_shift(cbuf) {
  var orig = _cbuf2.default.clone(cbuf);
  var x = _cbuf2.default.shift(cbuf);
  (0, _assertTest.assert)(cbuf_shift_contract(orig, x, cbuf), 'check_cbuf_shift contract ' + x + ' = CBUF.shift(' + orig + ') holds', 'check_cbuf_shift contract ' + x + ' = CBUF.shift(' + orig + ') fails');
  return x;
};

/**
 * Function that checks `CBUF.iterable` by verifying that 
 * the result of appending elements from a 
 *
 * `for ..  of`
 *
 * loop equals [`contents`](#contents)`(cbuf)`.
 * If the test failed, it will be noted using
 * [assert](./assert-test.md#assert).
 * @param {CircularBuffer} cbuf to be checked
 * @returns {Boolean} true iff the test succeeded
 */
function check_iterable(cbuf) {
  console.log('checking iterable on current circular buffer: ', _cbuf2.default.tostring(cbuf));
  {
    var seqit = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(_cbuf2.default.iterable(cbuf)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var z = _step.value;

        seqit.push(z);
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

    var eql = array_eq(seqit, contents(cbuf));
    (0, _assertTest.assert)(eql, 'Iterable yields ' + seqit + ', i.e. the contents ' + contents(cbuf), 'Iterable unexpectedly yields ' + seqit + ', not the contents ' + contents(cbuf));
    return eql;
  }
}

/** 
 * Check that scanning `cbuf` in a traditional way, starting from
 * `cbuf[CBUF.DATA][cbuf[CBUF.BEGIN]]`, yields
 * `contents(cbuf)`.
 * If the test failed, it will be noted using
 * [assert](./assert-test.md#assert).
 * @param {CircularBuffer} cbuf to be checked
 * @returns {Boolean} true iff the test succeeded
 */
function check_ordered_access(cbuf) {
  var buffer = [];
  var p = 0;
  while (p < cbuf[_cbuf2.default.POP]) {
    buffer.push(cbuf[_cbuf2.default.DATA][(cbuf[_cbuf2.default.BEGIN] + p++) % cbuf[_cbuf2.default.DATA].length]);
  }

  var eql = array_eq(buffer, contents(cbuf));
  (0, _assertTest.assert)(eql, 'Loop yields ' + buffer + ' which equals the contents ' + contents(cbuf), 'Loop unexpectedly yields ' + buffer + ', not the contents ' + contents(cbuf));
  return eql;
}

/** Main test function */
try {
  console.log('Start cbuf test');
  /* in the comments, we use 'und' to abbreviate 'undefined' */
  var cbuf = _cbuf2.default.create(5);
  console.log('cbuf_create(5) => ', _cbuf2.default.tostring(cbuf));
  (0, _assertTest.assert)(invariant(cbuf), 'New CBUF.create(5) satisfies invariant', 'New CBUF.create(5) violates invariant!');

  (0, _assertTest.assert)(_cbuf2.default.last(cbuf) === undefined, 'CBUF.last of empty buf is undefined', 'CBUF.last of empty, \'' + _cbuf2.default.last(cbuf) + '\' not undefined as it should be');

  /* [ und und und und und ], begin = 0, end = 0, pop = 0 */

  console.log("checked_cbuf_push(cbuf, 'a') = ", checked_cbuf_push(cbuf, 'a'));

  /* [ a und und und und ], begin = 0, end = 2, pop = 1 */

  console.log("checked_cbuf_push(cbuf, 'b') = ", checked_cbuf_push(cbuf, 'b'));

  /* [  a b und und und ], begin = 0, end = 2, pop = 2 */

  console.log("checked_cbuf_push(cbuf, 'c') = ", checked_cbuf_push(cbuf, 'c'));

  /* [  a b c und und ], begin = 0, end = 3, pop = 3 */

  console.log("checked_cbuf_push(cbuf, 'd') = ", checked_cbuf_push(cbuf, 'd'));

  /* [  a b c d und ], begin = 0, end = 4, pop = 4 */

  console.log("checked_cbuf_push(cbuf, 'e') = ", checked_cbuf_push(cbuf, 'e'));

  /* [  a b c d e ], begin = 0, end = 0, pop = 5 (full) */

  console.log("checked_cbuf_push(cbuf, 'f') = ", checked_cbuf_push(cbuf, 'f'));

  /* [  a b c d e ], begin = 0, end = 0, pop = 5 (full) */

  console.log('checked_cbuf_shift(cbuf) = ', checked_cbuf_shift(cbuf));

  /* [ und b c d e ], begin = 1, end = 0, pop = 4 */

  check_ordered_access(cbuf);
  check_iterable(cbuf);

  console.log('checked_cbuf_shift(cbuf) = ', checked_cbuf_shift(cbuf));

  /* [ und und c d e ], begin = 2, end = 0, pop = 3 */

  console.log('checked_cbuf_shift(cbuf) = ', checked_cbuf_shift(cbuf));

  /* [ und und und d e ], begin = 3, end = 0, pop = 2 */

  console.log('checked_cbuf_shift(cbuf) = ', checked_cbuf_shift(cbuf));

  /* [ und und und und e ], begin = 4, end = 0, pop = 1 */
  check_ordered_access(cbuf);
  check_iterable(cbuf);

  console.log('checked_cbuf_shift(cbuf) = ', checked_cbuf_shift(cbuf));

  /* [ und und und und und ], begin = 0, end = 0, pop = 0  (empty) */
  check_ordered_access(cbuf);
  check_iterable(cbuf);

  console.log('checked_cbuf_shift(cbuf) = ', checked_cbuf_shift(cbuf));

  /* [ und und und und und ], begin = 0, end = 0, pop = 0  (empty) */

  console.log("checked_cbuf_push(cbuf, 'b') = ", checked_cbuf_push(cbuf, 'b'));

  /* [ b und und und und ], begin = 0, end = 1, pop = 1 */

  console.log("checked_cbuf_push(cbuf, 'c') = ", checked_cbuf_push(cbuf, 'c'));

  /* [ b c und und und ], begin = 0, end = 2, pop = 2 */

  console.log("checked_cbuf_push(cbuf, 'd') = ", checked_cbuf_push(cbuf, 'd'));

  /* [ b c d und und ], begin = 0, end = 3, pop = 3 */

  console.log("checked_cbuf_push(cbuf, 'e') = ", checked_cbuf_push(cbuf, 'e'));

  /* [ b c d e und ], begin = 0, end = 4, pop = 4 */

  console.log("checked_cbuf_push(cbuf, 'b') = ", checked_cbuf_push(cbuf, 'b'));

  /* [ b c d e b ], begin = 0, end = 0, pop = 5 (full) */

  console.log("checked_cbuf_push(cbuf, 'c') = ", checked_cbuf_push(cbuf, 'c'));
  /* [ b c d e b ], begin = 0, end = 0, pop = 5 (full) */
  console.log("checked_cbuf_push(cbuf, 'd') = ", checked_cbuf_push(cbuf, 'd'));
  /* [ b c d e b ], begin = 0, end = 0, pop = 5 (full) */
  console.log("checked_cbuf_push(cbuf, 'e') = ", checked_cbuf_push(cbuf, 'e'));
  /* [ b c d e b ], begin = 0, end = 0, pop = 5 (full) */
  check_ordered_access(cbuf);
  check_iterable(cbuf);

  console.log("checked_cbuf_shift(cbuf') = ", checked_cbuf_shift(cbuf));
  /* [ und c d e b ], begin = 1, end = 0, pop = 4  */
  check_ordered_access(cbuf);
  check_iterable(cbuf);
  /*eslint-disable no-process-exit*/
  process.exit((0, _assertTest.nerrors)());
} catch (e) {
  console.error(e.name + ': ' + e.message);
  process.exit(1);
}
