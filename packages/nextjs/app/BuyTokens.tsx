import React, { useState } from "react";
import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { parseEther } from "ethers";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

function BuyTokens({ contractAddress }: { contractAddress: `0x${string}` }) {
  const [value, setValue] = useState("");
  const { address } = useAccount();

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isBuying, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleBuyTokens = () => {
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
  };

  return (
    <div className="my-2">
      <h3 className="text-lg font-bold mb-2">Buy Tokens:</h3>
      <div className="flex flex-col">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Enter ETH amount"
          className="input input-bordered w-full mb-2"
        />
        <button onClick={handleBuyTokens} disabled={isBuying || !value} className="btn btn-primary w-full">
          {isBuying ? "Buying..." : "Buy Tokens"}
        </button>
        {isBuySuccess && <p className="text-green-500 mt-2">Tokens purchased successfully!</p>}
      </div>
    </div>
  );
}

export default BuyTokens;
