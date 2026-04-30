import { memo } from 'react';

/**
 * Minimalist floating elements to fill blank spaces on wide screens.
 * Uses brutalist shapes (plus, square, circle, line) fading into the background.
 */
function FloatingElements() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {/* ── LARGE ELEMENTS ── */}
      <div className="anim-float" style={{ position: 'absolute', top: '10%', left: '5%', color: 'var(--yellow)', opacity: 0.04, fontSize: '140px', fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>+</div>
      <div className="anim-float-reverse" style={{ position: 'absolute', top: '30%', right: '8%', width: '200px', height: '200px', border: '1px solid var(--green)', borderRadius: '50%', opacity: 0.03 }} />
      <div className="anim-float" style={{ position: 'absolute', bottom: '15%', left: '10%', width: '120px', height: '120px', border: '2px solid var(--white)', opacity: 0.02, transform: 'rotate(15deg)' }} />
      <div className="anim-float-reverse" style={{ position: 'absolute', bottom: '5%', right: '15%', color: 'var(--red)', opacity: 0.04, fontSize: '160px', fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>+</div>
      <div className="anim-float" style={{ position: 'absolute', top: '60%', left: '-10%', width: '500px', height: '1px', background: 'var(--white)', opacity: 0.03, transform: 'rotate(45deg)' }} />
      
      {/* ── MEDIUM ELEMENTS ── */}
      <div className="anim-float-reverse" style={{ position: 'absolute', top: '25%', left: '25%', color: 'var(--white)', opacity: 0.03, fontSize: '60px', fontFamily: "'IBM Plex Mono', monospace", transform: 'rotate(90deg)' }}>//</div>
      <div className="anim-float" style={{ position: 'absolute', top: '15%', right: '25%', width: '60px', height: '60px', border: '1px dashed var(--yellow)', opacity: 0.05, transform: 'rotate(45deg)' }} />
      <div className="anim-float-reverse" style={{ position: 'absolute', bottom: '35%', right: '5%', width: '80px', height: '80px', border: '1px solid var(--white)', borderRadius: '50%', opacity: 0.02 }} />
      <div className="anim-float" style={{ position: 'absolute', bottom: '40%', left: '8%', color: 'var(--green)', opacity: 0.03, fontSize: '80px', fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>[ ]</div>

      {/* ── SMALL DETAILS ── */}
      <div className="anim-float" style={{ position: 'absolute', top: '50%', left: '18%', width: '10px', height: '10px', background: 'var(--red)', opacity: 0.08 }} />
      <div className="anim-float-reverse" style={{ position: 'absolute', top: '70%', right: '22%', width: '15px', height: '15px', border: '2px solid var(--yellow)', opacity: 0.06 }} />
      <div className="anim-float" style={{ position: 'absolute', bottom: '25%', right: '28%', color: 'var(--white)', opacity: 0.05, fontSize: '24px', fontFamily: "'IBM Plex Mono', monospace" }}>*</div>
      <div className="anim-float-reverse" style={{ position: 'absolute', top: '45%', right: '15%', width: '40px', height: '1px', background: 'var(--green)', opacity: 0.06 }} />
      
      {/* ── MORE SCATTERED ELEMENTS ── */}
      <div className="anim-float" style={{ position: 'absolute', top: '80%', left: '30%', color: 'var(--white)', opacity: 0.02, fontSize: '100px', fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>+</div>
      <div className="anim-float-reverse" style={{ position: 'absolute', top: '5%', right: '40%', width: '30px', height: '30px', border: '1px solid var(--red)', opacity: 0.04, transform: 'rotate(30deg)' }} />
    </div>
  );
}

export default memo(FloatingElements);
