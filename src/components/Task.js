import { useEffect, useState, useRef } from "react";

const Task = ({ task, todoWeb3, provider, id }) => {
  const [completed, setCompleted] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const task_id = "task" + id + 1;

  const handleChange = async () => {
    const signer = await provider.getSigner();
    let transaction = await todoWeb3.connect(signer).toggleCompleted(id);
    await transaction.wait();
    setCompleted(!completed);
  };

  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  return (
    <li className="task">
      <label htmlFor={id}>
        <input
          onChange={handleChange}
          type="checkbox"
          id={id}
          checked={completed}
        />
        <p className={completed ? "checked" : ""}>{task.content}</p>
      </label>
      <div className="settings">
        <i
          onClick={() => setMenuOpened(true)}
          className="uil uil-ellipsis-h"
        ></i>
        <ul className={`task-menu ${menuOpened ? "show" : ""}`}>
          <li>
            <i className="uil uil-pen"></i>Edit
          </li>
          <li>
            <i className="uil uil-trash"></i>Delete
          </li>
        </ul>
      </div>
    </li>
  );
};

export default Task;
