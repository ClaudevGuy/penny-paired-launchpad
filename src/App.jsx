import { useEffect, useMemo, useRef, useState } from 'react'

const STOCKS = [
  { symbol: 'PASW', name: 'Ping An Biomedical', logo: '/logos/PASW.png', price: 0.16, change: 19.26, volume: '336.5M', volRatio: 484.6, cap: '19.7M', spark: [10, 12, 11, 17, 16, 25, 23, 38, 35, 55, 48, 73] },
  { symbol: 'CLGN', name: 'CollPlant Biotechnologies', logo: '/logos/CLGN.png', price: 0.43, change: 19.41, volume: '172.0M', volRatio: 847.2, cap: '8.1M', spark: [12, 9, 14, 13, 22, 18, 26, 31, 28, 41, 40, 51] },
  { symbol: 'FUNR', name: 'FUNR', price: 0.02, change: 102.0, volume: '117.8M', volRatio: 812372.4, cap: '$3', spark: [4, 5, 3, 5, 4, 6, 5, 9, 8, 17, 28, 68] },
  { symbol: 'RDHL', name: 'RedHill Biopharma', logo: '/logos/RDHL.svg', price: 1.07, change: 61.12, volume: '95.8M', volRatio: 504.4, cap: '6.5M', spark: [8, 7, 11, 9, 14, 18, 16, 25, 22, 32, 46, 61] },
  { symbol: 'BMXC', name: 'Bemax Inc.', price: 0.004, change: 33.33, volume: '91.7M', volRatio: 13.8, cap: '78.6K', spark: [9, 10, 8, 11, 10, 15, 13, 17, 16, 21, 25, 31] },
  { symbol: 'COOT', name: 'Australian Oilseeds', logo: '/logos/COOT.png', price: 0.6, change: 31.4, volume: '68.1M', volRatio: 153.1, cap: '18.2M', spark: [14, 12, 10, 15, 13, 20, 18, 24, 22, 31, 29, 43] },
  { symbol: 'SOAR', name: 'Volato Group', logo: '/logos/SOAR.png', price: 0.24, change: 11.54, volume: '58.1M', volRatio: 1.4, cap: '13.0M', spark: [15, 17, 14, 16, 18, 17, 20, 19, 22, 24, 23, 26] },
  { symbol: 'NCRA', name: 'Nocera Inc.', logo: '/logos/NCRA.png', price: 2.89, change: 55.35, volume: '53.8M', volRatio: 17.9, cap: '4.5M', spark: [7, 8, 11, 10, 16, 14, 22, 20, 31, 28, 43, 57] },
  { symbol: 'FLZH', name: 'Flash Sports & Media', logo: '/logos/FLZH.png', price: 0.09, change: 8.28, volume: '41.7M', volRatio: 29.3, cap: '5.3M', spark: [13, 12, 14, 13, 15, 14, 16, 18, 17, 20, 19, 23] },
  { symbol: 'GPRO', name: 'GoPro Inc.', logo: '/logos/GPRO.png', price: 0.71, change: 18.39, volume: '41.0M', volRatio: 6.6, cap: '131M', spark: [11, 13, 12, 15, 14, 18, 17, 21, 20, 24, 27, 31] },
  { symbol: 'WBUY', name: 'WEBUY GLOBAL', logo: '/logos/WBUY.png', price: 0.93, change: 10.66, volume: '38.3M', volRatio: 12.3, cap: '5.1M', spark: [12, 14, 13, 15, 16, 15, 18, 17, 21, 20, 23, 25] },
  { symbol: 'LGPS', name: 'LogProstyle Inc.', logo: '/logos/LGPS.png', price: 1.23, change: 16.04, volume: '32.2M', volRatio: 9.3, cap: '29.0M', spark: [10, 9, 12, 11, 15, 14, 16, 19, 18, 22, 24, 29] },
]

const TOP_PAIR_DATA = [
  { symbol: 'PASW', launched: 59, liquidity: '$5.66M' },
  { symbol: 'RDHL', launched: 21, liquidity: '$1.87M' },
  { symbol: 'FUNR', launched: 16, liquidity: '$942K' },
  { symbol: 'GPRO', launched: 8, liquidity: '$621K' },
  { symbol: 'CLGN', launched: 5, liquidity: '$388K' },
]

const TRENDING_LAUNCHES = [
  { name: 'PennyPons', ticker: 'PONNY', paired: 'PASW', mc: '$65.6K', liq: '$32K', vol: '$2.12M', age: '23m', colors: ['#d7ff53', '#17340c', '#f7ffd9'] },
  { name: 'Red Pill Bio', ticker: 'RPILL', paired: 'RDHL', mc: '$18.4K', liq: '$12.8K', vol: '$448K', age: '41m', colors: ['#ff6780', '#3d101d', '#ffd3d9'] },
  { name: 'Fun Runner', ticker: 'RUNR', paired: 'FUNR', mc: '$9.8K', liq: '$8.1K', vol: '$294K', age: '1h', colors: ['#ffad5b', '#41220c', '#fff0cf'] },
  { name: 'Bag Cam', ticker: 'BAG', paired: 'GPRO', mc: '$27.2K', liq: '$19.5K', vol: '$181K', age: '2h', colors: ['#77d4ff', '#102c3e', '#d8f5ff'] },
]

const MODES = [
  { id: 'momentum', label: 'Full send', sub: 'Ride both bags up', icon: '↗' },
  { id: 'shield', label: 'Hedge the chaos', sub: 'Give one bag a helmet', icon: '◈' },
  { id: 'volume', label: 'Volume goblin', sub: 'Chase the loudest tape', icon: '≋' },
]

