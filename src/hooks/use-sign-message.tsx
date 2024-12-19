import { useState } from "react";
import { SignMessageModal } from "@/components/modals/sign";
import { useEthersSigner } from "@/lib/ethers";

export const useSignMessage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState("");
  const signer = useEthersSigner();

  const requestSign = async (msg: string, userAccount: string) => {
    setMessage(msg);
    setAccount(userAccount);
    setIsOpen(true);
  };

  const handleSign = async () => {
    if (!signer) {
      console.error("No signer available");
      return;
    }

    try {
      const signature = await signer.signMessage(message);
      console.log("Signature:", signature);
      setIsOpen(false);
      return signature;
    } catch (error) {
      console.error("Error signing message:", error);
      setIsOpen(false);
    }
  };

  const modal = (
    <SignMessageModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSign={handleSign}
      message={message}
      account={account}
    />
  );

  return { requestSign, modal };
};
