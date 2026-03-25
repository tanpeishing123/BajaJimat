import { motion } from 'framer-motion';

export function HeroMockCard() {
  const nutrients = [
    { label: 'N', value: 72, color: 'hsla(210, 80%, 55%, 0.8)' },
    { label: 'P', value: 45, color: 'hsla(38, 90%, 50%, 0.8)' },
    { label: 'K', value: 88, color: 'hsla(164, 80%, 40%, 0.8)' },
  ];

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="w-full max-w-sm rounded-3xl p-6 
        bg-white/10 backdrop-blur-xl border border-white/20
        shadow-[0_8px_60px_-12px_rgba(0,0,0,0.3)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2.5 h-2.5 rounded-full bg-emerald-400"
        />
        <span className="text-white/80 font-body text-sm font-semibold tracking-wide">
          AI Scanning Soil…
        </span>
      </div>

      {/* NPK Bars */}
      <div className="space-y-4">
        {nutrients.map((n, i) => (
          <div key={n.label} className="flex items-center gap-3">
            <span className="text-white/90 font-body font-bold text-sm w-4">{n.label}</span>
            <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${n.value}%` }}
                transition={{ delay: 0.5 + i * 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{ background: n.color }}
              />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + i * 0.3 }}
              className="text-white/70 font-body text-xs w-8 text-right"
            >
              {n.value}%
            </motion.span>
          </div>
        ))}
      </div>

      {/* Scanning line */}
      <div className="relative mt-5 h-20 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/50 font-body text-xs tracking-widest uppercase"
          >
            Analysing nutrients
          </motion.span>
        </div>
      </div>

      {/* Cost tag */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="mt-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/20"
      >
        <span className="text-emerald-300 font-body text-xs font-semibold">Estimated Savings</span>
        <span className="text-emerald-300 font-body text-sm font-bold">RM 1,956</span>
      </motion.div>
    </motion.div>
  );
}