const PENNIES = [
  { layer: 'far', x: '5%', y: '17%', size: 34, drift: 24, duration: 13, delay: -4, tilt: -18, mark: '¢' },
  { layer: 'far', x: '22%', y: '72%', size: 20, drift: -18, duration: 16, delay: -9, tilt: 22, mark: 'P' },
  { layer: 'far', x: '44%', y: '8%', size: 26, drift: 14, duration: 15, delay: -2, tilt: 8, mark: '¢' },
  { layer: 'far', x: '71%', y: '24%', size: 18, drift: -13, duration: 12, delay: -7, tilt: -24, mark: 'P' },
  { layer: 'far', x: '91%', y: '63%', size: 30, drift: 21, duration: 17, delay: -11, tilt: 17, mark: '¢' },
  { layer: 'far', x: '56%', y: '88%', size: 22, drift: -16, duration: 14, delay: -5, tilt: -6, mark: 'P' },
  { layer: 'mid', x: '11%', y: '47%', size: 48, drift: -29, duration: 11, delay: -6, tilt: 15, mark: '¢' },
  { layer: 'mid', x: '30%', y: '29%', size: 32, drift: 27, duration: 12, delay: -1, tilt: -21, mark: 'P' },
  { layer: 'mid', x: '64%', y: '59%', size: 38, drift: -22, duration: 10, delay: -8, tilt: 26, mark: '¢' },
  { layer: 'mid', x: '83%', y: '13%', size: 42, drift: 24, duration: 13, delay: -3, tilt: -11, mark: 'P' },
  { layer: 'mid', x: '78%', y: '82%', size: 28, drift: -20, duration: 12, delay: -10, tilt: 18, mark: '¢' },
  { layer: 'mid', x: '39%', y: '91%', size: 36, drift: 19, duration: 14, delay: -6, tilt: -16, mark: 'P' },
  { layer: 'near', x: '-1%', y: '78%', size: 82, drift: 38, duration: 9, delay: -4, tilt: 24, mark: '¢' },
  { layer: 'near', x: '18%', y: '5%', size: 62, drift: -34, duration: 10, delay: -7, tilt: -20, mark: 'P' },
  { layer: 'near', x: '48%', y: '42%', size: 54, drift: 31, duration: 8, delay: -2, tilt: 13, mark: '¢' },
  { layer: 'near', x: '96%', y: '32%', size: 76, drift: -37, duration: 11, delay: -8, tilt: -27, mark: 'P' },
  { layer: 'near', x: '68%', y: '96%', size: 66, drift: 29, duration: 9, delay: -5, tilt: 19, mark: '¢' },
]

