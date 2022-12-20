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

  const showMenu = (selectedTask) => {
    // console.log("show menu");
    let menuDiv = selectedTask.target.parentNode.lastElementChild;
    // console.log(e);
    // console.log(e.currentTarget);
    // console.log(e.target);
    // console.log(e.target.parentNode.lastElementChild);
    // console.log(e.parentNode);
    // let menuDiv = this.divRef.current.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    selectedTask.addEventListener("click", (e) => {
      if (e.target.tagName !== "I" || e.target !== selectedTask) {
        menuDiv.classList.remove("show");
      }
    });
  };

  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  // return (
  //   <div className="card">
  //     <>
  //       <div className="card__info">
  //         <input
  //           type="checkbox"
  //           id={task_id}
  //           name={task_id}
  //           value={task_id}
  //           checked={completed}
  //           onChange={handleChange}
  //         />
  //         {completed ? (
  //           <del>
  //             <label htmlFor={task_id}> {task.content}</label>
  //           </del>
  //         ) : (
  //           <label htmlFor={task_id}> {task.content}</label>
  //         )}
  //       </div>
  //     </>
  //   </div>
  // );

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
        <i onClick={showMenu} className="uil uil-ellipsis-h"></i>
        <ul className="task-menu">
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
