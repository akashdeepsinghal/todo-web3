import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Task from "./components/Task";
// import Logic from "./components/logic";

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
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

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
    await getAllTasks(todoWeb3);
  };

  const getAllTasks = async (todoWeb3) => {
    console.log(todoWeb3);
    const taskCount = await todoWeb3.taskCount();
    setTaskCount(taskCount);

    const tasks = [];
    for (var i = 1; i <= taskCount; i++) {
      const task = await todoWeb3.tasks(i);
      tasks.push(task);
    }
    console.log(tasks);
    setTasks(tasks);
    setFilteredTasks(tasks);
  };

  const handleChange = (e) => {
    setNewTask(e.currentTarget.value);
    console.log(e.currentTarget.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTask(newTask);
  };

  const addTask = async (t) => {
    // Add task
    const signer = await provider.getSigner();
    let transaction = await todoWeb3.connect(signer).createTask(t);
    await transaction.wait();
    setNewTask("");

    await getAllTasks(todoWeb3);
  };

  const filterTasks = (e) => {
    const selectedFilter = e.currentTarget.id;
    console.log(`activeFilter: ${activeFilter}`);
    console.log(`selectedFilter: ${selectedFilter}`);
    if (selectedFilter !== activeFilter) {
      let filteredTasks = tasks;
      let completed = false;
      if (selectedFilter !== "all") {
        if (selectedFilter === "completed") {
          completed = true;
        }
        console.log(`completed: ${completed}`);
        filteredTasks = tasks.filter((task) => {
          return task.completed === completed;
        });
      }
      console.log(filteredTasks);
      setFilteredTasks(filteredTasks);
      setActiveFilter(selectedFilter);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      console.log("do validate");
      let inputTask = e.currentTarget.value;
      await addTask(inputTask);
    }
  };

  const clearCompleted = async () => {
    // Clear completed tasks
    const signer = await provider.getSigner();
    let transaction = await todoWeb3.connect(signer).clearCompletedTasks();
    await transaction.wait();
    setNewTask("");

    await getAllTasks(todoWeb3);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="task-input">
          <ion-icon name="create-outline">&#127919;</ion-icon>
          <input
            id="newTask"
            type="text"
            className="form-control"
            placeholder="Type a task and Enter"
            value={newTask}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />
        </div>
        <div className="controls">
          <div className="filters">
            <span
              onClick={filterTasks}
              className={activeFilter === "all" ? "active" : ""}
              id="all"
            >
              All
            </span>
            <span
              onClick={filterTasks}
              className={activeFilter === "pending" ? "active" : ""}
              id="pending"
            >
              Pending
            </span>
            <span
              onClick={filterTasks}
              className={activeFilter === "completed" ? "active" : ""}
              id="completed"
            >
              Completed
            </span>
          </div>
          <button
            className="clear-btn active"
            hidden={activeFilter === "pending"}
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </div>
        <ul className="task-box">
          {filteredTasks.map((task, index) => (
            <Task
              task={task}
              todoWeb3={todoWeb3}
              provider={provider}
              id={index + 1}
              key={index}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
