// const { ethers } = require("hardhat");
// const { use, expect } = require("chai");
// const { solidity } = require("ethereum-waffle");

// use(solidity);

// const toWei = (value) => ethers.utils.parseEther(value.toString());
// const fromWei = (value) =>
//   ethers.utils.formatEther(
//     typeof value === "string" ? value : value.toString()
//   );

// const getBalance = ethers.provider.getBalance;

// /**
//  * @notice auto-grading tests for simpleDEX challenge
//  * Stages of testing are as follows: set up global test variables, test contract deployment, deploy contracts in beforeEach(), then actually test out each separate function.
//  * @dev this is still a rough WIP. See TODO: scattered throughout.'
//  * @dev additional TODO: Write edge cases; putting in zero as inputs, or whatever.
//  */
// describe("Simple DEX", function () {
//   this.timeout(45000);

//   let dexContract;
//   let balloonsContract;
//   let deployer;
//   let user2;
//   let user3;
//   let balances;

//   // assign 'signer' addresses as object properties (Strings) to user array --> this is so we have signers ready to test this thing.
//   before(async function () {
//     const getAccounts = async function () {
//       let accounts = [];
//       let signers = [];
//       signers = await hre.ethers.getSigners();
//       for (const signer of signers) {
//         accounts.push({ signer, address: await signer.getAddress() });
//       } //populates the accounts array with addresses.
//       return accounts;
//     };

//     // REFACTOR
//     [deployer, user2, user3] = await getAccounts();

//     // console.log("User1 after before(): ", user1);
//   });

//   // quick fix to let gas reporter fetch data from gas station & coinmarketcap
//   before((done) => {
//     setTimeout(done, 2000);
//   });

//   describe("DEX: Standard Path", function () {
//     // 1st check if DEX contract already deployed, otherwise balloons needs to be deployed! TODO: have to figure out what account is the deployer if the challenger submits with a .env file!
//     if (process.env.CONTRACT_ADDRESS) {
//       it("Should connect to dex contract", async function () {
//         dexContract = await ethers.getContractAt(
//           "DEX",
//           process.env.CONTRACT_ADDRESS
//         );
//         console.log("     🛰 Connected to DEX contract", dexContract.address);
//       });
//     } else {
//       it("Should deploy Balloons contract", async function () {
//         const BalloonsContract = await ethers.getContractFactory(
//           "Balloons",
//           deployer
//         );
//         balloonsContract = await BalloonsContract.deploy();
//       });
//       it("Should deploy DEX", async function () {
//         const Dex = await ethers.getContractFactory("DEX", deployer);
//         dexContract = await Dex.deploy(balloonsContract.address);

//         balances = async () => {
//           let ethBalance = await getBalance(dexContract.address);
//           let tokenBalance = await balloonsContract.balanceOf(
//             dexContract.address
//           );
//           console.log("*** ETH / BAL ***");
//           return [fromWei(ethBalance), fromWei(tokenBalance)];
//         };
//       });
//     }

//     // see if initial setup works, should have 1000 balloons in totalSupply, and 5 balloons + 5 ETH within DEX. This set up will be used continuously afterwards for nested function tests.
//     // TODO: Also need to test that the other functions do not work if we try calling them without init() started.
//     describe("init()", function () {
//       it("Should set up DEX with 5 balloons at start", async function () {
//         let tx1 = await balloonsContract
//           .connect(deployer.signer)
//           .approve(dexContract.address, ethers.utils.parseEther("1000"));
//         await expect(tx1)
//           .emit(balloonsContract, "Approval")
//           .withArgs(
//             deployer.address,
//             dexContract.address,
//             ethers.utils.parseEther("1000")
//           );
//         let tx2 = await dexContract
//           .connect(deployer.signer)
//           .init(ethers.utils.parseEther("5"), {
//             value: ethers.utils.parseEther("5"),
//           });
//         await expect(tx2).emit(balloonsContract, "Transfer");

//         // TODO: SYNTAX - get revert test to work
//         await expect(
//           dexContract
//             .connect(deployer.signer)
//             .init(ethers.utils.parseEther("5"))
//         ).to.be.revertedWith("DEX already has liquidity");
//         console.log(await balances());
//       });

