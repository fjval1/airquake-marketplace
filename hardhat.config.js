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
    /*
    rinkeby: {
      url: `https://speedy-nodes-nyc.moralis.io/dc87dee26508baa6bac5aef4/eth/rinkeby`,//moralis speedy node
      accounts: ['6754ddfd8741e6f406ee313220f299879e8f822ce0f499fb9ff1f525a484995b'] //private key
    },
    */
    mumbai: {
      url: 'https://speedy-nodes-nyc.moralis.io/dc87dee26508baa6bac5aef4/polygon/mumbai', //moralis speedy node
      accounts: ['cf10a54f054c711829d065608408c1e0476d1a7092d942cbdfe52c460e37d87c'] //private key for this public key: 0xA400c085222Da73D18cFEAdd3515549DAD411969
    }
  }
  
};
