import React, { useState } from "react";
import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { parseEther } from "ethers";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

function BuyTokens({ contractAddress }: { contractAddress: `0x${string}` }) {
  const [value, setValue] = useState("");
  const { address } = useAccount();

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // https://wagmi.sh/react/guides/write-to-contract#_4-hook-up-the-usewritecontract-hook
  async function handleBuyTokens(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: LotteryABI.abi,
      functionName: "purchaseTokens",
      args: [],
      value: parseEther(value),
    });
  }

  return (
    <form onSubmit={handleBuyTokens} className="flex flex-col items-center gap-4">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Enter ETH amount"
        className="input input-bordered"
      />
      <button disabled={isPending || !value} type="submit" className="btn btn-primary">
        {isPending ? "Buying..." : "Buy Tokens"}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed. Tokens purchased!</div>}
    </form>
  );
}

export default BuyTokens;
