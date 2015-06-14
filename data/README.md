This file is an ongoing effort to find usages of regex in `eval`s in order to establish whether or not this proposal should address this and escape `"/"` or not.

Strategy:
--------

 - Search 100000 websites
 - Search NPM repositories
 - Search GitHub Code with repo search
 - Search Stack Overflow and tutorials
 
Websites
------

Minifiers: No minifiers (uglify, closure compiler, jsmin, jscompress) break the pattern `var re = eval("/"+pattern+"/")` so it is safe to search for it the same was as on normal sites.

Use http://nerdydata.com/

NPM 
--------

Top repositories from 'most dependent on' and 'most stars' NPM downloaded ([list of repositories](https://github.com/benjamingr/RexExp.escape/blob/master/data/raw/npm/scanned-repos.txt)). Then each repository was cloned via `git clone` and scanned for files with `eval` ([script here](https://github.com/benjamingr/RexExp.escape/blob/master/data/raw/download-files-with-eval-from-npm-10k.js)). Then each file containing `eval` eas processed again for checking that it indeed evaling a regular expression and not a string ([script here](https://github.com/benjamingr/RexExp.escape/blob/master/data/raw/search-downloaded-files-for-abuser.js)).

Not a single repository from the most dependent on or most starred in NPM contained a regular expression with `"/"` passed to eval statically. It is possible (though unlikely) that this is done some place through an indirect eval call (i.e. `var e = eval; e("`) or without string literals - however we assume that if this was the case we would have been able to find direct calls with literals too.


GitHub
--------
Methodology: top 100 page results for searching for "regex eval" "eval" and "eval re" combined. The search was performed through [this script file](https://github.com/benjamingr/RexExp.escape/blob/master/data/raw/scrape-gh-search.js). The raw results are available in the "raw" directory for each search query separately.

Repositories:

| Repository        | Stars           | Maintained |
| ----------------- |:---------------:| ----------:|
| [bluefirex/expression-tidesdk](https://github.com/bluefirex/expression-tidesdk/blob/aa317bdeae99e2187a1e7b30e332f1fb3ada7bd1/dist/osx/Expression.app/Contents/Resources/js/replace.js) | 4 | no |
|HardSkript/master_my.js| 0 | no |
|regexp-lin/2013_2014| 0 | no |
|Zizwar/winoscript | 0 | no |

These are all the relevant repositories containing code that does this sort of RegEx matching.

Stack Overflow and tutorials
--------------------

The following four results were found in code search in StackOverflow, CodeSearch and SymbolHound:

 - http://stackoverflow.com/questions/1428645/search-through-a-big-list-fast-with-jquery
 - http://stackoverflow.com/questions/727261/wrapping-text-using-jquery (copied from the first one)
 - http://stackoverflow.com/questions/4627180/make-an-application-that-displays-text-at-random-that-conforms-to-the-specified
 - http://stackoverflow.com/questions/1215170/javascript-string-replace-with-dynamic-regular-expressions/22038620#22038620
 - http://stackoverflow.com/questions/3498248/need-help-with-modifying-an-existing-regex-search-extension

The following tutorial was also found (only one):
 
  - http://www.trans4mind.com/personal_development/JavaScript/Regular%20Expressions%20Simple%20Usage.htm
