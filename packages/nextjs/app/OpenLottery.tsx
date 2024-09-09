import React, { useState } from "react";
import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { CheckLotteryState } from "./CheckLotteryState";
import { Block } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
// import { helpers } from "@nomicfoundation/hardhat-network-helpers";


function OpenLottery({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { address } = useAccount();
  const [duration, setDuration] = useState(60);

  const { isError, error, isPending, isSuccess, writeContract } = useWriteContract();
  const {
    isError: isErrorClose,
    error: errorClose,
    isPending: isPendingClose,
    isSuccess: isSuccessClose,
    writeContract: writeContractClose,
  } = useWriteContract();
  const publicClient = usePublicClient();

  const handleOpenLottery = async () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
    const block: Block | null = (await publicClient?.getBlock()) ?? null;
    // const closingTime = Math.floor(Date.now() / 1000) + Number(duration);
    // console.log("Closing time REAL: ", new Date(Number(closingTime) * 1000).toLocaleString());
    // console.log("Closing time BLOCK: ", closingTime);
    if (block != null) {
      writeContract({
        address: contractAddress,
        abi: LotteryABI.abi,
        functionName: "openBets",
        args: [BigInt(block.timestamp) + BigInt(duration)],
      });
      // await helpers.mine(1000, { interval: 15 });
    }
  };

  const handleCloseLottery = async () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
    const block = (await publicClient?.getBlock()) ?? null;
    if (block != null) {
      console.log("Current block: ", block.timestamp);
    }
    writeContractClose({
      address: contractAddress,
      abi: LotteryABI.abi,
      functionName: "closeLottery",
    });
    if (isErrorClose) console.log(errorClose.message);
  };

  return (
    <div className="my-2">
      <h3 className="text-lg font-bold mb-2">Enter the duration (in seconds):</h3>
      <input
        type="number"
        placeholder="Enter the duration (in seconds): "
        value={duration}
        onChange={e => setDuration(Number(e.target.value))}
        className="input input-bordered w-full max-w-xs mr-2"
      />

      <div>
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <button className="btn btn-primary" onClick={handleOpenLottery} disabled={isPending}>
              {isPending ? "Opening..." : "Open Lottery"}
            </button>
            {isError && <div>Error opening lottery: {error.message}</div>}
          </div>

          <div className="flex-1">
            <button className="btn btn-primary" onClick={handleCloseLottery} disabled={isPendingClose}>
              {isPendingClose ? "Closing..." : "Close Lottery"}
            </button>
            {isErrorClose && <div>Error closing lottery. Check console for more details</div>}
          </div>
        </div>
      </div>

      {isSuccess && !isSuccessClose && (
        <div>
          <p className="text-green-500 mt-2">Lottery opened successfully!</p>
          <CheckLotteryState contractAddress={contractAddress as `0x${string}`} />
        </div>
      )}
      {isSuccessClose && (
        <div>
          <p>Lottery closed successfully!</p>
        </div>
      )}
    </div>
  );
}

export default OpenLottery;
