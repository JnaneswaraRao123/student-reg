import React, { useState } from "react";

export default function Courses({ state, dispatch }) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError("Name required");
    if (state.courses.some(c => c.name.toLowerCase() === trimmed.toLowerCase()))
      return setError("Duplicate course name");
    dispatch({ type: "ADD_COURSE", payload: { name: trimmed } });
    setName(""); setError("");
  };

  const startEdit = (c) => { setEditing(c); setName(c.name); setError(""); };
  const saveEdit = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError("Name required");
    if (state.courses.some(c => c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== editing.id))
      return setError("Duplicate course name");
    dispatch({ type: "UPDATE_COURSE", payload: { id: editing.id, name: trimmed } });
    setEditing(null); setName(""); setError("");
  };

  const del = (id) => {
    if (!window.confirm("Delete this course? This will remove related offerings and registrations.")) return;
    dispatch({ type: "DELETE_COURSE", payload: { id } });
  };

  return (
    <section className="card">
      <h2>Courses</h2>
      <div className="form-row">
        <input placeholder="e.g., Hindi" value={name} onChange={e=>setName(e.target.value)} />
        {editing ? (
          <>
            <button onClick={saveEdit}>Save</button>
            <button className="cancel" onClick={()=>{setEditing(null); setName(""); setError("");}}>Cancel</button>
          </>
        ):(
          <button onClick={add}>Add</button>
        )}
      </div>
      {error && <div className="error">{error}</div>}
      <ul className="list">
        {state.courses.map(c => (
          <li key={c.id}>
            <span>{c.name}</span>
            <div className="row-actions">
              <button onClick={()=>startEdit(c)}>Edit</button>
              <button className="danger" onClick={()=>del(c.id)}>Delete</button>
            </div>
          </li>
        ))}
        {state.courses.length===0 && <li className="muted">No courses yet.</li>}
      </ul>
    </section>
  );
}
