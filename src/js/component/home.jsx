import React, { useState } from 'react';


const Home = () => {
  const [toDo, setToDo] = useState("");
  const [toDoList, setToDoList] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && toDo) {
      setToDoList([...toDoList, toDo]);
      setToDo("");
    }
  };

  return (
    <div className="text-center container my-5">
      <h1 className="text-secondary "><em>TODOS</em></h1>
      <input
        className="form-control"
        placeholder="Enter a task here"
        value={toDo}
        onChange={(e) => setToDo(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <ol className="todo-list list-group">
        {toDoList.map((task, index) => (
          <li className="list-group-item" key={index}>{task}</li>
        ))}
		 {toDoList.length > 0 && (
          <li className="list-group-item text-muted">
            Total Tasks: {toDoList.length}
          </li>
        )}
      </ol>
    </div>
  );
};

export default Home;