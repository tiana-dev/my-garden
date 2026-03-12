import { useState, useEffect } from "react";

const TODAY = new Date();
const YR = TODAY.getFullYear();
const LAST_FROST = new Date(YR, 3, 15);
const DAYS_LEFT = Math.max(0, Math.ceil((LAST_FROST - TODAY) / 86400000));
const PAST_FROST = DAYS_LEFT <= 0;
const PAST_MAY20 = TODAY >= new Date(YR, 4, 20);
const GO = () => true;
const AFTER_FROST = () => PAST_FROST;
const LATE_MAY = () => PAST_MAY20;
const WITHIN_WEEKS = (n) => () => DAYS_LEFT <= n * 7;
const DONE = () => false;

const BEDS = [
  { id:"front", name:"Front Bed", icon:"🏡", color:"#6a9fbf", accent:"rgba(106,159,191,0.12)", plants:[
    { emoji:"🌸", name:"Hellebores", status:"Probably blooming right now — hellebores are early risers!", tasks:[
      {text:"Remove last year's tatty foliage to show off blooms", ready:GO, urgency:1},
      {text:"Top-dress with compost after blooms fade", ready:GO, urgency:3}
    ]},
    { emoji:"🌿", name:"Japanese Ferns", status:"Slow to emerge — patience required", tasks:[
      {text:"Don't cut old fronds yet — wait for new fiddleheads", ready:GO, urgency:1},
      {text:"Remove winter-damaged fronds once new growth appears", ready:GO, urgency:2},
      {text:"Mulch lightly after new growth starts", ready:WITHIN_WEEKS(6), urgency:3}
    ]},
    { emoji:"🌹", name:"Rose Bushes", status:"Prime pruning window is now", tasks:[
      {text:"Prune when forsythia blooms — that's your signal", ready:GO, urgency:1},
      {text:"Cut to outward-facing buds; remove dead/crossing canes", ready:GO, urgency:1},
      {text:"Start fertilizing once you see leafing out", ready:WITHIN_WEEKS(4), urgency:2},
      {text:"Watch for aphids as new growth comes in", ready:WITHIN_WEEKS(6), urgency:3}
    ]}
  ]},
  { id:"side", name:"Side Bed", icon:"🌺", color:"#7ab893", accent:"rgba(122,184,147,0.12)", plants:[
    { emoji:"🌼", name:"White Eye Liner Lilies", status:"Bulbs underground — nothing to do yet", tasks:[
      {text:"No action needed — they're doing their thing underground", ready:GO, urgency:4},
      {text:"Lightly fertilize when shoots are a few inches tall", ready:GO, urgency:2},
      {text:"Stake taller stems before they need it, not after", ready:AFTER_FROST, urgency:2}
    ]},
    { emoji:"🌸", name:"Dahlias", status:"Hold off — frost will kill the tubers", tasks:[
      {text:"Check stored tubers now for rot or shriveling", ready:GO, urgency:1},
      {text:"Plant out after last frost when soil hits 60F", ready:AFTER_FROST, urgency:2},
      {text:"Plant 4-6in deep, eye up; don't water until sprouts appear", ready:AFTER_FROST, urgency:2},
      {text:"Pinch growing tip at 12in tall for more blooms", ready:LATE_MAY, urgency:3}
    ]}
  ]},
  { id:"tulip", name:"Tulip & Iris Bed", icon:"🌷", color:"#8ab4d4", accent:"rgba(138,180,212,0.12)", plants:[
    { emoji:"🌷", name:"Tulips", status:"Coming up — enjoy the show!", tasks:[
      {text:"Resist tidying leaves after bloom — they feed next year's bulbs", ready:GO, urgency:2},
      {text:"Deadhead spent flowers (head only, leave stem and leaves)", ready:GO, urgency:2}
    ]},
    { emoji:"🪻", name:"Irises", status:"Emerging now — tidy up time", tasks:[
      {text:"Remove dead leaves from last year; clean up the fans", ready:GO, urgency:1},
      {text:"Lightly fertilize as new growth appears (low nitrogen)", ready:GO, urgency:2},
      {text:"Keep rhizomes barely exposed — never bury them deep", ready:GO, urgency:1},
      {text:"Divide crowded clumps after bloom in June/July", ready:DONE, urgency:4}
    ]}
  ]},
  { id:"trees", name:"Trees & Shrubs", icon:"🌳", color:"#5a9e78", accent:"rgba(90,158,120,0.12)", plants:[
    { emoji:"🐱", name:"Pussy Willow", status:"Probably showing catkins right now!", tasks:[
      {text:"Harvest branches while catkins are still fuzzy, before they go yellow", ready:GO, urgency:1},
      {text:"Prune back hard after flowering to keep it manageable", ready:GO, urgency:2}
    ]},
    { emoji:"💨", name:"Smoke Bushes x4", status:"Prune before new growth takes off", tasks:[
      {text:"For huge dramatic leaves: cut hard to 12in now (sacrifices the smoke flowers)", ready:GO, urgency:1},
      {text:"For flowers: just remove dead/crossing branches, leave the structure", ready:GO, urgency:1},
      {text:"Pick one approach and stick to it year to year", ready:GO, urgency:1}
    ]}
  ]},
  { id:"peonies", name:"Peony Bed", icon:"🌺", color:"#b088b8", accent:"rgba(176,136,184,0.12)", plants:[
    { emoji:"🌷", name:"Peonies", status:"Red shoots emerging — handle with care", tasks:[
      {text:"Clear old mulch so shoots can come up easily", ready:GO, urgency:1},
      {text:"Do not disturb roots — peonies sulk for years if moved", ready:GO, urgency:1},
      {text:"Light fertilizer once shoots are a few inches tall", ready:GO, urgency:2},
      {text:"Set up peony rings NOW before they're tall enough to need them", ready:WITHIN_WEEKS(4), urgency:1},
      {text:"Ants on buds = totally normal, don't spray them", ready:DONE, urgency:4}
    ]}
  ]},
  { id:"planters", name:"Planters", icon:"🪴", color:"#7abcb0", accent:"rgba(122,188,176,0.12)", plants:[
    { emoji:"🌿", name:"Ivy Planter", status:"Year-round — tidy it up now", tasks:[
      {text:"Trim back scraggly or winter-damaged stems", ready:GO, urgency:2},
      {text:"Fresh top-dressing of potting mix if it looks depleted", ready:GO, urgency:3}
    ]},
    { emoji:"🌸", name:"Annual Planters", status:"Start cool annuals now!", tasks:[
      {text:"Plant pansies, violas, or snapdragons now — they love the cold", ready:GO, urgency:1},
      {text:"After last frost: swap for petunias, calibrachoa, geraniums", ready:AFTER_FROST, urgency:2},
      {text:"Refresh potting mix — don't reuse old soil", ready:GO, urgency:2}
    ]}
  ]},
  { id:"veggie", name:"Veggie Garden", icon:"🥕", color:"#c4a85a", accent:"rgba(196,168,90,0.12)", plants:[
    { emoji:"🥔", name:"Potatoes", status:DAYS_LEFT<=28 ? "Time to plant!" : "Chit indoors now — plant in " + Math.max(0,DAYS_LEFT-28) + " days", tasks:[
      {text:"Chit seed potatoes now — set in egg cartons in a bright spot indoors", ready:GO, urgency:1},
      {text:"Plant 2-4 weeks before last frost, 4in deep, 12in apart", ready:WITHIN_WEEKS(4), urgency:1},
      {text:"Hill up soil around stems as they grow", ready:WITHIN_WEEKS(4), urgency:3}
    ]},
    { emoji:"🥕", name:"Carrots", status:DAYS_LEFT<=42 ? "Direct sow window is open!" : "Direct sow in " + Math.max(0,DAYS_LEFT-42) + " days", tasks:[
      {text:"Direct sow 4-6 weeks before last frost — cold helps germination", ready:WITHIN_WEEKS(6), urgency:1},
      {text:"Loosen soil 12in deep; they fork in compacted ground", ready:WITHIN_WEEKS(6), urgency:2},
      {text:"Sow thinly; thin to 2in apart once sprouted", ready:WITHIN_WEEKS(6), urgency:2},
      {text:"Succession sow every 3 weeks through June for continuous harvest", ready:WITHIN_WEEKS(6), urgency:3}
    ]}
  ]}
];

