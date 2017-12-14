# `RegExp.escape` Proposal

Proposal for adding a `RegExp.escape` method to the ECMAScript standard.

[Formal specification](http://benjamingr.github.io/RegExp.escape/)

## Status

This proposal is a [stage 0 (strawman) proposal](https://docs.google.com/document/d/1QbEE0BsO4lvl7NFTn5WXWeiEIBfaVUF7Dk0hpPpPDzU/edit#) and is awaiting implementation and more input. Please see [the issues](https://github.com/benjamingr/RegExp.escape/issues) on how to get involved.


## Motivation

It is often the case when we want to build a regular expression out of a string without treating special characters from the string as special regular expression tokens. For example, if we want to replace all occurrences of the the string `let text = "Hello."` which we got from the user, we might be tempted to do `ourLongText.replace(new RegExp(text, "g"))`. However, this would match `.` against any character rather than matching it against a dot.

This is commonly-desired functionality, as can be seen from [this years-old es-discuss thread](https://esdiscuss.org/topic/regexp-escape). Standardizing it would be very useful to developers, and avoid subpar implementations they might create that could miss edge cases.


## Proposed solution and usage examples

We propose the addition of an `RegExp.escape` function, such that strings can be escaped in order to be used inside regular expressions:

```js
var str = prompt("Please enter a string");
str = RegExp.escape(str);
alert(ourLongText.replace(new RegExp(str, "g")); // handles reg exp special tokens with the replacement.
```

```js
RegExp.escape("The Quick Brown Fox"); // "The Quick Brown Fox"
RegExp.escape("Buy it. use it. break it. fix it.") // "Buy it\. use it\. break it\. fix it\."
RegExp.escape("(*.*)"); // "\(\*\.\*\)"
RegExp.escape("｡^･ｪ･^｡") // "｡\^･ｪ･\^｡"
RegExp.escape("😊 *_* +_+ ... 👍"); // "😊 \*_\* \+_\+ \.\.\. 👍"
RegExp.escape("\d \D (?:)"); // "\\d \\D \(\?\:\)"
```

## Cross-cutting concerns

The list of escaped identifiers should be kept in sync with what the regular expression grammar considers to be syntax characters that need escaping. For this reason, instead of hard-coding the list of escaped characters, we escape characters that are recognized as `SyntaxCharacter`s by the engine. For example, if regexp comments are ever added to the specification (presumably under a flag), this ensures that they are properly escaped.


## In other languages

 - Perl: [quotemeta(str)](http://perldoc.perl.org/functions/quotemeta.html)
 - PHP: [preg_quote(str)](http://php.net/manual/en/function.preg-quote.php)
 - Python: [re.escape(str)](https://docs.python.org/3/library/re.html#re.escape)
 - Ruby: [Regexp.escape(str)](http://ruby-doc.org/core-2.2.0/Regexp.html#method-c-escape)
 - Java: [Pattern.quote(str)](http://docs.oracle.com/javase/7/docs/api/java/util/regex/Pattern.html#quote(java.lang.String))
 - .NET: [Regex.Escape(str)](https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regex.escape.aspx)

Note that the languages differ in what they do (e.g. Perl does something different from C#), but they all have the same goal.

We've had [a meeting about this subject](https://github.com/benjamingr/RegExp.escape/blob/master/data/other_languages/discussions.md), whose notes include a more detailed writeup of what other languages do, and the pros and cons thereof.


## FAQ

*   **Why not escape every character?**

    Other languages that have done this regretted this choice because of the readability impact and string size. More imformation on why other languages have moved from this in the data folder under /other_languages.

*   **Why is each escaped character escaped?**

    See [the EscapedChars.md](https://github.com/benjamingr/RegExp.escape/blob/master/EscapedChars.md) file for a detailed per-character description.

*   **What about the `/` character?**

    Empirical data has been collected (see the /data folder) from about a hundred thousand code bases (most popular sites, most popular packages, most depended on packages and Q&A sites) and it was found out that its use case (for `eval`) was not common enough to justify addition.
    
*   **What about the `,` character?**

The one obscure case where this could suggest a cause for escaping, avoiding a range for user-supplied numbers in `new RegExp('a{'+ RegExp.escape('3,5') + '}')`, does not lead to any clearly safer results with escaping, as doing so will cause the sequence `{3\,5}` to be treated as a literal (rather than say throwing with bad input that an application could recover from).

*   **How is Unicode handled?**

    This proposal deals with code points and not code units, so further extensions and dealing with Unicode is done.

*   **What about `RegExp.unescape`?**

    While some other languages provide an unescape method we choose to defer discussion about it to a later point, mainly because no evidence of people asking for it has been found (while `RegExp.escape` is commonly asked for).

*   **How does this relate to EscapeRegExpPattern?**

    EscapeRegExpPattern (as the name implies) takes a pattern and escapes it so that it can be represented as a string. What `RegExp.escape` does is take a string and escapes it so it can be literally represented as a pattern. The two do not need to share an escaped set and we can't use one for the other. We're discussing renaming EscapeRegExpPattern in the spec in the future to avoid confusion for readers.

*   **Why don't you do X?**

    If you believe there is a concern that was not addressed yet, please [open an issue](https://github.com/benjamingr/RexExp.escape/issues).
