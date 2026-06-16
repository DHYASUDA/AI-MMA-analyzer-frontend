import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './UpcomingFights.css';

const STAT_DEFS = [
    { label: 'Total strikes attempted', key: 'TotalStrikesAttempted' },
    { label: 'Total strikes landed',    key: 'TotalStrikesLanded' },
    { label: 'Sig. strikes attempted',  key: 'SigStrikesAttempted' },
    { label: 'Sig. strikes landed',     key: 'SigStrikesLanded' },
    { label: 'Knockdowns',              key: 'Knockdowns' },
    { label: 'Takedowns attempted',     key: 'TakedownsAttempted' },
    { label: 'Takedowns landed',        key: 'TakedownsLanded' },
    { label: 'Pre-fight odds',          key: 'PreFightOdds' },
];

function FightCard({ fight, index }) {
    const [open, setOpen] = useState(false);

    const merged = (fight?.Fighters ?? []).map(f => {
        const stats = (fight?.FightStats ?? []).find(s => s.FighterId === f.FighterId) ?? {};
        return { ...f, ...stats };
    });

    const f1 = merged[0];
    const f2 = merged[1];

    if (!f1 || !f2) return null;

    const name = (f) => `${f.FirstName ?? ''} ${f.LastName ?? ''}`.trim() || 'TBD';
    const val  = (f, key) => f?.[key] != null ? f[key] : '—';

    const resultBadge = (f) => {
        if (f.Winner === true)  return <span className="result-badge win">Winner</span>;
        if (f.Winner === false) return <span className="result-badge loss">Loss</span>;
        return <span className="result-badge tbd">TBD</span>;
    };

    const formatClock = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="fights">
            <div className="fighters-header" onClick={() => setOpen(o => !o)}>
                <div className="fighter-name left">
                    <h2>{name(f1)}</h2>
                    {resultBadge(f1)}
                </div>
                <div className="vs">VS</div>
                <div className="fighter-name right">
                    <h2>{name(f2)}</h2>
                    {resultBadge(f2)}
                </div>
                <span className={`chevron ${open ? 'open' : ''}`}>▾</span>
            </div>

            {open && (
                <>
                    <div className="divider" />
                    {STAT_DEFS.map((stat, i) => (
                        <div key={i} className="stat-row">
                            <span className="stat-value left">{val(f1, stat.key)}</span>
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value right">{val(f2, stat.key)}</span>
                        </div>
                    ))}
                    {fight.ResultRound > 0 && (
                        <div className="fight-result-row">
                            <span>Round: <strong>{fight.ResultRound}</strong></span>
                            {fight.ResultClock != null && (
                                <span>Time: <strong>{formatClock(fight.ResultClock)}</strong></span>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function UpcomingFight() {
    const [selectedYear, setSelectedYear] = useState('2026');
    const [events, setEvents]             = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [fights, setFights]             = useState([]);

    // Re-fetch event list whenever year changes
    useEffect(() => {
        setSelectedEvent('');
        setFights([]);
        fetch(`http://localhost:8080/api/mma/get2026Events?year=${selectedYear}`)
            .then(res => res.json())
            .then(data => setEvents(data));
    }, [selectedYear]);

    // Fetch fight details when an event is selected
    useEffect(() => {
        if (!selectedEvent) return;
        fetch(`http://localhost:8080/api/mma/getFightDetails?eventName=${encodeURIComponent(selectedEvent)}&year=${selectedYear}`)
            .then(res => res.json())
            .then(data => {
                console.log('fight[0]:', JSON.stringify(data[0], null, 2));
                console.log('fighters:', data[0]?.Fighters);
                setFights(data);
            });
    }, [selectedEvent]);

    return (
        <div className="main">

            {/* Sidebar */}
            <div className="sideBar">
                <Link to="/home" className="sidebar-item">Home</Link>
                <Link to="/upcomingfights" className="sidebar-item">Events</Link>
                <Link to="/fightAnalyzer" className="sidebar-item">Fighter Analyzer</Link>
                <div className="sidebar-item">Head to Head</div>
                <div className="sidebar-item logout">Logout</div>
            </div>

            {/* Main content */}
            <div className="fight-content">
                <div className="fight-inner">
                    <div className="filterContainer">
                        <div className="header"><h2>UFC</h2></div>
                        <div className="red-line"></div>

                        <div className="filter-year">
                            <label>Year: </label>
                            <select
                                value={selectedYear}
                                onChange={e => setSelectedYear(e.target.value)}
                            >
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>

                        <div className="fightDisplay">
                            <label>Choose event:</label>
                            <select
                                value={selectedEvent}
                                onChange={e => { setSelectedEvent(e.target.value); setFights([]); }}
                            >
                                <option value="">Select event...</option>
                                {events.map((name, i) => (
                                    <option key={i} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="event-details">
                            <p className="date">Date:</p>
                            <div className="black-line"></div>
                        </div>

                        {fights.length === 0 && selectedEvent && (
                            <p style={{ color: 'gray', fontSize: 14 }}>Loading fights…</p>
                        )}

                        {fights.map((fight, i) => (
                            <FightCard key={i} fight={fight} index={i} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default UpcomingFight;