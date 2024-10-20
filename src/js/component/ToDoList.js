import React, { useState, useEffect } from 'react';

const ToDoList = () => {
  const [toDo, setToDo] = useState("");
  const [toDoList, setToDoList] = useState([]);

  useEffect(() => {
    fetch('https://playground.4geeks.com/todo/users/lf14')
      .then((resp) => {
        console.log(resp.status);
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        if (data && Array.isArray(data.todos)) { // Verificar que data.todos sea un arreglo para evitar el error
          setToDoList(data.todos); // Usa data.todos en lugar de data.toDoList por la api
        } else {
          console.error("Invalid data format", data);
        }
      })
      .catch((error) => {
        console.error(error); 
      });
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && toDo) {
      const newTask = { label: toDo, done: false };
      fetch("https://playground.4geeks.com/todo/todos/lf14", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          if (data && Array.isArray(data.todos)) {
            setToDoList(data.todos);
          } else {
            setToDoList([...toDoList, newTask]);
          }
          setToDo("");
        })
        .catch((error) => console.error(error));
    }
  };

  // const handleDelete = (index) => {
  //   const taskToDelete = toDoList[index];
  //   fetch(`https://playground.4geeks.com/todo/todos/lf14/${taskToDelete.id}`, {
  //     method: 'DELETE',
  //   })
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       if (data && Array.isArray(data.todos)) {
  //         setToDoList(data.todos);
  //       } else {
  //         setToDoList((prevListItem) => prevListItem.filter((_, i) => i !== index));
  //       }
  //     })
  //     .catch((error) => console.error(error));
  // };
  
  

  return (
    <div className="text-center container my-5">
      <h1 className="text-muted"><em>ToDoList</em></h1>
      <input
        className="form-control"
        placeholder="Enter a task here"
        value={toDo}
        onChange={(e) => setToDo(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <ol className="todo-list list-group text-start">
        {toDoList.map((task, index) => (
          <li className="list-group-item todo-item" key={index}>
            {task.label || task}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                setToDoList((prevListItem) => prevListItem.filter((_, i) => i !== index));
              }}
            ></button>
          </li>
        ))}
        {toDoList.length > 0 && (
          <li className="list-group-item text-muted">
            Total Tasks: {toDoList.length}
          </li>
        )}
        {toDoList.length > 0 && (
          <div className="leaf-container">
            <div className="leaf-1 p-1 shadow"></div>
            <div className="leaf-2 p-1 shadow"></div>
            <div className="leaf-3 p-1 shadow"></div>
          </div>
        )}
      </ol>
    </div>
  );
};

export default ToDoList;