//       describe("ethToToken", function () {
//         it("Should send 1 Ether to DEX in exchange for _ $BAL", async function () {
//           let ethAmount = toWei(1);
//           let balance = await getBalance(dexContract.address);
//           let tx1 = await dexContract.connect(deployer.signer).ethToToken({
//             value: ethAmount,
//           });
//           // TODO: SYNTAX - Figure out how to read eth balance of dex contract and to compare it against the eth sent in via this tx. Also figure out why/how to read the event that should be emitted with this too.
//           let balanceUpdated = ethAmount.add(balance);
//           expect(await getBalance(dexContract.address)).to.equal(
//             balanceUpdated
//           );
//           let tokenBalance = await dexContract.tokenReserve();

//           const rc = await tx1.wait(); // 0ms, as tx is already confirmed
//           const event = rc.events.find(
//             (event) => event.event === "EthToTokenSwap"
//           );
//           const [from, to, value, tokenAmount] = event.args;
//           expect(tokenBalance).to.equal(balance.sub(tokenAmount));
//           await expect(tx1)
//             .emit(dexContract, "EthToTokenSwap")
//             .withArgs(
//               deployer.address,
//               "Eth to BAL",
//               ethers.utils.parseEther("1"),
//               tokenAmount
//             );

//           console.log("token amount from 1st eth swap", fromWei(tokenAmount));
//         });

//         it("Should send less tokens after the first trade (ethToToken called)", async function () {
//           let tx1 = await dexContract.connect(deployer.signer).ethToToken({
//             value: ethers.utils.parseEther("1"),
//           });
//           let tx2 = await dexContract.connect(user2.signer).ethToToken({
//             value: ethers.utils.parseEther("1"),
//           });
//           let rc = await tx1.wait(); // 0ms, as tx is already confirmed
//           let event = rc.events.find(
//             (event) => event.event === "EthToTokenSwap"
//           );
//           const [from, to, value, tx1TokenAmount] = event.args;
//           await expect(tx1)
//             .emit(dexContract, "EthToTokenSwap")
//             .withArgs(
//               deployer.address,
//               "Eth to BAL",
//               ethers.utils.parseEther("1"),
//               tx1TokenAmount
//             );
//           rc = await tx2.wait(); // 0ms, as tx is already confirmed
//           event = rc.events.find((event) => event.event === "EthToTokenSwap");
//           const [fromtx2, totx2, valuetx2, tx2TokenAmount] = event.args;
//           await expect(tx2)
//             .emit(dexContract, "EthToTokenSwap")
//             .withArgs(
//               user2.address,
//               "Eth to BAL",
//               ethers.utils.parseEther("1"),
//               tx2TokenAmount
//             );
//           expect(tx1TokenAmount).to.be.gt(tx2TokenAmount);

//           console.log(
//             "token amount from 2nd eth swap",
//             fromWei(tx1TokenAmount)
//           );
//           console.log(
//             "token amount from 3rd eth swap",
//             fromWei(tx2TokenAmount)
//           );
//         });
//         // could insert more tests to show the declining price, and what happens when the pool becomes very imbalanced.
//       });
//       describe("tokenToEth", async () => {
//         it("Should send 1 $BAL to DEX in exchange for _ $ETH", async function () {
//           console.log(await balances());
//           let tx1 = await dexContract
//             .connect(deployer.signer)
//             .tokenToEth(toWei(1));

//           //TODO: SYNTAX -  write an expect that takes into account the emitted event from tokenToETH.
//           let rc = await tx1.wait();
//           let event = rc.events.find(
//             (event) => event.event === "TokenToEthSwap"
//           );
//           const [from, to, ethOutput, tokenInput] = event.args;
//           await expect(tx1)
//             .emit(dexContract, "TokenToEthSwap")
//             .withArgs(deployer.address, "BAL to ETH", ethOutput, toWei(1));
//           console.log("eth amount from 1st Token Swap", fromWei(ethOutput));
//         });

//         it("Should send less tokens after the first trade (tokenToEach() called)", async function () {
//           let tx1 = await dexContract
//             .connect(deployer.signer)
//             .tokenToEth(toWei(1));

//           let rc = await tx1.wait();
//           let event = rc.events.find(
//             (event) => event.event === "TokenToEthSwap"
//           );
//           let [from, to, tx1ethOutput, tokenInput] = event.args;
//           console.log("eth amount from 2nd Token Swap", fromWei(tx1ethOutput));

