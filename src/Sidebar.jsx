import { Link } from 'react-router-dom';

const NAV_ITEMS = [
    { key: 'home', label: 'Home', to: '/home' },
    { key: 'events', label: 'Events', to: '/upcomingfights' },
    { key: 'analyzer', label: 'Fighter Analyzer', to: '/fightAnalyzer' },
];

function Sidebar({ active, onLogout }) {
    return (
        <div className="sideBar">
            {NAV_ITEMS.map(({ key, label, to }) =>
                active === key ? (
                    <div key={key} className="sidebar-item active">{label}</div>
                ) : (
                    <Link key={key} to={to} className="sidebar-item">{label}</Link>
                )
            )}
            <button type="button" className="sidebar-item logout" onClick={onLogout}>
                Logout
            </button>
        </div>
    );
}

export default Sidebar;
