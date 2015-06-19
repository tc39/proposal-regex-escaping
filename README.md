# `RegExp.escape` Proposal

Proposal for adding a `RegExp.escape` method to the ECMAScript standard http://benjamingr.github.io/RegExp.escape/.

## Status

This proposal is a [stage 0 (strawman) proposal](https://docs.google.com/document/d/1QbEE0BsO4lvl7NFTn5WXWeiEIBfaVUF7Dk0hpPpPDzU/edit#) and is awaiting implementation and more input.

## Motivation

See [this issue](https://esdiscuss.org/topic/regexp-escape). It is often the case when we want to build a regular expression out of a string without treating special characters from the string as special regular expression tokens. For example if we want to replace all occurrences of the the string `Hello.` which we got from the user we might be tempted to do `ourLongText.replace(new RegExp(text, "g"))` but this would match `.` against any character rather than a dot.

This is a fairly common use in regular expressions and standardizing it would be useful.

In other languages:

 - Perl: quotemeta(str) - see [the docs](http://perldoc.perl.org/functions/quotemeta.html)
 - PHP: preg_quote(str) - see [the docs](http://php.net/manual/en/function.preg-quote.php)
 - Python: re.escape(str) - see [the docs](https://docs.python.org/3/library/re.html#re.escape)
 - Ruby: Regexp.escape(str) - see [the docs](http://ruby-doc.org/core-2.2.0/Regexp.html#method-c-escape)
 - Java: Pattern.quote(str) - see [the docs](http://docs.oracle.com/javase/7/docs/api/java/util/regex/Pattern.html#quote(java.lang.String))
 - C#, VB.NET: Regex.Escape(str) - see [the docs](https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regex.escape.aspx)

Note that the languages differ in what they do - (perl does something different from C#) but they all have the same goal.

## Proposed Solution

We propose the addition of an `RegExp.escape` function, such that strings can be escaped in order to be used inside regular expressions:

```js
var str = prompt("Please enter a string");
str = RegExp.escape(str);
alert(ourLongText.replace(new RegExp(str, "g")); // handles reg exp special tokens with the replacement.
```

There is initial previous work here: https://gist.github.com/kangax/9698100 which includes valuable work we've used. Unlike that proposal this one uses the spec's `SyntaxCharacter` list of characters so updates are in sync with the specificaiton instead of specifying the characters escaped manually.

## Cross-Cutting Concerns

The list of escaped identifiers should be kept in sync with what the regular expressions grammar considers to be syntax characters that need escaping - for this reason instead of hard-coding the list of escaped characters we escape characters that are recognized as a `SyntaxCharacter`s by the engine. For example, if regex comments are ever added to the specification (presumably under a flag) - this ensures they are properly escaped.

## FAQ

*   **What about `"/"`?**

    Empirical data has been collected (see the /data folder) from about a hundred thousand code bases (most popular sites, most popular packages, most depended on packages and Q&A sites) and it was found out that its use case (for `eval`) was not common enough to justify addition.

*   **Why not escape every character?**

    While it would help with future compatibility - It would make strings longer and would make it impossible to unify `RegExp.escape` with `EscapeRegExpString` (internal to the ES specification).

*   **How is unicode handled?**

    This proposal deals with code points and not code units so further extensions and dealing with unicode is done.

*   **Why don't you do X?**

    If you believe there is a concern that was not addressed yet - please [open an issue](https://github.com/benjamingr/RexExp.escape/issues).

*   **What about `unescape`?**

    While some other languages provide an unescape method we choose to defer discussion about it to a later point, mainly because no evidence of people asking for it has been found (while `.escape` is commonly asked for).

## Semantics

### RegExp.escape(S)

When the **escape** function is called with an argument *S* the following steps are taken:

1. Let *str* be [ToString](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring)(*S*).
2. [ReturnIfAbrupt](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-returnifabrupt)(*str*).
3. Let *cpList* be a [List](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-list-and-record-specification-type) containing in order the code points as defined in [6.1.4](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-ecmascript-language-types-string-type) of *str*, starting at the first element of *str*.
4. Let *cuList* be a new [List](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-list-and-record-specification-type).
5. For each code point *c* in *cpList* in List order, do:
 1. If **c** is matched by [*SyntaxCharacter*](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-patterns) then do:
   1. Append code unit 0x005C (REVERSE SOLIDUS) to *cuList*.
 2. Append the elements of the UTF16Encoding (10.1.1) of *c* to *cuList*.
6. Let **L** be a String whose elements are, in order, the elements of *cuList*.
7. Return **L**.

## Usage Examples

```js
RegExp.escape("The Quick Brown Fox"); // "The Quick Brown Fox"
RegExp.escape("Buy it. use it. break it. fix it.") // "Buy it\. use it\. break it\. fix it\."
RegExp.escape("(*.*)"); // "\(\*\.\*\)"
RegExp.escape("｡^･ｪ･^｡") // "｡\^･ｪ･\^｡"
RegExp.escape("😊 *_* +_+ ... 👍"); // "😊 \*_\* \+_\+ \.\.\. 👍"
RegExp.escape("\d \D (?:)"); // "\\d \\D \(\?\:\)"
```
