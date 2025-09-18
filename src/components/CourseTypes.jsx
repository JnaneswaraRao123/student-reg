import React, { useState } from "react";

export default function CourseTypes({ state, dispatch }) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError("Name required");
    if (state.courseTypes.some(t => t.name.toLowerCase() === trimmed.toLowerCase()))
      return setError("Duplicate name");
    dispatch({ type: "ADD_TYPE", payload: { name: trimmed } });
    setName(""); setError("");
  };

  const startEdit = (t) => { setEditing(t); setName(t.name); setError(""); };
  const saveEdit = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError("Name required");
    if (state.courseTypes.some(t => t.name.toLowerCase() === trimmed.toLowerCase() && t.id !== editing.id))
      return setError("Duplicate name");
    dispatch({ type: "UPDATE_TYPE", payload: { id: editing.id, name: trimmed } });
    setEditing(null); setName(""); setError("");
  };

  const del = (id) => {
    if (!window.confirm("Delete this course type? This will remove related offerings and registrations.")) return;
    dispatch({ type: "DELETE_TYPE", payload: { id } });
  };

  return (
    <section className="card">
      <h2>Course Types</h2>
      <div className="form-row">
        <input placeholder="e.g., Individual" value={name} onChange={e=>setName(e.target.value)} />
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
        {state.courseTypes.map(t => (
          <li key={t.id}>
            <span>{t.name}</span>
            <div className="row-actions">
              <button onClick={()=>startEdit(t)}>Edit</button>
              <button className="danger" onClick={()=>del(t.id)}>Delete</button>
            </div>
          </li>
        ))}
        {state.courseTypes.length===0 && <li className="muted">No course types yet.</li>}
      </ul>
    </section>
  );
}
