import { useEffect, useState } from "react";
import API from "../../utils/api";
import TaskCard from "./TaskCard";
import AddTaskModal from "../Modals/AddTaskModal";
import EditTaskModal from "../Modals/EditTaskModal";

export default function TaskList({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    API.get("/tasks/v1/").then(res => {
      setTasks(res.data);
      updateRecommended(res.data);
    });
  }, []);

  const updateRecommended = (tasksList) => {
    // Recommended: tasks that are high priority & not completed
    const rec = tasksList.filter(t => t.priority === "High" && !t.completed);
    setRecommended(rec);
  };

  const handleAdd = (newTask) => {
    const newTasks = [newTask, ...tasks];
    setTasks(newTasks);
    updateRecommended(newTasks);
  };

  const handleUpdate = (updatedTask) => {
    const newTasks = tasks.map(t => t._id === updatedTask._id ? updatedTask : t);
    setTasks(newTasks);
    updateRecommended(newTasks);
  };

  const handleDelete = (id) => {
    const newTasks = tasks.filter(t => t._id !== id);
    setTasks(newTasks);
    updateRecommended(newTasks);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        <button onClick={onLogout} style={{ background: "red", color: "#fff", padding: "5px 10px" }}>Logout</button>
      </div>

      <button onClick={() => setIsAddOpen(true)}>Add Task</button>

      {recommended.length > 0 && (
        <div>
          <h3>Recommended Tasks</h3>
          {recommended.map(t => <TaskCard key={t._id} task={t} onEdit={() => setEditTask(t)} onDelete={handleDelete} />)}
        </div>
      )}

      <div>
        <h3>All Tasks</h3>
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} onEdit={() => setEditTask(task)} onDelete={handleDelete} />
        ))}
      </div>

      <AddTaskModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onTaskAdded={handleAdd} />
      {editTask && <EditTaskModal isOpen={!!editTask} task={editTask} onClose={() => setEditTask(null)} onTaskUpdated={handleUpdate} />}
    </div>
  );
}