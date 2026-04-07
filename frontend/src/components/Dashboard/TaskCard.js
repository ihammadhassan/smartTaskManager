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
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <small>Deadline: {new Date(task.deadline).toLocaleDateString()}</small>
      <div style={{ marginTop: "5px" }}>
        <button onClick={onEdit}>Edit</button>
        <button onClick={handleDelete} style={{ marginLeft: "5px", color: "red" }}>Delete</button>
      </div>
    </div>
  );
}