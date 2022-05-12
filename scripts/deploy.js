const hre = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  const AirQuake = await ethers.getContractFactory("AirQuake");
  const airquake = await AirQuake.deploy();

  await airquake.deployed();
  //await airquake.whitelistCreator(deployer.address)
  console.log("AirQuake deployed to:", airquake.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });