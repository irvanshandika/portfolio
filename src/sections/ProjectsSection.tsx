import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubLink: string;
  liveLink: string;
  fullDescription: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "First Portfolio Website",
    description: "My first project portfolio using HTML, CSS, Javascript, and Using Bootstrap Framework.",
    image: "https://res.cloudinary.com/dszhlpm81/image/upload/v1723043534/assets/UFPMOvuUtfuMxUpG2yy%2BnF743hBOeLEzqjNEDiHixcQ%3D/foto1_yc8plg_utfgt5.jpg",
    tags: ["HTML", "CSS", "Javascript", "Bootstrap"],
    githubLink: "#",
    liveLink: "https://irvanshandika.netlify.app/",
    fullDescription: "First Portfolio HTML, CSS, Javascript, and Using Bootstrap FrameworkThis is my first project portfolio using HTML, CSS, Javascript, and Using Bootstrap Framework.",
  },
  {
    id: 2,
    title: "May Beauty Skin v1",
    description: "Here is my second project in learning frontend web developer. Here I use the JavaScript framework React JS and Bootstrap 5.",
    image: "https://res.cloudinary.com/dszhlpm81/image/upload/v1723043536/assets/UFPMOvuUtfuMxUpG2yy%2BnF743hBOeLEzqjNEDiHixcQ%3D/foto2_wbodpu_io04s0.jpg",
    tags: ["React", "Javascript", "Bootstrap"],
    githubLink: "https://github.com/irvanshandika/maybeautyskin",
    liveLink: "https://maybeautyskin.vercel.app/",
    fullDescription: "Here is my second project in learning frontend web developer. Here I use the JavaScript framework React JS and Bootstrap 5.",
  },
  {
    id: 3,
    title: "Digital Library",
    description: "This project is the first project that I made with my friends for the final project in the Advanced Programming course.",
    image: "https://res.cloudinary.com/dszhlpm81/image/upload/v1723043536/assets/UFPMOvuUtfuMxUpG2yy%2BnF743hBOeLEzqjNEDiHixcQ%3D/foto3_k9rwdz_emzvhu.jpg",
    tags: ["React", "Bootstrap", "Javascript"],
    githubLink: "https://github.com/irvanshandika/Final-Project-Kel6",
    liveLink: "https://perpustakaandigital.vercel.app/",
    fullDescription: "This project is the first project that I made with my friends for the final project in the Advanced Programming course.",
  },
  {
    id: 4,
    title: "Memories Album",
    description: "This Memories Album is my lesson in learning full stack using Next JS and Cloudinary for save images.",
    image: "https://res.cloudinary.com/dszhlpm81/image/upload/v1723043862/assets/UFPMOvuUtfuMxUpG2yy%2BnF743hBOeLEzqjNEDiHixcQ%3D/foto5_tu8msy_ct3khs.jpg",
    tags: ["Next JS", "Cloudinary", "Typescript", "Tailwind CSS", "Node JS"],
    githubLink: "https://github.com/yourusername/personal-blog",
    liveLink: "https://albumif07.vercel.app/",
    fullDescription: "My first project was learning Full Stack by using Next JS and Typescript programming language to create a Memory Album website. Here the storage for uploading photos uses the Cloudinary platform.",
  },
];

export default function ProjectShowcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <img src={project.image} alt={project.title} width={300} height={200} className="w-full h-48 object-cover rounded-md mb-4" />
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedProject(project)}>
                    Learn More
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <img src={project.image} alt={project.title} width={300} height={200} className="w-full h-48 object-cover rounded-md mb-4" />
                    <DialogTitle>{selectedProject?.title}</DialogTitle>
                    <DialogDescription>{selectedProject?.fullDescription}</DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-between mt-4">
                    <Button asChild variant="outline">
                      <a href={selectedProject?.githubLink} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" /> GitHub
                      </a>
                    </Button>
                    <Button asChild>
                      <a href={selectedProject?.liveLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                      </a>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button asChild>
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
