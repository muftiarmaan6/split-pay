// 4-step transaction progress indicator
const STEPS = [
  { id: 1, label: 'Preparing', desc: 'Building transaction...' },
  { id: 2, label: 'Signing',   desc: 'Awaiting wallet approval...' },
  { id: 3, label: 'Submitting', desc: 'Broadcasting to network...' },
  { id: 4, label: 'Confirmed', desc: 'Settlement complete!' },
];

export default function TxProgress({ step }) {
  // step: 1=preparing, 2=signing, 3=submitting, 4=confirmed, null=hidden
  if (!step) return null;

  return (
    <div className="p-4 bg-gray-900/80 border border-purple-500/20 rounded-xl">
      <p className="text-xs text-textMuted mb-3 font-medium uppercase tracking-wider">Transaction Progress</p>
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                  ${step > s.id ? 'bg-green-500 text-white' : ''}
                  ${step === s.id ? 'bg-primary text-white animate-pulse ring-2 ring-primary/40' : ''}
                  ${step < s.id ? 'bg-gray-800 text-gray-600 border border-gray-700' : ''}
                `}
              >
                {step > s.id ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : s.id}
              </div>
              <span className={`text-[10px] mt-1 font-medium whitespace-nowrap
                ${step === s.id ? 'text-primary' : step > s.id ? 'text-green-400' : 'text-gray-600'}
              `}>{s.label}</span>
            </div>
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 transition-all duration-500
                ${step > s.id ? 'bg-green-500' : 'bg-gray-700'}
              `} />
            )}
          </div>
        ))}
      </div>
      {/* Current step description */}
      <p className="text-xs text-textMuted mt-3 text-center">
        {step === 4
          ? '✅ ' + STEPS[3].desc
          : STEPS[step - 1]?.desc}
      </p>
    </div>
  );
}
