import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './FightAnalyzer.css';

function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function FightAnalyzer() {
    const [allFighters, setAllFighters]         = useState([]);
    const [query, setQuery]                     = useState('');
    const [selectedFighter, setSelectedFighter] = useState(null);
    const [fighterStats, setFighterStats]       = useState(null);
    const [showDropdown, setShowDropdown]       = useState(false);
    const [aiOverview, setAiOverview]           = useState('');
    const [aiLoading, setAiLoading]             = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/mma/getAllFighters')
            .then(res => res.json())
            .then(data => setAllFighters(data));
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = allFighters.filter(f =>
        f.name?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    const fetchAiOverview = async (fighter, stats) => {
        setAiOverview('');
        setAiLoading(true);

        const careerLine = stats.CareerStats
            ? `Sig strikes/min: ${stats.CareerStats.SigStrikesLandedPerMinute ?? '?'}, ` +
              `Strike accuracy: ${stats.CareerStats.SigStrikeAccuracy ?? '?'}%, ` +
              `Takedown avg: ${stats.CareerStats.TakedownAverage ?? '?'}, ` +
              `Submission avg: ${stats.CareerStats.SubmissionAverage ?? '?'}, ` +
              `KO%: ${stats.CareerStats.KnockoutPercentage ?? '?'}%, ` +
              `TKO%: ${stats.CareerStats.TechnicalKnockoutPercentage ?? '?'}%, ` +
              `Decision%: ${stats.CareerStats.DecisionPercentage ?? '?'}%`
            : 'Career stats unavailable';

        const prompt =
            `Give me a concise fighter breakdown for ${fighter.name}` +
            (fighter.nickname ? ` "${fighter.nickname}"` : '') +
            `. Weight class: ${stats.WeightClass ?? 'unknown'}. ` +
            `Record: ${stats.Wins ?? 0}W-${stats.Losses ?? 0}L-${stats.Draws ?? 0}D. ` +
            `TKO wins: ${stats.TechnicalKnockouts ?? 0}, Sub wins: ${stats.Submissions ?? 0}, Title wins: ${stats.TitleWins ?? 0}. ` +
            `${careerLine}. ` +
            `Cover their fighting style, key strengths, weaknesses, and a brief betting perspective. ` +
            `Keep it to 3-4 short paragraphs. No asterisks or markdown formatting.` +
            `If you mentioned "scrambled", ignore it and continue on. Never mentioned Scrambled`
            ;

        try {
            const response = await fetch('http://localhost:8080/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: prompt
            });

            if (!response.ok) throw new Error('AI request failed');

            const text = await response.text();
            setAiOverview(text);
        } catch (err) {
            setAiOverview('Unable to generate AI overview at this time.');
        } finally {
            setAiLoading(false);
        }
    };

    const selectFighter = (f) => {
        console.log('fighter object:', f);
        setSelectedFighter(f);
        setFighterStats(f);        
        setAiOverview('');
        setQuery('');
        setShowDropdown(false);
        fetchAiOverview(f, f);     
    };

    return (
        <div className="analyzer-wrap">
            <div className="sideBar">
                <Link to="/home" className="sidebar-item">Home</Link>
                <Link to="/upcomingfights" className="sidebar-item">Events</Link>
                <div className="sidebar-item">Fighter Analyzer</div>
                <div className="sidebar-item">Head to Head</div>
                <div className="sidebar-item logout">Logout</div>
            </div>

            <div className="analyzer-content">
                <div ref={wrapperRef}>
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search fighter... (e.g 'Jon Jones')"
                            value={query}
                            onChange={e => {
                                setQuery(e.target.value);
                                setShowDropdown(true);
                                setSelectedFighter(null);
                                setFighterStats(null);
                                setAiOverview('');
                            }}
                        />
                    </div>

                    {query.length > 1 && (
                        <p className="search-hint">
                            {filtered.length} fighter{filtered.length !== 1 ? 's' : ''} found
                        </p>
                    )}

                    {showDropdown && query.length > 1 && filtered.length > 0 && (
                        <div className="dropdown">
                            {filtered.map(f => (
                                <div key={f.id} className="fighter-row" onClick={() => selectFighter(f)}>
                                    <div className="avatar">{initials(f.name)}</div>
                                    <div className="fighter-info">
                                        <div className="name">{f.name}</div>
                                        {f.nickname && <div className="nickname">"{f.nickname}"</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedFighter && (
                    <div className="fighter-overview-layout">

                        {/* ── Left: Stats card ── */}
                        <div className="stats-card">

                            <div className="selected-card">
                                <div className="selected-avatar">{initials(selectedFighter.name)}</div>
                                <div className="selected-info">
                                    <p className="name">{selectedFighter.name}</p>
                                    {selectedFighter.nickname && (
                                        <p className="nickname">"{selectedFighter.nickname}"</p>
                                    )}
                                </div>
                            </div>

                            {!fighterStats && (
                                <p style={{ color: '#555', fontSize: 14, marginTop: 12 }}>Loading stats...</p>
                            )}

                            {fighterStats && (
                                <>
                                    <div className="section-label">Fighter Info</div>
                                    <div className="stat-grid">
                                        <div className="stat-item">
                                            <span className="stat-label">Weight class</span>
                                            <span className="stat-value">{fighterStats.WeightClass ?? '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Height</span>
                                            <span className="stat-value">{fighterStats.Height ? `${fighterStats.Height}"` : '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Weight</span>
                                            <span className="stat-value">{fighterStats.Weight ? `${fighterStats.Weight} lbs` : '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Reach</span>
                                            <span className="stat-value">{fighterStats.Reach ? `${fighterStats.Reach}"` : '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Born</span>
                                            <span className="stat-value">
                                                {fighterStats.BirthDate
                                                    ? new Date(fighterStats.BirthDate).getFullYear()
                                                    : '—'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="section-label">Record</div>
                                    <div className="stat-grid">
                                        <div className="stat-item">
                                            <span className="stat-label">Wins</span>
                                            <span className="stat-value green">{fighterStats.Wins ?? '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Losses</span>
                                            <span className="stat-value red">{fighterStats.Losses ?? '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Draws</span>
                                            <span className="stat-value">{fighterStats.Draws ?? '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">No contests</span>
                                            <span className="stat-value">{fighterStats.NoContests ?? '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">TKO wins</span>
                                            <span className="stat-value">{fighterStats.TechnicalKnockouts ?? '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">TKO losses</span>
                                            <span className="stat-value">{fighterStats.TechnicalKnockoutLosses ?? '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Submissions</span>
                                            <span className="stat-value">{fighterStats.Submissions ?? '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Sub losses</span>
                                            <span className="stat-value">{fighterStats.SubmissionLosses ?? '—'}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Title wins</span>
                                            <span className="stat-value">{fighterStats.TitleWins ?? '—'}</span>
                                        </div>
                                    </div>

                                    {fighterStats.CareerStats && (
                                        <>
                                            <div className="section-label">Career Stats</div>
                                            <div className="stat-grid">
                                                <div className="stat-item">
                                                    <span className="stat-label">Sig. strikes/min</span>
                                                    <span className="stat-value">{fighterStats.CareerStats.SigStrikesLandedPerMinute ?? '—'}</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-label">Strike accuracy</span>
                                                    <span className="stat-value">{fighterStats.CareerStats.SigStrikeAccuracy ? `${fighterStats.CareerStats.SigStrikeAccuracy}%` : '—'}</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-label">Takedown avg</span>
                                                    <span className="stat-value">{fighterStats.CareerStats.TakedownAverage ?? '—'}</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-label">Submission avg</span>
                                                    <span className="stat-value">{fighterStats.CareerStats.SubmissionAverage ?? '—'}</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-label">KO %</span>
                                                    <span className="stat-value">{fighterStats.CareerStats.KnockoutPercentage != null ? `${fighterStats.CareerStats.KnockoutPercentage}%` : '—'}</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-label">TKO %</span>
                                                    <span className="stat-value">{fighterStats.CareerStats.TechnicalKnockoutPercentage != null ? `${fighterStats.CareerStats.TechnicalKnockoutPercentage}%` : '—'}</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-label">Decision %</span>
                                                    <span className="stat-value">{fighterStats.CareerStats.DecisionPercentage != null ? `${fighterStats.CareerStats.DecisionPercentage}%` : '—'}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* ── Right: AI Overview ── */}
                        <div className="ai-overview-card">
                            <div className="ai-overview-header">
                                <span className="ai-overview-badge">AI</span>
                                <span className="ai-overview-title">Fighter Overview</span>
                            </div>

                            {aiLoading && (
                                <div className="ai-overview-loading">
                                    <div className="ai-spinner" />
                                    <span>Analyzing {selectedFighter.name}...</span>
                                </div>
                            )}

                            {!aiLoading && aiOverview && (
                                <div className="ai-overview-body">
                                    {aiOverview.split('\n').filter(p => p.trim()).map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            )}

                            {!aiLoading && !aiOverview && fighterStats && (
                                <p className="ai-overview-empty">No overview available.</p>
                            )}

                            {!fighterStats && !aiLoading && (
                                <p className="ai-overview-empty">Select a fighter to see the AI breakdown.</p>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default FightAnalyzer;