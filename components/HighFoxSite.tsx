"use client"
// HighfoxSite.tsx — Complete website
// React + Framer Motion + Recharts. Zero emojis — all inline SVG icons.

import { motion, useAnimationFrame, useInView, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import Image from "next/image"

function useBreakpoint() {
    const [width, setWidth] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1200)
    useEffect(() => {
        const handler = () => setWidth(window.innerWidth)
        window.addEventListener("resize", handler)
        return () => window.removeEventListener("resize", handler)
    }, [])
    return { isMobile: width < 768, isTablet: width >= 768 && width <= 1024, isDesktop: width > 1024 }
}

function injectFont() {
    if (typeof document === "undefined") return
    if (document.getElementById("hf-font")) return
    const tag = document.createElement("style")
    tag.id = "hf-font"
    tag.textContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');`
    document.head.appendChild(tag)
}

function FadeIn({ children, delay = 0, y = 28, style = {} }: { children: React.ReactNode; delay?: number; y?: number; style?: CSSProperties }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })
    const { isMobile } = useBreakpoint()
    const effectiveY = isMobile ? Math.round(y * 0.5) : y
    return (
        <motion.div ref={ref} style={style} initial={{ opacity: 0, y: effectiveY }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}>
            {children}
        </motion.div>
    )
}

