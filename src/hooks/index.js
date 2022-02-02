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

export const useBalanceCall = () => {
  const userStakedBalance = useContractCall(stakerStakedBalanceCall);
  return userStakedBalance;
};

const stakerTimeLeftCall = {
  abi: new ethers.utils.Interface(StakerContract.abi),
  address: adrs.stakerAddr,
  method: "timeLeft",
  args: [],
};
const stakerStakedBalanceCall = {
  abi: new ethers.utils.Interface(StakerContract.abi),
  address: adrs.stakerAddr,
  method: "balances",
  args: ["0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"],
};
