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
      <button onClick={handleFetchBalance} className="btn btn-primary mb-2">
        Fetch Balance
      </button>
    );
  }

  if (isPaymentTokenLoading || isBalanceLoading) return <div>Fetching balance…</div>;
  if (isPaymentTokenError) return <div>Error fetching payment token address</div>;
  if (isBalanceError) return <div>Error fetching balance</div>;

  const tokenBalance = typeof balance === "bigint" ? balance : 0n;

  return (
    <div>
      <div>Payment Token Address: {paymentTokenAddress as `0x${string}`}</div>
      <div>Balance: {formatEther(tokenBalance)} tokens</div>
      <button onClick={handleFetchBalance} className="btn btn-primary mt-2">
        Refresh Balance
      </button>
    </div>
  );
}

export default GetTokenBalance;