//           let tx2 = await dexContract
//             .connect(deployer.signer)
//             .tokenToEth(toWei(1));

//           rc = await tx2.wait();
//           event = rc.events.find((event) => event.event === "TokenToEthSwap");
//           let [tx2from, tx2to, tx2ethOutput, tx2tokenInput] = event.args;
//           expect(tx1ethOutput).to.be.gt(tx2ethOutput);

//           await expect(tx2)
//             .emit(dexContract, "TokenToEthSwap")
//             .withArgs(deployer.address, "BAL to ETH", tx2ethOutput, toWei(1));
//           console.log("eth amount from 3rd Token Swap", fromWei(tx2ethOutput));

//           let tx3 = await dexContract
//             .connect(deployer.signer)
//             .tokenToEth(toWei(1));

//           rc = await tx3.wait();
//           event = rc.events.find((event) => event.event === "TokenToEthSwap");
//           let [tx3from, tx3to, tx3ethOutput, tx3tokenInput] = event.args;
//           expect(tx2ethOutput).to.be.gt(tx3ethOutput);

//           await expect(tx3)
//             .emit(dexContract, "TokenToEthSwap")
//             .withArgs(deployer.address, "BAL to ETH", tx3ethOutput, toWei(1));
//           console.log("eth amount from 4th Token Swap", fromWei(tx3ethOutput));
//           console.log(await balances());
//         });
//       });

//       describe("deposit", async () => {
//         it("Rebalances Pools", async () => {
//           await dexContract.connect(deployer.signer).withdraw(toWei(5));
//           await dexContract.init(toWei(5), { value: toWei(5) });
//           console.log(await balances());
//           expect(await getBalance(dexContract.address)).to.equal(toWei(5));
//         });
//         it("Should deposit equal ETH and $BAL when pool at 1:1 ratio", async function () {
//           let tx1 = await dexContract.connect(deployer.signer).deposit({
//             value: ethers.utils.parseEther("10"),
//           });
//           expect(await getBalance(dexContract.address)).to.equal(toWei(15));
//           expect(
//             await balloonsContract.balanceOf(dexContract.address)
//           ).to.equal(toWei(15));
//           console.log(await balances());
//           // TODO: SYNTAX - Write expect() assessing changed liquidty within the pool. Should have an emitted event!
//           expect(await dexContract.getLiquidity(deployer.address)).to.equal(
//             toWei(15)
//           );

//           let rc = await tx1.wait();
//           let event = rc.events.find(
//             (event) => event.event === "LiquidityProvided"
//           );
//           const [
//             liquidityProvider,
//             liquidityProvided,
//             tokensDeposited,
//             liquidityBalance,
//             liquidityMinted,
//             totalLiquidity,
//           ] = event.args;
//           expect(liquidityProvider).to.eq(deployer.address);
//           expect(liquidityProvided).to.eq(toWei(10));
//           expect(tokensDeposited).to.eq(toWei(10));
//           expect(liquidityBalance).to.eq(toWei(15));
//           expect(liquidityMinted).to.eq(toWei(10));
//           expect(totalLiquidity).to.eq(toWei(15));
//         });
//       });

//       // pool should have 15:15 ETH:$BAL ratio
//       describe("withdraw", async () => {
//         it("Should withdraw 1 ETH and 1 $BAL when pool at 1:1 ratio", async function () {
//           let tx1 = await dexContract
//             .connect(deployer.signer)
//             .withdraw(toWei(1));

//           expect(await getBalance(dexContract.address)).to.eq(toWei(14));
//           let rc = await tx1.wait();
//           let event = rc.events.find(
//             (event) => event.event === "LiquidityRemoved"
//           );
//           const [
//             liquidityProvider,
//             ethOutput,
//             tokenOutput,
//             newLiquidityPosition,
//             liquidityWithdrawn,
//             totalLiquidity,
//           ] = event.args;
//           expect(liquidityProvider).to.eq(deployer.address);
//           expect(ethOutput).to.eq(toWei(1));
//           expect(tokenOutput).to.eq(toWei(1));
//           expect(newLiquidityPosition).to.eq(toWei(14));
//           expect(liquidityWithdrawn).to.eq(toWei(1));
//           expect(totalLiquidity).to.eq(toWei(14));
//           console.log(await balances());
//         });
//       });
//     });
//   });
// });
