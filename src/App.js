import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Task from "./components/Task";

// ABIs
import TodoWeb3 from "./abis/TodoWeb3.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [todoWeb3, setTodoWeb3] = useState(null);
  const [taskCount, setTaskCount] = useState(null);
  const [tasks, setTasks] = useState([]);

  const loadBlockchainData = async () => {
    // Load Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();

    // Load Contract
    const todoWeb3 = new ethers.Contract(
      config[network.chainId].TodoWeb3.address,
      TodoWeb3,
      provider
    );
    setTodoWeb3(todoWeb3);

    const taskCount = await todoWeb3.taskCount();
    setTaskCount(taskCount);

    const tasks = [];
    for (var i = 1; i <= taskCount; i++) {
      const task = await todoWeb3.tasks(i);
      tasks.push(task);
    }
    console.log(tasks);
    setTasks(tasks);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <div className="cards__section">
        <h2 className="cards__title">Just do it</h2>
        {/* <hr /> */}

        <div className="cards">
          {tasks.map((task, index) => (
            <Task
              task={task}
              todoWeb3={todoWeb3}
              provider={provider}
              id={index + 1}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
