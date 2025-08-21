import React, { useState, useEffect } from "react";
import axios from "axios";
import ToDoItem from "./ToDoItem";
import InputArea from "./InputArea";
import Login from "./Login";

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/auth/user');
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      const todos = response.data;
      setItems(todos.map(todo => ({ id: todo.id, text: todo.text })));
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const addItem = async (inputText) => {
    try {
      const response = await axios.post('/api/todos', { text: inputText });
      const newTodo = response.data;
      setItems(prevItems => [...prevItems, { id: newTodo.id, text: newTodo.text }]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      setItems([]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="container"><h1>Loading...</h1></div>;
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <span>Welcome, {user.name}!</span>
          <button onClick={logout} className="button" style={{ marginLeft: '20px' }}>Logout</button>
        </div>
      </div>
      <InputArea onAdd={addItem} />
      <div>
        <ul>
          {items.map((todoItem) => (
            <ToDoItem
              key={todoItem.id}
              id={todoItem.id}
              text={todoItem}
              onChecked={deleteItem}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;