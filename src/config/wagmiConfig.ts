import { liskSepolia } from "viem/chains";
import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "Fiatsend",
  projectId: "788c92c6f1abab2c8b0cc98c5a952607",
  chains: [liskSepolia],
});
