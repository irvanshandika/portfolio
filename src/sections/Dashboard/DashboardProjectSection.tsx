import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Github, ExternalLink, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db, storage, auth } from "@/config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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

const ProjectDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>({
    id: "",
    image: "",
    title: "",
    description: "",
    fullDescription: "",
    tags: [],
    githubLink: "",
    liveLink: "",
  });
  const [currentTag, setCurrentTag] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProject((prevProject) => ({ ...prevProject, [name]: value }));
  };

  const handleAddTag = () => {
    if (currentTag && !currentProject.tags.includes(currentTag)) {
      setCurrentProject((prevProject) => ({ ...prevProject, tags: [...prevProject.tags, currentTag] }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCurrentProject((prevProject) => ({ ...prevProject, tags: prevProject.tags.filter((t) => t !== tag) }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProject((prevProject) => ({ ...prevProject, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let imageUrl = currentProject.image;
      if (imageFile) {
        const storageRef = ref(storage, `project_images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const projectData = {
        ...currentProject,
        image: imageUrl,
      };

      if (isEditing) {
        // Update existing project
        await updateDoc(doc(db, "projects_db", currentProject.id), projectData);
        toast.success("Project updated successfully");
      } else {
        // Add new project
        const docRef = await addDoc(collection(db, "projects_db"), projectData);
        projectData.id = docRef.id;
        toast.success("Project added successfully");
      }

      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
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

  const resetForm = () => {
    setCurrentProject({
      id: "",
      image: "",
      title: "",
      description: "",
      fullDescription: "",
      tags: [],
      githubLink: "",
      liveLink: "",
    });
    setImageFile(null);
    setIsEditing(false);
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
      <h1 className="text-4xl font-bold mb-8 text-center">Project Dashboard</h1>
      <Tabs defaultValue="add" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add/Edit Project</TabsTrigger>
          <TabsTrigger value="list">Project List</TabsTrigger>
        </TabsList>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Project" : "Add New Project"}</CardTitle>
              <CardDescription>Fill in the details of your project below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" name="title" value={currentProject.title} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea id="description" name="description" value={currentProject.description} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="fullDescription">Full Description</Label>
                  <Textarea id="fullDescription" name="fullDescription" value={currentProject.fullDescription} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="image">Project Image</Label>
                  <Input id="image" type="file" onChange={handleImageUpload} accept="image/*" />
                  {currentProject.image && <img src={currentProject.image} alt="Project preview" className="mt-2 max-w-xs rounded" fetchPriority="high" loading="lazy" />}
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex space-x-2">
                    <Input id="tags" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} placeholder="Add a tag" />
                    <Button type="button" onClick={handleAddTag}>
                      Add Tag
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentProject.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="githubLink">GitHub Link</Label>
                  <Input id="githubLink" name="githubLink" value={currentProject.githubLink} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="liveLink">Live Demo Link</Label>
                  <Input id="liveLink" name="liveLink" value={currentProject.liveLink} onChange={handleInputChange} required />
                </div>
                <Button type="submit" className="w-full">
                  {isEditing ? "Update Project" : "Add Project"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
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
        <TabsContent value="list">
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
                      <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDashboard;
