import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { ALL_SCHOOLS_DATA } from '../data/schools.js';
import { loadUserData, saveUserData, fetchSchoolFromClaude } from '../lib/api.js';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export function AppProvider({ children }) {
  // ── PERSISTED STATE (loaded from Netlify Blobs on mount, saved on change) ──
  const [extraSchools, setExtraSchools] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [logs, setLogs] = useState({});
  const [notes, setNotes] = useState({});
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [sectionOverrides, setSectionOverrides] = useState({});
  const hydratedRef = useRef(false);

  // Hide/move helpers
  const isHidden = (id) => hiddenIds.has(id);
  const getEffectiveSection = (school) => sectionOverrides[school.id] || school.section;
  const hideSchool = (id) => setHiddenIds(prev => { const n = new Set(prev); n.add(id); return n; });
  const unhideSchool = (id) => setHiddenIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  const moveToSection = (id, section) => setSectionOverrides(prev => ({ ...prev, [id]: section }));

  // Hydrate everything from Netlify Blobs once on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await loadUserData();
        if (Array.isArray(data.schools)) setExtraSchools(data.schools);
        if (data.statuses && typeof data.statuses === 'object') setStatuses(data.statuses);
        if (data.logs && typeof data.logs === 'object') setLogs(data.logs);
        if (data.notes && typeof data.notes === 'object') setNotes(data.notes);
        if (Array.isArray(data.hiddenIds)) setHiddenIds(new Set(data.hiddenIds));
        if (data.sectionOverrides && typeof data.sectionOverrides === 'object') setSectionOverrides(data.sectionOverrides);
      } catch (err) {
        console.warn("Failed to hydrate user data:", err);
      } finally {
        // Defer marking hydrated until after React commits the setX() calls above.
        // This prevents the save effect from firing with pre-hydration empty state.
        setTimeout(() => { hydratedRef.current = true; }, 0);
      }
    })();
  }, []);

  // Debounced save to Netlify Blobs whenever any persisted state changes
  useEffect(() => {
    if (!hydratedRef.current) return; // skip during initial hydration
    const timer = setTimeout(() => {
      saveUserData({
        schools: extraSchools,
        statuses,
        logs,
        notes,
        hiddenIds: [...hiddenIds],
        sectionOverrides,
      }).catch(err => console.warn("Save failed:", err));
    }, 600);
    return () => clearTimeout(timer);
  }, [extraSchools, statuses, logs, notes, hiddenIds, sectionOverrides]);

  // ── UI STATE ──
  const [view, setView] = useState('master');
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState('');
  const [divFilter, setDivFilter] = useState('All');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [logDate, setLogDate] = useState('');
  const [logType, setLogType] = useState('Submitted Questionnaire');
  const [showHidden, setShowHidden] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Click-outside dismiss for the ⋯ menu
  useEffect(() => {
    if (!openMenuId) return;
    const onDocClick = (e) => {
      if (!e.target.closest('[data-row-menu]')) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openMenuId]);

  const allSchools = useMemo(() => [...ALL_SCHOOLS_DATA, ...extraSchools], [extraSchools]);
  const visibleSchools = useMemo(() => allSchools.filter(s => !isHidden(s.id)), [allSchools, hiddenIds]);
  const primarySchools = useMemo(() => visibleSchools.filter(s => getEffectiveSection(s) === "primary"), [visibleSchools, sectionOverrides]);
  const discoverySchools = useMemo(() => visibleSchools.filter(s => getEffectiveSection(s) === "discovery"), [visibleSchools, sectionOverrides]);
  const hiddenSchools = useMemo(() => allSchools.filter(s => isHidden(s.id)), [allSchools, hiddenIds]);

  const divCounts = useMemo(() => {
    const c = {};
    allSchools.forEach(s => { c[s.divLevel] = (c[s.divLevel] || 0) + 1; });
    return c;
  }, [allSchools]);

  const contacted = useMemo(() => Object.values(statuses).filter(s => s && s !== "None").length, [statuses]);

  const applyFilters = (list) => list.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.conference?.toLowerCase().includes(q);
    const matchDiv = divFilter === 'All' || s.divLevel === divFilter;
    return matchSearch && matchDiv;
  });

  const filteredPrimary = useMemo(() => applyFilters(primarySchools).sort((a,b) => a.name.localeCompare(b.name)), [search, divFilter, primarySchools]);
  const filteredDiscovery = useMemo(() => applyFilters(discoverySchools).sort((a,b) => a.name.localeCompare(b.name)), [search, divFilter, discoverySchools]);

  const handleAddSchool = async () => {
    if (!newSchoolName.trim()) return;
    setIsSearching(true);
    try {
      const parsed = await fetchSchoolFromClaude(newSchoolName);
      if (parsed.isVolleyballSchool === false) {
        alert("No Men's Volleyball program found.");
      } else {
        setExtraSchools(prev => [{ ...parsed, section: parsed.section || "discovery" }, ...prev]);
        setNewSchoolName('');
      }
    } catch (err) { alert(`Error: ${err.message}`); }
    finally { setIsSearching(false); }
  };

  const navigate = (s) => { setSel(s); setView('detail'); window.scrollTo(0, 0); };
  const goEmail  = (s) => { if (s) setSel(s); setView('email'); window.scrollTo(0, 0); };
  const goGmail  = () => { setView('gmail'); window.scrollTo(0, 0); };
  const goBack = () => setView('master');

  const addLog = () => {
    if (!logDate || !sel) return;
    setLogs(prev => ({ ...prev, [sel.id]: [{ date: logDate, type: logType }, ...(prev[sel.id] || [])] }));
    const statusMap = { "Submitted Questionnaire": "Questionnaire", "Email / DM Sent": "Reached Out", "Coach Responded": "Coach Contact", "Phone / Video Call": "Coach Contact", "Campus Visit": "Campus Visit", "Verbal Offer": "Offer" };
    if (statusMap[logType]) setStatuses(prev => ({ ...prev, [sel.id]: statusMap[logType] }));
  };

  const value = {
    // data
    allSchools, visibleSchools, primarySchools, discoverySchools, hiddenSchools,
    filteredPrimary, filteredDiscovery, divCounts, contacted,
    extraSchools, setExtraSchools,
    // persisted state
    statuses, setStatuses, logs, setLogs, notes, setNotes,
    hiddenIds, sectionOverrides,
    // helpers
    isHidden, getEffectiveSection, hideSchool, unhideSchool, moveToSection,
    // ui state
    view, setView, sel, setSel,
    search, setSearch, divFilter, setDivFilter,
    newSchoolName, setNewSchoolName, isSearching,
    logDate, setLogDate, logType, setLogType,
    showHidden, setShowHidden, openMenuId, setOpenMenuId,
    // handlers
    handleAddSchool, navigate, goEmail, goGmail, goBack, addLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
