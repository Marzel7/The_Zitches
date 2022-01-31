import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from "@usedapp/core";

// import ABI
import StakerContract from "../contracts/abis/Staker.json";
// import contract address
import adrs from "../contracts/contract-address.json";
const x = StakerContract.abi;
const StakerContractInterface = new ethers.utils.Interface(x);

export const useTimeLeft = () => {
  const [useTimeLeft] = useContractCall({
    abi: StakerContractInterface,
    address: adrs.stakerAddr,
    method: "timeLeft",
    args: [],
  });

  return useTimeLeft;
};
