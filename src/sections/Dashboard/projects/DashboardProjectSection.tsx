import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Github, ExternalLink, Edit, Trash } from "lucide-react";
import { db, storage, auth } from "@/config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Toaster, toast } from "react-hot-toast";

interface Project {
  id: string;
  image: string;
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  githubLink: string;
  liveLink: string;
}

const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
        } else {
          toast.error("You are not authorized to view this page.");
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAdmin, loading };
};

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { isAdmin, loading } = useAdminCheck();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const projectsCollection = collection(db, "projects_db");
    const projectsSnapshot = await getDocs(projectsCollection);
    const projectsList = projectsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Project
    );
    setProjects(projectsList);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      try {
        await deleteDoc(doc(db, "projects_db", projectToDelete.id));
        if (projectToDelete.image) {
          const imageRef = ref(storage, projectToDelete.image);
          await deleteObject(imageRef).catch((error) => {
            console.error("Error deleting image:", error);
          });
        }
        await fetchProjects();
        toast.success("Project deleted successfully");
        setProjectToDelete(null);
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold">Unauthorized Access</h1>
          <p className="text-lg mt-4">You are not authorized to view this page.</p>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Project List</h1>
        <Button onClick={() => (window.location.href = "/dashboard/projects/add")}>Add New Project</Button>
      </div>

      <Dialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this project? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-48 object-cover" fetchPriority="high" loading="lazy" />
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <Github size={14} className="mr-1" /> GitHub
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={14} className="mr-1" /> Live Demo
                    </a>
                  </Button>
                </div>
                <div className="space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => (window.location.href = `/dashboard/projects/edit/${project.id}`)}>
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setProjectToDelete(project)}>
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
