import { ethers } from "ethers";
import { useContractCall } from "@usedapp/core";

// import ABI
import StakerContract from "../contracts/abis/Staker.json";
// import contract address
import adrs from "../contracts/contract-address.json";

export const useTimeLeft = () => {
  const timeLeft = useContractCall({
    abi: new ethers.utils.Interface(StakerContract.abi),
    address: adrs.stakerAddr,
    method: "timeLeft",
    args: [],
  });
  return timeLeft;
};

export const useBalanceCall = (ownerAddress) => {
  const userStakedBalance = useContractCall(
    ownerAddress && {
      abi: new ethers.utils.Interface(StakerContract.abi),
      address: adrs.stakerAddr,
      method: "balances",
      args: [ownerAddress],
    }
  );
  return userStakedBalance;
};
