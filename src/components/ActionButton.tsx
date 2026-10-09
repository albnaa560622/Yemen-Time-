import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { Language } from '../types';
import { triggerHaptic, playClickSound } from '../utils/haptics';

interface ActionButtonProps {
  onCalculate: () => void;
  onReset?: () => void;
  language: Language;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onCalculate,
  onReset,
  language,
  disabled = false,
}) => {
  const isAr = language === 'ar';

  // Ripple effect coordinates
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    triggerHaptic('medium');
    playClickSound(650, 0.05, 'triangle');
    onCalculate();
  };

  return (
    <div className="pt-2 pb-1 space-y-2">
      {/* Primary Action Button */}
      <motion.button
        type="button"
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={handleClick}
        disabled={disabled}
        className={`relative overflow-hidden w-full py-4 px-6 rounded-2xl font-bold text-base text-white shadow-xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${
          disabled
            ? 'bg-[#2A2A32] text-[#6C757D] shadow-none cursor-not-allowed border border-[#3A3A42]'
            : 'bg-gradient-to-r from-[#0F5132] via-[#198754] to-[#20C997] hover:from-[#13653f] hover:to-[#17a2b8] shadow-[#198754]/30 hover:shadow-[#198754]/50 border border-[#20C997]/40 active:brightness-110'
        }`}
      >
        {/* Ripple Overlay */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
            }}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ping opacity-75"
          />
        ))}

        <Calculator className="w-5 h-5 text-white animate-bounce-subtle shrink-0" />

        {/* Dual Language Label ("موافق / Calculate" as highlighted in user prompt) */}
        <span className="tracking-wide flex items-center gap-2">
          <span className="text-lg font-black">{isAr ? 'موافق' : 'Calculate'}</span>
          <span className="opacity-75 text-xs font-medium">({isAr ? 'حساب الدرجة' : 'Compute Score'})</span>
        </span>
      </motion.button>
    </div>
  );
};
