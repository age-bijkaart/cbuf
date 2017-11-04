## Members

* [cbuf-test](#cbuf-test)

## Functions

* [interval(from, size, n)](#interval) ⇒ <code>Array</code>
* [begin(cbuf)](#begin) ⇒ <code>Integer</code>
* [pop(cbuf)](#pop) ⇒ <code>Integer</code>
* [data(cbuf)](#data) ⇒ <code>Array</code>
* [length(cbuf)](#length) ⇒ <code>Integer</code>
* [last(cbuf)](#last) ⇒ <code>Any</code>
* [freesz(cbuf)](#freesz) ⇒ <code>Integer</code>
* [contents(cbuf)](#contents) ⇒ <code>Array</code>
* [invariant(cbuf)](#invariant) ⇒ <code>Boolean</code>
* [array_eq(a1, a2)](#array_eq) ⇒ <code>Boolean</code>
* [array_push(a, x)](#array_push) ⇒ <code>Array</code>
* [cbuf_push_contract(orig, x, next)](#cbuf_push_contract) ⇒ <code>Boolean</code>
* [checked_cbuf_push(cbuf, x, result)](#checked_cbuf_push) ⇒ <code>Boolean</code>
* [cbuf_shift_contract(orig, x, next)](#cbuf_shift_contract) ⇒ <code>Boolean</code>
* [checked_cbuf_shift(orig)](#checked_cbuf_shift) ⇒ <code>Any</code>
* [check_iterable(cbuf)](#check_iterable) ⇒ <code>Boolean</code>
* [check_ordered_access(cbuf)](#check_ordered_access) ⇒ <code>Boolean</code>

<a name="cbuf-test"></a>

## cbuf-test
Test program for the [cbuf](./README.md) 
(circular buffer) module.

**Kind**: global variable  

* * *

<a name="interval"></a>

## interval(from, size, n) ⇒ <code>Array</code>
Interval(from, size, n): generates the indices in the DATA array of a
circular buffer that
<ul>
<li> has `from` as the index of the first element
<li> and that contains `size` elements out of
<li> an underlying array of size `n`
</ul>
E.g. for n = 3, from = 2, size = 2, we'll obtain [ 2, 0 ].
consisting of 'buf[2] buf[0]' represented by the interval [2..1[.

The result is obtained as follows:
<blockquote>
  `[2 .. (2 + size)[ =  [2 .. 4 [`
  <br/>
    `=>  mod (n == 3) => [2 ..  1 [`
</blockquote>
```javascript
let interval = 
  (from, size, n) => 
    Array.from(Array(from + size).keys())
      .filter((el, i, _) => from <= i)
      .map((el) => (el % n));
```
The precondition is
<blockquote>
`from >= 0 && n > 0 &&  0 >= size < n`
</blockquote>

**Kind**: global function  
**Returns**: <code>Array</code> - [from % n .. (from+size)%n [  
**Params**

- from <code>Integer</code> - starting index
- size <code>Integer</code> - number of elements in the buffer
- n <code>Integer</code> - maximal size of the (array underlying the) buffer


* * *

<a name="begin"></a>

## begin(cbuf) ⇒ <code>Integer</code>
Shorthand.
```javascript
const begin = (cbuf) => cbuf[CBUF.BEGIN];
```

**Kind**: global function  
**Returns**: <code>Integer</code> - `cbuf[CBUF.BEGIN]`  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="pop"></a>

## pop(cbuf) ⇒ <code>Integer</code>
Shorthand.
```javascript
const pop = (cbuf) => cbuf[CBUF.POP];
```

**Kind**: global function  
**Returns**: <code>Integer</code> - `cbuf[CBUF.POP]`  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="data"></a>

## data(cbuf) ⇒ <code>Array</code>
Shorthand.
```javascript
const data = (cbuf) => cbuf[CBUF.DATA];
```

**Kind**: global function  
**Returns**: <code>Array</code> - `cbuf[CBUF.DATA]`  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="length"></a>

## length(cbuf) ⇒ <code>Integer</code>
Shorthand.
```javascript
const length = (cbuf) => data(cbuf).length;
```

**Kind**: global function  
**Returns**: <code>Integer</code> - `cbuf[CBUF.DATA].length`  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="last"></a>

## last(cbuf) ⇒ <code>Any</code>
Shorthand.
```javascript
const last = (cbuf) => CBUF.last(cbuf);
```

**Kind**: global function  
**Returns**: <code>Any</code> - `CBUF.last(cbuf)]`.  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="freesz"></a>

## freesz(cbuf) ⇒ <code>Integer</code>
Size of unoccupied part of `cbuf[CBUF.DATA]`, each element of this 'free'
part is `undefined`.
```javascript
const freesz = (cbuf) => length(cbuf) - pop(cbuf);
```

**Kind**: global function  
**Returns**: <code>Integer</code> - `cbuf[CBUF.DATA].length - cbuf{CBUF.POP]`.  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="contents"></a>

## contents(cbuf) ⇒ <code>Array</code>
The contents of a circular buffer is an array of elements, starting with
the oldest (FIFO, `CBUF.shift` will return the starting element)
and ending with the most recently added.
```javascript
const contents = (cbuf) => interval(begin(cbuf), pop(cbuf), length(cbuf)).map((i) => data(cbuf)[i]); 
```
This corresponds to the FIFO operations on the buffer: 
`CBUF.push` will append at the end while `CBUF.shift`
will remove from the front.
This function will return this contents as an array of elements in FIFO
order.

**Kind**: global function  
**Returns**: <code>Array</code> - array of elements in circular buffer, from oldest to
youngest  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="invariant"></a>

## invariant(cbuf) ⇒ <code>Boolean</code>
Circular buffer invariant.
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

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff the invariant holds on `cbuf`  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="array_eq"></a>

## array_eq(a1, a2) ⇒ <code>Boolean</code>
Shallow comparison of arrays, maybe it's built in but I couldn't find it 
```javascript
const array_eq = (a1, a2) => 
  (a1.length !== a2.length ? false : a1.every((x, i) => x === a2[i]));
```

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff arrays have the same size and identical
elements.  
**Params**

- a1 <code>Array</code> - to be compared with `a2`
- a2 <code>Array</code> - to be compared with `a1`


* * *

<a name="array_push"></a>

## array_push(a, x) ⇒ <code>Array</code>
Version of the standard
<a
href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push">
Array.push</a> that returns a copy of the array with the element appended
```javascript
const array_push = (a, x) => {
  let b = Array.from(a); b.push(x); return b;
```

**Kind**: global function  
**Returns**: <code>Array</code> - copy of `a` with `x` appended  
**Params**

- a <code>Array</code> - array on a copy of which an element will be pushed
- x <code>Any</code> - element to be appended (pushed) to array


* * *

<a name="cbuf_push_contract"></a>

## cbuf_push_contract(orig, x, next) ⇒ <code>Boolean</code>
Specification (contract) of push operation 
Essentially, the specification says that 
<ul>
<li>either orig is full and then

  `contents(next) == contents(orig)`

<li>or

  `contents(next) == array_push(contents(orig), x)`
</ul>

Of course, the invariant must be true before and after the operation.

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

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff the contract is satisfied  
**See**: [array_push](#array_push)  
**Params**

- orig <code>CircularBuffer</code> - circular buffer before the push
- x <code>Any</code> - element to be pushed, must be defined
- next <code>CircularBuffer</code> - circular buffer after push


* * *

<a name="checked_cbuf_push"></a>

## checked_cbuf_push(cbuf, x, result) ⇒ <code>Boolean</code>
Execute the push operation and check that its contract is satisfied 
The contract is checked by [assert](./assert-test.md#assert).

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff `CBUF.push(cbuf, x)` succeeded  
**See**: [cbuf_push](./cbuf.md#cbuf_push)  
**Params**

- cbuf <code>CircularBuffer</code> - circular buffer on which an element will be
pushed
- x <code>Any</code> - element to be pushed, must not be `undefined`,
- result <code>Boolean</code> - of the push operation


* * *

<a name="cbuf_shift_contract"></a>

## cbuf_shift_contract(orig, x, next) ⇒ <code>Boolean</code>
Specification (contract) of the 'shift' operation.
Essentially, the specification says that:
<ul>
<li> either orig is empty:
  `x === undefined && next === orig`
<li> or
  `contents(orig) == x ++ contents(next)`
  where '++' means ``append''
</ul>
Naturally, both `orig` and `next` should satisfy the
invariant.

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

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff the contract is satisfied  
**Params**

- orig <code>CircularBuffer</code> - buffer before shift operation
- x <code>Any</code> - return of `cbuf_shift(orig)`
- next <code>CircularBuffer</code> - buffer after shift operation


* * *

<a name="checked_cbuf_shift"></a>

## checked_cbuf_shift(orig) ⇒ <code>Any</code>
Execute the shift operation and check that its contract is satisfied.
If the contract is not satisfied, the errors is noted using
[assert](./assert-test.md#assert).

**Kind**: global function  
**Returns**: <code>Any</code> - the first element of `orig` or
`undefined` if the latter is empty.  
**See**: [cbuf_shift](./cbuf.md#cbuf_shift)  
**Params**

- orig <code>CircularBuffer</code> - buffer before shift operation


* * *

<a name="check_iterable"></a>

## check_iterable(cbuf) ⇒ <code>Boolean</code>
Function that checks `CBUF.iterable` by verifying that 
the result of appending elements from a 

`for ..  of`

loop equals [`contents`](#contents)`(cbuf)`.
If the test failed, it will be noted using
[assert](./assert-test.md#assert).

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff the test succeeded  
**Params**

- cbuf <code>CircularBuffer</code> - to be checked


* * *

<a name="check_ordered_access"></a>

## check_ordered_access(cbuf) ⇒ <code>Boolean</code>
Check that scanning `cbuf` in a traditional way, starting from
`cbuf[CBUF.DATA][cbuf[CBUF.BEGIN]]`, yields
`contents(cbuf)`.
If the test failed, it will be noted using
[assert](./assert-test.md#assert).

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff the test succeeded  
**Params**

- cbuf <code>CircularBuffer</code> - to be checked


* * *

