import Spline from '@splinetool/react-spline';
import React, { useState, useRef } from 'react';
// @ts-ignore
import modeSwitch from "../assets/sounds/mode-switch.mp3";
import { Howl, Howler } from "howler";
// @ts-ignore
import bubblePop from "../assets/sounds/bubble-pop.mp3";
// @ts-ignore
import lofi from "../assets/sounds/lofi.mp3";
// @ts-ignore
import traceryImport from 'tracery-grammar';

// Helper for bubble SVG
interface BubbleProps {
  size: number;
  left?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  opacity?: number;
  color?: string;
}
function Bubble({ size, left, top, right, bottom, opacity = 0.5, color = '#fff' }: BubbleProps) {
  return (
    <svg
      width={size}
      height={size}
      style={{
        position: 'absolute',
        left,
        top,
        right,
        bottom,
        zIndex: 11,
        pointerEvents: 'none',
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 1}
        fill={color}
        opacity={opacity}
        stroke="#aee7fa"
        strokeWidth="2"
      />
    </svg>
  );
}

// Tracery grammar for absurd shower thoughts
const grammar = traceryImport.createGrammar({
  origin: [
    "#absurdThought#",
    "#absurdIdea#",
    "#absurdQuestion#",
    "#absurdComparison#"
  ],
  absurdThought: [
    "If you clean a vacuum cleaner, are you the vacuum cleaner?",
    "If you drop soap on the floor, is the floor clean or the soap dirty?",
    "If you try to fail and succeed, which have you done?",
    "If you expect the unexpected, doesn’t the unexpected become expected?",
    "If you’re waiting for the waiter, aren’t you the waiter?",
    "If you dig a hole through the earth and jump in, are you falling down or up?",
    "If you describe something as indescribable, haven’t you already described it?",
    "If two mind readers read each other’s minds, whose mind are they reading?",
    "If Cinderella’s shoe fit perfectly, why did it fall off?",
    "If a word is misspelled in the dictionary, how would we ever know?",
    "If tomatoes are fruit, is ketchup a smoothie?",
    "If the number 2 pencil is the most popular, why is it still number 2?",
    "If you try to fail and succeed, which have you done?",
    "If you clean a vacuum cleaner, are you the vacuum cleaner?"
  ],
  absurdIdea: [
    "What if #object# could #verb#?",
    "Imagine a world where #object# is illegal.",
    "Suppose #object# was actually invented by #animal#.",
    "What if #object# was sentient and had feelings?",
    "If #object# could talk, what would it say about #topic#?"
  ],
  absurdQuestion: [
    "Why do we park on driveways and drive on parkways?",
    "Why isn’t the number 11 pronounced onety-one?",
    "Why is the word 'abbreviation' so long?",
    "Why do noses run but feet smell?",
    "Why do we cook bacon and bake cookies?",
    "Why do we call it a building if it’s already built?"
  ],
  absurdComparison: [
    "#object# is just #object2# in disguise.",
    "#object# is basically a #object2# for #animal#.",
    "#object# is the #adjective# version of #object2#."
  ],
  object: [
    "a potato", "a sock", "a toothbrush", "a cloud", "a banana", "a doorknob", "a towel", "a rubber duck", "a bar of soap", "a shower curtain", "a shampoo bottle", "a loofah"
  ],
  object2: [
    "a pillow", "a marshmallow", "a sponge", "a phone", "a hat", "a slipper", "a pancake", "a jellybean", "a balloon", "a donut"
  ],
  animal: [
    "cats", "dogs", "penguins", "octopuses", "sloths", "llamas", "ducks", "unicorns"
  ],
  verb: [
    "sing", "dance", "fly", "glow in the dark", "do taxes", "dream", "sneeze", "argue", "write poetry"
  ],
  topic: [
    "the weather", "Mondays", "existence", "the meaning of life", "shower thoughts", "the universe", "breakfast"
  ],
  adjective: [
    "squishy", "mysterious", "confused", "sleepy", "existential", "bubbly", "absurd"
  ]
});
grammar.addModifiers(traceryImport.baseEngModifiers);

const ANIMATIONS = [
  'fade-in',
  'slide-up',
  'slide-down',
  'zoom-in',
  'flip',
  'bounce',
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Hero3D() {
  const [loading, setLoading] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const splashTimeout = useRef<NodeJS.Timeout | null>(null);

  // Generative logic
  const [thought, setThought] = useState('');
  const [anim, setAnim] = useState('');
  const [showThought, setShowThought] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const thoughtTimeout = useRef<NodeJS.Timeout | null>(null);
  const overlayTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showCredits, setShowCredits] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const lofiHowlRef = useRef<any>(null);
  const lofiPlayingRef = useRef(false);

  // Play music automatically after loading screen
  React.useEffect(() => {
    if (!loading && lofiHowlRef.current && !lofiPlayingRef.current) {
      if (!lofiHowlRef.current.playing()) {
        lofiHowlRef.current.play();
        lofiPlayingRef.current = true;
      }
    }
  }, [loading]);

  // Setup lofi music Howl instance
  React.useEffect(() => {
    if (!lofiHowlRef.current) {
      lofiHowlRef.current = new Howl({ src: [lofi], loop: true, volume: 0.09 });
    }
    return () => {
      if (lofiHowlRef.current) {
        lofiHowlRef.current.stop();
        lofiPlayingRef.current = false;
      }
    };
  }, []);

  React.useEffect(() => {
    Howler.mute(musicMuted);
  }, [musicMuted]);

  const handleToggleMusic = () => {
    setMusicMuted((prev) => !prev);
  };

  const handleThink = () => {
    // Play sound effect
    new Howl({ src: [modeSwitch], volume: 0.4 }).play();
    // Pick a new phrase and animation
    const newPhrase = grammar.flatten('origin');
    const newAnim = getRandomItem(ANIMATIONS);
    setShowThought(false);
    setOverlayActive(true);
    setOverlayVisible(true);
    if (thoughtTimeout.current) clearTimeout(thoughtTimeout.current);
    if (overlayTimeout.current) clearTimeout(overlayTimeout.current);
    // Wait for exit animation (if any), then show new
    setTimeout(() => {
      setThought(newPhrase);
      setAnim(newAnim);
      setShowThought(true);
      // Play bubble-pop after animation (0.7s)
      setTimeout(() => {
        new Howl({ src: [bubblePop], volume: 1.0 }).play();
      }, 700);
      // Hide overlay after 5s
      overlayTimeout.current = setTimeout(() => {
        setOverlayActive(false);
        setShowThought(false);
        setTimeout(() => setOverlayVisible(false), 600); // allow fade out
      }, 5000);
    }, 200);
  };

  // When the model loads, start a timer for the minimum splash duration
  const handleSplineLoad = () => {
    setModelLoaded(true);
    splashTimeout.current = setTimeout(() => setLoading(false), 1200);
  };

  // If the model loads after 1.2s, hide splash immediately
  React.useEffect(() => {
    if (modelLoaded && !loading) {
      if (splashTimeout.current) clearTimeout(splashTimeout.current);
    }
  }, [modelLoaded, loading]);

  // Splash screen with animated soap and bubbles
  const SplashScreen = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(145deg, #ffe0f7 60%, #e0f7fa 100%)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      transition: 'opacity 0.6s',
    }}>
      <div style={{ position: 'relative', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 110 }}>
        {/* Animated soap bar */}
        <div style={{
          width: 240,
          height: 110,
          background: 'linear-gradient(120deg, #fff0fa 60%, #e0f7fa 100%)',
          borderRadius: '2rem',
          boxShadow: '0 8px 32px 0 rgba(200, 180, 255, 0.25), 0 2px 8px 0 #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Rubik Bubbles, cursive',
          fontSize: '1.7rem',
          color: '#D670AA',
          fontWeight: 700,
          letterSpacing: '0.08em',
          border: '2px solid #e0b6d6',
          position: 'relative',
          animation: 'soap-bounce 1.6s infinite cubic-bezier(.68,-0.55,.27,1.55)',
          userSelect: 'none',
        }}>
          <span style={{ textShadow: '0 2px 8px #fff, 0 1px 0 #e0f7fa', width: '100%', textAlign: 'center' }}>Shower Thoughts</span>
        </div>
        {/* Bubbles floating up */}
        <Bubble size={32} left={-24} top={-30} opacity={0.5} />
        <Bubble size={18} left={60} top={-40} opacity={0.4} />
        <Bubble size={22} left={120} top={-28} opacity={0.6} />
        <Bubble size={14} left={160} top={-18} opacity={0.3} />
      </div>
      <div style={{ fontFamily: 'Rubik Bubbles, cursive', color: '#D670AA', fontSize: '1.3rem', opacity: 0.7, letterSpacing: '0.04em' }}>
        Loading your shower experience...
      </div>
      <style>{`
        @keyframes soap-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
      `}</style>
  </div>
);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', minHeight: '100dvh', minWidth: '100vw', overflow: 'hidden', zIndex: 0 }}>
      {/* White vignette overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 100,
        background: 'radial-gradient(ellipse 120% 120% at 50% 50%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.28) 80%, rgba(255,255,255,0.55) 100%)',
        mixBlendMode: 'screen',
      }} />
      {loading && SplashScreen}
      {/* Bubbles on the border of the screen */}
      <Bubble size={72} left={-32} top={-32} />
      <Bubble size={48} left={40} top={-20} />
      <Bubble size={60} right={-40} top={10} />
      <Bubble size={38} right={60} top={-22} />
      <Bubble size={56} left={-28} bottom={60} />
      <Bubble size={82} right={-44} bottom={-44} />
      <Bubble size={50} left={120} bottom={-20} />
      <Bubble size={38} right={160} bottom={-18} />
      <Bubble size={64} left={-30} top={'40%'} />
      <Bubble size={54} right={-30} top={'60%'} />
      <Bubble size={44} left={'20%'} bottom={-30} />
      <Bubble size={44} right={'20%'} bottom={-30} />
      <Bubble size={36} left={'10%'} top={-18} />
      <Bubble size={36} right={'10%'} top={-18} />
      {/* Top heading and 3D scene */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        textAlign: 'center',
        zIndex: 10,
        pointerEvents: 'none',
        padding: '1.2rem 0 1.2rem 0',
      }}>
        {/* Shower head icon */}
        <svg width="60" height="60" viewBox="0 0 60 60" style={{ display: 'block', margin: '0 auto 0.2rem auto' }}>
          <g>
            <ellipse cx="30" cy="20" rx="18" ry="8" fill="#b0c4de" stroke="#7b8fa1" strokeWidth="2" />
            <rect x="27" y="5" width="6" height="18" rx="3" fill="#b0c4de" stroke="#7b8fa1" strokeWidth="2" />
            {/* Water droplets */}
            <ellipse cx="18" cy="38" rx="2.5" ry="5" fill="#aee7fa" opacity="0.8" />
            <ellipse cx="30" cy="42" rx="2.5" ry="5" fill="#aee7fa" opacity="0.7" />
            <ellipse cx="42" cy="38" rx="2.5" ry="5" fill="#aee7fa" opacity="0.8" />
          </g>
        </svg>
        {/* Curved heading with droplets and bubble foam */}
        <svg width="100%" height="220" viewBox="-40 0 880 220" style={{ display: 'block', margin: '0 auto', overflow: 'visible', transform: 'translateY(-30px)' }}>
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#fff" flood-opacity="0.7" />
              <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#D670AA" flood-opacity="0.18" />
              <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#fff" flood-opacity="0.25" />
            </filter>
          </defs>
          <path id="arcTextPath" d="M 0 200 Q 400 40 800 200" fill="transparent" />
          <text fontSize="80" fontWeight="700" fill="white" stroke="#D670AA" strokeWidth="1" style={{ fontFamily: 'Rubik Bubbles, cursive', letterSpacing: '0.06em', filter: 'none', textShadow: '0 4px 24px #fff, 0 2px 8px #D670AA, 0 0px 32px #fff' }} filter="url(#shadow)">
            <textPath href="#arcTextPath" startOffset="50%" textAnchor="middle">
              <tspan style={{
                background: 'rgba(255, 182, 193, 0.98)',
                borderRadius: '2rem',
                padding: '0.5rem 2rem',
                boxShadow: '0 4px 24px 0 rgba(255,182,193,0.25)',
                filter: 'none',
              }}>
                Shower Thoughts
              </tspan>
            </textPath>
          </text>
          {/* Decorative water droplets around the heading */}
          <ellipse cx="200" cy="140" rx="10" ry="20" fill="#aee7fa" opacity="0.7" />
          <ellipse cx="600" cy="140" rx="10" ry="20" fill="#aee7fa" opacity="0.7" />
          <ellipse cx="400" cy="80" rx="7" ry="14" fill="#aee7fa" opacity="0.5" />
          {/* Bubble foam (clusters of circles) */}
          <circle cx="140" cy="170" r="14" fill="#fff" opacity="0.7" />
          <circle cx="160" cy="175" r="8" fill="#fff" opacity="0.5" />
          <circle cx="180" cy="168" r="10" fill="#fff" opacity="0.6" />
          <circle cx="660" cy="170" r="14" fill="#fff" opacity="0.7" />
          <circle cx="680" cy="175" r="8" fill="#fff" opacity="0.5" />
          <circle cx="700" cy="168" r="10" fill="#fff" opacity="0.6" />
          <circle cx="400" cy="30" r="12" fill="#fff" opacity="0.4" />
          <circle cx="420" cy="38" r="7" fill="#fff" opacity="0.3" />
          <circle cx="380" cy="38" r="7" fill="#fff" opacity="0.3" />
        </svg>
      </div>
      {/* Thought display */}
      <div style={{
        position: 'absolute',
        top: '28%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
        minWidth: '320px',
        maxWidth: '90vw',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {showThought && (
          <div className={`thought-anim thought-anim-${anim}`} style={{
            background: 'rgba(255,255,255,0.92)',
            color: '#7b3f7b',
            borderRadius: '1.2rem',
            boxShadow: '0 4px 24px 0 rgba(200, 180, 255, 0.12)',
            fontFamily: 'Rubik Bubbles, cursive',
            fontSize: '2rem',
            fontWeight: 600,
            padding: '1.2rem 2.2rem',
            textAlign: 'center',
            letterSpacing: '0.02em',
            userSelect: 'none',
            minWidth: '240px',
            maxWidth: '90vw',
            transition: 'all 0.5s cubic-bezier(.68,-0.55,.27,1.55)',
            pointerEvents: 'none',
          }}>
            {thought}
          </div>
        )}
      </div>
      {/* Soap button in the center */}
      <div style={{
        position: 'absolute',
        top: '36%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <button
          className="button think-soap-btn"
          style={{
            background: 'linear-gradient(145deg, #ffe0f7 60%, #e0f7fa 100%)',
            border: '2px solid #222',
            borderRadius: '1.9rem',
            boxShadow: '0 6px 24px 0 rgba(200, 180, 255, 0.25), 0 2px 8px 0 #fff',
            color: '#D670AA',
            fontFamily: 'Rubik Bubbles, cursive',
            fontSize: '2.85rem',
            fontWeight: 700,
            padding: '2.09rem 4.75rem',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            outline: 'none',
            position: 'relative',
            transition: 'transform 0.1s',
            textShadow: '0 2px 8px #fff, 0 1px 0 #e0f7fa',
            boxSizing: 'border-box',
            userSelect: 'none',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          onClick={handleThink}
        >
          Think
        </button>
      </div>
      {/* Fullscreen white overlay for thought display */}
      {overlayVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'white',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: overlayActive ? 'auto' : 'none',
            opacity: overlayActive ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(.68,-0.55,.27,1.55)',
          }}
        >
          {showThought && (
            <div className={`thought-anim thought-anim-${anim}`} style={{
              color: '#7b3f7b',
              fontFamily: 'Rubik Bubbles, cursive',
              fontSize: '3.5rem', // much bigger
              fontWeight: 700,
              padding: '3.2rem 4.5rem',
              textAlign: 'center',
              letterSpacing: '0.02em',
              userSelect: 'none',
              maxWidth: '90vw',
              borderRadius: '2rem',
              boxShadow: '0 4px 24px 0 rgba(200, 180, 255, 0.12)',
              background: 'rgba(255,255,255,0.95)',
            }}>
              {thought}
            </div>
          )}
        </div>
      )}
      {/* Credits and music toggle buttons */}
      <div style={{
        position: 'fixed',
        bottom: '2.2rem',
        left: '2.2rem',
        zIndex: 3000,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.7rem',
      }}>
        <button
          className="button think-music-btn"
          onClick={handleToggleMusic}
          style={{ fontSize: '1.1rem', padding: '0.6rem 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label={musicMuted ? 'Unmute Lofi' : 'Mute Lofi'}
        >
          {musicMuted ? (
            // Muted icon
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D670AA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <path d="M9 9L5 13H2v-2h3l4-4v10l-4-4H2v-2h3l4-4" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            // Speaker icon
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D670AA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <path d="M9 9L5 13H2v-2h3l4-4v10l-4-4H2v-2h3l4-4" />
              <path d="M15 9.34a4 4 0 0 1 0 5.32" />
              <path d="M19 7a8 8 0 0 1 0 10" />
            </svg>
          )}
        </button>
        <button
          className="button"
          onClick={() => setShowCredits(true)}
          style={{ fontSize: '1.1rem', padding: '0.6rem 1.4rem' }}
        >
          Credits
        </button>
      </div>
      {showCredits && (
        <div className="modal credits-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255,255,255,0.96)',
          zIndex: 4000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            padding: '2.5rem 3.5rem',
            fontFamily: 'Inter, Arial, Helvetica, sans-serif',
            color: '#7b3f7b',
            fontSize: '1.5rem',
            textAlign: 'center',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative',
            background: 'none',
            boxShadow: 'none',
          }}>
            <div className="credits-modal-title">Credits</div>
            <div style={{ marginBottom: '1.5rem', fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontSize: '1.1rem', color: '#6d4c6d' }}>
              Designed & developed by Dirk Willemse<br/>
              3D model on Spline, UI/UX by Dirk Willemse<br/>
              Music: Music from #Uppbeat (free for Creators!):<br/>
              https://uppbeat.io/t/matrika/days-off<br/>
              License code: HG0WHB3NCAS0HXW1<br/>
              Font: Rubik Bubbles by Google Fonts<br/>
              Special thanks to Tracery, and the open source community!
            </div>
            <button
              className="button"
              onClick={() => setShowCredits(false)}
              style={{
                marginTop: '1.2rem',
                fontSize: '1.1rem',
                padding: '0.6rem 1.4rem',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Spline
        scene="https://prod.spline.design/bqOJ6SRoLKE9zxPp/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
        onLoad={handleSplineLoad}
      />
      {/* Animations for thought display */}
      <style>{`
        .thought-anim { opacity: 1; }
        .thought-anim-fade-in { animation: fadeInThought 0.7s; }
        .thought-anim-slide-up { animation: slideUpThought 0.7s; }
        .thought-anim-slide-down { animation: slideDownThought 0.7s; }
        .thought-anim-zoom-in { animation: zoomInThought 0.7s; }
        .thought-anim-flip { animation: flipThought 0.7s; }
        .thought-anim-bounce { animation: bounceThought 0.7s; }
        @keyframes fadeInThought { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpThought { from { opacity: 0; transform: translateY(60px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slideDownThought { from { opacity: 0; transform: translateY(-60px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes zoomInThought { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes flipThought { from { opacity: 0; transform: rotateY(90deg) scale(0.7); } to { opacity: 1; transform: rotateY(0deg) scale(1); } }
        @keyframes bounceThought { 0% { opacity: 0; transform: scale(0.7); } 60% { opacity: 1; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }

        .think-soap-btn {
          position: relative;
          overflow: hidden;
        }
        .think-soap-btn::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.7) 40%, rgba(224,247,250,0.5) 70%, rgba(255,224,247,0.3) 100%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.7;
          pointer-events: none;
          transition: none;
        }
        .think-soap-btn:hover::after {
          animation: soapRipple 0.7s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes soapRipple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.7;
          }
          60% {
            width: 220%;
            height: 220%;
            opacity: 0.5;
          }
          100% {
            width: 220%;
            height: 220%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 