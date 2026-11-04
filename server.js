const express=require("express"),cors=require("cors"),{chromium}=require("playwright");
const {spawn,execFile}=require("node:child_process"),{promisify}=require("node:util");
const fs=require("node:fs/promises"),nativeFs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto");
const execFileAsync=promisify(execFile),app=express(),PORT=Number(process.env.PORT||8080);
const TOKEN=process.env.API_TOKEN,ORIGIN=process.env.ALLOWED_ORIGIN||"",MAX_JOBS=Math.max(1,Number(process.env.MAX_CONCURRENT||1)),MAX_FRAMES=Math.max(1,Number(process.env.MAX_FRAMES||1800));
let active=0;
if(!TOKEN||TOKEN.length<24){console.error("Set API_TOKEN to a secret of at least 24 characters.");process.exit(1);}
if(!ORIGIN){console.error("Set ALLOWED_ORIGIN to your exact GitHub Pages origin.");process.exit(1);}
app.disable("x-powered-by");
app.use(cors({origin(o,cb){if(!o||o===ORIGIN)return cb(null,true);cb(new Error("CORS origin not allowed"));},methods:["GET","POST","OPTIONS"],allowedHeaders:["Content-Type","Authorization"]}));
app.use(express.json({limit:"3mb"}));
function auth(req,res,next){const s=Buffer.from((req.headers.authorization||"").replace(/^Bearer\s+/i,"")),t=Buffer.from(TOKEN);if(s.length!==t.length||!crypto.timingSafeEqual(s,t))return res.status(401).json({error:"Unauthorized. Check your Cloud API token."});next();}
function privateHost(host){let h=host.toLowerCase().replace(/^\[|\]$/g,"");if(["localhost","::1","0.0.0.0"].includes(h)||h.endsWith(".localhost"))return true;let p=h.split(".").map(Number);if(p.length!==4||!p.every(n=>Number.isInteger(n)&&n>=0&&n<=255))return false;let [a,b]=p;return a===10||a===127||a===0||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&b===168)||(a===100&&b>=64&&b<=127);}
app.get("/health",auth,async(req,res)=>{let f="available";try{await execFileAsync("ffmpeg",["-version"]);}catch(_){f="missing";}res.json({service:"MotionForge Cloud Renderer",ffmpeg:f,activeJobs:active,maxConcurrent:MAX_JOBS});});
app.post("/render",auth,async(req,res)=>{
 const {html,width,height,fps,duration,format="mp4",quality=21,background="keep"}=req.body||{};
 if(typeof html!=="string"||html.length<20||html.length>2500000)return res.status(400).json({error:"HTML must be between 20 bytes and 2.5 MB."});
 if(![width,height].every(n=>Number.isInteger(n)&&n>=256&&n<=3840))return res.status(400).json({error:"Dimensions must be integers between 256 and 3840."});
 if(![24,25,30,50,60].includes(Number(fps)))return res.status(400).json({error:"FPS must be 24, 25, 30, 50 or 60."});
 if(!Number.isFinite(duration)||duration<3||duration>60)return res.status(400).json({error:"Duration must be 3–60 seconds."});
 if(!["mp4","webm"].includes(format)||![18,21,25].includes(Number(quality)))return res.status(400).json({error:"Invalid format or quality."});
 const count=Math.round(duration*fps);if(count>MAX_FRAMES)return res.status(413).json({error:`Server limit is ${MAX_FRAMES} frames. Reduce duration or FPS.`});
 if(active>=MAX_JOBS)return res.status(429).json({error:"Render queue is busy. Try again shortly."});
 active++;const dir=await fs.mkdtemp(path.join(os.tmpdir(),"motionforge-"));let browser,disconnected=false;
 res.on("close",()=>{if(!res.writableEnded)disconnected=true;});
 try{
  const frames=path.join(dir,"frames");await fs.mkdir(frames);
  browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();page.setDefaultTimeout(15000);
  await page.route("**/*",route=>{try{const u=new URL(route.request().url());if(["http:","https:"].includes(u.protocol)&&privateHost(u.hostname))return route.abort();if(!["http:","https:","data:","blob:","about:"].includes(u.protocol))return route.abort();return route.continue();}catch(_){return route.abort();}});
  let source=html;if(background==="black"||background==="white")source=source.replace(/<\/head>/i,`<style>html,body{background:${background}!important}</style></head>`);
  await page.setContent(source,{waitUntil:"domcontentloaded",timeout:20000});
  await page.evaluate(async()=>{if(document.fonts?.ready)await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3500))]);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));for(const a of document.getAnimations({subtree:true}))try{a.pause();}catch(_){}});
  for(let i=0;i<count;i++){if(disconnected)throw new Error("Client disconnected; render cancelled.");await page.evaluate(async t=>{for(const a of document.getAnimations({subtree:true}))try{a.pause();a.currentTime=t;}catch(_){}await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},i/Number(fps)*1000);await page.screenshot({path:path.join(frames,`frame-${String(i).padStart(6,"0")}.png`),type:"png"});}
  const output=path.join(dir,`render.${format}`),args=["-hide_banner","-loglevel","error","-y","-framerate",String(fps),"-i",path.join(frames,"frame-%06d.png")];
  if(format==="mp4")args.push("-c:v","libx264","-preset","veryfast","-crf",String(quality),"-pix_fmt","yuv420p","-movflags","+faststart");else args.push("-c:v","libvpx-vp9","-crf",String(quality),"-b:v","0","-deadline","good","-cpu-used","4");
  args.push(output);await new Promise((resolve,reject)=>{const p=spawn("ffmpeg",args,{stdio:["ignore","ignore","pipe"]});let err="";p.stderr.on("data",d=>err=(err+d.toString()).slice(-7000));p.on("error",reject);p.on("close",c=>c===0?resolve():reject(new Error(`FFmpeg failed (${c}): ${err}`)));});
  const st=await fs.stat(output);res.setHeader("Content-Type",format==="mp4"?"video/mp4":"video/webm");res.setHeader("Content-Length",String(st.size));res.setHeader("Content-Disposition",`attachment; filename="motionforge-${width}x${height}-${fps}fps.${format}"`);res.setHeader("Cache-Control","no-store");
  await new Promise((resolve,reject)=>{const stream=nativeFs.createReadStream(output);stream.on("error",reject);res.on("finish",resolve);stream.pipe(res);});
 }catch(e){console.error("Render failed:",e);if(!res.headersSent&&!res.writableEnded)res.status(500).json({error:e.message||"Render failed."});else if(!res.writableEnded)res.destroy(e);}
 finally{if(browser)await browser.close().catch(()=>{});await fs.rm(dir,{recursive:true,force:true}).catch(()=>{});active--;}
});
app.get("/",(_,res)=>res.type("text").send("MotionForge renderer online. Authenticated endpoints: /health and /render."));
app.listen(PORT,()=>console.log(`MotionForge renderer listening on ${PORT}`));
