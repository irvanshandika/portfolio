import { c as createComponent, r as renderTemplate, f as renderComponent, e as createAstro } from '../chunks/astro/server_DwTpAVbE.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_C9bsF3sm.mjs';
import { c as cn, B as Button, $ as $$Navbar } from '../chunks/Navbar_CoM1RtUu.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { useState, useEffect } from 'react';
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from '../chunks/card_d0V1rxVa.mjs';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { Send, MessageSquare } from 'lucide-react';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;

const ReactQuill = React__default.lazy(() => import('react-quill'));
function ContactPage() {
  const [comments, setComments] = useState([
    { id: 1, name: "John Doe", message: "Great portfolio! Love your work.", date: "2023-06-15" },
    { id: 2, name: "Jane Smith", message: "Your projects are inspiring. Keep it up!", date: "2023-06-14" },
    { id: 3, name: "Alice", message: "I love your design style. It's very clean and professional.", date: "2023-06-13" },
    { id: 4, name: "Bob", message: "Your portfolio is amazing. I'm a big fan of your work.", date: "2023-06-12" }
  ]);
  const [contactMessage, setContactMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleContactSubmit = (event) => {
    event.preventDefault();
    alert("Pesan telah dikirim!");
    setContactMessage("");
  };
  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const nameInput = form.elements.namedItem("name");
    const newComment = {
      id: comments.length + 1,
      name: nameInput.value,
      message: commentMessage,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    setComments([newComment, ...comments]);
    form.reset();
    setCommentMessage("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-8 text-center", children: "Hubungi Saya" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Formulir Kontak" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleContactSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nama" }),
            /* @__PURE__ */ jsx(Input, { id: "name", placeholder: "Masukkan nama Anda", required: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsx(Input, { id: "email", type: "email", placeholder: "Masukkan email Anda", required: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "message", children: "Pesan" }),
            isClient && /* @__PURE__ */ jsx(React__default.Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading editor..." }), children: /* @__PURE__ */ jsx(ReactQuill, { theme: "snow", value: contactMessage, onChange: setContactMessage, placeholder: "Tulis pesan Anda di sini" }) })
          ] }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", children: [
            /* @__PURE__ */ jsx(Send, { className: "mr-2 h-4 w-4" }),
            " Kirim Pesan"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Tinggalkan Komentar" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleCommentSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "comment-name", children: "Nama" }),
              /* @__PURE__ */ jsx(Input, { id: "comment-name", name: "name", placeholder: "Masukkan nama Anda", required: true })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "comment-message", children: "Komentar" }),
              isClient && /* @__PURE__ */ jsx(React__default.Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading editor..." }), children: /* @__PURE__ */ jsx(ReactQuill, { theme: "snow", value: commentMessage, onChange: setCommentMessage, placeholder: "Tulis komentar Anda di sini" }) })
            ] }),
            /* @__PURE__ */ jsxs(Button, { type: "submit", children: [
              /* @__PURE__ */ jsx(MessageSquare, { className: "mr-2 h-4 w-4" }),
              " Kirim Komentar"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Komentar Terbaru" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4 overflow-y-scroll", children: comments.map((comment) => /* @__PURE__ */ jsxs("div", { className: "border-b pb-4 last:border-b-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: comment.name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: comment.date }),
            /* @__PURE__ */ jsx("div", { className: "mt-2", dangerouslySetInnerHTML: { __html: comment.message } })
          ] }, comment.id)) }) })
        ] })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Contact = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Contact;
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About | Portfolio Online" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, { "currentPath": currentPath })} ${renderComponent($$result2, "ContactSection", ContactPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/sections/ContactSection", "client:component-export": "default" })} ` })}`;
}, "D:/Pemrograman/portfolio/src/pages/contact.astro", void 0);

const $$file = "D:/Pemrograman/portfolio/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
