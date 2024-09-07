import React, { useState } from "react";
import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import TokenABI from "../../hardhat/artifacts/contracts/LotteryToken.sol/LotteryToken.json";
import { formatEther } from "ethers";
import { useReadContract } from "wagmi";

function GetTokenBalance({
  lotteryAddress,
  userAddress,
}: {
  lotteryAddress: `0x${string}`;
  userAddress: `0x${string}`;
}) {
  const [showBalance, setShowBalance] = useState(false);

  // Fetch the payment token address
  const {
    data: paymentTokenAddress,
    isError: isPaymentTokenError,
    isLoading: isPaymentTokenLoading,
    refetch: refetchPaymentToken,
  } = useReadContract({
    address: lotteryAddress,
    abi: LotteryABI.abi,
    functionName: "paymentToken",
  });

  // Fetch the token balance using the payment token address
  const {
    data: balance,
    isError: isBalanceError,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: paymentTokenAddress as `0x${string}`,
    abi: TokenABI.abi,
    functionName: "balanceOf",
    args: [userAddress],
  });

  const handleFetchBalance = async () => {
    setShowBalance(true);
    await refetchPaymentToken();
    if (paymentTokenAddress) {
      await refetchBalance();
    }
  };

  if (!showBalance) {
    return (
      <div className="flex justify-center">
        <button onClick={handleFetchBalance} className="btn btn-primary">
          Fetch Balance
        </button>
      </div>
    );
  }

  if (isPaymentTokenLoading || isBalanceLoading) return <div className="text-center">Fetching balance…</div>;
  if (isPaymentTokenError) return <div className="text-center">Error fetching payment token address</div>;
  if (isBalanceError) return <div className="text-center">Error fetching balance</div>;

  const tokenBalance = typeof balance === "bigint" ? balance : 0n;

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-600 mb-2">Payment Token: {paymentTokenAddress as `0x${string}`}</div>
      <div className="flex items-center space-x-4">
        <button onClick={handleFetchBalance} className="btn btn-primary">
          Refresh Balance
        </button>
        <span className="font-semibold">Your Token Balance:</span>
        <span>{formatEther(tokenBalance)} tokens</span>
      </div>
    </div>
  );
}

export default GetTokenBalance;
