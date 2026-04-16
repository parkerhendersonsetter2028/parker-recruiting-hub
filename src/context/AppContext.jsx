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
  // NEW: section tab, sort, density, discovery panel
  const [activeSection, setActiveSection] = useState('primary'); // 'primary' | 'discovery' | 'hidden'
  const [sortBy, setSortBy] = useState('name');                  // 'name'|'divLevel'|'conference'|'location'|'setterNeed'|'status'
  const [sortDir, setSortDir] = useState('asc');                 // 'asc' | 'desc'
  const [density, setDensity] = useState('comfortable');         // 'comfortable' | 'compact'
  const [openDiscovery, setOpenDiscovery] = useState(false);     // expanded AI add panel

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  };

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

  // Rank helpers for sorting
  const DIV_RANK = { DI: 0, DII: 1, DIII: 2, NAIA: 3, JUCO: 4 };
  const NEED_RANK = { High: 0, Med: 1, Low: 2 };
  const STATUS_RANK = { None: 0, Questionnaire: 1, 'Reached Out': 2, 'Coach Contact': 3, 'Campus Visit': 4, Offer: 5 };

  const sortFn = (a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    const av = (() => {
      switch (sortBy) {
        case 'divLevel':   return DIV_RANK[a.divLevel] ?? 99;
        case 'conference': return (a.conference || '').toLowerCase();
        case 'location':   return `${a.state || ''} ${a.city || ''}`.toLowerCase();
        case 'setterNeed': return NEED_RANK[a.setterNeed] ?? 99;
        case 'status':     return STATUS_RANK[statuses[a.id] || 'None'] ?? 0;
        default:           return (a.name || '').toLowerCase();
      }
    })();
    const bv = (() => {
      switch (sortBy) {
        case 'divLevel':   return DIV_RANK[b.divLevel] ?? 99;
        case 'conference': return (b.conference || '').toLowerCase();
        case 'location':   return `${b.state || ''} ${b.city || ''}`.toLowerCase();
        case 'setterNeed': return NEED_RANK[b.setterNeed] ?? 99;
        case 'status':     return STATUS_RANK[statuses[b.id] || 'None'] ?? 0;
        default:           return (b.name || '').toLowerCase();
      }
    })();
    if (av < bv) return -1 * dir;
    if (av > bv) return  1 * dir;
    return (a.name || '').localeCompare(b.name || '');
  };

  const applyFilters = (list) => list.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.conference?.toLowerCase().includes(q);
    const matchDiv = divFilter === 'All' || s.divLevel === divFilter;
    return matchSearch && matchDiv;
  });

  const activeList = useMemo(() => {
    if (activeSection === 'primary')   return primarySchools;
    if (activeSection === 'discovery') return discoverySchools;
    return hiddenSchools;
  }, [activeSection, primarySchools, discoverySchools, hiddenSchools]);

  const filteredSchools = useMemo(
    () => applyFilters(activeList).slice().sort(sortFn),
    [activeList, search, divFilter, sortBy, sortDir, statuses]
  );

  // Legacy (kept for compatibility; master view no longer references these directly)
  const filteredPrimary = useMemo(() => applyFilters(primarySchools).slice().sort(sortFn), [primarySchools, search, divFilter, sortBy, sortDir, statuses]);
  const filteredDiscovery = useMemo(() => applyFilters(discoverySchools).slice().sort(sortFn), [discoverySchools, search, divFilter, sortBy, sortDir, statuses]);

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
    filteredPrimary, filteredDiscovery, filteredSchools, divCounts, contacted,
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
    activeSection, setActiveSection,
    sortBy, sortDir, toggleSort,
    density, setDensity,
    openDiscovery, setOpenDiscovery,
    // handlers
    handleAddSchool, navigate, goEmail, goGmail, goBack, addLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
