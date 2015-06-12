// polyfill for RegExp.escape
if(!RegExp.escape){
    RegExp.escape = function(s){
      return s.replace(/[\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
}
