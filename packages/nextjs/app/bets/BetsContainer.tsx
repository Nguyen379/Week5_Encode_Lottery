import { useState } from "react";
import CheckBetstimers from "./CheckBetstimers";
import OpenBets from "./OpenBets";

export default function BetsContainer({ contractAddress }) {
  const [betsOpen, setBetsOpen] = useState(false);

  return (
    <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs w-auto rounded-3xl">
          <OpenBets onChange={state => setBetsOpen(state)} contractAddress={contractAddress as `0x${string}`} />
        </div>
        {betsOpen && <CheckBetstimers contractAddress={contractAddress as `0x${string}`} />}
      </div>
    </div>
  );
}
