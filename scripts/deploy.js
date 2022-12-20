// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Setup accounts and variables
  const [deployer] = await ethers.getSigners();

  // Deploy contract
  const TodoWeb3 = await ethers.getContractFactory("TodoWeb3");
  const todoWeb3 = await TodoWeb3.deploy();
  await todoWeb3.deployed();
  console.log(`Deployed task contract at: ${todoWeb3.address}`);

  // Creating a list of tasks
  const tasks = ["Create a video on GPT", "Complete Dapp University course"];

  // List tasks
  for (let i = 0; i < tasks.length; i++) {
    let transaction = await todoWeb3.connect(deployer).createTask(tasks[i]);
    await transaction.wait();
    console.log(`Created task${i + 1}: ${tasks[i]}`);
  }
}

// This pattern is recommended to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
