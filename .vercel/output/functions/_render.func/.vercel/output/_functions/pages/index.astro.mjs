import { c as createComponent, r as renderTemplate, f as renderComponent, e as createAstro } from '../chunks/astro/server_DwTpAVbE.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_C9bsF3sm.mjs';
import { B as Button, $ as $$Navbar } from '../chunks/Navbar_CoM1RtUu.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { ArrowRight } from 'lucide-react';
export { renderers } from '../renderers.mjs';

function HeroSection() {
  return /* @__PURE__ */ jsx("section", { className: "w-full py-12 md:py-24 lg:py-32 xl:py-16 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container px-4 md:px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 overflow-hidden rounded-full border-4 border-primary", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "https://res.cloudinary.com/dszhlpm81/image/upload/v1723633487/assets/UFPMOvuUtfuMxUpG2yy%2BnF743hBOeLEzqjNEDiHixcQ%3D/foto_tyc5yi.jpg",
        alt: "Foto Profil",
        className: "object-cover fill-inherit rounded-full",
        fetchPriority: "high",
        loading: "lazy"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none", children: "Muhammad Irvan Shandika" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-[700px] text-muted-foreground md:text-xl", children: "Web Developer | UI/UX Designer | Promp Engineer" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-[700px] text-muted-foreground md:text-lg", children: "Saya adalah seorang web developer dan UI/UX designer yang berfokus pada pembuatan aplikasi web yang efisien dan mudah digunakan. Saya memiliki pengalaman dalam mengembangkan aplikasi web dengan teknologi modern seperti React, Next.js, dan Tailwind CSS." }),
    /* @__PURE__ */ jsxs("div", { className: "space-x-4", children: [
      /* @__PURE__ */ jsxs(Button, { onClick: () => window.location.href = "/projects", children: [
        "Lihat Proyek",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => window.location.href = "/contact", children: "Hubungi Saya" })
    ] })
  ] }) }) });
}

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home | Portfolio Online" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, { "currentPath": currentPath })} ${renderComponent($$result2, "HeroSection", HeroSection, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/sections/HeroSection", "client:component-export": "default" })} ` })}`;
}, "D:/Pemrograman/portfolio/src/pages/index.astro", void 0);

const $$file = "D:/Pemrograman/portfolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
