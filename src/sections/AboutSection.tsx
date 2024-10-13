import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Mail } from "lucide-react";

export default function AboutPage() {
  const skills = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vuejs", "Nextjs", "Nuxtjs", "Astro", "Tailwind CSS", "Bootstrap", "Node.js"];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Tentang Saya</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <iframe
            src="https://firebasestorage.googleapis.com/v0/b/irvanportfolio.appspot.com/o/Muhammad%20Irvan%20Shandika-resume.pdf?alt=media&token=311dfa29-ec7d-4bb8-bd79-04f94af2d1aa#toolbar=0"
            frameBorder="0"
            width={400}
            height={400}
            className="rounded-lg shadow-lg mx-auto"></iframe>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => (window.location.href = "/contact")}>
              <Mail className="mr-2 h-4 w-4" /> Hubungi Saya
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "https://firebasestorage.googleapis.com/v0/b/irvanportfolio.appspot.com/o/Muhammad%20Irvan%20Shandika-resume.pdf?alt=media&token=311dfa29-ec7d-4bb8-bd79-04f94af2d1aa&export=download")}>
              <Download className="mr-2 h-4 w-4" /> Unduh CV
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Halo! Saya Muhammad Irvan Shandika</h2>
              <p className="text-muted-foreground mb-4">
                Saya adalah seorang web developer yang bersemangat dengan pengalaman dalam menciptakan solusi web yang menarik dan fungsional. Dengan latar belakang dalam desain UI/UX dan pengembangan front-end, saya berusaha untuk
                memadukan estetika dengan fungsionalitas dalam setiap proyek yang saya kerjakan.
              </p>
              <p className="text-muted-foreground">Ketika saya tidak sedang coding, Anda bisa menemukan saya menjelajahi trails hiking baru, bereksperimen dengan resep masakan baru, atau membaca buku-buku tentang teknologi terbaru.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Keterampilan</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
