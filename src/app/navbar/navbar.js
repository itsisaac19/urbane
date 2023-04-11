export const Navbar = () => {
    return (
        <div className="navigation-grid">
            <div className="urbane">URBANE</div>
            <div className="tabs">
                <span className="home tab active">
                HOME
                </span>
                <span className="houly tab">
                HOURLY
                </span>
                <span className="daily tab">
                DAILY
                </span>
                <span className="radar tab">
                RADAR
                </span>
                <span className="warnings tab">
                WARNINGS
                </span>
            </div>
            <div className="help">
                <span className="about tab">
                ABOUT
                </span>
                <span className="contact tab">
                CONTACT
                </span>
            </div>
        </div>
    )
}