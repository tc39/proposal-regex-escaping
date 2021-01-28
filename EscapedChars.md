## List of Escaped Characters

This file contains a list of escaped characters under this proposal. Each character details the reason it is escaped.

### `SyntaxCharacter` Proposal

This proposal is currently the primary proposal and escapes characters under the `SyntaxCharacter` class 
in the ES2015 specification. The characters included in the list are the following:

|Character  | Why escape it?
|-----------|--------------|
| `^`       | So that `new RegExp(RegExp.escape('^') + "a")` will match `"^a"` rather than the `^` being treated as a negation or start of sentence control construct. | 
| `$`       | So that `new RegExp("a" + RegExp.escape('$'))` will match `"a$"` rather than the `$` being treated as a end of sentence control construct. | 
| `\`       | So that `new RegExp(RegExp.escape("\\"))` won't throw a type error and instead match `"\\"`, and more generally that `\` won't be treated as an escape control construct. |
| `.`       | So that `new RegExp(RegExp.escape("."))` won't be matched against single characters like `"a"` but instead against an actual dot ("."), and more generally that `.` won't be treated as an "any character" control construct. |
| `*`       | So that `new RegExp(RegExp.escape("*"))` won't throw a type error but instead match against an actual star ("*"), and more generally that `*` won't be treated as a "zero or more times" quantifier. |
| `+`       | So that `new RegExp(RegExp.escape("+"))` won't throw a type error but instead match against an actual plus sign ("+"), and more generally that `+` won't be treated as a "one or more times" quantifier. |
| `?`       | So that `new RegExp(RegExp.escape("?"))` won't throw a type error but instead match against an actual question mark sign ("?"), and more generally that `?` won't be treated as a "once or not at all" quantifier. Also that `new RegExp("("+RegExp.escape("?=")+")")` will match a literal question mark followed by an equals sign, instead of introducing a lookahead, and more generally that `?` won't make groups become assertions or non-capturing. |
| `(`       | So that `new RegExp(RegExp.escape("("))` won't throw a type error but instead match against an actual opening parenthesis  ("("), and more generally that `(` won't be treated as a "start of a capturing group" logical operator. |
| `)`       | So that `new RegExp(RegExp.escape(")"))` won't throw a type error but instead match against an actual closing parenthesis  (")"), and more generally that `)` won't be treated as a "end of a capturing group" logical operator. |
| `[`       | So that `new RegExp(RegExp.escape("["))` won't throw a type error but instead match against an actual opening bracket ("["), and more generally that `[` won't be treated as a "start of a character class" construct. |
| `]`       | This construct is needed to allow escaping inside character classes. `new RegExp("]")` is perfectly valid but we want to allow `new RegExp("["+RegExp.escape("]...")+"]")` in which the `]` needs to be taken literally (and not as the closing "end of character class" character.  |
| `{`       | So that `new RegExp("a" + RegExp.escape("{1,2}"))` will not match `"aaa"`, and more generally that `{` is taken literally and not as a quantifier. | 
| `}`       | So that `new RegExp("a" + RegExp.escape("{1,2}"))` will not match `"aaa"`, and more generally that `}` is taken literally and not as a quantifier. | 
| <code>&#124;</code>       | So that <code>&#124;</code> will be treated literally and <code>new RegExp(Regxp.escape("a&#124;b"))</code> will produce a string that matches <code>"a&#124;b"</code> instead of the <code>&#124;</code> being treated as the alternative operator. |


### "Safe with extra escape set" Proposal.

This proposal additionally escapes `-` for context sensitive inside-character-class matching, hex numeric literals (0-9a-f) at the start of the string in order to avoid hitting matching groups and lookahead/lookbehind control characters.

|Character  | Why escape it?
|-----------|--------------|
| `-`       | This construct is needed to allow escaping inside character classes. `new RegExp("-")` is perfectly valid but we want to allow `new RegExp("[a"+RegExp.escape("-")+"b]")` in which the `-` needs to be taken literally (and not as a character range character).   |

And __only at the start__ of strings: 

|Character  | Why escape it?
|-----------|--------------|
| `0-9`     | So that in `new RegExp("(foo)\\1" + RegExp.escape(1))` the back reference will still treat the first group and not the 11th and the `1` will be taken literally - see [this issue](https://github.com/benjamingr/RegExp.escape/issues/17) for more details.   | 
| `0-9a-fA-F` | So that `new RegExp("\\u004" + RegExp.escape("A"), "u")` will not match the letter "J" (`\u004A`) but rather throw a type error (or that without the `u` flag, the sequence "u004A" would be matched, `\u` being an identity escape), or more generally that a leading hexadecimal character may not extend a preceding escape sequence - see [this issue](https://github.com/benjamingr/RegExp.escape/issues/29) for more details.   | 

Note that if we ever introduce named capturing groups to a subclass of the default `RegExp` those would also need to escape those characters. 

### Extended "Safe" Proposal

This proposal escapes a maximal set of characters and ensures compatibility with edge cases like passing the result to `eval`.

|Character  | Why escape it?
|-----------|--------------|
| `/`       | So that `eval("/"+RegExp.escape("/")+"/")` will produce a valid regular expression. More generally so that regular expressions will be passable to `eval` if sent from elsewhere with `/`. Note that [data](https://github.com/benjamingr/RegExp.escape/tree/master/data) indicates this is not a common use case. |
| [`WhiteSpace`](http://www.ecma-international.org/ecma-262/6.0/index.html#table-32) | So that `eval("/"+RegExp.escape("\r\n")+"/")` will produce a valid regular expression. More generally so that regular expressions will be passable to `eval` if sent from elsewhere with `/`. Also improves readability of the `escape` output. See [this issue](https://github.com/benjamingr/RegExp.escape/issues/30) for more details. Note that [data](https://github.com/benjamingr/RegExp.escape/tree/master/data) indicates this is not a common use case. |
