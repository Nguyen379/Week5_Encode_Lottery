import React, { useState } from "react";
import LotteryABI from 
  "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import TokenABI from 
  "../../hardhat/artifacts/contracts/LotteryToken.sol/LotteryToken.json";
import { formatEther } from "ethers";
import { useReadContract, useWriteContract, 
  useWaitForTransactionReceipt } from "wagmi";

function CheckPlayerPrize({ lotteryContractAddress }: { lotteryContractAddress: `0x${string}` }) {
  const [userAddress, setUserAddress] = useState("");

  const handleCheckPrizeBalance = () => {
    const prize = useReadContract({
      address: lotteryContractAddress,
      abi: LotteryABI.abi,
      functionName: "balanceOf",
      args: [userAddress],
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <form className="flex items-center gap-2">
        <input
          type="text"
          value={userAddress}
          onChange={e => setUserAddress(e.target.value)}
          placeholder="Enter user address"
          className="input input-bordered"
        />
        <button onClick={handleCheckPrizeBalance} className="btn btn-secondary">
          Check Prize
        </button>
      </form>
    </div>
  );
}

export default CheckPlayerPrize;


// async function displayPrize(index: string): Promise<string> {
//     const accounts = await getAccounts();
//     const contract = await viem.getContractAt("Lottery", contractAddress);
//     const prizeBN = await contract.read.prize([
//       accounts[Number(index)].account.address,
//     ]);
//     const prize = formatEther(prizeBN);
//     console.log(
//       `The account of address ${
//         accounts[Number(index)].account.address
//       } has earned a prize of ${prize} Tokens\n`
//     );
//     return prize;
//   }


//   async function displayOwnerPool() {
//     const contract = await viem.getContractAt("Lottery", contractAddress);
//     const balanceBN = await contract.read.ownerPool();
//     const balance = formatEther(balanceBN);
//     console.log(`The owner pool has (${balance}) Tokens \n`);
//   }
  

//   async function claimPrize(index: string, amount: string) {
//     const accounts = await getAccounts();
//     const publicClient = await getClient();
//     const contract = await viem.getContractAt("Lottery", contractAddress);
//     const tx = await contract.write.prizeWithdraw([parseEther(amount)], {
//       account: accounts[Number(index)].account,
//     });
//     const receipt = await publicClient.getTransactionReceipt({ hash: tx });
//     console.log(`Prize claimed (${receipt?.transactionHash})\n`);
//   }