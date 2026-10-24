import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, ChevronDown, CircleHelp,
  Clock3, Download, LayoutDashboard, Menu, MoreHorizontal, Search, Settings,
  Star, TrendingUp, Wallet, X
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

const stocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 231.42, change: 1.82, sector: "Technology", cap: "3.48T", volume: "48.2M", pe: "35.8", color: "#8b5cf6" },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 428.76, change: 0.74, sector: "Technology", cap: "3.19T", volume: "21.4M", pe: "36.2", color: "#0ea5e9" },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 141.98, change: 3.21, sector: "Semiconductors", cap: "3.46T", volume: "162.7M", pe: "55.1", color: "#22c55e" },
  { symbol: "AMZN", name: "Amazon.com, Inc.", price: 225.94, change: -0.62, sector: "Consumer Cyclical", cap: "2.37T", volume: "32.6M", pe: "42.7", color: "#f59e0b" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 176.83, change: 0.38, sector: "Communication", cap: "2.15T", volume: "18.9M", pe: "23.4", color: "#ec4899" },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 338.11, change: -1.14, sector: "Automotive", cap: "1.08T", volume: "76.1M", pe: "96.5", color: "#ef4444" }
];

const chartData = {
  "1D": [212, 214, 211, 218, 216, 220, 218, 224, 222, 227, 225, 231.42],
  "1W": [204, 208, 206, 213, 211, 217, 215, 219, 222, 218, 226, 231.42],
  "1M": [190, 194, 192, 201, 198, 205, 210, 207, 216, 221, 226, 231.42],
  "3M": [175, 180, 178, 186, 191, 188, 199, 205, 201, 215, 223, 231.42],
  "1Y": [148, 155, 162, 158, 171, 180, 176, 192, 201, 214, 220, 231.42]
};

const makeChart = (range) => chartData[range].map((price, i) => ({
  label: range === "1D" ? ["9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00"][i] : `Point ${i + 1}`,
  price
}));

