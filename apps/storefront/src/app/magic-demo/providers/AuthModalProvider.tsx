import React, { createContext, useState, useContext, useEffect } from "react";
import Modal from "../components/Modal";
import LoginOptions from "../components/auth/LoginOptions";
import { useAccount } from "wagmi";

interface AuthModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && isOpen) {
      closeModal();
    }
  }, [isConnected, isOpen]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <Modal open={isOpen} handleClose={closeModal}>
        <LoginOptions />
      </Modal>
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
