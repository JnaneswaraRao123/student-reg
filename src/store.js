import React, { useReducer, useEffect } from "react";

const initial = {
  courseTypes: [],  
  courses: [],       
  offerings: [],     
  registrations: []  
};

const STORAGE_KEY = "student-reg-state-v1";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function id() {
  return Math.random().toString(36).slice(2, 9);
}

function reducer(state, action) {
  switch (action.type) {
    
    case "ADD_TYPE": {
      const { name } = action.payload;
      return { ...state, courseTypes: [...state.courseTypes, { id: id(), name }] };
    }
    case "UPDATE_TYPE": {
      const { id: tid, name } = action.payload;
      return { ...state, courseTypes: state.courseTypes.map(t => t.id === tid ? { ...t, name } : t) };
    }
    case "DELETE_TYPE": {
      const tid = action.payload.id;
      
      const remainingOfferings = state.offerings.filter(o => o.typeId !== tid);
      const remainingRegs = state.registrations.filter(r => remainingOfferings.some(o => o.id === r.offeringId));
      return { ...state, courseTypes: state.courseTypes.filter(t => t.id !== tid), offerings: remainingOfferings, registrations: remainingRegs };
    }

 
    case "ADD_COURSE": {
      const { name } = action.payload;
      return { ...state, courses: [...state.courses, { id: id(), name }] };
    }
    case "UPDATE_COURSE": {
      const { id: cid, name } = action.payload;
      return { ...state, courses: state.courses.map(c => c.id === cid ? { ...c, name } : c) };
    }
    case "DELETE_COURSE": {
      const cid = action.payload.id;
      const remainingOfferings = state.offerings.filter(o => o.courseId !== cid);
      const remainingRegs = state.registrations.filter(r => remainingOfferings.some(o => o.id === r.offeringId));
      return { ...state, courses: state.courses.filter(c => c.id !== cid), offerings: remainingOfferings, registrations: remainingRegs };
    }

    
    case "ADD_OFFERING": {
      const { courseId, typeId } = action.payload;
      return { ...state, offerings: [...state.offerings, { id: id(), courseId, typeId }] };
    }
    case "UPDATE_OFFERING": {
      const { id: oid, courseId, typeId } = action.payload;
      return { ...state, offerings: state.offerings.map(o => o.id === oid ? { ...o, courseId, typeId } : o) };
    }
    case "DELETE_OFFERING": {
      const oid = action.payload.id;
      return { ...state, offerings: state.offerings.filter(o => o.id !== oid), registrations: state.registrations.filter(r => r.offeringId !== oid) };
    }

    
    case "ADD_REGISTRATION": {
      const { offeringId, studentName } = action.payload;
      return { ...state, registrations: [...state.registrations, { id: id(), offeringId, studentName, timestamp: Date.now() }] };
    }
    case "DELETE_REGISTRATION": {
      const idr = action.payload.id;
      return { ...state, registrations: state.registrations.filter(r => r.id !== idr) };
    }

    case "RESET": return initial;
    default:
      return state;
  }
}

export function useStore() {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    save(state);
  }, [state]);

  return [state, dispatch];
}
