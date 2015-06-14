This file is an ongoing effort to find usages of regex in `eval`s in order to establish whether or not this proposal should address this and escape `"/"` or not.

Strategy:
--------

 - Search 100000 websites
 - ---Search NPM repositories---
 - Search GitHub Code with repo search
 
Websites
------

NPM 
--------

Top repositories from 'most dependent on' and 'most stars' NPM downloaded ([list of repositories](https://github.com/benjamingr/RexExp.escape/blob/master/data/raw/npm/scanned-repos.txt)). Then each repository was cloned via `git clone` and scanned for files with `eval` ([script here](https://github.com/benjamingr/RexExp.escape/blob/master/data/raw/download-files-with-eval-from-npm-10k.js)). Then each file containing `eval` eas processed again for checking that it indeed evaling a regular expression and not a string ([script here](https://github.com/benjamingr/RexExp.escape/blob/master/data/raw/search-downloaded-files-for-abuser.js)).

Not a single repository from the most dependent on or most starred in NPM contained a regular expression with `"/"`.

GitHub
--------
Methodology: top 100 page results for searching for "regex eval" "eval" and "eval re" combined.

Repositories:

| Repository        | Stars           | Maintained |
| ----------------- |:---------------:| ----------:|
| [bluefirex/expression-tidesdk](https://github.com/bluefirex/expression-tidesdk/blob/aa317bdeae99e2187a1e7b30e332f1fb3ada7bd1/dist/osx/Expression.app/Contents/Resources/js/replace.js) | 4 | no |
