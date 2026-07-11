"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { submitContactForm } from '../app/actions';

interface FormValues {
  name: string; email: string; company: string; phone: string;
  budget: string; projectType: string; message: string; privacy: boolean;
}
interface FormErrors { name?: string; email?: string; message?: string; privacy?: string; }

const INFO_CARDS = [
  { emoji: "📧", label: "Email", value: "jatinnjangid72973@gmail.com", href: "mailto:jatinnjangid72973@gmail.com", color: "#3b82f6" },
  { emoji: "📍", label: "Location", value: "Jaipur, Rajasthan, India", href: null, color: "#8b5cf6" },
  { emoji: "💼", label: "Availability", value: "Open for Freelance", href: null, color: "#10b981" },
  { emoji: "⚡", label: "Response Time", value: "Within 24 hours", href: null, color: "#f59e0b" },
];

const BUDGET_OPTIONS = ["Under ₹20,000","₹20,000 – ₹50,000","₹50,000 – ₹1,00,000","₹1,00,000 – ₹3,00,000","₹3,00,000+","Let's discuss"];
const PROJECT_TYPES = ["Business Website","SaaS Product","CRM / Dashboard","AI Automation","Travel Website","Mobile App","E-commerce","Other"];

const containerV: Variants = { hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:0.12}} };
const itemV: Variants = { hidden:{opacity:0,y:32}, visible:{opacity:1,y:0,transition:{duration:0.65}} };


function FloatLabel({ label, name, type="text", required=false, error, value, onChange, onBlur, onFocus, isFocused }: any) {
  const up = isFocused || !!value;
  return (
    <div className="cf-field">
      <label className={`cf-label${up?' cf-label--up':''}`}>{label}{required && <span style={{color:'#ef4444',marginLeft:2}}>*</span>}</label>
      <input name={name} type={type} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
        placeholder="" className={`cf-input${error?' cf-input--err':''}`} autoComplete="off" />
      <AnimatePresence>{error && <motion.p className="cf-error" initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}>⚠ {error}</motion.p>}</AnimatePresence>
    </div>
  );
}

