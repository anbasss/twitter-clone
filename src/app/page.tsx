
"use client";

import Header from "@/components/Header";
import Form from "@/components/Form";
import PostFeed from "@/components/posts/PostFeed";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header label="Home" />
      <Form placeholder="What's happening?" />
      <PostFeed />
    </div>
  );
}

