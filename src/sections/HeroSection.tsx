import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 overflow-hidden rounded-full border-4 border-primary">
            <img
              src="https://res.cloudinary.com/dszhlpm81/image/upload/v1723633487/assets/UFPMOvuUtfuMxUpG2yy%2BnF743hBOeLEzqjNEDiHixcQ%3D/foto_tyc5yi.jpg"
              alt="Foto Profil"
              className="object-cover fill-inherit rounded-full"
              fetchPriority="high"
              loading="lazy"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">Muhammad Irvan Shandika</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">Web Developer | UI/UX Designer | Promp Engineer</p>
          </div>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            Saya adalah seorang web developer dan UI/UX designer yang berfokus pada pembuatan aplikasi web yang efisien dan mudah digunakan. Saya memiliki pengalaman dalam mengembangkan aplikasi web dengan teknologi modern seperti React,
            Next.js, dan Tailwind CSS.
          </p>
          <div className="space-x-4">
            <Button onClick={() => (window.location.href = "/projects")}>
              Lihat Proyek
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/contact")}>
              Hubungi Saya
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
