<a id="Top" href="#Top"/>

# Circular Buffer Version 0.1.0


1. [Overview](#Overview)
2. [API Index](#APIIndex)
3. [API Details](#APIDetails)
4. [NPM](https://www.npmjs.com/package/@dvermeir/cbuf)

<a id="Overview" href="#Top">

# The CBUF module

</a>

Motivation: a circular buffer is used to keep track of data chunks coming
from a socket: the reader appends chunks at the back while a
consumer removes chunks from the front. Thus, this data structure can also be
used to represent a [FIFO queue](https://en.wikipedia.org/wiki/Queue_(abstract_data_type)).

There are several other circular buffer packages available on npm.

The reason for developing this module is that I wanted to write a simple
module that
* helps me learn a bit about javascript (I'm a novice)
* is efficient
* provides exactly the functionality that is needed: push and shift,
  which have the same effect (FIFO) as the operations with the same name on
  [Arrays]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

**The** <a href="https://www.npmjs.com/package/jsdoc-to-markdown">jsdoc2md</a>
**generated documentation is** [here](#APIIndex).


Being a JS novice, I am reluctant to use 'classes' based on prototypical
inheritance and with a strange semantics for `this`. This is why this
implementation only uses plain functions whose first 
argument is always (except for CBUF.create) the circular buffer 
'under consideration', i.e. 'this'.

Here's a quick example of creating and using a circular buffer.
## Example
```javascript
  import CBUF from '@dvermeir/cbuf';

  let c = CBUF.create(10); // c will manage DATA array of size 10

  while (! CBUF.full(c) ) // while c has some free space
    CBUF.push(c, read_input()); // read a some data and append them as a 'chunk' to the queue/buffer 

  // Assert CBUF.full(c), i.e. c[CBUF.POP] === c[CBUF.DATA].length

  while (! CBUF.empty(c)) // while there is stuff to process
    process(c.shift()); // process the oldest chunk and remove it from the queue
  // etc.
```

## Installation

Standard: 
```bash
  npm install --save @dvermeir/cbuf
```
The module has no runtime dependencies.

## API (informal)

For the 'formal' API, see the jsdoc2md output [here](#APIIndex).

Since a circular buffer object might later be
extended with extra functionality and properties, it is important to prevent
accidental reuse and shadowing of property names. 
Javascript provides
[Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) that are guaranteed to be unique. E.g. circular buffer objects have a property called

```javascript
  const DATA = Symbol('data');
```

If, in a later extension, one wishes to again use a 'data' property, calling
`Symbol('data')` again will yield a different Symbol. 

*It seems that one cannot use the dot notation when accessing properties named
by symbols. Thus, instead of `cbuf.DATA`, one needs to write `cbuf[DATA]`, as
with computed property names.*

The following 3 `Symbol` property names for circular buffer objects are
exported (`cbuf` is the name of a circular buffer object):

- `POP`: `cbuf[POP]` is the population, i.e. the number of elements currently
  in the buffer),
- `DATA`: `cbuf[DATA]` is an
  [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) containing `cbuf[DATA].length` available slots to 
  store elements in. Obviously,
```javascript
    0 < cbuf[POP] <= cbuf[DATA].length
```
  must hold at all times.
- `BEGIN`: `cbuf[BEGIN]` is the index in `cbuf[DATA]` where the first (oldest) 
  element in the circular buffer/FIFO queue lives, if the buffer is not empty.

```javascript
  0 <= cbuf[BEGIN] < cbuf[DATA].length

  if (cbuf[POP] > 0)
    cbuf[DATA][BEGIN] // is oldest element in buffer, `cbuf_shift` will return it
```

One can think of the contents of a circular buffer as a sequence, with a first
and last element, if not empty.
It may be that, in the circular buffer (`cbuf[DATA]`) array, the index of the
last element is smaller than the index of the first element.
This is illustrated in the example below where '`X`' means an element is
present at the index (of the circular buffer array) below while '-' means no 
element is present.
```javascript
  cbuf[DATA][]:

    X--XX
    01234
```
This represents a buffer of capacity 5. Its current contents is the sequence 
```javascript
  cbuf[DATA][3], cbuf[DATA][4], cbuf[DATA][0]
```
The other data members of the buffer are
```javascript
  cbuf[BEGIN] = 3; // index in cbuf[DATA][] of the first element of the sequence
  cbuf[POP] = 3; // number of elements in the sequence
  cbuf[DATA].length = 5; // maximal length of a representable sequence
```

Here is a javascript expression to transform a triple 
```javascript
(start, size, max_size)
```
to the sequence of indices in a circular buffer of `max_size` capacity 
containing
the elements in the associated sequence.
```javascript
let interval = 
  (start, size, max_size) => 
    Array.from(Array(start + size).keys())
      .filter((el, i, _) => start <= i)
      .map((el) => (el % max_size));
```
For the example circular buffer `cbuf` above,
the corresponding interval becomes (we show the intermediate results
corresponding to the successive operations in the definition of `interval`
then becomes
```javascript
  interval(3, 3, 5) ->
    (0, 1, 2, 3, 4, 5) // Array.from(Array(3 + 3).keys()
    (3, 4, 5) // filter((el, i, _) => 3 <= i)
    (3, 4, 0) // map((el) => (el % 5))
```
The sequence represented by the a circular buffer `c`
is then readily available as
```javascript
let contents(c) =
  (c) =>
    interval(c[BEGIN], c[POP], cbuf[DATA].length).map((index)=>c[DATA](index))
```
If for the example circular buffer above, 
```javascript
cbuf[DATA] === [10, undefined, undefined, 13, 14]`:
```
then the sequence it represents is `[13, 14, 10]`:
```javascript
  assert( array_eq( contents(cbuf), [13, 14, 10]) )
```

Based on the `contents` function it is easy to formulate an invariant function
as well as pre- and post-conditions for the `push` and `shift` operations. See
[code](cbuf-test.md#invariant).

More (and better) info on circular buffers can be found e.g. on
[Wikipedia](https://en.wikipedia.org/wiki/Circular_buffer).


### Import the package
```javascript
  import CBUF from '@dvermeir/cbuf'
```

### Make a new circular buffer:
Below we use `'und'` as a shorthand for `undefined`.
```javascript
  // create a new circular buffer with a capacity of 5
  let cbuf = CBUF.create(5); 

  console.log('cbuf capacity = ', cbuf[CBUF.DATA].length); // 5
  console.log('cbuf begin = ', cbuf[CBUF.BEGIN]); // 0
  console.log('cbuf population = ', cbuf[CBUF.POP]); // 0
  console.log('cbuf data = ', cbuf[CBUF.DATA]); // [und und und und und]
```

The unique and obligatory parameter is the size of the buffer, i.e.
the maximum number of elements it can hold at any time.
This is also called the *capacity* (`cbuf[CBUF.DATA].length`) of the buffer.

It is also possible to clone a buffer:
```javascript
  new_buffer = CBUF.clone(buffer);
```

### Retrieve information on the sequence represented by the buffer

The sequence stored in a circular buffer is (note the half-open interval):

```javascript
  const data = cbuf[CBUF.DATA]
  const max = data.length; 
  const begin = CBUF.BEGIN
  const pop = cbuf[CBUF.POP]


  [ data[begin] .. data[(begin + pop) % max]  [
```

There are 2 special cases that can be tested using the Boolean functions
`CBUF.empty` and `CBUF.full`:

- an empty sequence is represented by a buffer where
```javascript
const CBUF.empty = (cbuf) => (cbuf[CBUF.POP] === 0);
```
  returns true;
- for a maximal sequence completely filling the buffer:
```javascript
const CBUF.full = (cbuf) =>  ( cbuf[CBUF.POP] === cbuf[CBUF.DATA].length );
```
will return true.

Retrieving the first element of the sequence can be trivially done using

```javascript
  // first element in the buffer, if not empty. undefined otherwise.
  cbuf[CBUF.DATA][CBUF.BEGIN];
```

To retrieve the last element of the sequence:
```javascript
  // last element, or undefined if the sequence is empty
  CBUF.last(cbuf) 
```
Thus, one could loop through the elements of the sequence like so:

```javascript
  const max = cbuf[CBUF.DATA].length);
  let arr = [];
  let p = 0;
  while (p < cbuf[CBUF.POP])
    arr.push(cbuf[CBUF.DATA][(cbuf[CBUF.BEGIN] + p++) % max]);
```

Actually, there is an
[iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) defined on the circular buffer,
and the above could be written as 

```javascript
  let arr = [];
  for (const z of CBUF.iterable(cbuf)) {
    arr.push(z);
```

Here `for..of` is understood by the system because the
[generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function%2A)  lives in `iterable[Symbol.iterator]`, a well known
[symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator).

See the [source](cbuf.md). 

### Append an element to the sequence in the buffer.

``` js
  /* Boolean */ CBUF.push(cbuf, element)
```
This will return `true` if the append succeeded, and `false` otherwise. In the
latter case, it must be that the circular buffer is full. Note that the
following always holds:

```javascript
  if (CBUF.push(cbuf, element))
    assert(element === CBUF.last(cbuf));
```

### Remove an element from the front of the sequence in the buffer.

``` js
  // return oldest element or undefined if buffer empty
  element = CBUF.shift(cbuf) 
```
This will delete the first element of the sequence and return it.
If the sequence was empty to start with, the function returns `undefined`.

Note also that the place that `element` occupied in the buffer will be
explicitly set to `undefined`. 

### Incrementing an index in `cbuf[DATA]`

```javascript
  // return index of next position, the one after 'i', in the buffer
  const cbuf_inc = (cbuf, i) => (i + 1) % cbuf[DATA].length;
```

### That's it

The whole [thing](cbuf.es7) takes 67 lines (excluding comments) and contains but 3 conditional statements (`if` or `?`). 

More information can be found in the 'specify and test' file
[`cbuf-doc.es7`](cbuf-test.md).
There the invariant defining a legal state of a circular buffer is defined as
are the 'contracts' (pre- and postconditions) that must be respected by the
update operations `CBUF.push` and `CBUF.shift`.

The build tool is the venerable [`make`](https://www.gnu.org/software/make/) 
program that can be used in the traditional way:
```bash
  make
```
which also does several incantations of `babel` to support 2017 syntax.
It translates
`.es7` to `.js` files.
Also
`make install` and `make check` (to do the tests) are supported, as are `make
clean` and `make doc`.

The Makefile is actually very small:
```make
  include vars.mk
  # Check 'vars.mk' for names of lists to which you may want to add
  # some files e.g. bashscripts += myscript.sh
  #
  # Below are some standard ones
  src = cbuf.es7
  tst = cbuf-test.es7 assert-test.es7
  #
  # See 'rules.mk' to have an idea what goals are available.
  # Here we define the first one which will thus be the default:
  # 'make all' is the same as 'make'.
  #
  # If you want to know what will be done before
  # actually doing it, do 'make -n'. E.g. 'make -n clean'.
  all: install 
  # Another nonstandard rule that combines the 'check' (running test programs)
  # with 'lint':
  checkall: check lint
  #
  # A bunch of rules that explain how to make '.js' files from '.es7' files,
  # process markdown files etc etc
  include rules.mk
```
i.e., only 6 lines excluding comments. There's a good reason to separate
`rules.mk` and `vars.mk`: I suspect future projects can simply copy them and
just bother with another tiny `Makefile`.


<a id="APIIndex" href="#Top">

# API Index

</a>

## Modules

<dl>
<dt><a href="#module_CBUF">CBUF</a></dt>
<dd><p>All functions/constants in the CBUF module are implemented in this file and 
are exported as shown below. </p>
<pre><code class="lang-javascript">    module.exports = {
      POP: POP, BEGIN: BEGIN, DATA: DATA,
      create: cbuf_create, clone: cbuf_clone,
      empty: cbuf_empty, full: cbuf_full, last: cbuf_last, iterable: cbuf_iterable,
      push: cbuf_push, inc: cbuf_inc, shift: cbuf_shift,
      tostring: cbuf_tostring
    };
</code></pre>
</dd>
</dl>

## Constants

* [DATA](#DATA)
* [POP](#POP)
* [BEGIN](#BEGIN)

## Functions

* [cbuf_create(capacity)](#cbuf_create) ⇒ <code>CircularBuffer</code>
* [cbuf_clone(cbuf)](#cbuf_clone) ⇒ <code>CircularBuffer</code>
* [cbuf_empty(cbuf)](#cbuf_empty) ⇒ <code>Boolean</code>
* [cbuf_full(cbuf)](#cbuf_full) ⇒ <code>Boolean</code>
* [cbuf_last(cbuf)](#cbuf_last) ⇒ <code>Object</code>
* [cbuf_inc(cbuf, an)](#cbuf_inc) ⇒ <code>Integer</code>
* [cbuf_push(cbuf, x)](#cbuf_push) ⇒ <code>Boolean</code>
* [cbuf_shift(cbuf)](#cbuf_shift) ⇒ <code>Any</code>
* [cbuf_iterable(a)](#cbuf_iterable) ⇒ <code>Iterable</code>
* [cbuf_tostring(cbuf)](#cbuf_tostring) ⇒ <code>String</code>

<a id="APIDetails" href="#Top">

# API Details

</a>

<a name="module_CBUF"></a>

## CBUF
All functions/constants in the CBUF module are implemented in this file and 
are exported as shown below. 
```javascript
	module.exports = {
	  POP: POP, BEGIN: BEGIN, DATA: DATA,
	  create: cbuf_create, clone: cbuf_clone,
	  empty: cbuf_empty, full: cbuf_full, last: cbuf_last, iterable: cbuf_iterable,
	  push: cbuf_push, inc: cbuf_inc, shift: cbuf_shift,
	  tostring: cbuf_tostring
	};
```


* * *

<a name="DATA"></a>

## DATA
Name for the property in a circular buffer object that refers to the array
containing the elements present in the circular
buffer. An 'empty' index in the array contains <b>undefined</b>

**Kind**: global constant  
**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(10);
 console.log(c[CBUF.DATA][0]); // print 'undefined'
```

* * *

<a name="POP"></a>

## POP
Property name for the 'population' property in a circular buffer object.
The property contains the number of elements currently available in the
circular buffer.

**Kind**: global constant  
**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(10);
 console.log(c[CBUF.POP]); // print 0
 console.log(c[CBUF.DATA].length); // print 10
 CBUF.push(c, 'something');
 console.log(c[CBUF.POP]); // print 1
 console.log(c[CBUF.DATA][0]); // print 'something'
```

* * *

<a name="BEGIN"></a>

## BEGIN
Name for the property in a circular buffer object that refers to the index
in the DATA array of the first (oldest) element of the circular buffer,
if this buffer is not empty (POP > 0).

**Kind**: global constant  
**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(10);
 CBUF.push(c, 'something');
 console.log(c[CBUF.BEGIN]); // print 'something';
```

* * *

<a name="cbuf_create"></a>

## cbuf_create(capacity) ⇒ <code>CircularBuffer</code>
Create a new circular buffer (FIFO queue) with a fixed <b>capacity</b>.
At no point can the circular buffer contain more than <b>capacity</b>
elements.
<br/>
Although not available as a direct property of the buffer -- the only
such properties are [DATA](#DATA), [POP](#POP) and 
[BEGIN](#BEGIN) --
it can easily be accessed using the expression 
`c[CBUF.DATA].length` where `c` is the
circular buffer.
<br/>
The function also [seals](
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
the DATA array, so it cannot be extended.

**Kind**: global function  
**Returns**: <code>CircularBuffer</code> - A newly created empty circular buffer with a
 capacity equal to the parameter  
**Params**

- capacity <code>integer</code> - the size of the DATA array, i.e.
the maximal capacity. Must be strictly positive, obviously 
(but this is not verified by the implementation).

**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(10);
 // postcondition: 
 assert( c[CBUF.POP] === 0 && c[CBUF.BEGIN] === 0 && 
   c[CBUF.DATA].length === capacity &&
   foreach 0 <= i < c[CBUF.DATA].length : c[CBUF.DATA][i] === undefined
   );
```

* * *

<a name="cbuf_clone"></a>

## cbuf_clone(cbuf) ⇒ <code>CircularBuffer</code>
Clone a circular buffer.
Note that the result is not a 'deep' copy, the DATA
array is cloned using [slice](
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice).
<br/>
Note that cloning a 'subclass', i.e. a circular buffer with extra data
properties, will usually work using `CBUF.clone` but this should be verified.
E.g. an extra array data property will need extra code to clone its
contents.

**Kind**: global function  
**Returns**: <code>CircularBuffer</code> - A shallow clone of the argument.  
**Params**

- cbuf <code>CircularBuffer</code> - a valid circular buffer.

**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(10);
 ... // do stuff with c
 let cc = CBUF.clone(c);
 assert(
   cc[CBUF.POP] === c[CBUF.POP] && 
   cc[CBUF.BEGIN] === c[CBUF.BEGIN] && 
   cc[CBUF.DATA] !== c[CBUF.DATA]) &&
   c[CBUF.DATA].foreach(c[CBUF.DATA][i] === cc[CBUF.DATA][i])
   );
 // the last line above shows it's a 'shallow' copy
```

* * *

<a name="cbuf_empty"></a>

## cbuf_empty(cbuf) ⇒ <code>Boolean</code>
Check whether a circular buffer is empty

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff `cbuf[CBUF.POP] === 0`.  
**Params**

- cbuf <code>CircularBuffer</code> - a valid circular buffer

**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(10);
 ... // do stuff with c
 if (CBUF.empty(c))
   assert(c[CBUF.DATA].forEach(c[CBUF.DATA][i] === undefined));
```

* * *

<a name="cbuf_full"></a>

## cbuf_full(cbuf) ⇒ <code>Boolean</code>
Check whether a circular buffer is full, i.e. whether it is impossible
to append more elements to it.

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff  
 `cbuf[CBUF.POP] === cbuf[CBUF.DATA].length`.  
**Params**

- cbuf <code>CircularBuffer</code> - a valid circular buffer

**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(10);
 ... // do stuff with c
 // make room by removing the oldest element, if it is not 'in use', e.g. by
 // a cursor pointing into it
 if ( CBUF.full(c) ) {
   let el = c[CBUF.DATA][CBUF.BEGIN]; // oldest element
   if (el_is_not_referred_to)
     CBUF.shift(c);
 }
```

* * *

<a name="cbuf_last"></a>

## cbuf_last(cbuf) ⇒ <code>Object</code>
Retrieve the last element (most recently added in [FIFO](
https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) terms)
from the circular buffer. 
If the buffer is empty, <b>undefined</b> is returned.
<br/>
If the buffer is not empty, the index of the last element in DATA is
<blockquote>
 `cbuf[DATA][(cbuf[BEGIN] + cbuf[POP] - 1) % cbuf[DATA].length])`
</blockquote>

**Kind**: global function  
**Returns**: <code>Object</code> - the last element of the circular buffer 
 or <b>undefined</b> if cbuf is empty  
**Params**

- cbuf <code>CircularBuffer</code> - a valid circular buffer


* * *

<a name="cbuf_inc"></a>

## cbuf_inc(cbuf, an) ⇒ <code>Integer</code>
Increment its second argument modulo cbuf[DATA].length. While this function
is used internally, it is also useful to
access elements of the <b>DATA</b> array while ignoring the circular buffer
that lives in it.

**Kind**: global function  
**Returns**: <code>Integer</code> - the index following the parameter index
 `i` in `cbuf[DATA][i]`.
 The return value `r` also sits in
 `[0 .. cbuf[DATA].length[`  
**Params**

- cbuf <code>CircularBuffer</code> - a valid circular buffer
- an <code>Integer</code> - integer from `[0 .. cbuf[DATA].length[`

**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(10);
 const n = c[CBUF.DATA].length - 1;
 const next = CBUF.inc(c, n) ;
 assert(next === 0);
 for (const i = 0; (i<c[CBUF.DATA].length); ++i) {
   let r = CBUF.inc(c, i);
   assert(0 <= r && r < c[CBUF.DATA].length);
 }
```

* * *

<a name="cbuf_push"></a>

## cbuf_push(cbuf, x) ⇒ <code>Boolean</code>
Append a defined element to the end of the circular buffer. The operation
only succeeds if the circular buffer is not [full](#cbuf_full).
The return value is a boolean indicating the success or failure of the 
append operation.

**Kind**: global function  
**Returns**: <code>Boolean</code> - `true` iff the operation succeeded,
 `false` otherwise, including when `x === undefined`  
**Params**

- cbuf <code>CircularBuffer</code> - a valid circular buffer
- x <code>Any</code> - a <b>defined</b> object (the implementation checks this)

**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(2);
 let x; 
 let y;
 let z;
 .. // do stuff with x, y and z
 assert(CBUF.push(cbuf,x));
 assert(CBUF.push(cbuf,y));
 assert(!CBUF.push(cbuf,z));
 assert(CBUF.full(cbuf));
```

* * *

<a name="cbuf_shift"></a>

## cbuf_shift(cbuf) ⇒ <code>Any</code>
Retrieve and remove the element at the front of the circular buffer (the
oldest one in * [FIFO](
https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics))) terms).
If the operation fails, and this can only happen if the buffer is empty,
<b>undefined</b> is returned.
<br/>
If the operation succeeds and returns a defined object `x` from 
index `cbuf[DATA][BEGIN]`, the contents of `x`'s 
index will be set
to `undefined`. That way, the circular buffer will not be in the
way of a possible garbage collection of `x`.

**Kind**: global function  
**Returns**: <code>Any</code> - the defined first element 
 `(cbuf[CBUF.DATA][CBUF.BEGIN])` shifted out of cbuf 
 or `undefined` if the buffer is [empty](#cbuf_empty).  
**Params**

- cbuf <code>CircularBuffer</code> - a valid circular buffer

**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(2);
 let x; 
 let y;
 let z;
 .. // do stuff with x, y and z
 assert(CBUF.push(cbuf,x));
 assert(CBUF.push(cbuf,y));
 const u = CBUF.shift(cbuf);
 assert(u === x);
 assert(CBUF.push(cbuf,z));
 assert(CBUF.full(cbuf));
 assert(cbuf[CBUF.BEGIN] == 1); // not 0
 assert(cbuf[0] === z); // last element
 assert(CBUF.last(cbuf) === z);
```

* * *

<a name="cbuf_iterable"></a>

## cbuf_iterable(a) ⇒ <code>Iterable</code>
A generator function that supports retrieving all elements in the circular
buffer/FIFO queue in
order by repeated calling this function.

**Kind**: global function  
**Returns**: <code>Iterable</code> - an <a
href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols">
iterable</a>  
**Params**

- a <code>CircularBuffer</code> - valid circular buffer

**Example**  
```js
import CBUF from '@dvermeir/cbuf';
 let c = CBUF.create(3);
 let x = { 'a', 'b', 'c', 'd' };
 assert(CBUF.push(cbuf,x[0])); // 'a'
 assert(CBUF.push(cbuf,x[1])); // 'b'
 assert(CBUF.push(cbuf,x[2])); // 'c'
 const u = CBUF.shift(cbuf); // => 'a'
 assert(u === x[0]);
 assert(CBUF.push(cbuf,x[3])); // 'd'
 assert(cbuf[CBUF.BEGIN] === 1);
 assert(cbuf[CBUF.POP] === 3);
 assert(CBUF.full(cbuf));

 let q = [];
 for (const z of CBUF.iterable(cbuf)) 
   q.push(z);
 // q === [ 'b', 'c', 'd' ];

 // alternative
 q = [];
 let p = 0;
   while (p < cbuf[CBUF.POP])
     q.push(cbuf[CBUF.DATA][(CBUF.inc(cbuf, cbuf[CBUF.BEGIN] + p++)))
 // q === [ 'b', 'c', 'd' ];
```

* * *

<a name="cbuf_tostring"></a>

## cbuf_tostring(cbuf) ⇒ <code>String</code>
Make a human-readable string representation of a circular buffer.

**Kind**: global function  
**Returns**: <code>String</code> - a string representation of `cbuf`  
**Params**

- cbuf <code>CircularBuffer</code> - a valid circular buffer

**Example**  
```js
Example output:

 '3 items in [1..0[: data = 
   0: '"d"'
   1: '"b"'
   2: '"c"'
   ]'
```

* * *

&copy; 2017 Dirk Vermeir

