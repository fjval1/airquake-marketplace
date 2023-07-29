const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

describe("Marketplace", function () {

  let wallets;
  let deployer;
  let creator;
  let user;
  let NFTImplementationFactory;
  let marketplaceFactory;
  let NFTImplementation;
  let marketplace;
  let NFTCollection;
  beforeEach(async function () {
    //await hre.network.provider.send("hardhat_reset")
    wallets = waffle.provider.getWallets();
    deployer = wallets[0];
    creator = wallets[1];
    NFTImplementationFactory = await ethers.getContractFactory("NFT");
    marketplaceFactory = await ethers.getContractFactory("Marketplace");
    NFTImplementation = await NFTImplementationFactory.connect(deployer).deploy();
    marketplace = await marketplaceFactory.connect(deployer).deploy(NFTImplementation.address);
  })

  it("Should return the NFT implementation after deployment", async function () {
    expect(await marketplace.NFTCollectionImplementation()).to.equal(NFTImplementation.address);
  });

  it("Should return the deployer as owner", async function () {
    expect(await marketplace.owner()).to.equal(deployer.address);
  });

  it("Should not let the creator make a collection before getting approved", async function () {
    await expect(marketplace.connect(creator).createNFTCollection("Bored Apes","BAYC")).to.be.reverted;
  });

  it("Should let the creator make a collection after getting approved", async function () {
    marketplace.connect(deployer).addCreatorToWhitelist(creator.address);
    await expect(marketplace.connect(creator).createNFTCollection("Bored Apes","BAYC")).to.emit(marketplace,"NFTCollectionCreated").withArgs("0x9bd03768a7DCc129555dE410FF8E85528A4F88b5",creator.address,"Bored Apes", "BAYC");
  });

  it("Should let the creator mint an NFT on a collection deployed by him", async function (){
    marketplace.connect(deployer).addCreatorToWhitelist(creator.address);
    const tx = await marketplace.connect(creator).createNFTCollection("Bored Apes","BAYC");
    const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
    const topics = receipt.logs[1].topics;
    const NFTCollectionAddress = "0x"+topics[1].slice(-40);
    let NFTCollectionContract = await ethers.getContractAt("NFT", NFTCollectionAddress);
    await expect(NFTCollectionContract.connect(creator).mintNft("url")).to.emit(NFTCollectionContract,"NftMinted");
  });

  it("Should not let the 'user' mint an NFT on a collection not deployed by him", async function () {
    marketplace.connect(deployer).addCreatorToWhitelist(creator.address);
    const tx = await marketplace.connect(creator).createNFTCollection("Bored Apes","BAYC");
    const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
    const topics = receipt.logs[1].topics;
    const NFTCollectionAddress = "0x"+topics[1].slice(-40);
    let NFTCollectionContract = await ethers.getContractAt("NFT", NFTCollectionAddress);
    await expect(NFTCollectionContract.connect(user).mintNft("url")).to.be.reverted;
  });






});
