// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TodoWeb3 is ERC721 {
    uint256 public taskCount = 0;

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 id, string content, bool completed);

    event TaskCompleted(uint256 id, bool completed);

    constructor(string memory _name, string memory _symbol)
        public
        ERC721(_name, _symbol)
    {
        // createTask("Check out dappuniversity.com");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint256 _id) public {
        tasks[_id].completed = !tasks[_id].completed;
        emit TaskCompleted(_id, tasks[_id].completed);
    }
}
