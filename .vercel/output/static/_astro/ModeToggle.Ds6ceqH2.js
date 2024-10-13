import{j as e}from"./utils.B4GG3M-y.js";import{r}from"./index.l2PZgWEW.js";import{a as n,B as c}from"./createLucideIcon.DuDevO_G.js";import{D as m,a as d,b as i,e as o}from"./dropdown-menu.B_J4gFii.js";import"./index.DeZVLsSt.js";import"./index.DY16rmGi.js";/**
 * @license lucide-react v0.452.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=n("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.452.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=n("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);function M(){const[s,t]=r.useState("theme-light");return r.useEffect(()=>{const a=document.documentElement.classList.contains("dark");t(a?"dark":"theme-light")},[]),r.useEffect(()=>{const a=s==="dark"||s==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList[a?"add":"remove"]("dark")},[s]),e.jsxs(m,{children:[e.jsx(d,{asChild:!0,children:e.jsxs(c,{variant:"outline",size:"icon",children:[e.jsx(h,{className:"h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"}),e.jsx(l,{className:"absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"}),e.jsx("span",{className:"sr-only",children:"Toggle theme"})]})}),e.jsxs(i,{align:"end",children:[e.jsx(o,{onClick:()=>t("theme-light"),children:"Light"}),e.jsx(o,{onClick:()=>t("dark"),children:"Dark"}),e.jsx(o,{onClick:()=>t("system"),children:"System"})]})]})}export{M as ModeToggle};
