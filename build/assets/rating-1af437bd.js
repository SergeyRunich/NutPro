import{r as _,dv as ee,a7 as W}from"./index-c20b5e8e.js";var V={},te={get exports(){return V},set exports(A){V=A}};(function(A){A.exports=function(d){var m={};function e(n){if(m[n])return m[n].exports;var i=m[n]={exports:{},id:n,loaded:!1};return d[n].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}return e.m=d,e.c=m,e.p="",e(0)}([function(d,m,e){d.exports=e(1)},function(d,m,e){Object.defineProperty(m,"__esModule",{value:!0});function n(o){return o&&o.__esModule?o:{default:o}}var i=e(2),v=n(i);m.default=v.default,d.exports=m.default},function(d,m,e){Object.defineProperty(m,"__esModule",{value:!0});var n=Object.assign||function(r){for(var l=1;l<arguments.length;l++){var w=arguments[l];for(var y in w)Object.prototype.hasOwnProperty.call(w,y)&&(r[y]=w[y])}return r};m.default=f;function i(r){return r&&r.__esModule?r:{default:r}}function v(r,l){var w={};for(var y in r)l.indexOf(y)>=0||Object.prototype.hasOwnProperty.call(r,y)&&(w[y]=r[y]);return w}var o=e(3),p=e(4),a=i(p),s=e(14),c=e(15),g=i(c);f.propTypes={activeClassName:a.default.string,activeIndex:a.default.number,activeStyle:a.default.object,autoEscape:a.default.bool,className:a.default.string,findChunks:a.default.func,highlightClassName:a.default.oneOfType([a.default.object,a.default.string]),highlightStyle:a.default.object,highlightTag:a.default.oneOfType([a.default.node,a.default.func,a.default.string]),sanitize:a.default.func,searchWords:a.default.arrayOf(a.default.oneOfType([a.default.string,a.default.instanceOf(RegExp)])).isRequired,textToHighlight:a.default.string.isRequired,unhighlightClassName:a.default.string,unhighlightStyle:a.default.object};function f(r){var l=r.activeClassName,w=l===void 0?"":l,y=r.activeIndex,T=y===void 0?-1:y,h=r.activeStyle,j=r.autoEscape,I=r.caseSensitive,N=I===void 0?!1:I,z=r.className,J=r.findChunks,D=r.highlightClassName,L=D===void 0?"":D,q=r.highlightStyle,G=q===void 0?{}:q,B=r.highlightTag,Q=B===void 0?"mark":B,K=r.sanitize,M=r.searchWords,Y=r.textToHighlight,k=r.unhighlightClassName,F=k===void 0?"":k,X=r.unhighlightStyle,Z=v(r,["activeClassName","activeIndex","activeStyle","autoEscape","caseSensitive","className","findChunks","highlightClassName","highlightStyle","highlightTag","sanitize","searchWords","textToHighlight","unhighlightClassName","unhighlightStyle"]),t=(0,o.findAll)({autoEscape:j,caseSensitive:N,findChunks:J,sanitize:K,searchWords:M,textToHighlight:Y}),u=Q,E=-1,C="",b=void 0,$=function(S){var P={};for(var R in S)P[R.toLowerCase()]=S[R];return P},O=(0,g.default)($);return(0,s.createElement)("span",n({className:z},Z,{children:t.map(function(x,S){var P=Y.substr(x.start,x.end-x.start);if(x.highlight){E++;var R=void 0;typeof L=="object"?N?R=L[P]:(L=O(L),R=L[P.toLowerCase()]):R=L;var H=E===+T;C=R+" "+(H?w:""),b=H===!0&&h!=null?Object.assign({},G,h):G;var U={children:P,className:C,key:S,style:b};return typeof u!="string"&&(U.highlightIndex=E),(0,s.createElement)(u,U)}else return(0,s.createElement)("span",{children:P,className:F,key:S,style:X})})}))}d.exports=m.default},function(d,m){d.exports=function(e){var n={};function i(v){if(n[v])return n[v].exports;var o=n[v]={exports:{},id:v,loaded:!1};return e[v].call(o.exports,o,o.exports,i),o.loaded=!0,o.exports}return i.m=e,i.c=n,i.p="",i(0)}([function(e,n,i){e.exports=i(1)},function(e,n,i){Object.defineProperty(n,"__esModule",{value:!0});var v=i(2);Object.defineProperty(n,"combineChunks",{enumerable:!0,get:function(){return v.combineChunks}}),Object.defineProperty(n,"fillInChunks",{enumerable:!0,get:function(){return v.fillInChunks}}),Object.defineProperty(n,"findAll",{enumerable:!0,get:function(){return v.findAll}}),Object.defineProperty(n,"findChunks",{enumerable:!0,get:function(){return v.findChunks}})},function(e,n){Object.defineProperty(n,"__esModule",{value:!0}),n.findAll=function(c){var g=c.autoEscape,f=c.caseSensitive,r=f===void 0?!1:f,l=c.findChunks,w=l===void 0?v:l,y=c.sanitize,T=c.searchWords,h=c.textToHighlight;return o({chunksToHighlight:i({chunks:w({autoEscape:g,caseSensitive:r,sanitize:y,searchWords:T,textToHighlight:h})}),totalLength:h?h.length:0})};var i=n.combineChunks=function(c){var g=c.chunks;return g=g.sort(function(f,r){return f.start-r.start}).reduce(function(f,r){if(f.length===0)return[r];var l=f.pop();if(r.start<=l.end){var w=Math.max(l.end,r.end);f.push({start:l.start,end:w})}else f.push(l,r);return f},[]),g},v=function(c){var g=c.autoEscape,f=c.caseSensitive,r=c.sanitize,l=r===void 0?p:r,w=c.searchWords,y=c.textToHighlight;return y=l(y),w.filter(function(T){return T}).reduce(function(T,h){h=l(h),g&&(h=a(h));for(var j=new RegExp(h,f?"g":"gi"),I=void 0;I=j.exec(y);){var N=I.index,z=j.lastIndex;z>N&&T.push({start:N,end:z}),I.index==j.lastIndex&&j.lastIndex++}return T},[])};n.findChunks=v;var o=n.fillInChunks=function(c){var g=c.chunksToHighlight,f=c.totalLength,r=[],l=function(T,h,j){h-T>0&&r.push({start:T,end:h,highlight:j})};if(g.length===0)l(0,f,!1);else{var w=0;g.forEach(function(y){l(w,y.start,!1),l(y.start,y.end,!0),w=y.end}),l(w,f,!1)}return r};function p(s){return s}function a(s){return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}}])},function(d,m,e){(function(n){d.exports=e(13)()}).call(m,e(5))},function(d,m){var e=d.exports={},n,i;function v(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?n=setTimeout:n=v}catch{n=v}try{typeof clearTimeout=="function"?i=clearTimeout:i=o}catch{i=o}})();function p(T){if(n===setTimeout)return setTimeout(T,0);if((n===v||!n)&&setTimeout)return n=setTimeout,setTimeout(T,0);try{return n(T,0)}catch{try{return n.call(null,T,0)}catch{return n.call(this,T,0)}}}function a(T){if(i===clearTimeout)return clearTimeout(T);if((i===o||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(T);try{return i(T)}catch{try{return i.call(null,T)}catch{return i.call(this,T)}}}var s=[],c=!1,g,f=-1;function r(){!c||!g||(c=!1,g.length?s=g.concat(s):f=-1,s.length&&l())}function l(){if(!c){var T=p(r);c=!0;for(var h=s.length;h;){for(g=s,s=[];++f<h;)g&&g[f].run();f=-1,h=s.length}g=null,c=!1,a(T)}}e.nextTick=function(T){var h=new Array(arguments.length-1);if(arguments.length>1)for(var j=1;j<arguments.length;j++)h[j-1]=arguments[j];s.push(new w(T,h)),s.length===1&&!c&&p(l)};function w(T,h){this.fun=T,this.array=h}w.prototype.run=function(){this.fun.apply(null,this.array)},e.title="browser",e.browser=!0,e.env={},e.argv=[],e.version="",e.versions={};function y(){}e.on=y,e.addListener=y,e.once=y,e.off=y,e.removeListener=y,e.removeAllListeners=y,e.emit=y,e.prependListener=y,e.prependOnceListener=y,e.listeners=function(T){return[]},e.binding=function(T){throw new Error("process.binding is not supported")},e.cwd=function(){return"/"},e.chdir=function(T){throw new Error("process.chdir is not supported")},e.umask=function(){return 0}},function(d,m,e){(function(n){var i=e(7),v=e(8),o=e(9),p=e(10),a=e(11),s=e(12);d.exports=function(c,g){var f=typeof Symbol=="function"&&Symbol.iterator,r="@@iterator";function l(t){var u=t&&(f&&t[f]||t[r]);if(typeof u=="function")return u}var w="<<anonymous>>",y={array:I("array"),bool:I("boolean"),func:I("function"),number:I("number"),object:I("object"),string:I("string"),symbol:I("symbol"),any:N(),arrayOf:z,element:J(),instanceOf:D,node:B(),objectOf:q,oneOf:L,oneOfType:G,shape:Q,exact:K};function T(t,u){return t===u?t!==0||1/t===1/u:t!==t&&u!==u}function h(t){this.message=t,this.stack=""}h.prototype=Error.prototype;function j(t){function u(C,b,$,O,x,S,P){return O=O||w,S=S||$,P!==a&&g&&v(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"),b[$]==null?C?b[$]===null?new h("The "+x+" `"+S+"` is marked as required "+("in `"+O+"`, but its value is `null`.")):new h("The "+x+" `"+S+"` is marked as required in "+("`"+O+"`, but its value is `undefined`.")):null:t(b,$,O,x,S)}var E=u.bind(null,!1);return E.isRequired=u.bind(null,!0),E}function I(t){function u(E,C,b,$,O,x){var S=E[C],P=k(S);if(P!==t){var R=F(S);return new h("Invalid "+$+" `"+O+"` of type "+("`"+R+"` supplied to `"+b+"`, expected ")+("`"+t+"`."))}return null}return j(u)}function N(){return j(i.thatReturnsNull)}function z(t){function u(E,C,b,$,O){if(typeof t!="function")return new h("Property `"+O+"` of component `"+b+"` has invalid PropType notation inside arrayOf.");var x=E[C];if(!Array.isArray(x)){var S=k(x);return new h("Invalid "+$+" `"+O+"` of type "+("`"+S+"` supplied to `"+b+"`, expected an array."))}for(var P=0;P<x.length;P++){var R=t(x,P,b,$,O+"["+P+"]",a);if(R instanceof Error)return R}return null}return j(u)}function J(){function t(u,E,C,b,$){var O=u[E];if(!c(O)){var x=k(O);return new h("Invalid "+b+" `"+$+"` of type "+("`"+x+"` supplied to `"+C+"`, expected a single ReactElement."))}return null}return j(t)}function D(t){function u(E,C,b,$,O){if(!(E[C]instanceof t)){var x=t.name||w,S=Z(E[C]);return new h("Invalid "+$+" `"+O+"` of type "+("`"+S+"` supplied to `"+b+"`, expected ")+("instance of `"+x+"`."))}return null}return j(u)}function L(t){if(!Array.isArray(t))return i.thatReturnsNull;function u(E,C,b,$,O){for(var x=E[C],S=0;S<t.length;S++)if(T(x,t[S]))return null;var P=JSON.stringify(t);return new h("Invalid "+$+" `"+O+"` of value `"+x+"` "+("supplied to `"+b+"`, expected one of "+P+"."))}return j(u)}function q(t){function u(E,C,b,$,O){if(typeof t!="function")return new h("Property `"+O+"` of component `"+b+"` has invalid PropType notation inside objectOf.");var x=E[C],S=k(x);if(S!=="object")return new h("Invalid "+$+" `"+O+"` of type "+("`"+S+"` supplied to `"+b+"`, expected an object."));for(var P in x)if(x.hasOwnProperty(P)){var R=t(x,P,b,$,O+"."+P,a);if(R instanceof Error)return R}return null}return j(u)}function G(t){if(!Array.isArray(t))return i.thatReturnsNull;for(var u=0;u<t.length;u++){var E=t[u];if(typeof E!="function")return o(!1,"Invalid argument supplied to oneOfType. Expected an array of check functions, but received %s at index %s.",X(E),u),i.thatReturnsNull}function C(b,$,O,x,S){for(var P=0;P<t.length;P++){var R=t[P];if(R(b,$,O,x,S,a)==null)return null}return new h("Invalid "+x+" `"+S+"` supplied to "+("`"+O+"`."))}return j(C)}function B(){function t(u,E,C,b,$){return M(u[E])?null:new h("Invalid "+b+" `"+$+"` supplied to "+("`"+C+"`, expected a ReactNode."))}return j(t)}function Q(t){function u(E,C,b,$,O){var x=E[C],S=k(x);if(S!=="object")return new h("Invalid "+$+" `"+O+"` of type `"+S+"` "+("supplied to `"+b+"`, expected `object`."));for(var P in t){var R=t[P];if(R){var H=R(x,P,b,$,O+"."+P,a);if(H)return H}}return null}return j(u)}function K(t){function u(E,C,b,$,O){var x=E[C],S=k(x);if(S!=="object")return new h("Invalid "+$+" `"+O+"` of type `"+S+"` "+("supplied to `"+b+"`, expected `object`."));var P=p({},E[C],t);for(var R in P){var H=t[R];if(!H)return new h("Invalid "+$+" `"+O+"` key `"+R+"` supplied to `"+b+"`.\nBad object: "+JSON.stringify(E[C],null,"  ")+`
Valid keys: `+JSON.stringify(Object.keys(t),null,"  "));var U=H(x,R,b,$,O+"."+R,a);if(U)return U}return null}return j(u)}function M(t){switch(typeof t){case"number":case"string":case"undefined":return!0;case"boolean":return!t;case"object":if(Array.isArray(t))return t.every(M);if(t===null||c(t))return!0;var u=l(t);if(u){var E=u.call(t),C;if(u!==t.entries){for(;!(C=E.next()).done;)if(!M(C.value))return!1}else for(;!(C=E.next()).done;){var b=C.value;if(b&&!M(b[1]))return!1}}else return!1;return!0;default:return!1}}function Y(t,u){return t==="symbol"||u["@@toStringTag"]==="Symbol"||typeof Symbol=="function"&&u instanceof Symbol}function k(t){var u=typeof t;return Array.isArray(t)?"array":t instanceof RegExp?"object":Y(u,t)?"symbol":u}function F(t){if(typeof t>"u"||t===null)return""+t;var u=k(t);if(u==="object"){if(t instanceof Date)return"date";if(t instanceof RegExp)return"regexp"}return u}function X(t){var u=F(t);switch(u){case"array":case"object":return"an "+u;case"boolean":case"date":case"regexp":return"a "+u;default:return u}}function Z(t){return!t.constructor||!t.constructor.name?w:t.constructor.name}return y.checkPropTypes=s,y.PropTypes=y,y}}).call(m,e(5))},function(d,m){function e(i){return function(){return i}}var n=function(){};n.thatReturns=e,n.thatReturnsFalse=e(!1),n.thatReturnsTrue=e(!0),n.thatReturnsNull=e(null),n.thatReturnsThis=function(){return this},n.thatReturnsArgument=function(i){return i},d.exports=n},function(d,m,e){(function(n){function i(v,o,p,a,s,c,g,f){if(!v){var r;if(o===void 0)r=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[p,a,s,c,g,f],w=0;r=new Error(o.replace(/%s/g,function(){return l[w++]})),r.name="Invariant Violation"}throw r.framesToPop=1,r}}d.exports=i}).call(m,e(5))},function(d,m,e){(function(n){var i=e(7),v=i;d.exports=v}).call(m,e(5))},function(d,m){var e=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;function v(p){if(p==null)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(p)}function o(){try{if(!Object.assign)return!1;var p=new String("abc");if(p[5]="de",Object.getOwnPropertyNames(p)[0]==="5")return!1;for(var a={},s=0;s<10;s++)a["_"+String.fromCharCode(s)]=s;var c=Object.getOwnPropertyNames(a).map(function(f){return a[f]});if(c.join("")!=="0123456789")return!1;var g={};return"abcdefghijklmnopqrst".split("").forEach(function(f){g[f]=f}),Object.keys(Object.assign({},g)).join("")==="abcdefghijklmnopqrst"}catch{return!1}}d.exports=o()?Object.assign:function(p,a){for(var s,c=v(p),g,f=1;f<arguments.length;f++){s=Object(arguments[f]);for(var r in s)n.call(s,r)&&(c[r]=s[r]);if(e){g=e(s);for(var l=0;l<g.length;l++)i.call(s,g[l])&&(c[g[l]]=s[g[l]])}}return c}},function(d,m){var e="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";d.exports=e},function(d,m,e){(function(n){function i(v,o,p,a,s){}d.exports=i}).call(m,e(5))},function(d,m,e){var n=e(7),i=e(8),v=e(11);d.exports=function(){function o(s,c,g,f,r,l){l!==v&&i(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}o.isRequired=o;function p(){return o}var a={array:o,bool:o,func:o,number:o,object:o,string:o,symbol:o,any:o,arrayOf:p,element:o,instanceOf:p,node:o,objectOf:p,oneOf:p,oneOfType:p,shape:p,exact:p};return a.checkPropTypes=n,a.PropTypes=a,a}},function(d,m){d.exports=_},function(d,m){var e=function(v,o){return v===o};function n(i){var v=arguments.length>1&&arguments[1]!==void 0?arguments[1]:e,o=void 0,p=[],a=void 0,s=!1,c=function(r,l){return v(r,p[l])},g=function(){for(var r=arguments.length,l=Array(r),w=0;w<r;w++)l[w]=arguments[w];return s&&o===this&&l.length===p.length&&l.every(c)||(s=!0,o=this,p=l,a=i.apply(this,l)),a};return g}d.exports=n}])})(te);const re=ee(V),ie=async(A="rating",d=0,m="",e="",n=!0,i="all",v=!1,o=0,p=5,a="",s)=>{const c={method:"GET",endpoint:`/admin/${A==="customer"?"ratings-by-customers":"ratings"}?type=all&min=${d}&diet=${m}&isCzech=${e}&isIgnored=${n}&kitchen=${i}&isOnlyReview=${v}&minScore=${o}&maxScore=${p}&tags=${a}&ignoreTags=${s}`};return W(c).fetch()},ae=async()=>W({method:"GET",endpoint:"/admin/ratings-ignored-list"}).fetch(),oe=async()=>W({method:"GET",endpoint:"/erp/techcard/tags "}).fetch(),ue=async(A="rating",d,m,e=0,n="",i="",v=!0,o="all",p=!1,a=0,s=5,c="",g)=>{const f={method:"GET",endpoint:`/admin/${A==="customer"?"ratings-by-customers":"ratings"}?type=period&start=${d}&end=${m}&min=${e}&diet=${n}&isCzech=${i}&isIgnored=${v}&kitchen=${o}&isOnlyReview=${p}&minScore=${a}&maxScore=${s}&tags=${c}&ignoreTags=${g}`};return W(f).fetch()},se=async(A="rating",d,m=0,e="",n="",i=!0,v="all",o=!1,p=0,a=5,s="",c)=>{const g={method:"GET",endpoint:`/admin/${A==="customer"?"ratings-by-customers":"ratings"}?type=day&day=${d}&min=${m}&diet=${e}&isCzech=${n}&isIgnored=${i}&kitchen=${v}&isOnlyReview=${o}&minScore=${p}&maxScore=${a}&tags=${s}&ignoreTags=${c}`};return W(g).fetch()};export{re as H,ae as a,oe as b,se as c,ie as d,ue as g};
