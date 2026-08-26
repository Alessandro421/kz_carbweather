const CLOUD_URL='https://izcubkmwgcbalrqqymlv.supabase.co';
const CLOUD_KEY='sb_publishable_RviwW29xv4WHoTCvcY_U6A_4wiaCZ_6';
let cloud=null, cloudUser=null;

function cloudStatus(text,cls=''){
  const el=document.getElementById('cloudStatus');
  if(el){el.textContent=text;el.className='cloudStatus '+cls}
}

function cloudPanel(){
  const mount=document.querySelector('.headerDataTools')||document.querySelector('header');
  if(!mount||document.getElementById('cloudBox'))return;
  const box=document.createElement('div');
  box.id='cloudBox';
  box.className='cloudBox';
  box.innerHTML=`
    <button id="cloudBtn" class="cloudChip" type="button" title="KZ Cloud">
      ☁ <span id="cloudIdentity">KZ CLOUD</span> · <span id="cloudStatus">LOGIN</span>
    </button>
    <div id="cloudMenu" class="cloudMenu">
      <div class="cloudTitle">KZ CLOUD</div>

      <div id="cloudLoginBlock">
        <div class="cloudSectionLabel">ACCESSO</div>
        <input id="cloudEmail" type="email" placeholder="Email" autocomplete="email">
        <input id="cloudPassword" type="password" placeholder="Password" autocomplete="current-password">
        <div class="cloudActions">
          <button class="btn" id="cloudLogin">Login</button>
          <button class="btn2" id="cloudSignup">Crea account</button>
        </div>
      </div>

      <div id="cloudConnectedBlock" hidden>
        <div class="cloudUserCard">
          <div>
            <div class="cloudSectionLabel">CONNESSO COME</div>
            <div id="cloudUserEmail" class="cloudUserEmail">—</div>
          </div>
          <span class="cloudOnlineDot">ONLINE</span>
        </div>

        <div class="cloudSectionLabel cloudArchiveTitle">ARCHIVIO CLOUD</div>
        <div class="cloudArchiveStats">
          <div><span class="cloudStatLabel">BASELINE</span><strong id="cloudBaselineCount">—</strong></div>
          <div><span class="cloudStatLabel">TRACK LOG</span><strong id="cloudLogCount">—</strong></div>
          <div><span class="cloudStatLabel">ALFANO</span><strong id="cloudSessionCount">—</strong></div>
          <div><span class="cloudStatLabel">GIRI</span><strong id="cloudLapCount">—</strong></div>
        </div>
        <div id="cloudRecentSessions" class="cloudRecentSessions">
          <div class="note">Caricamento archivio…</div>
        </div>
        <div class="cloudStorageNote">Supabase · EU Central · dati privati del tuo account</div>
      </div>

      <div id="cloudLoggedActions" class="cloudActions" hidden>
        <button class="btn" id="cloudSync">Sync ora</button>
        <button class="btnDanger" id="cloudLogout">Logout</button>
      </div>
      <div class="note" id="cloudMsg">Login per sincronizzare PC e smartphone.</div>
    </div>`;
  mount.prepend(box);
  document.getElementById('cloudBtn').onclick=()=>document.getElementById('cloudMenu').classList.toggle('open');
  document.getElementById('cloudLogin').onclick=cloudLogin;
  document.getElementById('cloudSignup').onclick=cloudSignup;
  document.getElementById('cloudLogout').onclick=cloudLogout;
  document.getElementById('cloudSync').onclick=syncAllCloud;
}

function cloudMsg(t){const e=document.getElementById('cloudMsg');if(e)e.textContent=t}

async function initCloud(){
  cloudPanel();
  if(!window.supabase){cloudStatus('NON DISPONIBILE','bad');return}
  cloud=window.supabase.createClient(CLOUD_URL,CLOUD_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
  const {data:{session}}=await cloud.auth.getSession();
  cloudUser=session?.user||null;
  updateCloudUI();
  cloud.auth.onAuthStateChange((_e,s)=>{
    cloudUser=s?.user||null;
    updateCloudUI();
    if(cloudUser)syncAllCloud();
  });
  wrapCloudHooks();
}

function updateCloudUI(){
  const logged=!!cloudUser;
  const loginBlock=document.getElementById('cloudLoginBlock');
  const connectedBlock=document.getElementById('cloudConnectedBlock');
  const loggedActions=document.getElementById('cloudLoggedActions');
  const identity=document.getElementById('cloudIdentity');
  const userEmail=document.getElementById('cloudUserEmail');
  const btn=document.getElementById('cloudBtn');

  if(loginBlock)loginBlock.hidden=logged;
  if(connectedBlock)connectedBlock.hidden=!logged;
  if(loggedActions)loggedActions.hidden=!logged;

  if(logged){
    const email=cloudUser.email||'Utente';
    const short=email.includes('@')?email.split('@')[0]:email;
    if(identity)identity.textContent=short;
    if(userEmail)userEmail.textContent=email;
    if(btn)btn.title=`KZ Cloud · ${email}`;
    cloudStatus('ONLINE','good');
    cloudMsg('Cloud connesso. I dati sono sincronizzati con il tuo account.');
    refreshCloudArchive();
  }else{
    if(identity)identity.textContent='KZ CLOUD';
    if(userEmail)userEmail.textContent='—';
    if(btn)btn.title='KZ Cloud · Login';
    cloudStatus('LOGIN','');
    cloudMsg('Login per sincronizzare PC e smartphone.');
  }
}

async function cloudLogin(){
  const email=document.getElementById('cloudEmail').value.trim(),password=document.getElementById('cloudPassword').value;
  if(!email||!password)return cloudMsg('Inserisci email e password.');
  cloudMsg('Login…');
  const {error}=await cloud.auth.signInWithPassword({email,password});
  cloudMsg(error?error.message:'Connesso. Sincronizzazione in corso…');
}

async function cloudSignup(){
  const email=document.getElementById('cloudEmail').value.trim(),password=document.getElementById('cloudPassword').value;
  if(!email||password.length<6)return cloudMsg('Email valida e password di almeno 6 caratteri.');
  cloudMsg('Creazione account…');
  const {data,error}=await cloud.auth.signUp({email,password});
  if(error)return cloudMsg(error.message);
  cloudMsg(data.session?'Account creato e connesso.':'Account creato. Controlla la mail di conferma, poi fai login.');
}

async function cloudLogout(){
  await cloud.auth.signOut();
  cloudUser=null;
  updateCloudUI();
}

async function refreshCloudArchive(){
  if(!cloudUser||!cloud)return;
  const uid=cloudUser.id;
  try{
    const [baselineQ,logsQ,sessionsQ,lapsQ,recentQ]=await Promise.all([
      cloud.from('baselines').select('id',{count:'exact',head:true}).eq('user_id',uid),
      cloud.from('track_logs').select('id',{count:'exact',head:true}).eq('user_id',uid),
      cloud.from('alfano_sessions').select('id',{count:'exact',head:true}).eq('user_id',uid),
      cloud.from('alfano_laps').select('id',{count:'exact',head:true}).eq('user_id',uid),
      cloud.from('alfano_sessions').select('session_name,source_file,place,session_date,created_at,summary').eq('user_id',uid).order('created_at',{ascending:false}).limit(5)
    ]);
    const setCount=(id,q)=>{const e=document.getElementById(id);if(e)e.textContent=q.error?'—':String(q.count??0)};
    setCount('cloudBaselineCount',baselineQ);
    setCount('cloudLogCount',logsQ);
    setCount('cloudSessionCount',sessionsQ);
    setCount('cloudLapCount',lapsQ);

    const recent=document.getElementById('cloudRecentSessions');
    if(!recent)return;
    if(recentQ.error){recent.innerHTML='<div class="note error">Archivio non disponibile.</div>';return}
    const rows=recentQ.data||[];
    if(!rows.length){recent.innerHTML='<div class="cloudEmptyArchive">Nessuna sessione ALFANO salvata.</div>';return}
    recent.innerHTML=rows.map(s=>{
      const name=s.session_name||s.source_file||'Sessione ALFANO';
      const dt=s.session_date||s.created_at;
      const date=dt?new Date(dt).toLocaleString('it-IT',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
      const best=s.summary?.best;
      const bestTime=best&&Number.isFinite(Number(best.time))&&typeof msToLap==='function'?msToLap(Number(best.time)):'';
      const egtMin=best&&Number.isFinite(Number(best.validMin))?Math.round(Number(best.validMin)):null;
      const egtMax=best&&Number.isFinite(Number(best.max))?Math.round(Number(best.max)):null;
      const details=[s.place,date,best?`Best L${best.lap}${bestTime?' · '+bestTime:''}`:'',egtMin!==null&&egtMax!==null?`EGT ${egtMin}–${egtMax}°`:'' ].filter(Boolean).join(' · ');
      return `<div class="cloudSessionRow"><strong title="${esc(name)}">${esc(name)}</strong><span>${esc(details||'Riepilogo sessione salvato')}</span></div>`;
    }).join('');
  }catch(e){
    const recent=document.getElementById('cloudRecentSessions');
    if(recent)recent.innerHTML='<div class="note error">Errore lettura archivio cloud.</div>';
  }
}

async function saveBaselineCloud(){
  if(!cloudUser)return;
  const data=baselineObj();
  await cloud.from('baselines').upsert({user_id:cloudUser.id,name:'Default',data},{onConflict:'user_id,name'});
}

async function pullBaselineCloud(){
  if(!cloudUser)return;
  const {data}=await cloud.from('baselines').select('data').eq('user_id',cloudUser.id).eq('name','Default').maybeSingle();
  if(data?.data){
    Object.entries(data.data).forEach(([k,v])=>{if(document.getElementById(k))document.getElementById(k).value=v});
    localStorage.setItem('cw_baseline',JSON.stringify(data.data));
    loadNeedleGeometry('b');
    calcCorrection();
  }
}

async function syncLogsCloud(){
  if(!cloudUser)return;
  let logs=JSON.parse(localStorage.getItem('cw_logs')||'[]');
  let changed=false;
  for(const x of logs){
    if(!x._cloud_id){x._cloud_id=crypto.randomUUID();changed=true}
    await cloud.from('track_logs').upsert({user_id:cloudUser.id,client_key:x._cloud_id,event_date:x.date||null,place:x.place||null,data:x,notes:x.notes||null},{onConflict:'user_id,client_key'});
  }
  if(changed)localStorage.setItem('cw_logs',JSON.stringify(logs));
  const {data}=await cloud.from('track_logs').select('client_key,data').eq('user_id',cloudUser.id).order('created_at',{ascending:true});
  if(data){
    const map=new Map(logs.map(x=>[x._cloud_id,x]));
    data.forEach(r=>{const x=r.data||{};x._cloud_id=r.client_key;map.set(r.client_key,x)});
    logs=[...map.values()];
    localStorage.setItem('cw_logs',JSON.stringify(logs));
    renderLogs();
  }
}

async function saveTelemetryCloud(){
  if(!cloudUser||!window.telemetryData||telemetryData.type!=='alfano7')return;
  const t=telemetryData,key=t.filename||crypto.randomUUID();
  const summary={best:t.best?{lap:t.best.lap,time:t.best.time,min:t.best.min,validMin:t.best.validMin,max:t.best.max}:null,low:t.low,high:t.high,stats:t.stats};
  const {data:s,error}=await cloud.from('alfano_sessions').upsert({
    user_id:cloudUser.id,
    client_key:key,
    session_name:key,
    source_file:key,
    place:weather?.label||val('logPlace')||null,
    session_date:new Date().toISOString(),
    summary
  },{onConflict:'user_id,client_key'}).select('id').single();
  if(error||!s)return;
  const laps=(t.lapStats||[]).map(x=>({session_id:s.id,user_id:cloudUser.id,lap_no:x.lap,lap_time_ms:Number.isFinite(x.time)?Math.round(x.time):null,egt_min_raw:x.min,egt_min_valid:x.validMin,egt_max:x.max,water_min:x.waterMin,water_max:x.waterMax,rpm_max:x.rpmMax,speed_max:x.speedMax,above_target_pct:x.above}));
  if(laps.length)await cloud.from('alfano_laps').upsert(laps,{onConflict:'session_id,lap_no'});
}

async function syncAllCloud(){
  if(!cloudUser)return cloudMsg('Fai login prima.');
  cloudStatus('SYNC…');
  try{
    await saveBaselineCloud();
    await pullBaselineCloud();
    await syncLogsCloud();
    await saveTelemetryCloud();
    await refreshCloudArchive();
    cloudStatus('ONLINE','good');
    cloudMsg('Sincronizzazione completata.');
  }catch(e){
    cloudStatus('ERRORE','bad');
    cloudMsg(e.message||'Errore sync');
  }
}

function wrapCloudHooks(){
  if(typeof saveBaseline==='function'&&!saveBaseline._cloudWrapped){const o=saveBaseline;window.saveBaseline=function(){const r=o.apply(this,arguments);saveBaselineCloud().then(refreshCloudArchive);return r};window.saveBaseline._cloudWrapped=true}
  if(typeof addLog==='function'&&!addLog._cloudWrapped){const o=addLog;window.addLog=function(){const r=o.apply(this,arguments);syncLogsCloud().then(refreshCloudArchive);return r};window.addLog._cloudWrapped=true}
  if(typeof importAlfanoZip==='function'&&!importAlfanoZip._cloudWrapped){const o=importAlfanoZip;window.importAlfanoZip=async function(){const r=await o.apply(this,arguments);await saveTelemetryCloud();await refreshCloudArchive();return r};window.importAlfanoZip._cloudWrapped=true}
}

setTimeout(initCloud,0);
