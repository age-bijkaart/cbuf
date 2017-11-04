## Members

* [assert-test](#assert-test)
* [errors](#errors)

## Functions

* [error(name, message)](#error) ⇒ <code>Error</code>
* [assert(e, text_if_true, text_if_false)](#assert) ⇒ <code>Boolean</code>
* [assertx(e, text_if_true, text_if_false)](#assertx) ⇒ <code>Boolean</code>
* [nerrors()](#nerrors) ⇒ <code>Integer</code>

<a name="assert-test"></a>

## assert-test
Some utilities (error, assert and friends) too simple to import from
elsewhere.

**Kind**: global variable  

* * *

<a name="errors"></a>

## errors
This is private but can be retrieved using the [nerrors](#nerrors) function.

**Kind**: global variable  

* * *

<a name="error"></a>

## error(name, message) ⇒ <code>Error</code>
**Kind**: global function  
**Returns**: <code>Error</code> - an 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error">Error</a> object with a name  
**Params**

- name <code>String</code> - to add to a standard 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error">Error</a> object.
- message <code>String</code> - to pass to the 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error">Error</a> constructor

**Example**  
```js
try {
   ..
   throw error('PARSING', 'Unexpected token');
   ..
 }
 catch (e) {
   console.error(e.name, ': ', e.message);
 }
```

* * *

<a name="assert"></a>

## assert(e, text_if_true, text_if_false) ⇒ <code>Boolean</code>
Non-throwing assert function. If an assertion fails, the error is
noted by increasing [nerrors](#nerrors) but no exception is thrown.

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff `e` is 'truthy'  
**See**: [nerrors](#nerrors)  
**Params**

- e <code>Expression</code> - to be tested
- text_if_true <code>String</code> - is `e` is 'truthy', this text
  will be shown using `console.log()`.
- text_if_false <code>String</code> - is `e` is not 'truthy', this text
 will be shown using `console.error()`


* * *

<a name="assertx"></a>

## assertx(e, text_if_true, text_if_false) ⇒ <code>Boolean</code>
Unforgiving assert function. 
If an assertion fails, an error is thrown.

**Kind**: global function  
**Returns**: <code>Boolean</code> - true iff `e` is 'truthy', else throws an error  
**Throws**:

- <code>Error</code> if `e` is not 'truthy'.

**See**: [error](#error)  
**Params**

- e <code>Expression</code> - expression to be tested
- text_if_true <code>String</code> - is `e` is 'truthy', this text
  will be shown using `console.log()`.
- text_if_false <code>String</code> - is `e` is 'truthy', this text
 will be shown using `console.error()`


* * *

<a name="nerrors"></a>

## nerrors() ⇒ <code>Integer</code>
**Kind**: global function  
**Returns**: <code>Integer</code> - the number of errors so far, i.e. the number of times 
[assert](#assert) failed.  
**See**: [assert](#assert)  

* * *