// ─── SVG ICON LIBRARY ─────────────────────────────────────────────────────────
const IC = {
    Lightning: ({ s = 14, c = "#555" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Scale:     ({ s = 14, c = "#555" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12l9-9 9 9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10l-2 5a4 4 0 008 0L9 10M15 10l-2 5a4 4 0 008 0l-2-5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    Brain:     ({ s = 14, c = "#555" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><ellipse cx="9" cy="12" rx="5" ry="7" stroke={c} strokeWidth="1.8"/><path d="M14 8a5 5 0 010 8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M9 5v14" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    Rocket:    ({ s = 14, c = "#555" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2S7 7 7 13a5 5 0 0010 0c0-6-5-11-5-11z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="13" r="2" stroke={c} strokeWidth="1.8"/><path d="M7 18l-2 3M17 18l2 3" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    Gear:      ({ s = 14, c = "#555" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={c} strokeWidth="1.8"/></svg>,
    Users:     ({ s = 14, c = "#555" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke={c} strokeWidth="1.8"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    Chat:      ({ s = 14, c = "#555" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
    // Domain icons
    UPI:       ({ s = 26, c = "#111" }) => <svg width={s} height={s} viewBox="0 0 32 32" fill="none"><rect x="3" y="7" width="26" height="18" rx="3" stroke={c} strokeWidth="2"/><path d="M3 13h26" stroke={c} strokeWidth="2"/><path d="M8 20h5M21 20h3" stroke={c} strokeWidth="2" strokeLinecap="round"/><circle cx="8" cy="10" r="1.5" fill={c} opacity="0.4"/></svg>,
    Card:      ({ s = 26, c = "#111" }) => <svg width={s} height={s} viewBox="0 0 32 32" fill="none"><rect x="3" y="8" width="26" height="16" rx="3" stroke={c} strokeWidth="2"/><path d="M3 14h26" stroke={c} strokeWidth="2"/><rect x="7" y="18" width="7" height="3" rx="1" stroke={c} strokeWidth="1.5"/></svg>,
    Coin:      ({ s = 26, c = "#111" }) => <svg width={s} height={s} viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="12" stroke={c} strokeWidth="2"/><path d="M16 9v14M12 12c0-1.66 1.79-3 4-3s4 1.34 4 3-1.79 3-4 3-4 1.34-4 3 1.79 3 4 3 4-1.34 4-3" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
    Gift:      ({ s = 26, c = "#111" }) => <svg width={s} height={s} viewBox="0 0 32 32" fill="none"><rect x="4" y="13" width="24" height="15" rx="2" stroke={c} strokeWidth="2"/><path d="M28 13H4v-4a1 1 0 011-1h22a1 1 0 011 1v4zM16 13V28M16 9s-4-6-8 0M16 9s4-6 8 0" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
    // Who we work with
    Office:    ({ s = 26, c = "#111" }) => <svg width={s} height={s} viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="14" height="24" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M18 11h8v17H18" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M8 9h6M8 14h6M8 19h6M22 16h2M22 21h2" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M11 28v-4h4v4" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
    Pillars:   ({ s = 26, c = "#111" }) => <svg width={s} height={s} viewBox="0 0 32 32" fill="none"><path d="M4 12h24M16 4L4 12h24L16 4z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v12M12 12v12M20 12v12M26 12v12M4 24h24" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
    TrendUp:   ({ s = 26, c = "#111" }) => <svg width={s} height={s} viewBox="0 0 32 32" fill="none"><path d="M4 24l8-8 6 4 10-12" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 8h6v6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Zap:       ({ s = 26, c = "#111" }) => <svg width={s} height={s} viewBox="0 0 32 32" fill="none"><path d="M18 4L8 18h8l-2 10 14-16h-8l2-8z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    // Misc
    Check:     ({ c = "white" }) => <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Arrow:     ({ s = 15, c = "white" }) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    LinkedIn:  ({ s = 15, c = "white" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" stroke={c} strokeWidth="1.8"/><path d="M7 10v7M7 7v.01M11 17v-3.5A2.5 2.5 0 0116 17M11 10v7" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Quote:     ({ s = 30, c = "#111" }) => <svg width={s} height={s*0.75} viewBox="0 0 32 24" fill="none"><path d="M0 24V14.4C0 6.4 4.267 1.6 12.8 0l1.6 2.4C9.6 3.6 7.2 6.267 6.4 10.4H12.8V24H0zm19.2 0V14.4C19.2 6.4 23.467 1.6 32 0l1.6 2.4C28.8 3.6 26.4 6.267 25.6 10.4H32V24H19.2z" fill={c}/></svg>,
}

// ─── RIPPLE ───────────────────────────────────────────────────────────────────
const RC = 5, RD = 5500, RS = 1100, RXS = 80, RXE = 900
const ew = (t: number) => 1 - Math.pow(1-t, 1.5)
const rv = (prog: number) => {
    const p = ew(prog), rx = RXS + (RXE-RXS)*p
    const o = prog < 0.05 ? prog/0.05 : prog < 0.30 ? 1 : Math.pow(1-(prog-0.30)/0.70, 1.4)
    return { rx, opacity: Math.max(0,o), p }
}
function RippleSVG() {
    const shouldReduceMotion = useReducedMotion()
    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const el = useRef(0)
    const frameBucket = useRef(0)
    const ringCount = isSmallScreen ? 3 : RC
    const ringSpacing = RD / ringCount
    const blurEnabled = !isSmallScreen && !shouldReduceMotion
    const frameIntervalMs = isSmallScreen ? 50 : 33
    const [rings, setRings] = useState(() => Array.from({length:ringCount},(_,i)=>rv(((i*ringSpacing)%RD)/RD)))

    useEffect(() => {
        const onResize = () => setIsSmallScreen(window.innerWidth < 900)
        onResize()
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    useEffect(() => {
        setRings(Array.from({length:ringCount},(_,i)=>rv(((i*ringSpacing)%RD)/RD)))
    }, [ringCount, ringSpacing])

    useAnimationFrame((_,d) => {
        if (shouldReduceMotion) return
        el.current += d
        frameBucket.current += d
        if (frameBucket.current < frameIntervalMs) return
        frameBucket.current = 0
        setRings(Array.from({length:ringCount},(_,i)=>rv(((el.current+i*ringSpacing)%RD)/RD)))
    })

    const W=1800,H=1800,CX=900,CY=900
    const blurs: Record<string,[number,number,number]> = { fc:[4,7,11], fs:[6,11,17], fo:[9,16,24] }
    return (
        <div style={{position:"absolute",top:"58%",left:"50%",transform:"translate(-50%,-50%)",width:"150%",pointerEvents:"none",zIndex:2}}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block",transformOrigin:"50% 50%",transform:"perspective(600px) rotateX(58deg)",overflow:"visible"}}>
            {blurEnabled ? <defs>{Object.entries(blurs).map(([id,vals])=>["sm","md","lg"].map((s,j)=><filter key={`${id}-${s}`} id={`${id}-${s}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={vals[j]}/></filter>))}</defs> : null}
            {rings.map((r,i)=>{
                const {rx,opacity,p}=r,sz=rx<300?"sm":rx<620?"md":"lg"
                const h=Math.max(3,22*(1-p*0.75)),sv=p*p*0.14,cv=Math.pow(1-p*0.60,0.7)
                return <g key={i} opacity={opacity}>
                    <circle cx={CX} cy={CY} r={rx*1.02} fill="none" stroke={`rgba(150,148,145,${0.04+sv*1.2})`} strokeWidth={h*(1.4+p*1.8)} filter={blurEnabled ? `url(#fo-${sz})` : undefined}/>
                    <circle cx={CX} cy={CY} r={rx*0.97} fill="none" stroke={`rgba(0,0,0,${0.02+sv})`} strokeWidth={h*(1+p*1.4)} filter={blurEnabled ? `url(#fs-${sz})` : undefined}/>
                    <circle cx={CX} cy={CY} r={rx} fill="none" stroke={`rgba(255,255,255,${0.96*cv})`} strokeWidth={h*0.7} filter={blurEnabled ? `url(#fc-${sz})` : undefined}/>
                    <circle cx={CX} cy={CY} r={rx*1.003} fill="none" stroke={`rgba(255,255,255,${0.70*cv})`} strokeWidth={Math.max(2,h*0.25)} filter={blurEnabled ? `url(#fc-${sz})` : undefined}/>
                </g>
            })}
        </svg></div>
    )
}

// ─── ORB ──────────────────────────────────────────────────────────────────────
function OrbSphere() {
    const { isMobile } = useBreakpoint()
    const b1=useRef<HTMLDivElement>(null),b2=useRef<HTMLDivElement>(null),g1=useRef<HTMLDivElement>(null),g2=useRef<HTMLDivElement>(null)
    const size = isMobile ? 180 : 320
    const marginL = -size/2
    const marginT = isMobile ? -120 : -210
    return (
        <motion.div style={{position:"absolute",zIndex:10,top:"50%",left:"50%",width:size,height:size,marginLeft:marginL,marginTop:marginT,willChange:"transform"}}
            animate={{y:[0,-18,0]}} transition={{duration:2.2,repeat:Infinity,ease:"easeInOut"}}
            onUpdate={(l)=>{const t=(-(l.y as number))/18;if(b1.current)b1.current.style.top=`${46+t*7}%`;if(b2.current)b2.current.style.top=`${58+t*6}%`;if(g1.current)g1.current.style.top=`${53+t*6}%`;if(g2.current)g2.current.style.top=`${64+t*5}%`}}>
            <div style={{width:"100%",height:"100%",borderRadius:"50%",position:"relative",overflow:"hidden",background:"#fafafa",boxShadow:"0 0 0 1px rgba(180,178,175,.20),0 12px 40px rgba(0,0,0,.07),0 30px 80px rgba(0,0,0,.05),inset 0 -20px 50px rgba(0,0,0,.05),inset 1px 2px 8px rgba(255,255,255,.80)",filter:"blur(.4px)"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:"62%",borderRadius:"50% 50% 40% 40%/55% 55% 45% 45%",background:"radial-gradient(ellipse 100% 100% at 50% 0%,#c2c2c2 0%,#d2d2d2 14%,#e2e2e2 28%,#eee 44%,#f5f5f5 58%,transparent 78%)",filter:"blur(8px)",pointerEvents:"none"}}/>
                <div style={{position:"absolute",top:"12%",left:"18%",width:"30%",height:"16%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(255,255,255,.70) 0%,rgba(255,255,255,.30) 45%,transparent 80%)",transform:"rotate(-25deg)",filter:"blur(6px)",pointerEvents:"none"}}/>
                <div ref={b1} style={{position:"absolute",top:"46%",left:"-8%",width:"116%",height:"9%",borderRadius:"50%",background:"radial-gradient(ellipse 90% 100% at 50% 50%,rgba(255,255,255,.90) 0%,rgba(255,255,255,.60) 40%,rgba(255,255,255,.15) 70%,transparent 90%)",filter:"blur(5px)",pointerEvents:"none"}}/>
                <div ref={g1} style={{position:"absolute",top:"53%",left:"-5%",width:"110%",height:"7%",borderRadius:"50%",background:"radial-gradient(ellipse 85% 100% at 50% 50%,rgba(160,160,160,.18) 0%,rgba(160,160,160,.06) 55%,transparent 80%)",filter:"blur(6px)",pointerEvents:"none"}}/>
                <div ref={b2} style={{position:"absolute",top:"58%",left:"-5%",width:"110%",height:"8%",borderRadius:"50%",background:"radial-gradient(ellipse 80% 100% at 50% 50%,rgba(255,255,255,.70) 0%,rgba(255,255,255,.35) 45%,transparent 75%)",filter:"blur(6px)",pointerEvents:"none"}}/>
                <div ref={g2} style={{position:"absolute",top:"64%",left:"5%",width:"90%",height:"6%",borderRadius:"50%",background:"radial-gradient(ellipse 75% 100% at 50% 50%,rgba(150,150,150,.12) 0%,transparent 75%)",filter:"blur(7px)",pointerEvents:"none"}}/>
                <div style={{position:"absolute",inset:0,borderRadius:"50%",boxShadow:"inset 0 0 30px 10px rgba(0,0,0,.05),inset 0 0 60px 20px rgba(0,0,0,.03)",pointerEvents:"none"}}/>
            </div>
            <div style={{position:"absolute",bottom:-18,left:"50%",transform:"translateX(-50%)",width:"85%",height:22,background:"radial-gradient(ellipse,rgba(0,0,0,.22) 0%,rgba(0,0,0,.08) 50%,transparent 75%)",filter:"blur(10px)",borderRadius:"50%"}}/>
        </motion.div>
    )
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Badge({ label, Icon }: { label: string; Icon: any }) {
    return (
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.85)",border:"1px solid rgba(0,0,0,.08)",borderRadius:100,padding:"6px 14px 6px 10px",backdropFilter:"blur(8px)",boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            <Icon s={13} c="#666"/><span style={{fontSize:11,fontWeight:600,letterSpacing:"0.12em",color:"#555",textTransform:"uppercase" as const}}>{label}</span>
        </div>
    )
}
function Card({ children, style={}, hover=true }: { children:React.ReactNode; style?:CSSProperties; hover?:boolean }) {
    const { isMobile } = useBreakpoint()
    return (
        <motion.div style={{background:"rgba(255,255,255,.72)",border:"1px solid rgba(0,0,0,.06)",borderRadius:20,padding:isMobile?20:32,backdropFilter:"blur(8px)",boxShadow:"0 2px 20px rgba(0,0,0,.04)",height:"100%",boxSizing:"border-box",...style}}
            whileHover={hover?{y:-4,boxShadow:"0 8px 32px rgba(0,0,0,.08)"}:{}} transition={{duration:.25}}>{children}
        </motion.div>
    )
}
function IBox({ Icon, dark=false }: { Icon:any; dark?:boolean }) {
    return <div style={{width:50,height:50,borderRadius:13,background:dark?"#111":"rgba(0,0,0,.05)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,flexShrink:0}}><Icon s={22} c={dark?"#fff":"#222"}/></div>
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
    const { isMobile } = useBreakpoint()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navLinks = ["Expertise","How We Work","Products","Who We Work With","Founder"]
    return (
        <>
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"0 20px":"0 44px",height:62,background:"rgba(248,247,245,.88)",backdropFilter:"blur(14px)",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
            <a href="#" style={{display:"flex",alignItems:"center",gap:9,fontWeight:700,fontSize:16,color:"#0d0d0d",textDecoration:"none",letterSpacing:"-0.02em",fontFamily:"'DM Serif Display', serif"}}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect width="26" height="26" rx="5" fill="#111"/><path d="M7 13L11 9L15 13L11 17Z" fill="white"/><path d="M12 13L16 9L20 13L16 17Z" fill="white" opacity={0.5}/></svg>
                Highfox
            </a>
            {!isMobile && (
                <ul style={{display:"flex",alignItems:"center",gap:32,listStyle:"none",margin:0,padding:0}}>
                    {navLinks.map(i=><li key={i}><a href="#" style={{fontSize:14,fontWeight:400,color:"#555",textDecoration:"none"}}>{i}</a></li>)}
                </ul>
            )}
            {!isMobile && (
                <motion.button style={{background:"#111",color:"#fff",border:"none",borderRadius:10,padding:"9px 20px",fontSize:14,fontWeight:500,fontFamily:"inherit",cursor:"pointer",minHeight:44}} whileHover={{opacity:.82}} whileTap={{scale:.97}}>Start a Conversation</motion.button>
            )}
            {isMobile && (
                <motion.button onClick={()=>setDrawerOpen(true)} style={{background:"none",border:"none",cursor:"pointer",padding:8,minHeight:44,display:"flex",alignItems:"center",justifyContent:"center"}} whileTap={{scale:.92}}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="#111" strokeWidth="2" strokeLinecap="round"/></svg>
                </motion.button>
            )}
        </nav>
        {isMobile && (
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: drawerOpen ? 0 : "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{position:"fixed",top:0,right:0,bottom:0,width:"80vw",maxWidth:320,background:"#fff",zIndex:300,boxShadow:"-8px 0 40px rgba(0,0,0,.12)",display:"flex",flexDirection:"column",padding:"24px 28px",gap:0}}
            >
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
                    <a href="#" style={{display:"flex",alignItems:"center",gap:9,fontWeight:700,fontSize:16,color:"#0d0d0d",textDecoration:"none",fontFamily:"'DM Serif Display', serif"}}>
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect width="26" height="26" rx="5" fill="#111"/><path d="M7 13L11 9L15 13L11 17Z" fill="white"/><path d="M12 13L16 9L20 13L16 17Z" fill="white" opacity={0.5}/></svg>
                        Highfox
                    </a>
                    <motion.button onClick={()=>setDrawerOpen(false)} style={{background:"none",border:"none",cursor:"pointer",padding:8,minHeight:44,display:"flex",alignItems:"center",justifyContent:"center"}} whileTap={{scale:.92}}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="#111" strokeWidth="2" strokeLinecap="round"/></svg>
                    </motion.button>
                </div>
                {navLinks.map(i=>(
                    <a key={i} href="#" onClick={()=>setDrawerOpen(false)} style={{fontSize:18,fontWeight:400,color:"#111",textDecoration:"none",padding:"14px 0",borderBottom:"1px solid rgba(0,0,0,.06)",fontFamily:"'DM Sans', sans-serif"}}>{i}</a>
                ))}
                <motion.button style={{background:"#111",color:"#fff",border:"none",borderRadius:12,padding:"14px 20px",fontSize:15,fontWeight:500,fontFamily:"inherit",cursor:"pointer",marginTop:32,minHeight:44}} whileHover={{opacity:.82}} whileTap={{scale:.97}}>Start a Conversation</motion.button>
            </motion.div>
        )}
        {isMobile && drawerOpen && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setDrawerOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",zIndex:299}}/>
        )}
        </>
    )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroContent() {
    const { isMobile } = useBreakpoint()
    const ct={hidden:{},visible:{transition:{staggerChildren:.1,delayChildren:.25}}}
    const it={hidden:{opacity:0,y:isMobile?11:22},visible:{opacity:1,y:0,transition:{duration:.75,ease:[.22,1,.36,1]}}}
    return (
        <motion.div style={{position:"relative",zIndex:20,display:"flex",flexDirection:"column",alignItems:"center",gap:18,textAlign:"center",marginTop:20,padding:isMobile?"0 20px":0}} variants={ct} initial="hidden" animate="visible">
            <motion.div variants={it} style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.84)",border:"1px solid rgba(0,0,0,.09)",borderRadius:100,padding:"7px 16px 7px 12px",backdropFilter:"blur(10px)"}}>
                <IC.Lightning s={12} c="#666"/><span style={{fontSize:11,fontWeight:500,letterSpacing:"0.13em",textTransform:"uppercase" as const,color:"#2a2a2a"}}>Fintech Product Builders</span>
            </motion.div>
            <motion.h1 variants={it} style={{fontSize:isMobile?"clamp(36px, 9vw, 56px)":"clamp(44px, 7vw, 80px)",fontWeight:400,fontFamily:"'DM Serif Display', serif",letterSpacing:"-0.03em",lineHeight:1.05,color:"#111",margin:0,maxWidth:700}}>
                We don't consult.<br /><em>We build fintech</em><br />products that scale.
            </motion.h1>
            <motion.p variants={it} style={{fontSize:isMobile?14:16,color:"#606060",maxWidth:500,lineHeight:1.6,margin:0}}>
                Built by operators behind India's largest fintech products — UPI apps handling 500M+ monthly transactions, credit cards at national scale.
            </motion.p>
            <motion.div variants={it} style={{display:"flex",flexDirection:isMobile?"column":"row",gap:10,width:isMobile?"100%":"auto"}}>
                <motion.button style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,background:"#111",color:"#fff",border:"none",borderRadius:12,padding:"13px 26px",fontSize:14,fontWeight:500,fontFamily:"inherit",cursor:"pointer",boxShadow:"0 4px 18px rgba(0,0,0,.22)",minHeight:44}} whileHover={{opacity:.86,y:-2}} whileTap={{scale:.97}}>
                    Check if we can build together <IC.Arrow s={14} c="white"/>
                </motion.button>
                <motion.button style={{display:"inline-flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.72)",color:"#111",border:"1px solid rgba(0,0,0,.12)",borderRadius:12,padding:"13px 26px",fontSize:14,fontWeight:500,fontFamily:"inherit",cursor:"pointer",backdropFilter:"blur(10px)",minHeight:44}} whileHover={{backgroundColor:"rgba(255,255,255,.96)",y:-2}} whileTap={{scale:.97}}>
                    Our Expertise
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

// ─── CREDIBILITY STRIP ────────────────────────────────────────────────────────
function CredibilityStrip() {
    const { isMobile } = useBreakpoint()
    const stats=[
        {num:"500M+",label:"UPI transactions monthly",I:IC.UPI},
        {num:"#1",label:"Monthly credit card issuance",I:IC.Card},
        {num:"₹100s Cr",label:"Loans disbursed monthly",I:IC.Coin},
        {num:"1",label:"Product at a time. Always.",I:IC.Zap},
    ]
    return (
        <section style={{background:"#111",padding:isMobile?"44px 20px":"44px 80px"}}>
            <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:isMobile?24:40}}>
                {stats.map((s,i)=>(
                    <FadeIn key={i} delay={i*.08}>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:10}}>
                            <div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center"}}><s.I s={20} c="rgba(255,255,255,.45)"/></div>
                            <div style={{fontSize:isMobile?26:34,fontWeight:700,color:"#fff",fontFamily:"'DM Serif Display', serif",letterSpacing:"-0.03em",lineHeight:1}}>{s.num}</div>
                            <div style={{fontSize:12,color:"rgba(255,255,255,.38)",letterSpacing:"0.02em"}}>{s.label}</div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>
    )
}

// ─── FOUNDER QUOTE ────────────────────────────────────────────────────────────
function FounderQuote() {
    const { isMobile } = useBreakpoint()
    return (
        <section style={{background:"#f8f7f5",padding:isMobile?"60px 20px":"100px 80px",textAlign:"center"}}>
            <FadeIn>
                <div style={{opacity:.15,marginBottom:24}}><IC.Quote s={32} c="#111"/></div>
                <p style={{fontSize:isMobile?"clamp(18px, 5vw, 28px)":"clamp(22px, 3vw, 34px)",fontFamily:"'DM Serif Display', serif",fontWeight:400,color:"#2a2a2a",maxWidth:820,margin:"0 auto",lineHeight:1.5,letterSpacing:"-0.02em"}}>
                    Great fintech products are not designed in workshops. They are built through <em>deep focus</em> and operator experience.
                </p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:36}}>
                    <div style={{width:44,height:44,borderRadius:"50%",border:"2px solid rgba(0,0,0,.08)",overflow:"hidden",position:"relative"}}>
                        <Image src="/Rahul.jpeg" alt="Rahul" fill style={{objectFit:"cover"}} sizes="44px"/>
                    </div>
                    <div style={{textAlign:"left"}}><div style={{fontSize:14,fontWeight:600,color:"#111"}}>Rahul</div><div style={{fontSize:13,color:"#888"}}>Founder, Highfox</div></div>
                </div>
            </FadeIn>
        </section>
    )
}

// ─── WHY DIFFERENT ────────────────────────────────────────────────────────────
function WhyDifferent() {
    const { isMobile } = useBreakpoint()
    const trad=["Strategy decks","Multiple parallel clients","Advisory ownership","Diluted attention","Workshops & frameworks"]
    const hfox=["Embedded product leadership","One engagement at a time","Outcome ownership","Execution-first always","Build alongside your team"]
    return (
        <section style={{background:"#f0efed",padding:isMobile?"60px 20px":"100px 80px"}}>
            <div style={{maxWidth:1100,margin:"0 auto"}}>
                <FadeIn><div style={{textAlign:"center",marginBottom:64}}>
                    <Badge label="What Makes Us Different" Icon={IC.Scale}/>
                    <h2 style={{fontSize:isMobile?"clamp(29px,7vw,48px)":"clamp(36px,5vw,60px)",fontFamily:"'DM Serif Display', serif",fontWeight:400,letterSpacing:"-0.03em",color:"#111",marginTop:20,marginBottom:12}}>Not consultants.<br/><em>Product builders.</em></h2>
                </div></FadeIn>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:24}}>
                    {isMobile ? (
                        <>
                        <FadeIn delay={.1}><Card style={{background:"#111",borderColor:"transparent"}} hover={false}>
                            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",color:"rgba(255,255,255,.28)",textTransform:"uppercase" as const,marginBottom:24}}>Highfox</div>
                            {hfox.map((h,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                                <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><IC.Check c="white"/></div>
                                <span style={{fontSize:14,color:"rgba(255,255,255,.85)"}}>{h}</span>
                            </div>)}
                        </Card></FadeIn>
                        <FadeIn delay={.2}><Card style={{background:"rgba(255,255,255,.45)",borderColor:"rgba(0,0,0,.05)"}} hover={false}>
                            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",color:"#ccc",textTransform:"uppercase" as const,marginBottom:24}}>Traditional Consulting</div>
                            {trad.map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                                <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,.04)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><IC.Check c="#ddd"/></div>
                                <span style={{fontSize:14,color:"#bbb",textDecoration:"line-through",textDecorationColor:"rgba(0,0,0,.12)"}}>{t}</span>
                            </div>)}
                        </Card></FadeIn>
                        </>
                    ) : (
                        <>
                        <FadeIn delay={.1}><Card style={{background:"rgba(255,255,255,.45)",borderColor:"rgba(0,0,0,.05)"}} hover={false}>
                            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",color:"#ccc",textTransform:"uppercase" as const,marginBottom:24}}>Traditional Consulting</div>
                            {trad.map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                                <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,.04)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><IC.Check c="#ddd"/></div>
                                <span style={{fontSize:15,color:"#bbb",textDecoration:"line-through",textDecorationColor:"rgba(0,0,0,.12)"}}>{t}</span>
                            </div>)}
                        </Card></FadeIn>
                        <FadeIn delay={.2}><Card style={{background:"#111",borderColor:"transparent"}} hover={false}>
                            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",color:"rgba(255,255,255,.28)",textTransform:"uppercase" as const,marginBottom:24}}>Highfox</div>
                            {hfox.map((h,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                                <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><IC.Check c="white"/></div>
                                <span style={{fontSize:15,color:"rgba(255,255,255,.85)"}}>{h}</span>
                            </div>)}
                        </Card></FadeIn>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

// ─── EXPERTISE ────────────────────────────────────────────────────────────────
function Expertise() {
    const { isMobile } = useBreakpoint()
    const dom=[
        {I:IC.UPI, title:"UPI", desc:"Designing and scaling high-throughput payment experiences handling hundreds of millions of monthly transactions.", dark:true},
        {I:IC.Card, title:"Credit Cards", desc:"Building acquisition, underwriting, onboarding, and engagement systems for mass-scale issuance.", dark:false},
        {I:IC.Coin, title:"Loans", desc:"End-to-end lending journeys — from risk orchestration to disbursal and lifecycle management.", dark:false},
        {I:IC.Gift, title:"Rewards & Engagement", desc:"Creating habit-forming reward ecosystems that drive retention and transaction growth.", dark:false},
    ]
    return (
        <section style={{background:"#f8f7f5",padding:isMobile?"60px 20px":"100px 80px"}}>
            <div style={{maxWidth:1100,margin:"0 auto"}}>
                <FadeIn><div style={{textAlign:"center",marginBottom:60}}>
                    <Badge label="Expertise" Icon={IC.Brain}/>
                    <h2 style={{fontSize:isMobile?"clamp(29px,7vw,46px)":"clamp(36px,5vw,58px)",fontFamily:"'DM Serif Display', serif",fontWeight:400,letterSpacing:"-0.03em",color:"#111",marginTop:20,marginBottom:12}}>Deep Fintech<br/><em>Product Expertise</em></h2>
                    <p style={{fontSize:isMobile?14:16,color:"#777",maxWidth:480,margin:"0 auto"}}>Four domains. Decades of operator experience. One product at a time.</p>
                </div></FadeIn>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:20}}>
                    {dom.map((d,i)=><FadeIn key={i} delay={i*.1}><Card>
                        <IBox Icon={d.I} dark={d.dark}/>
                        <div style={{fontSize:20,fontWeight:600,color:"#111",marginBottom:10,fontFamily:"'DM Serif Display', serif",letterSpacing:"-0.02em"}}>{d.title}</div>
                        <p style={{fontSize:isMobile?14:15,color:"#666",lineHeight:1.6,margin:0}}>{d.desc}</p>
                    </Card></FadeIn>)}
                </div>
            </div>
        </section>
    )
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const smData=[{m:"Jan",v:320},{m:"Feb",v:360},{m:"Mar",v:390},{m:"Apr",v:420},{m:"May",v:460},{m:"Jun",v:500}]
const fpData=[{m:"Jan",v:3},{m:"Feb",v:4.5},{m:"Mar",v:6},{m:"Apr",v:7.5},{m:"May",v:9},{m:"Jun",v:10}]

function ProductsBuilt() {
    const { isMobile } = useBreakpoint()
    const prods=[
        {name:"Super.money",tag:"Payments & Engagement",desc:"Built scalable payment and engagement experiences focused on high-frequency transaction behaviour.",data:smData,unit:"M txns",chartLabel:"Monthly transaction volume (millions)",m1:"500M+",m1l:"Monthly transactions",m2:"Top 5",m2l:"UPI app in India"},
        {name:"FamPay",tag:"Next-Gen Fintech",desc:"Designed fintech experiences for next-gen users, combining payments, cards, and engagement into a unified product.",data:fpData,unit:"M users",chartLabel:"User growth trajectory (millions)",m1:"10M+",m1l:"Users onboarded",m2:"#1",m2l:"Teen fintech product"},
    ]
    return (
        <section style={{background:"#f0efed",padding:isMobile?"60px 20px":"100px 80px"}}>
            <div style={{maxWidth:1100,margin:"0 auto"}}>
                <FadeIn><div style={{textAlign:"center",marginBottom:60}}>
                    <Badge label="Products" Icon={IC.Rocket}/>
                    <h2 style={{fontSize:isMobile?"clamp(29px,7vw,46px)":"clamp(36px,5vw,58px)",fontFamily:"'DM Serif Display', serif",fontWeight:400,letterSpacing:"-0.03em",color:"#111",marginTop:20,marginBottom:12}}>Operator Experience<br/><em>That Ships</em></h2>
                </div></FadeIn>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:24}}>
                    {prods.map((p,i)=>(
                        <FadeIn key={i} delay={i*.15}>
                            <Card style={{padding:0,overflow:"hidden"}}>
                                <div style={{padding:isMobile?"20px 20px 16px":"32px 32px 20px"}}>
                                    <div style={{display:"inline-block",fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:"#888",background:"rgba(0,0,0,.05)",borderRadius:6,padding:"4px 10px",marginBottom:16,textTransform:"uppercase" as const}}>{p.tag}</div>
                                    <h3 style={{fontSize:isMobile?22:26,fontFamily:"'DM Serif Display', serif",fontWeight:400,letterSpacing:"-0.02em",color:"#111",margin:"0 0 12px"}}>{p.name}</h3>
                                    <p style={{fontSize:14,color:"#666",lineHeight:1.6,margin:0}}>{p.desc}</p>
                                </div>
                                <div style={{padding:"0 20px 4px"}}>
                                    <div style={{fontSize:10,color:"#bbb",letterSpacing:"0.08em",textTransform:"uppercase" as const,marginBottom:6,paddingLeft:12}}>{p.chartLabel}</div>
                                    <ResponsiveContainer width="100%" height={isMobile?80:110}>
                                        <BarChart data={p.data} barCategoryGap="28%">
                                            <XAxis dataKey="m" tick={{fontSize:10,fill:"#ccc"}} axisLine={false} tickLine={false}/>
                                            <YAxis hide/>
                                            <Tooltip contentStyle={{background:"#fff",border:"1px solid rgba(0,0,0,.07)",borderRadius:8,fontSize:12,boxShadow:"0 4px 12px rgba(0,0,0,.07)"}} cursor={{fill:"rgba(0,0,0,.02)"}} formatter={(v:any)=>[`${v} ${p.unit}`,""]}/>
                                            <Bar dataKey="v" radius={[3,3,0,0]}>
                                                {p.data.map((_,j)=><Cell key={j} fill={j===p.data.length-1?"#111":`rgba(0,0,0,${0.06+j*0.025})`}/>)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{borderTop:"1px solid rgba(0,0,0,.06)",display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                                    <div style={{padding:isMobile?"14px 16px":"18px 28px",borderRight:"1px solid rgba(0,0,0,.06)"}}>
                                        <div style={{fontSize:isMobile?20:24,fontWeight:700,color:"#111",fontFamily:"'DM Serif Display', serif",letterSpacing:"-0.03em"}}>{p.m1}</div>
                                        <div style={{fontSize:11,color:"#aaa",marginTop:3}}>{p.m1l}</div>
                                    </div>
                                    <div style={{padding:isMobile?"14px 16px":"18px 28px"}}>
                                        <div style={{fontSize:isMobile?20:24,fontWeight:700,color:"#111",fontFamily:"'DM Serif Display', serif",letterSpacing:"-0.03em"}}>{p.m2}</div>
                                        <div style={{fontSize:11,color:"#aaa",marginTop:3}}>{p.m2l}</div>
                                    </div>
                                </div>
                            </Card>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─── HOW WE WORK ─────────────────────────────────────────────────────────────
function HowWeWork() {
    const { isMobile } = useBreakpoint()
    const steps=[
        {n:"01",t:"We pick one product",d:"A deliberate decision to work on only your product. No parallel engagements. Ever.",I:IC.Coin},
        {n:"02",t:"We embed deeply",d:"We join your team as operators, not advisors. In the trenches, not in boardrooms.",I:IC.Users},
        {n:"03",t:"We build alongside you",d:"Hands-on product leadership — from strategy to execution to shipping.",I:IC.Zap},
        {n:"04",t:"We stay until it works",d:"Our engagement ends when the product succeeds, not when the retainer does.",I:IC.TrendUp},
    ]
    return (
        <section style={{background:"#f8f7f5",padding:isMobile?"60px 20px":"100px 80px"}}>
            <div style={{maxWidth:1100,margin:"0 auto"}}>
                <FadeIn><div style={{textAlign:"center",marginBottom:60}}>
                    <Badge label="Process" Icon={IC.Gear}/>
                    <h2 style={{fontSize:isMobile?"clamp(29px,7vw,46px)":"clamp(36px,5vw,58px)",fontFamily:"'DM Serif Display', serif",fontWeight:400,letterSpacing:"-0.03em",color:"#111",marginTop:20,marginBottom:12}}>Our Model<br/><em>Is Simple</em></h2>
                    <p style={{fontSize:isMobile?14:16,color:"#777",maxWidth:480,margin:"0 auto"}}>No parallel clients. No diluted attention. No advisory-only engagements.</p>
                </div></FadeIn>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:20}}>
                    {steps.map((s,i)=><FadeIn key={i} delay={i*.1}><Card>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                            <div style={{fontSize:40,fontFamily:"'DM Serif Display', serif",fontWeight:400,color:"rgba(0,0,0,.08)",letterSpacing:"-0.04em",lineHeight:1}}>{s.n}</div>
                            <div style={{width:36,height:36,borderRadius:10,background:"rgba(0,0,0,.04)",display:"flex",alignItems:"center",justifyContent:"center"}}><s.I s={18} c="#555"/></div>
                        </div>
                        <div style={{width:"100%",height:1,background:"rgba(0,0,0,.06)",marginBottom:20}}/>
                        <h3 style={{fontSize:18,fontWeight:600,color:"#111",margin:"0 0 10px",letterSpacing:"-0.02em"}}>{s.t}</h3>
                        <p style={{fontSize:14,color:"#777",lineHeight:1.6,margin:0}}>{s.d}</p>
                    </Card></FadeIn>)}
                </div>
            </div>
        </section>
    )
}

// ─── WHO WE WORK WITH ─────────────────────────────────────────────────────────
function WhoWeWorkWith() {
    const { isMobile } = useBreakpoint()
    const cl=[
        {I:IC.Office,t:"Fintech Startups",d:"Building category-defining products that need operator-grade execution."},
        {I:IC.Pillars,t:"Banks",d:"Launching new digital products with the urgency and focus of a startup."},
        {I:IC.TrendUp,t:"NBFCs",d:"Modernising lending infrastructure and customer journeys end-to-end."},
        {I:IC.Zap,t:"Payment Companies",d:"Scaling to the next growth phase with proven product leadership."},
    ]
    return (
        <section style={{background:"#f0efed",padding:isMobile?"60px 20px":"100px 80px"}}>
            <div style={{maxWidth:1100,margin:"0 auto"}}>
                <FadeIn><div style={{textAlign:"center",marginBottom:60}}>
                    <Badge label="Who We Work With" Icon={IC.Users}/>
                    <h2 style={{fontSize:isMobile?"clamp(29px,7vw,46px)":"clamp(36px,5vw,58px)",fontFamily:"'DM Serif Display', serif",fontWeight:400,letterSpacing:"-0.03em",color:"#111",marginTop:20,marginBottom:12}}>Built for the<br/><em>Serious Builders</em></h2>
                </div></FadeIn>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:16}}>
                    {cl.map((c,i)=><FadeIn key={i} delay={i*.1}><Card style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <div style={{width:50,height:50,borderRadius:13,background:"rgba(0,0,0,.05)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><c.I s={24} c="#111"/></div>
                        <div style={{fontSize:15,fontWeight:600,color:"#111",marginBottom:9,fontFamily:"'DM Serif Display', serif"}}>{c.t}</div>
                        <p style={{fontSize:isMobile?12:13,color:"#777",lineHeight:1.6,margin:0}}>{c.d}</p>
                    </Card></FadeIn>)}
                </div>
            </div>
        </section>
    )
}

// ─── FOUNDER ─────────────────────────────────────────────────────────────────
function FounderSection() {
    const { isMobile } = useBreakpoint()
    return (
        <section style={{background:"#111",padding:isMobile?"60px 20px":"100px 80px"}}>
            <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:isMobile?"1fr":"auto 1fr",gap:isMobile?32:64,alignItems:"center"}}>
                <FadeIn delay={.1}>
                    <div style={{width:isMobile?120:160,height:isMobile?120:160,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,.08)",overflow:"hidden",position:"relative",flexShrink:0,margin:isMobile?"0 auto":0}}>
                        <Image src="/Rahul.jpeg" alt="Rahul" fill style={{objectFit:"cover"}} sizes={isMobile?"120px":"160px"}/>
                    </div>
                </FadeIn>
                <FadeIn delay={.2}><div style={{textAlign:isMobile?"center":"left"}}>
                    <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",color:"rgba(255,255,255,.28)",textTransform:"uppercase" as const,marginBottom:16}}>Founder</div>
                    <h2 style={{fontSize:isMobile?34:42,fontFamily:"'DM Serif Display', serif",fontWeight:400,color:"#fff",letterSpacing:"-0.03em",margin:"0 0 16px",lineHeight:1.1}}>Rahul</h2>
                    <p style={{fontSize:isMobile?14:16,color:"rgba(255,255,255,.48)",lineHeight:1.65,margin:"0 0 28px"}}>Operator with deep experience building fintech products at national scale across payments, credit, and lending. Credibility comes from outcomes — not credentials.</p>
                    <motion.a href="https://www.linkedin.com/in/rahulkhanna02/" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:9,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.78)",border:"1px solid rgba(255,255,255,.10)",borderRadius:10,padding:"11px 22px",fontSize:14,fontWeight:500,textDecoration:"none",minHeight:44}} whileHover={{background:"rgba(255,255,255,.12)",y:-2}}>
                        <IC.LinkedIn s={15} c="rgba(255,255,255,.55)"/>View Rahul's LinkedIn
                    </motion.a>
                </div></FadeIn>
            </div>
        </section>
    )
}

// ─── CLOSING CTA ─────────────────────────────────────────────────────────────
function ClosingCTA() {
    const { isMobile } = useBreakpoint()
    return (
        <section style={{background:"#f8f7f5",padding:isMobile?"60px 20px":"120px 80px",textAlign:"center"}}>
            <FadeIn>
                <Badge label="Let's Talk" Icon={IC.Chat}/>
                <h2 style={{fontSize:isMobile?"clamp(32px,8vw,56px)":"clamp(40px,6vw,72px)",fontFamily:"'DM Serif Display', serif",fontWeight:400,letterSpacing:"-0.04em",color:"#111",margin:"24px auto 16px",lineHeight:1.1,maxWidth:700}}>Building the next big<br/>fintech product?</h2>
                <p style={{fontSize:isMobile?14:18,color:"#777",maxWidth:500,margin:"0 auto 40px",lineHeight:1.6}}>If you believe great products need complete focus — we should talk.</p>
                <motion.button style={{display:"inline-flex",alignItems:"center",gap:10,background:"#111",color:"#fff",border:"none",borderRadius:14,padding:"16px 36px",fontSize:isMobile?15:16,fontWeight:500,fontFamily:"inherit",cursor:"pointer",boxShadow:"0 6px 24px rgba(0,0,0,.20)",minHeight:44}} whileHover={{opacity:.86,y:-3,boxShadow:"0 12px 32px rgba(0,0,0,.25)"}} whileTap={{scale:.97}}>
                    Start a conversation <IC.Arrow s={16} c="white"/>
                </motion.button>
                <div style={{marginTop:48,fontSize:12,color:"#ccc",letterSpacing:"0.06em"}}>ONE PRODUCT AT A TIME. ALWAYS.</div>
            </FadeIn>
        </section>
    )
}

function Footer() {
    const { isMobile } = useBreakpoint()
    return (
        <footer style={{background:"#0a0a0a",padding:isMobile?"28px 20px":"36px 80px",display:"flex",flexDirection:isMobile?"column":"row",alignItems:"center",justifyContent:"space-between",gap:isMobile?8:0}}>
            <div style={{fontSize:15,fontWeight:700,color:"rgba(255,255,255,.35)",fontFamily:"'DM Serif Display', serif"}}>Highfox</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.15)",letterSpacing:"0.04em"}}>© 2025 Highfox. One product at a time.</div>
        </footer>
    )
}

export default function HighfoxSite() {
    const { isMobile } = useBreakpoint()
    useEffect(()=>{ injectFont() },[])
    return (
        <div style={{width:"100%",fontFamily:"'Inter', 'DM Sans', sans-serif",background:"#f8f7f5",overflowX:"hidden"}}>
            <Navbar/>
            <section style={{position:"relative",width:"100%",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"radial-gradient(ellipse 85% 65% at 50% 46%,#f2f0ee 0%,#f8f7f5 55%,#ffffff 100%)"}}>
                <RippleSVG/><OrbSphere/><HeroContent/>
            </section>
            <CredibilityStrip/>
            <FounderQuote/>
            <WhyDifferent/>
            <Expertise/>
            <ProductsBuilt/>
            <HowWeWork/>
            <WhoWeWorkWith/>
            <FounderSection/>
            <ClosingCTA/>
            <Footer/>
        </div>
    )
}