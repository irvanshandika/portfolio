import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { db, storage } from "@/config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

interface EditProjectProps {
  projectId: string;
  initialData?: Project;
}

const EditProject: React.FC<EditProjectProps> = ({ projectId, initialData }) => {
  const [currentProject, setCurrentProject] = useState<Project>(
    initialData || {
      id: projectId,
      image: "",
      title: "",
      description: "",
      fullDescription: "",
      tags: [],
      githubLink: "",
      liveLink: "",
    }
  );
  const [currentTag, setCurrentTag] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectId = window.location.pathname.split("/").pop();
    if (projectId) {
      fetchProject(projectId);
    }
  }, []);

  const fetchProject = async (projectId: string) => {
    try {
      const projectDoc = await getDoc(doc(db, "projects_db", projectId));
      if (projectDoc.exists()) {
        setCurrentProject({ id: projectDoc.id, ...projectDoc.data() } as Project);
      } else {
        toast.error("Project not found");
        window.location.href = "/dashboard/projects";
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Error fetching project");
      setLoading(false);
    }
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

      await updateDoc(doc(db, "projects_db", currentProject.id), projectData);
      toast.success("Project updated successfully");
      window.location.href = "/dashboard/projects";
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Edit Project</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard/projects")}>
          Back to Projects
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update the details of your project below.</CardDescription>
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
              {currentProject.image && <img src={currentProject.image} alt="Project preview" className="mt-2 max-w-xs rounded" />}
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
              Update Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProject;
