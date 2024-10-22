import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Mail } from "lucide-react";

export default function AboutPage() {
  const skills = ["HTML", "CSS", "JavaScript", "React", "Vuejs", "Nextjs", "Nuxtjs", "Astro", "Tailwind CSS", "Bootstrap", "Node.js"];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">About Me</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="relative w-full max-w-[370px] h-[370px] mx-auto lg:max-w-[400px] lg:h-[400px]">
            <iframe
              src="https://firebasestorage.googleapis.com/v0/b/irvans-707d8.appspot.com/o/Muhammad%20Irvan%20Shandika-resume.pdf?alt=media&token=93fdd122-e18d-4d4d-b1c1-8817dc23df05#toolbar=0"
              frameBorder="0"
              loading="lazy"
              className="rounded-lg shadow-lg w-full h-full"></iframe>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <span className="text-white text-4xl sm:text-6xl font-bold opacity-50 transform -rotate-45 select-none">Review</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button onClick={() => (window.location.href = "/contact")} className="w-full sm:w-auto">
              <Mail className="mr-2 h-4 w-4" /> Contact Me
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "https://drive.usercontent.google.com/u/0/uc?id=1PJeD9QKvFX0tJkdY2EltRwgqPo9YsYSi&export=download")} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Download CV
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Hi👋! I'm Muhammad Irvan Shandika</h2>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                I am a passionate web developer with experience in creating engaging and functional web solutions. With a background in UI/UX design and front-end development, I strive to blend aesthetics with functionality in every project
                I work on.
              </p>
              <p className="text-muted-foreground text-sm sm:text-base">When I'm not coding, I try to find and learn new things to hone my learning skills.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
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
