import React from "react";
import { useCallback } from "react";
import LotteryABI from "../../hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { useContractContext } from "./ContractContext";
import { deployContract, getTransactionReceipt } from "@wagmi/core";
import { parseEther } from "ethers";
import { useAccount, useConfig } from "wagmi";

const DeployContractButton = () => {
  const config = useConfig();
  const { isConnected } = useAccount();
  const { setContractAddress } = useContractContext();

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

  return (
    <button onClick={handleDeploy} disabled={!isConnected} className="btn btn-primary">
      Deploy Lottery Contract
    </button>
  );
};

export default DeployContractButton;
