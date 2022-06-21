const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("MetaMultiSigWallet Test", () => {
  let metaMultiSigWallet;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  let provider;

  const CHAIN_ID = 1;
  let signatureRequired = 1;

  let monyo; // ERC20 Token
  const MONYO_TOKEN_TOTAL_SUPPLY = "100";

  const toWei = value => ethers.utils.parseEther(value.toString());
  const fromWei = value => ethers.utils.formatEther(typeof value === "string" ? value : value.toString());

  const getBalance = ethers.provider.getBalance;

  // Runs before each test
  // Deploys MetaMultiSigWallet and sets up some addresses for easier testing

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    let metaMultiSigWalletFactory = await ethers.getContractFactory("MetaMultiSigWallet");
    metaMultiSigWallet = await metaMultiSigWalletFactory.deploy(CHAIN_ID, [owner.address], signatureRequired);

    await owner.sendTransaction({
      to: metaMultiSigWallet.address,
      value: toWei(1),
    });

    provider = owner.provider;

    let monyoFactory = await ethers.getContractFactory("Monyo");
    monyo = await monyoFactory.deploy(
      metaMultiSigWallet.address,
      ethers.utils.parseEther(MONYO_TOKEN_TOTAL_SUPPLY) // Create Monyo ERC20 token, mint 100 to the multiSigWallet
    );
  });
  describe("Deployment", () => {
    it("isOwner should return true for the owner address", async () => {
      expect(await metaMultiSigWallet.isOwner(owner.address)).to.equal(true);
    });

    it("Mutli sig wallet shoujld own all the Mono token", async () => {
      expect(await monyo.balanceOf(metaMultiSigWallet.address)).to.eq(toWei(MONYO_TOKEN_TOTAL_SUPPLY));
    });
    it("confirms contract balance", async () => {
      expect(await getBalance(metaMultiSigWallet.address)).to.eq(toWei(1));
    });
  });
  describe("Testing MetaMultiDigWallet", async () => {
    it("Adds a new signer", async () => {
      let newSigner = addr2.address;

      let nonce = await metaMultiSigWallet.nonce();

      let to = metaMultiSigWallet.address;
      let value = 0;

      // Returns the encoded data, which can be used as the data for a transaction for fragment
      //(see Specifying Fragments) for the given values.
      let callData = metaMultiSigWallet.interface.encodeFunctionData("addSigner", [newSigner, 1]);

      // Get transaction hash
      let hash = await metaMultiSigWallet.getTransactionHash(nonce, to, value, callData);

      const signature = await owner.provider.send("personal_sign", [hash, owner.address]);

      // Double check if owner address is recovered properly, executeTransaction would fail anyways
      expect(await metaMultiSigWallet.recover(hash, signature)).to.eq(owner.address);
      await metaMultiSigWallet.executeTransaction(metaMultiSigWallet.address, value, callData, [signature]);
      expect(await metaMultiSigWallet.isOwner(newSigner)).to.equal(true);
    });
  });
});
