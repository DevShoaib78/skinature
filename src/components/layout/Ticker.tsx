/**
 * Continuous-scroll brand ticker (reference: dyou.co's marquee strip), styled on
 * the sand-gold band from the client's mock. Pure CSS animation — the track is
 * rendered twice and translated -50% for a seamless loop; the duplicate is
 * aria-hidden so screen readers hear the message once.
 */

const TICKER_ITEMS = [
  'Clean Formulas',
  'Plant Driven',
  'Lab Tested',
  'Cruelty Free',
  'AYUSH Certified',
  'Clean Beauty',
  'Gender Neutral',
]

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <span
      aria-hidden={hidden || undefined}
      className="flex items-center gap-8 pr-8 whitespace-nowrap"
    >
      {TICKER_ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-8">
          <span className="text-[0.65rem] uppercase tracking-[0.28em] font-semibold text-gold-300">
            {item}
          </span>
          <span className="w-1 h-1 rounded-full bg-gold-500/70" aria-hidden="true" />
        </span>
      ))}
    </span>
  )
}

export default function Ticker() {
  return (
    <div
      aria-label="Skinature promises"
      className="bg-black overflow-hidden py-1.5 select-none"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <Track />
        <Track hidden />
      </div>
    </div>
  )
}
