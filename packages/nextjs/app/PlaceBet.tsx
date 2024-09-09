import React, { useEffect, useState } from "react";
import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

function PlaceBet({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { address } = useAccount();
  const [userBets, setUserBets] = useState<number>(0);
  const { writeContract, data: hash } = useWriteContract();

  const {
    isLoading: isBetting,
    isSuccess: isBetSuccess,
    isError: isBetError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  //Get and update Bets Placed
  const { data: betsPlaced, refetch } = useReadContract({
    address: contractAddress,
    abi: LotteryABI.abi,
    functionName: "_slots",
    args: [address],
  });

  async function refetchBets() {
    return await refetch();
  }

  useEffect(() => {
    refetchBets();
    console.log("BETS PLACED", betsPlaced);
    if (betsPlaced && Array.isArray(betsPlaced)) {
      refetch();
      setUserBets(betsPlaced.length);
    }
  }, [betsPlaced, isBetting, refetch]);

  const handlePlaceBet = () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: LotteryABI.abi,
      functionName: "bet",
      args: [],
    });
  };

  return (
    <div className="my-2">
      <h3 className="text-lg font-bold mb-2">Place a Bet:</h3>
      <button className="btn btn-primary" onClick={handlePlaceBet} disabled={isBetting}>
        {isBetting ? "Placing Bet..." : "Place Bet"}
      </button>
      {isBetSuccess && <p className="text-green-500 mt-2">Bet placed successfully!</p>}
      {isBetError && <p className="text-red-500 mt-2">Error placing bet.</p>}
      <div>
        <p>You have placed {userBets} bets.</p>
      </div>
    </div>
  );
}

export default PlaceBet;
