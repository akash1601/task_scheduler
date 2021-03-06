import "./styles.css";
import React from "react";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import { useState, useEffect } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
useEffect (() => {
  const getTasks = async () => {
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }
  getTasks()
}, [])

const fetchTasks = async () => {
  const res = await fetch('https://my-json-server.typicode.com/akash1601/task_scheduler/tasks')
  const data = await res.json()
  return data
}

const fetchTask = async (id) => {
  const res = await fetch(`https://my-json-server.typicode.com/akash1601/task_scheduler/tasks/${id}`)
  const data = await res.json()

  return data
}
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = await fetch(`https://my-json-server.typicode.com/akash1601/task_scheduler/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  };

  const addTask = async (task) => {

    const res = await fetch('https://my-json-server.typicode.com/akash1601/task_scheduler/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()

    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = { id, ...task };
    setTasks([...tasks, data]);
  };

  const deleteTask = async (id) => {
    await fetch(`http://https://my-json-server.typicode.com/akash1601/task_scheduler/tasks/${id}`, {
      method: 'DELETE',
    })

    setTasks(tasks.filter((task) => task.id !== id))
  };
  const [showAddTask, setShowAddTask] = useState(false);
  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        "Nothing to show"
      )}
    </div>
  );
}
