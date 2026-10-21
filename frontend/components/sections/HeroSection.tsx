'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoBackground from '@/components/animations/VideoBackground';

export default function HeroSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const haloRingsRef = useRef<HTMLDivElement>(null);   // wrapper around the 3 rings only

  /* ── Scroll → halo rings expand + fade ── */
  useEffect(() => {
    const section = sectionRef.current;
    const rings   = haloRingsRef.current;
    if (!section || !rings) return;

    let rafId: number;
    let scale = 1, targetScale = 1;
    let opac  = 1, targetOpac  = 1;
    let animating = false;

    function animate() {
      scale += (targetScale - scale) * 0.1;
      opac  += (targetOpac  - opac)  * 0.1;
      rings!.style.transform = `scale(${scale.toFixed(5)})`;
      rings!.style.opacity   = opac.toFixed(5);

      const doneS = Math.abs(targetScale - scale) < 0.0005;
      const doneO = Math.abs(targetOpac  - opac)  < 0.0005;

      if (!doneS || !doneO) {
        rafId = requestAnimationFrame(animate);
      } else {
        rings!.style.transform = `scale(${targetScale.toFixed(5)})`;
        rings!.style.opacity   = targetOpac.toFixed(5);
        animating = false;
      }
    }

    function onScroll() {
      const rect     = section!.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      // Cover the full 5 wheel-notches: progress over 110 % of hero height
      const progress = Math.min(1, scrolled / (rect.height * 1.1));
      // ease-out quad
      const eased    = 1 - Math.pow(1 - progress, 2);
      targetScale = 1 + eased * 2.0;        // 1× → 3× (was 1.72×)
      targetOpac  = 1 - eased * 0.88;       // 1 → 0.12 (almost invisible at max)

      if (!animating) {
        animating = true;
        rafId = requestAnimationFrame(animate);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{ position:'relative', overflow:'hidden', minHeight:'100vh', display:'flex', alignItems:'center', padding:'7rem 2rem 5rem' }}
    >
      <VideoBackground overlay="rgba(6,3,15,.65)" playbackRate={1} />

      {/* Nebulae */}
      <div className="neb neb-1" />
      <div className="neb neb-2" />
      <div className="neb neb-3" />


      <div style={{ position:'relative', zIndex:2, maxWidth:'1200px', margin:'0 auto', width:'100%' }} className="hero-inner">

        {/* Left: text */}
        <div>
          <div className="hero-tag">✿ &nbsp;Thérapeute certifiée · Hypnose HRE</div>
          <h1 style={{ fontFamily:'"Playfair Display",serif', fontWeight:500, fontSize:'clamp(2.1rem,3.8vw,3.6rem)', lineHeight:1.18, color:'var(--white)', marginBottom:'1.5rem' }}>
            <em style={{ fontStyle:'italic', color:'var(--rose)' }}>Transformez</em> votre présent,<br />
            vers une expansion de <em style={{ fontStyle:'italic', color:'var(--rose)' }}>conscience</em><br />
            par l&apos;exploration du soi
          </h1>
          <p style={{ fontSize:'.97rem', fontWeight:300, color:'var(--dim)', lineHeight:1.9, maxWidth:'500px', marginBottom:'2.5rem' }}>
            Avec la méthode HRE (Hypnose Régressive Ésotérique), je vous accompagne dans une exploration profonde et bienveillante de votre espace énergétique pour libérer ce qui vous retient, de vie en vie.
          </p>
          <div className="hero-cta-row" style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            <Link href="/reserver" className="btn-rose-link">✿ &nbsp;Réserver une séance</Link>
            <Link href="/la-methode" className="btn-ghost-link">Découvrir la méthode →</Link>
          </div>
        </div>

        {/* Right: photo + halos */}
        <div className="hero-right" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative' }}>
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>

            {/* Rings wrapper : scale + fade au scroll.
                position:absolute inset:0 + flex centering preserves the rings' centering. */}
            <div
              ref={haloRingsRef}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
              }}
            >
              <div className="halo-ring h1" />
              <div className="halo-ring h2" />
              <div className="halo-ring h3" />
            </div>

            {/* Photo — stays at its fixed size regardless of scroll */}
            <div className="photo-glow" />
            <Link href="/qui-suis-je" className="photo-frame" aria-label="En savoir plus sur Ama">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/anna-blanc.png`}
                alt="Ama — Anne-Marie Blanc, Praticienne HRE"
                fill
                sizes="240px"
                style={{ objectFit:'cover', objectPosition:'center top', zIndex:1 }}
                priority
              />
              <div className="photo-caption">
                <div className="photo-stars" style={{ display:'flex', gap:'3px' }}>
                  {'★★★★★'.split('').map((s, i) => (
                    <span key={i} style={{ color:'var(--gold)', fontSize:'.7rem' }}>{s}</span>
                  ))}
                </div>
                <div className="photo-name" style={{ fontFamily:'"Playfair Display",serif', fontStyle:'italic', fontSize:'1.75rem', color:'rgba(253,240,247,.92)' }}>Ama</div>
              </div>
            </Link>
          </div>
          <p className="hero-badge" style={{ fontSize:'.68rem', color:'var(--dim)', letterSpacing:'.2em', textTransform:'uppercase' as const }}>Praticienne HRE certifiée</p>
        </div>
      </div>

      <style>{`
        .hero-inner { display:grid; grid-template-columns:1fr 400px; gap:4rem; align-items:center; }
        @media(max-width:900px){
          .hero-inner { grid-template-columns:1fr !important; gap:2.5rem !important; }
          .hero-inner > div:first-child { display:flex; flex-direction:column; align-items:center; text-align:center; }
          .hero-inner > div:first-child p { max-width:100% !important; text-align:center; }
          .hero-cta-row { justify-content:center !important; width:100%; }
          .halo-ring.h1 { width:300px !important; height:300px !important; }
          .halo-ring.h2 { width:260px !important; height:260px !important; }
          .halo-ring.h3 { width:340px !important; height:340px !important; }
          .photo-frame { width:200px !important; height:270px !important; }
          .photo-glow { width:160px !important; height:160px !important; }
        }
        @media(max-width:600px){
          .hero-section { padding-top:4.8rem !important; padding-bottom:2.5rem !important; padding-left:1.25rem !important; padding-right:1.25rem !important; }
          .halo-ring { display:none !important; }
          .photo-glow { width:100px !important; height:100px !important; }
          .photo-frame { width:132px !important; height:177px !important; box-shadow:0 8px 22px rgba(0,0,0,.55), 0 0 26px rgba(255,197,211,.1) !important; }
          .photo-caption { padding:.6rem .8rem .8rem !important; gap:.2rem !important; }
          .photo-stars { gap:2px !important; }
          .photo-stars span { font-size:.55rem !important; }
          .photo-name { font-size:1.3rem !important; }
          .hero-badge { position:relative !important; bottom:auto !important; left:auto !important; transform:none !important; margin-top:.6rem; }
          .btn-rose-link, .btn-ghost-link { width:100%; justify-content:center !important; box-sizing:border-box; padding-left:1rem !important; padding-right:1rem !important; }
        }

        .hero-tag { display:inline-flex; align-items:center; gap:.5rem; background:rgba(255,197,211,.1); border:1px solid rgba(255,197,211,.25); border-radius:50px; padding:.4rem 1.1rem; font-size:.68rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--rose); margin-bottom:1.5rem; animation:tagPulse 3.2s ease-in-out infinite; }
        @keyframes tagPulse { 0%,100%{box-shadow:none} 50%{box-shadow:0 0 20px rgba(255,197,211,.2)} }

        .btn-rose-link { display:inline-flex; align-items:center; gap:.6rem; background:linear-gradient(135deg,#A03460,#6A1030); color:white; text-decoration:none; font-size:.8rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; padding:1rem 2.2rem; border-radius:50px; box-shadow:0 8px 36px rgba(255,197,211,.38); transition:all .3s; position:relative; overflow:hidden; }
        .btn-rose-link:hover { transform:translateY(-3px); box-shadow:0 14px 48px rgba(255,197,211,.56); }
        .btn-ghost-link { display:inline-flex; align-items:center; gap:.6rem; border:1px solid rgba(255,197,211,.35); color:var(--rose); text-decoration:none; font-size:.8rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; padding:1rem 2.2rem; border-radius:50px; transition:all .25s; }
        .btn-ghost-link:hover { transform:translateY(-3px); background:rgba(255,197,211,.06); border-color:var(--rose); box-shadow:0 6px 28px rgba(255,197,211,.22); color:var(--white); }

        .neb { position:absolute; border-radius:50%; filter:blur(100px); pointer-events:none; z-index:1; }
        .neb-1 { width:750px;height:750px; background:radial-gradient(circle,rgba(255,197,211,.16) 0%,transparent 60%); top:-300px;right:-200px; animation:nbA 16s ease-in-out infinite; }
        .neb-2 { width:500px;height:500px; background:radial-gradient(circle,rgba(160,52,96,.1) 0%,transparent 65%); bottom:-150px;left:-100px; animation:nbB 20s ease-in-out infinite; }
        .neb-3 { width:400px;height:400px; background:radial-gradient(circle,rgba(232,191,80,.05) 0%,transparent 65%); top:20%;left:30%; animation:nbC 24s ease-in-out infinite; }
        @keyframes nbA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-60px,40px) scale(1.18)} }
        @keyframes nbB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-30px) scale(.9)} }
        @keyframes nbC { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,25px) scale(1.12)} }

        .halo-ring { position:absolute; border-radius:50%; pointer-events:none; border:1px solid rgba(255,197,211,.38); animation:haloSpin linear infinite; }
        .halo-ring.h1 { width:400px;height:400px; animation-duration:25s; }
        .halo-ring.h2 { width:340px;height:340px; animation-duration:18s; animation-direction:reverse; border-style:dashed; opacity:.85; }
        .halo-ring.h3 { width:460px;height:460px; animation-duration:40s; border-color:rgba(232,191,80,.2); }
        .hero-right { align-self:stretch; }
        .hero-badge { position:absolute; bottom:0; left:50%; transform:translateX(-50%); white-space:nowrap; padding-bottom:.25rem; }
        .halo-ring.h1::after { content:''; position:absolute; top:-4px; left:50%; width:8px;height:8px; border-radius:50%; margin-left:-4px; background:var(--rose); box-shadow:0 0 12px var(--rose),0 0 24px rgba(255,197,211,.5); animation:dotGlow 2s ease-in-out infinite; }
        @keyframes haloSpin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes dotGlow { 0%,100%{box-shadow:0 0 12px var(--rose),0 0 24px rgba(255,197,211,.5)} 50%{box-shadow:0 0 20px var(--rose),0 0 40px rgba(255,197,211,.6)} }

        .photo-glow { position:absolute; width:220px;height:220px; border-radius:50%; background:radial-gradient(circle,rgba(255,197,211,.2),transparent 70%); filter:blur(30px); animation:glowPulse 3s ease-in-out infinite; }
        @keyframes glowPulse { 0%,100%{opacity:.6;transform:scale(.9)} 50%{opacity:1;transform:scale(1.1)} }
        .photo-frame { position:relative; z-index:2; width:240px;height:320px; border-radius:120px 120px 100px 100px; border:1px solid rgba(255,197,211,.3); box-shadow:0 24px 80px rgba(0,0,0,.8),0 0 60px rgba(255,197,211,.1); overflow:hidden; cursor:pointer; display:block; transition:box-shadow .3s; }
        .photo-frame:hover { box-shadow:0 28px 90px rgba(0,0,0,.85),0 0 80px rgba(255,197,211,.22); }
        .photo-frame::before { content:''; position:absolute; top:0;left:0;right:0; height:2px; z-index:3; background:linear-gradient(90deg,transparent,var(--rose),var(--gold-light),var(--rose),transparent); background-size:400% 2px; animation:topShim 3s linear infinite; }
        .photo-frame::after { content:''; position:absolute; bottom:0;left:0;right:0; height:34%; z-index:2; background:linear-gradient(0deg,rgba(6,3,15,.92) 0%,transparent 100%); pointer-events:none; }
        @keyframes topShim { 0%{background-position:0 0} 100%{background-position:400% 0} }
        .photo-caption { position:absolute; bottom:0;left:0;right:0; z-index:4; padding:.8rem 1rem 1.1rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:.3rem; }
      `}</style>
    </section>
  );
}
