import { useEffect } from "react";
import LotteryABI from "../../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import DatePicker from "./DatePicker";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

function OpenBets({ contractAddress, onChange, isBetsOpen }) {
  // using useReadAddress to fetch data
  const { writeContract, data: hash } = useWriteContract();
  const {
    isLoading: isOpening,
    isSuccess: isOpenSuccess,
    isFetched: isOpenFetched,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: betsOpen, refetch: refetchBetsState } = useReadContract({
    address: contractAddress,
    abi: LotteryABI.abi,
    functionName: "betsOpen",
  });

  async function handleOpenBets(betsEndtime): Promise<void> {
    if (!contractAddress) {
      alert("Please deploy a lottery instance first.");
      return;
    }

    if (!betsOpen) {
      // hardcoded value of 5 minutes from now
      // const betsEndtime = BigInt(new Date().valueOf() + 5 * 60 * 1000);
      writeContract({
        address: contractAddress,
        abi: LotteryABI.abi,
        functionName: "openBets",
        args: [BigInt(betsEndtime)],
      });
    } else {
      alert("Bets are already open");
    }
  }

  useEffect(() => {
    // triggering this flag on parent component
    isOpenSuccess ? onChange(true) : onChange(false);
    refetchBetsState();
  }, [isOpenFetched, isOpenSuccess, onChange, refetchBetsState]);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div>
          <h3 className="block text-3xl font-bold">Open & Close Bets</h3>
          {!isBetsOpen && (
            <div className="flex flex-col">
              <DatePicker label="Open Bets" onSubmit={handleOpenBets} />

              {isOpening && <span>Opening bets...</span>}
            </div>
          )}
          {isOpenSuccess && (
            <div className="block w-auto">
              <p className="truncate">Bets are open!</p>
            </div>
          )}
        </div>
        <div className="mt-2">
          <div>
            <p className="text-lg font-bold mb-2">Lottery state: </p>
            <span className={`font-semibold text-xl ${betsOpen ? "text-green-600" : "text-red-600"}`}>
              {betsOpen ? "Open" : "Closed"}
            </span>
          </div>
          <button onClick={() => refetchBetsState()} className="btn btn-ghost text-sm mt-6 text-gray-600 w-28">
            Refresh
          </button>
        </div>
      </div>
    </>
  );
}

export default OpenBets;
