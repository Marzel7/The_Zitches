import { ethers } from "ethers";
import { useContractCall } from "@usedapp/core";

// import ABI
import StakerContract from "../contracts/abis/Staker.json";
import FundManagerContract from "../contracts/abis/FundManager.json";
import TokenContract from "../contracts/abis/Token.json";
import VendorContract from "../contracts/abis/Vendor.json";
// import contract address
import adrs from "../contracts/contract-address.json";

export const useTokenBalanceCall = (address) => {
  const tokenBalance = useContractCall(
    address && {
      abi: new ethers.utils.Interface(TokenContract.abi),
      address: adrs.tokenAddr,
      method: "balanceOf",
      args: [address],
    }
  );
  return tokenBalance;
};

export const useTimeLeftCall = () => {
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

export const useThresholdCall = () => {
  const threshold = useContractCall({
    abi: new ethers.utils.Interface(StakerContract.abi),
    address: adrs.stakerAddr,
    method: "threshold",
    args: [],
  });
  console.log(threshold);
  return threshold;
};

export const useCompleteCall = () => {
  const complete = useContractCall({
    abi: new ethers.utils.Interface(FundManagerContract.abi),
    address: adrs.fundManagerAddr,
    method: "completed",
    args: [],
  });
  return complete;
};
