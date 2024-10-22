import React, { useState, useEffect } from "react";

const ToDoList = () => {
  const [toDo, setToDo] = useState("");
  const [toDoList, setToDoList] = useState([]);

  // useEffect para cargar las tareas desde la API
  useEffect(() => {
    getTodo();
  }, []);

  const getTodo = () => {
    fetch("https://playground.4geeks.com/todo/users/lf14")
      .then((resp) => {
        console.log(resp.status); // Imprime el estado de la respuesta
        return resp.json(); // Convierte la respuesta
      })
      .then((data) => {
        console.log(data); // Imprime lo que recibe
        if (data && Array.isArray(data.todos)) {
          setToDoList(data.todos); // Actualiza la lista
        } else {
          console.error("Invalid data format", data); // Maneja el error si el formato no es correcto
        }
        setToDo("");
      })

      .catch((error) => {
        console.error(error); // Maneja el error si la solicitud falla
      });
  };

  // Enter para agregar tareas
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && toDo) {
      const newTask = { label: toDo, done: false }; // Nueva tarea
      fetch("https://playground.4geeks.com/todo/todos/lf14", {
        method: 'POST',
        body: JSON.stringify(newTask), // JSONificando
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          if (resp.status === 201) {
            getTodo(); // Actualiza la lista de tareas después de agregar una nueva
          } else {
            console.error("Error al agregar la tarea");
          }
        })
        .catch((error) => console.error(error));
    }
  };

  // Función para manejar la eliminación de tareas
  const handleDelete = (index) => {
    const taskToDelete = toDoList[index]; // Tarea que se va a eliminar
    if (taskToDelete && taskToDelete.id) {
      fetch(`https://playground.4geeks.com/todo/todos/${taskToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => {
          if (resp.status === 204) {
            getTodo(); // Actualiza la lista de tareas después de eliminar una
          } else {
            console.error("Error al eliminar la tarea");
          }
        })
        .catch((error) => console.error(error));
    } else {
      console.error("Task does not have a valid id", taskToDelete);
    }
  };

  const handleClearAll = () => {
    // Crear un array de promesas para eliminar cada tarea individualmente
    const deletePromises = toDoList.map(task =>
      fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  
    // Ejecutar todas las promesas y luego limpiar la lista
    Promise.all(deletePromises)
      .then(results => {
        if (results.every(resp => resp.ok)) {
          setToDoList([]); // Limpiar toda la lista
        } else {
          console.error("Error clearing some tasks from API");
        }
      })
      .catch(error => console.error(error));
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
      <button className="btn btn-danger my-3" onClick={handleClearAll}>
  Clear All
</button>
    </div>
  );
};

export default ToDoList;