function PennyField() {
  return (
    <div className="coin-field" aria-hidden="true">
      {['far', 'mid', 'near'].map((layer) => (
        <div className={`coin-layer coin-layer--${layer}`} key={layer}>
          {PENNIES.filter((coin) => coin.layer === layer).map((coin, index) => (
            <span
              className="floating-penny"
              key={`${layer}-${index}`}
              style={{
                '--coin-x': coin.x,
                '--coin-y': coin.y,
                '--coin-size': `${coin.size}px`,
                '--coin-drift': `${coin.drift}px`,
                '--coin-duration': `${coin.duration}s`,
                '--coin-delay': `${coin.delay}s`,
                '--coin-tilt': `${coin.tilt}deg`,
              }}
            >
              <i>{coin.mark}</i>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

const Icon = ({ name, size = 18 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    wallet: <><path d="M4 7.5h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z"/></>,
    tune: <><path d="M4 6h16M7 12h10M10 18h4"/><circle cx="8" cy="6" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>,
    swap: <><path d="M4 8h13l-3-3M20 16H7l3 3"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

const STOCK_ART_PALETTES = [
  ['#d7ff53', '#274211', '#9bdc34'],
  ['#86f7d2', '#123c35', '#c8ff35'],
  ['#ffad66', '#4a2515', '#ffd45f'],
  ['#ae91ff', '#251c4a', '#d7ff53'],
  ['#ff7e9d', '#4b1930', '#ffa85c'],
  ['#65c7ff', '#123348', '#d7ff53'],
]

function StockArt({ stock, size = 'row' }) {
  const [logoFailed, setLogoFailed] = useState(false)
  useEffect(() => setLogoFailed(false), [stock.symbol])
  const stockIndex = Math.max(0, STOCKS.findIndex((item) => item.symbol === stock.symbol))
  const [primary, deep, accent] = STOCK_ART_PALETTES[stockIndex % STOCK_ART_PALETTES.length]
  const initials = stock.symbol.slice(0, 2)
  const diagonal = 18 + (stockIndex % 5) * 7
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <defs>
        <radialGradient id="g" cx="24%" cy="18%" r="90%">
          <stop offset="0" stop-color="${primary}" stop-opacity=".92"/>
          <stop offset=".48" stop-color="${deep}"/>
          <stop offset="1" stop-color="#090c09"/>
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <rect width="96" height="96" rx="24" fill="url(#g)"/>
      <circle cx="72" cy="22" r="19" fill="${accent}" opacity=".18" filter="url(#glow)"/>
      <path d="M-8 ${72 - diagonal} L104 ${20 + diagonal} M-5 ${88 - diagonal} L101 ${36 + diagonal}" stroke="${accent}" stroke-width="2" opacity=".42"/>
      <path d="M16 69 C31 48 44 74 80 29" fill="none" stroke="${primary}" stroke-width="4" stroke-linecap="round" opacity=".85"/>
      <circle cx="79" cy="28" r="4" fill="${accent}"/>
      <text x="14" y="32" fill="#f4f7ed" font-family="Arial Black,Arial" font-size="19" font-weight="800" letter-spacing="-1">${initials}</text>
      <rect x="11" y="76" width="26" height="3" rx="1.5" fill="${accent}"/>
    </svg>`
  const src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  const hasCompanyLogo = Boolean(stock.logo && !logoFailed)
  return (
    <span className={`stock-art stock-art--${size} stock-art--${stock.symbol.toLowerCase()} ${hasCompanyLogo ? 'is-company-logo' : 'is-ticker-art'}`}>
      <img
        src={hasCompanyLogo ? stock.logo : src}
        alt={hasCompanyLogo ? `${stock.name} company logo` : `${stock.symbol} ticker mark`}
        onError={() => setLogoFailed(true)}
      />
    </span>
  )
}

function TokenArtwork({ launch, size = 'card' }) {
  const [primary, deep, light] = launch.colors || ['#d7ff53', '#17340c', '#efffc0']
  const monogram = (launch.ticker || 'NEW').slice(0, 3)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 520">
      <defs>
        <radialGradient id="bg" cx="50%" cy="52%" r="68%"><stop offset="0" stop-color="${deep}"/><stop offset="1" stop-color="#070807"/></radialGradient>
        <radialGradient id="orb" cx="32%" cy="25%" r="70%"><stop offset="0" stop-color="${light}"/><stop offset=".48" stop-color="${primary}"/><stop offset="1" stop-color="${deep}"/></radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="28"/></filter>
        <filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="${primary}" stroke-opacity=".08"/></pattern>
      </defs>
      <rect width="640" height="520" fill="url(#bg)"/>
      <rect width="640" height="520" fill="url(#grid)"/>
      <ellipse cx="320" cy="400" rx="230" ry="72" fill="${primary}" opacity=".18" filter="url(#blur)"/>
      <g opacity=".5" stroke="${primary}" fill="none"><ellipse cx="320" cy="270" rx="230" ry="92"/><ellipse cx="320" cy="270" rx="165" ry="165" transform="rotate(-18 320 270)"/><path d="M62 344C170 215 422 182 577 300"/></g>
      <g filter="url(#glow)"><circle cx="320" cy="258" r="104" fill="url(#orb)" stroke="${light}" stroke-width="3"/><circle cx="320" cy="258" r="82" fill="none" stroke="${deep}" stroke-opacity=".55" stroke-width="3"/></g>
      <text x="320" y="279" text-anchor="middle" fill="#0b0d09" font-family="Arial Black,Arial" font-size="58" font-weight="900" letter-spacing="-4">${monogram}</text>
      <g fill="${primary}"><circle cx="105" cy="183" r="5"/><circle cx="526" cy="136" r="4"/><circle cx="557" cy="372" r="6"/><circle cx="170" cy="421" r="4"/></g>
      <text x="28" y="48" fill="${light}" fill-opacity=".68" font-family="monospace" font-size="15">PENNYPONS // ${launch.paired || 'PAIR'}</text>
    </svg>`
  const src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  const pairedStock = STOCKS.find((stock) => stock.symbol === launch.paired) || STOCKS[0]
  return (
    <span className={`token-art token-art--${size}`}>
      <img src={src} alt={`${launch.name || 'New token'} launch artwork`} />
      {size === 'card' && <span className="token-art__pair"><StockArt stock={pairedStock} size="badge" /> ${pairedStock.symbol}</span>}
    </span>
  )
}

function Sparkline({ values, id, large = false }) {
  const width = large ? 280 : 96
  const height = large ? 88 : 32
  const max = Math.max(...values)
  const min = Math.min(...values)
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width
    const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 6) - 3
    return `${x},${y}`
  }).join(' ')
  const area = `0,${height} ${points} ${width},${height}`

  return (
    <svg className={`sparkline ${large ? 'sparkline--large' : ''}`} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Intraday price trend">
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8ff35" stopOpacity=".35" />
          <stop offset="1" stopColor="#c8ff35" stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${id}`}><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <polygon points={area} fill={`url(#fill-${id})`} />
      <polyline points={points} fill="none" stroke="#c8ff35" strokeWidth={large ? 2.3 : 1.6} vectorEffect="non-scaling-stroke" filter={`url(#glow-${id})`} />
    </svg>
  )
}

function StockRow({ stock, selected, paired, onSelect, onPair }) {
  return (
    <article className={`stock-row ${selected ? 'is-selected' : ''} ${paired ? 'is-paired' : ''}`} onClick={onSelect}>
      <StockArt stock={stock} />
      <div className="stock-row__identity">
        <div><strong>{stock.symbol}</strong><span>{stock.name}</span></div>
        <Sparkline values={stock.spark} id={stock.symbol} />
      </div>
      <div className="stock-row__quote">
        <strong>${stock.price < .01 ? stock.price.toFixed(3) : stock.price.toFixed(2)}</strong>
        <span>+{stock.change.toFixed(2)}%</span>
      </div>
      <button className="mini-pair" onClick={(event) => { event.stopPropagation(); onPair() }} aria-label={`Add ${stock.symbol} to pair`}>
        {paired ? <Icon name="check" size={15} /> : '+'}
      </button>
    </article>
  )
}

function PairNode({ stock, leg, weight, active, onClick }) {
  return (
    <button className={`pair-node pair-node--${leg} ${active ? 'is-active' : ''}`} onClick={onClick}>
      <span className="pair-node__leg">{leg === 'a' ? 'ALPHA BAG' : 'CHAOS BAG'} / LEG {leg.toUpperCase()}</span>
      <StockArt stock={stock} size="node" />
      <span className="pair-node__symbol">{stock.symbol}</span>
      <span className="pair-node__price">${stock.price < .01 ? stock.price.toFixed(3) : stock.price.toFixed(2)}</span>
      <span className="pair-node__change">+{stock.change.toFixed(2)}%</span>
      <span className="pair-node__weight">{weight}%</span>
    </button>
  )
}

function TokenLaunchModal({ open, onClose, initialStock }) {
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [description, setDescription] = useState('')
  const [xProfile, setXProfile] = useState('')
  const [telegram, setTelegram] = useState('')
  const [pairSymbol, setPairSymbol] = useState(initialStock?.symbol || STOCKS[0].symbol)
  const [firstBuy, setFirstBuy] = useState(250)
  const [imagePreview, setImagePreview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) return
    setPairSymbol(initialStock?.symbol || STOCKS[0].symbol)
    setFirstBuy(250)
    setSubmitted(false)
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, initialStock])

  if (!open) return null

  const pairedStock = STOCKS.find((stock) => stock.symbol === pairSymbol) || STOCKS[0]
  const previewLaunch = { name: name || 'Your token', ticker: ticker || 'NEW', paired: pairedStock.symbol, colors: ['#d7ff53', '#17340c', '#efffc0'] }

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="token-modal-backdrop" onMouseDown={onClose}>
      <section className="token-modal" role="dialog" aria-modal="true" aria-labelledby="token-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="token-modal__topbar">
          <button type="button" className="token-modal__back" onClick={onClose}>‹ Back</button>
          <span><i /> SIMULATION MODE</span>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close token launcher"><Icon name="close" /></button>
        </div>

        <div className="launch-route">
          <div className="launch-route__option is-active"><span>🏭</span><div><strong>Launch on PennyPons</strong><em>Launch your meme paired with a penny stock.</em></div><b>RECOMMENDED</b></div>
          <div className="launch-route__option is-coming-soon"><span>⚡</span><div><strong>Fast launch</strong><em>Use the defaults and get straight to the pair.</em></div><b>COMING SOON</b></div>
        </div>

        <div className="token-modal__layout">
          <form className="token-form" id="token-launch-form" onSubmit={handleSubmit}>
            <div className="token-form__heading"><span>CREATE / PAIR / SEND</span><h2 id="token-modal-title">Launch your meme</h2><p>Give it a name, add the art, then choose the penny stock that quotes the launch.</p></div>

            <div className="form-grid form-grid--name">
              <label><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Token name" required /></label>
              <label><span>Ticker</span><input value={ticker} onChange={(event) => setTicker(event.target.value.toUpperCase().slice(0, 8))} placeholder="SYMBOL" required /></label>
            </div>

            <label className="form-field"><span>Description <em>{description.length}/280</em></span><textarea value={description} onChange={(event) => setDescription(event.target.value.slice(0, 280))} placeholder="What is the lore? Keep it short and unhinged." rows="4" /></label>

            <div className="form-field"><span>Token image</span>
              <label className="token-upload">
                <span className="token-upload__preview">{imagePreview ? <img src={imagePreview} alt="Uploaded token preview" /> : <TokenArtwork launch={previewLaunch} size="upload" />}</span>
                <span className="token-upload__copy"><strong>{imagePreview ? 'Image added' : 'Choose an image'}</strong><em>PNG, JPG, GIF or WebP · 2MB max</em><b>{imagePreview ? 'Change image' : 'Upload artwork'}</b></span>
                <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={handleImage} />
              </label>
            </div>

            <div className="form-grid">
              <label><span>X profile</span><input value={xProfile} onChange={(event) => setXProfile(event.target.value)} placeholder="x.com/handle" /></label>
              <label><span>Telegram</span><input value={telegram} onChange={(event) => setTelegram(event.target.value)} placeholder="t.me/community" /></label>
            </div>

            <div className="paired-asset-picker">
              <div className="paired-asset-picker__heading"><div><strong>Paired penny stock</strong><span>Your token launches against this stock instead of ETH.</span></div><b>QUOTES YOUR TOKEN</b></div>
              <div className="paired-asset-picker__search"><Icon name="search" size={17} /><span>Choose from the Yahoo penny-stock feed</span><em>{STOCKS.length} available</em></div>
              <div className="paired-asset-list">
                {STOCKS.slice(0, 8).map((stock) => <button type="button" key={stock.symbol} className={pairSymbol === stock.symbol ? 'is-active' : ''} onClick={() => setPairSymbol(stock.symbol)}><StockArt stock={stock} size="picker" /><span><strong>{stock.name} <em>${stock.symbol}</em></strong><small>{stock.volume} volume · +{stock.change.toFixed(2)}%</small></span>{pairSymbol === stock.symbol && <Icon name="check" size={17} />}</button>)}
              </div>
            </div>

            <div className="first-buy-field">
              <div className="first-buy-field__heading"><div><span>First buy</span><em>The deployer is first to buy onchain when the meme launches.</em></div><strong>${firstBuy.toLocaleString()}</strong></div>
              <label className="first-buy-field__input"><span>$</span><input type="number" min="0" max="10000" step="10" value={firstBuy} onChange={(event) => setFirstBuy(Math.min(10000, Math.max(0, Number(event.target.value))))} /><em>USD EST.</em></label>
              <div className="first-buy-field__presets">{[0, 100, 250, 500, 1000].map((amount) => <button type="button" className={firstBuy === amount ? 'is-active' : ''} key={amount} onClick={() => setFirstBuy(amount)}>{amount === 0 ? 'No buy' : `$${amount >= 1000 ? '1K' : amount}`}</button>)}</div>
              <p><Icon name="bolt" size={14} /> Bundled into the deployer’s launch transaction.</p>
            </div>
          </form>

          <aside className="launch-preview">
            <div className="launch-preview__art">{imagePreview ? <img src={imagePreview} alt="Token launch artwork preview" /> : <TokenArtwork launch={previewLaunch} size="preview" />}</div>
            <div className="launch-preview__title"><span>YOUR LAUNCH</span><h3>{name || 'Your token'}</h3><strong>${ticker || 'TICKER'}</strong></div>
            <dl>
              <div><dt>Paired with</dt><dd><StockArt stock={pairedStock} size="badge" /> ${pairedStock.symbol}</dd></div>
              <div><dt>First buy</dt><dd>${firstBuy.toLocaleString()} <small>DEPLOYER</small></dd></div>
              <div><dt>Trade fee</dt><dd>1.00%</dd></div>
              <div><dt>Liquidity</dt><dd className="is-lime">Locked on launch</dd></div>
            </dl>
            <div className="launch-preview__note">This is a front-end preview. No token, pool, or financial transaction is created yet.</div>
            {submitted && <div className="launch-ready"><Icon name="check" /><span><strong>Launch preview ready</strong><em>Wallet and contract wiring comes next.</em></span></div>}
            <button className="launch-preview__submit" type="submit" form="token-launch-form"><Icon name="bolt" /> {submitted ? 'Preview updated' : 'Create launch preview'}</button>
          </aside>
        </div>
      </section>
    </div>
  )
}

function StockBrowserModal({ open, onClose, onSelect }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return
    setQuery('')
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  const visibleStocks = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return STOCKS.filter((stock) => !normalized || stock.symbol.toLowerCase().includes(normalized) || stock.name.toLowerCase().includes(normalized))
  }, [query])

  if (!open) return null

  return (
    <div className="stock-browser-backdrop" onMouseDown={onClose}>
      <section className="stock-browser" role="dialog" aria-modal="true" aria-labelledby="stock-browser-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="stock-browser__topbar">
          <div><span>12 STOCKS / YAHOO SNAPSHOT</span><h2 id="stock-browser-title">Choose your penny-stock pair</h2><p>Pick the stock that will quote your meme launch.</p></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close penny stock browser"><Icon name="close" /></button>
        </div>
        <label className="stock-browser__search">
          <Icon name="search" size={20} />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ticker or company" />
          <span>{visibleStocks.length} found</span>
        </label>
        <div className="stock-browser__grid">
          {visibleStocks.map((stock) => (
            <button type="button" className="stock-browser-card" key={stock.symbol} onClick={() => onSelect(stock)}>
              <div className="stock-browser-card__top"><StockArt stock={stock} size="browser" /><span><strong>{stock.symbol}</strong><em>{stock.name}</em></span><Icon name="arrow" size={18} /></div>
              <div className="stock-browser-card__price"><strong>${stock.price < .01 ? stock.price.toFixed(3) : stock.price.toFixed(2)}</strong><span>+{stock.change.toFixed(2)}%</span></div>
              <div className="stock-browser-card__metrics"><span>VOLUME<strong>{stock.volume}</strong></span><span>MARKET CAP<strong>{stock.cap}</strong></span></div>
              <div className="stock-browser-card__action">Pair meme with ${stock.symbol}</div>
            </button>
          ))}
          {!visibleStocks.length && <div className="stock-browser__empty">No penny stocks match “{query}”.</div>}
        </div>
        <div className="stock-browser__foot"><i /> Market snapshot from Yahoo Finance · prices may be delayed</div>
      </section>
    </div>
  )
}

function ReviewDrawer({ open, onClose, pair, allocation, mode, budget, onLaunch, launchState }) {
  const legAValue = budget * (allocation / 100)
  const legBValue = budget - legAValue
  return (
    <>
      <div className={`drawer-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`review-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer-handle" />
        <div className="review-drawer__top">
          <div><span className="eyebrow">ONE LAST VIBE CHECK</span><h2>Send the pair</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close review"><Icon name="close" /></button>
        </div>

        <div className="flight-code"><span>YOUR TWO-BAG COOK</span><strong>{pair[0].symbol} // {pair[1].symbol}</strong><em>pair intent 0x7F...29C</em></div>

        <div className="review-legs">
          {[pair[0], pair[1]].map((stock, index) => {
            const dollars = index === 0 ? legAValue : legBValue
            const shares = dollars / stock.price
            return <div className="review-leg" key={stock.symbol}>
              <StockArt stock={stock} size="review" />
              <div><strong>{stock.symbol}</strong><span>{shares > 10000 ? `${(shares / 1000).toFixed(1)}K` : shares.toFixed(1)} units</span></div>
              <div><strong>${dollars.toFixed(2)}</strong><span>{index === 0 ? allocation : 100 - allocation}% weight</span></div>
            </div>
          })}
        </div>

        <dl className="review-specs">
          <div><dt>Launch mode</dt><dd>{mode.label}</dd></div>
          <div><dt>Est. chain fee</dt><dd>0.0008 ETH</dd></div>
          <div><dt>Slippage guard</dt><dd>2.50%</dd></div>
          <div><dt>Network</dt><dd><span className="status-dot" /> RH Chain / Preview</dd></div>
        </dl>

        <div className="risk-note"><Icon name="info" size={17} /><p><strong>High-volatility simulation.</strong> Penny stocks can move violently and may have limited liquidity. This interface does not execute a real trade.</p></div>

        <button className={`launch-button ${launchState !== 'idle' ? 'is-launching' : ''}`} onClick={onLaunch} disabled={launchState !== 'idle'}>
          <span className="launch-button__flare" />
          {launchState === 'idle' && <><Icon name="bolt" /> Full send</>}
          {launchState === 'signing' && <>COOKING THE PAIR...</>}
          {launchState === 'launched' && <><Icon name="check" /> Bags sent</>}
        </button>
        <p className="launch-caption">By launching, both legs are atomically staged as one intent.</p>
      </aside>
    </>
  )
}

export default function App() {
  const shellRef = useRef(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('volume')
  const [selected, setSelected] = useState('PASW')
  const [pair, setPair] = useState([STOCKS[0], STOCKS[3]])
  const [activeLeg, setActiveLeg] = useState(0)
  const [allocation, setAllocation] = useState(58)
  const [modeId, setModeId] = useState('momentum')
  const [budget, setBudget] = useState(250)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [launchState, setLaunchState] = useState('idle')
  const [mobileRail, setMobileRail] = useState(false)
  const [tokenModalOpen, setTokenModalOpen] = useState(false)
  const [stockBrowserOpen, setStockBrowserOpen] = useState(false)
  const [launchStock, setLaunchStock] = useState(STOCKS[0])

  const activeStock = STOCKS.find((stock) => stock.symbol === selected) || STOCKS[0]
  const mode = MODES.find((item) => item.id === modeId)

  const filteredStocks = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const items = STOCKS.filter((stock) => !normalized || stock.symbol.toLowerCase().includes(normalized) || stock.name.toLowerCase().includes(normalized))
    return [...items].sort((a, b) => sort === 'change' ? b.change - a.change : sort === 'price' ? b.price - a.price : b.volRatio - a.volRatio)
  }, [query, sort])

  const score = Math.min(99, Math.round((pair[0].change + pair[1].change) * .62 + Math.log10(pair[0].volRatio + pair[1].volRatio) * 8))

  const addToPair = (stock) => {
    const existingIndex = pair.findIndex((item) => item.symbol === stock.symbol)
    if (existingIndex >= 0) {
      setActiveLeg(existingIndex)
      return
    }
    const next = [...pair]
    next[activeLeg] = stock
    setPair(next)
    setSelected(stock.symbol)
    setActiveLeg(activeLeg === 0 ? 1 : 0)
  }

  const swapPair = () => {
    setPair([pair[1], pair[0]])
    setAllocation(100 - allocation)
    setActiveLeg(activeLeg === 0 ? 1 : 0)
  }

  const openStockPicker = () => {
    setStockBrowserOpen(true)
  }

  const fastLaunch = () => {
    openTokenLaunch(STOCKS[2])
  }

  const openTokenLaunch = (stock = activeStock) => {
    setLaunchStock(stock)
    setTokenModalOpen(true)
  }

  const chooseStock = (stock) => {
    setSelected(stock.symbol)
    setStockBrowserOpen(false)
    openTokenLaunch(stock)
  }

  const handleLaunch = () => {
    setLaunchState('signing')
    window.setTimeout(() => setLaunchState('launched'), 1600)
  }

  useEffect(() => {
    if (!drawerOpen) setLaunchState('idle')
  }, [drawerOpen])

  useEffect(() => {
    let frame
    const movePennies = (event) => {
      if (!shellRef.current) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5
        const y = event.clientY / window.innerHeight - 0.5
        shellRef.current.style.setProperty('--penny-far-x', `${x * -8}px`)
        shellRef.current.style.setProperty('--penny-far-y', `${y * -6}px`)
        shellRef.current.style.setProperty('--penny-mid-x', `${x * -18}px`)
        shellRef.current.style.setProperty('--penny-mid-y', `${y * -13}px`)
        shellRef.current.style.setProperty('--penny-near-x', `${x * -34}px`)
        shellRef.current.style.setProperty('--penny-near-y', `${y * -24}px`)
      })
    }
    window.addEventListener('pointermove', movePennies, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', movePennies)
    }
  }, [])

  return (
    <main className="app-shell" ref={shellRef}>
      <div className="noise" />
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />
      <PennyField />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="PennyPons home">
          <span className="brand__sigil"><i /><i /><i /></span>
          <span><strong>PENNY</strong><em>PONS</em></span>
        </a>
        <nav className="main-nav" aria-label="Primary navigation">
          <a className="is-active" href="#launches">Explore</a>
          <button type="button" onClick={() => openTokenLaunch(activeStock)}>Create token</button>
          <button type="button" onClick={fastLaunch}>Fast launch</button>
        </nav>
        <div className="topbar__actions">
          <span className="chain-pill"><i /> RH CHAIN <b>PREVIEW</b></span>
          <button className="wallet-button"><Icon name="wallet" size={17} /><span>Connect</span></button>
        </div>
      </header>

      <section className="market-tape" aria-label="Market pulse">
        <span className="tape-label">DEGEN FEED</span>
        <div className="tape-track">
          {[...STOCKS.slice(0, 8), ...STOCKS.slice(0, 4)].map((stock, index) => <span key={`${stock.symbol}-${index}`}><b>{stock.symbol}</b> <em>+{stock.change.toFixed(2)}%</em> <i>{stock.volume}</i></span>)}
        </div>
        <span className="market-clock">PENNIES ARE COOKING <b>02:33:19</b></span>
      </section>

      <section className="hero" id="top">
        <div className="hero__copy">
          <span className="eyebrow"><i /> PENNYPONS / RH CHAIN PREVIEW</span>
          <h1>Launch your meme <span>paired with penny stocks</span></h1>
          <div className="hero-launcher">
            <div className="hero-launcher__label"><i /> Choose the penny stock that powers it</div>
            <button className="hero-launcher__search" onClick={openStockPicker}>
              <Icon name="search" size={19} />
              <span>Paste a ticker, or search</span>
              <em>Browse⌄</em>
            </button>
            <button className="hero-launcher__available" onClick={openStockPicker}>
              <span className="hero-launcher__stack">{STOCKS.slice(0, 5).map((stock) => <StockArt stock={stock} size="mini" key={stock.symbol} />)}</span>
              <strong>{STOCKS.length} hot penny stocks available</strong>
              <Icon name="arrow" size={18} />
            </button>
            <button className="hero-launcher__create" onClick={() => openTokenLaunch(activeStock)}>
              <span>＋</span><div><strong>Launch your meme</strong><em>Pair it with any penny stock</em></div><Icon name="arrow" size={19} />
            </button>
          </div>
          <div className="hero-alternative">or <button onClick={openStockPicker}>explore what is already launching</button></div>
          <button className="fast-launch-chip" onClick={fastLaunch}><span>⚡</span> Fast launch — pair the hottest movers</button>
        </div>
      </section>

      <section className="launch-market" id="launches">
        <section className="top-pairs-section">
          <div className="market-section-heading"><div><span>QUOTE STOCKS</span><h2>Top penny-stock pairs</h2></div><p>Stocks being used as the quote side of launches right now.</p></div>
          <div className="top-pairs-grid">
            {TOP_PAIR_DATA.map((pair, index) => {
              const stock = STOCKS.find((item) => item.symbol === pair.symbol) || STOCKS[index]
              return <button className={`top-pair-card ${index === 2 ? 'is-featured' : ''}`} key={pair.symbol} onClick={() => openTokenLaunch(stock)}>
                <div className="top-pair-card__identity"><StockArt stock={stock} size="market" /><span><strong>{stock.name}</strong><em>${stock.symbol}</em></span></div>
                <div className="top-pair-card__stats"><span>Tokens launched on top<strong>{pair.launched}</strong></span><span>Paired liquidity<strong>{pair.liquidity}</strong></span></div>
                <div className="top-pair-card__cta">Launch on ${stock.symbol} <Icon name="arrow" size={15} /></div>
              </button>
            })}
          </div>
          <div className="market-section-note">Preview data only · contract-backed launches arrive with the Robinhood Chain integration.</div>
        </section>

        <section className="trending-launches-section">
          <div className="market-section-heading market-section-heading--inline"><div><span>HOT RIGHT NOW</span><h2>Trending launches</h2></div><p>Most traded launch previews in the last 24h.</p><button onClick={openStockPicker}>View all →</button></div>
          <div className="trending-grid">
            {TRENDING_LAUNCHES.map((launch) => {
              const stock = STOCKS.find((item) => item.symbol === launch.paired) || STOCKS[0]
              return <article className="launch-card" key={launch.ticker}>
                <TokenArtwork launch={launch} />
                <div className="launch-card__title"><span><strong>{launch.name}</strong><em>${launch.ticker}</em></span><button onClick={() => openTokenLaunch(stock)}>Launch on top</button></div>
                <div className="launch-card__metrics"><span><strong>{launch.mc}</strong><em>MC</em></span><span><strong>{launch.liq}</strong><em>LIQ</em></span><span><strong>{launch.vol}</strong><em>VOL 24H</em></span></div>
                <div className="launch-card__footer"><span>Paired with ${launch.paired}</span><em>{launch.age} ago</em></div>
              </article>
            })}
          </div>
        </section>
      </section>

      {false && <><section className="builder-intro">
        <span>PAIR BUILDER</span>
        <h2>Pick two bags. Tune the split.</h2>
        <p>Explore the penny-stock feed, load two legs, and preview the pair before anything touches a wallet.</p>
      </section>

      <section className="launch-layout" id="launchpad">
        <aside className={`stock-rail ${mobileRail ? 'is-mobile-open' : ''}`}>
          <div className="panel-heading">
            <div><span className="eyebrow">01 / PICK A BAG</span><h2>Hot penny stocks</h2></div>
            <button className="rail-close" onClick={() => setMobileRail(false)} aria-label="Close target rail"><Icon name="close" /></button>
            <span className="target-count">{filteredStocks.length}</span>
          </div>
          <div className="search-control">
            <Icon name="search" size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search targets" aria-label="Search stocks" />
            <kbd>⌘ K</kbd>
          </div>
          <div className="filter-strip">
            {[['volume', 'Velocity'], ['change', 'Heat'], ['price', 'Price']].map(([value, label]) => <button key={value} className={sort === value ? 'is-active' : ''} onClick={() => setSort(value)}>{label}</button>)}
            <button className="filter-icon" aria-label="More filters"><Icon name="tune" size={16} /></button>
          </div>
          <div className="stock-list">
            {filteredStocks.map((stock) => <StockRow key={stock.symbol} stock={stock} selected={selected === stock.symbol} paired={pair.some((item) => item.symbol === stock.symbol)} onSelect={() => setSelected(stock.symbol)} onPair={() => addToPair(stock)} />)}
            {!filteredStocks.length && <div className="empty-state">No signals found.</div>}
          </div>
          <div className="source-note"><i /> Screener snapshot from Yahoo Finance <span>↗</span></div>
        </aside>

        <section className="pair-console">
          <div className="console-topline">
            <div><span className="eyebrow">02 / COOK THE PAIR</span><h2>Pair it. Send it.</h2></div>
            <button className="mobile-targets" onClick={() => setMobileRail(true)}>Select targets <span>{filteredStocks.length}</span></button>
            <div className="core-status"><span>CORE TEMP</span><strong>{score}°</strong><i><b style={{width: `${score}%`}} /></i></div>
          </div>

          <div className="orbital-stage">
            <div className="orbital-grid" />
            <div className="orbit orbit--one"><i /><i /></div>
            <div className="orbit orbit--two"><i /></div>
            <div className="energy-beam"><i style={{left: `${allocation}%`}} /></div>
            <PairNode stock={pair[0]} leg="a" weight={allocation} active={activeLeg === 0} onClick={() => setActiveLeg(0)} />
            <button className="swap-core" onClick={swapPair} aria-label="Swap pair legs"><Icon name="swap" /><span>SWAP</span></button>
            <PairNode stock={pair[1]} leg="b" weight={100 - allocation} active={activeLeg === 1} onClick={() => setActiveLeg(1)} />
            <div className="orbital-caption"><span><i /> click a target to inspect</span><span><i /> use + to load active leg</span></div>
          </div>

          <div className="allocation-deck">
            <div className="allocation-heading">
              <div><span>BAG SPLIT</span><strong>{pair[0].symbol} <em>{allocation}%</em></strong></div>
              <div><strong><em>{100 - allocation}%</em> {pair[1].symbol}</strong><span>OTHER BAG</span></div>
            </div>
            <div className="range-wrap">
              <input type="range" min="10" max="90" value={allocation} onChange={(event) => setAllocation(Number(event.target.value))} style={{'--allocation': `${allocation}%`}} aria-label="Pair allocation" />
              <div className="range-ticks">{[10,20,30,40,50,60,70,80,90].map(n => <i key={n} />)}</div>
            </div>
          </div>

          <div className="console-controls">
            <div className="mode-picker">
              <span className="control-label">DEGEN MODE</span>
              <div className="mode-options">{MODES.map((item) => <button key={item.id} className={modeId === item.id ? 'is-active' : ''} onClick={() => setModeId(item.id)}><i>{item.icon}</i><span><strong>{item.label}</strong><em>{item.sub}</em></span><b /></button>)}</div>
            </div>
            <div className="budget-control">
              <span className="control-label">HOW MUCH ARE WE COOKING?</span>
              <div className="budget-input"><span>$</span><input type="number" min="10" max="100000" value={budget} onChange={(event) => setBudget(Math.max(0, Number(event.target.value)))} /><em>USD</em></div>
              <div className="quick-budgets">{[100,250,500,1000].map(amount => <button key={amount} className={budget === amount ? 'is-active' : ''} onClick={() => setBudget(amount)}>${amount >= 1000 ? '1K' : amount}</button>)}</div>
            </div>
          </div>

          <div className="console-footer">
            <div className="pair-signal">
              <span className="signal-orb"><i /></span>
              <span><small>DEGEN SCORE</small><strong>{score > 80 ? 'ABSOLUTELY UNHINGED' : score > 65 ? 'HIGH CONVICTION' : 'WARMING UP'}</strong></span>
              <em>{score}/100</em>
            </div>
            <button className="stage-button" onClick={() => setDrawerOpen(true)}><span>Cook this pair</span><Icon name="arrow" /><i /></button>
          </div>
        </section>

        <aside className="signal-panel" id="signals">
          <div className="panel-heading panel-heading--compact"><div className="signal-panel__identity"><StockArt stock={activeStock} size="signal" /><div><span className="eyebrow">03 / VIBE CHECK</span><h2>{activeStock.symbol}</h2></div></div><span className="live-badge">HOT</span></div>
          <div className="signal-price"><div><strong>${activeStock.price < .01 ? activeStock.price.toFixed(3) : activeStock.price.toFixed(2)}</strong><span>+{activeStock.change.toFixed(2)}%</span></div><small>{activeStock.name}</small></div>
          <div className="signal-chart">
            <div className="chart-grid" />
            <Sparkline values={activeStock.spark} id={`${activeStock.symbol}-large`} large />
            <span className="chart-time">09:30</span><span className="chart-time">NOW</span>
          </div>
          <div className="signal-metrics">
            <div><span>VOLUME</span><strong>{activeStock.volume}</strong><em>↗ session</em></div>
            <div><span>VOL / AVG</span><strong>{activeStock.volRatio > 999 ? '>999×' : `${activeStock.volRatio.toFixed(1)}×`}</strong><em>abnormal</em></div>
            <div><span>MARKET CAP</span><strong>{activeStock.cap}</strong><em>micro cap</em></div>
            <div><span>MOMENTUM</span><strong>{Math.min(99, Math.round(activeStock.change * 1.4))}</strong><em>hot signal</em></div>
          </div>
          <div className="radar-card">
            <div className="radar-card__head"><span>ANOMALY RADAR</span><em>4 axes</em></div>
            <svg viewBox="0 0 200 150" role="img" aria-label="Market anomaly radar">
              <g className="radar-grid"><polygon points="100,15 175,75 100,135 25,75"/><polygon points="100,35 150,75 100,115 50,75"/><polygon points="100,55 125,75 100,95 75,75"/><path d="M100 15v120M25 75h150"/></g>
              <polygon className="radar-shape" points={`100,${25 - Math.min(activeStock.change, 20) * .4} ${140 + Math.min(activeStock.volRatio, 100) * .3},75 100,${105 + Math.min(activeStock.change, 50) * .35} ${65 - Math.min(activeStock.change, 50) * .4},75`} />
              <g className="radar-labels"><text x="100" y="10">VELOCITY</text><text x="178" y="78">VOLUME</text><text x="100" y="148">RISK</text><text x="2" y="78">LIQUIDITY</text></g>
            </svg>
          </div>
          <button className="load-target" onClick={() => addToPair(activeStock)}><span>Add to bag {activeLeg === 0 ? 'A' : 'B'}</span><strong>+</strong></button>
        </aside>
      </section></>}

      <footer className="footer" id="vault">
        <div><span className="brand__sigil brand__sigil--small"><i /><i /><i /></span><p>PennyPons is a UI concept. Market data is a static Yahoo Finance screener snapshot and may be delayed.</p></div>
        <span>DESIGNED FOR RH CHAIN • SIMULATION ONLY • NOT FINANCIAL ADVICE</span>
      </footer>

      <ReviewDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pair={pair} allocation={allocation} mode={mode} budget={budget} onLaunch={handleLaunch} launchState={launchState} />
      <StockBrowserModal open={stockBrowserOpen} onClose={() => setStockBrowserOpen(false)} onSelect={chooseStock} />
      <TokenLaunchModal open={tokenModalOpen} onClose={() => setTokenModalOpen(false)} initialStock={launchStock} />
    </main>
  )
}
