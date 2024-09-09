import React, { useState } from "react";
import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

function OpenLottery({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { address } = useAccount();
  const [duration, setDuration] = useState("");

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isOpening, isSuccess: isOpenSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleOpenLottery = () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    // Hardcode Duration: 24 hours
    // const durationInSeconds = 24 * 60 * 60; // 24 hours in seconds
    // const closingTime = Math.floor(Date.now() / 1000) + durationInSeconds;

    const durationInSeconds = parseInt(duration) * 60; // Convert minutes to seconds
    const closingTime = Math.floor(Date.now() / 1000) + durationInSeconds;

    writeContract({
      address: contractAddress,
      abi: LotteryABI.abi,
      functionName: "openBets",
      args: [BigInt(closingTime)],
    });
  };

  return (
    <div className="my-2">
      <h3 className="text-lg font-bold mb-2">Open Lottery:</h3>
      <input
        type="number"
        placeholder="Duration in minutes"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        className="input input-bordered w-full max-w-xs mr-2"
      />
      <button className="btn btn-primary" onClick={handleOpenLottery} disabled={isOpening}>
        {isOpening ? "Opening..." : "Open Lottery"}
      </button>
      {isOpenSuccess && <p className="text-green-500 mt-2">Lottery opened successfully!</p>}
    </div>
  );
}

export default OpenLottery;
