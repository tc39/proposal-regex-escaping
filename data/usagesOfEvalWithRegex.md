This file is an ongoing effort to find usages of regex in `eval`s in order to establish whether or not this proposal should address this and escape `"/"` or not.

Strategy:
--------

 - Search 100000 websites
 - Search NPM repositories
 - Search GitHub Code with repo search
 
Websites
------

NPM 
--------

GitHub
--------
Methodology: top 100 page results for searching for "regex eval" "eval" and "eval re" combined.

Repositories:

| Repository        | Stars           | Maintained |
| ----------------- |:---------------:| ----------:|
| [bluefirex/expression-tidesdk](https://github.com/bluefirex/expression-tidesdk/blob/aa317bdeae99e2187a1e7b30e332f1fb3ada7bd1/dist/osx/Expression.app/Contents/Resources/js/replace.js) | 4 | no |
