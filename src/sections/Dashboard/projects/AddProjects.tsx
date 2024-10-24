import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { db, storage, auth } from "@/config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Toaster, toast } from "react-hot-toast";

interface Project {
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

const AddProject: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<Project>({
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
  const { isAdmin, loading } = useAdminCheck();

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

      await addDoc(collection(db, "projects_db"), projectData);
      window.location.href = "/dashboard/projects";
      toast.success("Project added successfully");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
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
        <h1 className="text-4xl font-bold">Add New Project</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard/projects")}>
          Back to Projects
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
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
              Add Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProject;
