import { c as createComponent, r as renderTemplate, f as renderComponent, e as createAstro } from '../chunks/astro/server_DwTpAVbE.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_C9bsF3sm.mjs';
import { c as cn, B as Button, $ as $$Navbar } from '../chunks/Navbar_CoM1RtUu.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { C as Card, a as CardContent } from '../chunks/card_d0V1rxVa.mjs';
import 'react';
import { cva } from 'class-variance-authority';
import { Mail, Download } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

function AboutPage() {
  const skills = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vuejs", "Nextjs", "Nuxtjs", "Astro", "Tailwind CSS", "Bootstrap", "Node.js"];
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-8 text-center", children: "Tentang Saya" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(
          "iframe",
          {
            src: "https://firebasestorage.googleapis.com/v0/b/irvanportfolio.appspot.com/o/Muhammad%20Irvan%20Shandika-resume.pdf?alt=media&token=311dfa29-ec7d-4bb8-bd79-04f94af2d1aa#toolbar=0",
            frameBorder: "0",
            width: 400,
            height: 400,
            className: "rounded-lg shadow-lg mx-auto"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center space-x-4", children: [
          /* @__PURE__ */ jsxs(Button, { onClick: () => window.location.href = "/contact", children: [
            /* @__PURE__ */ jsx(Mail, { className: "mr-2 h-4 w-4" }),
            " Hubungi Saya"
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => window.location.href = "https://firebasestorage.googleapis.com/v0/b/irvanportfolio.appspot.com/o/Muhammad%20Irvan%20Shandika-resume.pdf?alt=media&token=311dfa29-ec7d-4bb8-bd79-04f94af2d1aa&export=download",
              children: [
                /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
                " Unduh CV"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Halo! Saya Muhammad Irvan Shandika" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Saya adalah seorang web developer yang bersemangat dengan pengalaman dalam menciptakan solusi web yang menarik dan fungsional. Dengan latar belakang dalam desain UI/UX dan pengembangan front-end, saya berusaha untuk memadukan estetika dengan fungsionalitas dalam setiap proyek yang saya kerjakan." }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Ketika saya tidak sedang coding, Anda bisa menemukan saya menjelajahi trails hiking baru, bereksperimen dengan resep masakan baru, atau membaca buku-buku tentang teknologi terbaru." })
        ] }) }),
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-4", children: "Keterampilan" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: skills.map((skill, index) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: skill }, index)) })
        ] }) })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$About = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About | Portfolio Online" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, { "currentPath": currentPath })} ${renderComponent($$result2, "AboutSection", AboutPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/sections/AboutSection", "client:component-export": "default" })} ` })}`;
}, "D:/Pemrograman/portfolio/src/pages/about.astro", void 0);

const $$file = "D:/Pemrograman/portfolio/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
