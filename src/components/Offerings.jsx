import React, { useState } from "react";

export default function Offerings({ state, dispatch }) {
  const [courseId, setCourseId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [editing, setEditing] = useState(null);
  const [filterType, setFilterType] = useState(""); 
  const [error, setError] = useState("");

  const add = () => {
    if (!courseId || !typeId) return setError("Select both course and type");
    
    if (state.offerings.some(o => o.courseId === courseId && o.typeId === typeId))
      return setError("Offering already exists");
    dispatch({ type: "ADD_OFFERING", payload: { courseId, typeId } });
    setCourseId(""); setTypeId(""); setError("");
  };

  const startEdit = (o) => {
    setEditing(o);
    setCourseId(o.courseId);
    setTypeId(o.typeId);
    setError("");
  };

  const saveEdit = () => {
    if (!courseId || !typeId) return setError("Select both course and type");
    if (state.offerings.some(o => o.courseId === courseId && o.typeId === typeId && o.id !== editing.id))
      return setError("Another identical offering exists");
    dispatch({ type: "UPDATE_OFFERING", payload: { id: editing.id, courseId, typeId } });
    setEditing(null); setCourseId(""); setTypeId(""); setError("");
  };

  const del = (id) => {
    if (!window.confirm("Delete this offering? This will remove related registrations.")) return;
    dispatch({ type: "DELETE_OFFERING", payload: { id } });
  };

  const offerings = state.offerings
    .filter(o => !filterType || o.typeId === filterType)
    .map(o => ({
      ...o,
      course: state.courses.find(c => c.id === o.courseId),
      type: state.courseTypes.find(t => t.id === o.typeId)
    }));

  return (
    <section className="card">
      <h2>Course Offerings</h2>

      <div className="form-row wrap">
        <select value={courseId} onChange={e=>setCourseId(e.target.value)}>
          <option value="">Select course</option>
          {state.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select value={typeId} onChange={e=>setTypeId(e.target.value)}>
          <option value="">Select course type</option>
          {state.courseTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        {editing ? (
          <>
            <button onClick={saveEdit}>Save</button>
            <button className="cancel" onClick={()=>{setEditing(null); setCourseId(""); setTypeId(""); setError("");}}>Cancel</button>
          </>
        ) : (
          <button onClick={add}>Add Offering</button>
        )}
      </div>

      <div className="filter-row">
        <label>Filter by type:</label>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)}>
          <option value="">All</option>
          {state.courseTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <ul className="list">
        {offerings.map(o => (
          <li key={o.id}>
            <span>{o.type?.name || "—"} - {o.course?.name || "—"}</span>
            <div className="row-actions">
              <button onClick={()=>startEdit(o)}>Edit</button>
              <button className="danger" onClick={()=>del(o.id)}>Delete</button>
            </div>
          </li>
        ))}
        {offerings.length===0 && <li className="muted">No matching offerings.</li>}
      </ul>
    </section>
  );
}
