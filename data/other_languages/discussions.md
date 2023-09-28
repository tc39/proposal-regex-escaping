Meeting 19.06.2015 

Uri Shaked

Elad Katz

Benjamin Gruenbaum

----------

Other languages and RegExp.escape:

## Perl

[Perl](http://perldoc.perl.org/functions/quotemeta.html) escapes every character that is not alphanumeric. This however changes with UTF-8 strings. For which Perl only gives the guarantee

> Perl promises, that if we ever add regular expression pattern metacharacters to the dozen already defined `(\ | ( ) [ { ^ $ * + ? . )`, that we will only use ones that have the Pattern_Syntax property. Perl also promises, that if we ever add characters that are considered to be white space in regular expressions (currently mostly affected by /x), they will all have the Pattern_White_Space property.

As an interesting point, RegExp grammar can add flags (like `/x` in the future) but RegExp.escape will not be able to react to these changes.

In both cases - **this means that RegExp.escape can't guarantee the length of the returned string** between versions of ECMAScript that make extensions to the grammar. 

## PHP

> `preg_quote()` takes str and puts a backslash in front of every character that is part of the regular expression syntax. This is useful if you have a run-time string that you need to match in some text and the string may contain special regex characters.

First of all - PHP is underspecified but the docs indicate that `. \ + * ? [ ^ ] $ ( ) { } = ! < > | : -` are escaped. 

In addition to the current proposal, they escape `! < > : - =` which are context-sentitve parts. That is, they escape characters that might make parts of lookaheads, lookbehinds and ranges. 

Out of these things, `! : -` seems relevant for the ES syntax and should be independently considered. There is current discussion about context sensitive identifiers in https://github.com/benjamingr/RegExp.escape/issues/17 . They also provide a flag for escaping `/` which we find a poor design choice.

## Python

> Escape all the characters in pattern except ASCII letters, numbers and '_'. This is useful if you want to match an arbitrary literal string that may have regular expression metacharacters in it.

> Changed in version 3.3: The '_' character is no longer escaped.

Note that Python introduces a breaking change in this method - which is interesting. The fact they got away with changing the escape set late means users did not rely on the specific set (checking .length (len) for example). 

Here is the bug: https://bugs.python.org/issue2650

**Python escapes all characters except ascii alphanumeric but they agree it was a poor choice**. In retrospect, they had to opt-out a character for more readability. See the issue for more discussion. https://hg.python.org/cpython/file/af793c7580f1/Lib/re.py#l242

There is a Python bug in 2.7.6, escaping `u"💩"` returns `u'\\\ud83d\\\udca9'` that is, it escaped each UCS-2/UTF-16 code unit instead of the code point. In 2.7.2 it errors http://repl.it/tRB

(Update, Martijn Pieters pointed this out http://chat.stackoverflow.com/transcript/message/23987063#23987063 ) 

## Ruby

> Escapes any characters that would have special meaning in a regular expression. Returns a new escaped string, or self if no characters are escaped. For any string, Regexp.new(Regexp.escape(str))=~str will be true.

Ruby is underspecified. When we [look for the code](https://github.com/ruby/ruby/blob/bbf440c90b036c733729b1a5c996978ac2adaa9d/re.c#L3107-L3141) we find it.

Their escaped characters are `[ ] { } ( ) | - * . \ ? + ^ $ #` although it is undocumented. The take from here is that they escape comments (#) but do not escape context sensitive characters (like : and <).

## Java

> Returns a literal pattern String for the specified String.
This method produces a String that can be used to create a Pattern that would match the string s as if it were a literal pattern.

> Metacharacters or escape sequences in the input sequence will be given no special meaning.

Java makes no guarantees on what characters it escapes or the length of the returned string only that it can be used "as if it were a literal pattern".

Unlike other languages which escape metacharaters Java escapes the string using \Q and \E which [surprises some people](http://stackoverflow.com/questions/60160/how-to-escape-text-for-regular-expression-in-java#comment19964625_60161) and might give [unexpected results](http://stackoverflow.com/questions/60160/how-to-escape-text-for-regular-expression-in-java#comment29661195_60161). They have special treatment for escaping `\E` itself.

## C#

> Escapes a minimal set of characters (\, *, +, ?, |, {, [, (,), ^, $,., #, and white space) by replacing them with their escape codes. This instructs the regular expression engine to interpret these characters literally rather than as metacharacters.

That is, C# additionally escapes `#` and whitespace but does not escape context sensitive `<` and `:`. The reason whitespace is escaped is that C# has a special regex mode where whitespace is ignored. So escaping whitespace should not be considered for ECMAScript.

An interesting point here is that **C# does not escape `]` and `}`**. Their rationale is that the engine will interperate those literally. We should consider this for ECMAScript, note that is `-` is escaped then it makes sense to also escape `]` and `}` but if it is not escaping them is not really necessary. 

------

Further discussion points:

 - Should we escape `}` and `]`, if we do, do we escape `-`?
 - Because flags are not a part of a RE static method, we inherently can't guarantee the length (no language does). Is this OK?
 - Python thinks escaping all characters is a poor choice (and has new edge cases) and PERL _used_ to escape all characters but doesn't anymore. This should be continued in the "escape all characters" discussion.
 - Some languages escape context sensitive characters but most don't (like <), should we?



