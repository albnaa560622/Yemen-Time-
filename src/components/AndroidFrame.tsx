import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isFrameMode: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, isFrameMode }) => {
  if (!isFrameMode) {
    return <div className="min-h-screen bg-[#121212] text-[#F8F9FA]">{children}</div>;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0A0A0C] sm:py-8 flex flex-col items-center justify-center select-none">
      {/* Mobile devices (max-sm): Full screen edge-to-edge native mobile app view (iPhone & Android compatible) */}
      <div className="w-full min-h-screen min-h-[100dvh] sm:hidden bg-[#121212] text-[#F8F9FA] flex flex-col">
        <div className="flex-1 flex flex-col pb-safe">{children}</div>
      </div>

      {/* Tablet & Desktop (sm and up): Sleek Universal Smartphone Handset Mockup (Android & iPhone style) */}
      <div className="hidden sm:flex relative w-full max-w-[400px] bg-[#1E1E1E] rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] border-[5px] border-[#2D2D38] ring-1 ring-[#0DCAF0]/20 flex-col">
        {/* Top Camera Notch & Dynamic Island simulation */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#0A0A0C] border border-[#2D2D38] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#121218]" />
          </div>
          <div className="w-10 h-1.5 bg-[#121218] rounded-full" />
        </div>

        {/* Side Hardware Button simulations */}
        <div className="absolute -left-[9px] top-28 w-[4px] h-10 bg-[#343A40] rounded-l-md" />
        <div className="absolute -left-[9px] top-42 w-[4px] h-14 bg-[#343A40] rounded-l-md" />
        <div className="absolute -right-[9px] top-32 w-[4px] h-16 bg-[#343A40] rounded-r-md" />

        {/* Screen Content Container */}
        <div className="bg-[#121212] rounded-[38px] overflow-hidden h-[760px] flex flex-col border border-[#25252E] shadow-inner text-[#F8F9FA] relative">
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">{children}</div>

          {/* Universal Mobile Bottom Home Indicator Pill (iOS & Android) */}
          <div className="bg-[#16161C] py-2 flex justify-center items-center border-t border-[#25252E]">
            <div className="w-32 h-1 bg-[#495057] rounded-full hover:bg-[#0DCAF0] transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
