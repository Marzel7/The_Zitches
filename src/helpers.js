import { formatEther } from "@ethersproject/units";
import { BigNumber } from "ethers";

export const formatter = new Intl.NumberFormat("en-us", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatBalance = (balance) => {
  return formatter.format(
    parseFloat(formatEther(balance ?? BigNumber.from("0")))
  );
};

export const formatUSD = (balance) => {
  return formatter.format(parseFloat(balance) ?? BigNumber.from("0"));
};

export const dateFormatter = (timestamp) => {
  var date = new Date(timestamp);
  return date;
};

export const formatDate = (timestamp) => {
  var date = new Date(timestamp);
  let minutes = date.getMinutes();
  minutes = minutes <= 9 ? "0" + minutes : minutes;
  return (
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    minutes
  ).padStart(
    2,
    "0" // +
    // ":" +
    //date.getSeconds()
  );
};
