import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";

export const LoginButton: React.FC = () => {
  const { ready, authenticated, login } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      disabled={disableLogin}
      whileTap={{ scale: 0.95 }}
      onClick={login}
      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-purple-600 transition duration-300"
    >
      Login
    </motion.button>
  );
};
