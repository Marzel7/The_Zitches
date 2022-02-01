import { ethers } from "ethers";
import { useContractCall } from "@usedapp/core";

// import ABI
import StakerContract from "../contracts/abis/Staker.json";
// import contract address
import adrs from "../contracts/contract-address.json";

export const useTimeLeft = () => {
  const timeLeft = useContractCall(stakerTimeLeftCall);
  return timeLeft;
};

const stakerTimeLeftCall = {
  abi: new ethers.utils.Interface(StakerContract.abi),
  address: adrs.stakerAddr,
  method: "timeLeft",
  args: [],
};
