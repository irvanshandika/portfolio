import{j as N,c as j,S as k}from"./utils.B4GG3M-y.js";import{r as d}from"./index.l2PZgWEW.js";function h(t){var r,e,n="";if(typeof t=="string"||typeof t=="number")n+=t;else if(typeof t=="object")if(Array.isArray(t))for(r=0;r<t.length;r++)t[r]&&(e=h(t[r]))&&(n&&(n+=" "),n+=e);else for(r in t)t[r]&&(n&&(n+=" "),n+=r);return n}function A(){for(var t,r,e=0,n="";e<arguments.length;)(t=arguments[e++])&&(r=h(t))&&(n&&(n+=" "),n+=r);return n}const g=t=>typeof t=="boolean"?"".concat(t):t===0?"0":t,y=A,V=(t,r)=>e=>{var n;if(r?.variants==null)return y(t,e?.class,e?.className);const{variants:s,defaultVariants:o}=r,l=Object.keys(s).map(a=>{const i=e?.[a],c=o?.[a];if(i===null)return null;const u=g(i)||g(c);return s[a][u]}),v=e&&Object.entries(e).reduce((a,i)=>{let[c,u]=i;return u===void 0||(a[c]=u),a},{}),f=r==null||(n=r.compoundVariants)===null||n===void 0?void 0:n.reduce((a,i)=>{let{class:c,className:u,...w}=i;return Object.entries(w).every(C=>{let[b,m]=C;return Array.isArray(m)?m.includes({...o,...v}[b]):{...o,...v}[b]===m})?[...a,c,u]:a},[]);return y(t,l,f,e?.class,e?.className)},p=V("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),B=d.forwardRef(({className:t,variant:r,size:e,asChild:n=!1,...s},o)=>{const l=n?k:"button";return N.jsx(l,{className:j(p({variant:r,size:e,className:t})),ref:o,...s})});B.displayName="Button";/**
 * @license lucide-react v0.452.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),x=(...t)=>t.filter((r,e,n)=>!!r&&n.indexOf(r)===e).join(" ");/**
 * @license lucide-react v0.452.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var O={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.452.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=d.forwardRef(({color:t="currentColor",size:r=24,strokeWidth:e=2,absoluteStrokeWidth:n,className:s="",children:o,iconNode:l,...v},f)=>d.createElement("svg",{ref:f,...O,width:r,height:r,stroke:t,strokeWidth:n?Number(e)*24/Number(r):e,className:x("lucide",s),...v},[...l.map(([a,i])=>d.createElement(a,i)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.452.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=(t,r)=>{const e=d.forwardRef(({className:n,...s},o)=>d.createElement(L,{ref:o,iconNode:r,className:x(`lucide-${E(t)}`,n),...s}));return e.displayName=`${t}`,e};export{B,S as a,V as c};
