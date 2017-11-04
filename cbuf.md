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

