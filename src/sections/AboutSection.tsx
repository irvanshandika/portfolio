import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Mail } from "lucide-react";

export default function AboutPage() {
  const skills = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vuejs", "Nextjs", "Nuxtjs", "Astro", "Tailwind CSS", "Bootstrap", "Node.js"];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About Me</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <iframe
            src="https://firebasestorage.googleapis.com/v0/b/irvans-707d8.appspot.com/o/Muhammad%20Irvan%20Shandika-resume.pdf?alt=media&token=93fdd122-e18d-4d4d-b1c1-8817dc23df05#toolbar=0"
            frameBorder="0"
            width={400}
            height={400}
            className="rounded-lg shadow-lg mx-auto"></iframe>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => (window.location.href = "/contact")}>
              <Mail className="mr-2 h-4 w-4" /> Contact Me
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "https://drive.usercontent.google.com/u/0/uc?id=1PJeD9QKvFX0tJkdY2EltRwgqPo9YsYSi&export=download")}>
              <Download className="mr-2 h-4 w-4" /> Download CV
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Hi👋! I'm Muhammad Irvan Shandika</h2>
              <p className="text-muted-foreground mb-4">
                I am a passionate web developer with experience in creating engaging and functional web solutions. With a background in UI/UX design and front-end development, I strive to blend aesthetics with functionality in every project
                I work on.
              </p>
              <p className="text-muted-foreground">When I'm not coding, I try to find and learn new things to hone my learning skills.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Skill</h3>
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
