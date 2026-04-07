import { useState, useEffect } from "react";
import API from "../../utils/api";

export default function EditTaskModal({ isOpen, onClose, task, onTaskUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDeadline(task.deadline ? task.deadline.split("T")[0] : "");
      setCompleted(task.completed);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTask = { title, description, priority, deadline, completed };
    const res = await API.put(`/tasks/v1/updateTask/${task._id}`, updatedTask);
    onTaskUpdated(res.data);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#fff", padding: "20px", borderRadius: "8px", width: "400px" }}>
        <h3>Edit Task</h3>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <select value={priority} onChange={e=>setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} required />
        <label>
          <input type="checkbox" checked={completed} onChange={e=>setCompleted(e.target.checked)} />
          Completed
        </label>
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "right", gap: "8px" }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" class = "primary-btn">Update</button>
        </div>
      </form>
    </div>
  );
}