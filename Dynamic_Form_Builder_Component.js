import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);

  // Fetch Todos
  const fetchTodos = async () => {
    const response = await axios.get("http://localhost:5000/api/todos");
    setTodos(response.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add or Update Todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editTodoId) {
      await axios.put(`http://localhost:5000/api/todos/${editTodoId}`, {
        title,
      });
      setEditTodoId(null);
    } else {
      await axios.post("http://localhost:5000/api/todos", { title });
    }
    setTitle("");
    fetchTodos();
  };

  // Edit Todo
  const handleEdit = (todo) => {
    setEditTodoId(todo._id);
    setTitle(todo.title);
  };

  // Delete Todo
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    fetchTodos();
  };

  return (
    <div>
      <h2>Todo List</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Todo Title"
          required
        />
        <button type="submit">{editTodoId ? "Update" : "Add"} Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => handleEdit(todo)}>Edit</button>
            <button onClick={() => handleDelete(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
