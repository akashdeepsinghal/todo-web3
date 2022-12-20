const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("TodoWeb3", () => {
  let todoWeb3;
  let deployer;
  const CONTRACT_NAME = "GodaddyWeb3";
  const CONTRACT_SYMBOL = "GW3";
  const CONTENT = "Get vegetables";
  beforeEach(async () => {
    // Setup accounts
    [deployer] = await ethers.getSigners();

    // Deploy contract
    const TodoWeb3 = await ethers.getContractFactory("TodoWeb3");
    todoWeb3 = await TodoWeb3.deploy(CONTRACT_NAME, CONTRACT_SYMBOL);

    // Create task
    let transaction = await todoWeb3.connect(deployer).createTask(CONTENT);
    await transaction.wait();
  });

  describe("Create Task", async () => {
    it("creates the task", async () => {
      const result = await todoWeb3.tasks(1);
      expect(result.content).to.be.equal(CONTENT);
      expect(result.completed).to.be.equal(false);
    });
  });

  describe("Complete Task", async () => {
    // Completes task
    beforeEach(async () => {
      transaction = await todoWeb3.connect(deployer).toggleCompleted(1);
      await transaction.wait();
    });
    it("completes the task", async () => {
      const result = await todoWeb3.tasks(1);
      expect(result.content).to.be.equal(CONTENT);
      expect(result.completed).to.be.equal(true);
    });
  });
});
