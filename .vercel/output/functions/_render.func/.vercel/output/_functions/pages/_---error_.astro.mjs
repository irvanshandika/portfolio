import { c as createComponent, r as renderTemplate, f as renderComponent, e as createAstro, m as maybeRenderHead } from '../chunks/astro/server_DwTpAVbE.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_C9bsF3sm.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$ = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { status = 404 } = Astro2.props;
  let title;
  let message;
  switch (status) {
    case 404:
      title = "404 Not Found";
      message = "Halaman yang Anda cari tidak ditemukan.";
      break;
    case 500:
      title = "500 Internal Server Error";
      message = "Terjadi kesalahan di server. Silakan coba lagi nanti.";
      break;
    case 403:
      title = "403 Forbidden";
      message = "Anda tidak memiliki izin untuk mengakses halaman ini.";
      break;
    default:
      title = "Error";
      message = "Terjadi kesalahan tidak diketahui.";
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${title} | Portfolio Online` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="text-center"> <h1 class="text-6xl font-bold text-red-600">${status}</h1> <h2 class="text-4xl mt-4">${title}</h2> <p class="mt-2 text-lg text-gray-700">${message}</p> <a href="/" class="mt-6 inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Kembali ke Beranda</a> </div> ` })}`;
}, "D:/Pemrograman/portfolio/src/pages/[...error].astro", void 0);

const $$file = "D:/Pemrograman/portfolio/src/pages/[...error].astro";
const $$url = "/[...error]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
