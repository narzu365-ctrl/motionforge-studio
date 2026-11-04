const $ = (id) => document.getElementById(id);

const templates = {
leaves: `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}body{background:radial-gradient(ellipse at 50% 40%,#145943,#062b28 72%);display:grid;place-items:center;font-family:Arial,sans-serif;color:#eafff0}
.scene{position:relative;width:100%;height:100%;overflow:hidden}.leaf{position:absolute;width:15vw;height:30vw;max-height:390px;max-width:190px;border-radius:100% 0 100% 0;background:linear-gradient(135deg,#56b77b,#14734f);opacity:.85;transform-origin:bottom center;animation:sway 5s ease-in-out infinite alternate}.leaf:after{content:"";position:absolute;width:2px;height:85%;background:#b4e5a2;left:50%;top:7%;opacity:.35;transform:rotate(15deg)}.l1{left:8%;bottom:-15%;transform:rotate(-35deg)}.l2{right:8%;bottom:-18%;transform:rotate(35deg);animation-delay:-2s}.l3{left:43%;top:-24%;transform:rotate(180deg) scale(.7);animation-delay:-1s}.l4{right:35%;top:-28%;transform:rotate(210deg) scale(.85);animation-delay:-3s}.center{position:absolute;inset:0;display:grid;place-content:center;text-align:center;gap:12px}.center strong{font-size:clamp(24px,5vw,70px);letter-spacing:.12em;font-weight:500}.center small{font-size:clamp(9px,1.2vw,15px);letter-spacing:.4em;color:#b8e9c8}@keyframes sway{from{filter:brightness(.85);margin-left:-12px}to{filter:brightness(1.2);margin-left:12px}}
</style></head><body><div class="scene"><i class="leaf l1"></i><i class="leaf l2"></i><i class="leaf l3"></i><i class="leaf l4"></i><div class="center"><strong>GROW NATURALLY</strong><small>CALM • BALANCE • RENEW</small></div></div></body></html>`,
orbit: `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}body{background:radial-gradient(ellipse at center,#27205c,#090b20 70%);display:grid;place-items:center;color:white;font-family:Arial}.space{position:relative;width:100%;height:100%;background-image:radial-gradient(#fff 1px,transparent 1px),radial-gradient(#8ea8ff 1px,transparent 1px);background-size:47px 47px,83px 83px;background-position:0 0,23px 31px}.orbit{position:absolute;width:50%;height:22%;border:1px solid #b8a7ff8c;border-radius:50%;left:25%;top:39%;transform:rotate(-18deg)}.planet{position:absolute;width:95px;height:95px;border-radius:50%;left:calc(50% - 47px);top:calc(50% - 47px);background:radial-gradient(circle at 30% 25%,#ffb2e5,#8657c8 45%,#32205d 80%);box-shadow:0 0 65px #a75bff99}.moon{position:absolute;width:27px;height:27px;border-radius:50%;background:linear-gradient(130deg,#d7d8ff,#6b6dc7);left:75%;top:42%;animation:travel 6s linear infinite}.title{position:absolute;bottom:10%;width:100%;text-align:center;letter-spacing:.3em;font-size:clamp(12px,2vw,25px);color:#d9d4ff}@keyframes travel{to{transform:rotate(360deg) translateX(140px) rotate(-360deg)}}</style></head><body><div class="space"><div class="orbit"></div><div class="planet"></div><div class="moon"></div><div class="title">EXPLORE THE UNIVERSE</div></div></body></html>`,
business: `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}body{background:linear-gradient(125deg,#071a35,#124b69 55%,#10213f);font-family:Arial;color:#fff;display:grid;place-items:center}.wrap{text-align:center}.line{width:75px;height:4px;background:#64e1d1;margin:0 auto 28px;animation:grow 2s ease-in-out infinite alternate}.headline{font-size:clamp(32px,7vw,100px);font-weight:800;letter-spacing:-.04em;animation:rise 1.4s both}.sub{font-size:clamp(10px,1.5vw,19px);letter-spacing:.42em;color:#a9e8e5;margin-top:18px;animation:fade 2s both}@keyframes rise{from{opacity:0;transform:translateY(35px)}to{opacity:1;transform:none}}@keyframes fade{from{opacity:0}to{opacity:1}}@keyframes grow{to{width:170px}}</style></head><body><div class="wrap"><div class="line"></div><div class="headline">THINK<br>BEYOND</div><div class="sub">IDEAS INTO IMPACT</div></div></body></html>`,
gradient: `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}body{background:#11152d;display:grid;place-items:center}.blob{position:absolute;width:48vw;height:48vw;max-width:650px;max-height:650px;border-radius:42% 58% 63% 37%/43% 40% 60% 57%;filter:blur(2px);background:linear-gradient(130deg,#ff6da9,#8b5cf6 55%,#41d5ca);animation:morph 8s ease-in-out infinite alternate;opacity:.88}.blob.two{width:30vw;height:30vw;background:linear-gradient(130deg,#ffc36d,#e45d9c);mix-blend-mode:screen;animation-delay:-4s;left:10%;top:8%}.glow{position:absolute;width:100%;height:100%;background:radial-gradient(ellipse at center,transparent 10%,#090d20 78%)}@keyframes morph{to{transform:rotate(160deg) scale(1.12);border-radius:60% 40% 35% 65%/55% 60% 40% 45%}}</style></head><body><div class="blob"></div><div class="blob two"></div><div class="glow"></div></body></html>`,
particles: `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}body{background:radial-gradient(ellipse at center,#172b55,#070d20 75%);font-family:Arial}.field{position:absolute;inset:0;background-image:radial-gradient(#b8d6ff 1px,transparent 1.5px),radial-gradient(#6689c9 1px,transparent 1.5px);background-size:43px 43px,71px 71px;background-position:0 0,20px 29px;animation:drift 18s linear infinite;opacity:.55}.ring{position:absolute;width:40vw;height:40vw;max-width:500px;max-height:500px;border:1px solid #6d9dfd66;border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%);box-shadow:0 0 70px #477cff22,inset 0 0 70px #477cff22}.ring:before,.ring:after{content:"";position:absolute;inset:12%;border:1px solid #80b5ff55;border-radius:50%;transform:rotateX(65deg)}.ring:after{transform:rotateY(65deg)}@keyframes drift{to{background-position:130px 90px,-50px 110px}}</style></head><body><div class="field"></div><div class="ring"></div></body></html>`
};

