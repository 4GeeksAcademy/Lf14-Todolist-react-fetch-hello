import React, { useState, useEffect } from "react";

const ToDoList = () => {
  const [toDo, setToDo] = useState("");
  const [toDoList, setToDoList] = useState([]);

 // useEffect cargar las tareas desde la API
  useEffect(() => {
    fetch("https://playground.4geeks.com/todo/users/lf14")
      .then((resp) => {
        console.log(resp.status);// Imprime el estado de la respuesta
        return resp.json(); // Convierte la respuesta
      })
      .then((data) => {
        console.log(data);//Imprime lo que recibe
        if (data && Array.isArray(data.todos)) {
          setToDoList(data.todos);//Actualiza la lista
        } else {
          console.error("Invalid data format", data);// Maneja el error si el formato no es correcto
        }
      })
      .catch((error) => {
        console.error(error); //Maneja el error si la solicitud falla
      });
  }, []);//segundo parametro array vacío, xa que se ejecute solo una vez tras cargar

  //Enter para agregar tareas
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && toDo) {
      const newTask = { label: toDo, done: false };// nueva tarea
      fetch("https://playground.4geeks.com/todo/todos/lf14", {
        method: 'POST',
        body: JSON.stringify(newTask),//JSOnificando
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          if (data && Array.isArray(data.todos)) {
            setToDoList(data.todos)//Actualiza
          } else {
            setToDoList([...toDoList, newTask]);
          }
          setToDo(""); //Campo vacío para siguiente tarea
        })
        .catch((error) => console.error(error));
    }
  };

  const handleDelete = (index) => {
    const taskToDelete = toDoList[index]; // Tarea que se va a eliminar
    fetch(`https://playground.4geeks.com/todo/todos/${taskToDelete.id}`, {
      method: "DELETE",
      headers: {//Sin body por que ya inlcuye el ID la url y si no da error
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (resp.ok) {
          setToDoList((prevListItem) => prevListItem.filter((_, i) => i !== index));//actualiza 
        } else {
          console.error("Error deleting task from API");
        }
      })
      .catch((error) => console.error(error));
  };

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
              onClick={() => handleDelete(index)}
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