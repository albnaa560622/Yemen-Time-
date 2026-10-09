import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  FileDown,
  Share2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ApkModal: React.FC<ApkModalProps> = ({ isOpen, onClose, language }) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'install' | 'apk_guide' | 'offline'>('install');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [downloadedOffline, setDownloadedOffline] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    triggerHaptic('success');
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    } else {
      // If prompt isn't ready, guide user to browser menu
      alert(
        isAr
          ? 'لتثبيت التطبيق على هاتف أندرويد:\n1. اضغط على القائمة (⋮) في أعلى المتصفح\n2. اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"\n\nسيظهر التطبيق بأيقونة معهد يمن تايم على هاتفك فوراً.'
          : 'To install on Android:\n1. Tap the browser menu (⋮) at the top right\n2. Select "Install App" or "Add to Home screen"\n\nThe YemenTime app icon will appear on your phone screen immediately.'
      );
    }
  };

  const handleDownloadStandaloneHtml = () => {
    triggerHaptic('success');
    const pageHtml = document.documentElement.outerHTML;
    const blob = new Blob([pageHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'YemenTime_GradeCalculator_Offline.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadedOffline(true);
    setTimeout(() => setDownloadedOffline(false), 3000);
  };

  const currentUrl = window.location.origin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#181820] border border-[#2A2A35] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A4C] via-[#1A2E3E] to-[#181820] p-5 border-b border-[#2A2A35] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0DCAF0]/15 border border-[#0DCAF0]/30 flex items-center justify-center text-[#0DCAF0]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {isAr ? 'تثبيت التطبيق على الموبايل (iPhone & Android)' : 'Install on All Mobiles (iPhone & Android)'}
              </h2>
              <p className="text-xs text-[#0DCAF0]">
                {isAr
                  ? 'يدعم التثبيت المباشر على الآيفون (iOS) والأندرويد والعمل دون إنترنت'
                  : 'Universal mobile app support for iOS, Android, and offline mode'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#2A2A35] bg-[#121218] px-3 pt-2 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('install');
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'install'
                ? 'bg-[#181820] text-[#0DCAF0] border-t-2 border-[#0DCAF0]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{isAr ? 'تثبيت الموبايل (iPhone & Android)' : 'iPhone & Android Install'}</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('apk_guide');
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'apk_guide'
                ? 'bg-[#181820] text-[#0DCAF0] border-t-2 border-[#0DCAF0]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isAr ? 'تحويل أندرويد (.APK)' : 'Android APK Guide'}</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('offline');
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'offline'
                ? 'bg-[#181820] text-[#0DCAF0] border-t-2 border-[#0DCAF0]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileDown className="w-4 h-4" />
            <span>{isAr ? 'تحميل بدون إنترنت' : 'Offline Bundle'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-gray-200">
          {activeTab === 'install' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#1E3A4C]/30 border border-[#1E3A4C] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0DCAF0]" />
                    <h3 className="font-bold text-white">
                      {isAr ? 'تطبيق معهد يمن تايم لجميع أجهزة الموبايل' : 'YemenTime App for All Mobile Devices'}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {isAr
                      ? 'تم تطوير التطبيق بتقنية PWA العالمية ليعمل كبرنامج موبايل أصلي على هواتف آيفون (iOS) وهواتف وأجهزة أندرويد مع دعم العمل دون إنترنت.'
                      : 'Developed with universal PWA technology to run like a native mobile app on iPhones (iOS Safari) and Android devices with full offline support.'}
                  </p>
                </div>
                {installPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#0DCAF0] to-[#0BA3C2] hover:from-[#1fe0ff] hover:to-[#0DCAF0] text-[#121212] font-bold text-sm shadow-lg shadow-[#0DCAF0]/20 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{isAr ? 'تثبيت التطبيق الآن' : 'Install App Now'}</span>
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-[#0DCAF0] whitespace-nowrap">
                    {isAr ? 'اتبع تعليمات هاتفك أدناه ↓' : 'Follow your phone guide below ↓'}
                  </div>
                )}
              </div>

              {/* iPhone (iOS Safari) Installation Guide */}
              <div className="space-y-3 bg-[#1D1D28] p-4 rounded-2xl border border-[#3A3A4A]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#E21F26]/20 text-[#E21F26] flex items-center justify-center font-black">
                      iOS
                    </span>
                    <span>{isAr ? 'خطوات التثبيت على أجهزة الآيفون والآيباد (iPhone / iPad - Safari):' : 'Installation on iPhone & iPad (Safari):'}</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold">
                    Apple iOS
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#14141C] p-3 rounded-xl border border-[#2A2A3A] space-y-1.5">
                    <div className="w-6 h-6 rounded-md bg-[#0DCAF0]/10 text-[#0DCAF0] font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <h5 className="text-xs font-bold text-white">
                      {isAr ? 'زر المشاركة (Share)' : 'Tap Share Button'}
                    </h5>
                    <p className="text-[11px] text-gray-300">
                      {isAr
                        ? 'في متصفح Safari على الآيفون، اضغط على رمز المشاركة (مربع بسهم للأعلى ⎋) في الشريط السفلي.'
                        : 'In Safari browser on iPhone, tap the Share icon (square with upward arrow) at the bottom.'}
                    </p>
                  </div>

                  <div className="bg-[#14141C] p-3 rounded-xl border border-[#2A2A3A] space-y-1.5">
                    <div className="w-6 h-6 rounded-md bg-[#0DCAF0]/10 text-[#0DCAF0] font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <h5 className="text-xs font-bold text-white">
                      {isAr ? 'إضافة للشاشة الرئيسية' : 'Add to Home Screen'}
                    </h5>
                    <p className="text-[11px] text-gray-300">
                      {isAr
                        ? 'اسحب قائمة المشاركة للأعلى واختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen ➕).'
                        : 'Scroll up the menu and select "Add to Home Screen" (➕ icon).'}
                    </p>
                  </div>

                  <div className="bg-[#14141C] p-3 rounded-xl border border-[#2A2A3A] space-y-1.5">
                    <div className="w-6 h-6 rounded-md bg-[#0DCAF0]/10 text-[#0DCAF0] font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <h5 className="text-xs font-bold text-white">
                      {isAr ? 'تطبيق آيفون جاهز!' : 'Ready as iOS App!'}
                    </h5>
                    <p className="text-[11px] text-gray-300">
                      {isAr
                        ? 'اضغط "إضافة" (Add) في الزاوية العلوية، وستظهر أيقونة المعهد على شاشة الآيفون لتعمل دون إنترنت.'
                        : 'Tap "Add" at the top right. The YemenTime app icon will appear on your iPhone screen.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step by step Android screen instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#0DCAF0] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0DCAF0]/20 text-[#0DCAF0] flex items-center justify-center font-black">
                    AND
                  </span>
                  <span>{isAr ? 'خطوات التثبيت على أجهزة أندرويد (Google Chrome / Samsung):' : 'Installation on Android Phones (Chrome / Edge):'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#21212B] p-3.5 rounded-xl border border-[#2F2F3D] space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0DCAF0]/10 text-[#0DCAF0] font-bold flex items-center justify-center text-sm">
                      1
                    </div>
                    <h5 className="text-xs font-bold text-white">
                      {isAr ? 'افتح القائمة' : 'Open Browser Menu'}
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      {isAr
                        ? 'اضغط على النقاط الثلاث (⋮) في الزاوية العلوية لمتصفح Chrome أو Samsung Internet.'
                        : 'Tap the three dots (⋮) in the top corner of Chrome or Edge.'}
                    </p>
                  </div>

                  <div className="bg-[#21212B] p-3.5 rounded-xl border border-[#2F2F3D] space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0DCAF0]/10 text-[#0DCAF0] font-bold flex items-center justify-center text-sm">
                      2
                    </div>
                    <h5 className="text-xs font-bold text-white">
                      {isAr ? 'اختر التثبيت' : 'Select Install'}
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      {isAr
                        ? 'اختر "تثبيت التطبيق" (Install app) أو "إضافة إلى الشاشة الرئيسية" (Add to Home screen).'
                        : 'Choose "Install app" or "Add to Home screen" from the list.'}
                    </p>
                  </div>

                  <div className="bg-[#21212B] p-3.5 rounded-xl border border-[#2F2F3D] space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0DCAF0]/10 text-[#0DCAF0] font-bold flex items-center justify-center text-sm">
                      3
                    </div>
                    <h5 className="text-xs font-bold text-white">
                      {isAr ? 'جاهز للاستخدام' : 'Ready to Use!'}
                    </h5>
                    <p className="text-[11px] text-gray-400">
                      {isAr
                        ? 'ستظهر أيقونة معهد يمن تايم في شاشة هاتفك ويمكنك فتحها دون إنترنت.'
                        : 'The YemenTime icon will appear on your phone home screen.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#121218] p-3.5 rounded-xl border border-[#2A2A35] flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-gray-300">
                  {isAr
                    ? 'هذه الطريقة متوافقة 100% مع جميع أجهزة الموبايل (آيفون، سامسونج، شاومي، هواوي، آيباد) وتحصل على التحديثات تلقائياً.'
                    : 'Fully compatible with all mobile devices (iPhone, Samsung, Xiaomi, Huawei, iPad) with instant automatic updates.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'apk_guide' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#21212B] rounded-2xl p-4 border border-[#2F2F3D] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#E21F26]" />
                    <span>
                      {isAr
                        ? 'تحويل التطبيق إلى ملف .APK وتنزيله عبر PWABuilder'
                        : 'Generate APK file using PWABuilder'}
                    </span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-[#0DCAF0]/10 text-[#0DCAF0] text-[10px] font-bold">
                    {isAr ? 'مجاني وسريع' : 'Free & Easy'}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {isAr
                    ? 'بما أن التطبيق يمتلك الآن ملف Manifest وإعدادات PWA مكتملة، يمكنك تحويله إلى حزمة أندرويد (APK أو AAB) خلال دقيقة واحدة:'
                    : 'Since this app now has a complete PWA Manifest, you can convert it to an Android APK package in 1 minute:'}
                </p>

                <ol className="list-decimal list-inside space-y-2 text-xs text-gray-300 bg-[#14141A] p-3.5 rounded-xl border border-[#2A2A35]">
                  <li>
                    {isAr
                      ? 'انسخ رابط التطبيق الحالي من شريط العنوان أعلى المتصفح.'
                      : 'Copy this web application URL from the browser address bar.'}
                  </li>
                  <li>
                    {isAr
                      ? 'افتح موقع مايكروسوفت الرسمي لتحويل التطبيقات '
                      : 'Open the official Microsoft converter at '}
                    <a
                      href="https://www.pwabuilder.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0DCAF0] underline font-semibold"
                    >
                      pwabuilder.com
                    </a>
                  </li>
                  <li>
                    {isAr
                      ? 'الصق الرابط واضغط على زر "Start"، ثم اختر "Android" واضغط "Package for Android".'
                      : 'Paste the URL, click "Start", then select "Android" and click "Package for Android".'}
                  </li>
                  <li>
                    {isAr
                      ? 'سيتم تنزيل ملف أندرويد (.APK) جاهز للتثبيت والمشاركة مع طلاب ومعلمي المعهد!'
                      : 'A complete Android (.APK) file will be generated and downloaded instantly!'}
                  </li>
                </ol>

                {/* Direct APK Generator Launcher Button */}
                <div className="pt-2">
                  <a
                    href={`https://www.pwabuilder.com/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerHaptic('medium')}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E21F26] to-[#C1181E] hover:from-[#f02930] hover:to-[#d01b22] text-white font-bold text-sm shadow-lg shadow-[#E21F26]/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Layers className="w-4 h-4" />
                    <span>
                      {isAr
                        ? 'إنشاء ملف .APK لأندرويد الآن (رابط مجهز تلقائياً)'
                        : 'Generate Android .APK Now (Prefilled URL)'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-400 font-mono truncate max-w-[240px]">
                    {currentUrl}
                  </span>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      navigator.clipboard.writeText(currentUrl);
                      alert(isAr ? 'تم نسخ رابط التطبيق بنجاح!' : 'App URL copied!');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#1E3A4C] text-white text-xs font-semibold hover:bg-[#1E3A4C]/80 transition-colors"
                  >
                    {isAr ? 'نسخ الرابط' : 'Copy URL'}
                  </button>
                </div>
              </div>

              <div className="bg-[#1C1C24] p-4 rounded-xl border border-[#2F2F3D] space-y-2">
                <h5 className="text-xs font-bold text-white">
                  {isAr ? 'للمطورين: البناء عبر Android Studio / Capacitor' : 'For Developers: Capacitor / Android Studio'}
                </h5>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {isAr
                    ? 'يمكن أيضاً تغليف المشروع كـ Native Android App عبر أمر: npx cap add android ثم npx cap open android لإنشاء ملف APK مباشر.'
                    : 'You can also wrap this Vite project using Capacitor via `npx cap add android` to compile native APKs offline.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'offline' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#21212B] rounded-2xl p-4 border border-[#2F2F3D] space-y-3">
                <div className="flex items-center gap-2">
                  <FileDown className="w-5 h-5 text-[#0DCAF0]" />
                  <h4 className="font-bold text-white text-sm">
                    {isAr ? 'تنزيل نسخة مستقلة (Offline HTML Bundle)' : 'Download Standalone Offline Bundle'}
                  </h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {isAr
                    ? 'يمكنك تنزيل صفحة التطبيق كاملة كملف واحد على هاتفك الذكي أو الكمبيوتر، وتشغيلها بأي وقت دون الحاجة للاتصال بالإنترنت أو تثبيت متجر.'
                    : 'Download the complete app as a single file to save on your phone and run anytime without internet access.'}
                </p>

                <button
                  onClick={handleDownloadStandaloneHtml}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    downloadedOffline
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-[#0DCAF0] hover:bg-[#0DCAF0]/90 text-[#121212] shadow-lg shadow-[#0DCAF0]/20 active:scale-95'
                  }`}
                >
                  {downloadedOffline ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isAr ? 'تم التنزيل بنجاح!' : 'Downloaded Successfully!'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{isAr ? 'تنزيل حزمة التطبيق الآن (.html)' : 'Download Standalone Bundle (.html)'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#121218] p-4 border-t border-[#2A2A35] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isAr ? 'يدعم جميع أجهزة الموبايل (iPhone, Android, iPad)' : 'Supports all mobile devices (iOS, Android, iPad)'}</span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#2A2A35] text-white text-xs font-semibold hover:bg-[#343A40] transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