let currentTemplate = "leaves";
let ffmpegInstance = null;
let ffmpegLoading = null;
let recorder = null;
let recordedChunks = [];

function setMessage(msg, isError=false){$("exportMessage").textContent=msg;$("exportMessage").style.color=isError?"#ff9b9b":"#8495b8";}
function setProgress(p,label,detail){$("progressBox").hidden=false;$("progressBar").style.width=Math.max(0,Math.min(100,p))+"%";$("progressPercent").textContent=Math.round(p)+"%";$("progressLabel").textContent=label;$("progressDetail").textContent=detail||"Please keep this tab open.";}
function dimensions(){const [w,h]=$("resolution").value.split("x").map(Number);return {width:w,height:h};}
function updatePreview(){const code=$("htmlCode").value;const blob=new Blob([code],{type:"text/html"});const url=URL.createObjectURL(blob);$("previewFrame").src=url;setTimeout(()=>URL.revokeObjectURL(url),60000);$("saveState").textContent="Preview updated";const d=dimensions();$("previewSize").textContent=`${d.width}×${d.height}`;}
function loadTemplate(name){currentTemplate=name;$("templateSelect").value=name;$("htmlCode").value=templates[name];updatePreview();}
function downloadBlob(blob,name){const a=document.createElement("a");const url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function wait(ms){return new Promise(r=>setTimeout(r,ms));}
function getRecorderMime(){const types=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"];return types.find(t=>MediaRecorder.isTypeSupported(t))||"";}

async function browserCapture(outputMp4){
  if(!navigator.mediaDevices?.getDisplayMedia)throw new Error("Screen capture is not supported in this browser. Try current Chrome on desktop.");
  const duration=Math.max(3,Math.min(60,Number($("duration").value)||10));
  const fps=Number($("fps").value);
  const {width,height}=dimensions();
  const frameRate={ideal:fps,max:fps};
  setProgress(2,"Waiting for tab capture","In the share dialog, select this browser tab and enable tab audio only if needed.");
  const stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate},audio:false});
  const videoTrack=stream.getVideoTracks()[0];
  try{if(videoTrack.applyConstraints)await videoTrack.applyConstraints({width:{ideal:width},height:{ideal:height},frameRate});}catch(e){}
  const mime=getRecorderMime();
  if(!mime)throw new Error("This browser does not support MediaRecorder WebM.");
  recordedChunks=[];
  recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:Math.min(100_000_000,Math.max(12_000_000,width*height*fps*.12))});
  const dataPromise=new Promise((resolve,reject)=>{recorder.ondataavailable=e=>{if(e.data&&e.data.size)recordedChunks.push(e.data)};recorder.onerror=()=>reject(new Error("Browser recording failed."));recorder.onstop=()=>resolve(new Blob(recordedChunks,{type:mime}));});
  // User should share the separate clean preview tab (opened with Open clean render tab).
  const start=performance.now();
  recorder.start(1000);
  setProgress(5,"Recording animation","Select the separate clean animation tab opened with “Open clean render tab”. Keep it visible.");
  while(performance.now()-start<duration*1000){
    const p=5+Math.min(84,((performance.now()-start)/(duration*1000))*84);
    setProgress(p,"Recording animation",`${Math.max(0,Math.ceil(duration-(performance.now()-start)/1000))} seconds remaining`);
    await wait(250);
    if(recorder.state!=="recording")break;
  }
  if(recorder.state==="recording")recorder.stop();
  const webm=await dataPromise;
  stream.getTracks().forEach(t=>t.stop());
  if(!outputMp4){downloadBlob(webm,`motionforge-${Date.now()}.webm`);setProgress(100,"WebM ready",`${(webm.size/1024/1024).toFixed(1)} MB downloaded.`);return;}
  setProgress(88,"Converting to MP4","Loading FFmpeg in your browser. This can take a while on mobile.");
  const mp4=await convertWebmToMp4(webm,width,height,fps,Number($("quality").value));
  downloadBlob(mp4,`motionforge-${width}x${height}-${fps}fps.mp4`);
  setProgress(100,"MP4 export complete",`${(mp4.size/1024/1024).toFixed(1)} MB · H.264 MP4`);
}

