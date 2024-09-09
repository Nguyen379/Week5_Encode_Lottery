import * as React from "react";
import { useEffect, useState } from "react";
import { abi } from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { Block } from "viem";
import { usePublicClient, useReadContract } from "wagmi";

export const CheckLotteryState = ({ contractAddress }: { contractAddress: `0x${string}` }) => {
  const { data: betsOpen } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "betsOpen",
  });

  const { data: betsClosingTime } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "betsClosingTime",
  });

  const [block, setBlock] = useState<Block | null>();
  const publicClient = usePublicClient();

  // Fetch the latest block
  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const newBlock = await publicClient?.getBlock();
        setBlock(newBlock);
      } catch (error) {
        console.error("Error fetching block:", error);
      }
    };

    fetchBlock();
  }, [publicClient]);

  console.log("Open: ", betsOpen);
  console.log("Closing time READDATA: ", new Date(Number(betsClosingTime) * 1000).toLocaleString());
  console.log(betsClosingTime);
  console.log(block?.timestamp);
  console.log("Now:", Math.floor(Date.now() / 1000));

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Check Lottery State: </h2>
        {betsOpen !== undefined && <div>State: {betsOpen ? "open" : "closed"}</div>}
        {betsOpen == true && betsClosingTime !== undefined && (
          <div>Closing Time: {new Date(Number(betsClosingTime) * 1000).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
};
