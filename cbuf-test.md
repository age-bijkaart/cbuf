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

<a name="interval"></a>

## interval(from, size, n) ⇒ <code>Array</code>
Interval(from, size, n): generates the indices in the DATA array of a
circular buffer that
<ul>
<li> has '<code>from</code>' as the index of the first element
<li> and that contains '<code>size</code>' elements out of
<li> and has an underlying array of size '<code>n</code>'
</ul>
E.g. for n = 3, from = 2, size = 2, we'll obtain [ 2, 0 ].
consisting of 'buf[2] buf[0]' represented by the interval [2..1[.

The result is obtained as follows:
<blockquote>
  <code>
  [2 .. (2 + size)[ =  [2 .. 4 [
  </code>
  <br/>
  <code>
    =>  mod (n == 3) => [2 ..  1 [
  </code>
</blockquote>
The precondition is
<blockquote>
<code>from >= 0 && n > 0 &&  0 >= size < n</code>.
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
**Kind**: global function  
**Returns**: <code>Integer</code> - <code>cbuf[CBUF.BEGIN]</code>  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="pop"></a>

## pop(cbuf) ⇒ <code>Integer</code>
**Kind**: global function  
**Returns**: <code>Integer</code> - <code>cbuf[CBUF.POP]</code>  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="data"></a>

## data(cbuf) ⇒ <code>Array</code>
**Kind**: global function  
**Returns**: <code>Array</code> - <code>cbuf[CBUF.DATA]</code>  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="length"></a>

## length(cbuf) ⇒ <code>Integer</code>
**Kind**: global function  
**Returns**: <code>Integer</code> - <code>cbuf[CBUF.DATA].length</code>  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="last"></a>

## last(cbuf) ⇒ <code>Any</code>
**Kind**: global function  
**Returns**: <code>Any</code> - <code>CBUF.last(cbuf)]</code>  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="freesz"></a>

## freesz(cbuf) ⇒ <code>Integer</code>
Size of unoccupied part of <code>cbuf[CBUF.DATA]</code.

**Kind**: global function  
**Returns**: <code>Integer</code> - <code>cbuf[CBUF.DATA].length - cbuf{CBUF.POP]</code>  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="contents"></a>

## contents(cbuf) ⇒ <code>Array</code>
The contents of a circular buffer is an array of elements, starting with
the oldest (FIFO, <code>CBUF.shift</code> will return the starting element)
and ending with the most recently added.
This corresponds to the FIFO operations on the buffer: 
<code>CBUF.push</code> will append at the end while <code>CBUF.shift</code>
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

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff the invariant holds on <code>cbuf</code>  
**Params**

- cbuf <code>CircularBuffer</code>


* * *

<a name="array_eq"></a>

## array_eq(a1, a2) ⇒ <code>Boolean</code>
Shallow comparison of arrays, maybe it's built in but I couldn't find it

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff arrays have the same size and identical
elements.  
**Params**

- a1 <code>Array</code> - to be compared with <code>a2</code>
- a2 <code>Array</code> - to be compared with <code>a1</code>


* * *

<a name="array_push"></a>

## array_push(a, x) ⇒ <code>Array</code>
Version of the standard
<a
href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push">
Array.push</a> that returns a copy of the array with the element appended

**Kind**: global function  
**Returns**: <code>Array</code> - copy of <code>a</code> with <code>x</code> appended  
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

  <code>
  contents(next) == contents(orig)
  </code>

<li>or

  <code>
  contents(next) == array_push(contents(orig), x)
  </code>
</ul>
Of course, the invariant must be true before and after the operation.

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
The contract is checked by [assert](assert).

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff <code>CBUF.push(cbuf, x)</code> succeeded  
**See**: <a href="../global.html#cbuf_push">cbuf_push</a>  
**Params**

- cbuf <code>CircularBuffer</code> - circular buffer on which an element will be
pushed
- x <code>Any</code> - element to be pushed, must not be <code>undefined</code>.
- result <code>Boolean</code> - of the push operation


* * *

<a name="cbuf_shift_contract"></a>

## cbuf_shift_contract(orig, x, next) ⇒ <code>Boolean</code>
Specification (contract) of the 'shift' operation.
Essentially, the specification says that:
<ul>
<li> either orig is empty:
  <code>x === undefined && next === orig</code>
<li> or
  <code>contents(orig) == x ++ contents(next)</code>
  where '++' means ``append''
</ul>
Naturally, both <code>orig</code> and <code>next</code> should satisfy the
invariant.

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff the contract is satisfied  
**Params**

- orig <code>CircularBuffer</code> - buffer before shift operation
- x <code>Any</code> - return of <code>cbuf_shift(orig)</code>
- next <code>CircularBuffer</code> - buffer after shift operation


* * *

<a name="checked_cbuf_shift"></a>

## checked_cbuf_shift(orig) ⇒ <code>Any</code>
Execute the shift operation and check that its contract is satisfied.
If the contract is not satisfied, the errors is noted using [assert](assert)

**Kind**: global function  
**Returns**: <code>Any</code> - the first element of <code>orig</code> or
<code>undefined</code> if the latter is empty.  
**See**: <a href="../global.html#cbuf_shift">cbuf_shift</a>  
**Params**

- orig <code>CircularBuffer</code> - buffer before shift operation


* * *

<a name="check_iterable"></a>

## check_iterable(cbuf) ⇒ <code>Boolean</code>
Function that checks <code>CBUF.iterable</code> by verifying that 
the result of appending elements from a 

<code>for ..  of</code>

loop equals <code>contents(cbuf).
If the test failed, it will be noted using [assert](assert)

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff the test succeeded  
**Params**

- cbuf <code>CircularBuffer</code> - to be checked


* * *

<a name="check_ordered_access"></a>

## check_ordered_access(cbuf) ⇒ <code>Boolean</code>
Check that scanning <code>cbuf</code> in a traditional way, starting from
cbuf[CBUF.DATA][cbuf[CBUF.BEGIN]], yields
<code>contents(cbuf)</code>.
If the test failed, it will be noted using [assert](assert)

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff the test succeeded  
**Params**

- cbuf <code>CircularBuffer</code> - to be checked


* * *

