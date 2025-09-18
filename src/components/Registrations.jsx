import React, { useState } from "react";

export default function Registrations({ state, dispatch }) {
  const [offeringId, setOfferingId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [viewOffering, setViewOffering] = useState("");
  const [error, setError] = useState("");

  const addReg = () => {
    const trimmed = studentName.trim();
    if (!offeringId) return setError("Select offering");
    if (!trimmed) return setError("Student name required");
    if (state.registrations.some(r => r.offeringId === offeringId && r.studentName.toLowerCase() === trimmed.toLowerCase()))
      return setError("Student already registered for this offering");
    dispatch({ type: "ADD_REGISTRATION", payload: { offeringId, studentName: trimmed } });
    setStudentName(""); setError("");
  };

  const deleteReg = (id) => {
    if (!window.confirm("Remove registration?")) return;
    dispatch({ type: "DELETE_REGISTRATION", payload: { id } });
  };

  const enrich = (o) => ({ ...o, course: state.courses.find(c => c.id === o.courseId), type: state.courseTypes.find(t => t.id === o.typeId) });

  const offeringList = state.offerings.map(enrich);

  const regsForView = state.registrations
    .filter(r => !viewOffering || r.offeringId === viewOffering)
    .map(r => ({ ...r, offering: enrich(state.offerings.find(o => o.id === r.offeringId) || {}) }))
    .sort((a,b)=>b.timestamp-a.timestamp);

  return (
    <section className="card">
      <h2>Student Registrations</h2>

      <div className="form-row wrap">
        <select value={offeringId} onChange={e=>setOfferingId(e.target.value)}>
          <option value="">Select offering</option>
          {offeringList.map(o => <option key={o.id} value={o.id}>{o.type?.name} - {o.course?.name}</option>)}
        </select>
        <input placeholder="Student name" value={studentName} onChange={e=>setStudentName(e.target.value)} />
        <button onClick={addReg}>Register</button>
      </div>
      {error && <div className="error">{error}</div>}

      <div className="filter-row">
        <label>View registrations for:</label>
        <select value={viewOffering} onChange={e=>setViewOffering(e.target.value)}>
          <option value="">All</option>
          {offeringList.map(o => <option key={o.id} value={o.id}>{o.type?.name} - {o.course?.name}</option>)}
        </select>
      </div>

      <ul className="list">
        {regsForView.map(r => (
          <li key={r.id}>
            <div>
              <strong>{r.studentName}</strong>
              <div className="muted">{r.offering?.type?.name} - {r.offering?.course?.name} • {new Date(r.timestamp).toLocaleString()}</div>
            </div>
            <div className="row-actions">
              <button className="danger" onClick={()=>deleteReg(r.id)}>Remove</button>
            </div>
          </li>
        ))}
        {regsForView.length===0 && <li className="muted">No registrations yet.</li>}
      </ul>
    </section>
  );
}
