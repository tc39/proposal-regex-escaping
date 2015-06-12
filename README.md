# `RexExp.escape` Proposal

Proposal for adding a `RegExp.escape` method to the ECMAScript standard.

## Status

This proposal is a [stage 0 (strawman) proposal](https://docs.google.com/document/d/1QbEE0BsO4lvl7NFTn5WXWeiEIBfaVUF7Dk0hpPpPDzU/edit#) and is awaiting specification, implementation and input.

## Motivation

See [this issue](https://esdiscuss.org/topic/regexp-escape). It is often the case when we want to build a regular expression out of a string without treating special charactars from the string as special regular expression tokens. For example if we want to replace all occurances of the the string `Hello.` which we got from the user we might be tempted to do `ourLongText.replace(new RegExp(text, "g"))` but this would match `.` against any character rather than a dot.

This is a fairly common use in regular expressions and standardizing it would be useful. 

In other languages: 

 - Perl: quotemeta(str) - see [the docs](http://perldoc.perl.org/functions/quotemeta.html)
 - PHP: preg_quote(str) - see [the docs](http://php.net/manual/en/function.preg-quote.php)
 - Python: re.escape(str) - see [the docs](https://docs.python.org/2/library/re.html#re.escape)
 - Ruby: Regexp.escape(str) - see [the docs](http://ruby-doc.org/core-2.2.0/Regexp.html#method-c-escape)
 - Java: Pattern.quote(str) - see [the docs](http://docs.oracle.com/javase/7/docs/api/java/util/regex/Pattern.html#quote(java.lang.String))
 - C#, VB.NET: Regex.Escape(str) - see [the docs](https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regex.escape(v=vs.110).aspx)

Note that the languages differ in what they do - (perl does something different from C#) but they all have the same goal. 

## Proposed Solution

We propose the addition of an `RegExp.escape` function, such that strings can be escaped in order to be used inside regular expressions:

```js
var str = prompt("Please enter a string");
str = RegExp.escape(str);
alert(ourLongText.replace(new RegExp(str, "g")); // handles reg exp special tokens with the replacement.
```

There is initial previous work here: https://gist.github.com/kangax/9698100 we'll base our proposal on top of that one. 

##FAQ

##Usage Examples
