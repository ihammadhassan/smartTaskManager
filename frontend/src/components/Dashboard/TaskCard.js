import API from "../../utils/api";

export default function TaskCard({ task, onEdit, onDelete }) {
  const overdue = new Date(task.deadline) < new Date() && !task.completed;
  const color = task.priority === "High" ? "red" : task.priority === "Medium" ? "orange" : "green";

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await API.delete(`/tasks/v1/deleteTask${task._id}`);
      onDelete(task._id);
    }
  };

  return (
    <div style={{ border: `2px solid ${color}`, padding: "10px", margin: "5px", background: overdue ? "#fdd" : "#fff" }}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>{task.priority}</p>
      <small> Deadline: {new Date(task.deadline).toLocaleDateString()}</small>
      <div style={{ display: "flex", marginTop: "5px", gap: "8px" }}>
        <button onClick={onEdit} class = "primary-btn">Edit</button>
        <button onClick={handleDelete} class = "secondary-btn">Delete</button>
      </div>
    </div>
  );
}