const URGENCY_LABELS = {
  1: { label: "Do This Week", color: "#d45c5c", bg: "rgba(212,92,92,0.1)" },
  2: { label: "Do This Month", color: "#c49030", bg: "rgba(196,144,48,0.1)" },
  3: { label: "Coming Up", color: "#5a9e78", bg: "rgba(90,158,120,0.1)" },
  4: { label: "Not Yet / Later", color: "#a0b4bc", bg: "rgba(160,180,188,0.07)" },
};

const CONVERSATION = [
  {
    role: "me",
    text: "I'd like to find or build an app that will tell me when I can start doing work in my garden."
  },
  {
    role: "claude",
    text: "I know your frost window. Let me make a little app that pulls the current forecast and tells you where you're at."
  },
  {
    role: "me",
    text: "The side panel isn't showing me anything. Maybe there was an error."
  },
  {
    role: "claude",
    text: "Ha, yes — I kept writing fragments instead of committing to the actual artifact. Let me fix that."
  },
  {
    role: "me",
    text: "I have a front bed: lenten/christmas roses, japanese ferns, rose bushes. A side bed with white eye liner lillies and dahlias. A tulip and iris bed, a pussy willow tree, four smoke bushes, a peony bed, a few planters, and a vegetable garden where I do carrots and potatoes."
  },
  {
    role: "claude",
    text: "Oh this is so much better — now I can make it actually about your garden instead of generic."
  },
  {
    role: "me",
    text: "Replace christmas/lenten roses with 'hellebores' because that's what I actually meant."
  },
  {
    role: "me",
    text: "The colors are a little dark — can we use spring tones like blues and greens?"
  },

];

