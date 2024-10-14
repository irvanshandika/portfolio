import React from "react";
import "react-quill/dist/quill.snow.css";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Hubungi Saya</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactForm />

        <div className="space-y-8">
          <CommentForm />
          <CommentList />
        </div>
      </div>
    </div>
  );
}
