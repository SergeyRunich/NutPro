import{r as l,C as S,i as $,l as C,h as y,ba as D,bb as G,d as H,z as K,bc as L,aJ as M}from"./index-c20b5e8e.js";var Q=function(r,t){var a={};for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&t.indexOf(e)<0&&(a[e]=r[e]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,e=Object.getOwnPropertySymbols(r);o<e.length;o++)t.indexOf(e[o])<0&&Object.prototype.propertyIsEnumerable.call(r,e[o])&&(a[e[o]]=r[e[o]]);return a},U=function(t){var a,e=t.prefixCls,o=t.className,d=t.checked,v=t.onChange,c=t.onClick,g=Q(t,["prefixCls","className","checked","onChange","onClick"]),n=l.useContext(S),u=n.getPrefixCls,p=function(b){v==null||v(!d),c==null||c(b)},f=u("tag",e),m=$(f,(a={},C(a,"".concat(f,"-checkable"),!0),C(a,"".concat(f,"-checkable-checked"),d),a),o);return l.createElement("span",y({},g,{className:m,onClick:p}))};const X=U;var Y=function(r,t){var a={};for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&t.indexOf(e)<0&&(a[e]=r[e]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,e=Object.getOwnPropertySymbols(r);o<e.length;o++)t.indexOf(e[o])<0&&Object.prototype.propertyIsEnumerable.call(r,e[o])&&(a[e[o]]=r[e[o]]);return a},Z=new RegExp("^(".concat(D.join("|"),")(-inverse)?$")),_=new RegExp("^(".concat(G.join("|"),")$")),ee=function(t,a){var e,o=t.prefixCls,d=t.className,v=t.style,c=t.children,g=t.icon,n=t.color,u=t.onClose,p=t.closeIcon,f=t.closable,m=f===void 0?!1:f,s=Y(t,["prefixCls","className","style","children","icon","color","onClose","closeIcon","closable"]),b=l.useContext(S),I=b.getPrefixCls,R=b.direction,z=l.useState(!0),h=H(z,2),W=h[0],k=h[1];l.useEffect(function(){"visible"in s&&k(s.visible)},[s.visible]);var P=function(){return n?Z.test(n)||_.test(n):!1},A=y({backgroundColor:n&&!P()?n:void 0},v),O=P(),i=I("tag",o),F=$(i,(e={},C(e,"".concat(i,"-").concat(n),O),C(e,"".concat(i,"-has-color"),n&&!O),C(e,"".concat(i,"-hidden"),!W),C(e,"".concat(i,"-rtl"),R==="rtl"),e),d),N=function(x){x.stopPropagation(),u==null||u(x),!x.defaultPrevented&&("visible"in s||k(!1))},J=function(){return m?p?l.createElement("span",{className:"".concat(i,"-close-icon"),onClick:N},p):l.createElement(M,{className:"".concat(i,"-close-icon"),onClick:N}):null},V="onClick"in s||c&&c.type==="a",q=K(s,["visible"]),E=g||null,B=E?l.createElement(l.Fragment,null,E,l.createElement("span",null,c)):c,T=l.createElement("span",y({},q,{ref:a,className:F,style:A}),B,J());return V?l.createElement(L,null,T):T},w=l.forwardRef(ee);w.CheckableTag=X;const re=w;export{re as T};
