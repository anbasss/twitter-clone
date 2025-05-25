"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import Modal from "./Modal";
import Input from "../Input";
import ImageUpload from "../ImageUpload";

const EditModal = () => {  const { data: session } = useSession();
  const router = useRouter();
  const editModal = useEditModal();
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();

  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileImage(currentUser.profileImage || '');
      setCoverImage(currentUser.coverImage || '');
      setName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
    }
  }, [currentUser]);  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      // Create payload only with changed fields
      const payload: Record<string, any> = {};
      
      if (name !== currentUser?.name) payload.name = name;
      if (username !== currentUser?.username) payload.username = username;
      if (bio !== currentUser?.bio) payload.bio = bio;
      if (profileImage !== currentUser?.profileImage) payload.profileImage = profileImage;
      if (coverImage !== currentUser?.coverImage) payload.coverImage = coverImage;

      await axios.patch('/api/users', payload);

      await mutateCurrentUser();
      toast.success('Profile updated');
      editModal.onClose();
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [name, username, bio, profileImage, coverImage, currentUser, editModal, router, mutateCurrentUser]);

  const bodyContent = (
    <div className="flex flex-col gap-4">      <ImageUpload
        value={profileImage}
        disabled={isLoading}
        onChange={(image: string) => setProfileImage(image)}
        label="Upload profile image"
      />
      <ImageUpload
        value={coverImage}
        disabled={isLoading}
        onChange={(image: string) => setCoverImage(image)}
        label="Upload cover image"
      />
      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}
      />
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading}
      />
      <Input
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
