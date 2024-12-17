"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useSwitchChain, useReadContract } from "wagmi";
import { toast } from "react-hot-toast";
import { BrowserProvider, ethers, parseUnits } from "ethers";
import { formatUnits } from "viem";
import FiatSendABI from "@/abis/FiatSend.json";
import TetherTokenABI from "@/abis/TetherToken.json";
import { liskSepolia } from "viem/chains";

const FIATSEND_ADDRESS = "0x9e4fCd5Cc9D80a49184715c8BA1C3C6729E05A93";
const USDT_ADDRESS = "0xAE134a846a92CA8E7803Ca075A1a0EE854Cd6168";

const OfframpPage: React.FC = () => {
  const { switchChain } = useSwitchChain();
  const { address } = useAccount();
  const [usdtAmount, setUsdtAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number>(17);
  const [isProcessing, setIsProcessing] = useState(false);
  const [usdtAllowance, setUsdtAllowance] = useState<bigint>(BigInt(0));

  const { data: usdtBalance } = useReadContract({
    address: USDT_ADDRESS,
    abi: TetherTokenABI.abi,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
  });

  const { data: exRates } = useReadContract({
    address: FIATSEND_ADDRESS,
    abi: FiatSendABI.abi,
    functionName: "conversionRate",
  });

  useEffect(() => {
    if (exRates) {
      const formattedRate = formatUnits(exRates as bigint, 0);
      setExchangeRate(Number(formattedRate));
    }
  }, [exRates]);

  const formattedBalance = usdtBalance
    ? Number(formatUnits(usdtBalance as bigint, 6)).toFixed(2)
    : "0.00";

  const handleApprove = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Approving USDT...");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        TetherTokenABI.abi,
        signer
      );

      const amount = parseUnits(usdtAmount, 6);
      const tx = await usdtContract.approve(FIATSEND_ADDRESS, amount);

      toast.loading("Waiting for approval confirmation...", { id: toastId });
      await tx.wait();

      setUsdtAllowance(amount);
      toast.success("USDT approved successfully!", { id: toastId });
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve USDT", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendFiat = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Processing transaction...");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      const usdtContract = new ethers.Contract(
        USDT_ADDRESS,
        TetherTokenABI.abi,
        signer
      );
      const fiatSendContract = new ethers.Contract(
        FIATSEND_ADDRESS,
        FiatSendABI.abi,
        signer
      );
      const parsedAmount = parseUnits(usdtAmount, 6);

      // Check allowance
      const allowance = await usdtContract.allowance(address, FIATSEND_ADDRESS);
      if (allowance < parsedAmount) {
        toast.loading("Approving USDT...", { id: toastId });
        const approveTx = await usdtContract.approve(
          FIATSEND_ADDRESS,
          parsedAmount
        );
        await approveTx.wait();
      }

      // Send transaction
      toast.loading("Sending transaction...", { id: toastId });
      const tx = await fiatSendContract.depositStablecoin(parsedAmount);
      await tx.wait();

      toast.success("Transaction successful!", { id: toastId });
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Failed to process transaction. Check logs for details.", {
        id: toastId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="offramp-container">
      <h2>Fiat Offramp</h2>
      <div className="balance-section">
        <p>USDT Balance: {formattedBalance}</p>
        <input
          type="number"
          placeholder="Enter USDT Amount"
          value={usdtAmount}
          onChange={(e) => setUsdtAmount(e.target.value)}
        />
        <button onClick={handleApprove} disabled={isProcessing || !usdtAmount}>
          Approve USDT
        </button>
        <button onClick={handleSendFiat} disabled={isProcessing || !usdtAmount}>
          Send Fiat
        </button>
      </div>
    </div>
  );
};

export default OfframpPage;
