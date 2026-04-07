import { useState } from "react";
import API from "../../utils/api";

export default function AddTaskModal({ isOpen, onClose, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { title, description, priority, deadline };
    const res = await API.post("/tasks/v1/createTask", newTask);
    onTaskAdded(res.data);
    // Reset form
    setTitle(""); setDescription(""); setPriority("Low"); setDeadline("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#fff", padding: "20px", borderRadius: "8px", width: "400px" }}>
        <h3>Add Task</h3>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <select value={priority} onChange={e=>setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} required />
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" class = "primary-btn">Add Task</button>
        </div>
      </form>
    </div>
  );
}