function currency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function App() {
  const [selected, setSelected] = useState("AAPL");
  const [range, setRange] = useState("1D");
  const [query, setQuery] = useState("");
  const [watchlist, setWatchlist] = useState(["AAPL", "MSFT", "NVDA", "AMZN"]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");

  const active = stocks.find((s) => s.symbol === selected) || stocks[0];
  const visibleStocks = useMemo(() => stocks.filter((s) =>
    `${s.symbol} ${s.name} ${s.sector}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);
  const data = useMemo(() => {
    const scale = active.price / 231.42;
    return makeChart(range).map((point) => ({ ...point, price: Number((point.price * scale).toFixed(2)) }));
  }, [range, active.price]);
  const isPositive = active.change >= 0;

  function toggleWatch(symbol) {
    setWatchlist((current) => current.includes(symbol)
      ? current.filter((item) => item !== symbol)
      : [...current, symbol]);
  }

  function exportWatchlist() {
    const rows = [["Symbol", "Company", "Price (demo USD)", "Change %", "Sector"], ...stocks
      .filter((s) => watchlist.includes(s.symbol))
      .map((s) => [s.symbol, s.name, s.price, s.change, s.sector])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock-watchlist-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Watchlist CSV exported.");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={21} /></div>
          <span>Stock<span className="brand-light">Pilot</span></span>
          <button className="icon-btn close-menu" aria-label="Close menu" onClick={() => setMobileMenu(false)}><X size={18} /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          <button className="nav-item active"><LayoutDashboard size={18} /> Dashboard</button>
          <button className="nav-item" onClick={() => document.getElementById("watchlist")?.scrollIntoView({ behavior: "smooth" })}><Star size={18} /> Watchlist <span className="nav-count">{watchlist.length}</span></button>
          <button className="nav-item" onClick={() => setNotice("Portfolio section is a demo placeholder.")}><Wallet size={18} /> Portfolio</button>
          <button className="nav-item" onClick={() => setNotice("Alerts are not connected to a live notification service.")}><Bell size={18} /> Alerts</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="market-status"><span className="status-dot" /><div><strong>Demo market</strong><small>Sample data only</small></div></div>
          <button className="nav-item" onClick={() => setNotice("Settings are a demo placeholder.")}><Settings size={18} /> Settings</button>
          <button className="nav-item" onClick={() => setNotice("This project is a frontend portfolio demo.")}><CircleHelp size={18} /> Help & support</button>
          <div className="profile">
            <div className="avatar">SP</div><div className="profile-copy"><strong>Stock Pilot</strong><small>Personal workspace</small></div><MoreHorizontal size={19} />
          </div>
        </div>
      </aside>

      {mobileMenu && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setMobileMenu(true)}><Menu size={21} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div>
          <div className="top-actions">
            <div className="market-pill"><span className="status-dot" /> Market overview</div>
            <button className="icon-btn" aria-label="Notifications" onClick={() => setNotice("No new notifications in this demo.")}><Bell size={19} /></button>
            <button className="avatar small-avatar" aria-label="Profile">SP</button>
          </div>
        </header>

        <div className="page">
          <section className="page-heading">
            <div><p className="eyebrow">MONDAY, MARKET SNAPSHOT</p><h1>Market dashboard</h1><p className="subheading">Track your favorite stocks in one place.</p></div>
            <button className="primary-btn" onClick={exportWatchlist}><Download size={16} /> Export watchlist</button>
          </section>

          {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notice"><X size={15} /></button></div>}

          <section className="stats-grid" aria-label="Market summary">
            <article className="stat-card">
              <div className="stat-top"><span>Total watchlist value</span><span className="stat-icon purple"><Wallet size={18} /></span></div>
              <div className="stat-value">$12,486.50</div><div className="stat-foot positive"><ArrowUpRight size={15} /> 4.28% <span>vs. previous period</span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Market sentiment</span><span className="stat-icon green"><Activity size={18} /></span></div>
              <div className="stat-value">Bullish</div><div className="stat-foot positive"><span className="mini-dot" /> Sample indicator</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Stocks tracked</span><span className="stat-icon blue"><Star size={18} /></span></div>
              <div className="stat-value">{watchlist.length.toString().padStart(2, "0")} <small>/ 06</small></div><div className="stat-foot muted">In your watchlist</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Market status</span><span className="stat-icon orange"><Clock3 size={18} /></span></div>
              <div className="stat-value">Demo mode</div><div className="stat-foot muted">Prices are not live</div>
            </article>
          </section>

          <section className="content-grid">
            <article className="panel chart-panel">
              <div className="panel-heading">
                <div><p className="panel-label">STOCK PERFORMANCE</p><h2>{active.name} <span className="symbol-tag">{active.symbol}</span></h2></div>
                <button className={`star-btn ${watchlist.includes(active.symbol) ? "starred" : ""}`} onClick={() => toggleWatch(active.symbol)} aria-label="Toggle watchlist"><Star size={18} fill={watchlist.includes(active.symbol) ? "currentColor" : "none"} /></button>
              </div>
              <div className="price-row"><strong>{currency(active.price)}</strong><span className={isPositive ? "positive" : "negative"}>{isPositive ? <ArrowUpRight size={17} /> : <ArrowDownRight size={17} />}{Math.abs(active.change).toFixed(2)}% today</span></div>
              <div className="chart-meta"><span><span className="legend-dot" /> Sample price history</span><span>USD</span></div>
              <div className="range-tabs" role="group" aria-label="Chart time range">
                {["1D", "1W", "1M", "3M", "1Y"].map((item) => <button key={item} className={range === item ? "selected" : ""} onClick={() => setRange(item)}>{item}</button>)}
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}>
                    <defs><linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7567f8" stopOpacity={0.28} /><stop offset="100%" stopColor="#7567f8" stopOpacity={0.015} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 5" stroke="#263246" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "#8190a6", fontSize: 11 }} tickLine={false} axisLine={false} interval={2} />
                    <YAxis domain={["dataMin - 8", "dataMax + 8"]} tick={{ fill: "#8190a6", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip contentStyle={{ background: "#111b2c", border: "1px solid #2a3850", borderRadius: 10, color: "#f8fafc" }} formatter={(value) => [currency(value), "Sample price"]} labelStyle={{ color: "#9aa8bc" }} />
                    <Area type="monotone" dataKey="price" stroke="#8b7cff" strokeWidth={2.5} fill="url(#priceGradient)" activeDot={{ r: 5, fill: "#a99fff", stroke: "#111827", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="demo-note">Illustrative sample values for portfolio demonstration only.</p>
            </article>

            <article className="panel detail-panel">
              <div className="panel-heading"><div><p className="panel-label">COMPANY PROFILE</p><h2>Stock details</h2></div><button className="icon-btn" onClick={() => setNotice("Stock details use illustrative demo values.")} aria-label="More details"><MoreHorizontal size={20} /></button></div>
              <div className="company-identity"><div className="company-logo" style={{ "--company-color": active.color }}>{active.symbol.slice(0, 1)}</div><div><h3>{active.name}</h3><p>{active.sector}</p></div></div>
              <div className="detail-price">{currency(active.price)}<span className={isPositive ? "positive" : "negative"}>{isPositive ? "+" : ""}{active.change.toFixed(2)}%</span></div>
              <div className="detail-list">
                <div><span>Market cap</span><strong>{active.cap}</strong></div>
                <div><span>Volume</span><strong>{active.volume}</strong></div>
                <div><span>P/E ratio</span><strong>{active.pe}</strong></div>
                <div><span>Sector</span><strong>{active.sector}</strong></div>
              </div>
              <button className="outline-btn" onClick={() => toggleWatch(active.symbol)}><Star size={16} /> {watchlist.includes(active.symbol) ? "Remove from watchlist" : "Add to watchlist"}</button>
            </article>
          </section>

          <section className="panel watchlist-panel" id="watchlist">
            <div className="watchlist-heading"><div><p className="panel-label">YOUR COLLECTION</p><h2>Watchlist <span className="watch-count">{watchlist.length}</span></h2></div>
              <label className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stocks..." aria-label="Search stocks" /><kbd>/</kbd></label>
            </div>
            <div className="table-scroll"><table><thead><tr><th>Company</th><th>Price</th><th>Change</th><th>Market cap</th><th>Sector</th><th>Watchlist</th></tr></thead>
              <tbody>{visibleStocks.filter((s) => watchlist.includes(s.symbol)).map((stock) => <tr key={stock.symbol} className={selected === stock.symbol ? "row-selected" : ""} onClick={() => setSelected(stock.symbol)}>
                <td><div className="stock-name"><div className="stock-avatar" style={{ "--company-color": stock.color }}>{stock.symbol.slice(0, 1)}</div><div><strong>{stock.name}</strong><small>{stock.symbol}</small></div></div></td>
                <td className="price-cell">{currency(stock.price)}</td><td><span className={`change-pill ${stock.change >= 0 ? "up" : "down"}`}>{stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%</span></td><td>{stock.cap}</td><td><span className="sector-pill">{stock.sector}</span></td><td><button className={`star-btn table-star ${watchlist.includes(stock.symbol) ? "starred" : ""}`} onClick={(e) => { e.stopPropagation(); toggleWatch(stock.symbol); }} aria-label={`Toggle ${stock.symbol} watchlist`}><Star size={17} fill={watchlist.includes(stock.symbol) ? "currentColor" : "none"} /></button></td>
              </tr>)}
              {visibleStocks.filter((s) => watchlist.includes(s.symbol)).length === 0 && <tr><td colSpan="6" className="empty-state">No matching stocks in your watchlist.</td></tr>}
              </tbody></table></div>
            <div className="table-footer"><span>Showing {visibleStocks.filter((s) => watchlist.includes(s.symbol)).length} of {watchlist.length} watchlist stocks</span><span><span className="status-dot" /> Demo data · not for investment decisions</span></div>
          </section>
          <footer className="footer">StockPilot · React portfolio project <span>All displayed stock data is fictional/illustrative and not live market data.</span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;