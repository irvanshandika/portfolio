interface FooterItemProps {
  text: string;
  link: string;
}

const FooterItem = ({ text, link }: FooterItemProps) => {
  return (
    <li>
      <a href={link} className="duration-200 hover:text-blue-600 dark:hover:text-blue-500">
        {text}
      </a>
    </li>
  );
};

interface FooterBlockItemProps {
  title: string;
  items: { id: number; text: string; link: string }[];
}

const FooterBlockItem = ({ title, items }: FooterBlockItemProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
      <ul className="space-y-3">
        {items.map((item) => (
          <FooterItem key={item.id} {...item} />
        ))}
      </ul>
    </div>
  );
};

const footerBlocks = [
  {
    id: 1,
    title: "Services",
    items: [
      {
        id: 1,
        text: "Web design",
        link: "#",
      },
      {
        id: 2,
        text: " Consultancy ",
        link: "#",
      },
      {
        id: 3,
        text: "Web Development",
        link: "#",
      },
    ],
  },
  {
    id: 2,
    title: "Company",
    items: [
      {
        id: 1,
        text: "About",
        link: "/about",
      },
      {
        id: 2,
        text: "Career",
        link: "#",
      },
      {
        id: 3,
        text: "Contact",
        link: "/contact",
      },
      {
        id: 4,
        text: "Services",
        link: "#",
      },
      {
        id: 5,
        text: "Services",
        link: "#",
      },
    ],
  },
  {
    id: 3,
    title: "Social",
    items: [
      {
        id: 1,
        text: "Instagram",
        link: "https://www.instagram.com/irvan_shandika/",
      },
      {
        id: 2,
        text: "Threds",
        link: "https://www.threads.net/@irvan_shandika",
      },
      {
        id: 3,
        text: "Facebook",
        link: "https://www.facebook.com/shandika.irvan/",
      },
      {
        id: 4,
        text: "Linkedin",
        link: "https://www.linkedin.com/in/irvan-shandika/",
      },
      {
        id: 5,
        text: "Github",
        link: "https://github.com/irvanshandika",
      },
    ],
  },
  {
    id: 4,
    title: "Ressources",
    items: [
      {
        id: 1,
        text: "Blogs",
        link: "/blogs",
      },
      {
        id: 2,
        text: "Privacy",
        link: "#",
      },
      {
        id: 3,
        text: "Terms",
        link: "#",
      },
      {
        id: 4,
        text: "FAQ",
        link: "#",
      },
    ],
  },
];

const FooterBlock = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5">
        <div className="border-t border-t-gray-200 dark:border-t-gray-800 py-16 md:py-20 flex flex-col lg:flex-row gap-14 gap-y-16">
          <div className="w-full lg:w-96 space-y-6">
            <a href="/" className="flex">
              <img src="/favicon.svg" alt="logo" className="w-7 h-7 hidden dark:block" />
              <img src="/AstroLight.svg" alt="logo" className="w-7 h-7 block dark:hidden" />
              Irvans
            </a>
            <p className="max-w-lg">I am a freelancer in the field of website development, both in terms of frontend and backend. I also have experience in UI/UX development and promp engineer.</p>
          </div>
          <nav className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-10">
            {footerBlocks.map((footerBlock) => (
              <>
                <FooterBlockItem key={footerBlock.id} {...footerBlock} />
              </>
            ))}
          </nav>
        </div>
      </div>
      <div className="py-3 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 flex justify-center text-center">
          <p> © {year} Irvans. All right reserved </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterBlock;
