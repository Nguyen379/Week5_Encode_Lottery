import { useEffect, useState } from "react";
import LotteryABI from "../../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { useReadContract } from "wagmi";

function CheckBetstimers({ contractAddress }: { contractAddress: `0x${string}` }) {
  const [time, setTime] = useState();
  const [seconds, setSeconds] = useState(0);

  // using useReadAddress to fetch data
  const { data, isSuccess, isLoading } = useReadContract({
    address: contractAddress,
    abi: LotteryABI.abi,
    functionName: "betsClosingTime",
  });

  const printFormatedTime = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(time);

  useEffect(() => {
    if (!time) return;
    const interval = setInterval(() => {
      setSeconds(Math.floor((time - Date.now()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    if (!data) return;
    // convert the BigInt from the data recieved from the contract to number and create a new Date object
    const timestamp = new Date(Number(data));
    // save it to the component state
    setTime(timestamp);
  }, [data]);

  // if time changes, create a <hh:mm:ss> format string to print
  const hoursForClosing = time && Math.floor((time - Date.now()) / 1000 / 60 / 60);
  const minutesForClosing = time && Math.floor((time - Date.now()) / 1000 / 60) % 60;
  const secondsForClosing = time && Math.floor((time - Date.now()) / 1000) % 60;

  return (
    <>
      <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs w-auto rounded-3xl">
        <div>
          <h2 className="font-semibold text-lg">Lottery closing time:</h2>
        </div>
        <div className="">
          {isLoading && <div>Loading...</div>}
          {isSuccess && (
            <>
              <span>📅{printFormatedTime}</span>
              <br />
              <span>
                {seconds >= 1
                  ? `${hoursForClosing}:${minutesForClosing}:${secondsForClosing} hours remaining...`
                  : `Bets are closed`}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CheckBetstimers;
