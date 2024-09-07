import React, { useEffect, useState } from "react";
import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import TokenABI from "../../hardhat/artifacts/contracts/LotteryToken.sol/LotteryToken.json";
import { parseEther } from "ethers";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

function BurnTokens({ lotteryAddress }: { lotteryAddress: `0x${string}` }) {
  const MAXUINT256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

  const { address: userAddress } = useAccount();
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | null>(null);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [burnAmount, setBurnAmount] = useState("");

  // Fetch payment token address
  const { data: paymentTokenAddress } = useReadContract({
    address: lotteryAddress,
    abi: LotteryABI.abi,
    functionName: "paymentToken",
  });

  useEffect(() => {
    if (paymentTokenAddress) {
      setTokenAddress(paymentTokenAddress as `0x${string}`);
    }
  }, [paymentTokenAddress]);

  // Check allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: TokenABI.abi,
    functionName: "allowance",
    args: userAddress && tokenAddress ? [userAddress, lotteryAddress] : undefined,
  });

  useEffect(() => {
    if (allowanceData !== undefined) {
      setAllowance(allowanceData as bigint);
    }
  }, [allowanceData]);

  // Approve tokens
  const { writeContract: approveTokens, data: approveData } = useWriteContract();

  const { isLoading: isApproving, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveData,
  });

  const handleApprove = async () => {
    if (!tokenAddress) return;
    approveTokens({
      address: tokenAddress,
      abi: TokenABI.abi,
      functionName: "approve",
      args: [lotteryAddress, MAXUINT256], // Approve a large amount
    });
  };

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  // Burn tokens
  const { writeContract: burnTokens, data: burnData } = useWriteContract();

  const { isLoading: isBurning, isSuccess: isBurnSuccess } = useWaitForTransactionReceipt({
    hash: burnData,
  });

  const handleBurn = async () => {
    burnTokens({
      address: lotteryAddress,
      abi: LotteryABI.abi,
      functionName: "returnTokens",
      args: [parseEther(burnAmount)],
    });
  };

  return (
    <div className="my-2">
      <h3 className="text-lg font-bold mb-2">Burn Tokens:</h3>
      {allowance === 0n ? (
        <div>
          <p>You need to approve the Lottery contract to burn your tokens.</p>
          <button onClick={handleApprove} disabled={isApproving} className="btn btn-primary w-full">
            {isApproving ? "Approving..." : "Approve Tokens"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <input
            type="text"
            value={burnAmount}
            onChange={e => setBurnAmount(e.target.value)}
            placeholder="Amount to burn"
            className="input input-bordered w-full mb-2"
          />
          <button onClick={handleBurn} disabled={isBurning || !burnAmount} className="btn btn-primary w-full">
            {isBurning ? "Burning..." : "Burn Tokens"}
          </button>
        </div>
      )}
      {isBurnSuccess && <p className="text-green-500 mt-2">Tokens burned successfully!</p>}
    </div>
  );
}

export default BurnTokens;
