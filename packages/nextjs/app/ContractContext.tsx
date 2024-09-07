import React, { createContext, useContext, useState } from "react";

interface ContractContextType {
  contractAddress: string | null;
  setContractAddress: (address: string | null) => void;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  return (
    <ContractContext.Provider value={{ contractAddress, setContractAddress }}>{children}</ContractContext.Provider>
  );
};

export const useContractContext = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContractContext must be used within a ContractProvider");
  }
  return context;
};