async function loadFFmpeg(){
  if(ffmpegInstance)return ffmpegInstance;
  if(ffmpegLoading)return ffmpegLoading;
  ffmpegLoading=(async()=>{
    if(!window.FFmpegWASM||!window.FFmpegUtil)throw new Error("FFmpeg libraries did not load. Check your internet connection and reload.");
    const {FFmpeg}=window.FFmpegWASM;const {toBlobURL}=window.FFmpegUtil;
    const ff=new FFmpeg();
    ff.on("progress",({progress})=>setProgress(90+Math.min(8,progress*8),"Converting to MP4","Encoding H.264 video…"));
    const base="https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ff.load({coreURL:await toBlobURL(`${base}/ffmpeg-core.js`,"text/javascript"),wasmURL:await toBlobURL(`${base}/ffmpeg-core.wasm`,"application/wasm")});
    ffmpegInstance=ff;return ff;
  })();
  try{return await ffmpegLoading;}finally{ffmpegLoading=null;}
}
async function convertWebmToMp4(blob,width,height,fps,crf){
  const ff=await loadFFmpeg();const {fetchFile}=window.FFmpegUtil;
  const input="input.webm",output="output.mp4";
  await ff.writeFile(input,await fetchFile(blob));
  await ff.exec(["-i",input,"-an","-vf",`scale=${width}:${height}:flags=lanczos,fps=${fps}`,"-c:v","libx264","-preset","ultrafast","-crf",String(crf),"-pix_fmt","yuv420p","-movflags","+faststart",output]);
  const data=await ff.readFile(output);
  try{await ff.deleteFile(input);await ff.deleteFile(output)}catch(e){}
  return new Blob([data.buffer],{type:"video/mp4"});
}

async function cloudRender(outputMp4){
 const baseUrl=$("cloudUrl").value.trim().replace(/\/+$/,""),token=$("cloudToken").value.trim();
 if(!baseUrl)throw new Error("Enter your cloud render server URL first.");
 if(!token)throw new Error("Enter your private Cloud API token first.");
 const duration=Math.max(3,Math.min(60,Number($("duration").value)||10));
 const payload={html:$("htmlCode").value,width:dimensions().width,height:dimensions().height,fps:Number($("fps").value),duration,format:outputMp4?"mp4":"webm",quality:Number($("quality").value),background:$("background").value};
 setProgress(4,"Sending render job","Cloud server is preparing Chromium and rendering your frames.");
 const response=await fetch(`${baseUrl}/render`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(payload)});
 if(!response.ok){let detail=`Cloud renderer returned HTTP ${response.status}.`;try{const body=await response.json();if(body.error)detail=body.error;}catch(e){}throw new Error(detail);}
 const blob=await response.blob();if(!blob.size)throw new Error("Cloud server returned an empty video.");
 const ext=outputMp4?"mp4":"webm";downloadBlob(blob,`motionforge-cloud-${dimensions().width}x${dimensions().height}-${$("fps").value}fps.${ext}`);
 setProgress(100,"Cloud render complete",`${(blob.size/1024/1024).toFixed(1)} MB · ${ext.toUpperCase()} downloaded.`);
}
async function testCloud(){
 const baseUrl=$("cloudUrl").value.trim().replace(/\/+$/,""),token=$("cloudToken").value.trim();
 if(!baseUrl||!token){setMessage("Enter the Cloud API URL and token first.",true);return;}
 try{const r=await fetch(`${baseUrl}/health`,{headers:{"Authorization":`Bearer ${token}`}});const data=await r.json();if(!r.ok)throw new Error(data.error||`HTTP ${r.status}`);setMessage(`Cloud server connected: ${data.service||"MotionForge Renderer"} · FFmpeg ${data.ffmpeg||"available"}.`);}
 catch(e){setMessage(`Cloud connection failed: ${e.message}. Check URL, token and CORS settings.`,true);}
}
 else{
  await cloudRender(mp4);
 }
    setMessage("Export finished. Review the file's visual quality, technical properties and licensing before submitting to a stock marketplace.");
  }catch(e){setMessage(e.message||String(e),true);setProgress(0,"Export stopped",e.message||String(e));}
  finally{$("exportBtn").disabled=false;$("webmBtn").disabled=false;}
}

$("loadTemplate").onclick=()=>loadTemplate($("templateSelect").value);
$("resetCode").onclick=()=>loadTemplate(currentTemplate);
$("updatePreview").onclick=updatePreview;
$("refreshPreview").onclick=updatePreview;
$("openCleanPreview").onclick=()=>{const blob=new Blob([$("htmlCode").value],{type:"text/html"});const url=URL.createObjectURL(blob);const tab=window.open(url,"_blank");if(!tab){URL.revokeObjectURL(url);setMessage("Allow pop-ups for this site, then open the clean preview again.",true);return;}setMessage("Clean animation opened in a new tab. Select that tab in the browser share dialog when exporting.");setTimeout(()=>URL.revokeObjectURL(url),10*60*1000);};
$("copyCode").onclick=async()=>{try{await navigator.clipboard.writeText($("htmlCode").value);setMessage("HTML copied to clipboard.");}catch(e){setMessage("Clipboard permission unavailable.",true);}};
$("exportBtn").onclick=()=>exportVideo(true);
$("webmBtn").onclick=()=>exportVideo(false);
$("saveCloud").onclick=()=>{localStorage.setItem("motionforge-cloud-url",$("cloudUrl").value.trim());localStorage.setItem("motionforge-cloud-token",$("cloudToken").value.trim());setMessage("Cloud settings saved in this browser. Keep your token private.");};
$("testCloud").onclick=testCloud;
$("resolution").onchange=()=>{$("previewSize").textContent=$("resolution").value.replace("x","×");};
document.querySelectorAll("[data-template]").forEach(el=>el.addEventListener("click",()=>loadTemplate(el.dataset.template)));
$("cloudUrl").value=localStorage.getItem("motionforge-cloud-url")||"";
$("cloudToken").value=localStorage.getItem("motionforge-cloud-token")||"";
loadTemplate("leaves");
