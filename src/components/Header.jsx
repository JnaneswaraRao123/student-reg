import React from "react";

export default function Header({ tab, setTab }) {
  return (
    <header className="header">
      <h1>Student Registration</h1>
      <nav className="tabs">
        <button className={tab==="types"?"active":""} onClick={()=>setTab("types")}>Course Types</button>
        <button className={tab==="courses"?"active":""} onClick={()=>setTab("courses")}>Courses</button>
        <button className={tab==="offerings"?"active":""} onClick={()=>setTab("offerings")}>Offerings</button>
        <button className={tab==="regs"?"active":""} onClick={()=>setTab("regs")}>Registrations</button>
      </nav>
    </header>
  );
}
