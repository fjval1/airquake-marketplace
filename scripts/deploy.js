const hre = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  const NFTImplementationContractFactory = await ethers.getContractFactory("NFT");
  const NFTImplementation = await NFTImplementationContractFactory.deploy()
  console.log("nft implementation deployed to:", NFTImplementation.address);
  const MarketplaceContractFactory = await ethers.getContractFactory("Marketplace");
  const marketplace = await MarketplaceContractFactory.deploy(NFTImplementation.address);
  await marketplace.deployed();
  
  console.log("marketplace deployed to:", marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });