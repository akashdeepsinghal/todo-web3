import { useEffect, useState } from "react";

const Task = ({ task, todoWeb3, provider, id }) => {
  const [completed, setCompleted] = useState(false);
  const task_id = "task" + id + 1;

  const handleChange = async () => {
    const signer = await provider.getSigner();
    let transaction = await todoWeb3.connect(signer).toggleCompleted(id);
    await transaction.wait();
    setCompleted(!completed);
  };

  useEffect(() => {
    setCompleted(task.completed);
  }, []);

  return (
    <div className="card">
      <>
        <div className="card__info">
          <input
            type="checkbox"
            id={task_id}
            name={task_id}
            value={task_id}
            checked={completed}
            onChange={handleChange}
          />
          {completed ? (
            <del>
              <label htmlFor={task_id}> {task.content}</label>
            </del>
          ) : (
            <label htmlFor={task_id}> {task.content}</label>
          )}
        </div>
      </>
    </div>
  );
};

export default Task;