function buildTimeline() {
  const groups = {1:[], 2:[], 3:[], 4:[]};
  BEDS.forEach(bed => {
    bed.plants.forEach(plant => {
      plant.tasks.forEach(task => {
        const ready = task.ready();
        const u = ready ? task.urgency : 4;
        groups[u].push({
          text: task.text,
          plant: plant.name,
          plantEmoji: plant.emoji,
          bed: bed.name,
          bedIcon: bed.icon,
          bedColor: bed.color,
          ready,
        });
      });
    });
  });
  return groups;
}

export default function GardenApp() {
  const [forecast, setForecast] = useState(null);
  const [view, setView] = useState("timeline");
  const [activeBed, setActiveBed] = useState("front");

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=40.6084&longitude=-75.4902&daily=temperature_2m_min,temperature_2m_max&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=7")
      .then(r => r.json())
      .then(d => setForecast(d.daily))
      .catch(() => {});
  }, []);

  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const bed = BEDS.find(b => b.id === activeBed);
  const timeline = buildTimeline();

  return (
    <div style={{fontFamily:"Georgia,serif", background:"#f0f7f4", minHeight:"100vh", color:"#1e3328", maxWidth:520, margin:"0 auto"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lora:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;border:none;transition:all 0.18s}
        button:hover{filter:brightness(0.93)}
        .bubble-me { background:#e8f4ff; border:1px solid #b8d8f0; border-radius:12px 12px 3px 12px; padding:0.6rem 0.85rem; font-size:0.78rem; color:#1a3a5c; margin-left:2rem; }
        .bubble-claude { background:#fff; border:1px solid #ddeee8; border-radius:12px 12px 12px 3px; padding:0.6rem 0.85rem; font-size:0.78rem; color:#1e3328; margin-right:2rem; }
        .bubble-label-me { font-size:0.6rem; text-align:right; color:#7aaa90; margin-bottom:0.2rem; letter-spacing:0.05em; text-transform:uppercase; }
        .bubble-label-claude { font-size:0.6rem; color:#7aaa90; margin-bottom:0.2rem; letter-spacing:0.05em; text-transform:uppercase; }
      `}</style>

      {/* Header */}
      <div style={{padding:"1.5rem 1.25rem 1rem", background:"linear-gradient(135deg, #4a9e78 0%, #5a8fbf 100%)", color:"#fff"}}>
        <div style={{fontSize:"0.63rem", letterSpacing:"0.2em", textTransform:"uppercase", opacity:0.75, marginBottom:"0.3rem"}}>Zone 6b · Last frost April 15</div>
        <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:"1.75rem", fontWeight:700}}>Your Garden, Right Now</h1>
        <div style={{marginTop:"0.75rem", padding:"0.65rem 1rem", borderRadius:"6px", background:PAST_FROST?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.2)", fontSize:"0.82rem", fontWeight:600}}>
          {PAST_FROST ? "✅ Past last frost — full season open!" : "⏳ About " + DAYS_LEFT + " days until last frost (April 15)"}
        </div>
      </div>

      {/* Forecast */}
      {forecast && (
        <div style={{padding:"0.85rem 1.25rem 0.6rem", background:"#fff", borderBottom:"1px solid #ddeee8"}}>
          <div style={{fontSize:"0.58rem", letterSpacing:"0.18em", textTransform:"uppercase", opacity:0.45, marginBottom:"0.5rem", color:"#3a7a58"}}>7-Day Forecast</div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"0.25rem"}}>
            {forecast.time.map((date,i) => {
              const min = Math.round(forecast.temperature_2m_min[i]);
              const max = Math.round(forecast.temperature_2m_max[i]);
              const frost = min<=32;
              const near = min>32 && min<=36;
              const d = new Date(date+"T12:00:00");
              return (
                <div key={date} style={{textAlign:"center", padding:"0.4rem 0.1rem", borderRadius:"6px", background:frost?"#fde8e8":near?"#fef6e0":"#e8f6ee", border:"1px solid "+(frost?"#f0b0b0":near?"#f0d880":"#a8dfc0")}}>
                  <div style={{fontSize:"0.55rem", fontWeight:700, opacity:0.6, textTransform:"uppercase", color:frost?"#c04040":near?"#a07010":"#2a7a50"}}>{dayNames[d.getDay()]}</div>
                  <div style={{fontSize:"0.9rem", margin:"0.15rem 0"}}>{frost?"🥶":near?"🌡️":"☀️"}</div>
                  <div style={{fontSize:"0.63rem", fontWeight:700, color:frost?"#c04040":near?"#a07010":"#2a7a50"}}>{max}/{min}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View toggle */}
      <div style={{display:"flex", background:"#fff", borderBottom:"2px solid #ddeee8"}}>
        {[{id:"timeline", label:"📅 By Urgency"},{id:"beds", label:"🌿 By Bed"},{id:"about", label:"✨ How I Built This"}].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            flex:1, padding:"0.7rem 0.25rem", fontSize:"0.7rem", fontWeight:700,
            fontFamily:"'Playfair Display',serif",
            background:"transparent",
            color:view===v.id?"#3a8a60":"#90a8a0",
            borderBottom:view===v.id?"3px solid #4a9e78":"3px solid transparent",
            marginBottom:"-2px",
          }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* TIMELINE VIEW */}
      {view==="timeline" && (
        <div style={{padding:"1rem 1.25rem 2rem"}}>
          {[1,2,3,4].map(u => {
            const items = timeline[u];
            if(items.length===0) return null;
            const meta = URGENCY_LABELS[u];
            return (
              <div key={u} style={{marginBottom:"1.5rem"}}>
                <div style={{display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.6rem"}}>
                  <div style={{width:"8px", height:"8px", borderRadius:"50%", background:meta.color, flexShrink:0}}></div>
                  <div style={{fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:meta.color, fontWeight:700}}>{meta.label}</div>
                  <div style={{fontSize:"0.65rem", color:"#90a8a0"}}>({items.length})</div>
                </div>
                <div style={{display:"flex", flexDirection:"column", gap:"0.4rem"}}>
                  {items.map((item,i) => (
                    <div key={i} style={{padding:"0.7rem 0.85rem", borderRadius:"6px", background:"#fff", border:"1px solid #ddeee8", borderLeft:"3px solid "+meta.color, display:"flex", gap:"0.6rem", alignItems:"flex-start"}}>
                      <span style={{flexShrink:0, fontSize:"1.1rem"}}>{item.plantEmoji}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:"0.76rem", color:"#1e3328"}}>{item.text}</div>
                        <div style={{fontSize:"0.65rem", color:"#7aaa90", marginTop:"0.2rem"}}>{item.bedIcon} {item.bed} — {item.plant}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BEDS VIEW */}
      {view==="beds" && (
        <>
          <div style={{padding:"0.85rem 1.25rem 0.6rem", background:"#fff", borderBottom:"1px solid #ddeee8"}}>
            <div style={{display:"flex", flexWrap:"wrap", gap:"0.35rem"}}>
              {BEDS.map(b => (
                <button key={b.id} onClick={() => setActiveBed(b.id)} style={{padding:"0.4rem 0.7rem", borderRadius:"20px", fontSize:"0.72rem", fontWeight:700, background:activeBed===b.id?b.color:"#f0f7f4", color:activeBed===b.id?"#fff":"#5a7a6a", border:"1px solid "+(activeBed===b.id?b.color:"#c0ddd0"), fontFamily:"'Playfair Display',serif"}}>
                  {b.icon} {b.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{padding:"1rem 1.25rem 2rem"}}>
            <div style={{display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem"}}>
              <span style={{fontSize:"1.4rem"}}>{bed.icon}</span>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"1.25rem", fontWeight:700, color:"#1e3328"}}>{bed.name}</h2>
            </div>
            {bed.plants.map(plant => (
              <div key={plant.name} style={{marginBottom:"1rem", padding:"1rem", borderRadius:"8px", background:"#fff", border:"1px solid #ddeee8", borderTop:"3px solid "+bed.color}}>
                <div style={{display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.4rem"}}>
                  <span style={{fontSize:"1.3rem"}}>{plant.emoji}</span>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif", fontSize:"0.92rem", fontWeight:700, color:"#1e3328"}}>{plant.name}</div>
                    <div style={{fontSize:"0.7rem", fontStyle:"italic", color:"#7aaa90", marginTop:"0.1rem"}}>{plant.status}</div>
                  </div>
                </div>
                <div style={{display:"flex", flexDirection:"column", gap:"0.3rem", marginTop:"0.55rem"}}>
                  {plant.tasks.map((task,ti) => {
                    const ready = task.ready();
                    return (
                      <div key={ti} style={{display:"flex", gap:"0.5rem", alignItems:"flex-start", opacity:ready?1:0.4, fontSize:"0.76rem"}}>
                        <span style={{color:ready?"#4a9e78":"#b0c8c0", flexShrink:0}}>{ready?"✓":"○"}</span>
                        <span style={{color:ready?"#1e3328":"#7aaa90", fontStyle:ready?"normal":"italic"}}>{task.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ABOUT VIEW */}
      {view==="about" && (
        <div style={{padding:"1.25rem 1.25rem 2rem"}}>
          <div style={{marginBottom:"1.25rem"}}>
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, color:"#1e3328", marginBottom:"0.4rem"}}>Built with Claude AI</h2>
            <p style={{fontSize:"0.78rem", lineHeight:1.7, color:"#3a5a48"}}>
              This app started as a simple question: <em>"when can I start doing work in my garden?"</em> I collaborated with Claude (Anthropic's AI) to turn that question into a working React app — personalized to my actual garden beds and plants — in a single conversation.
            </p>
          </div>

          <div style={{marginBottom:"1.25rem", padding:"0.85rem 1rem", borderRadius:"8px", background:"#fff", border:"1px solid #ddeee8"}}>
            <div style={{fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#7aaa90", marginBottom:"0.75rem", fontWeight:700}}>What I directed</div>
            {["Described my specific garden beds and plants","Corrected plant names (christmas roses → hellebores)","Asked for urgency-based sorting instead of just by bed","Chose the spring color palette","Pushed back when the layout wasn't working right"].map((item,i) => (
              <div key={i} style={{display:"flex", gap:"0.5rem", alignItems:"flex-start", marginBottom:"0.4rem", fontSize:"0.76rem", color:"#1e3328"}}>
                <span style={{color:"#4a9e78", flexShrink:0}}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div style={{marginBottom:"1.25rem"}}>
            <div style={{fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#7aaa90", marginBottom:"0.75rem", fontWeight:700}}>A few moments from the conversation</div>
            <div style={{display:"flex", flexDirection:"column", gap:"0.75rem"}}>
              {CONVERSATION.map((msg, i) => (
                <div key={i}>
                  {msg.role === "me" ? (
                    <>
                      <div className="bubble-label-me">Me</div>
                      <div className="bubble-me">{msg.text}</div>
                    </>
                  ) : (
                    <>
                      <div className="bubble-label-claude">Claude</div>
                      <div className="bubble-claude">{msg.text}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{padding:"0.85rem 1rem", borderRadius:"8px", background:"linear-gradient(135deg, rgba(74,158,120,0.1) 0%, rgba(90,143,191,0.1) 100%)", border:"1px solid #c0ddd0", fontSize:"0.76rem", lineHeight:1.7, color:"#3a5a48"}}>
            <strong style={{color:"#1e3328"}}>The takeaway:</strong> The gardening knowledge and UI decisions came from the AI. The judgment calls — what to include, how to frame it, what to cut, where it was going — came from me. That's what working with AI actually looks like.
          </div>
        </div>
      )}
    </div>
  );
}