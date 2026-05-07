export function Topbar() {
  return (
    <header className="topbar">
      <label className="search-box">
        <span>Search</span>
        <input placeholder="Search trainees, scores, or sessions..." />
      </label>
      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Notifications">N</button>
        <button className="icon-button" type="button" aria-label="Settings">S</button>
        <div className="avatar">AM</div>
      </div>
    </header>
  )
}
