import { formatEther } from "@ethersproject/units";
import { BigNumber } from "ethers";

export const formatter = new Intl.NumberFormat("en-us", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export const formatBalance = (balance) => {
  return formatter.format(
    parseFloat(formatEther(balance ?? BigNumber.from("0")))
  );
};

export const dateFormatter = (timestamp) => {
  var date = new Date(timestamp);
  return date;
};

export const formatDate = (timestamp) => {
  var date = new Date(timestamp);
  return (
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
};
