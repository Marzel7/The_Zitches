import { formatEther } from "@ethersproject/units";
import { BigNumber } from "ethers";

const formatter = new Intl.NumberFormat("en-us", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export const formatBalance = (balance) => {
  console.log(balance);
  return formatter.format(
    parseFloat(formatEther(balance ?? BigNumber.from("0")))
  );
};
