import { c as createComponent, r as renderTemplate, a as renderSlot, b as renderHead, d as addAttribute, e as createAstro } from './astro/server_DwTpAVbE.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                           */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<script>\n  const getThemePreference = () => {\n    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {\n      return localStorage.getItem("theme");\n    }\n    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";\n  };\n  const isDark = getThemePreference() === "dark";\n  document.documentElement.classList[isDark ? "add" : "remove"]("dark");\n\n  if (typeof localStorage !== "undefined") {\n    const observer = new MutationObserver(() => {\n      const isDark = document.documentElement.classList.contains("dark");\n      localStorage.setItem("theme", isDark ? "dark" : "light");\n    });\n    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });\n  }\n<\/script> <html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><title>", "</title>", "</head> <body> ", ' <noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade"></noscript> <script src="./node_modules/preline/preline.js"><\/script> <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"><\/script> </body> </html>'])), addAttribute(Astro2.generator, "content"), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "D:/Pemrograman/portfolio/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
