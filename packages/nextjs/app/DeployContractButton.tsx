import React, { useCallback, useState } from "react";
import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { useContractContext } from "./ContractContext";
import { deployContract, getTransactionReceipt } from "@wagmi/core";
import { parseEther } from "ethers";
import { useAccount, useConfig } from "wagmi";

const DeployContractButton = () => {
  const config = useConfig();
  const { isConnected } = useAccount();
  const { setContractAddress } = useContractContext();
  const [existingAddress, setExistingAddress] = useState("");

  const handleDeploy = useCallback(async () => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    const BET_PRICE = "1";
    const BET_FEE = "0.2";
    const TOKEN_RATIO = 1n;

    try {
      const result = await deployContract(config, {
        abi: LotteryABI.abi,
        args: ["LotteryToken", "LT0", TOKEN_RATIO, parseEther(BET_PRICE), parseEther(BET_FEE)],
        bytecode: LotteryABI.bytecode as `0x${string}`,
      });

      const txReceipt = await getTransactionReceipt(config, { hash: result });
      console.log("Contract deployed:", txReceipt.contractAddress);
      if (!txReceipt.contractAddress) {
        throw new Error("Contract deployment failed.");
      }
      setContractAddress(txReceipt.contractAddress);
    } catch (error) {
      console.error("Error deploying contract:", error);
      alert("Error deploying contract. Check console for details.");
    }
  }, [config, isConnected, setContractAddress]);

  const handleExistingAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingAddress) {
      setContractAddress(existingAddress);
      console.log("Using existing contract address:", existingAddress);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button onClick={handleDeploy} disabled={!isConnected} className="btn btn-primary">
        Deploy Lottery Contract
      </button>
      <form onSubmit={handleExistingAddressSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={existingAddress}
          onChange={e => setExistingAddress(e.target.value)}
          placeholder="Enter existing contract address"
          className="input input-bordered"
        />
        <button type="submit" className="btn btn-secondary">
          Use Existing Contract
        </button>
      </form>
    </div>
  );
};

export default DeployContractButton;
