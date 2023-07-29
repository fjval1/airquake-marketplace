require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  
  solidity: {
    compilers: [
      {
        version: "0.8.13",
      },
    ]
  },
  paths:{
    artifacts: "./src/artifacts"
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    /*
    rinkeby: {
      url: `https://speedy-nodes-nyc.moralis.io/dc87dee26508baa6bac5aef4/eth/rinkeby`,//moralis speedy node
      accounts: ['6754ddfd8741e6f406ee313220f299879e8f822ce0f499fb9ff1f525a484995b'] //private key
    },
    */
    mumbai: {
      url: 'https://speedy-nodes-nyc.moralis.io/dc87dee26508baa6bac5aef4/polygon/mumbai', //moralis speedy node
      accounts: ['eda2f07c090fc0c853c74e8de3ba88bdbad266def4b21b909d6e20b387bba8f8'] //private key for this public key: 0xcba7DD8462d9F6068F8657572349866531dE2025
    }
  }
  
};
