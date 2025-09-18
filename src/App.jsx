import React, { useState } from "react";
import { useStore } from "./store";
import Header from "./components/Header";
import CourseTypes from "./components/CourseTypes";
import Courses from "./components/Courses";
import Offerings from "./components/Offerings";
import Registrations from "./components/Registrations";

export default function App() {
  const [state, dispatch] = useStore();
  const [tab, setTab] = useState("types"); 

  return (
    <div className="app">
      <Header tab={tab} setTab={setTab} />
      <main className="container">
        {tab === "types" && <CourseTypes state={state} dispatch={dispatch} />}
        {tab === "courses" && <Courses state={state} dispatch={dispatch} />}
        {tab === "offerings" && <Offerings state={state} dispatch={dispatch} />}
        {tab === "regs" && <Registrations state={state} dispatch={dispatch} />}
      </main>
      <footer className="footer">
        <small>Student Registration System — React Only • Data stored in localStorage</small>
      </footer>
    </div>
  );
}