export default function ContactSection({ activeColor }: { activeColor: string }) {
  const [values, setValues] = useState<FormValues>({ name:'',email:'',company:'',phone:'',budget:'',projectType:'',message:'',privacy:false });
  const [focused, setFocused] = useState<Record<string,boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [fileName, setFileName] = useState('');

  const validate = () => {
    const e: FormErrors = {};
    if (!values.name.trim()) e.name='Name is required';
    if (!values.email.trim()) e.email='Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email='Enter a valid email address';
    if (!values.message.trim()) e.message='Project details are required';
    if (!values.privacy) e.privacy='Please agree to the privacy policy to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fireConfetti = async () => {
    if (typeof window==='undefined') return;
    try {
      const confetti = (await import('canvas-confetti')).default;
      const count=220, origin={y:0.55};
      const fire=(r:number,o:object)=>confetti({origin,particleCount:Math.floor(count*r),...o});
      fire(0.25,{spread:26,startVelocity:55,colors:['#2563EB','#7C3AED','#EC4899']});
      fire(0.2,{spread:60,colors:['#10B981','#F97316','#FACC15']});
      fire(0.35,{spread:100,decay:0.91,scalar:0.8});
      fire(0.1,{spread:120,startVelocity:25,decay:0.92,scalar:1.2});
      fire(0.1,{spread:120,startVelocity:45});
    } catch(_){}
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const res = await submitContactForm(fd);
    setIsSubmitting(false);
    if (res.error) { setErrors({name:res.error}); }
    else { setSubmitted(true); setShowToast(true); fireConfetti(); setTimeout(()=>setShowToast(false),5000); }
  };

  const set = (n:string,v:string|boolean)=>{ setValues(p=>({...p,[n]:v})); if(errors[n as keyof FormErrors]) setErrors(p=>({...p,[n]:undefined})); };
  const setF = (n:string,on:boolean)=>setFocused(p=>({...p,[n]:on}));
  const grad = {backgroundImage:`linear-gradient(135deg, ${activeColor}, #7C3AED)`};

  return (
    <section id="contact" className="cp-section">
      <div className="cp-container">
        <motion.div className="cp-grid" variants={containerV} initial="hidden" whileInView="visible" viewport={{once:true,margin:'-80px'}}>

          {/* LEFT */}
          <div className="cp-left">
            <motion.div variants={itemV}>
              <span className="cp-badge" style={{borderColor:`${activeColor}40`,color:activeColor,background:`${activeColor}12`}}>
                <span className="cp-badge-dot" style={{background:activeColor}}/>Available for Freelance
              </span>
            </motion.div>
            <motion.h2 variants={itemV} className="cp-heading">
              Let&apos;s Build Something<br/>
              <span className="cp-heading-grad" style={grad}>Amazing Together.</span>
            </motion.h2>
            <motion.p variants={itemV} className="cp-desc">
              Have a project idea, startup, SaaS product, AI automation, CRM, or business website? I&apos;d love to help bring it to life.
            </motion.p>
            <motion.div variants={itemV} className="cp-info-grid">
              {INFO_CARDS.map(c=>(
                <motion.div key={c.label} className="cp-info-card" whileHover={{y:-5,scale:1.02}} transition={{type:'spring',stiffness:400,damping:25}}>
                  <span className="cp-info-icon" style={{background:`${c.color}20`,color:c.color}}>{c.emoji}</span>
                  <div>
                    <p className="cp-info-label">{c.label}</p>
                    {c.href ? <a href={c.href} className="cp-info-value cp-info-link">{c.value}</a> : <p className="cp-info-value">{c.value}</p>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT - GLASS CARD */}
          <motion.div variants={itemV} className="cp-card-wrap">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="ok" className="cp-glass-card cp-success" initial={{scale:0.88,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.88,opacity:0}} transition={{type:'spring',stiffness:300,damping:25}}>
                  <motion.div className="cp-success-icon" style={grad} initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:400,damping:20,delay:0.15}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </motion.div>
                  <h3 className="cp-success-h">Message Sent! 🎉</h3>
                  <p className="cp-success-p">Thanks for reaching out. I&apos;ll reply within 24 hours.</p>
                  <motion.button className="cp-btn" style={grad} onClick={()=>{setSubmitted(false);setValues({name:'',email:'',company:'',phone:'',budget:'',projectType:'',message:'',privacy:false});}} whileHover={{scale:1.03}} whileTap={{scale:0.97}}>
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form key="form" className="cp-glass-card" onSubmit={handleSubmit} noValidate initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <h3 className="cp-form-title">Send a Message</h3>
                  <div className="cf-row">
                    <FloatLabel label="Full Name" name="name" required error={errors.name} value={values.name} onChange={(e:any)=>set('name',e.target.value)} onFocus={()=>setF('name',true)} onBlur={()=>setF('name',false)} isFocused={!!focused.name}/>
                    <FloatLabel label="Email Address" name="email" type="email" required error={errors.email} value={values.email} onChange={(e:any)=>set('email',e.target.value)} onFocus={()=>setF('email',true)} onBlur={()=>setF('email',false)} isFocused={!!focused.email}/>
                  </div>
                  <div className="cf-row">
                    <FloatLabel label="Company (Optional)" name="company" value={values.company} onChange={(e:any)=>set('company',e.target.value)} onFocus={()=>setF('company',true)} onBlur={()=>setF('company',false)} isFocused={!!focused.company}/>
                    <FloatLabel label="Phone (Optional)" name="phone" type="tel" value={values.phone} onChange={(e:any)=>set('phone',e.target.value)} onFocus={()=>setF('phone',true)} onBlur={()=>setF('phone',false)} isFocused={!!focused.phone}/>
                  </div>
                  <div className="cf-row">
                    <div className="cf-field">
                      <label className={`cf-label${focused.budget||values.budget?' cf-label--up':''}`}>Project Budget</label>
                      <select name="budget" value={values.budget} onChange={e=>set('budget',e.target.value)} onFocus={()=>setF('budget',true)} onBlur={()=>setF('budget',false)} className="cf-input cf-select">
                        <option value=""/>{BUDGET_OPTIONS.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="cf-field">
                      <label className={`cf-label${focused.projectType||values.projectType?' cf-label--up':''}`}>Project Type</label>
                      <select name="projectType" value={values.projectType} onChange={e=>set('projectType',e.target.value)} onFocus={()=>setF('projectType',true)} onBlur={()=>setF('projectType',false)} className="cf-input cf-select">
                        <option value=""/>{PROJECT_TYPES.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="cf-field">
                    <label className={`cf-label cf-label--ta${focused.message||values.message?' cf-label--up-ta':''}`}>Project Details<span style={{color:'#ef4444',marginLeft:2}}>*</span></label>
                    <textarea name="message" value={values.message} onChange={e=>set('message',e.target.value)} onFocus={()=>setF('message',true)} onBlur={()=>setF('message',false)} className={`cf-input cf-textarea${errors.message?' cf-input--err':''}`} rows={4} placeholder=""/>
                    <AnimatePresence>{errors.message&&<motion.p className="cf-error" initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}>⚠ {errors.message}</motion.p>}</AnimatePresence>
                  </div>
                  <label className="cf-upload">
                    <input type="file" name="attachment" className="sr-only" accept=".pdf,.doc,.docx,.png,.jpg,.zip" onChange={e=>setFileName(e.target.files?.[0]?.name||'')}/>
                    <span>📎</span><span>{fileName||'Attach a file (PDF, DOC, Image — optional)'}</span>
                  </label>
                  <div className="cf-privacy">
                    <label className="cf-privacy-row">
                      <div className={`cf-checkbox${values.privacy?' cf-checkbox--on':''}`} onClick={()=>set('privacy',!values.privacy)} role="checkbox" aria-checked={values.privacy} tabIndex={0} onKeyDown={e=>e.key===' '&&set('privacy',!values.privacy)} style={values.privacy?{background:activeColor,borderColor:activeColor}:{}}>
                        {values.privacy&&<svg viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                      </div>
                      <input type="hidden" name="privacy" value={values.privacy?'true':'false'}/>
                      <span className="cf-privacy-text">I agree to the <a href="#" className="cf-privacy-link" style={{color:activeColor}}>privacy policy</a></span>
                    </label>
                    <AnimatePresence>{errors.privacy&&<motion.p className="cf-error" initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}>⚠ {errors.privacy}</motion.p>}</AnimatePresence>
                  </div>
                  <motion.button type="submit" disabled={isSubmitting} className="cp-btn" style={grad} whileHover={{scale:1.03,boxShadow:`0 8px 32px ${activeColor}55`}} whileTap={{scale:0.97}}>
                    {isSubmitting ? <span className="cp-spinner"/> : <>Send Message &nbsp;→</>}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showToast&&(
          <motion.div className="cp-toast" initial={{opacity:0,y:60,x:'-50%'}} animate={{opacity:1,y:0,x:'-50%'}} exit={{opacity:0,y:60,x:'-50%'}} transition={{type:'spring',stiffness:400,damping:30}}>
            ✅ &nbsp;Message sent successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
