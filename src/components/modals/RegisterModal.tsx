"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";

import Input from "../Input";
import Modal from "./Modal";

const RegisterModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }

    registerModal.onClose();
    loginModal.onOpen();
  }, [isLoading, registerModal, loginModal]);  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      // Validasi email di frontend
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validasi bahwa email bukan hanya string biasa
      if (!email.includes('@') || !email.includes('.')) {
        toast.error('Email must contain @ and a valid domain');
        return;
      }

      // Validasi password
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      // Validasi username
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        toast.error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
        return;
      }

      // Validasi name
      if (name.length < 2) {
        toast.error('Name must be at least 2 characters long');
        return;
      }

      // Register user
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          username,
          name
        })
      });

      const data = await response.json();if (!response.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }
      
      toast.success('Account created.');

      // Sign in after successful registration
      await signIn('credentials', {
        email,
        password
      });
      
      registerModal.onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [registerModal, email, password, username, name]);
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Email (example@domain.com)"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}  
      />
      <Input
        placeholder="Full Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}  
      />
      <Input
        placeholder="Username (letters, numbers, underscore only)"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading}  
      />
      <Input
        placeholder="Password (minimum 6 characters)"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}  
      />
    </div>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>Already have an account?
        <span 
          onClick={onToggle} 
          className="
            text-white 
            cursor-pointer 
            hover:underline
          "
          > Sign in</span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Create an account"
      actionLabel="Register"
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
