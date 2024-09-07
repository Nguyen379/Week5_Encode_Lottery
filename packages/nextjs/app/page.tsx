"use client";

import Link from "next/link";
import { ContractProvider, useContractContext } from "./ContractContext";
import DeployContractButton from "./DeployContractButton";
// import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
// import scaffoldConfig from "../scaffold.config";
// import { deployContract, http, createConfig } from "@wagmi/core";
// import { hardhat, sepolia } from "@wagmi/core/chains";
// import { parseEther } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

// async function DeployContract() {
//   const BET_PRICE = "1";
//   const BET_FEE = "0.2";
//   const TOKEN_RATIO = 1n;

//   const config = createConfig({
//     chains: [hardhat, sepolia],
//     transports: {
//       [hardhat.id]: http(),
//       [sepolia.id]: http(),
//     },
//   });

//   const result = await deployContract(config, {
//     abi: LotteryABI.abi,
//     args: ["LotteryToken", "LT0", TOKEN_RATIO, parseEther(BET_PRICE), parseEther(BET_FEE)],
//     bytecode: LotteryABI.bytecode as `0x${string}`,
//   });

//   console.log(result);
// }

// function DeployLottery() {
//   const { address, isConnecting, isDisconnected, chain } = useAccount();
//   if (address)
//     return (
//       <div>
//         <p>Your account address is {address}</p>
//         <p>Connected to the network {chain?.name}</p>
//         <DeployContract></DeployContract>
//       </div>
//     );
//   if (isConnecting)
//     return (
//       <div>
//         <p>Loading...</p>
//       </div>
//     );
//   if (isDisconnected)
//     return (
//       <div>
//         <p>Wallet disconnected. Connect wallet to continue</p>
//       </div>
//     );
//   return (
//     <div>
//       <p>Connect wallet to continue</p>
//     </div>
//   );
// }

const Home: NextPage = () => {
  return (
    <ContractProvider>
      <HomeContent />
    </ContractProvider>
  );
};

const HomeContent: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { contractAddress } = useContractContext();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
        <PageBody />
        {contractAddress && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Lottery Contract Address:</h2>
            <p className="font-mono">{contractAddress}</p>
          </div>
        )}
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Here we are!</p>
      <DeployContractButton />
    </>
  );
}

export default Home;
