import Link from 'next/link';

export const Navbar = (searchParams, label) => {
    const navSearchParams = new URLSearchParams(searchParams).toString();

    return (
        <div className="navigation-grid">
            <div className="urbane">URBANE</div>
            <div className="tabs">
                <Link href={`/weather?${navSearchParams}`} className={`home tab ${label == 'home' ? 'active' : null}`}>
                HOME
                </Link>
{/*                 <span className="houly tab">
                HOURLY
                </span>
                <span className="daily tab">
                DAILY
                </span> */}
                <Link href={`/radar?${navSearchParams}`} className={`radar tab ${label == 'radar' ? 'active' : null}`}>
                RADAR
                </Link>
{/*                 <span className="warnings tab">
                WARNINGS
                </span> */}
            </div>
            <div className="help">
{/*                 <span className="about tab">
                ABOUT
                </span>
                <span className="contact tab">
                CONTACT
                </span> */}
            </div>
        </div>
    )
}