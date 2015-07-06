See [this issue](https://github.com/benjamingr/RegExp.escape/issues/26#issuecomment-113572232) for more details. In short:


 - EscapeRegExpPattern (as the name implies) takes a pattern and escapes it so that it can be represented as a string.

 - What RegExp.escape does is take a string and escapes it so it can be literally represented as a pattern.














---------------

ECMA 2015 specifies usage of [EscapeRegExpPattern](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-escaperegexppattern)
It's being used in [RegExp.prototype.source](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-get-regexp.prototype.source)

The RegExp.prototype.source returns only the source of the regular expression.
[From Mozilla JS Reference:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/source)
```js
var regex = /fooBar/ig;

console.log(regex.source); // "fooBar", doesn't contain /.../ and "ig".
```

The source function changed implementation between es3 and es5. 
In es5 it uses EscapeRegExpPattern under the covers to escape the source of the regexp, so:
```js
new RegExp('\n').source === "\n";  // true, prior to ES5
new RegExp('\n').source === "\\n"; // true, starting with ES5
```

The specification notes that it uses EscapeRegulareExpression, but no actual specification can be found for the  implementation of EscapeRegulareExpression
 
    Let R be the this value.
    If Type(R) is not Object, throw a TypeError exception.
    If R does not have an [[OriginalSource]] internal slot, throw a TypeError exception.
    If R does not have an [[OriginalFlags]] internal slot, throw a TypeError exception.
    Let src be the value of R’s [[OriginalSource]] internal slot.
    Let flags be the value of R’s [[OriginalFlags]] internal slot.
    Return EscapeRegExpPattern(src, flags).

