"use client";

import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import TweetModal from "@/components/modals/TweetModal";
import EditModal from "@/components/modals/EditModal";

const ModalProvider = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <TweetModal />
      <EditModal />
    </>
  );
};

export default ModalProvider;
