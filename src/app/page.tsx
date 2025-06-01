
"use client";

import Navbar from "@/components/Navbar";
import Form from "@/components/Form";
import PostFeed from "@/components/posts/PostFeed";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar label="Home" />
      <Form placeholder="What's happening?" />
      <PostFeed />
    </div>
  );
}

