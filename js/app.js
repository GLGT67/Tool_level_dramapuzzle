
(()=>{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const deep=o=>JSON.parse(JSON.stringify(o));
const uid=p=>p+Math.random().toString(36).slice(2,8);

const EMOTION_GROUPS={
  "Bình thường / thái độ":[
    ["😐","Bình thường"],["😑","Cạn lời"],["😶","Im lặng"],["😒","Khó chịu / chán"],["🙄","Đảo mắt / chán ngán"],["😏","Cười nhếch / đắc ý"],["😬","Gượng gạo / căng cứng"]
  ],
  "Vui / tích cực":[
    ["😊","Vui nhẹ / thân thiện"],["😀","Vui rõ"],["😂","Cười lớn"],["😅","Cười ngượng"],["😉","Nháy mắt / tinh nghịch"],["😜","Trêu chọc"],["😌","Nhẹ nhõm / mãn nguyện"]
  ],
  "Thích / tình cảm":[
    ["😍","Mê / thích mạnh"],["🥰","Yêu thương / trìu mến"],["😘","Tán tỉnh / hôn gió"],["🤩","Phấn khích / ngưỡng mộ"]
  ],
  "Suy nghĩ / nghi ngờ":[
    ["🤔","Suy nghĩ"],["🤨","Nghi ngờ"],["😕","Bối rối / không hiểu"]
  ],
  "Buồn / lo lắng":[
    ["😔","Buồn"],["😟","Lo lắng"],["🥺","Tủi thân / nài nỉ"],["😢","Khóc nhẹ"],["😭","Khóc nức nở"]
  ],
  "Giận / ghét":[
    ["😤","Hậm hực / tức tối"],["😠","Giận"],["😡","Rất giận"],["😈","Ác ý / tinh quái"]
  ],
  "Bất ngờ / sợ":[
    ["😮","Ngạc nhiên"],["😳","Sững người / bất ngờ ngượng"],["🤯","Sốc cực độ"],["😨","Sợ hãi"],["😰","Hoảng / căng thẳng"],["😱","Kinh hoàng"]
  ],
  "Mệt / bất ổn":[
    ["😩","Kiệt sức / quá tải"],["🥱","Buồn ngủ / ngáp"],["😴","Ngủ"],["😵","Choáng / ngất"],["😵‍💫","Chóng mặt / quay cuồng"],["🥴","Say / lâng lâng"],["🤢","Buồn nôn"]
  ],
  "Pose phản ứng đặc biệt":[
    ["🤭","Cười che miệng / biết chuyện"],["🫢","Sốc che miệng"],["🤫","Giữ bí mật / ra hiệu im lặng"],["🫣","Ngại hoặc sợ nhưng vẫn hé nhìn"]
  ]
};
const EMOTION_INFO=Object.fromEntries(Object.values(EMOTION_GROUPS).flat().map(([emoji,name])=>[emoji,{emoji,name}]));
const LEGACY_EMOTION_REPLACEMENTS={
  "😃":"😀","😄":"😀","😁":"😀","😆":"😂","🤣":"😂","😇":"😊","🙂":"😊","🙃":"😬",
  "😗":"😘","😙":"😘","😚":"😘","😋":"😊","😛":"😜","😝":"😜","🤪":"😜","🥳":"🤩",
  "🧐":"🤨","🤓":"🤔","😎":"😏","🥸":"😐","🫡":"😐",
  "😞":"😔","🙁":"😔","☹️":"😔","😣":"😩","😖":"😩","😫":"😩",
  "🤬":"😡","👿":"😈",
  "🥵":"😰","🥶":"😰","😥":"😢","😓":"😰","😯":"😮","😦":"😨","😧":"😨","😲":"😮",
  "🫥":"😶","🫠":"😬","🤐":"😶","😪":"🥱","🤤":"😍",
  "🤮":"🤢","🤧":"😩","😷":"😩","🤒":"😩","🤕":"😩","🤑":"🤩","🤠":"😀"
};
function normalizeEmotionEmoji(v,allowEmpty=false){
  const raw=String(v??"").trim();
  if(!raw)return allowEmpty?"":"😐";
  if(EMOTION_INFO[raw])return raw;
  if(LEGACY_EMOTION_REPLACEMENTS[raw])return LEGACY_EMOTION_REPLACEMENTS[raw];
  if(["Neutral","neutral","Bình thường","Normal","NORMAL"].includes(raw))return "😐";
  return allowEmpty?"":"😐";
}
function emotionName(v){
  const raw=String(v??"").trim();
  if(!raw)return "Không đổi / giữ biểu cảm hiện tại";
  const emoji=normalizeEmotionEmoji(raw,true);
  return EMOTION_INFO[emoji]?.name||"Không đổi / giữ biểu cảm hiện tại";
}
const GAZES=["AUTO","NONE","1","2","3","4","5","6","7","8","9","10","11","12"];
const SYMBOLS=["","❤️","💔","💕","💞","💓","💗","💖","💘","💢","💥","⚡","❗","❓","‼️","⁉️","💦","💧","✨","🌟","🔥","❄️","💨","💤","🎵","🎶","👀","🫶","👍","👎","👏","📷","🎯"];

const VERDICT_SUGGESTIONS=[
  ["CALL THEM OUT","vạch mặt / gọi thẳng họ ra"],
  ["EXPOSE HIM","bóc phốt hắn"],
  ["EXPOSE HER","bóc phốt cô ta"],
  ["KICK HIM OUT","đuổi hắn đi"],
  ["KICK HER OUT","đuổi cô ta đi"],
  ["CONFRONT HIM","đối chất hắn"],
  ["CONFRONT HER","đối chất cô ta"],
  ["TELL EVERYONE","nói cho tất cả biết"],
  ["STOP THEM","ngăn họ lại"],
  ["MATCH THEM UP","ghép đôi họ"],
  ["CHEER THEM ON","cổ vũ họ"],
  ["FORGIVE HIM","tha thứ hắn"],
  ["FORGIVE HER","tha thứ cô ta"]
];
const ENDING_TITLE="DRAMA SOLVED!", ENDING_SKIP="LET IT GO", ENDING_REWARD_COINS=30, ENDING_NORMAL_COINS=15;
function blankEnding(){return {imageBrief:"",endingLine:"",verdictCta:"",verdictMeaningVi:"",imageAssetId:"ENDING01",imageSrc:"",rewardCoins:ENDING_REWARD_COINS,normalRewardCoins:ENDING_NORMAL_COINS}}
function endingPrompt(brief){return `Create a clean, funny mobile-puzzle ending illustration in a simple anime/manhwa cartoon style.

Aspect ratio: 4:3 horizontal.

Show a single dramatic moment clearly and quickly.

Scene: ${String(brief||"[DESCRIBE THE CORE DRAMA MOMENT]").trim()}

Focus on the key characters only.
Use exaggerated facial expressions and clear body language.
Keep the image easy to read on a mobile screen.

Clean line art, simple shapes, controlled colors, polished but not overly glossy.
The illustration should feel playful, dramatic, and slightly ridiculous.
Avoid a messy generic AI look.

No text, no speech bubbles, no UI.
Keep the background simple and only support the main drama moment.`}

const NAME_POOLS={
  MALE:[
    "Adam","Aiden","Alan","Alex","Asher","Blake","Brian","Caleb","Carl","Cole",
    "Colin","David","Dean","Derek","Dylan","Eli","Ethan","Evan","Felix","Finn",
    "Frank","Gavin","Grant","Henry","Hugo","Ian","Isaac","Jack","James","Jason",
    "Jay","Joel","John","Jonah","Kai","Kevin","Leo","Leon","Liam","Logan",
    "Louis","Lucas","Luke","Mark","Mason","Max","Miles","Noah","Nolan","Oscar",
    "Owen","Paul","Peter","Quinn","Ray","Ryan","Sam","Scott","Sean","Simon",
    "Theo","Toby","Wyatt"
  ],
  FEMALE:[
    "Alice","Amy","Anna","Aria","Ava","Bella","Beth","Chloe","Clara","Daisy",
    "Diana","Elise","Ella","Ellie","Emily","Emma","Eva","Faith","Fiona","Grace",
    "Hazel","Iris","Jane","Julia","Kara","Kate","Kayla","Laura","Layla","Leah",
    "Lena","Lily","Lucy","Luna","Maya","May","Mia","Mila","Naomi","Nina",
    "Nora","Paige","Riley","Rose","Ruby","Sara","Sarah","Sofia","Tessa","Wendy",
    "Zoe","Cora","Eliza","Erin","Freya","June","Lila","Lola","Mabel","Megan",
    "Molly","Piper","Sadie"
  ],
  NEUTRAL:[
    "Alex","Avery","Blair","Casey","Kai","Lane","Logan","Quinn","Reese","Riley",
    "River","Robin","Rowan","Sage","Sam","Wren","Drew","Ellis","Jules","Kit",
    "Lake","Micah","Noel","Remy","Rory","Terry"
  ]
};

function editNameMap(){
  const map={};
  data.characters.forEach(c=>map[c.id]=c.name||c.id);
  return map;
}
function currentNameMap(){
  return mode==="play"&&play?.nameMap?play.nameMap:editNameMap();
}
function displayName(c){
  return currentNameMap()[c.id]||c.name||c.id;
}
function appearanceText(c){
  const a=c?.appearance;
  if(Array.isArray(a))return a.filter(x=>String(x??"").trim()).join("\n");
  return String(a??"");
}
function resolveTokens(str,map=currentNameMap()){
  return String(str??"").replace(/\{([^{}]+)\}/g,(m,id)=>map[id]||m);
}
function renameTokenRefs(str,oldId,newId){
  return String(str??"").split("{"+oldId+"}").join("{"+newId+"}");
}
function insertAtCursor(el,value){
  const s=el.selectionStart??el.value.length,e=el.selectionEnd??s;
  el.value=el.value.slice(0,s)+value+el.value.slice(e);
  const p=s+value.length;
  el.setSelectionRange(p,p);
  el.dispatchEvent(new Event("input",{bubbles:true}));
  el.focus();
}
function tokenizeKnownNames(str){
  let out=String(str??"");
  const chars=sortedCharacters().filter(c=>c.name&&c.name.trim()).sort((a,b)=>b.name.length-a.name.length);
  chars.forEach(c=>{
    const escaped=c.name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    const re=new RegExp("(^|[^A-Za-zÀ-ỹ0-9_])("+escaped+")(?=$|[^A-Za-zÀ-ỹ0-9_])","g");
    out=out.replace(re,(m,prefix)=>prefix+"{"+c.id+"}");
  });
  return out;
}
function pickUniqueName(pool,used,avoid=""){
  const candidates=(NAME_POOLS[pool]||[]).filter(n=>!used.has(n));
  if(!candidates.length)return null;
  const different=candidates.filter(n=>n!==avoid);
  const poolToPick=different.length?different:candidates;
  return poolToPick[Math.floor(Math.random()*poolToPick.length)];
}
function buildPlayNameMap(randomize,avoidMap=null){
  const map={},used=new Set();
  sortedCharacters().forEach(c=>{
    let name=c.name||c.id;
    if(randomize){
      const pool=(c.namePool&&c.namePool!=="KEEP")?c.namePool:inferGender(c);
      const picked=pickUniqueName(pool,used,avoidMap?.[c.id]||"");
      if(picked)name=picked;
    }
    if(used.has(name)){
      let i=2,base=name;
      while(used.has(base+" "+i))i++;
      name=base+" "+i;
    }
    used.add(name);
    map[c.id]=name;
  });
  return map;
}

function blankLevelArt(){
  return {
    backgroundAssetId:"BG01",
    backgroundDescription:"",
    tone:"",
    artistNote:"",
    referenceNote:"",
    sceneItems:[]
  };
}
function blankSceneArtItem(){
  return {id:uid("ART_"),name:"",description:"",exportMode:"BAKED_BG",assetId:"BG01",artistNote:""};
}
function blank(){
  return {level:{id:"",version:"1.0",hook:"",difficultyTarget:"",difficultySelf:"",difficultyAmbiguity:"",difficultyCombine:"",difficultyTested:false,reveal:"",revealWhen:[],revealParentClueId:"",truth:"",art:blankLevelArt(),ending:blankEnding()},images:[],characters:[],clues:[],annotations:[],drawing:{visibleInPlay:true,strokes:[],dataUrl:""}};
}
function blankSceneEvidence(){
  return {id:"",text:"",affects:[]};
}
function blankInitial(){
  return {enabled:false,emotion:"😐",gaze:"NONE",symbol:"",target:"",role:"Story",affects:[]};
}
function blankReactionStep(){
  return {id:uid("ST_"),assetId:"",emotion:"😐",symbol:"",gaze:"NONE",target:"",duration:0.6,hold:true};
}
function blankReactionEvent(triggerType="SELF_PLACED"){
  return {id:uid("RE_"),triggerType,triggerChars:[],steps:[blankReactionStep()]};
}

function normalizeGazeValue(g){
  const map={"↑":"12","↗":"2","→":"3","↘":"5","↓":"6","↙":"8","←":"9","↖":"11"};
  if(map[g])return map[g];
  if(g==="AUTO"||g==="NONE")return g;
  const n=parseInt(g,10);
  return n>=1&&n<=12?String(n):"NONE";
}
function inferGender(c){
  if(c.gender)return c.gender;
  if(c.namePool==="MALE")return "MALE";
  if(c.namePool==="FEMALE")return "FEMALE";
  return "UNSPECIFIED";
}
function reactionSettledStep(ev){
  return (ev?.steps||[]).find(st=>st.id===ev.settleStepId)||null;
}
function reactionSettledState(source,ev){
  return reactionSettledStep(ev)||initialStateRecord(source);
}
function runtimeInitialAssetId(c){
  return c.type==="M"?(c.assetTrayId||`${c.id}_TRAY`):(c.assetBaseId||`${c.id}_BASE`);
}

function nextReactionAssetId(c){
  let max=0;
  (c.reactionEvents||[]).forEach(ev=>(ev.steps||[]).forEach(st=>{
    const m=String(st.assetId||"").match(new RegExp("^"+c.id.replace(/[.*+?^${}()|[\\]\\]/g,"\\$&")+"_R(\\d+)$"));
    if(m)max=Math.max(max,parseInt(m[1],10)||0);
  }));
  return `${c.id}_R${String(max+1).padStart(2,"0")}`;
}
function ensureCharacterAssetIds(c){
  c.gender=inferGender(c);
  c.age=c.age||"";
  c.artistNote=c.artistNote||"";
  c.baseExpression=normalizeEmotionEmoji(c.baseExpression||"😐");
  c.assetBaseId=c.assetBaseId||`${c.id}_BASE`;
  c.assetTrayId=c.type==="M"?(c.assetTrayId||`${c.id}_TRAY`):"";
  (c.reactionEvents||[]).forEach(ev=>(ev.steps||[]).forEach(st=>{
    if(!st.assetId)st.assetId=nextReactionAssetId(c);
  }));
}
function remapCharacterAssetPrefix(c,oldId,newId){
  const fix=v=>String(v||"").startsWith(oldId+"_")?newId+String(v).slice(oldId.length):v;
  c.assetBaseId=fix(c.assetBaseId)||`${newId}_BASE`;
  c.assetTrayId=c.type==="M"?(fix(c.assetTrayId)||`${newId}_TRAY`):"";
  (c.reactionEvents||[]).forEach(ev=>(ev.steps||[]).forEach(st=>st.assetId=fix(st.assetId)));
}
function nextSceneAssetId(prefix){
  const used=new Set();
  const art=data?.level?.art;
  if(art?.backgroundAssetId)used.add(art.backgroundAssetId);
  (art?.sceneItems||[]).forEach(x=>x.assetId&&used.add(x.assetId));
  let n=1,id="";
  do{id=prefix+String(n++).padStart(2,"0")}while(used.has(id));
  return id;
}
function syncSceneItemAssetId(item){
  const art=data.level.art;
  if(item.exportMode==="BAKED_BG"){item.assetId=art.backgroundAssetId||"BG01";return}
  const prefix=item.exportMode==="FOREGROUND"?"FG":"OBJ";
  if(!item.assetId||item.assetId===(art.backgroundAssetId||"BG01")||!String(item.assetId).startsWith(prefix))item.assetId=nextSceneAssetId(prefix);
}

function sceneLayerItems(d=data){
  return [
    ...(d.images||[]).map(o=>({type:"image",obj:o})),
    ...(d.annotations||[]).map(o=>({type:"annotation",obj:o}))
  ];
}
function normalizeSceneZData(d=data){
  const items=sceneLayerItems(d).sort((a,b)=>{
    const za=Number(a.obj.z)||0,zb=Number(b.obj.z)||0;
    if(za!==zb)return za-zb;
    return 0;
  });
  items.forEach((item,idx)=>item.obj.z=10+idx);
  return items;
}
function moveSceneLayer(type,obj,action){
  const items=normalizeSceneZData();
  let idx=items.findIndex(x=>x.type===type&&x.obj===obj);
  if(idx<0)return;
  if(action==="front"&&idx<items.length-1){
    const [it]=items.splice(idx,1);items.push(it);
  }else if(action==="back"&&idx>0){
    const [it]=items.splice(idx,1);items.unshift(it);
  }else if(action==="forward"&&idx<items.length-1){
    [items[idx],items[idx+1]]=[items[idx+1],items[idx]];
  }else if(action==="backward"&&idx>0){
    [items[idx],items[idx-1]]=[items[idx-1],items[idx]];
  }
  items.forEach((item,k)=>item.obj.z=10+k);
}

function normalize(d){
  d=d||blank();
  d.level=d.level||blank().level;
  d.level.id=String(d.level.id||"").trim().toUpperCase();
  d.level.version=String(d.level.version||"1.0").trim()||"1.0";
  delete d.level.moves;
  d.images=(d.images||[]).filter(Boolean);
  d.characters=(d.characters||[]).filter(Boolean);
  d.clues=(d.clues||[]).filter(Boolean);
  const legacySceneEvidence=Array.isArray(d.sceneEvidence)?d.sceneEvidence:[];
  delete d.sceneEvidence;
  Object.defineProperty(d,"sceneEvidence",{value:[],writable:true,configurable:true,enumerable:false});
  d.annotations=(d.annotations||[]).filter(Boolean);
  d.level.revealWhen=d.level.revealWhen||[];
  d.level.revealParentClueId=String(d.level.revealParentClueId||"").trim().toUpperCase();
  d.level.difficultyTarget=["EASY","MEDIUM","HARD"].includes(d.level.difficultyTarget)?d.level.difficultyTarget:"";
  d.level.difficultySelf=["EASY","MEDIUM","HARD"].includes(d.level.difficultySelf)?d.level.difficultySelf:"";
  d.level.difficultyAmbiguity=["LOW","MEDIUM","HIGH"].includes(d.level.difficultyAmbiguity)?d.level.difficultyAmbiguity:"";
  d.level.difficultyCombine=["ONE","TWO","THREE_PLUS"].includes(d.level.difficultyCombine)?d.level.difficultyCombine:"";
  d.level.difficultyTested=d.level.difficultyTested===true;
  delete d.level.name;
  delete d.level.objective;
  delete d.level.playNameMode;
  d.level.ending={...blankEnding(),...(d.level.ending||{})};
  d.level.ending.imageBrief=String(d.level.ending.imageBrief||"");
  d.level.ending.endingLine=String(d.level.ending.endingLine||"");
  d.level.ending.verdictCta=String(d.level.ending.verdictCta||"").trim().toUpperCase();
  d.level.ending.verdictMeaningVi=String(d.level.ending.verdictMeaningVi||"");
  d.level.ending.imageAssetId=String(d.level.ending.imageAssetId||"ENDING01").trim().toUpperCase()||"ENDING01";
  d.level.ending.imageSrc=String(d.level.ending.imageSrc||"");
  d.level.ending.rewardCoins=ENDING_REWARD_COINS;
  d.level.ending.normalRewardCoins=ENDING_NORMAL_COINS;
  d.level.art={...blankLevelArt(),...(d.level.art||{})};
  d.level.art.backgroundAssetId=d.level.art.backgroundAssetId||"BG01";
  d.level.art.sceneItems=((d.level.art&&d.level.art.sceneItems)||[]).filter(Boolean);
  d.level.art.sceneItems.forEach(item=>{
    item.id=item.id||uid("ART_");
    item.name=item.name||"";item.description=item.description||"";item.artistNote=item.artistNote||"";
    item.exportMode=["BAKED_BG","SEPARATE","FOREGROUND"].includes(item.exportMode)?item.exportMode:"BAKED_BG";
    if(item.exportMode==="BAKED_BG")item.assetId=d.level.art.backgroundAssetId;
  });
  d.images=d.images.filter(i=>!(i&&i._blob));
  d.images.forEach(i=>{
    const fallback=(Number(i.w)>0&&Number(i.h)>0)?Number(i.w)/Number(i.h):1;
    i.aspectRatio=Number(i.aspectRatio)>0?Number(i.aspectRatio):fallback;
  });

  d.characters.forEach(c=>{
    c.answerSet=true;
    c.appearance=c.appearance||[];
    delete c.sceneTag;
    c.namePool=c.namePool||"KEEP";
    c.gender=inferGender(c);
    c.age=c.age||"";
    c.artistNote=c.artistNote||"";
    c.baseExpression=normalizeEmotionEmoji(c.baseExpression||"😐");
    c.baseGaze=normalizeGazeValue(c.baseGaze||"NONE");
    c.baseTarget=String(c.baseTarget||"").trim().toUpperCase();
    delete c.baseAffects;
    delete c.solveRequires;
    delete c.solveByElimination;
    c.assetBaseId=c.assetBaseId||`${c.id}_BASE`;
    c.assetTrayId=c.type==="M"?(c.assetTrayId||`${c.id}_TRAY`):"";

    if(!Array.isArray(c.reactionEvents)){
      c.reactionEvents=[];

      if(c.initialReaction?.enabled){
        c.reactionEvents.push({
          id:uid("RE_"),
          triggerType:"START",
          triggerChars:[],
          role:c.initialReaction.role||"Story",
          affects:c.initialReaction.helps?[c.initialReaction.helps]:[],
          steps:[{
            id:uid("ST_"),
            emotion:c.initialReaction.emotion||"😐",
            symbol:c.initialReaction.symbol||"",
            gaze:c.initialReaction.gaze||"NONE",
            target:c.initialReaction.target||"",
            duration:0.6,
            hold:true
          }]
        });
      }

      (c.reactionStates||[]).forEach(r=>{
        const when=r.when||[];
        let triggerType="ALL_PLACED";
        let triggerChars=[...when];
        if(when.length===1&&when[0]===c.id){
          triggerType="SELF_PLACED";
          triggerChars=[];
        }else if(when.length===1){
          triggerType="CHAR_PLACED";
        }

        c.reactionEvents.push({
          id:uid("RE_"),
          triggerType,
          triggerChars,
          role:r.role||"Story",
          affects:r.helps?[r.helps]:[],
          steps:[{
            id:uid("ST_"),
            emotion:r.emotion||"😐",
            symbol:r.symbol||"",
            gaze:r.gaze||"NONE",
            target:r.target||"",
            duration:0.6,
            hold:true
          }]
        });
      });
    }

    const legacyStartEvents=(c.reactionEvents||[]).filter(ev=>ev.triggerType==="START");
    if(legacyStartEvents.length){
      const lastStart=legacyStartEvents[legacyStartEvents.length-1];
      const lastStep=lastStart?.steps?.[lastStart.steps.length-1];
      if(lastStep){
        c.baseExpression=normalizeEmotionEmoji(lastStep.emotion||c.baseExpression||"😐");
        c.baseGaze=normalizeGazeValue(lastStep.gaze||c.baseGaze||"NONE");
        c.baseTarget=String(lastStep.target||c.baseTarget||"").trim().toUpperCase();
        if(String(lastStep.assetId||"").trim())c.assetBaseId=String(lastStep.assetId).trim().toUpperCase();
      }
      c.reactionEvents=(c.reactionEvents||[]).filter(ev=>ev.triggerType!=="START");
    }

    c.reactionEvents.forEach(ev=>{
      ev.id=ev.id||uid("RE_");
      ev.triggerType=ev.triggerType||"SELF_PLACED";
      if(ev.triggerType==="START")ev.triggerType=c.type==="M"?"SELF_PLACED":"CHAR_PLACED";
      ev.triggerChars=ev.triggerChars||[];
      ev.settleStepId=ev.settleStepId||ev.steps[ev.steps.length-1]?.id||"INITIAL";
      delete ev.role;
      delete ev.affects;
      delete ev.helps;delete ev.solveRoute;delete ev.routeConfirmed;delete ev.requiresSolved;
      ev.steps=Array.isArray(ev.steps)&&ev.steps.length?ev.steps:[blankReactionStep()];
      ev.steps.forEach(st=>{
        st.id=st.id||uid("ST_");
        st.emotion=normalizeEmotionEmoji(st.emotion,true);
        st.symbol=st.symbol||"";
        st.gaze=normalizeGazeValue(st.gaze||"NONE");
        st.target=st.target||"";
        st.duration=Math.max(0.1,Number(st.duration)||0.6);
        st.hold=!!st.hold;
      });
    });
    ensureCharacterAssetIds(c);
  });

  enforceCharacterTypeIdsInDataset(d);

  const validMovableTriggerIds=new Set(d.characters.filter(c=>c.type==="M").map(c=>c.id));
  d.level.revealWhen=[...new Set((d.level.revealWhen||[]).filter(id=>validMovableTriggerIds.has(id)))];

  d.level.art.sceneItems.forEach(item=>{
    if(item.exportMode==="BAKED_BG")item.assetId=d.level.art.backgroundAssetId;
    else if(!item.assetId){
      const prefix=item.exportMode==="FOREGROUND"?"FG":"OBJ";
      const used=new Set(d.level.art.sceneItems.map(x=>x.assetId).filter(Boolean));
      let n=1,id="";do{id=prefix+String(n++).padStart(2,"0")}while(used.has(id));item.assetId=id;
    }
  });

  d.clues.forEach(c=>{
    c.resolveWhen=[...new Set((c.resolveWhen||[]).filter(id=>validMovableTriggerIds.has(id)))];
    delete c.affects;
    delete c.helps;delete c.solveRoute;delete c.routeConfirmed;delete c.requiresSolved;
    if(c.parent){
      c.preOpen=c.preOpen||(c.initial==="HIDDEN"?"HIDDEN":"LOCKED");
      if(!["LOCKED","HIDDEN"].includes(c.preOpen))c.preOpen="LOCKED";
    }else{
      c.preOpen="ACTIVE";
    }
  });

  if(d.level.revealParentClueId && !d.clues.some(cl=>cl.id===d.level.revealParentClueId))d.level.revealParentClueId="";

  d.annotations.forEach((a,idx)=>{
    a.type=a.type||"rect";
    a.x=Number(a.x)||100;a.y=Number(a.y)||100;
    const qslot=a.type==="qslot";
    a.w=Math.max(qslot?70:30,Number(a.w)||(qslot?108:180));a.h=Math.max(qslot?70:24,Number(a.h)||(qslot?108:100));
    a.fill=a.fill||"#f4f1f6";a.stroke=a.stroke||"#655d69";
    a.text=a.text??(a.type==="text"?"Note":"");
    a.fontSize=Number(a.fontSize)||28;
    a.textColor=a.textColor||"#514953";
    a.strokeWidth=Math.max(1,Number(a.strokeWidth)||4);
    a.arrowXDir=[-1,0,1].includes(Number(a.arrowXDir))?Number(a.arrowXDir):1;
    a.arrowYDir=[-1,0,1].includes(Number(a.arrowYDir))?Number(a.arrowYDir):1;
    if(a.arrowXDir===0&&a.arrowYDir===0)a.arrowXDir=1;
    a.locked=!!a.locked;
    a.visibleInPlay=("visibleInPlay" in a)?!!a.visibleInPlay:(a.type==="text"?false:true);
    a.rotation=((Number(a.rotation)||0)%360+360)%360;
    a.flipH=!!a.flipH;
    a.flipV=!!a.flipV;
    a.z=Number(a.z)||20+idx;
  });

  normalizeSceneZData(d);
  return d;
}

function adaptRuntimeToEditor(raw){
  if(!raw || typeof raw !== "object") return null;
  const isRuntime = typeof raw.schemaVersion === "string" && raw.schemaVersion.startsWith("drama-level-runtime");
  if(!isRuntime && !raw.characters) return null;

  const result = blank();
  if(raw.level){
    result.level.id = String(raw.level.id || "L001").trim().toUpperCase();
    result.level.version = String(raw.level.version || "1.0").trim();
    result.level.hook = String(raw.level.dramaHook || raw.level.hook || "").trim();
  }
  if(raw.dramaReveal){
    result.level.reveal = String(raw.dramaReveal.text || "").trim();
    result.level.revealParentClueId = String(raw.dramaReveal.parentClueId || "").trim().toUpperCase();
  }
  if(raw.scene && raw.scene.backgroundAssetId){
    result.level.art.backgroundAssetId = String(raw.scene.backgroundAssetId).trim();
  }

  if(Array.isArray(raw.characters)){
    result.characters = raw.characters.filter(Boolean).map((c, idx) => {
      const rawType = String(c.type || "M").trim().toUpperCase();
      const isFixed = rawType === "FIXED" || rawType === "F";
      const pos = c.correctPosition || c.position || { x: 140 + (idx % 4) * 200, y: 300 + Math.floor(idx / 4) * 200 };
      const posX = Number(pos.x);
      const posY = Number(pos.y);
      const fallbackId = isFixed ? `F${String(idx+1).padStart(2,"0")}` : `M${String(idx+1).padStart(2,"0")}`;

      return {
        id: String(c.id || fallbackId).trim().toUpperCase(),
        name: String(c.fixedName || c.name || c.id || "").trim(),
        type: isFixed ? "F" : "M",
        x: isFinite(posX) ? posX : 200,
        y: isFinite(posY) ? posY : 300,
        assetBaseId: String(c.assets?.base || `${c.id || fallbackId}_BASE`).trim(),
        assetTrayId: !isFixed ? String(c.assets?.tray || `${c.id || fallbackId}_TRAY`).trim() : "",
        namePool: c.namePool || "KEEP",
        reactionEvents: (c.reactionEvents || []).map(ev => ({
          id: uid("RE_"),
          triggerType: ev.whenPlaced ? (ev.whenPlaced.length === 1 && ev.whenPlaced[0] === c.id ? "SELF_PLACED" : "CHAR_PLACED") : (ev.triggerType || "SELF_PLACED"),
          triggerChars: Array.isArray(ev.whenPlaced) ? ev.whenPlaced : (ev.triggerChars || []),
          steps: (ev.steps || []).map(st => ({
            id: uid("ST_"),
            emotion: normalizeEmotionEmoji(st.emotion || "😐", true),
            symbol: st.symbol || "",
            gaze: normalizeGazeValue(st.gaze || "NONE"),
            target: st.target || "",
            duration: Math.max(0.1, Number(st.duration) || 0.6),
            hold: !!st.hold,
            assetId: String(st.assetId || "").trim()
          }))
        }))
      };
    });
  }

  if(Array.isArray(raw.clues)){
    result.clues = raw.clues.filter(Boolean).map((cl, idx) => ({
      id: String(cl.id || `CL${String(idx+1).padStart(2,"0")}`).trim().toUpperCase(),
      parent: cl.parentId || cl.parent || null,
      text: String(cl.text || "").trim(),
      preOpen: cl.startState === "HIDDEN" ? "HIDDEN" : (cl.startState === "LOCKED" ? "LOCKED" : (cl.preOpen || "ACTIVE")),
      resolveWhen: Array.isArray(cl.completeWhenPlaced) ? cl.completeWhenPlaced : (Array.isArray(cl.resolveWhen) ? cl.resolveWhen : [])
    }));
  }

  if(raw.ending || raw.level?.ending){
    const endSrc = raw.ending || raw.level?.ending || {};
    result.level.ending = {
      ...blankEnding(),
      imageBrief: String(endSrc.imageBrief || "").trim(),
      endingLine: String(endSrc.endingLine || "").trim(),
      verdictCta: String(endSrc.verdictCta || "").trim().toUpperCase(),
      imageAssetId: String(endSrc.imageAssetId || "ENDING01").trim().toUpperCase() || "ENDING01",
      imageSrc: String(endSrc.imageSrc || "").trim()
    };
  }

  return normalize(result);
}
window.adaptRuntimeToEditor = adaptRuntimeToEditor;

let data=normalize((()=>{try{return JSON.parse(localStorage.getItem("dramaEditorV1_1"))}catch(e){return null}})()||blank());
let selected={type:"level",id:"level"}, mode="edit", play=null, ctxId=null, ctxType="image", activeTool="select";
let multiSel=new Set();
let wrapBoundaryEnabled = localStorage.getItem("dramaEditorWrapBoundary") !== "false";
Object.defineProperty(window, "data", { get() { return data; }, set(v) { data = v; }, configurable: true });
Object.defineProperty(window, "selected", { get() { return selected; }, set(v) { selected = v; }, configurable: true });
Object.defineProperty(window, "mode", { get() { return mode; }, set(v) { mode = v; }, configurable: true });
window.normalize = normalize;
window.adaptRuntimeToEditor = adaptRuntimeToEditor;
window.multiSel = multiSel;
window.createAnnotation = createAnnotation;
window.refreshImmediate = () => refreshImmediate();
window.saveProjectFile = saveProjectFile;
let undoStack=[], redoStack=[], lastSnapshot=JSON.stringify(data);
let projectFileHandle=null, sceneClipboard=null, playSession=0;
const PLAY_PROGRESS_KEY="dramaEditorPlayProgressV127Lives";

function persistRaw(){
  try{
    localStorage.setItem("dramaEditorV1_1",JSON.stringify(data));
    return true;
  }catch(e){
    return false;
  }
}
function save(){
  const now=JSON.stringify(data);
  if(now!==lastSnapshot){
    undoStack.push(lastSnapshot);
    if(undoStack.length>80)undoStack.shift();
    lastSnapshot=now;
    redoStack=[];
  }
  return persistRaw();
}
function restoreSnapshot(raw){
  data=normalize(JSON.parse(raw));
  lastSnapshot=JSON.stringify(data);
  persistRaw();
  mode="edit";play=null;selected={type:"level",id:"level"};multiSel.clear();
  refreshImmediate();
}
function undo(){
  if(!undoStack.length){toast("Không còn gì để Undo");return}
  const cur=JSON.stringify(data);
  redoStack.push(cur);
  const prev=undoStack.pop();
  data=normalize(JSON.parse(prev));
  lastSnapshot=JSON.stringify(data);
  persistRaw();
  mode="edit";play=null;selected={type:"level",id:"level"};multiSel.clear();
  refreshImmediate();toast("Undo");
}
function redo(){
  if(!redoStack.length){toast("Không còn gì để Redo");return}
  undoStack.push(JSON.stringify(data));
  const next=redoStack.pop();
  data=normalize(JSON.parse(next));
  lastSnapshot=JSON.stringify(data);
  persistRaw();
  mode="edit";play=null;selected={type:"level",id:"level"};multiSel.clear();
  refreshImmediate();toast("Redo");
}
const byChar=id=>data.characters.find(x=>x.id===id);
const byClue=id=>data.clues.find(x=>x.id===id);
const byImg=id=>data.images.find(x=>x.id===id);
const byAnn=id=>data.annotations.find(x=>x.id===id);
function placementTriggerChecks(arr=[]){
  return checks(arr||[],c=>c.type==="M");
}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1400)}
function nextCodeInDataset(t,d=data,exclude=null){
  const re=new RegExp("^"+t+"(\\d+)$","i");
  const nums=(d.characters||[]).filter(c=>c!==exclude).map(c=>String(c.id||"").match(re)).filter(Boolean).map(m=>parseInt(m[1],10)||0);
  return t+String(Math.max(0,...nums)+1).padStart(2,"0");
}
function nextCode(t){return nextCodeInDataset(t,data,null)}
function remapCharacterIdEverywhereInDataset(d,oldId,newId,oldType,newType){
  const becameFixed=oldType==="M"&&newType==="F";
  const mapPlacement=arr=>becameFixed?(arr||[]).filter(x=>x!==oldId):(arr||[]).map(x=>x===oldId?newId:x);
  const mapGeneral=arr=>(arr||[]).map(x=>x===oldId?newId:x);
  const mapMovableTarget=arr=>becameFixed?(arr||[]).filter(x=>x!==oldId):mapGeneral(arr);

  d.level=d.level||{};
  d.level.revealWhen=mapPlacement(d.level.revealWhen||[]);
  d.level.hook=renameTokenRefs(d.level.hook||"",oldId,newId);
  d.level.reveal=renameTokenRefs(d.level.reveal||"",oldId,newId);
  d.level.truth=renameTokenRefs(d.level.truth||"",oldId,newId);
  if(d.level.ending){
    d.level.ending.endingLine=renameTokenRefs(d.level.ending.endingLine||"",oldId,newId);
    d.level.ending.imageBrief=renameTokenRefs(d.level.ending.imageBrief||"",oldId,newId);
  }

  (d.clues||[]).forEach(q=>{
    q.resolveWhen=mapPlacement(q.resolveWhen||[]);
    q.text=renameTokenRefs(q.text||"",oldId,newId);
  });
  (d.characters||[]).forEach(ch=>{
    if(ch.baseTarget===oldId)ch.baseTarget=newId;
    (ch.reactionEvents||[]).forEach(ev=>{
      ev.triggerChars=mapPlacement(ev.triggerChars||[]);
      (ev.steps||[]).forEach(st=>{if(st.target===oldId)st.target=newId});
    });
  });
}
function syncCharacterTypeId(c,newType){
  const oldType=c.type;
  if(newType===oldType)return {oldId:c.id,newId:c.id,triggerReview:0};
  const oldId=c.id;
  const newId=nextCodeInDataset(newType,data,c);
  c.type=newType;
  c.id=newId;
  remapCharacterAssetPrefix(c,oldId,newId);
  remapCharacterIdEverywhereInDataset(data,oldId,newId,oldType,newType);

  let triggerReview=0;
  if(newType==="M"){
    c.assetTrayId=c.assetTrayId||`${newId}_TRAY`;
    c.answerSet=true;
  }else{
    c.assetTrayId="";
    (c.reactionEvents||[]).forEach(ev=>{
      if(ev.triggerType==="SELF_PLACED"){
        ev.triggerType="CHAR_PLACED";
        ev.triggerChars=[];
        triggerReview++;
      }
    });
  }
  ensureCharacterAssetIds(c);
  return {oldId,newId,triggerReview};
}
function enforceCharacterTypeIdsInDataset(d){
  (d.characters||[]).forEach(c=>{
    const expected=c.type==="F"?"F":"M";
    if(new RegExp("^"+expected+"\\d+$","i").test(String(c.id||"")))return;
    const oldId=String(c.id||"").toUpperCase();
    const oldType=/^F\d+$/i.test(oldId)?"F":/^M\d+$/i.test(oldId)?"M":expected;
    const newId=nextCodeInDataset(expected,d,c);
    c.id=newId;
    remapCharacterAssetPrefix(c,oldId,newId);
    remapCharacterIdEverywhereInDataset(d,oldId,newId,oldType,expected);
    if(expected==="M")c.assetTrayId=c.assetTrayId||`${newId}_TRAY`;
    else c.assetTrayId="";
  });
}
function sortedCharacters(filterFn=null){
  const arr=filterFn?data.characters.filter(filterFn):[...data.characters];
  return arr.sort((a,b)=>{
    const ta=a.type==="M"?0:1,tb=b.type==="M"?0:1;
    const na=parseInt(String(a.id).replace(/\D/g,""))||0;
    const nb=parseInt(String(b.id).replace(/\D/g,""))||0;
    return ta-tb||na-nb||String(a.id).localeCompare(String(b.id));
  });
}
const DIFFICULTY_LABEL={EASY:"DỄ",MEDIUM:"VỪA",HARD:"KHÓ"};
const AMBIGUITY_LABEL={LOW:"Ít",MEDIUM:"Vừa",HIGH:"Nhiều"};
const COMBINE_LABEL={ONE:"1",TWO:"2",THREE_PLUS:"3+"};
function movableCount(){return data.characters.filter(c=>c.type==="M").length}
function difficultyDiagnostic(g=null,answers=null){
  const target=data.level.difficultyTarget||"";
  const self=answers?.self??data.level.difficultySelf??"";
  const ambiguity=answers?.ambiguity??data.level.difficultyAmbiguity??"";
  const combine=answers?.combine??data.level.difficultyCombine??"";
  if(!["EASY","MEDIUM","HARD"].includes(target)||!["EASY","MEDIUM","HARD"].includes(self)||!["LOW","MEDIUM","HIGH"].includes(ambiguity)||!["ONE","TWO","THREE_PLUS"].includes(combine))return null;
  return {target,self,ambiguity,combine};
}
function difficultyBadge(level){return `<span class="diffBadge ${String(level||"MEDIUM").toLowerCase()}">${DIFFICULTY_LABEL[level]||level}</span>`}
function difficultyResultHtml(d){
  if(!d)return "";
  const selfVsTarget=d.self===d.target;
  return `<div class="difficultyResultCard">
    <div class="difficultyResultTop"><b>KẾT QUẢ</b><span>Mục tiêu ${difficultyBadge(d.target)}</span><span>GD sau Full Play ${difficultyBadge(d.self)}</span><span class="${selfVsTarget?"diffOk":"diffMismatch"}">${selfVsTarget?"✓ Khớp mục tiêu":"⚠ Lệch mục tiêu — review lại"}</span></div>
    ${!selfVsTarget?`<div class="difficultyReason"><b>Cần review:</b> mục tiêu ban đầu là ${DIFFICULTY_LABEL[d.target]}, nhưng Full Play cho cảm giác ${DIFFICULTY_LABEL[d.self]}. Có thể sửa level hoặc đổi target nếu target ban đầu không còn đúng.</div>`:""}
    <div class="difficultyReason"><b>2 tín hiệu GD vừa ghi:</b><br>• Trước placement quan trọng/khó nhất còn <b>${AMBIGUITY_LABEL[d.ambiguity]}</b> khả năng hợp lý.<br>• Placement quan trọng thường cần kết hợp <b>${COMBINE_LABEL[d.combine]}</b> information.</div>
    <div class="difficultyReason">Tool <b>không tự chấm độ khó</b> từ số clue, số character hay FLOW. Khó phải đến từ suy luận, không phải thiếu/khó đọc information.</div>
    <div class="difficultyReason"><b>2 mạng là rule chung toàn game</b>, không dùng để cân Dễ / Vừa / Khó.</div>
  </div>`;
}
function openDifficultyTest(){
  if(!["EASY","MEDIUM","HARD"].includes(data.level.difficultyTarget)){
    data.level.difficultyTarget = "MEDIUM";
    save();
  }
  const ov=$("#difficultyOverlay");
  $("#diffSelf").value=data.level.difficultySelf||"";
  $("#diffAmb").value=data.level.difficultyAmbiguity||"";
  $("#diffCombine").value=data.level.difficultyCombine||"";
  $("#difficultyResult").innerHTML=`<div class="difficultyIntro">Mục tiêu ban đầu: <b>${DIFFICULTY_LABEL[data.level.difficultyTarget]}</b>. Hãy tự đánh giá sau Full Play rồi đối chiếu với mục tiêu ban đầu.</div>`;
  ov.classList.add("show");
}
function runDifficultyTest(){
  const self=$("#diffSelf").value,ambiguity=$("#diffAmb").value,combine=$("#diffCombine").value;
  if(!["EASY","MEDIUM","HARD"].includes(data.level.difficultyTarget)){toast("Chưa chọn Độ khó GD dự định");return}
  if(!self||!ambiguity||!combine){toast("Chọn đủ 3 câu rồi mới đối chiếu");return}
  const d=difficultyDiagnostic(null,{self,ambiguity,combine});
  if(!d){toast("Chưa đủ dữ liệu để test");return}
  data.level.difficultySelf=self;data.level.difficultyAmbiguity=ambiguity;data.level.difficultyCombine=combine;data.level.difficultyTested=true;save();
  const box=$("#difficultyResult");box.innerHTML=difficultyResultHtml(d);
}
function face(emotion="😐"){const e=normalizeEmotionEmoji(emotion||"😐");return `<div class="face expr" title="${esc(emotionName(e))}">${esc(e)}</div>`}
function opts(v="",blankOpt=true,filterFn=null){
  return (blankOpt?'<option value="">-- None --</option>':'')+
    sortedCharacters(filterFn).map(c=>`<option value="${c.id}" ${c.id===v?"selected":""}>${c.id} · ${esc(c.name)}</option>`).join("");
}
function checks(arr,filterFn=null){
  return sortedCharacters(filterFn).map(c=>`<label class="check"><input type="checkbox" value="${c.id}" ${arr.includes(c.id)?"checked":""}>${c.id}</label>`).join("");
}
function bindChecks(el,cb){el.querySelectorAll("input").forEach(x=>x.onchange=()=>cb([...el.querySelectorAll("input:checked")].map(i=>i.value)))}
function all(ids){return !ids?.length||ids.every(id=>play?.placed[id])}
function triggerLabel(c,ev){
  if(ev.triggerType==="SELF_PLACED")return "Bản thân được đặt đúng";
  if(ev.triggerType==="CHAR_PLACED")return `${ev.triggerChars?.[0]||"?"} được đặt đúng`;
  if(ev.triggerType==="ALL_PLACED")return `${(ev.triggerChars||[]).join(" + ")||"?"} đã được đặt đúng`;
  return ev.triggerType;
}
function clockFromPositions(sourceId,targetId){
  const s=byChar(sourceId),t=byChar(targetId);
  if(!s||!t)return null;
  const dx=t.x-s.x,dy=t.y-s.y;
  if(Math.abs(dx)<1&&Math.abs(dy)<1)return 12;
  let deg=Math.atan2(dx,-dy)*180/Math.PI;
  if(deg<0)deg+=360;
  let h=Math.round(deg/30)%12;
  return h===0?12:h;
}
function resolvedGazeClock(sourceId,r){
  if(!r||r.gaze==="NONE")return null;
  if(r.gaze==="AUTO")return clockFromPositions(sourceId,r.target);
  const n=parseInt(r.gaze,10);
  return n>=1&&n<=12?n:null;
}
function clockArrow(h){
  const map={12:"↑",1:"↗",2:"↗",3:"→",4:"↘",5:"↘",6:"↓",7:"↙",8:"↙",9:"←",10:"↖",11:"↖"};
  return map[h]||"";
}
function gazeClockText(sourceId,r){
  if(!r||r.gaze==="NONE")return "Không nhìn hướng cụ thể";
  const h=resolvedGazeClock(sourceId,r);
  if(!h)return r.gaze==="AUTO"?"AUTO — chưa có Target":"—";
  return `${h} giờ${r.gaze==="AUTO"?" (AUTO)":" (Manual)"}`;
}
function gazeDisplay(sourceId,r){
  if(!r||r.gaze==="NONE")return "";
  const h=resolvedGazeClock(sourceId,r);
  return h?clockArrow(h):(r.gaze==="AUTO"?"AUTO":"");
}
function initialStateRecord(c){
  return {emotion:c?.baseExpression||"😐",symbol:"",gaze:c?.baseGaze||"NONE",target:c?.baseTarget||""};
}
function initialGazePreview(c,showTarget=false){
  const r=initialStateRecord(c),g=gazeDisplay(c.id,r);
  if(!g)return "";
  if(!showTarget||!r.target)return g;
  const tc=byChar(r.target);
  return `${g} ${tc?displayName(tc):r.target}`;
}
function reactionPreview(r,sourceId=""){
  const g=gazeDisplay(sourceId,r);
  let targetLabel="";
  if(r?.target){
    const tc=byChar(r.target);
    targetLabel=tc?displayName(tc):r.target;
  }

  const icon=`${r?.emotion||""}${r?.symbol||""}`.trim();
  const isLeft=["←","↖","↙"].includes(g);

  if(isLeft && targetLabel){
    return `${targetLabel} ${g}${icon?" "+icon:""}`.trim();
  }

  return `${icon}${g?" "+g:""}${targetLabel?" "+targetLabel:""}`.trim();
}
function sequencePreview(ev,sourceId=""){
  return (ev?.steps||[]).map(st=>reactionPreview(st,sourceId)||"∅").join(" → ");
}
function reactionPlayPreview(r,sourceId=""){
  const g=gazeDisplay(sourceId,r);
  const icon=`${r?.emotion||""}${r?.symbol||""}`.trim();
  const isLeft=["←","↖","↙"].includes(g);
  if(isLeft) return `${g}${icon?" "+icon:""}`.trim();
  return `${icon}${g?" "+g:""}`.trim();
}

function render(){renderLists();renderLive();renderInspector();renderLogic()}
function refreshImmediate(){
  const seq=++refreshImmediate.seq;
  render();

  const repaint=()=>{
    if(seq!==refreshImmediate.seq)return;
    renderLive();
    renderLists();
    renderLogic();
    if(typeof applyZoomPan === 'function'){
      applyZoomPan();
    }
  };

  queueMicrotask(repaint);
  setTimeout(repaint,0);
  setTimeout(repaint,24);
}
refreshImmediate.seq=0;

function renderLists(){
  $("#levelCard").classList.toggle("sel",selected.type==="level");

  $("#imgList").innerHTML=data.images.map(i=>`<div class="card ${selected.type==="image"&&selected.id===i.id?"sel":""}" data-s="image:${i.id}"><b>${esc(i.name)}</b><div class="meta">z:${i.z}${i.locked?" · ĐÃ KHÓA":""}</div></div>`).join("");

  $("#charList").innerHTML=sortedCharacters().map(c=>`<div class="card ${selected.type==="char"&&selected.id===c.id?"sel":""}" data-s="char:${c.id}">
    <b><span class="pill ${c.type.toLowerCase()}">${c.type}</span> ${c.id} · ${esc(c.name)}</b>
    <div class="meta">${esc(c.role)}</div></div>`).join("");

  const roots=data.clues.filter(c=>!c.parent);
  $("#clueList").innerHTML=roots.map(c=>clueList(c)).join("");
  initClueReorderListeners();

  const rx=[];
  sortedCharacters().forEach(c=>(c.reactionEvents||[]).forEach((ev,i)=>rx.push({char:c,event:ev,index:i})));
  $("#reactionList").innerHTML=rx.length?rx.map(x=>`<div class="card ${selected.type==="reaction"&&selected.charId===x.char.id&&selected.eventId===x.event.id?"sel":""}" data-rx="${x.char.id}|${x.event.id}">
    <b>${x.char.id} · SỰ KIỆN ${x.index+1} · ${x.event.steps.length} bước</b>
    <div class="meta">KHI: ${esc(triggerLabel(x.char,x.event))}</div>
    <div class="rxSeq">${esc(sequencePreview(x.event,x.char.id))}</div></div>`).join(""):'<div class="small">Chưa có sự kiện phản ứng.</div>';

  $$('[data-s]').forEach(el=>el.onclick=()=>{
    const [t,id]=el.dataset.s.split(":");
    multiSel.clear();
    if(t==="char"||t==="image")multiSel.add(t+":"+id);
    selected={type:t,id};refreshImmediate();
  });
  $$('[data-rx]').forEach(el=>el.onclick=()=>{
    multiSel.clear();const [charId,eventId]=el.dataset.rx.split("|");selected={type:"reaction",charId,eventId};refreshImmediate();
  });
}

function clueList(c){
  const kids=data.clues.filter(x=>x.parent===c.id);
  const state=c.parent?c.preOpen:"ACTIVE";
  const label=state==="ACTIVE"?"CÓ SẴN":state==="LOCKED"?"KHÓA":"ẨN";
  return `<div class="clueWrap" data-clue-wrap="${c.id}">
    <div class="card clueCardDraggable ${selected.type==="clue"&&selected.id===c.id?"sel":""}" draggable="true" data-s="clue:${c.id}" data-clue-id="${c.id}">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <b>${c.id}</b>
        <div class="clueActions">
          <button class="clueMoveBtn" data-move-up="${c.id}" type="button" title="Di chuyển lên trên">▲</button>
          <button class="clueMoveBtn" data-move-down="${c.id}" type="button" title="Di chuyển xuống dưới">▼</button>
          <span class="pill ${state.toLowerCase()}">${label}</span>
        </div>
      </div>
      <div class="meta">${esc(resolveTokens(c.text||"(draft)",editNameMap()))}</div>
    </div>
    ${kids.length?`<div style="margin-left:13px">${kids.map(clueList).join("")}</div>`:""}
  </div>`;
}

function createImageLayer(i){
  const el=document.createElement("div");
  const key="image:"+i.id;
  el.className="imgLayer "+(mode==="edit"&&selected.type==="image"&&selected.id===i.id?"sel ":"")+(multiSel.has(key)?"multiSel":"");
  el.dataset.imgId=i.id;
  const flipX=i.flipH?-1:1, flipY=i.flipV?-1:1, rot=i.rotation||0, op=(i.opacity!==undefined?i.opacity:100)/100;
  
  const filters = [];
  if(i.brightness !== undefined && i.brightness !== 100) filters.push(`brightness(${i.brightness}%)`);
  if(i.contrast !== undefined && i.contrast !== 100) filters.push(`contrast(${i.contrast}%)`);
  if(i.saturate !== undefined && i.saturate !== 100) filters.push(`saturate(${i.saturate}%)`);
  if(i.blur) filters.push(`blur(${i.blur}px)`);
  if(i.grayscale) filters.push(`grayscale(${i.grayscale}%)`);
  if(i.sepia) filters.push(`sepia(${i.sepia}%)`);
  if(i.invert) filters.push(`invert(${i.invert}%)`);
  const filterStr = filters.length ? filters.join(' ') : 'none';
  const blendStr = i.blendMode || 'normal';
  const radiusPx = (i.radius || 0) + 'px';
  let shadowStr = 'none';
  if(i.shadow === 'soft') shadowStr = '0 10px 25px rgba(0,0,0,0.4)';
  else if(i.shadow === 'hard') shadowStr = '6px 6px 0px rgba(0,0,0,0.6)';
  else if(i.shadow === 'glow') shadowStr = '0 0 15px rgba(59,130,246,0.7)';

  el.style.cssText=`left:${i.x/1080*100}%;top:${i.y/1610*100}%;width:${i.w/1080*100}%;height:${i.h/1610*100}%;z-index:${i.z};transform:scale(${flipX},${flipY}) rotate(${rot}deg);opacity:${op};filter:${filterStr};mix-blend-mode:${blendStr};border-radius:${radiusPx};box-shadow:${shadowStr};overflow:hidden;`;
  el.innerHTML=`<img src="${i.src}"><div class="resize"></div>`;
  if(mode==="edit"){
    el.onpointerdown=e=>moveImg(e,i,el);
    el.onclick=e=>{
      e.stopPropagation();
      if(e.shiftKey){
        if(multiSel.has(key))multiSel.delete(key);else multiSel.add(key);
      }else if(!multiSel.has(key)){multiSel.clear();multiSel.add(key)}
      selected={type:"image",id:i.id};refreshImmediate();
    };
    el.oncontextmenu=e=>openSceneCtx(e,"image",i.id);
    el.querySelector(".resize").onpointerdown=e=>resizeImg(e,i,el);
  }
  return el;
}

function renderLive(){
  $("#liveName").textContent=data.level.id||"LEVEL";
  $("#liveHook").textContent=resolveTokens(data.level.hook||"");
  $("#liveMoves").textContent=mode==="play"?"❤️".repeat(Math.max(0,play?.lives??2)):"❤️❤️";
  $("#trayHint").textContent=mode==="play"?"Kéo character vào scene":"M/F đều có trên Tray + Scene trong Edit";

  const st=$("#stage"); st.querySelectorAll(".imgLayer,.char,.slot,.noteObj").forEach(n=>n.remove());

  [...data.images].sort((a,b)=>a.z-b.z).forEach(i=>st.appendChild(createImageLayer(i)));

  data.annotations.forEach(a=>{
    const inEdit=mode==="edit";
    const show=inEdit||a.visibleInPlay;
    if(!show)return;

    if(["pen", "pencil", "brush"].includes(a.type)){
      const el = document.createElement("div");
      const key = "annotation:" + a.id;
      const selectedNow = inEdit && selected.type === "annotation" && selected.id === a.id;
      el.className = "noteObj pathObj " + a.type + " " + (selectedNow ? "sel " : "") + (inEdit && multiSel.has(key) ? "multiSel" : "");
      el.dataset.annotationId = a.id;
      el.style.zIndex = a.z || 20;
      if(a.locked) el.classList.add("locked");
      const flipXPath = a.flipH ? -1 : 1;
      const flipYPath = a.flipV ? -1 : 1;
      const rotPath = Number(a.rotation) || 0;
      const cxPath = (a.x + (a.w || 100) / 2) / 1080 * 100;
      const cyPath = (a.y + (a.h || 100) / 2) / 1610 * 100;
      el.style.transformOrigin = `${cxPath}% ${cyPath}%`;
      if(rotPath || a.flipH || a.flipV){
        el.style.transform = `scale(${flipXPath},${flipYPath}) rotate(${rotPath}deg)`;
      }

      const svgD = generateSvgPathD(a);
      const sDash = a.strokeStyle === "dashed" ? 'stroke-dasharray="8 6"' : (a.strokeStyle === "dotted" ? 'stroke-dasharray="3 4"' : '');
      const isPen = a.type === "pen";

      let handlesHtml = "";
      if(selectedNow && isPen && inEdit && !a.locked){
        (a.points || []).forEach((pt, idx) => {
          const isStart = idx === 0;
          if(pt.cp1 && (pt.cp1.x !== pt.x || pt.cp1.y !== pt.y)){
            handlesHtml += `<line class="handleLine" x1="${pt.x}" y1="${pt.y}" x2="${pt.cp1.x}" y2="${pt.cp1.y}" />
            <circle class="handleControlPoint" cx="${pt.cp1.x}" cy="${pt.cp1.y}" r="4.5" data-anchor-idx="${idx}" data-handle="cp1" />`;
          }
          if(pt.cp2 && (pt.cp2.x !== pt.x || pt.cp2.y !== pt.y)){
            handlesHtml += `<line class="handleLine" x1="${pt.x}" y1="${pt.y}" x2="${pt.cp2.x}" y2="${pt.cp2.y}" />
            <circle class="handleControlPoint" cx="${pt.cp2.x}" cy="${pt.cp2.y}" r="4.5" data-anchor-idx="${idx}" data-handle="cp2" />`;
          }
          handlesHtml += `<circle class="anchorPointMarker ${isStart ? 'startPoint' : ''}" cx="${pt.x}" cy="${pt.y}" r="5.5" data-anchor-idx="${idx}" data-handle="anchor" />`;
        });
      }

      el.innerHTML = `<svg viewBox="0 0 1080 1610">
        ${a.closed && a.fill && a.fill !== 'transparent' && a.fill !== 'none' ? `<path class="closedFill" d="${svgD}" fill="${a.fill}" />` : ''}
        <path class="mainStroke" d="${svgD}" fill="none" stroke="${a.stroke || '#2563eb'}" stroke-width="${a.strokeWidth || 3}" stroke-opacity="${a.strokeOpacity !== undefined ? a.strokeOpacity : 1}" ${sDash} stroke-linecap="round" stroke-linejoin="round" />
        ${handlesHtml}
      </svg>`;

      if(inEdit){
        if(selectedNow && isPen && !a.locked){
          el.querySelectorAll(".anchorPointMarker, .handleControlPoint").forEach(h => {
            h.onpointerdown = ev => {
              ev.stopPropagation();
              ev.preventDefault();
              startAnchorDrag(ev, a, parseInt(h.dataset.anchorIdx, 10), h.dataset.handle);
            };
          });
        }

        const strokePath = el.querySelector(".mainStroke");
        const fillPath = el.querySelector(".closedFill");
        const targetPaths = [strokePath, fillPath].filter(Boolean);
        targetPaths.forEach(pEl => {
          pEl.onpointerdown = ev => {
            moveAnnotation(ev, a, el);
          };
          pEl.onclick = ev => {
            ev.stopPropagation();
            const k = "annotation:" + a.id;
            if(ev.shiftKey){
              if(multiSel.has(k)) multiSel.delete(k); else multiSel.add(k);
            } else if(!multiSel.has(k)){
              multiSel.clear(); multiSel.add(k);
            }
            selected = { type: "annotation", id: a.id };
            refreshImmediate();
          };
          pEl.oncontextmenu = ev => openSceneCtx(ev, "annotation", a.id);
        });
      }

      st.appendChild(el);
      return;
    }

    const el=document.createElement("div");
    const key="annotation:"+a.id;
    el.className="noteObj "+a.type+" "+(inEdit&&selected.type==="annotation"&&selected.id===a.id?"sel ":"")+(inEdit&&multiSel.has(key)?"multiSel":"");
    el.dataset.annotationId=a.id;
    el.style.left=(a.x/1080*100)+"%";
    el.style.top=(a.y/1610*100)+"%";
    el.style.width=(a.w/1080*100)+"%";
    el.style.height=(a.h/1610*100)+"%";
    el.style.zIndex=a.z||20;
    if(a.locked)el.classList.add("locked");
    const flipX = a.flipH ? -1 : 1;
    const flipY = a.flipV ? -1 : 1;
    const rot = Number(a.rotation) || 0;
    el.style.transformOrigin = "center center";
    if(rot || a.flipH || a.flipV){
      el.style.transform = `scale(${flipX},${flipY}) rotate(${rot}deg)`;
    }

    const fontPx=Math.max(8,a.fontSize/1080*st.clientWidth);
    const selectedNow=inEdit&&selected.type==="annotation"&&selected.id===a.id;

    const sDash=a.strokeStyle==="dashed"?'stroke-dasharray="8 6"':(a.strokeStyle==="dotted"?'stroke-dasharray="3 4"':'');

    if(a.type==="rect"||a.type==="circle"){
      el.style.backgroundColor=a.fill||"#f4f1f6";
      el.style.borderColor=a.stroke||"#655d69";
      if(a.type==="rect"){
        el.style.borderRadius=(Math.max(0,a.radius||0))+"px";
      }else{
        el.style.borderRadius="50%";
      }
      el.style.borderStyle=a.strokeStyle||"solid";
      el.style.borderWidth=(Math.max(1,a.strokeWidth||3))+"px";
      el.innerHTML=`<div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="qslot"){
      const qFont=Math.max(11,Math.round(Math.min(a.w,a.h)/1080*st.clientWidth*.42));
      el.innerHTML=`<div class="qslotWrap"></div><div class="qslotDash"></div><div class="qslotQs" style="font-size:${qFont}px"><span class="small">?</span><span class="big">?</span><span class="small">?</span></div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="triangle"){
      el.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><polygon points="50,4 96,96 4,96" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a.strokeWidth||3}" ${sDash} stroke-linejoin="round" vector-effect="non-scaling-stroke"></polygon></svg><div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="star"){
      el.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><polygon points="50,2 62,38 100,38 69,60 81,96 50,74 19,96 31,60 0,38 38,38" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a.strokeWidth||3}" ${sDash} stroke-linejoin="round" vector-effect="non-scaling-stroke"></polygon></svg><div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="polygon"){
      el.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><polygon points="50,3 93,26 93,74 50,97 7,74 7,26" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a.strokeWidth||3}" ${sDash} stroke-linejoin="round" vector-effect="non-scaling-stroke"></polygon></svg><div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="line"){
      el.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><line x1="0" y1="50" x2="100" y2="50" stroke="${a.stroke}" stroke-width="${a.strokeWidth||4}" ${sDash} stroke-linecap="round" vector-effect="non-scaling-stroke"></line></svg><div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="arrow"){
      const w=Math.max(20, a.w||60), h=Math.max(20, a.h||40);
      const strokeW=a.strokeWidth||4;
      const pad=Math.max(8, strokeW * 1.5);
      let x1, x2, y1, y2;
      if(a.arrowXDir===0){
        x1 = w / 2; x2 = w / 2;
      } else if(a.arrowXDir===1){
        x1 = pad; x2 = w - pad;
      } else {
        x1 = w - pad; x2 = pad;
      }
      if(a.arrowYDir===0){
        y1 = h / 2; y2 = h / 2;
      } else if(a.arrowYDir===1){
        y1 = pad; y2 = h - pad;
      } else {
        y1 = h - pad; y2 = pad;
      }
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const angle = Math.atan2(dy, dx);
      const headLen = Math.min(len * 0.45, Math.max(16, strokeW * 3.6));
      const halfWidth = headLen * 0.45;
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const tipX = x2, tipY = y2;
      const leftX = x2 - headLen * cosA + halfWidth * sinA;
      const leftY = y2 - headLen * sinA - halfWidth * cosA;
      const rightX = x2 - headLen * cosA - halfWidth * sinA;
      const rightY = y2 - headLen * sinA + halfWidth * cosA;
      const baseX = x2 - headLen * 0.65 * cosA;
      const baseY = y2 - headLen * 0.65 * sinA;
      const polyPts = `${tipX.toFixed(1)},${tipY.toFixed(1)} ${leftX.toFixed(1)},${leftY.toFixed(1)} ${baseX.toFixed(1)},${baseY.toFixed(1)} ${rightX.toFixed(1)},${rightY.toFixed(1)}`;
      const strokeColor = a.stroke || "#655d69";
      el.innerHTML=`<svg viewBox="0 0 ${w} ${h}" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none">
        <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${baseX.toFixed(1)}" y2="${baseY.toFixed(1)}" stroke="${strokeColor}" stroke-width="${strokeW}" ${sDash} stroke-linecap="round"></line>
        <polygon points="${polyPts}" fill="${strokeColor}"></polygon>
      </svg><div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor};${!a.text?'display:none;':''}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="text"){
      el.innerHTML=`<div class="noteText" style="font-size:${fontPx}px;color:${a.stroke}">${esc(a.text)}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }

    if(inEdit){
      const label=el.querySelector(".shapeLabel");
      if(label){
        label.onpointerdown=e=>{if(selectedNow&&!a.locked)e.stopPropagation()};
        label.onclick=e=>e.stopPropagation();
        label.oninput=e=>{a.text=e.currentTarget.textContent;save()};
        label.onblur=()=>{save();renderInspector()};
      }

      el.onpointerdown=e=>moveAnnotation(e,a,el);
      el.onclick=e=>{
        e.stopPropagation();
        const key="annotation:"+a.id;
        if(e.shiftKey){if(multiSel.has(key))multiSel.delete(key);else multiSel.add(key)}
        else if(!multiSel.has(key)){multiSel.clear();multiSel.add(key)}
        selected={type:"annotation",id:a.id};refreshImmediate();
      };
      el.ondblclick=e=>{
        if(a.locked)return;
        if(a.type==="text"){
          e.stopPropagation();
          const val=prompt("Nội dung ghi chú chữ:",a.text||"");
          if(val!==null){a.text=val;save();refreshImmediate()}
        }else{
          e.stopPropagation();
          const label=el.querySelector(".shapeLabel");
          if(label){selected={type:"annotation",id:a.id};refreshImmediate();setTimeout(()=>{const n=document.querySelector(`[data-annotation-id="${a.id}"] .shapeLabel`);if(n){n.focus();document.execCommand?.("selectAll",false,null)}},0)}
        }
      };
      el.oncontextmenu=e=>openSceneCtx(e,"annotation",a.id);
      const h=el.querySelector(".noteResize");if(h)h.onpointerdown=e=>{if(!a.locked)resizeAnnotation(e,a,el)};
    }

    st.appendChild(el);
  });

  data.characters.forEach(c=>{
    if(c.type==="M"&&c.answerSet){
      const sl=document.createElement("div");sl.className="slot";sl.style.cssText=`left:${c.x/1080*100}%;top:${c.y/1610*100}%`;sl.dataset.slot=c.id;st.appendChild(sl);
    }
    const show = mode==="edit" ? true : (c.type==="F" || play?.placed[c.id]);
    if(!show)return;

    const el=document.createElement("div");
    const ckey="char:"+c.id;
    el.className="char "+(c.type==="F"?"f ":"")+(mode==="edit"&&selected.type==="char"&&selected.id===c.id?"sel ":"")+(multiSel.has(ckey)?"multiSel":"");
    el.dataset.charId=c.id;
    el.style.cssText=`left:${c.x/1080*100}%;top:${c.y/1610*100}%`;
    const rv=mode==="play"?play.reactions[c.id]:null;
    const initialGaze=!rv?initialGazePreview(c,mode==="edit"):"";
    const editCode=mode==="edit"?`<span class="code">${c.id}</span>`:"";
    el.innerHTML=`${rv?`<div class="react">${esc(reactionPlayPreview(rv,c.id))}</div>`:""}${initialGaze?`<div class="react editPreview" title="Initial gaze">${esc(initialGaze)}</div>`:""}${face(rv?.emotion||c.baseExpression||"😐")}${editCode}<span class="name" data-char-name="${c.id}">${esc(displayName(c))}</span>
      <div class="apps">${appearanceText(c)?`<span class="appTag">${esc(appearanceText(c))}</span>`:""}</div>`;
    if(mode==="edit"){
      el.onpointerdown=e=>moveChar(e,c,el);
      el.onclick=e=>{
        e.stopPropagation();
        const key="char:"+c.id;
        if(e.shiftKey){
          if(multiSel.has(key))multiSel.delete(key);else multiSel.add(key);
        }else if(!multiSel.has(key)){multiSel.clear();multiSel.add(key)}
        selected={type:"char",id:c.id};refreshImmediate();
      };
      el.oncontextmenu=e=>openSceneCtx(e,"char",c.id);
    }
    st.appendChild(el);
  });

  renderClues();
  renderTray();
  redrawDrawingCanvas();
  $("#progress").textContent=mode==="play"?(play?.failed?"💔 HẾT MẠNG · CHƠI LẠI":`${Object.keys(play?.placed||{}).length}/${data.characters.filter(c=>c.type==="M").length} đúng`):"CHẾ ĐỘ BIÊN TẬP";
  document.body.classList.toggle("play",mode==="play");
  const playLeft = $("#playLeftSection"); if(playLeft) playLeft.style.display = mode==="play" ? "flex" : "none";
  const playRight = $("#playRightSection"); if(playRight) playRight.style.display = mode==="play" ? "flex" : "none";
  $("#editBtn").classList.toggle("on",mode==="edit");
  $("#playBtn").classList.toggle("on",mode==="play");
  $("#playBtn").textContent="CHƠI THỬ";
  $("#playBtn").title=(mode==="edit"&&play)?"Tiếp tục phiên chơi thử nghiệm":"Chế độ chơi thử nghiệm";
  const pg=$("#playGroup");if(pg)pg.style.display=mode==="play"?"inline-flex":"none";
  $("#replayBtn").style.display=mode==="play"?"inline-flex":"none";
  $("#shuffleReplayBtn").style.display=mode==="play"?"inline-flex":"none";
  $("#playNameStatus").style.display=mode==="play"?"inline-block":"none";
  if(mode==="play"){
    $("#playNameStatus").textContent=play?.namesRandomized
      ? `Tên: bộ đã đảo #${play.nameGeneration||1}`
      : "Tên: tên Edit";
  }
}

function editClue(c,d){
  const state=c.parent?c.preOpen:"ACTIVE";
  const label=state==="ACTIVE"?"CÓ SẴN":state==="LOCKED"?"KHÓA":"ẨN";
  return `<div class="cl ${d?"child":""}" data-live="${c.id}"><b>${c.id}</b> · <span data-clue-text="${c.id}">${esc(resolveTokens(c.text||"(draft)",editNameMap()))}</span> <span class="pill ${state.toLowerCase()}">${label}</span></div>`+
    data.clues.filter(x=>x.parent===c.id).map(k=>editClue(k,d+1)).join("");
}
function playDramaReveal(depth=0){
  if(!play?.reveal||!String(data.level.reveal||"").trim())return"";
  return `<div class="cl ${depth?"child":""} dramaReveal">✓ ${esc(resolveTokens(data.level.reveal))}</div>`;
}
function playClue(c,d){
  const s=play.state[c.id];if(!s)return"";

  if(!s.active){
    if(!c.parent)return"";
    const ps=play.state[c.parent];

    if(!ps?.active||ps.done)return"";
    if(c.preOpen==="HIDDEN")return"";
    return `<div class="cl ${d?"child":""} locked">🔒 █████ ███</div>`;
  }

  const own=`<div class="cl ${d?"child":""} ${s.done?"done":""}">${s.done?"✓":"•"} ${esc(resolveTokens(c.text||"(draft)"))}</div>`;
  const children=data.clues.filter(x=>x.parent===c.id).map(k=>playClue(k,d+1)).join("");
  const reveal=data.level.revealParentClueId===c.id?playDramaReveal(d+1):"";
  return own+children+reveal;
}

function moveClueOrder(id, dir){
  const c = data.clues.find(x => x.id === id);
  if(!c) return;
  const siblings = data.clues.filter(x => x.parent === c.parent);
  const idx = siblings.indexOf(c);
  if(idx === -1) return;
  const targetIdx = dir === "up" ? idx - 1 : idx + 1;
  if(targetIdx < 0 || targetIdx >= siblings.length) return;
  
  const targetClue = siblings[targetIdx];
  const realIdxA = data.clues.indexOf(c);
  const realIdxB = data.clues.indexOf(targetClue);
  if(realIdxA !== -1 && realIdxB !== -1){
    data.clues[realIdxA] = targetClue;
    data.clues[realIdxB] = c;
    save();
    refreshImmediate();
    toast(`Đã chuyển manh mối ${c.id} ${dir === "up" ? "lên trên" : "xuống dưới"}`);
  }
}

function reorderClueDrag(srcId, tgtId, position){
  if(srcId === tgtId) return;
  const src = data.clues.find(x => x.id === srcId);
  const tgt = data.clues.find(x => x.id === tgtId);
  if(!src || !tgt) return;
  
  const oldIdx = data.clues.indexOf(src);
  if(oldIdx === -1) return;
  data.clues.splice(oldIdx, 1);
  
  let targetIdx = data.clues.indexOf(tgt);
  if(position === "after") targetIdx++;
  data.clues.splice(targetIdx, 0, src);
  
  src.parent = tgt.parent;
  
  save();
  refreshImmediate();
  toast(`Đã đổi vị trí manh mối: ${src.id} -> ${tgt.id}`);
}

function initClueReorderListeners(){
  $$('[data-move-up]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      moveClueOrder(btn.dataset.moveUp, "up");
    };
  });
  $$('[data-move-down]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      moveClueOrder(btn.dataset.moveDown, "down");
    };
  });
  $$('.clueCardDraggable').forEach(card => {
    card.ondragstart = (e) => {
      e.dataTransfer.setData("text/plain", card.dataset.clueId);
      card.classList.add("dragging");
    };
    card.ondragend = () => {
      card.classList.remove("dragging");
      $$('.clueCardDraggable').forEach(c => c.classList.remove("dragOverTop", "dragOverBottom"));
    };
    card.ondragover = (e) => {
      e.preventDefault();
      const rect = card.getBoundingClientRect();
      const isTop = e.clientY < rect.top + rect.height / 2;
      card.classList.toggle("dragOverTop", isTop);
      card.classList.toggle("dragOverBottom", !isTop);
    };
    card.ondragleave = () => {
      card.classList.remove("dragOverTop", "dragOverBottom");
    };
    card.ondrop = (e) => {
      e.preventDefault();
      const srcId = e.dataTransfer.getData("text/plain");
      const tgtId = card.dataset.clueId;
      const rect = card.getBoundingClientRect();
      const position = e.clientY < rect.top + rect.height / 2 ? "before" : "after";
      card.classList.remove("dragOverTop", "dragOverBottom");
      if(srcId && tgtId && srcId !== tgtId){
        reorderClueDrag(srcId, tgtId, position);
      }
    };
  });
}

function renderClues(){
  initClueReorderListeners();
  const roots=data.clues.filter(c=>!c.parent);
  const rootReveal=!data.level.revealParentClueId?playDramaReveal(0):"";
  const cluesHtml = mode==="edit"?roots.map(c=>editClue(c,0)).join(""):roots.map(c=>playClue(c,0)).join("")+rootReveal;
  
  if(mode==="play"){
    const playBox = $("#playLiveClues");
    if(playBox) playBox.innerHTML = cluesHtml;
    const progPill = $("#playProgressPill");
    if(progPill){
      const total = data.characters.filter(c=>c.type==="M").length;
      const placedCount = Object.keys(play?.placed||{}).length;
      if(play?.failed){
        progPill.textContent = "💔 HẾT MẠNG";
        progPill.className = "pill bad";
      } else if(placedCount === total && total > 0){
        progPill.textContent = "🎉 HOÀN THÀNH";
        progPill.className = "pill good";
      } else {
        progPill.textContent = `${placedCount}/${total} đúng`;
        progPill.className = "pill";
      }
    }
  } else {
    const liveBox = $("#liveClues");
    if(liveBox) liveBox.innerHTML = cluesHtml;
    $$("[data-live]").forEach(e=>e.onclick=()=>{selected={type:"clue",id:e.dataset.live};refreshImmediate()});
  }
}

function renderTray(){
  const isPlay = mode==="play";
  const box = isPlay ? ($("#playTrayRow") || $("#trayRow")) : $("#trayRow");
  if(box) box.innerHTML = "";
  if(isPlay && $("#trayRow") && $("#trayRow") !== box) $("#trayRow").innerHTML = "";

  const list=isPlay
    ? sortedCharacters(c=>c.type==="M"&&!play.placed[c.id])
    : sortedCharacters();

  const playTrayCount = $("#playTrayCount");
  if(playTrayCount && isPlay){
    playTrayCount.textContent = `${list.length} nhân vật`;
  }

  list.forEach(c=>{
    const t=document.createElement("div");
    t.className="token "+(c.type==="F"?"f ":"")+(mode==="edit"?"placed":"");
    t.title=mode==="edit"?"Character luôn có cả trên Tray và Scene. Kéo token để đổi vị trí scene.":"Kéo vào scene";
    const rv=mode==="play"?play.reactions[c.id]:null;
    const initialGaze=!rv?initialGazePreview(c,mode==="edit"):"";
    const editCode=mode==="edit"?`<span class="code">${c.id}</span>`:"";
    const appText=appearanceText(c);
    const appearanceTag=mode==="play"&&appText
      ? `<span class="trayAppearance" title="${esc(appText)}">${esc(appText)}</span>`
      : "";
    t.innerHTML=`${rv?`<div class="react">${esc(reactionPlayPreview(rv,c.id))}</div>`:""}${initialGaze?`<div class="react editPreview" title="Initial gaze">${esc(initialGaze)}</div>`:""}${face(rv?.emotion||c.baseExpression||"😐")}${editCode}<span class="name">${esc(displayName(c))}</span>${appearanceTag}`;
    if(mode==="edit")t.onpointerdown=e=>dragEditTray(e,c,t);else t.onpointerdown=e=>dragPlay(e,c,t);
    t.onclick=()=>{if(mode==="edit"){multiSel.clear();multiSel.add("char:"+c.id);selected={type:"char",id:c.id};refreshImmediate()}};
    if(box) box.appendChild(t);
  });
}

function logical(e){const r=$("#stage").getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*1080,y:(e.clientY-r.top)/r.height*1610,rect:r}}
function inStage(e){const r=$("#stage").getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}
function moveSelectionGroup(e,primaryKey){
  e.preventDefault();e.stopPropagation();
  if(!multiSel.has(primaryKey)){multiSel.clear();multiSel.add(primaryKey)}
  const start=logical(e);
  const snapshot=[];
  multiSel.forEach(key=>{
    const [type,id]=key.split(":");
    if(type==="char"){const c=byChar(id);if(c)snapshot.push({type,id,obj:c,x:c.x,y:c.y})}
    if(type==="image"){const i=byImg(id);if(i&&!i.locked)snapshot.push({type,id,obj:i,x:i.x,y:i.y})}
    if(type==="annotation"){
      const a=byAnn(id);
      if(a&&!a.locked){
        const isPath = ["pen", "pencil", "brush"].includes(a.type);
        snapshot.push({
          type,
          id,
          obj:a,
          x:a.x,
          y:a.y,
          isPath,
          origPoints: isPath && a.points ? deep(a.points) : null
        });
      }
    }
  });
  const mv=ev=>{
    const p=logical(ev),dx=p.x-start.x,dy=p.y-start.y;
    let hasPath = false;
    snapshot.forEach(s=>{
      s.obj.x=s.x+dx;s.obj.y=s.y+dy;
      if(s.isPath && s.origPoints){
        hasPath = true;
        s.obj.points.forEach((pt, i) => {
          const orig = s.origPoints[i];
          if(!orig) return;
          pt.x = Math.round(orig.x + dx);
          pt.y = Math.round(orig.y + dy);
          if(orig.cp1){ pt.cp1.x = Math.round(orig.cp1.x + dx); pt.cp1.y = Math.round(orig.cp1.y + dy); }
          if(orig.cp2){ pt.cp2.x = Math.round(orig.cp2.x + dx); pt.cp2.y = Math.round(orig.cp2.y + dy); }
        });
      } else {
        const el=s.type==="char"
          ? document.querySelector(`.char[data-char-id="${s.id}"]`)
          : s.type==="image"
            ? document.querySelector(`.imgLayer[data-img-id="${s.id}"]`)
            : document.querySelector(`.noteObj[data-annotation-id="${s.id}"]`);
        if(el){el.style.left=(s.obj.x/1080*100)+"%";el.style.top=(s.obj.y/1610*100)+"%"}
      }
    });
    if(hasPath) renderLive();
  };
  const up=()=>{
    window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);
    data.characters.forEach(c=>{if(multiSel.has("char:"+c.id))c.answerSet=true});
    save();refreshImmediate();
  };
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}
function moveChar(e,c,el){
  const key="char:"+c.id;
  if(e.shiftKey){
    e.preventDefault();e.stopPropagation();
    if(multiSel.has(key))multiSel.delete(key);else multiSel.add(key);
    selected={type:"char",id:c.id};refreshImmediate();return;
  }
  if(!multiSel.has(key)){multiSel.clear();multiSel.add(key)}
  selected={type:"char",id:c.id};
  if(multiSel.size>1)return moveSelectionGroup(e,key);
  e.preventDefault();e.stopPropagation();
  const mv=ev=>{const p=logical(ev);c.x=Math.max(20,Math.min(1060,p.x));c.y=Math.max(20,Math.min(1590,p.y));el.style.left=c.x/1080*100+"%";el.style.top=c.y/1610*100+"%"};
  const up=()=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);c.answerSet=true;save();refreshImmediate()};
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}
function dragEditTray(e,c,t){
  e.preventDefault();
  const ghost=t.cloneNode(true);ghost.style.cssText="position:fixed;z-index:4000;pointer-events:none;transform:translate(-50%,-50%) scale(1.08)";document.body.appendChild(ghost);
  const mv=ev=>{ghost.style.left=ev.clientX+"px";ghost.style.top=ev.clientY+"px"};
  const up=ev=>{
    window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);ghost.remove();
    if(inStage(ev)){const p=logical(ev);c.x=Math.max(20,Math.min(1060,p.x));c.y=Math.max(20,Math.min(1590,p.y));c.answerSet=true;selected={type:"char",id:c.id};multiSel.clear();multiSel.add("char:"+c.id);save();refreshImmediate();toast(`${c.id}: đã đổi vị trí scene`)}
  };
  mv(e);window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}
let activeFollowImageId = null;
function startImageFollowMouse(img){
  if(!img || img.locked) return;
  activeFollowImageId = img.id;
  toast("🖱️ Di chuột trên canvas để di chuyển ảnh — Click chuột để đặt ảnh (Esc để hủy)");
  const onMove = ev => {
    if(activeFollowImageId !== img.id) return;
    const p = logical(ev);
    img.x = Math.round(p.x - img.w / 2);
    img.y = Math.round(p.y - img.h / 2);
    const layer = document.querySelector(`.imgLayer[data-img-id="${img.id}"]`);
    if(layer){
      layer.style.left = (img.x / 1080 * 100) + "%";
      layer.style.top = (img.y / 1610 * 100) + "%";
    }
    const ix = $("#ix"), iy = $("#iy");
    if(ix) ix.value = img.x;
    if(iy) iy.value = img.y;
  };
  const onClick = ev => {
    ev.stopPropagation();
    activeFollowImageId = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("click", onClick, true);
    save(); refreshImmediate();
    toast("Đã đặt ảnh vào vị trí mới");
  };
  const onKey = ev => {
    if(ev.key === "Escape"){
      activeFollowImageId = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
      refreshImmediate();
      toast("Đã hủy di chuyển theo chuột");
    }
  };
  window.addEventListener("pointermove", onMove);
  setTimeout(() => window.addEventListener("click", onClick, true), 50);
  window.addEventListener("keydown", onKey);
}

function moveImg(e,i,el){
  if(i.locked||e.target.classList.contains("resize"))return;
  const key="image:"+i.id;
  if(e.shiftKey){
    e.preventDefault();e.stopPropagation();
    if(multiSel.has(key))multiSel.delete(key);else multiSel.add(key);
    selected={type:"image",id:i.id};refreshImmediate();return;
  }

  if(e.altKey){
    e.preventDefault();e.stopPropagation();
    const clone = {...deep(i), id: uid("IMG_"), name: (i.name||"Reference")+" copy", z: 10 + sceneLayerItems().length};
    data.images.push(clone);
    normalizeSceneZData();
    multiSel.clear(); multiSel.add("image:" + clone.id);
    selected = {type: "image", id: clone.id};
    refreshImmediate();
    i = clone;
    el = document.querySelector(`.imgLayer[data-img-id="${clone.id}"]`) || el;
    toast("Đã nhân bản ảnh bằng Alt + Kéo chuột");
  }

  if(!multiSel.has(key)){multiSel.clear();multiSel.add(key)}
  selected={type:"image",id:i.id};
  if(multiSel.size>1)return moveSelectionGroup(e,key);
  e.preventDefault();e.stopPropagation();
  let p=logical(e),sx=i.x,sy=i.y;
  const mv=ev=>{
    const q=logical(ev);
    let curX=sx+q.x-p.x;
    let curY=sy+q.y-p.y;
    
    if(wrapBoundaryEnabled){
      if(curX <= -0.6 * i.w){
        curX = 1080 - i.w;
        sx = curX; p.x = q.x;
      } else if(curX >= 1080 - 0.4 * i.w){
        curX = 0;
        sx = curX; p.x = q.x;
      }
      
      if(curY <= -0.6 * i.h){
        curY = 1610 - i.h;
        sy = curY; p.y = q.y;
      } else if(curY >= 1610 - 0.4 * i.h){
        curY = 0;
        sy = curY; p.y = q.y;
      }
    }
    
    i.x=curX; i.y=curY;
    el.style.left=(i.x/1080*100)+"%";
    el.style.top=(i.y/1610*100)+"%";
  };
  const up=()=>{
    window.removeEventListener("pointermove",mv);
    window.removeEventListener("pointerup",up);
    if(wrapBoundaryEnabled){
      if(i.x <= -0.6 * i.w) i.x = 1080 - i.w;
      else if(i.x >= 1080 - 0.4 * i.w) i.x = 0;
      if(i.y <= -0.6 * i.h) i.y = 1610 - i.h;
      else if(i.y >= 1610 - 0.4 * i.h) i.y = 0;
    }
    save();
    refreshImmediate();
  };
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}
function resizeImg(e,i,el){
  if(i.locked)return;e.preventDefault();e.stopPropagation();
  const p=logical(e),sw=i.w,sh=i.h,ratio=Number(i.aspectRatio)>0?Number(i.aspectRatio):(sw/sh||1);
  const mv=ev=>{
    const q=logical(ev),dw=q.x-p.x,dh=q.y-p.y;
    let nw=Math.max(60,sw+dw),nh=Math.max(60,sh+dh);
    if(ev.shiftKey){
      if(Math.abs(dw)>=Math.abs(dh*ratio))nh=Math.max(60,nw/ratio);
      else nw=Math.max(60,nh*ratio);
    }
    i.w=nw;i.h=nh;el.style.width=i.w/1080*100+"%";el.style.height=i.h/1610*100+"%";
  };
  const up=()=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);save();refreshImmediate()};
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}

function renderInspector(){
  const b=$("#inspector");
  let alignHtml="";
  if(multiSel.size > 1){
    alignHtml=`<div class="alignBar">
      <button class="alignBtn" type="button" onclick="alignSelectedObjects('left')" title="Căn lề trái">⇥ Trái</button>
      <button class="alignBtn" type="button" onclick="alignSelectedObjects('centerX')" title="Căn giữa ngang">⇹ Giữa X</button>
      <button class="alignBtn" type="button" onclick="alignSelectedObjects('right')" title="Căn lề phải">⇤ Phải</button>
      <button class="alignBtn" type="button" onclick="alignSelectedObjects('top')" title="Căn lề trên">⤒ Trên</button>
      <button class="alignBtn" type="button" onclick="alignSelectedObjects('centerY')" title="Căn giữa dọc">⇅ Giữa Y</button>
      <button class="alignBtn" type="button" onclick="alignSelectedObjects('bottom')" title="Căn lề dưới">⤓ Dưới</button>
    </div>`;
  }
  const wrapWithAlign = fn => { fn(b); if(alignHtml) b.insertAdjacentHTML("afterbegin", alignHtml); };
  if(selected.type==="level")return wrapWithAlign(levelIns);
  if(selected.type==="drawing")return wrapWithAlign(el=>drawingIns(el));
  if(selected.type==="char")return wrapWithAlign(el=>charIns(el,byChar(selected.id)));
  if(selected.type==="clue")return wrapWithAlign(el=>clueIns(el,byClue(selected.id)));
  if(selected.type==="image")return wrapWithAlign(el=>imageIns(el,byImg(selected.id)));
  if(selected.type==="annotation")return wrapWithAlign(el=>annotationIns(el,byAnn(selected.id)));
  if(selected.type==="reaction")return wrapWithAlign(el=>reactionIns(el,selected.charId,selected.eventId));
  b.innerHTML="Chọn một đối tượng trên màn để xem thuộc tính.";
}

function levelIns(b){
  const art=data.level.art;
  b.innerHTML=`<div class="group col">
    <div class="row">
      <label style="flex:1">Level ID<input id="lid" value="${esc(data.level.id||"")}" placeholder="VD: L001"></label>
      <label style="flex:1">🟢 Target Difficulty
        <select id="ldiffTarget">
          <option value="">-- Chọn --</option>
          <option value="EASY" ${data.level.difficultyTarget==="EASY"?"selected":""}>EASY (DỄ)</option>
          <option value="MEDIUM" ${data.level.difficultyTarget==="MEDIUM"?"selected":""}>MEDIUM (VỪA)</option>
          <option value="HARD" ${data.level.difficultyTarget==="HARD"?"selected":""}>HARD (KHÓ)</option>
        </select>
      </label>
    </div>
    <div class="small">Chọn độ khó dự định ngay từ đầu. Bước TEST ĐỘ KHÓ dùng để kiểm chứng sau khi chơi thử.</div>
    <label>🟢 Drama Hook<textarea id="lh" placeholder="Một câu gây tò mò / yêu cầu người chơi khám phá điều gì...">${esc(data.level.hook)}</textarea></label>
    <div class="tokenPreview"><b>Hook preview:</b> <span id="lhp">${esc(resolveTokens(data.level.hook,editNameMap()))}</span></div>
    <div class="small"><b>2 mạng cố định toàn game.</b> Chỉ mất 1 mạng khi thả sai vị trí nhân vật; thả trượt ra ngoài không mất mạng.</div>
    <label>🟡 Main Reveal<textarea id="lr">${esc(data.level.reveal)}</textarea></label>
    <div class="tokenPreview"><b>Reveal preview:</b> <span id="lrp">${esc(resolveTokens(data.level.reveal,editNameMap()))}</span></div>
    <label>🟡 Main Reveal khi đặt đúng</label><div id="lrw" class="checks">${placementTriggerChecks(data.level.revealWhen)}</div>
    <div class="small">Chỉ áp dụng với nhân vật <b>Di chuyển (Mxx)</b>.</div>
    <label>🟡 Main Reveal nằm dưới Clue
      <select id="lrparent"><option value="">— Không có nhánh cha —</option>${(data.clues||[]).map(cl=>`<option value="${esc(cl.id)}" ${data.level.revealParentClueId===cl.id?"selected":""}>${esc(cl.id)}${cl.text?" · "+esc(cl.text.slice(0,48)):""}</option>`).join("")}</select>
    </label>
    <div class="small">Nếu Tiết lộ là một nhánh con của manh mối, chọn nhánh cha ở đây.</div>
    <label>🟡 Core Truth / Notes<textarea id="lt">${esc(data.level.truth)}</textarea></label>
    <div class="small">Nội dung có thể dùng token như <b>{M01}</b> để tự đổi theo tên nhân vật ngẫu nhiên.</div>
  </div>

  <details class="group prodDetails"><summary>PRODUCTION · BACKGROUND / ART INFO</summary><div class="prodDetailsBody col">
    <div class="row"><label style="width:120px">Version<input id="lver" value="${esc(data.level.version||"1.0")}" placeholder="1.0"></label><div class="spacer"></div><button class="btn" id="addSceneArt">+ Thêm mục</button></div>
    <label>🔵 Asset background chính<input id="bgAssetId" value="${esc(art.backgroundAssetId)}" readonly></label>
    <label>🔵 Mô tả background<textarea id="bgDesc">${esc(art.backgroundDescription)}</textarea></label>
    <label>🔵 Tone màu<input id="bgTone" value="${esc(art.tone)}" placeholder="VD: ấm, pastel, cưới ngoài trời..."></label>
    <label>Chỉ dẫn Reference Layer<textarea id="bgRef">${esc(art.referenceNote)}</textarea></label>
    <label>🔵 Note riêng cho Artist<textarea id="bgArtist">${esc(art.artistNote)}</textarea></label>
    <div class="small">Các lớp ảnh tham khảo và ảnh sơ đồ khung cảnh (PNG) sẽ gửi kèm Asset Request cho Artist.</div>
    <div id="sceneArtList">${(art.sceneItems||[]).map((it,i)=>`<div class="sceneArtItem" data-art-item="${it.id}">
      <div class="row" style="justify-content:space-between"><b>MỤC ${i+1}</b><span class="assetId">${esc(it.assetId||"")}</span></div>
      <label>🔵 Tên / phần cần vẽ<input data-art-name="${it.id}" value="${esc(it.name)}" placeholder="VD: bàn tiệc / bục cưới / giỏ hoa"></label>
      <label>🔵 Mô tả chi tiết<textarea data-art-desc="${it.id}">${esc(it.description)}</textarea></label>
      <label>🔵 Quy cách xuất ảnh<select data-art-mode="${it.id}">
        <option value="BAKED_BG" ${it.exportMode==="BAKED_BG"?"selected":""}>Dính vào BG01 (BAKED_BG)</option>
        <option value="SEPARATE" ${it.exportMode==="SEPARATE"?"selected":""}>PNG riêng / Props (SEPARATE)</option>
        <option value="FOREGROUND" ${it.exportMode==="FOREGROUND"?"selected":""}>PNG tiền cảnh riêng (FOREGROUND)</option>
      </select></label>
      <label>🔵 Asset ID<input data-art-asset="${it.id}" value="${esc(it.assetId||"")}" ${it.exportMode==="BAKED_BG"?"readonly":""}></label>
      <label>🔵 Note Artist<input data-art-note="${it.id}" value="${esc(it.artistNote||"")}"></label>
      <button class="btn danger" data-art-delete="${it.id}">Xóa mục</button>
    </div>`).join("")||'<div class="small">Chưa có mục background/đạo cụ nào.</div>'}</div>
  </div></details>`;

  $("#lid").oninput=e=>{data.level.id=e.target.value.trim().toUpperCase().replace(/[^A-Z0-9_-]/g,"");e.target.value=data.level.id;save();$("#liveName").textContent=data.level.id||"LEVEL"};
  $("#lver").oninput=e=>{data.level.version=e.target.value.trim();save()};
  $("#ldiffTarget").onchange=e=>{data.level.difficultyTarget=e.target.value;data.level.difficultyTested=false;save()};
  $("#lh").oninput=e=>{data.level.hook=e.target.value;save();$("#lhp").textContent=resolveTokens(e.target.value,editNameMap());$("#liveHook").textContent=resolveTokens(e.target.value)};
  $("#lr").oninput=e=>{data.level.reveal=e.target.value;save();$("#lrp").textContent=resolveTokens(e.target.value,editNameMap())};
  $("#lt").oninput=e=>{data.level.truth=e.target.value;save()};
  bindChecks($("#lrw"),a=>{data.level.revealWhen=a;save();renderLogic()});
  $("#lrparent").onchange=e=>{data.level.revealParentClueId=e.target.value;save()};

  $("#bgDesc").oninput=e=>{art.backgroundDescription=e.target.value;save()};
  $("#bgTone").oninput=e=>{art.tone=e.target.value;save()};
  $("#bgRef").oninput=e=>{art.referenceNote=e.target.value;save()};
  $("#bgArtist").oninput=e=>{art.artistNote=e.target.value;save()};
  $("#addSceneArt").onclick=()=>{const it=blankSceneArtItem();art.sceneItems.push(it);save();renderInspector()};
  (art.sceneItems||[]).forEach(it=>{
    const q=attr=>document.querySelector(`[${attr}="${it.id}"]`);
    q("data-art-name").oninput=e=>{it.name=e.target.value;save()};
    q("data-art-desc").oninput=e=>{it.description=e.target.value;save()};
    q("data-art-note").oninput=e=>{it.artistNote=e.target.value;save()};
    q("data-art-mode").onchange=e=>{it.exportMode=e.target.value;syncSceneItemAssetId(it);save();renderInspector()};
    q("data-art-asset").onchange=e=>{if(it.exportMode!=="BAKED_BG"){it.assetId=e.target.value.trim().toUpperCase();save();renderInspector()}};
    q("data-art-delete").onclick=()=>{art.sceneItems=art.sceneItems.filter(x=>x!==it);save();renderInspector()};
  });
}

function charIns(b,c){
  if(!c)return;
  ensureCharacterAssetIds(c);

  const tokenNeedle=`{${c.id}}`;
  const mentionedClues=(data.clues||[]).filter(q=>String(q.text||"").includes(tokenNeedle));
  const resolvedClues=(data.clues||[]).filter(q=>(q.resolveWhen||[]).includes(c.id));
  const triggeredReactions=[];
  data.characters.forEach(src=>(src.reactionEvents||[]).forEach((ev,i)=>{
    const triggered=(src.id===c.id&&ev.triggerType==="SELF_PLACED")||
      ((ev.triggerType==="CHAR_PLACED"||ev.triggerType==="ALL_PLACED")&&(ev.triggerChars||[]).includes(c.id));
    if(triggered)triggeredReactions.push({src,ev,i});
  }));
  const revealByChar=(data.level.revealWhen||[]).includes(c.id);
  const relCardClue=(q,meta)=>`<div class="stateCard relCard" data-rel-clue="${q.id}"><b>${esc(q.id)} · ${esc(resolveTokens(q.text||"(draft)",editNameMap()))}</b><div class="meta">${esc(meta)}</div></div>`;
  const relCardRx=(x,meta)=>`<div class="stateCard relCard" data-rel-rx="${x.src.id}|${x.ev.id}"><b>${esc(x.src.id)} · Reaction ${x.i+1}</b><div class="meta">${esc(meta)} · ${esc(triggerLabel(x.src,x.ev))}</div></div>`;
  const incomingHtml=mentionedClues.map(q=>relCardClue(q,"Clue có nhắc "+c.id)).join("")||'<div class="relEmpty">Không có clue text nào nhắc trực tiếp Character này. Có thể logic đến từ visual / ngoại hình / loại trừ.</div>';
  const outgoingHtml=[
    ...resolvedClues.map(q=>relCardClue(q,"Clue hoàn tất có điều kiện "+c.id+" đặt đúng")),
    ...triggeredReactions.map(x=>relCardRx(x,"Trigger có "+c.id)),
    ...(revealByChar?[`<div class="stateCard relCard" data-rel-level="1"><b>MAIN REVEAL</b><div class="meta">Trigger có ${esc(c.id)}</div></div>`]:[])
  ].join("")||'<div class="relEmpty">Character này chưa trực tiếp làm clue/reaction/reveal thay đổi.</div>';

  const initialMeta=`${esc(c.baseExpression||"😐")} — ${esc(emotionName(c.baseExpression))} · ${esc(gazeClockText(c.id,initialStateRecord(c)))}${c.baseTarget?" · target "+esc(c.baseTarget):""}`;
  const visualRows=[
    `<div class="assetLine"><span class="assetId">${esc(c.assetBaseId)}</span><span>BASE · ${initialMeta}</span></div>`,
    ...(c.type==="M"?[`<div class="assetLine"><span class="assetId">${esc(c.assetTrayId)}</span><span>TRAY · ${initialMeta}</span></div>`]:[]),
    ...(c.reactionEvents||[]).flatMap(ev=>(ev.steps||[]).map(st=>`<div class="assetLine"><span class="assetId">${esc(st.assetId)}</span><span>${esc(st.emotion||"∅")}${st.emotion?" — "+esc(emotionName(st.emotion)):""}${st.symbol?" "+esc(st.symbol):""} · ${esc(gazeClockText(c.id,st))}${st.target?" · target "+esc(st.target):""}</span></div>`))
  ].join("");

  b.innerHTML=`<div class="group col">
    <label>Character ID<input id="ci" value="${c.id}"></label>
    <label>🟢 Character Name<input id="cn" value="${esc(c.name)}"></label>
    <label>🟡 Name Pool (Shuffle)
      <select id="cpool"><option value="KEEP">Giữ nguyên tên này</option><option value="MALE">Kho tên Nam</option><option value="FEMALE">Kho tên Nữ</option><option value="NEUTRAL">Kho tên Trung tính</option></select>
    </label>
    <label>🟢 Role / Notes<input id="cr" value="${esc(c.role)}"></label>
    <div class="row">
<label style="flex:1">Loại nhân vật<select id="ct"><option value="M">Di chuyển (M)</option><option value="F">Cố định (F)</option></select></label>
<button class="btn ${c.flipH?'on':''}" id="cflipH" type="button" style="margin-top:18px" title="Lật hướng nhìn đối xứng">⇄ Direction (Flip H)</button>
</div>
    <label>🟢 Ngoại hình / Appearance Tags<textarea id="ca">${esc(appearanceText(c))}</textarea></label>
    <div class="small">Enter = xuống dòng trong <b>cùng một tag</b>, không tạo tag mới.</div>
    <label>🟢 Initial Emotion (Bắt đầu${c.type==="M"?" / Khay":""})<select id="cbaseexp">${emojiOptions(c.baseExpression,false)}</select></label>
    <div class="row"><label style="flex:1">🟢 Initial Gaze<select id="cbasegaze">${GAZES.map(g=>`<option value="${g}" ${g===c.baseGaze?"selected":""}>${g==="AUTO"?"Tự động — theo Target":g==="NONE"?"Không nhìn":g+" giờ"}</option>`).join("")}</select></label><label style="flex:1">Gaze Target<select id="cbasetarget">${opts(c.baseTarget,true)}</select></label></div>
    <div class="small"><b>Tự động</b> tự tính hướng từ vị trí nhân vật tới Target.</div>
    ${c.type==="M"?`<div class="small">Nhân vật di chuyển luôn có trên Khay và Khung vẽ. <b>Vị trí trên Artboard chính là đáp án (Solved Position).</b></div>`:""}
  </div>

  <div class="group"><div class="head" style="margin:0 0 4px"><b>AUTO CONNECTIONS</b><span class="pill gameplay">${esc(c.id)}</span></div><div class="small">Hệ thống tự tổng hợp liên kết, không cần cấu hình thêm.</div><div class="relSection"><small>Clue nhắc Character này</small>${incomingHtml}</div><div class="relSection"><small>Khi đặt ${esc(c.id)} tham gia kích hoạt</small>${outgoingHtml}</div></div>

  <details class="group prodDetails"><summary>PRODUCTION · CHARACTER ART</summary><div class="prodDetailsBody col">
    <div class="row"><label style="flex:1">Gender<select id="cgender"><option value="UNSPECIFIED">Chưa xác định</option><option value="MALE">Nam</option><option value="FEMALE">Nữ</option><option value="OTHER">Khác</option></select></label><label style="flex:1">Độ tuổi<input id="cage" value="${esc(c.age||"")}" placeholder="VD: 8 tuổi / 20-25 / trung niên"></label></div>
    <label>Base Asset ID<input id="cbaseasset" value="${esc(c.assetBaseId||"")}"></label>
    ${c.type==="M"?`<label>Tray Asset ID<input id="ctrayasset" value="${esc(c.assetTrayId||"")}"></label>`:""}
    <label>Note riêng cho Artist<textarea id="cartnote">${esc(c.artistNote||"")}</textarea></label>
    <div class="assetBox">${visualRows||'<span class="assetMuted">Chưa có trạng thái asset.</span>'}</div>
  </div></details>

  <div class="group"><div class="head" style="margin:0 0 6px"><b>Reaction Events</b><button class="btn" id="addEvent">+ Thêm phản ứng</button></div><div class="timeline">${(c.reactionEvents||[]).map((ev,i)=>`<div class="stateCard" data-event="${ev.id}"><b>EVENT ${i+1} · ${ev.steps.length} bước</b><div class="meta">KHI: ${esc(triggerLabel(c,ev))}</div><div class="rxSeq">${esc(sequencePreview(ev,c.id))}</div></div>`).join("")||'<div class="small">Chưa có phản ứng.</div>'}</div></div>
  <button class="btn danger" id="cd">Xóa nhân vật</button>`;

  $("#ct").value=c.type;$("#cpool").value=c.namePool||"KEEP";$("#cgender").value=c.gender||"UNSPECIFIED";
  $("#ci").onchange=e=>{const old=c.id,n=e.target.value.trim().toUpperCase(),expectedPrefix=c.type;if(!new RegExp("^"+expectedPrefix+"\\d+$").test(n)){toast("Nhân vật di chuyển dùng mã Mxx, Cố định dùng mã Fxx");e.target.value=old;return}if(data.characters.some(x=>x!==c&&x.id===n)){toast("Mã trùng lặp");e.target.value=old;return}c.id=n;remapCharacterAssetPrefix(c,old,n);remapCharacterIdEverywhereInDataset(data,old,n,c.type,c.type);selected.id=n;save();refreshImmediate()};
  $("#cn").oninput=e=>{c.name=e.target.value;save();$$(`[data-char-name="${c.id}"]`).forEach(n=>n.textContent=e.target.value)};$("#cn").onchange=()=>{renderLists();renderClues();renderLive()};
  $("#cpool").onchange=e=>{c.namePool=e.target.value;if(c.gender==="UNSPECIFIED")c.gender=inferGender({...c,gender:""});save();renderInspector()};
  $("#cr").oninput=e=>{c.role=e.target.value;save()};$("#cr").onchange=()=>renderLists();
  if($("#cflipH"))$("#cflipH").onclick=()=>{c.flipH=!c.flipH;save();refreshImmediate();renderInspector()};
$("#ct").onchange=e=>{const result=syncCharacterTypeId(c,e.target.value);selected.id=result.newId;save();refreshImmediate();toast(`${result.oldId} → ${result.newId} · ${c.type==="M"?"Di chuyển":"Cố định"}${result.triggerReview?` · ${result.triggerReview} Phản ứng cần chọn lại điều kiện`:""}`)};
  $("#ca").oninput=e=>{c.appearance=e.target.value.split("\n").map(x=>x.trim()).filter(Boolean);save()};$("#ca").onchange=()=>renderLive();
  $("#cgender").onchange=e=>{c.gender=e.target.value;save()};$("#cage").oninput=e=>{c.age=e.target.value;save()};
  $("#cbaseasset").onchange=e=>{c.assetBaseId=e.target.value.trim().toUpperCase();save();renderInspector()};if($("#ctrayasset"))$("#ctrayasset").onchange=e=>{c.assetTrayId=e.target.value.trim().toUpperCase();save();renderInspector()};
  $("#cbaseexp").onchange=e=>{c.baseExpression=normalizeEmotionEmoji(e.target.value);save();renderInspector();renderLive()};$("#cbasegaze").onchange=e=>{c.baseGaze=normalizeGazeValue(e.target.value);save();renderInspector();renderLive();renderLogic()};$("#cbasetarget").onchange=e=>{c.baseTarget=e.target.value;save();renderInspector();renderLive();renderLogic()};
  $("#cartnote").oninput=e=>{c.artistNote=e.target.value;save()};
  $$('[data-rel-clue]').forEach(el=>el.onclick=()=>{selected={type:"clue",id:el.dataset.relClue};refreshImmediate()});$$('[data-rel-rx]').forEach(el=>el.onclick=()=>{const [charId,eventId]=el.dataset.relRx.split("|");selected={type:"reaction",charId,eventId};refreshImmediate()});$$('[data-rel-level]').forEach(el=>el.onclick=()=>{selected={type:"level",id:"level"};refreshImmediate()});
  $("#addEvent").onclick=()=>{const ev=blankReactionEvent(c.type==="M"?"SELF_PLACED":"CHAR_PLACED");c.reactionEvents.push(ev);ensureCharacterAssetIds(c);selected={type:"reaction",charId:c.id,eventId:ev.id};save();refreshImmediate()};$$('[data-event]').forEach(el=>el.onclick=()=>{selected={type:"reaction",charId:c.id,eventId:el.dataset.event};refreshImmediate()});
  $("#cd").onclick=()=>{deleteCharacter(c.id);multiSel.clear();selected={type:"level",id:"level"};save();refreshImmediate()};
}

function clueIns(b,c){
  if(!c)return;
  const isRoot=!c.parent;
  const descendants=clueDescendantIds(c.id);
  const parentOptions=data.clues
    .filter(x=>x.id!==c.id&&!descendants.has(x.id))
    .map(x=>`<option value="${x.id}">${x.id}</option>`)
    .join("");

  b.innerHTML=`<div class="group col">
    <label>Clue ID
      <input value="${c.id}" readonly title="Mã tự đổi theo cấu trúc cha/con">
    </label>
    <div class="small">Mã manh mối tự cập nhật theo cây. Gốc = CL01, CL02…; con = CL01.1, CL01.2…</div>

    <label>🟡 Parent Clue
      <select id="qp">
        <option value="">-- Gốc / không có cha --</option>
        ${parentOptions}
      </select>
    </label>

    ${isRoot
      ? `<div class="small"><b>🟢 Root Clue:</b> có sẵn ngay từ đầu màn chơi.</div>`
      : `<label>🟡 Pre-open State<select id="qpre"><option value="LOCKED">Khóa — hiện ô khóa (LOCKED)</option><option value="HIDDEN">Ẩn — không hiện gì (HIDDEN)</option></select></label>`
    }

    <label>🟢 Clue Text<textarea id="qt">${esc(c.text)}</textarea></label>

    <div class="row">
      <select id="tokenChar" style="flex:1">${opts("",true)}</select>
      <button class="btn" id="insertToken" style="white-space:nowrap">🟢 + Token {ID}</button>
    </div>
    <button class="btn" id="tokenizeNames">Tokenize Names (→ {M01})</button>
    <div class="small">Dữ liệu lưu dạng <b>{M01}</b>; màn chơi sẽ tự đổi thành tên nhân vật tương ứng.</div>
    <div class="tokenPreview"><b>Xem trước Clue:</b> <span id="cluePreview">${esc(resolveTokens(c.text,editNameMap()))}</span></div>

    <label>🟢 Solve Requires (Placement VÀ)</label>
    <div id="qrw" class="checks">${placementTriggerChecks(c.resolveWhen)}</div>
    <div class="small">Chỉ chọn <b>Di chuyển (Mxx)</b>. Mục này dùng để gạch hoàn tất manh mối và mở nhánh con.</div>

    <div class="small">Manh mối con tự mở khi <b>manh mối cha hoàn tất</b>.</div>
    <button class="btn" id="qchild">+ Sub-Clue</button>
    <button class="btn danger" id="qd">Xóa manh mối</button>
  </div>`;

  $("#qp").value=c.parent||"";
  if($("#qpre"))$("#qpre").value=c.preOpen||"LOCKED";

  const updatePreview=()=>{
    $("#cluePreview").textContent=resolveTokens(c.text,editNameMap());
    const x=document.querySelector(`[data-clue-text="${c.id}"]`);
    if(x)x.textContent=resolveTokens(c.text||"(draft)",editNameMap());
  };

  $("#qt").oninput=e=>{c.text=e.target.value;save();updatePreview()};
  $("#qt").onchange=()=>renderLists();
  $("#insertToken").onclick=()=>{const id=$("#tokenChar").value;if(!id){toast("Chọn Character trước");return}insertAtCursor($("#qt"),"{"+id+"}")};
  $("#tokenizeNames").onclick=()=>{const next=tokenizeKnownNames($("#qt").value);$("#qt").value=next;c.text=next;save();updatePreview();renderLists();toast("Đã chuyển tên nhận diện được thành token")};
  $("#qp").onchange=e=>{const newParent=e.target.value||null;c.parent=newParent;c.preOpen=newParent?(c.preOpen==="HIDDEN"?"HIDDEN":"LOCKED"):"ACTIVE";renumberClues();selected={type:"clue",id:c.id};save();refreshImmediate();toast(newParent?`Đã chuyển thành clue con: ${c.id}`:`Đã chuyển thành root: ${c.id}`)};
  if($("#qpre"))$("#qpre").onchange=e=>{c.preOpen=e.target.value;save();refreshImmediate()};
  bindChecks($("#qrw"),a=>{c.resolveWhen=a;save();renderLogic()});
  $("#qchild").onclick=()=>addClue(c.id);
  $("#qd").onclick=()=>{deleteClue(c.id);renumberClues();multiSel.clear();selected={type:"level",id:"level"};save();refreshImmediate()};
}
function emojiOptions(current,allowEmpty=true){
  current=normalizeEmotionEmoji(current,allowEmpty);
  let out=allowEmpty?'<option value="">∅ — Không đổi biểu cảm</option>':'';
  Object.entries(EMOTION_GROUPS).forEach(([group,arr])=>{
    out+=`<optgroup label="${esc(group)}">`;
    arr.forEach(([emoji,name])=>out+=`<option value="${emoji}" ${emoji===current?"selected":""}>${emoji} — ${esc(name)}</option>`);
    out+='</optgroup>';
  });
  return out;
}
function symbolOptions(current){
  return SYMBOLS.map(x=>`<option value="${x}" ${x===current?"selected":""}>${x||"∅"}</option>`).join("");
}

function reactionIns(b,charId,eventId){
  const c=byChar(charId);if(!c)return;
  const ev=(c.reactionEvents||[]).find(x=>x.id===eventId);if(!ev)return;
  const idx=c.reactionEvents.indexOf(ev);
  const movableFilter=x=>x.type==="M";

  b.innerHTML=`<div class="group col">
    <div><b style="font-size:12px">${c.id} · REACTION EVENT ${idx+1}</b></div>

    <label>Trigger Condition (Khi)
      <select id="evTrigger">
        ${c.type==="M"?'<option value="SELF_PLACED">Bản thân được đặt đúng vị trí (SELF_PLACED)</option>':""}
        <option value="CHAR_PLACED">Một Nhân vật khác được đặt đúng vị trí (CHAR_PLACED)</option>
        <option value="ALL_PLACED">Nhiều Nhân vật đã được đặt đúng vị trí (ALL_PLACED)</option>
      </select>
    </label>

    <div id="triggerConfig"></div>

    <div class="small"><b>Phản ứng mới sẽ cắt chuỗi cũ</b> của cùng nhân vật và chạy ngay lập tức.</div>

    <div class="head" style="margin-top:8px"><b>🟢 Reaction Sequence</b><button class="btn" id="addStep">+ Thêm bước</button></div>
    <div id="stepList"></div>

    <label>Giữ lại sau khi chạy hết Reaction
      <select id="evSettleStep"></select>
    </label>
    <div class="small">Chạy đủ các Step theo thời gian, rồi chuyển về biểu cảm ban đầu hoặc Step đã chọn. Giữ trạng thái này đến Reaction tiếp theo.</div>

    <div class="row"><button class="btn" id="evUp">↑ Lên</button><button class="btn" id="evDown">↓ Xuống</button></div>
    <button class="btn danger" id="evDelete">Xóa Reaction Event</button>
    <button class="btn" id="backChar">← Quay lại Character</button>
  </div>`;

  $("#evTrigger").value=ev.triggerType;

  const renderTriggerConfig=()=>{
    const box=$("#triggerConfig");
    if(ev.triggerType==="CHAR_PLACED"){
      box.innerHTML=`<label>🟢 Nhân vật gây kích hoạt<select id="evOne">${opts(ev.triggerChars?.[0]||"",true,movableFilter)}</select></label>`;
      $("#evOne").onchange=e=>{ev.triggerChars=e.target.value?[e.target.value]:[];save();renderLists();renderLogic()};
    }else if(ev.triggerType==="ALL_PLACED"){
      box.innerHTML=`<label>🟢 Các Nhân vật phải đã đặt đúng vị trí</label><div id="evMany" class="checks">${checks(ev.triggerChars||[],movableFilter)}</div>`;
      bindChecks($("#evMany"),a=>{ev.triggerChars=a;save();renderLists();renderLogic()});
    }else{
      box.innerHTML=`<div class="small">Điều kiện kích hoạt chính là ${c.id} được đặt đúng vị trí.</div>`;
    }
  };

  const renderSteps=()=>{
    const keep=$("#evSettleStep");
    if(keep){
      keep.innerHTML=`<option value="INITIAL">Biểu cảm ban đầu · ${esc(c.baseExpression||"bình thường")}</option>`+
        ev.steps.map((st,i)=>`<option value="${esc(st.id)}">Step ${i+1} · ${esc(reactionPreview(st,c.id)||"∅")}</option>`).join("");
      keep.value=ev.settleStepId||"INITIAL";
      keep.onchange=e=>{ev.settleStepId=e.target.value;save();renderLists();renderLogic()};
    }
    $("#stepList").innerHTML=ev.steps.map((st,i)=>`<div class="stateCard" style="cursor:default;margin-bottom:7px">
      <div class="row" style="justify-content:space-between"><b>BƯỚC ${i+1}</b></div><div class="meta">${reactionPreview(st,c.id)} · ${esc(gazeClockText(c.id,st))}</div>
      <label>🔵 Mã Asset ID<input data-step-asset="${st.id}" value="${esc(st.assetId||"")}"></label>

      <div class="row">
        <label style="flex:1">🟢 Biểu cảm<select data-step-emotion="${st.id}">${emojiOptions(st.emotion)}</select></label>
        <label style="flex:1">🟢 Biểu tượng<select data-step-symbol="${st.id}">${symbolOptions(st.symbol)}</select></label>
      </div>

      <div class="row">
        <label style="flex:1">🟢 Hướng mắt<select data-step-gaze="${st.id}">${GAZES.map(g=>`<option value="${g}" ${g===st.gaze?"selected":""}>${g==="AUTO"?"Tự động — theo Mục tiêu":g==="NONE"?"Không nhìn":g+" giờ"}</option>`).join("")}</select></label>
        <label style="flex:1">🟢 Mục tiêu nhìn<select data-step-target="${st.id}">${opts(st.target,true)}</select></label>
      </div>

      <div class="small"><b>Tự động</b> tự đo vị trí từ nhân vật tới mục tiêu và quy về hướng đồng hồ (1–12 giờ).</div>

      <div class="row">
        <label style="flex:1">🟢 Thời gian (giây)<input data-step-duration="${st.id}" type="number" min="0.1" step="0.1" value="${st.duration}"></label>
        <label class="check" style="align-self:end;margin-bottom:4px"><input data-step-hold="${st.id}" type="checkbox" ${st.hold?"checked":""}> 🟢 Giữ lại</label>
      </div>

      <div class="row">
        <button class="btn" data-step-up="${st.id}">↑</button>
        <button class="btn" data-step-down="${st.id}">↓</button>
        <button class="btn danger" data-step-delete="${st.id}">Xóa bước</button>
      </div>
    </div>`).join("");

    ev.steps.forEach((st,i)=>{
      const q=attr=>document.querySelector(`[${attr}="${st.id}"]`);
      q("data-step-asset").onchange=e=>{st.assetId=e.target.value.trim().toUpperCase();save();renderLists()};
      q("data-step-emotion").onchange=e=>{st.emotion=e.target.value;save();renderLists();renderLive()};
      q("data-step-symbol").onchange=e=>{st.symbol=e.target.value;save();renderLists();renderLive()};
      q("data-step-gaze").onchange=e=>{st.gaze=e.target.value;save();renderInspector();renderLists();renderLive()};
      q("data-step-target").onchange=e=>{st.target=e.target.value;save();renderInspector();renderLists();renderLive()};
      q("data-step-duration").onchange=e=>{st.duration=Math.max(.1,+e.target.value||.6);save()};
      q("data-step-hold").onchange=e=>{st.hold=e.target.checked;save()};
      q("data-step-up").onclick=()=>{if(i>0){[ev.steps[i-1],ev.steps[i]]=[ev.steps[i],ev.steps[i-1]];save();renderInspector();renderLists()}};
      q("data-step-down").onclick=()=>{if(i<ev.steps.length-1){[ev.steps[i+1],ev.steps[i]]=[ev.steps[i],ev.steps[i+1]];save();renderInspector();renderLists()}};
      q("data-step-delete").onclick=()=>{
        if(ev.steps.length<=1){toast("Sự kiện phản ứng phải có ít nhất 1 bước");return}
        ev.steps=ev.steps.filter(x=>x!==st);
        if(ev.settleStepId===st.id){ev.settleStepId="INITIAL";toast("Step giữ lại đã bị xóa · chuyển về biểu cảm ban đầu")}
        save();renderInspector();renderLists();
      };
    });
  };

  renderTriggerConfig();
  renderSteps();

  $("#evTrigger").onchange=e=>{
    ev.triggerType=e.target.value;
    if(ev.triggerType==="SELF_PLACED")ev.triggerChars=[];
    else if(ev.triggerType==="CHAR_PLACED")ev.triggerChars=(ev.triggerChars||[]).slice(0,1);
    save();renderTriggerConfig();renderLists();renderLogic();
  };
  $("#addStep").onclick=()=>{
    const wasLast=ev.settleStepId===ev.steps[ev.steps.length-1]?.id;
    const step=blankReactionStep();ev.steps.push(step);
    if(wasLast)ev.settleStepId=step.id;
    ensureCharacterAssetIds(c);save();renderInspector();renderLists()
  };
  $("#evUp").onclick=()=>{if(idx>0){[c.reactionEvents[idx-1],c.reactionEvents[idx]]=[c.reactionEvents[idx],c.reactionEvents[idx-1]];save();refreshImmediate()}};
  $("#evDown").onclick=()=>{if(idx<c.reactionEvents.length-1){[c.reactionEvents[idx+1],c.reactionEvents[idx]]=[c.reactionEvents[idx],c.reactionEvents[idx+1]];save();refreshImmediate()}};
  $("#evDelete").onclick=()=>{c.reactionEvents=c.reactionEvents.filter(x=>x!==ev);selected={type:"char",id:c.id};save();refreshImmediate()};
  $("#backChar").onclick=()=>{selected={type:"char",id:c.id};refreshImmediate()};
}

function imageIns(b,i){
  if(!i)return;
  b.innerHTML=`<div class="group col">
    <div><b>🟡 REFERENCE LAYER · IMAGE INSPECTOR</b></div>
    <label>🟡 Layer Name<input id="in" value="${esc(i.name)}"></label>
    <div class="row"><label>🟡 Position X<input id="ix" type="number" value="${Math.round(i.x)}"></label><label>🟡 Position Y<input id="iy" type="number" value="${Math.round(i.y)}"></label></div>
    <div class="row"><label>🟡 Width<input id="iw" type="number" value="${Math.round(i.w)}"></label><label>🟡 Height<input id="ih" type="number" value="${Math.round(i.h)}"></label></div>
    
    <div class="head" style="margin-top:6px"><b>TRANSFORM & UTILITIES</b></div>
    <div class="row">
      <button class="btn ${i.flipH?'on':''}" id="flipHImg" type="button" title="Lật đối xứng ngang (tâm ở giữa)">⇄ Flip H</button>
      <button class="btn ${i.flipV?'on':''}" id="flipVImg" type="button" title="Lật đối xứng dọc (tâm ở giữa)">⇅ Flip V</button>
      <button class="btn" id="rotResetImg" type="button" title="Góc 0°">0°</button>
      <button class="btn" id="centerCanvasImg" type="button" title="Căn giữa Artboard">Center Artboard</button>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn ${wrapBoundaryEnabled?'on':''}" id="toggleWrapBtn" type="button" style="width:100%" title="Tự động chuyển ảnh sang phía đối diện khi bị kéo khuất quá 60% biên Artboard">
        Wrap Artboard Boundary (60%): ${wrapBoundaryEnabled ? 'BẬT' : 'TẮT'}
      </button>
    </div>
    <div class="row" style="margin-top:4px">
      <label style="flex:1">Rotation (°)<input id="irot" type="number" min="0" max="360" value="${i.rotation||0}"></label>
      <button class="btn" id="rot90Img" type="button" style="margin-top:18px">+90°</button>
    </div>
    
    <label style="margin-top:4px">Opacity: <b id="iopText">${i.opacity!==undefined?i.opacity:100}%</b>
      <input id="iop" type="range" min="10" max="100" value="${i.opacity!==undefined?i.opacity:100}">
    </label>

    <div class="head" style="margin-top:6px"><b>EFFECTS & FILTERS</b></div>
    <div class="row">
      <label style="flex:1">Blend Mode
        <select id="iblend">
          <option value="normal" ${(!i.blendMode||i.blendMode==='normal')?'selected':''}>Normal</option>
          <option value="multiply" ${i.blendMode==='multiply'?'selected':''}>Multiply</option>
          <option value="screen" ${i.blendMode==='screen'?'selected':''}>Screen</option>
          <option value="overlay" ${i.blendMode==='overlay'?'selected':''}>Overlay</option>
          <option value="darken" ${i.blendMode==='darken'?'selected':''}>Darken</option>
          <option value="lighten" ${i.blendMode==='lighten'?'selected':''}>Lighten</option>
          <option value="color-dodge" ${i.blendMode==='color-dodge'?'selected':''}>Color Dodge</option>
          <option value="difference" ${i.blendMode==='difference'?'selected':''}>Difference</option>
        </select>
      </label>
      <label style="flex:1">Drop Shadow
        <select id="ishadow">
          <option value="none" ${(!i.shadow||i.shadow==='none')?'selected':''}>None</option>
          <option value="soft" ${i.shadow==='soft'?'selected':''}>Soft Shadow</option>
          <option value="hard" ${i.shadow==='hard'?'selected':''}>Hard Shadow</option>
          <option value="glow" ${i.shadow==='glow'?'selected':''}>Glow</option>
        </select>
      </label>
    </div>

    <label style="margin-top:4px">Corner Radius: <b id="iradText">${i.radius||0}px</b>
      <input id="irad" type="range" min="0" max="60" value="${i.radius||0}">
    </label>

    <label style="margin-top:4px">Brightness: <b id="ibrightText">${i.brightness!==undefined?i.brightness:100}%</b>
      <input id="ibright" type="range" min="50" max="150" value="${i.brightness!==undefined?i.brightness:100}">
    </label>

    <label style="margin-top:4px">Contrast: <b id="icontrastText">${i.contrast!==undefined?i.contrast:100}%</b>
      <input id="icontrast" type="range" min="50" max="150" value="${i.contrast!==undefined?i.contrast:100}">
    </label>

    <label style="margin-top:4px">Saturation: <b id="isatText">${i.saturate!==undefined?i.saturate:100}%</b>
      <input id="isat" type="range" min="0" max="200" value="${i.saturate!==undefined?i.saturate:100}">
    </label>

    <label style="margin-top:4px">Blur: <b id="iblurText">${i.blur||0}px</b>
      <input id="iblur" type="range" min="0" max="15" value="${i.blur||0}">
    </label>

    <div class="row" style="margin-top:6px">
      <button class="btn smBtn ${i.grayscale===100?'on':''}" id="filterBwBtn" type="button">B&W</button>
      <button class="btn smBtn ${i.sepia===100?'on':''}" id="filterSepiaBtn" type="button">Sepia</button>
      <button class="btn smBtn ${i.invert===100?'on':''}" id="filterInvertBtn" type="button">Invert</button>
      <button class="btn smBtn danger" id="resetFiltersBtn" type="button">Reset Filters</button>
    </div>

    <div class="head" style="margin-top:8px"><b>LAYER ORDER & Z-INDEX</b></div>
    <label class="row"><input id="il" type="checkbox" style="width:auto" ${i.locked?"checked":""}> Khóa vị trí (Lock)</label>
    <div class="row"><button class="btn" id="dupImg" type="button">Duplicate</button><button class="btn" id="imgFront" type="button">Bring to Front</button><button class="btn" id="imgBack" type="button">Send to Back</button></div>
    <div class="row"><button class="btn" id="imgForward" type="button">Bring Forward</button><button class="btn" id="imgBackward" type="button">Send Backward</button></div>
    <div class="small">Ảnh và hình vẽ dùng chung thứ tự lớp hiển thị.</div>
  </div>`;
  const up=()=>{
    i.name=$("#in").value;i.x=+$("#ix").value;i.y=+$("#iy").value;i.w=Math.max(20,+$("#iw").value);i.h=Math.max(20,+$("#ih").value);i.locked=$("#il").checked;
    i.rotation=+($("#irot")?$("#irot").value:0);i.opacity=+($("#iop")?$("#iop").value:100);
    i.blendMode=$("#iblend")?$("#iblend").value:'normal';
    i.shadow=$("#ishadow")?$("#ishadow").value:'none';
    i.radius=+($("#irad")?$("#irad").value:0);
    i.brightness=+($("#ibright")?$("#ibright").value:100);
    i.contrast=+($("#icontrast")?$("#icontrast").value:100);
    i.saturate=+($("#isat")?$("#isat").value:100);
    i.blur=+($("#iblur")?$("#iblur").value:0);
    save();refreshImmediate();
  };
  ["in","ix","iy","iw","ih","il","irot","iblend","ishadow"].forEach(id=>{const el=$("#"+id);if(el)el.onchange=up});
  if($("#iop"))$("#iop").oninput=e=>{i.opacity=+e.target.value;$("#iopText").textContent=e.target.value+"%";save();refreshImmediate()};
  if($("#irad"))$("#irad").oninput=e=>{i.radius=+e.target.value;$("#iradText").textContent=e.target.value+"px";save();refreshImmediate()};
  if($("#ibright"))$("#ibright").oninput=e=>{i.brightness=+e.target.value;$("#ibrightText").textContent=e.target.value+"%";save();refreshImmediate()};
  if($("#icontrast"))$("#icontrast").oninput=e=>{i.contrast=+e.target.value;$("#icontrastText").textContent=e.target.value+"%";save();refreshImmediate()};
  if($("#isat"))$("#isat").oninput=e=>{i.saturate=+e.target.value;$("#isatText").textContent=e.target.value+"%";save();refreshImmediate()};
  if($("#iblur"))$("#iblur").oninput=e=>{i.blur=+e.target.value;$("#iblurText").textContent=e.target.value+"px";save();refreshImmediate()};

  if($("#centerCanvasImg"))$("#centerCanvasImg").onclick=()=>{
    i.x=Math.round((1080 - i.w) / 2);
    i.y=Math.round((1610 - i.h) / 2);
    save();refreshImmediate();renderInspector();toast("Đã căn giữa màn hình");
  };
  if($("#flipHImg"))$("#flipHImg").onclick=()=>{i.flipH=!i.flipH;save();refreshImmediate();renderInspector()};
  if($("#flipVImg"))$("#flipVImg").onclick=()=>{i.flipV=!i.flipV;save();refreshImmediate();renderInspector()};
  if($("#rot90Img"))$("#rot90Img").onclick=()=>{i.rotation=((i.rotation||0)+90)%360;save();refreshImmediate();renderInspector()};
  if($("#rotResetImg"))$("#rotResetImg").onclick=()=>{i.rotation=0;save();refreshImmediate();renderInspector()};
    if($("#toggleWrapBtn")){
    $("#toggleWrapBtn").onclick=()=>{
      wrapBoundaryEnabled = !wrapBoundaryEnabled;
      localStorage.setItem("dramaEditorWrapBoundary", wrapBoundaryEnabled);
      refreshImmediate();
      toast("Cuộn viền Artboard: " + (wrapBoundaryEnabled ? "BẬT" : "TẮT"));
    };
  }
  
  if($("#filterBwBtn"))$("#filterBwBtn").onclick=()=>{i.grayscale=i.grayscale===100?0:100;save();refreshImmediate();renderInspector()};
  if($("#filterSepiaBtn"))$("#filterSepiaBtn").onclick=()=>{i.sepia=i.sepia===100?0:100;save();refreshImmediate();renderInspector()};
  if($("#filterInvertBtn"))$("#filterInvertBtn").onclick=()=>{i.invert=i.invert===100?0:100;save();refreshImmediate();renderInspector()};
  if($("#resetFiltersBtn"))$("#resetFiltersBtn").onclick=()=>{
    i.brightness=100;i.contrast=100;i.saturate=100;i.blur=0;i.grayscale=0;i.sepia=0;i.invert=0;
    i.blendMode='normal';i.shadow='none';i.radius=0;
    save();refreshImmediate();renderInspector();toast("Đã đặt lại bộ lọc ảnh");
  };

  $("#dupImg").onclick=()=>duplicateImage(i);
  $("#imgFront").onclick=()=>{moveSceneLayer("image",i,"front");save();refreshImmediate()};
  $("#imgBack").onclick=()=>{moveSceneLayer("image",i,"back");save();refreshImmediate()};
  $("#imgForward").onclick=()=>{moveSceneLayer("image",i,"forward");save();refreshImmediate()};
  $("#imgBackward").onclick=()=>{moveSceneLayer("image",i,"backward");save();refreshImmediate()};
}

function bindAnnotationTransformControls(a){
  if($("#flipHAnn")) $("#flipHAnn").onclick = () => { a.flipH = !a.flipH; save(); refreshImmediate(); renderInspector(); };
  if($("#flipVAnn")) $("#flipVAnn").onclick = () => { a.flipV = !a.flipV; save(); refreshImmediate(); renderInspector(); };
  if($("#anRotReset")) $("#anRotReset").onclick = () => { a.rotation = 0; save(); refreshImmediate(); renderInspector(); };
  if($("#centerCanvasAnn")) $("#centerCanvasAnn").onclick = () => {
    a.x = Math.round((1080 - (a.w || 100)) / 2);
    a.y = Math.round((1610 - (a.h || 100)) / 2);
    save(); refreshImmediate(); renderInspector(); toast("Đã căn giữa Artboard");
  };
  if($("#anRot")){
    const onAnRot = e => {
      a.rotation = ((+e.target.value % 360) + 360) % 360;
      save(); refreshImmediate();
    };
    $("#anRot").oninput = onAnRot;
    $("#anRot").onchange = onAnRot;
  }
  if($("#anRot90")) $("#anRot90").onclick = () => {
    a.rotation = (((a.rotation || 0) + 90) % 360);
    save(); refreshImmediate(); renderInspector();
  };
}

function annotationIns(b,a){
  if(!a)return;
  const isText=a.type==="text";
  const isArrow=a.type==="arrow";
  const isQslot=a.type==="qslot";
  const typeName={
    rect:"HÌNH CHỮ NHẬT",
    circle:"HÌNH TRÒN",
    triangle:"HÌNH TAM GIÁC",
    star:"NGÔI SAO 5 CÁNH",
    polygon:"HÌNH LỤC GIÁC",
    line:"ĐOẠN THẲNG VECTOR",
    arrow:"MŨI TÊN CHỈ DẪN",
    text:"GHI CHÚ CHỮ"
  }[a.type]||a.type.toUpperCase();

  if(["pen", "pencil", "brush"].includes(a.type)){
    const typeTitle = {
      pen: "NÉT VẼ BÚT MỰC",
      brush: "NÉT VẼ CỌ VẼ",
      pencil: "NÉT VẼ BÚT CHÌ"
    }[a.type] || "NÉT VẼ";

    const isPen = a.type === "pen";
    b.innerHTML = `<div class="group col">
      <div><b style="font-size:11px">🟡 THUỘC TÍNH ${typeTitle} · PATH INSPECTOR</b></div>

      <div class="row">
        <label style="flex:1">Màu nét vẽ<input id="anStroke" type="color" value="${a.stroke || '#2563eb'}"></label>
      </div>

      <label>Độ dày nét: <b id="anStrokeWidthVal">${a.strokeWidth || 3} px</b>
        <input id="anStrokeWidth" type="range" min="1" max="40" value="${a.strokeWidth || 3}">
      </label>

      <label>Độ mờ đục: <b id="anOpacityVal">${Math.round((a.strokeOpacity !== undefined ? a.strokeOpacity : 1) * 100)}%</b>
        <input id="anOpacity" type="range" min="10" max="100" value="${Math.round((a.strokeOpacity !== undefined ? a.strokeOpacity : 1) * 100)}">
      </label>

      <label>Kiểu nét vẽ
        <select id="anStrokeStyle">
          <option value="solid" ${(a.strokeStyle||'solid')==='solid'?'selected':''}>Nét liền (Solid)</option>
          <option value="dashed" ${a.strokeStyle==='dashed'?'selected':''}>Nét đứt (Dashed)</option>
          <option value="dotted" ${a.strokeStyle==='dotted'?'selected':''}>Nét chấm bi (Dotted)</option>
        </select>
      </label>

      ${isPen ? `
      <label class="row" style="margin:4px 0">
        <input id="anClosed" type="checkbox" style="width:auto" ${a.closed ? 'checked' : ''}> Khép kín đường vẽ (Close Path)
      </label>
      ${a.closed ? `
      <div class="row">
        <label style="flex:1">Màu tô bên trong (Fill)
          <input id="anFill" type="color" value="${a.fill && a.fill !== 'transparent' && a.fill !== 'none' ? a.fill : '#ffffff'}">
        </label>
        <label class="row" style="margin-top:14px;font-size:11px">
          <input id="anNoFill" type="checkbox" style="width:auto" ${(!a.fill || a.fill === 'transparent' || a.fill === 'none') ? 'checked' : ''}> Trong suốt
        </label>
      </div>` : ''}
      <div class="small" style="margin:4px 0;line-height:1.4"><b>Mẹo nắn điểm neo (Bézier):</b> Nhấp giữ kéo điểm neo để dời đỉnh. Kéo tay đòn tròn để uốn cong nét vẽ mềm mại theo ý muốn.</div>
      ` : ''}

      <div class="row" style="margin-top:6px">
        <button class="btn ${a.flipH?'on':''}" id="flipHAnn" type="button" title="Lật đối xứng ngang (tâm ở giữa)">Flip H</button>
        <button class="btn ${a.flipV?'on':''}" id="flipVAnn" type="button" title="Lật đối xứng dọc (tâm ở giữa)">Flip V</button>
        <button class="btn" id="anRotReset" type="button" title="Góc 0°">0°</button>
        <button class="btn" id="centerCanvasAnn" type="button" title="Căn giữa Artboard">Center Artboard</button>
      </div>
      <div class="row" style="margin-top:4px">
        <label style="flex:1">Rotation (°)<input id="anRot" type="number" min="0" max="360" value="${a.rotation||0}"></label>
        <button class="btn" id="anRot90" type="button" style="margin-top:18px">+90°</button>
      </div>

      <label class="row"><input id="anLock" type="checkbox" style="width:auto" ${a.locked?"checked":""}> Khóa đối tượng (Lock)</label>
      <label class="row"><input id="anShowPlay" type="checkbox" style="width:auto" ${a.visibleInPlay?"checked":""}> Hiện khi Chơi thử (Visible in Play)</label>

      <div class="row">
        <button class="btn" id="anDup">Duplicate</button>
        <button class="btn" id="anFront">Bring to Front</button>
        <button class="btn" id="anBack">Send to Back</button>
      </div>
      <div class="row">
        <button class="btn" id="anForward">Bring Forward</button>
        <button class="btn" id="anBackward">Send Backward</button>
      </div>

      <button class="btn danger" id="anDelete" style="margin-top:8px">Xóa nét vẽ (Delete)</button>
    </div>`;

    bindAnnotationTransformControls(a);

    if($("#anStroke")) $("#anStroke").oninput = e => { a.stroke = e.target.value; save(); refreshImmediate(); };
    if($("#anStrokeWidth")) $("#anStrokeWidth").oninput = e => {
      a.strokeWidth = +e.target.value;
      if($("#anStrokeWidthVal")) $("#anStrokeWidthVal").textContent = a.strokeWidth + " px";
      save(); refreshImmediate();
    };
    if($("#anOpacity")) $("#anOpacity").oninput = e => {
      a.strokeOpacity = (+e.target.value) / 100;
      if($("#anOpacityVal")) $("#anOpacityVal").textContent = Math.round(a.strokeOpacity * 100) + "%";
      save(); refreshImmediate();
    };
    if($("#anStrokeStyle")) $("#anStrokeStyle").onchange = e => { a.strokeStyle = e.target.value; save(); refreshImmediate(); };
    if($("#anClosed")) $("#anClosed").onchange = e => { a.closed = e.target.checked; save(); refreshImmediate(); renderInspector(); };
    if($("#anFill")) $("#anFill").oninput = e => { a.fill = e.target.value; save(); refreshImmediate(); };
    if($("#anNoFill")) $("#anNoFill").onchange = e => { a.fill = e.target.checked ? "transparent" : ($("#anFill")?.value || "#ffffff"); save(); refreshImmediate(); };

    $("#anLock").onchange = e => { a.locked = e.target.checked; save(); refreshImmediate(); };
    $("#anShowPlay").onchange = e => { a.visibleInPlay = e.target.checked; save(); refreshImmediate(); };
    $("#anDup").onclick = () => duplicateAnnotation(a);
    $("#anFront").onclick = () => { moveSceneLayer("annotation", a, "front"); save(); refreshImmediate(); };
    $("#anBack").onclick = () => { moveSceneLayer("annotation", a, "back"); save(); refreshImmediate(); };
    $("#anForward").onclick = () => { moveSceneLayer("annotation", a, "forward"); save(); refreshImmediate(); };
    $("#anBackward").onclick = () => { moveSceneLayer("annotation", a, "backward"); save(); refreshImmediate(); };
    $("#anDelete").onclick = () => {
      data.annotations = data.annotations.filter(x => x !== a);
      normalizeSceneZData();
      multiSel.delete("annotation:" + a.id);
      selected = { type: "level", id: "level" };
      save(); refreshImmediate();
    };
    return;
  }

  b.innerHTML=`<div class="group col">
    <div><b style="font-size:11px">${typeName} · VECTOR SHAPE</b></div>

    ${isQslot?`<div class="small">Icon slot dấu hỏi cố định để đánh dấu chỗ trống / chỗ chờ trên scene.</div>`:(isText
      ? `<label>Nội dung ghi chú<textarea id="anText">${esc(a.text)}</textarea></label>`
      : `<label>Chữ trong hình (tùy chọn)<textarea id="anText" placeholder="Để trống nếu không cần chữ">${esc(a.text||"")}</textarea></label>`
    )}
    ${!isQslot?`<label>Cỡ chữ<input id="anFont" type="number" min="8" max="160" value="${a.fontSize}"></label>`:""}

    ${isQslot?"":(isText
      ? `<label>Màu chữ<input id="anTextColor" type="color" value="${a.stroke}"></label>`
      : `<label>Màu chữ<input id="anTextColor" type="color" value="${a.textColor}"></label>`
    )}

    ${!isText&&!isArrow&&!isQslot?`<label>Màu nền<input id="anFill" type="color" value="${a.fill}"></label>`:""}
    ${!isText&&!isQslot?`<label>${isArrow?"Màu mũi tên":"Màu viền"}<input id="anStroke" type="color" value="${a.stroke}"></label>
    ${!isText&&!isArrow?`
      <label>Độ dày viền<input id="anStrokeWidth" type="number" min="1" max="20" value="${a.strokeWidth||3}"></label>
      <label>Kiểu nét viền
        <select id="anStrokeStyle">
          <option value="solid" ${(a.strokeStyle||'solid')==='solid'?'selected':''}>Nét liền (Solid)</option>
          <option value="dashed" ${a.strokeStyle==='dashed'?'selected':''}>Nét đứt (Dashed)</option>
          <option value="dotted" ${a.strokeStyle==='dotted'?'selected':''}>Nét chấm bi (Dotted)</option>
        </select>
      </label>
      ${a.type==='rect'?`<label>Bo góc viền: <span id="anRadiusVal">${a.radius||0}px</span><input id="anRadius" type="range" min="0" max="60" value="${a.radius||0}"></label>`:''}
    `:''}`:""}
    ${isArrow?`<label>Độ dày mũi tên<input id="anStrokeWidth" type="number" min="1" max="20" value="${a.strokeWidth||4}"></label>
    <label>Kiểu nét mũi tên
      <select id="anStrokeStyle">
        <option value="solid" ${(a.strokeStyle||'solid')==='solid'?'selected':''}>Nét liền (Solid)</option>
        <option value="dashed" ${a.strokeStyle==='dashed'?'selected':''}>Nét đứt (Dashed)</option>
        <option value="dotted" ${a.strokeStyle==='dotted'?'selected':''}>Nét chấm bi (Dotted)</option>
      </select>
    </label>
    <label>Hướng mũi tên</label>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:6px;">
      <button class="btn ${a.arrowXDir===1&&a.arrowYDir===0?'active':''}" id="dirR" type="button" title="Sang phải">➡ Right</button>
      <button class="btn ${a.arrowXDir===-1&&a.arrowYDir===0?'active':''}" id="dirL" type="button" title="Sang trái">⬅ Left</button>
      <button class="btn ${a.arrowXDir===0&&a.arrowYDir===1?'active':''}" id="dirD" type="button" title="Xuống dưới">⬇ Down</button>
      <button class="btn ${a.arrowXDir===0&&a.arrowYDir===-1?'active':''}" id="dirU" type="button" title="Lên trên">⬆ Up</button>
      <button class="btn ${a.arrowXDir===1&&a.arrowYDir===1?'active':''}" id="dirDR" type="button" title="Chéo xuống-phải">↘ Down-R</button>
      <button class="btn ${a.arrowXDir===-1&&a.arrowYDir===1?'active':''}" id="dirDL" type="button" title="Chéo xuống-trái">↙ Down-L</button>
      <button class="btn ${a.arrowXDir===1&&a.arrowYDir===-1?'active':''}" id="dirUR" type="button" title="Chéo lên-phải">↗ Up-R</button>
      <button class="btn ${a.arrowXDir===-1&&a.arrowYDir===-1?'active':''}" id="dirUL" type="button" title="Chéo lên-trái">↖ Up-L</button>
    </div>
    <button class="btn" id="anFlipArrow" type="button" style="margin-bottom:8px">⇄ Flip Arrow (180°)</button>`:""}

    <div class="row"><label>Position X<input id="anX" type="number" value="${Math.round(a.x)}"></label><label>Position Y<input id="anY" type="number" value="${Math.round(a.y)}"></label></div>
    <div class="row"><label>Width<input id="anW" type="number" value="${Math.round(a.w)}"></label><label>Height<input id="anH" type="number" value="${Math.round(a.h)}"></label></div>

    <div class="row" style="margin-top:6px">
      <button class="btn ${a.flipH?'on':''}" id="flipHAnn" type="button" title="Lật đối xứng ngang (tâm ở giữa)">Flip H</button>
      <button class="btn ${a.flipV?'on':''}" id="flipVAnn" type="button" title="Lật đối xứng dọc (tâm ở giữa)">Flip V</button>
      <button class="btn" id="anRotReset" type="button" title="Góc 0°">0°</button>
      <button class="btn" id="centerCanvasAnn" type="button" title="Căn giữa Artboard">Center Artboard</button>
    </div>
    <div class="row" style="margin-top:4px">
      <label style="flex:1">Rotation (°)<input id="anRot" type="number" min="0" max="360" value="${a.rotation||0}"></label>
      <button class="btn" id="anRot90" type="button" style="margin-top:18px">+90°</button>
    </div>

    <label class="row"><input id="anLock" type="checkbox" style="width:auto" ${a.locked?"checked":""}> Khóa đối tượng (Lock)</label>
    <label class="row"><input id="anShowPlay" type="checkbox" style="width:auto" ${a.visibleInPlay?"checked":""}> Hiện khi Chơi thử (Visible in Play)</label>

    <div class="row">
      <button class="btn" id="anDup">Duplicate</button>
      <button class="btn" id="anFront">Bring to Front</button>
      <button class="btn" id="anBack">Send to Back</button>
    </div>
    <div class="row">
      <button class="btn" id="anForward">Bring Forward</button>
      <button class="btn" id="anBackward">Send Backward</button>
    </div>

    <div class="small">Hình vẽ / mũi tên có thể cho hiện trong Chơi thử. Ghi chú chữ cũng có tùy chọn hiện hoặc ẩn khi Chơi thử. Nhấp đúp vào hình để nhập chữ trực tiếp.</div>
    <button class="btn danger" id="anDelete">Xóa hình (Delete)</button>
  </div>`;

  if($("#anText")) $("#anText").oninput=e=>{
    a.text=e.target.value;save();
    const n=document.querySelector(`[data-annotation-id="${a.id}"] ${isText?".noteText":".shapeLabel"}`);
    if(n){
      n.textContent=a.text;
      if(isArrow){
        n.style.display=a.text?"block":"none";
      }
    }
  };
  if($("#anFont")) $("#anFont").oninput=e=>{a.fontSize=Math.max(8,+e.target.value||28);save();refreshImmediate()};
  if($("#anTextColor")) $("#anTextColor").oninput=e=>{
    if(isText)a.stroke=e.target.value;else a.textColor=e.target.value;
    save();refreshImmediate();
  };
  if($("#anFill"))$("#anFill").oninput=e=>{a.fill=e.target.value;save();refreshImmediate()};
  if($("#anStroke"))$("#anStroke").oninput=e=>{a.stroke=e.target.value;save();refreshImmediate()};
  if($("#anStrokeWidth"))$("#anStrokeWidth").oninput=e=>{a.strokeWidth=Math.max(1,+e.target.value||1);save();refreshImmediate()};
  if($("#anStrokeStyle"))$("#anStrokeStyle").onchange=e=>{a.strokeStyle=e.target.value;save();refreshImmediate()};
  if($("#anRadius"))$("#anRadius").oninput=e=>{a.radius=Math.max(0,+e.target.value||0);if($("#anRadiusVal"))$("#anRadiusVal").textContent=a.radius+"px";save();refreshImmediate()};
  if(isArrow){
    const setDir=(xd,yd)=>{a.arrowXDir=xd;a.arrowYDir=yd;save();refreshImmediate();renderInspector()};
    if($("#dirR"))$("#dirR").onclick=()=>setDir(1,0);
    if($("#dirL"))$("#dirL").onclick=()=>setDir(-1,0);
    if($("#dirD"))$("#dirD").onclick=()=>setDir(0,1);
    if($("#dirU"))$("#dirU").onclick=()=>setDir(0,-1);
    if($("#dirDR"))$("#dirDR").onclick=()=>setDir(1,1);
    if($("#dirDL"))$("#dirDL").onclick=()=>setDir(-1,1);
    if($("#dirUR"))$("#dirUR").onclick=()=>setDir(1,-1);
    if($("#dirUL"))$("#dirUL").onclick=()=>setDir(-1,-1);
    if($("#anFlipArrow"))$("#anFlipArrow").onclick=()=>setDir(a.arrowXDir===-1?1:(a.arrowXDir===1?-1:0), a.arrowYDir===-1?1:(a.arrowYDir===1?-1:0));
  }

  const geom=()=>{
    a.x=+$("#anX").value;a.y=+$("#anY").value;
    a.w=Math.max(20,+$("#anW").value);a.h=Math.max(20,+$("#anH").value);
    save();refreshImmediate();
  };
  ["anX","anY","anW","anH"].forEach(id=>{
    const el=$("#"+id);
    if(el){ el.onchange=geom; el.oninput=geom; }
  });

  bindAnnotationTransformControls(a);

  $("#anLock").onchange=e=>{a.locked=e.target.checked;save();refreshImmediate()};
  $("#anShowPlay").onchange=e=>{a.visibleInPlay=e.target.checked;save();refreshImmediate()};
  $("#anDup").onclick=()=>duplicateAnnotation(a);
  $("#anFront").onclick=()=>{moveSceneLayer("annotation",a,"front");save();refreshImmediate()};
  $("#anBack").onclick=()=>{moveSceneLayer("annotation",a,"back");save();refreshImmediate()};
  $("#anForward").onclick=()=>{moveSceneLayer("annotation",a,"forward");save();refreshImmediate()};
  $("#anBackward").onclick=()=>{moveSceneLayer("annotation",a,"backward");save();refreshImmediate()};
  $("#anDelete").onclick=()=>{data.annotations=data.annotations.filter(x=>x!==a);normalizeSceneZData();multiSel.delete("annotation:"+a.id);selected={type:"level",id:"level"};save();refreshImmediate()};
}

const drawState = {
  pencil: { color: "#2d3748", size: 2, opacity: 1.0 },
  brush:  { color: "#e11d48", size: 14, opacity: 0.75 },
  pen:    { color: "#2563eb", size: 3, opacity: 1.0 }
};
let penActivePoints = [];
let isDraggingPenHandle = false;
let isFreehandDrawing = false;
let currentFreehandStroke = null;
let penHoverPoint = null;

function ensureDrawingData(){
  if(!data.drawing) data.drawing = { visibleInPlay: true, strokes: [], dataUrl: "" };
  if(!Array.isArray(data.drawing.strokes)) data.drawing.strokes = [];
  if(data.drawing.visibleInPlay === undefined) data.drawing.visibleInPlay = true;
}

function generateSvgPathD(a){
  const pts = a.points;
  if(!pts || pts.length === 0) return "";
  if(a.type === "pen"){
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for(let i = 1; i < pts.length; i++){
      const prev = pts[i - 1];
      const curr = pts[i];
      const cp1 = prev.cp2 || { x: prev.x, y: prev.y };
      const cp2 = curr.cp1 || { x: curr.x, y: curr.y };
      if(cp1.x !== prev.x || cp1.y !== prev.y || cp2.x !== curr.x || cp2.y !== curr.y){
        d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${curr.x} ${curr.y}`;
      } else {
        d += ` L ${curr.x} ${curr.y}`;
      }
    }
    if(a.closed && pts.length >= 3){
      const last = pts[pts.length - 1];
      const first = pts[0];
      const cp1 = last.cp2 || { x: last.x, y: last.y };
      const cp2 = first.cp1 || { x: first.x, y: first.y };
      if(cp1.x !== last.x || cp1.y !== last.y || cp2.x !== first.x || cp2.y !== first.y){
        d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${first.x} ${first.y} Z`;
      } else {
        d += ` Z`;
      }
    }
    return d;
  } else {
    if(pts.length === 1) return `M ${pts[0].x} ${pts[0].y} L ${pts[0].x + 0.1} ${pts[0].y + 0.1}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for(let i = 1; i < pts.length - 1; i++){
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      d += ` Q ${pts[i].x} ${pts[i].y}, ${midX} ${midY}`;
    }
    d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
    return d;
  }
}

function createPathAnnotation(type, points, extra = {}){
  if(!points || points.length < 1) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  points.forEach(p => {
    minX = Math.min(minX, p.x, p.cp1?.x ?? p.x, p.cp2?.x ?? p.x);
    minY = Math.min(minY, p.y, p.cp1?.y ?? p.y, p.cp2?.y ?? p.y);
    maxX = Math.max(maxX, p.x, p.cp1?.x ?? p.x, p.cp2?.x ?? p.x);
    maxY = Math.max(maxY, p.y, p.cp1?.y ?? p.y, p.cp2?.y ?? p.y);
  });
  const w = Math.max(20, maxX - minX);
  const h = Math.max(20, maxY - minY);

  const defColor = type === "pen" ? drawState.pen.color : (type === "brush" ? drawState.brush.color : drawState.pencil.color);
  const defSize = type === "pen" ? drawState.pen.size : (type === "brush" ? drawState.brush.size : drawState.pencil.size);
  const defOpacity = type === "pen" ? drawState.pen.opacity : (type === "brush" ? drawState.brush.opacity : drawState.pencil.opacity);

  const a = {
    id: uid("AN_"),
    type,
    x: Math.round(minX),
    y: Math.round(minY),
    w: Math.round(w),
    h: Math.round(h),
    points: deep(points),
    closed: !!extra.closed,
    fill: extra.fill || "transparent",
    stroke: extra.stroke || defColor,
    strokeWidth: extra.strokeWidth || defSize,
    strokeOpacity: extra.strokeOpacity !== undefined ? extra.strokeOpacity : defOpacity,
    strokeStyle: extra.strokeStyle || "solid",
    locked: false,
    visibleInPlay: true,
    rotation: Number(extra.rotation || 0),
    flipH: !!extra.flipH,
    flipV: !!extra.flipV,
    z: 10 + sceneLayerItems().length
  };
  data.annotations.push(a);
  normalizeSceneZData();
  multiSel.clear();
  multiSel.add("annotation:" + a.id);
  selected = { type: "annotation", id: a.id };
  setTool("select");
  save();
  refreshImmediate();
  return a;
}

function startAnchorDrag(e, a, anchorIdx, handleType){
  if(a.locked || activeTool !== "select") return;
  e.stopPropagation();
  e.preventDefault();
  const startMouse = logical(e);
  const pt = a.points[anchorIdx];
  if(!pt) return;

  const initAnchor = { x: pt.x, y: pt.y };
  const initCp1 = pt.cp1 ? { x: pt.cp1.x, y: pt.cp1.y } : { x: pt.x, y: pt.y };
  const initCp2 = pt.cp2 ? { x: pt.cp2.x, y: pt.cp2.y } : { x: pt.x, y: pt.y };

  const mv = ev => {
    const cur = logical(ev);
    const dx = cur.x - startMouse.x;
    const dy = cur.y - startMouse.y;

    if(handleType === "anchor"){
      pt.x = Math.round(initAnchor.x + dx);
      pt.y = Math.round(initAnchor.y + dy);
      if(pt.cp1){
        pt.cp1.x = Math.round(initCp1.x + dx);
        pt.cp1.y = Math.round(initCp1.y + dy);
      }
      if(pt.cp2){
        pt.cp2.x = Math.round(initCp2.x + dx);
        pt.cp2.y = Math.round(initCp2.y + dy);
      }
    } else if(handleType === "cp2"){
      pt.cp2 = { x: Math.round(initCp2.x + dx), y: Math.round(initCp2.y + dy) };
      if(!ev.altKey){
        pt.cp1 = { x: Math.round(2 * pt.x - pt.cp2.x), y: Math.round(2 * pt.y - pt.cp2.y) };
      }
    } else if(handleType === "cp1"){
      pt.cp1 = { x: Math.round(initCp1.x + dx), y: Math.round(initCp1.y + dy) };
      if(!ev.altKey){
        pt.cp2 = { x: Math.round(2 * pt.x - pt.cp1.x), y: Math.round(2 * pt.y - pt.cp1.y) };
      }
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    a.points.forEach(p => {
      minX = Math.min(minX, p.x, p.cp1?.x ?? p.x, p.cp2?.x ?? p.x);
      minY = Math.min(minY, p.y, p.cp1?.y ?? p.y, p.cp2?.y ?? p.y);
      maxX = Math.max(maxX, p.x, p.cp1?.x ?? p.x, p.cp2?.x ?? p.x);
      maxY = Math.max(maxY, p.y, p.cp1?.y ?? p.y, p.cp2?.y ?? p.y);
    });
    a.x = Math.round(minX); a.y = Math.round(minY);
    a.w = Math.round(Math.max(20, maxX - minX)); a.h = Math.round(Math.max(20, maxY - minY));

    renderLive();
  };

  const up = ev => {
    window.removeEventListener("pointermove", mv);
    window.removeEventListener("pointerup", up);
    const moved = Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY);
    if(handleType === "anchor" && moved < 4 && ev.altKey){
      const hasHandles = (pt.cp1 && (pt.cp1.x !== pt.x || pt.cp1.y !== pt.y)) || (pt.cp2 && (pt.cp2.x !== pt.x || pt.cp2.y !== pt.y));
      if(hasHandles){
        pt.cp1 = { x: pt.x, y: pt.y };
        pt.cp2 = { x: pt.x, y: pt.y };
        toast("Đã chuyển thành góc nhọn (Corner)");
      } else {
        pt.cp1 = { x: pt.x - 30, y: pt.y };
        pt.cp2 = { x: pt.x + 30, y: pt.y };
        toast("Đã chuyển thành góc cong (Smooth)");
      }
    }
    save();
    refreshImmediate();
  };
  window.addEventListener("pointermove", mv);
  window.addEventListener("pointerup", up);
}

function redrawDrawingCanvas(){
  ensureDrawingData();
  const canvas = $("#drawingCanvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(activeTool === "pen" && penActivePoints.length > 0){
    ctx.save();
    const pCfg = drawState.pen;
    ctx.strokeStyle = pCfg.color;
    ctx.lineWidth = pCfg.size;
    ctx.globalAlpha = pCfg.opacity;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(penActivePoints[0].x, penActivePoints[0].y);
    for(let i = 1; i < penActivePoints.length; i++){
      const prev = penActivePoints[i - 1];
      const curr = penActivePoints[i];
      const cp1 = prev.cp2 || { x: prev.x, y: prev.y };
      const cp2 = curr.cp1 || { x: curr.x, y: curr.y };
      if(cp1.x !== prev.x || cp1.y !== prev.y || cp2.x !== curr.x || cp2.y !== curr.y){
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, curr.x, curr.y);
      } else {
        ctx.lineTo(curr.x, curr.y);
      }
    }
    ctx.stroke();

    const lastPt = penActivePoints[penActivePoints.length - 1];
    let isNearStart = false;
    let isNearLast = false;
    if(penHoverPoint){
      const firstPt = penActivePoints[0];
      const distToStart = Math.hypot(penHoverPoint.x - firstPt.x, penHoverPoint.y - firstPt.y);
      if(penActivePoints.length >= 3 && distToStart <= 16){
        isNearStart = true;
      }
      const distToLast = Math.hypot(penHoverPoint.x - lastPt.x, penHoverPoint.y - lastPt.y);
      if(distToLast <= 16){
        isNearLast = true;
      }

      if(!isNearLast){
        ctx.beginPath();
        ctx.setLineDash([8, 6]);
        const cp1 = lastPt.cp2 || { x: lastPt.x, y: lastPt.y };
        if(isNearStart){
          ctx.bezierCurveTo(cp1.x, cp1.y, firstPt.x, firstPt.y, firstPt.x, firstPt.y);
        } else {
          ctx.bezierCurveTo(cp1.x, cp1.y, penHoverPoint.x, penHoverPoint.y, penHoverPoint.x, penHoverPoint.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    penActivePoints.forEach((pt, idx) => {
      const isStart = idx === 0;
      const isLast = idx === penActivePoints.length - 1;
      const hasOutgoing = pt.cp2 && (pt.cp2.x !== pt.x || pt.cp2.y !== pt.y);

      if(pt.cp1 && (pt.cp1.x !== pt.x || pt.cp1.y !== pt.y)){
        ctx.beginPath();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = "#06b6d4";
        ctx.lineWidth = 1.5;
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.cp1.x, pt.cp1.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(pt.cp1.x, pt.cp1.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#06b6d4";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      if(pt.cp2 && (pt.cp2.x !== pt.x || pt.cp2.y !== pt.y)){
        ctx.beginPath();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = "#06b6d4";
        ctx.lineWidth = 1.5;
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.cp2.x, pt.cp2.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(pt.cp2.x, pt.cp2.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#06b6d4";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.beginPath();
      const ptRadius = (isNearStart && isStart) || (isNearLast && isLast) ? 8 : 5.5;
      ctx.arc(pt.x, pt.y, ptRadius, 0, Math.PI * 2);
      ctx.fillStyle = isStart ? "#10b981" : (isLast ? "#3b82f6" : "#ffffff");
      ctx.fill();
      ctx.strokeStyle = isNearLast && isLast ? (hasOutgoing ? "#f59e0b" : "#10b981") : "#2563eb";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if(isNearStart && isStart){
        ctx.beginPath();
        ctx.arc(pt.x + 12, pt.y - 12, 5, 0, Math.PI * 2);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if(isNearLast && isLast){
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 11, 0, Math.PI * 2);
        ctx.strokeStyle = hasOutgoing ? "#f59e0b" : "#10b981";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    ctx.restore();
  }

  canvas.classList.toggle("hidePlay", data.drawing.visibleInPlay === false);
}

function finishPenPath(){
  if(penActivePoints.length >= 2){
    const pts = [...penActivePoints];
    penActivePoints = [];
    penHoverPoint = null;
    redrawDrawingCanvas();
    createPathAnnotation("pen", pts, {
      closed: false,
      stroke: drawState.pen.color,
      strokeWidth: drawState.pen.size,
      strokeOpacity: drawState.pen.opacity
    });
    toast("Đã chốt đường vẽ bút mực");
  } else {
    penActivePoints = [];
    penHoverPoint = null;
    redrawDrawingCanvas();
  }
}

function cancelPenPath(){
  if(penActivePoints.length > 0){
    penActivePoints = [];
    penHoverPoint = null;
    redrawDrawingCanvas();
    toast("Đã hủy đường vẽ dở");
  }
}

function undoDrawingStroke(){
  if(data.annotations.length > 0){
    const pathIdx = data.annotations.map((x, i) => ["pen", "pencil", "brush"].includes(x.type) ? i : -1).filter(i => i >= 0).pop();
    if(pathIdx !== undefined){
      data.annotations.splice(pathIdx, 1);
      normalizeSceneZData();
      selected = { type: "level", id: "level" };
      save();
      refreshImmediate();
      toast("Đã hoàn tác nét vẽ gần nhất");
      return;
    }
  }
  toast("Không có nét vẽ để hoàn tác");
}

function clearDrawingStrokes(){
  const paths = data.annotations.filter(x => ["pen", "pencil", "brush"].includes(x.type));
  if(paths.length === 0 && penActivePoints.length === 0){
    toast("Hiện không có nét vẽ nào trên sàn diễn");
    return;
  }
  if(confirm("Bạn có chắc chắn muốn xóa toàn bộ nét vẽ tự do trên màn chơi?")){
    data.annotations = data.annotations.filter(x => !["pen", "pencil", "brush"].includes(x.type));
    penActivePoints = [];
    penHoverPoint = null;
    normalizeSceneZData();
    selected = { type: "level", id: "level" };
    save();
    refreshImmediate();
    toast("Đã xóa sạch toàn bộ nét vẽ");
  }
}

function drawingIns(b){
  ensureDrawingData();
  const tool = activeTool;
  const toolLabels = {
    pencil: "BÚT CHÌ · NÉT MẢNH TỰ DO",
    brush: "CỌ VẼ · NÉT DÀY MƯỢT MÀ",
    pen: "BÚT MỰC · ĐIỂM NEO VECTOR"
  };
  const title = toolLabels[tool] || "CÔNG CỤ VẼ";
  const cfg = drawState[tool] || drawState.pencil;

  let helpText = "";
  if(tool === "pencil"){
    helpText = "Kéo chuột để vẽ nét tự do. Sau khi vẽ, nét trở thành đối tượng độc lập có thể chọn và chỉnh sửa.";
  } else if(tool === "brush"){
    helpText = "Kéo chuột để vẽ nét cọ dày mượt mà. Nét vẽ có thể chọn và di chuyển tự do.";
  } else if(tool === "pen"){
    helpText = "Nhấp chuột tạo điểm nhọn, Kéo chuột tạo tay đòn cong Bézier. Rê về điểm đầu để khép kín hình hoặc bấm Enter để chốt nét hở.";
  }

  b.innerHTML = `<div class="group col">
    <div class="head"><b>${title}</b></div>
    <div class="small" style="margin-bottom:8px">${helpText}</div>

    <div class="row" style="margin-bottom:6px">
      <label style="flex:1">Màu nét vẽ<input id="drawColor" type="color" value="${cfg.color}"></label>
    </div>

    <label>Độ dày nét: <b id="drawSizeVal">${cfg.size} px</b>
      <input id="drawSize" type="range" min="1" max="40" value="${cfg.size}">
    </label>

    <label>Độ mờ đục: <b id="drawOpacityVal">${Math.round(cfg.opacity * 100)}%</b>
      <input id="drawOpacity" type="range" min="10" max="100" value="${Math.round(cfg.opacity * 100)}">
    </label>

    ${tool === "pen" ? `
    <div class="row" style="margin-top:6px">
      <button class="btn" id="penFinishBtn" type="button">Chốt nét (Enter)</button>
      <button class="btn" id="penCancelBtn" type="button">Hủy nét (Esc)</button>
    </div>` : ""}

    <div class="row" style="margin-top:8px">
      <button class="btn" id="drawUndoBtn" type="button">Hoàn tác nét gần nhất</button>
      <button class="btn danger" id="drawClearBtn" type="button">Xóa bảng vẽ</button>
    </div>

    <button class="btn" id="drawBackSelectBtn" type="button" style="margin-top:10px">Về công cụ chọn (Esc)</button>
  </div>`;

  const cInput = $("#drawColor");
  if(cInput){
    cInput.oninput = e => {
      cfg.color = e.target.value;
      if(tool === "pen" && penActivePoints.length > 0) redrawDrawingCanvas();
    };
  }

  const sInput = $("#drawSize");
  if(sInput){
    sInput.oninput = e => {
      cfg.size = +e.target.value;
      $("#drawSizeVal").textContent = cfg.size + " px";
      if(tool === "pen" && penActivePoints.length > 0) redrawDrawingCanvas();
    };
  }

  const oInput = $("#drawOpacity");
  if(oInput){
    oInput.oninput = e => {
      cfg.opacity = (+e.target.value) / 100;
      $("#drawOpacityVal").textContent = Math.round(cfg.opacity * 100) + "%";
      if(tool === "pen" && penActivePoints.length > 0) redrawDrawingCanvas();
    };
  }

  if($("#penFinishBtn")) $("#penFinishBtn").onclick = finishPenPath;
  if($("#penCancelBtn")) $("#penCancelBtn").onclick = cancelPenPath;
  if($("#drawUndoBtn")) $("#drawUndoBtn").onclick = undoDrawingStroke;
  if($("#drawClearBtn")) $("#drawClearBtn").onclick = clearDrawingStrokes;
  if($("#drawBackSelectBtn")) $("#drawBackSelectBtn").onclick = () => setTool("select");
}

function setTool(tool){
  if(activeTool === "pen" && tool !== "pen"){
    if(penActivePoints.length >= 2){
      finishPenPath();
    } else {
      penActivePoints = [];
      penHoverPoint = null;
      redrawDrawingCanvas();
    }
  }
  activeTool = tool;
  $$(".toolBtn").forEach(b => b.classList.toggle("active", b.dataset.tool === tool));
  const isDraw = ["pencil", "brush", "pen"].includes(tool);
  const dCanvas = $("#drawingCanvas");
  if(dCanvas) dCanvas.classList.toggle("activeDrawing", isDraw);

  $("#stage").style.cursor = tool === "select" ? "default" : (tool === "text" ? "text" : "crosshair");

  if(isDraw){
    multiSel.clear();
    selected = { type: "drawing", tool };
    refreshImmediate();
  } else if(selected.type === "drawing"){
    selected = { type: "level", id: "level" };
    refreshImmediate();
  }
}
$$(".toolBtn").forEach(b=>b.onclick=()=>setTool(b.dataset.tool));

function createAnnotation(type,x,y,w,h,extra={}){
  const qslot=type==="qslot";
  const defW = type==="text"?120:(qslot?70:(type==="line"?60:40));
  const defH = type==="text"?40:(qslot?70:(type==="line"?10:40));
  const finalW = (w !== undefined && w !== null) ? Math.max(type==="line"?20:10, w) : defW;
  const finalH = (h !== undefined && h !== null) ? Math.max(type==="line"?6:10, h) : defH;
  const a={
    id:uid("AN_"),type,x,y,
    w:finalW,
    h:finalH,
    fill:type==="line"?"transparent":"#f4f1f6",stroke:"#655d69",text:type==="text"?"Note":"",
    textColor:"#514953",fontSize:28,strokeWidth:4,radius:qslot?24:0,strokeStyle:"solid",
    arrowXDir:extra.arrowXDir||1,arrowYDir:extra.arrowYDir||1,
    locked:false,visibleInPlay:(type==="text"?false:true),
    rotation:Number(extra.rotation||0),flipH:!!extra.flipH,flipV:!!extra.flipV,
    z:10+sceneLayerItems().length
  };
  data.annotations.push(a);normalizeSceneZData();
  multiSel.clear();multiSel.add("annotation:"+a.id);selected={type:"annotation",id:a.id};
  save();setTool("select");refreshImmediate();return a;
}
function duplicateAnnotation(a){
  const copy={...deep(a),id:uid("AN_"),x:a.x+28,y:a.y+28,locked:false,visibleInPlay:!!a.visibleInPlay,z:10+sceneLayerItems().length};
  if(copy.points){
    copy.points.forEach(p => {
      p.x += 28; p.y += 28;
      if(p.cp1){ p.cp1.x += 28; p.cp1.y += 28; }
      if(p.cp2){ p.cp2.x += 28; p.cp2.y += 28; }
    });
  }
  data.annotations.push(copy);normalizeSceneZData();
  multiSel.clear();multiSel.add("annotation:"+copy.id);selected={type:"annotation",id:copy.id};
  save();refreshImmediate();toast("Đã duplicate nét vẽ/hình");
}
function moveAnnotation(e,a,el){
  if(activeTool!=="select"||a.locked)return;
  const key="annotation:"+a.id;
  if(e.shiftKey){e.preventDefault();e.stopPropagation();if(multiSel.has(key))multiSel.delete(key);else multiSel.add(key);selected={type:"annotation",id:a.id};refreshImmediate();return}
  if(!multiSel.has(key)){multiSel.clear();multiSel.add(key)}
  selected={type:"annotation",id:a.id};
  if(multiSel.size>1)return moveSelectionGroup(e,key);
  e.preventDefault();e.stopPropagation();
  const p=logical(e),sx=a.x,sy=a.y;
  const isPath = ["pen", "pencil", "brush"].includes(a.type);
  const origPoints = isPath && a.points ? deep(a.points) : null;

  const mv=ev=>{
    const q=logical(ev);
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    a.x=sx+dx;
    a.y=sy+dy;
    if(isPath && origPoints){
      a.points.forEach((pt, i) => {
        const orig = origPoints[i];
        if(!orig) return;
        pt.x = Math.round(orig.x + dx);
        pt.y = Math.round(orig.y + dy);
        if(orig.cp1){ pt.cp1.x = Math.round(orig.cp1.x + dx); pt.cp1.y = Math.round(orig.cp1.y + dy); }
        if(orig.cp2){ pt.cp2.x = Math.round(orig.cp2.x + dx); pt.cp2.y = Math.round(orig.cp2.y + dy); }
      });
      renderLive();
    } else {
      el.style.left=(a.x/1080*100)+"%";
      el.style.top=(a.y/1610*100)+"%";
    }
  };
  const up=()=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);save();refreshImmediate()};
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}
function resizeAnnotation(e,a,el){
  if(a.locked)return;
  e.preventDefault();e.stopPropagation();
  const p=logical(e),sw=a.w,sh=a.h,ratio=sw/sh||1;
  const mv=ev=>{
    const q=logical(ev),dw=q.x-p.x,dh=q.y-p.y;
    let nw=Math.max(20,sw+dw),nh=Math.max(20,sh+dh);
    if(ev.shiftKey){
      if(Math.abs(dw)>=Math.abs(dh*ratio)) nh=Math.max(20, Math.round(nw/ratio));
      else nw=Math.max(20, Math.round(nh*ratio));
    }
    a.w=nw;a.h=nh;
    el.style.width=(a.w/1080*100)+"%";el.style.height=(a.h/1610*100)+"%";
  };
  const up=()=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);save();refreshImmediate()};
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}

function addChar(t){
  const id=nextCode(t),n=data.characters.length;
  const c={
    id,name:"",role:"",type:t,answerSet:true,
    x:170+(n%5)*180,
    y:240+Math.floor(n/5)*155,
    namePool:"KEEP",appearance:[],gender:"UNSPECIFIED",age:"",artistNote:"",baseExpression:"😐",baseGaze:"NONE",baseTarget:"",assetBaseId:`${id}_BASE`,assetTrayId:t==="M"?`${id}_TRAY`:"",reactionEvents:[]
  };
  data.characters.push(c);
  ensureCharacterAssetIds(c);
  multiSel.clear();multiSel.add("char:"+id);
  selected={type:"char",id};
  save();refreshImmediate();
  toast(`${id} đã xuất hiện trên Scene + Tray`);
}

function clueDescendantIds(rootId){
  const out=new Set();
  const walk=id=>{
    data.clues.filter(c=>c.parent===id).forEach(c=>{
      if(out.has(c.id))return;
      out.add(c.id);walk(c.id);
    });
  };
  walk(rootId);
  return out;
}

function renumberClues(){
  if(!data.clues.length)return;

  const oldMap=new Map(data.clues.map(c=>[c.id,c]));
  const parentObj=new Map();
  data.clues.forEach(c=>parentObj.set(c,c.parent?oldMap.get(c.parent)||null:null));

  const roots=data.clues.filter(c=>!parentObj.get(c));
  const childrenOf=p=>data.clues.filter(c=>parentObj.get(c)===p);

  let rootIndex=1;
  const assign=(c,newId)=>{
    c.id=newId;
    childrenOf(c).forEach((child,i)=>assign(child,newId+"."+(i+1)));
  };

  roots.forEach(root=>{
    assign(root,"CL"+String(rootIndex++).padStart(2,"0"));
  });

  data.clues.forEach(c=>{
    const p=parentObj.get(c);
    c.parent=p?p.id:null;
  });

  if(selected.type==="clue"){
    const selectedObj=[...oldMap.values()].find(c=>c.id===selected.id) || null;
    if(selectedObj)selected.id=selectedObj.id;
  }
}

function addClue(parent=null){
  const tempId=uid("CLTMP_");
  const clue={id:tempId,parent,text:"",preOpen:parent?"LOCKED":"ACTIVE",resolveWhen:[]};
  data.clues.push(clue);
  renumberClues();
  selected={type:"clue",id:clue.id};
  save();refreshImmediate();
}
$("#addM").onclick=()=>addChar("M");$("#addF").onclick=()=>addChar("F");$("#addClue").onclick=()=>addClue();$("#levelCard").onclick=()=>{multiSel.clear();selected={type:"level",id:"level"};refreshImmediate()};

function forceEditModeNow(){
  mode="edit";
  play=null;
  document.body.classList.remove("play");
  $("#editBtn").classList.add("on");
  $("#playBtn").classList.remove("on");
  renderLive();
}

function forcePaintReference(){
  requestAnimationFrame(()=>{
    renderLive();
    void $("#stage").offsetHeight;
    requestAnimationFrame(()=>{
      renderLive();
      void $("#stage").offsetHeight;
    });
  });
  setTimeout(()=>{
    if(mode!=="edit"){mode="edit";play=null;}
    renderLive();
    renderLists();
    renderInspector();
  }, 30);
}

function addImage(f){
  if(!f)return;

  forceEditModeNow();

  const blobUrl = URL.createObjectURL(f);
  const obj = {
    id:uid("IMG_"),
    name:f.name||"Pasted image",
    src:blobUrl,
    x:140,
    y:160,
    w:800,
    h:1000,
    aspectRatio:0.8,
    z:Math.max(2,...data.images.map(i=>Number(i.z)||2))+1,
    locked:false,
    _blob:true
  };

  data.images.push(obj);
  selected={type:"image",id:obj.id};

  multiSel.clear();multiSel.add("image:"+obj.id);
  const st=$("#stage");
  st.appendChild(createImageLayer(obj));
  renderLists();renderInspector();renderLogic();
  void st.offsetHeight;
  toast("Đã thêm ảnh vào EDIT Canvas");

  const probe = new Image();
  probe.onload = ()=>{
    const nw=probe.naturalWidth||800, nh=probe.naturalHeight||1000;
    const sc=Math.min(900/nw,1350/nh,1);
    obj.aspectRatio=nw/nh;
    obj.w=Math.max(60,nw*sc);
    obj.h=Math.max(60,nh*sc);
    if(lastMouseStagePos){
      obj.x = Math.max(0, Math.min(1080 - obj.w, Math.round(lastMouseStagePos.x - obj.w / 2)));
      obj.y = Math.max(0, Math.min(1610 - obj.h, Math.round(lastMouseStagePos.y - obj.h / 2)));
    } else {
      obj.x = (1080 - obj.w) / 2;
      obj.y = (1610 - obj.h) / 2;
    }

    const layer = document.querySelector(`.imgLayer[data-img-id="${obj.id}"]`);
    if(layer){
      layer.style.left=(obj.x/1080*100)+"%";
      layer.style.top=(obj.y/1610*100)+"%";
      layer.style.width=(obj.w/1080*100)+"%";
      layer.style.height=(obj.h/1610*100)+"%";
    }
  };
  probe.src=blobUrl;

  const rd=new FileReader();
  rd.onload=()=>{
    obj.src=rd.result;
    delete obj._blob;
    save();

    const imgEl=document.querySelector(`.imgLayer[data-img-id="${obj.id}"] img`);
    if(imgEl) imgEl.src=obj.src;

    URL.revokeObjectURL(blobUrl);
  };
  rd.onerror=()=>{
    toast("Ảnh đang hiện nhưng chưa lưu được vào project");
  };
  rd.readAsDataURL(f);
}

function normalizeImageZ(){ normalizeSceneZData(); return [...data.images].sort((a,b)=>a.z-b.z); }
function moveImageLayer(i,action){ moveSceneLayer("image",i,action); }

function duplicateImage(i){
  const obj={...deep(i),id:uid("IMG_"),name:(i.name||"Reference")+" copy",x:i.x+30,y:i.y+30,z:10+sceneLayerItems().length,locked:false};
  data.images.push(obj);normalizeSceneZData();
  multiSel.clear();multiSel.add("image:"+obj.id);selected={type:"image",id:obj.id};
  save();refreshImmediate();toast("Đã duplicate ảnh");
}

$("#imgInput").onchange=e=>{
  forceEditModeNow();
  const files=[...e.target.files];
  files.forEach(addImage);
  e.target.value="";
};

document.addEventListener("paste",e=>{
  if(e.target?.closest?.("#endingOverlay") || $("#endingOverlay")?.classList.contains("show"))return;
  if(sceneClipboard?.length&&!isTypingTarget(document.activeElement))return;
  const items=[...(e.clipboardData?.items||[])];
  const imgs=items.filter(i=>i.type&&i.type.startsWith("image/"));
  if(!imgs.length)return;

  e.preventDefault();
  forceEditModeNow();

  imgs.forEach(i=>{
    const f=i.getAsFile();
    if(f)addImage(f);
  });
});

function selectedSceneKeys(){
  if(multiSel.size)return [...multiSel];
  if(["char","image","annotation"].includes(selected.type))return [selected.type+":"+selected.id];
  return [];
}
function copySceneSelection(){
  const keys=selectedSceneKeys();
  if(!keys.length){toast("Chưa chọn object để copy");return false}
  sceneClipboard=keys.map(key=>{
    const [type,id]=key.split(":");
    const obj=type==="char"?byChar(id):type==="image"?byImg(id):byAnn(id);
    return obj?{type,obj:deep(obj)}:null;
  }).filter(Boolean);
  toast(`Đã copy ${sceneClipboard.length} object`);
  return true;
}
function pasteSceneClipboard(){
  if(!sceneClipboard?.length){toast("Clipboard trong tool đang trống");return false}

  const idMap={};
  const pasted=[];

  sceneClipboard.filter(x=>x.type==="char").forEach(item=>{
    const c=deep(item.obj),old=c.id;
    c.id=nextCode(c.type);
    remapCharacterAssetPrefix(c,old,c.id);
    c.x+=35;c.y+=35;
    data.characters.push(c);
    ensureCharacterAssetIds(c);
    idMap[old]=c.id;
    pasted.push("char:"+c.id);
  });

  pasted.filter(k=>k.startsWith("char:")).forEach(key=>{
    const c=byChar(key.split(":")[1]);
    c.solveRequires=(c.solveRequires||[]).map(x=>idMap[x]||x);
    (c.reactionEvents||[]).forEach(ev=>{
      ev.id=uid("RE_");
      ev.triggerChars=(ev.triggerChars||[]).map(x=>idMap[x]||x);
      ev.affects=(ev.affects||[]).map(x=>idMap[x]||x);
      ev.steps.forEach(st=>{
        st.id=uid("ST_");
        if(st.target&&idMap[st.target])st.target=idMap[st.target];
      });
    });
  });

  sceneClipboard.filter(x=>x.type==="image").forEach(item=>{
    const i=deep(item.obj);
    i.id=uid("IMG_");i.name=(i.name||"Reference")+" copy";
    i.x+=35;i.y+=35;i.locked=false;i.z=10+sceneLayerItems().length;
    data.images.push(i);pasted.push("image:"+i.id);
  });

  sceneClipboard.filter(x=>x.type==="annotation").forEach(item=>{
    const a=deep(item.obj);
    a.id=uid("AN_");a.x+=35;a.y+=35;a.locked=false;a.z=10+sceneLayerItems().length;
    if(a.points){
      a.points.forEach(p => {
        p.x += 35; p.y += 35;
        if(p.cp1){ p.cp1.x += 35; p.cp1.y += 35; }
        if(p.cp2){ p.cp2.x += 35; p.cp2.y += 35; }
      });
    }
    data.annotations.push(a);pasted.push("annotation:"+a.id);
  });

  normalizeSceneZData();
  multiSel=new Set(pasted);

  if(pasted.length===1){
    const [type,id]=pasted[0].split(":");
    selected={type,id};
  }else selected={type:"level",id:"level"};

  save();refreshImmediate();toast(`Đã paste ${pasted.length} object`);
  return true;
}
function openSceneCtx(e,type,id){
  e.preventDefault();e.stopPropagation();
  ctxType=type;ctxId=id;

  const key=type+":"+id;
  if(!multiSel.has(key)){multiSel.clear();multiSel.add(key)}

  if(type==="image")selected={type:"image",id};
  if(type==="annotation")selected={type:"annotation",id};
  if(type==="char")selected={type:"char",id};

  refreshImmediate();

  const m=$("#ctx");
  const oneLayer=(type==="image"||type==="annotation")&&multiSel.size===1;
  m.querySelectorAll('[data-a="front"],[data-a="forward"],[data-a="backward"],[data-a="back"],[data-a="lock"]').forEach(b=>b.style.display=oneLayer?"block":"none");
  m.querySelector('[data-a="copy"]').style.display="block";
  m.querySelector('[data-a="paste"]').style.display=sceneClipboard?.length?"block":"none";
  m.querySelector('[data-a="duplicate"]').style.display="block";
  m.querySelector('[data-a="delete"]').style.display="block";

  m.style.display="block";m.style.left=e.clientX+"px";m.style.top=e.clientY+"px";
}
function openBlankCtx(e){
  e.preventDefault();e.stopPropagation();
  ctxType="blank";ctxId=null;

  const m=$("#ctx");
  m.querySelectorAll("button").forEach(b=>b.style.display="none");
  m.querySelector('[data-a="paste"]').style.display=sceneClipboard?.length?"block":"none";
  m.style.display="block";m.style.left=e.clientX+"px";m.style.top=e.clientY+"px";
}
document.addEventListener("click",()=>$("#ctx").style.display="none");
$("#ctx").onclick=e=>{
  const action=e.target.dataset.a;if(!action)return;

  if(action==="copy"){copySceneSelection();$("#ctx").style.display="none";return}
  if(action==="paste"){pasteSceneClipboard();$("#ctx").style.display="none";return}
  if(action==="duplicate"){
    if(copySceneSelection())pasteSceneClipboard();
    $("#ctx").style.display="none";return;
  }
  if(action==="delete"){
    deleteSelectedObjects();
    $("#ctx").style.display="none";return;
  }

  if(!["image","annotation"].includes(ctxType))return;
  const obj=ctxType==="image"?byImg(ctxId):byAnn(ctxId);
  if(!obj)return;

  if(["front","forward","backward","back"].includes(action))moveSceneLayer(ctxType,obj,action);
  if(action==="lock")obj.locked=!obj.locked;

  save();refreshImmediate();$("#ctx").style.display="none";
};

function startDrawTool(e){
  const type=activeTool;if(!["rect","circle","triangle","star","polygon","line","arrow","qslot","text"].includes(type))return;
  e.preventDefault();e.stopPropagation();
  const st=$("#stage"),start=logical(e);
  if(type==="qslot"){
    createAnnotation("qslot",Math.max(0,Math.round(start.x-54)),Math.max(0,Math.round(start.y-54)),108,108);
    return;
  }
  if(type==="text"){
    createAnnotation("text",start.x,start.y,260,70);
    return;
  }
  const ghost=document.createElement("div");ghost.className=`drawGhost ${type}`;st.appendChild(ghost);

  if(type==="triangle"){
    ghost.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><polygon points="50,4 96,96 4,96" fill="rgba(59, 130, 246, 0.16)" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="6 4" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polygon></svg>`;
  } else if(type==="star"){
    ghost.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><polygon points="50,2 62,38 100,38 69,60 81,96 50,74 19,96 31,60 0,38 38,38" fill="rgba(59, 130, 246, 0.16)" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="6 4" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polygon></svg>`;
  } else if(type==="polygon"){
    ghost.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><polygon points="50,3 93,26 93,74 50,97 7,74 7,26" fill="rgba(59, 130, 246, 0.16)" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="6 4" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polygon></svg>`;
  } else if(type==="line"){
    ghost.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><line x1="0" y1="50" x2="100" y2="50" stroke="#3b82f6" stroke-width="3" stroke-dasharray="6 4" stroke-linecap="round" vector-effect="non-scaling-stroke"></line></svg>`;
  } else if(type==="circle"){
    ghost.style.borderRadius="50%";
    ghost.style.border="2px dashed #3b82f6";
    ghost.style.background="rgba(59, 130, 246, 0.16)";
  } else if(type==="rect"){
    ghost.style.borderRadius="6px";
    ghost.style.border="2px dashed #3b82f6";
    ghost.style.background="rgba(59, 130, 246, 0.16)";
  }

  let last={x:start.x,y:start.y};

  function computeGeometry(ev){
    const curr=logical(ev);
    const dx=curr.x-start.x, dy=curr.y-start.y;
    let absX=Math.abs(dx), absY=Math.abs(dy);
    let x, y, w, h;

    if(ev.shiftKey){
      if(type==="line"||type==="arrow"){
        if(absY < absX * 0.45){
          w = Math.max(30, absX); h = 24;
          x = dx >= 0 ? start.x : start.x - w;
          y = start.y - 12;
        } else if(absX < absY * 0.45){
          w = 24; h = Math.max(30, absY);
          x = start.x - 12;
          y = dy >= 0 ? start.y : start.y - h;
        } else {
          const size = Math.max(absX, absY, 30);
          w = size; h = size;
          x = dx >= 0 ? start.x : start.x - size;
          y = dy >= 0 ? start.y : start.y - size;
        }
      } else {
        const size = Math.max(absX, absY);
        w = size; h = size;
        x = dx >= 0 ? start.x : start.x - size;
        y = dy >= 0 ? start.y : start.y - size;
      }
    } else {
      x = Math.min(start.x, curr.x);
      y = Math.min(start.y, curr.y);
      w = absX;
      h = absY;
    }
    return { x, y, w, h, dx, dy, absX, absY, curr };
  }

  function updateArrowGhost(geo){
    const w = Math.max(20, geo.w), h = Math.max(20, geo.h);
    let x1 = geo.dx >= 0 ? 6 : w - 6;
    let x2 = geo.dx >= 0 ? w - 6 : 6;
    let y1 = geo.dy >= 0 ? 6 : h - 6;
    let y2 = geo.dy >= 0 ? h - 6 : 6;
    if(geo.absY < 15){ y1 = h/2; y2 = h/2; }
    if(geo.absX < 15){ x1 = w/2; x2 = w/2; }

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = Math.min(Math.hypot(x2 - x1, y2 - y1) * 0.45, 20);
    const halfWidth = headLen * 0.45;
    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    const tipX = x2, tipY = y2;
    const leftX = x2 - headLen * cosA + halfWidth * sinA;
    const leftY = y2 - headLen * sinA - halfWidth * cosA;
    const rightX = x2 - headLen * cosA - halfWidth * sinA;
    const rightY = y2 - headLen * sinA + halfWidth * cosA;
    const baseX = x2 - headLen * 0.65 * cosA;
    const baseY = y2 - headLen * 0.65 * sinA;
    const polyPts = `${tipX.toFixed(1)},${tipY.toFixed(1)} ${leftX.toFixed(1)},${leftY.toFixed(1)} ${baseX.toFixed(1)},${baseY.toFixed(1)} ${rightX.toFixed(1)},${rightY.toFixed(1)}`;

    ghost.innerHTML = `<svg viewBox="0 0 ${w} ${h}" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none">
      <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${baseX.toFixed(1)}" y2="${baseY.toFixed(1)}" stroke="#3b82f6" stroke-width="3" stroke-dasharray="6 4" stroke-linecap="round"></line>
      <polygon points="${polyPts}" fill="#3b82f6"></polygon>
    </svg>`;
  }

  const mv=ev=>{
    last=logical(ev);
    const geo=computeGeometry(ev);
    ghost.style.left=(geo.x/1080*100)+"%";
    ghost.style.top=(geo.y/1610*100)+"%";
    ghost.style.width=(geo.w/1080*100)+"%";
    ghost.style.height=(geo.h/1610*100)+"%";
    if(type==="arrow")updateArrowGhost(geo);
  };

  const up=ev=>{
    window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);ghost.remove();
    const geo=computeGeometry(ev);
    const isClick = geo.w < 15 && geo.h < 15;

    let targetX, targetY, targetW, targetH, extra = {};
    if(isClick){
      const defW = type==="text"?240:(type==="arrow"||type==="line"?160:140);
      const defH = type==="text"?70:(type==="arrow"||type==="line"?40:140);
      targetW = defW;
      targetH = defH;
      targetX = Math.max(0, Math.min(1080 - defW, Math.round(start.x - defW / 2)));
      targetY = Math.max(0, Math.min(1610 - defH, Math.round(start.y - defH / 2)));
      if(type==="arrow"){ extra = {arrowXDir: 1, arrowYDir: 0}; }
    } else {
      const minW = type==="arrow" ? 40 : 20;
      const minH = type==="arrow" ? 30 : 20;
      targetW = Math.max(minW, Math.round(geo.w));
      targetH = Math.max(minH, Math.round(geo.h));
      targetX = Math.round(geo.x);
      targetY = Math.round(geo.y);
      if(type==="arrow"){
        let xdir=1, ydir=1;
        if(geo.absY<20 && geo.absX>=25){
          xdir=geo.dx>=0?1:-1; ydir=0;
        }else if(geo.absX<20 && geo.absY>=25){
          xdir=0; ydir=geo.dy>=0?1:-1;
        }else{
          xdir=geo.dx>=0?1:-1; ydir=geo.dy>=0?1:-1;
        }
        extra={arrowXDir:xdir, arrowYDir:ydir};
      }
    }
    createAnnotation(type, targetX, targetY, targetW, targetH, extra);
  };
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}

function startMarquee(e){
  if(mode!=="edit"||e.button!==0)return;
  if(e.target.closest(".char,.imgLayer,.resize,.noteObj,.noteResize"))return;
  if(typeof isSpaceDown !== "undefined" && isSpaceDown) return;
  if(typeof isPanning !== "undefined" && isPanning) return;
  if(activeTool!=="select")return startDrawTool(e);
  const st=$("#stage"),rect=st.getBoundingClientRect();
  const sx=e.clientX-rect.left,sy=e.clientY-rect.top;
  let moved=false;
  const m=document.createElement("div");
  m.className="marquee";
  m.style.left=(sx / rect.width * 100)+"%";
  m.style.top=(sy / rect.height * 100)+"%";
  m.style.width="0%";
  m.style.height="0%";
  st.appendChild(m);

  const mv=ev=>{
    moved=true;
    const x=ev.clientX-rect.left, y=ev.clientY-rect.top;
    const l=Math.min(sx,x), t=Math.min(sy,y), w=Math.abs(x-sx), h=Math.abs(y-sy);
    m.style.left=(l / rect.width * 100)+"%";
    m.style.top=(t / rect.height * 100)+"%";
    m.style.width=(w / rect.width * 100)+"%";
    m.style.height=(h / rect.height * 100)+"%";
  };
  const up=ev=>{
    window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);
    const x=ev.clientX-rect.left, y=ev.clientY-rect.top;
    const l=Math.min(sx,x), t=Math.min(sy,y), r=Math.max(sx,x), b=Math.max(sy,y);
    m.remove();
    if(!e.shiftKey)multiSel.clear();
    if(moved && Math.abs(x-sx)>4 && Math.abs(y-sy)>4){
      const logL = l / rect.width * 1080;
      const logR = r / rect.width * 1080;
      const logT = t / rect.height * 1610;
      const logB = b / rect.height * 1610;

      data.characters.forEach(c=>{
        if(c.x >= logL && c.x <= logR && c.y >= logT && c.y <= logB) multiSel.add("char:"+c.id);
      });
      data.images.forEach(i=>{
        const cx = i.x + i.w / 2, cy = i.y + i.h / 2;
        if(cx >= logL && cx <= logR && cy >= logT && cy <= logB) multiSel.add("image:"+i.id);
      });
      data.annotations.forEach(a=>{
        const cx = a.x + a.w / 2, cy = a.y + a.h / 2;
        if(cx >= logL && cx <= logR && cy >= logT && cy <= logB) multiSel.add("annotation:"+a.id);
      });
      toast(`Đã chọn ${multiSel.size} object`);
    }
    refreshImmediate();
  };
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}
$("#stage").addEventListener("pointerdown",startMarquee);
$("#stage").addEventListener("contextmenu",e=>{if(e.target===$("#stage")||e.target.classList.contains("editmark"))openBlankCtx(e)});

function cleanCharacterRefs(id){
  data.clues.forEach(q=>{
    q.resolveWhen=(q.resolveWhen||[]).filter(x=>x!==id);
    q.affects=(q.affects||[]).filter(x=>x!==id);
  });
  (data.sceneEvidence||[]).forEach(e=>{e.affects=(e.affects||[]).filter(x=>x!==id)});
  data.level.revealWhen=data.level.revealWhen.filter(x=>x!==id);

  data.characters.forEach(c=>{
    c.solveRequires=(c.solveRequires||[]).filter(x=>x!==id);
    c.baseAffects=(c.baseAffects||[]).filter(x=>x!==id);
    if(c.baseTarget===id)c.baseTarget="";
    (c.reactionEvents||[]).forEach(ev=>{
      ev.triggerChars=(ev.triggerChars||[]).filter(x=>x!==id);
      ev.affects=(ev.affects||[]).filter(x=>x!==id);
      ev.steps.forEach(st=>{if(st.target===id)st.target=""});
    });
  });
}

function deleteCharacter(id){
  const c=byChar(id);if(!c)return;
  cleanCharacterRefs(id);
  data.characters=data.characters.filter(x=>x.id!==id);
}
function deleteClue(id){
  const c=byClue(id);if(!c)return;
  data.clues=data.clues.filter(x=>x.id!==id);
  data.clues.forEach(x=>{if(x.parent===id)x.parent=null});
  renumberClues();
}
function deleteSelectedObjects(){
  if(multiSel.size){
    [...multiSel].forEach(key=>{
      const [type,id]=key.split(":");
      if(type==="char")deleteCharacter(id);
      if(type==="image")data.images=data.images.filter(x=>x.id!==id);
      if(type==="annotation")data.annotations=data.annotations.filter(x=>x.id!==id);
    });
    normalizeSceneZData();multiSel.clear();selected={type:"level",id:"level"};save();refreshImmediate();toast("Đã xóa nhóm");return true;
  }

  if(selected.type==="char"){deleteCharacter(selected.id);selected={type:"level",id:"level"};save();refreshImmediate();return true}
  if(selected.type==="image"){data.images=data.images.filter(x=>x.id!==selected.id);normalizeSceneZData();selected={type:"level",id:"level"};save();refreshImmediate();return true}
  if(selected.type==="annotation"){data.annotations=data.annotations.filter(x=>x.id!==selected.id);normalizeSceneZData();selected={type:"level",id:"level"};save();refreshImmediate();return true}
  if(selected.type==="clue"){deleteClue(selected.id);selected={type:"level",id:"level"};save();refreshImmediate();return true}
  if(selected.type==="reaction"){
    const c=byChar(selected.charId);
    if(c){
      c.reactionEvents=c.reactionEvents.filter(ev=>ev.id!==selected.eventId);
      selected={type:"char",id:c.id};save();refreshImmediate();return true;
    }
  }
  return false;
}

function isTypingTarget(t){
  return t && (t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable);
}
document.addEventListener("keydown",e=>{
  const mod=e.ctrlKey||e.metaKey;

  if(mod&&e.key.toLowerCase()==="z"&&!isTypingTarget(e.target)){
    e.preventDefault();if(e.shiftKey)redo();else undo();return;
  }
  if(mod&&e.key.toLowerCase()==="y"&&!isTypingTarget(e.target)){
    e.preventDefault();redo();return;
  }
  if(mod&&e.key.toLowerCase()==="c"&&!isTypingTarget(e.target)){
    if(copySceneSelection())e.preventDefault();
    return;
  }
  if(mod&&e.key.toLowerCase()==="v"&&!isTypingTarget(e.target)&&sceneClipboard?.length){
    e.preventDefault();pasteSceneClipboard();return;
  }
  if((e.key==="Backspace"||e.key==="Delete")&&!isTypingTarget(e.target)){
    if(deleteSelectedObjects())e.preventDefault();
  }
  if(e.key==="Enter"&&!isTypingTarget(e.target)&&activeTool==="pen"&&penActivePoints.length>=2){
    e.preventDefault();finishPenPath();return;
  }
  if(e.key==="Escape"&&mode==="edit"){
    if(activeTool==="pen"&&penActivePoints.length>0){
      cancelPenPath();return;
    }
    setTool("select");multiSel.clear();selected={type:"level",id:"level"};refreshImmediate();
  }
});

function playProgressSignature(){
  return [
    data.level?.id||"",
    sortedCharacters().map(c=>c.id).join(","),
    data.clues.map(c=>c.id).sort().join(",")
  ].join("|");
}
function savePlayProgress(){
  try{
    if(!play){
      localStorage.removeItem(PLAY_PROGRESS_KEY);
      return;
    }
    localStorage.setItem(PLAY_PROGRESS_KEY,JSON.stringify({
      signature:playProgressSignature(),
      play
    }));
  }catch(_){}
}
function loadPlayProgress(){
  try{
    const raw=JSON.parse(localStorage.getItem(PLAY_PROGRESS_KEY)||"null");
    if(!raw||raw.signature!==playProgressSignature()||!raw.play)return null;
    const p=raw.play;
    p.placed=p.placed||{};
    p.state=p.state||{};
    p.reactions=p.reactions||{};
    p.reactionTokens=p.reactionTokens||{};
    p.firedEvents=p.firedEvents||{};
    p.nameMap=p.nameMap||editNameMap();
    p.namesRandomized=!!p.namesRandomized;
    p.nameGeneration=Number(p.nameGeneration)||0;
    p.lives=Math.max(0,Math.min(2,Number(p.lives)??2));
    if(!Number.isFinite(p.lives))p.lives=2;
    p.failed=!!p.failed||p.lives<=0;
    delete p.moves;
    return p;
  }catch(_){
    return null;
  }
}
function clearPlayProgress(){
  play=null;
  try{localStorage.removeItem(PLAY_PROGRESS_KEY)}catch(_){}
}
function freshPlay(nameMap,namesRandomized=false,nameGeneration=0,lastShuffledNameMap=null,lastShuffledGeneration=0){
  playSession++;
  play={
    lives:2,
    failed:false,
    placed:{},
    state:{},
    reactions:{},
    reactionTokens:{},
    firedEvents:{},
    reveal:false,
    nameMap:{...(nameMap||editNameMap())},
    namesRandomized:!!namesRandomized,
    nameGeneration:Number(nameGeneration)||0,
    lastShuffledNameMap:lastShuffledNameMap?{...lastShuffledNameMap}:null,
    lastShuffledGeneration:Number(lastShuffledGeneration)||0
  };
  data.clues.forEach(c=>play.state[c.id]={active:!c.parent,done:false});
  evalRun(null,true);
  savePlayProgress();
}

function closeReplayMenu(){$("#replayMenu")?.removeAttribute("open")}
function replayOriginalNames(){
  const last=play?.lastShuffledNameMap||null;
  const lastGeneration=Number(play?.lastShuffledGeneration)||0;
  mode="play";
  freshPlay(editNameMap(),false,0,last,lastGeneration);
  closeReplayMenu();refreshImmediate();
  toast("Chơi lại từ đầu · tên gốc");
}
function replayLastShuffledNames(){
  const last=play?.lastShuffledNameMap;
  if(!last){toast("Chưa có bộ tên đã đảo");return}
  const gen=Number(play?.lastShuffledGeneration)||1;
  mode="play";
  freshPlay(last,true,gen,last,gen);
  closeReplayMenu();refreshImmediate();
  toast("Chơi lại từ đầu · bộ tên đã đảo gần nhất");
}
function replayShuffleNames(){
  const gen=(Number(play?.lastShuffledGeneration)||0)+1;
  const names=buildPlayNameMap(true,play?.lastShuffledNameMap||null);
  mode="play";
  freshPlay(names,true,gen,names,gen);
  closeReplayMenu();refreshImmediate();
  toast("Chơi lại từ đầu · đã đảo tên mới");
}

let savedCollapsedState = null;

function startPlay(){
  mode="play";
  playSession++;

  canvasZoom = 1.0;
  canvasPan = {x: 0, y: 0};
  if(typeof applyZoomPan === 'function'){
    applyZoomPan();
  }

  const work = $("#work");
  if(work){
    savedCollapsedState = {
      left: work.classList.contains("left-collapsed"),
      right: work.classList.contains("right-collapsed")
    };
    work.classList.remove("left-collapsed", "right-collapsed");
  }

  if(!play){
    freshPlay(editNameMap(),false,0);
  }else{
    savePlayProgress();
  }
  refreshImmediate();
}
function stopPlay(){
  playSession++;
  savePlayProgress();
  mode="edit";
  const work = $("#work");
  if(work && savedCollapsedState){
    if(savedCollapsedState.left) work.classList.add("left-collapsed");
    if(savedCollapsedState.right) work.classList.add("right-collapsed");
  }
  refreshImmediate();
}
$("#playBtn").onclick=startPlay;
$("#editBtn").onclick=stopPlay;
if($("#replayOriginalBtn")) $("#replayOriginalBtn").onclick=replayOriginalNames;
if($("#replayLastShuffledBtn")) $("#replayLastShuffledBtn").onclick=replayLastShuffledNames;
if($("#shuffleReplayBtn")) $("#shuffleReplayBtn").onclick=replayShuffleNames;

function dragPlay(e,c,t){
  if(play?.failed){toast("Hết mạng · bấm Chơi lại");return}
  e.preventDefault();$("#stage").classList.add("drag");
  const g=t.cloneNode(true);g.style.cssText="position:fixed;z-index:4000;pointer-events:none;transform:translate(-50%,-50%) scale(1.08)";document.body.appendChild(g);
  const mv=ev=>{g.style.left=ev.clientX+"px";g.style.top=ev.clientY+"px"};
  const up=ev=>{
    window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);g.remove();$("#stage").classList.remove("drag");

    const p=logical(ev),rem=data.characters.filter(x=>x.type==="M"&&!play.placed[x.id]);
    let n=null,d=1e9;
    rem.forEach(x=>{const z=Math.hypot(p.x-x.x,p.y-x.y);if(z<d){d=z;n=x}});

    if(!n||d>120){toast("Thả hụt · không mất mạng");return}

    if(n.id===c.id){
      play.placed[c.id]=true;
      toast(c.id+" đúng");
      evalRun(c.id,false);
    }else{
      play.lives=Math.max(0,(play.lives??2)-1);
      if(play.lives<=0){play.failed=true;toast(c.id+" sai · hết mạng")}
      else toast(c.id+" sai · còn "+play.lives+" mạng");
    }

    savePlayProgress();
    refreshImmediate();
  };
  mv(e);window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}

function triggerMatches(source,ev,placedId,isStart){
  if(isStart)return false;
  if(ev.triggerType==="SELF_PLACED")return source.type==="M"&&placedId===source.id;
  if(ev.triggerType==="CHAR_PLACED")return ev.triggerChars?.[0]===placedId;
  if(ev.triggerType==="ALL_PLACED")return (ev.triggerChars||[]).length>0&&(ev.triggerChars||[]).every(id=>play.placed[id]);
  return false;
}
function runReactionSequence(source,ev){
  if(!play||!ev.steps?.length)return;

  const session=playSession;
  const token=(play.reactionTokens[source.id]||0)+1;
  play.reactionTokens[source.id]=token;

  let i=0;
  const apply=()=>{
    if(!play||session!==playSession||play.reactionTokens[source.id]!==token)return;

    const st=ev.steps[i];
    play.reactions[source.id]=st;
    savePlayProgress();
    renderLive();

    const ms=Math.max(100,(Number(st.duration)||0.6)*1000);

    if(i<ev.steps.length-1){
      setTimeout(()=>{
        if(!play||session!==playSession||play.reactionTokens[source.id]!==token)return;
        i++;apply();
      },ms);
    }else if(!st.hold){
      setTimeout(()=>{
        if(!play||session!==playSession||play.reactionTokens[source.id]!==token)return;
        delete play.reactions[source.id];
        savePlayProgress();
        renderLive();
      },ms);
    }
  };

  apply();
}
function fireReactionEvents(placedId,isStart){
  sortedCharacters().forEach(c=>{
    (c.reactionEvents||[]).forEach(ev=>{
      if(play.firedEvents[ev.id])return;
      if(triggerMatches(c,ev,placedId,isStart)){
        play.firedEvents[ev.id]=true;
        runReactionSequence(c,ev);
      }
    });
  });
}
function evalRun(placedId=null,isStart=false){
  let change=true,g=0;

  while(change&&g++<30){
    change=false;
    data.clues.forEach(c=>{
      const s=play.state[c.id];
      if(!s.active||s.done)return;

      if(c.resolveWhen.length&&c.resolveWhen.every(id=>play.placed[id])){
        s.done=true;change=true;

        data.clues.filter(k=>k.parent===c.id).forEach(k=>{
          if(!play.state[k.id].active){
            play.state[k.id].active=true;
            change=true;
          }
        });
      }
    });
  }

  fireReactionEvents(placedId,isStart);

  if(!play.reveal&&data.level.revealWhen.length&&data.level.revealWhen.every(id=>play.placed[id])){
    play.reveal=true;
    if(data.level.reveal)toast("MAIN REVEAL · "+resolveTokens(data.level.reveal));
  }
  savePlayProgress();
}

function clueTokenIds(text){
  const out=[];String(text||"").replace(/\{([MF]\d+)\}/g,(_,id)=>{if(!out.includes(id))out.push(id);return _});return out;
}
function flowPlacedLabel(ids=[]){return (ids||[]).length?(ids||[]).join(" + "):"—"}
function buildFlowHtml(){
  const roots=(data.clues||[]).filter(c=>!c.parent);
  const rootHtml=roots.length?roots.map(c=>`<div class="flowCard"><span class="flowTag start">START</span><b>${esc(c.id)}</b><div class="meta">${esc(resolveTokens(c.text||"(draft)",editNameMap()))}</div>${(c.resolveWhen||[]).length?`<div class="small">Hoàn tất khi: ${esc(flowPlacedLabel(c.resolveWhen))}</div>`:""}</div>`).join(""):'<div class="flowCard"><span class="flowTag warn">⚠</span><b>Chưa có Root Clue</b><div class="meta">Player vẫn có thể dùng visual/Initial State, nhưng cần Play để chắc chắn có opening rõ.</div></div>';
  const childHtml=(data.clues||[]).filter(c=>c.parent).map(c=>`<div class="flowCard"><span class="flowTag">CLUE</span><b>${esc(c.parent)} → ${esc(c.id)}</b><div class="meta">${c.preOpen==="HIDDEN"?"Ẩn":"Khóa"} trước khi mở · Parent hoàn tất thì mở</div><div class="small">${esc(resolveTokens(c.text||"(draft)",editNameMap()))}${(c.resolveWhen||[]).length?`<br>Hoàn tất khi: ${esc(flowPlacedLabel(c.resolveWhen))}`:""}</div></div>`).join("")||'<div class="small">Không có clue con.</div>';
  const rx=[];sortedCharacters().forEach(c=>(c.reactionEvents||[]).forEach((ev,i)=>rx.push(`<div class="flowCard"><span class="flowTag">REACTION</span><b>${esc(triggerLabel(c,ev))} → ${esc(c.id)} R${i+1}</b><div class="meta">${esc(sequencePreview(ev,c.id))}</div></div>`)));
  const reveal=(String(data.level.reveal||"").trim()||(data.level.revealWhen||[]).length)?`<div class="flowCard"><span class="flowTag">REVEAL</span><b>${esc(flowPlacedLabel(data.level.revealWhen||[]))} → Main Reveal</b><div class="meta">${esc(resolveTokens(data.level.reveal||"(chưa nhập nội dung)",editNameMap()))}</div>${data.level.revealParentClueId?`<div class="small">Nằm dưới ${esc(data.level.revealParentClueId)}</div>`:""}</div>`:'<div class="small">Level này chưa dùng Main Reveal riêng.</div>';
  const movable=sortedCharacters(c=>c.type==="M").map(c=>c.id);
  return `<div class="flowSection"><h4>KHỞI ĐẦU · Thông tin có sẵn</h4><div class="flowGrid">${rootHtml}</div><div class="small" style="margin-top:7px">Initial expression / gaze và visual trên Scene cũng có sẵn từ START; FLOW không bắt GD khai metadata “giúp solve ai”.</div></div><div class="flowSection"><h4>Clue mở theo Parent</h4><div class="flowGrid">${childHtml}</div></div><div class="flowSection"><h4>Reaction Trigger</h4><div class="flowGrid">${rx.join("")||'<div class="small">Không có Reaction Event.</div>'}</div></div><div class="flowSection"><h4>Main Reveal</h4><div class="flowGrid">${reveal}</div></div><div class="flowSection"><h4>Completion</h4><div class="flowCard"><span class="flowTag start">WIN</span><b>Tất cả Movable đúng</b><div class="meta">${esc(movable.join(" + ")||"Chưa có Movable")}</div></div></div><div class="sgGraphHint"><b>FLOW chỉ thể hiện state/trigger mà Tool biết chắc.</b> Nó không kết luận player đã đủ evidence hay level khó/dễ. Dùng Play + Proof / Swap / Remove để kiểm suy luận.</div>`;
}
function renderLogic(){const el=$("#logicFlowFull");if(el)el.innerHTML=buildFlowHtml()}
function openLogicFlow(){renderLogic();$("#overlay").classList.add("show")}
$("#logicFlowBtn").onclick=openLogicFlow;
$("#difficultyTestBtn").onclick=openDifficultyTest;
$("#closeDifficultyTest").onclick=()=>$("#difficultyOverlay").classList.remove("show");
$("#analyzeDifficulty").onclick=runDifficultyTest;
$("#closeLogicFlow").onclick=()=>$("#overlay").classList.remove("show");

function wordCount(s){return String(s||"").trim().split(/\s+/).filter(Boolean).length}
function syncVerdictMeaning(){
  const e=data.level.ending;const found=VERDICT_SUGGESTIONS.find(([en])=>en===e.verdictCta);e.verdictMeaningVi=found?found[1]:(e.verdictMeaningVi||"");
}
function renderEndingTab(){
  const e=data.level.ending;
  $("#endingBrief").value=e.imageBrief||"";
  $("#endingLineInput").value=e.endingLine||"";
  $("#verdictCustom").value=e.verdictCta||"";
  $("#endingPromptPreview").textContent=endingPrompt(e.imageBrief);
  $("#endingPreviewLine").textContent=resolveTokens(e.endingLine||"Ending line...",editNameMap());
  $("#endingPreviewCta").textContent=e.verdictCta||"VERDICT";
  $("#endingPreviewImage").innerHTML=e.imageSrc?`<img src="${esc(e.imageSrc)}" alt="Ending Image GD gen AI">`:'<div class="endImagePlaceholder">ENDING IMAGE<br>4:3 HORIZONTAL<br><small>GD dán/import ảnh AI</small></div>';
  const wc=wordCount(e.endingLine),lc=$("#endingLineCounter");lc.textContent=e.endingLine?`${wc} từ · khuyên dùng 6–12 từ`:"";lc.classList.toggle("bad",!!e.endingLine&&(wc<6||wc>12));
  const vc=wordCount(e.verdictCta),vEl=$("#verdictCounter");vEl.textContent=e.verdictCta?`${vc} từ · tối đa 3 từ`:"";vEl.classList.toggle("bad",vc>3);
  $("#verdictSuggestions").innerHTML=VERDICT_SUGGESTIONS.map(([en,vi])=>`<button type="button" class="verdictOpt ${e.verdictCta===en?"sel":""}" data-verdict="${esc(en)}"><b>${esc(en)}</b><span>${esc(vi)}</span></button>`).join("");
  $$("[data-verdict]").forEach(btn=>btn.onclick=()=>{const found=VERDICT_SUGGESTIONS.find(([en])=>en===btn.dataset.verdict);e.verdictCta=found[0];e.verdictMeaningVi=found[1];save();renderEndingTab();renderLogic()});
}
function openEnding(){renderEndingTab();$("#endingOverlay").classList.add("show")}
$("#endingBtn").onclick=openEnding;
$("#closeEnding").onclick=()=>$("#endingOverlay").classList.remove("show");
$("#endingBrief").oninput=e=>{data.level.ending.imageBrief=e.target.value;save();$("#endingPromptPreview").textContent=endingPrompt(e.target.value)};
$("#endingLineInput").oninput=e=>{
  data.level.ending.endingLine=e.target.value;save();
  $("#endingPreviewLine").textContent=resolveTokens(e.target.value||"Ending line...",editNameMap());
  const wc=wordCount(e.target.value),el=$("#endingLineCounter");el.textContent=e.target.value?`${wc} từ · khuyên dùng 6–12 từ`:"";el.classList.toggle("bad",!!e.target.value&&(wc<6||wc>12));
  renderLogic();
};
$("#verdictCustom").oninput=e=>{
  const v=e.target.value.toUpperCase().replace(/\s+/g," ").trimStart();e.target.value=v;data.level.ending.verdictCta=v;syncVerdictMeaning();save();
  $("#endingPreviewCta").textContent=v||"VERDICT";
  const wc=wordCount(v),el=$("#verdictCounter");el.textContent=v?`${wc} từ · tối đa 3 từ`:"";el.classList.toggle("bad",wc>3);
  $$("[data-verdict]").forEach(btn=>btn.classList.toggle("sel",btn.dataset.verdict===v));
  renderLogic();
};
$("#copyEndingPrompt").onclick=async()=>{const txt=endingPrompt(data.level.ending.imageBrief);try{await navigator.clipboard.writeText(txt);toast("Đã copy AI Prompt")}catch(_){const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();toast("Đã copy AI Prompt")}};
function setEndingImageFile(file){
  if(!file||!file.type.startsWith("image/")){if(file)toast("Vui lòng chọn file ảnh");return}
  const reader=new FileReader();
  reader.onload=()=>{
    // Data URL nằm trong Editor Project JSON; ảnh lớn có thể vượt giới hạn localStorage.
    data.level.ending.imageSrc=String(reader.result||"");
    const persisted=save();
    renderEndingTab();
    toast(persisted===false?"Đã gắn ảnh · hãy bấm LƯU PROJECT để giữ ảnh":"Đã gắn Ending Image · nhớ LƯU PROJECT");
  };
  reader.onerror=()=>toast("Không đọc được Ending Image");
  reader.readAsDataURL(file);
}
$("#endingImageFile").onchange=e=>{
  setEndingImageFile(e.target.files?.[0]);
  e.target.value="";
};
$("#endingImagePaste").addEventListener("paste",e=>{
  const item=[...(e.clipboardData?.items||[])].find(x=>x.type?.startsWith("image/"));
  if(!item)return;
  e.preventDefault();e.stopPropagation();
  setEndingImageFile(item.getAsFile());
});
$("#clearEndingImage").onclick=()=>{data.level.ending.imageSrc="";save();renderEndingTab();toast("Đã xóa Ending Image")};
async function exportEndingPng(){
  const e=data.level.ending;
  if(!e.imageSrc){toast("Chưa có Ending Image");return}
  try{
    const response=await fetch(e.imageSrc);const blob=await response.blob();
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;
    // File theo đúng định dạng ảnh nguồn (PNG/JPG/WEBP) thay vì đổi extension sai.
    const ext=blob.type==="image/jpeg"?"jpg":blob.type==="image/webp"?"webp":"png";
    a.download=`${e.imageAssetId||"ENDING01"}.${ext}`;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Đã xuất Ending Image");
  }catch(err){console.error(err);toast("Không xuất được Ending Image")}
}
$("#exportEndingPng").onclick=exportEndingPng;

function safeBaseName(s){return String(s||"level").trim().replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"level"}
function csvCell(v){const s=String(v??"");return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
function runtimeBaseAssetId(c){
  return c.assetBaseId||`${c.id}_BASE`;
}
function runtimeWhenPlaced(c,ev){
  if(ev.triggerType==="SELF_PLACED")return [c.id];
  if(ev.triggerType==="CHAR_PLACED"||ev.triggerType==="ALL_PLACED")return [...new Set(ev.triggerChars||[])];
  return [];
}
function resolvedAssetRows(){
  const rows=[];
  const art=data.level.art||blankLevelArt();
  const refs=[...(data.images||[])].map(i=>i.name).filter(Boolean).join(" | ");
  const baked=(art.sceneItems||[]).filter(x=>x.exportMode==="BAKED_BG").map(x=>[x.name,x.description,x.artistNote].filter(Boolean).join(": ")).filter(Boolean).join(" | ");
  rows.push({assetId:art.backgroundAssetId||"BG01",file:`Background/${art.backgroundAssetId||"BG01"}.png`,group:"BACKGROUND",character:"",gender:"",age:"",state:"MAIN",expressionEmoji:"",expressionName:"",symbol:"",target:"",gaze:"",description:[art.backgroundDescription,baked].filter(Boolean).join(" | "),artistNote:art.artistNote,tone:art.tone,exportMode:"BACKGROUND",reference:[art.referenceNote,refs].filter(Boolean).join(" | ")});
  (art.sceneItems||[]).filter(x=>x.exportMode!=="BAKED_BG").forEach(x=>rows.push({assetId:x.assetId,file:`Background/${x.assetId}.png`,group:x.exportMode==="FOREGROUND"?"FOREGROUND":"OBJECT",character:"",gender:"",age:"",state:x.name||"",expressionEmoji:"",expressionName:"",symbol:"",target:"",gaze:"",description:x.description,artistNote:x.artistNote,tone:art.tone,exportMode:x.exportMode,reference:art.referenceNote||refs}));
  sortedCharacters().forEach(c=>{
    ensureCharacterAssetIds(c);
    const appearance=(c.appearance||[]).join(" | ");
    const initial=initialStateRecord(c);
    const initialGaze=resolvedGazeClock(c.id,initial)?`${resolvedGazeClock(c.id,initial)} giờ`:"";
    if(c.type==="M")rows.push({assetId:c.assetTrayId,file:`Characters/${c.id}/${c.assetTrayId}.png`,group:"CHARACTER",character:c.id,gender:c.gender,age:c.age,state:"TRAY",expressionEmoji:c.baseExpression,expressionName:emotionName(c.baseExpression),symbol:"",target:c.baseTarget||"",gaze:initialGaze,description:appearance,artistNote:c.artistNote,tone:"",exportMode:"FULL SPRITE",reference:""});

    const baseId=runtimeBaseAssetId(c);
    rows.push({assetId:baseId,file:`Characters/${c.id}/${baseId}.png`,group:"CHARACTER",character:c.id,gender:c.gender,age:c.age,state:"BASE",expressionEmoji:c.baseExpression,expressionName:emotionName(c.baseExpression),symbol:"",target:c.baseTarget||"",gaze:initialGaze,description:appearance,artistNote:c.artistNote,tone:"",exportMode:"FULL SPRITE",reference:""});

    (c.reactionEvents||[]).forEach(ev=>(ev.steps||[]).forEach(st=>rows.push({assetId:st.assetId,file:`Characters/${c.id}/${st.assetId}.png`,group:"CHARACTER",character:c.id,gender:c.gender,age:c.age,state:"REACTION",expressionEmoji:st.emotion||"",expressionName:emotionName(st.emotion),symbol:st.symbol||"",target:st.target||"",gaze:resolvedGazeClock(c.id,st)?`${resolvedGazeClock(c.id,st)} giờ`:"",description:appearance,artistNote:c.artistNote,tone:"",exportMode:"FULL SPRITE",reference:""})));
  });
  const ending=data.level.ending||blankEnding();
  rows.push({assetId:ending.imageAssetId||"ENDING01",file:`Ending/${ending.imageAssetId||"ENDING01"}.png`,group:"ENDING",character:"",gender:"",age:"",state:"ENDING",expressionEmoji:"",expressionName:"",symbol:"",target:"",gaze:"",description:ending.imageBrief||"",artistNote:"",tone:"",exportMode:"GD AI · ENDING 4:3",reference:"GD tạo ảnh AI, lưu qua tab ENDING rồi xuất ảnh riêng"});
  return rows;
}
function validateAssetData(){
  const rows=resolvedAssetRows();
  const missing=rows.filter(r=>!r.assetId).length;
  const counts=new Map();
  rows.forEach(r=>{const key=r.assetId;if(key)counts.set(key,(counts.get(key)||0)+1)});
  const dups=[...counts.entries()].filter(([,n])=>n>1).map(([id])=>id);
  return {missing,dups};
}
function buildRuntimeData(){
  const roundPos=v=>Math.round((Number(v)||0)*1000)/1000;
  const levelNumber=(()=>{const m=String(data.level.id||"").match(/(\d+)/);return m?Number(m[1]):null})();

  const chars=sortedCharacters().map(c=>{
    ensureCharacterAssetIds(c);
    const baseAssetId=runtimeBaseAssetId(c);
    const initialAssetId=runtimeInitialAssetId(c);
    const events=(c.reactionEvents||[]).map(ev=>{
      const whenPlaced=runtimeWhenPlaced(c,ev);
      const sourceSteps=(ev.steps||[]);
      const steps=sourceSteps.map(st=>({assetId:st.assetId,duration:Number(st.duration)||0.6}));
      const last=sourceSteps[sourceSteps.length-1];
      if(last && !last.hold && steps[steps.length-1]?.assetId!==baseAssetId)steps.push({assetId:baseAssetId});
      return {whenPlaced,steps,endAssetId:reactionSettledStep(ev)?.assetId||initialAssetId};
    });
    return {
      id:c.id,
      type:c.type==="M"?"MOVABLE":"FIXED",
      namePool:c.namePool||"KEEP",
      ...((c.namePool||"KEEP")==="KEEP"?{fixedName:c.name||c.id}:{}),
      ...(c.type==="M"?{correctPosition:{x:roundPos(c.x),y:roundPos(c.y)}}:{position:{x:roundPos(c.x),y:roundPos(c.y)}}),
      assets:{
        initial:initialAssetId,
        base:baseAssetId,
        ...(c.type==="M"?{tray:c.assetTrayId}:{})
      },
      ...(events.length?{reactionEvents:events}:{})
    };
  });

  const art=data.level.art||blankLevelArt();
  const staticAssets=(art.sceneItems||[])
    .filter(x=>x.exportMode!=="BAKED_BG")
    .map(x=>({assetId:x.assetId,type:x.exportMode==="FOREGROUND"?"FOREGROUND":"OBJECT"}));

  const clues=(data.clues||[]).map(cl=>({
    id:cl.id,
    parentId:cl.parent||null,
    text:cl.text||"",
    startState:cl.parent?(cl.preOpen==="HIDDEN"?"HIDDEN":"LOCKED"):"ACTIVE",
    completeWhenPlaced:deep(cl.resolveWhen||[])
  }));

  const level={
    id:data.level.id||"",
    number:levelNumber,
    version:data.level.version||"1.0",
    dramaHook:data.level.hook||""
  };

  return {
    schemaVersion:"drama-level-runtime-2.3",
    level,
    scene:{
      backgroundAssetId:art.backgroundAssetId||"BG01",
      coordinateSpace:{width:1080,height:1610,anchor:"CENTER_CENTER"},
      ...(staticAssets.length?{staticAssets}:{})
    },
    characters:chars,
    clues,
    dramaReveal:{
      text:data.level.reveal||"",
      parentClueId:data.level.revealParentClueId||null,
      revealWhenPlaced:deep(data.level.revealWhen||[])
    },
    ending:{
      imageAssetId:data.level.ending?.imageAssetId||"ENDING01",
      endingText:data.level.ending?.endingLine||"",
      cta:data.level.ending?.verdictCta||""
    }
  };
}
function runPreflightCheck(includeProduction=false){
  save();
  const errors=[],warnings=[],charIds=new Set(sortedCharacters().map(c=>c.id));
  const movableIds=new Set(sortedCharacters().filter(c=>c.type==="M").map(c=>c.id));
  const clueIds=new Set((data.clues||[]).map(c=>c.id));
  const clueIdList=(data.clues||[]).map(c=>c.id);
  const addErr=(code,text)=>errors.push({code,text}),addWarn=(code,text)=>warnings.push({code,text});
  const dupClues=[...new Set(clueIdList.filter((id,i)=>clueIdList.indexOf(id)!==i))];
  if(dupClues.length)addErr("CLUE_DUP",`Trùng Clue ID: ${dupClues.join(", ")}.`);

  if(!String(data.level.id||"").trim())addErr("LEVEL_ID","Thiếu Level ID (VD: L001).");
  else if(!/^L\d+$/i.test(String(data.level.id||"")))addErr("LEVEL_ID_FORMAT","Level ID phải theo dạng L001 để Dev JSON có số level rõ ràng.");
  if(includeProduction&&!String(data.level.version||"").trim())addErr("VERSION","Thiếu Version.");
  if(!["EASY","MEDIUM","HARD"].includes(data.level.difficultyTarget))addErr("DIFFICULTY_TARGET","Chưa chọn Độ khó GD dự định.");
  if(!String(data.level.hook||"").trim())addErr("HOOK","Thiếu Drama Hook.");
  if(String(data.level.reveal||"").trim()&&!(data.level.revealWhen||[]).length)addErr("DRAMA_REVEAL_TRIGGER","Có Main Reveal nhưng chưa chọn điều kiện revealWhenPlaced.");
  if((data.level.revealWhen||[]).length&&!String(data.level.reveal||"").trim())addErr("DRAMA_REVEAL_TEXT","Đã có trigger Main Reveal nhưng chưa nhập nội dung Reveal.");
  if(data.level.revealParentClueId&&!clueIds.has(data.level.revealParentClueId))addErr("DRAMA_REVEAL_PARENT",`Main Drama Reveal đang trỏ tới Clue không tồn tại: ${data.level.revealParentClueId}.`);
  if(!sortedCharacters().some(c=>c.type==="M"))addErr("MOVABLE","Level chưa có Movable nào.");
  const nMovable=movableCount();
  if(data.level.difficultyTested){
    const difficultyNow=difficultyDiagnostic();
    if(difficultyNow&&difficultyNow.self!==difficultyNow.target)addWarn("DIFFICULTY_SELF_MISMATCH",`Mục tiêu ban đầu ${DIFFICULTY_LABEL[difficultyNow.target]} nhưng sau Full Play GD cảm thấy ${DIFFICULTY_LABEL[difficultyNow.self]}. Nên review lại level hoặc target.`);
  }else if(nMovable){
    addWarn("DIFFICULTY_NOT_TESTED","Chưa TEST ĐỘ KHÓ sau Full Play.");
  }

  const seenIds=new Set();
  sortedCharacters().forEach(c=>{
    if(seenIds.has(c.id))addErr("CHAR_DUP",`Trùng Character ID: ${c.id}.`);seenIds.add(c.id);
    if(!/^[MF]\d+$/.test(c.id))addErr("CHAR_ID",`${c.id}: Character ID phải theo dạng M01 / F01.`);
    else if(c.type==="M"&&!/^M\d+$/.test(c.id))addErr("CHAR_ID_TYPE",`${c.id}: Movable bắt buộc phải dùng mã Mxx.`);
    else if(c.type==="F"&&!/^F\d+$/.test(c.id))addErr("CHAR_ID_TYPE",`${c.id}: Fixed bắt buộc phải dùng mã Fxx.`);
    if(!Number.isFinite(Number(c.x))||!Number.isFinite(Number(c.y)))addErr("CHAR_POS",`${c.id} chưa có vị trí hợp lệ trên scene.`);
    if(c.baseTarget&&!charIds.has(c.baseTarget))addErr("INITIAL_TARGET",`${c.id}: Initial State target ${c.baseTarget} không tồn tại.`);
    if(c.baseGaze==="AUTO"&&!c.baseTarget)addErr("INITIAL_GAZE_AUTO",`${c.id}: Initial State dùng AUTO nhưng chưa chọn Target nhìn.`);
    (c.reactionEvents||[]).forEach((ev,ei)=>{
      if(ev.triggerType==="CHAR_PLACED"){
        if((ev.triggerChars||[]).length!==1)addErr("REACTION_TRIGGER_COUNT",`${c.id} Reaction ${ei+1}: CHAR_PLACED phải có đúng 1 Movable trigger.`);
        else if(!movableIds.has(ev.triggerChars[0]))addErr("REACTION_TRIGGER_MOVABLE",`${c.id} Reaction ${ei+1}: trigger phải là Movable.`);
      }
      if(ev.triggerType==="ALL_PLACED"){
        if((ev.triggerChars||[]).length<2)addErr("REACTION_TRIGGER_COUNT",`${c.id} Reaction ${ei+1}: ALL_PLACED phải có ít nhất 2 Movable.`);
        (ev.triggerChars||[]).forEach(id=>{if(!movableIds.has(id))addErr("REACTION_TRIGGER_MOVABLE",`${c.id} Reaction ${ei+1}: ${id} không phải Movable hợp lệ.`)});
      }
      (ev.triggerChars||[]).forEach(id=>{if(!charIds.has(id))addErr("REACTION_TRIGGER",`${c.id} Reaction ${ei+1}: trigger trỏ tới ID không tồn tại: ${id}.`)});
      (ev.steps||[]).forEach((st,si)=>{
        if(st.target&&!charIds.has(st.target))addErr("REACTION_TARGET",`${c.id} Reaction ${ei+1} step ${si+1}: target ${st.target} không tồn tại.`);
        if(includeProduction&&!String(st.assetId||"").trim())addErr("REACTION_ASSET",`${c.id} Reaction ${ei+1} step ${si+1}: thiếu Asset ID.`);
      });
    });
  });

  (data.clues||[]).forEach(cl=>{
    if(cl.parent&&!clueIds.has(cl.parent))addErr("CLUE_PARENT",`${cl.id}: parent ${cl.parent} không tồn tại.`);
    (cl.resolveWhen||[]).forEach(id=>{
      if(!charIds.has(id))addErr("CLUE_RESOLVE",`${cl.id}: Resolve When trỏ tới ID không tồn tại: ${id}.`);
      else if(!movableIds.has(id))addErr("CLUE_RESOLVE_FIXED",`${cl.id}: Resolve When dùng ${id} là Fixed, nên event placement này sẽ không xảy ra.`);
    });
    clueTokenIds(cl.text||"").forEach(id=>{if(!charIds.has(id))addErr("CLUE_TOKEN",`${cl.id}: token {${id}} không tồn tại.`)});
  });

  (data.level.revealWhen||[]).forEach(id=>{
    if(!charIds.has(id))addErr("REVEAL_TRIGGER",`Main Reveal trỏ tới ID không tồn tại: ${id}.`);
    else if(!movableIds.has(id))addErr("REVEAL_FIXED",`Main Reveal dùng ${id} là Fixed; điều kiện placement này sẽ không xảy ra.`);
  });
  [data.level.hook,data.level.reveal].forEach(txt=>clueTokenIds(txt||"").forEach(id=>{if(!charIds.has(id))addErr("TOKEN_REF",`Token {${id}} đang được dùng nhưng Character ID không tồn tại.`)}));

  const randomNamed=sortedCharacters().filter(c=>(c.namePool||"KEEP")!=="KEEP"&&String(c.name||"").trim());
  const textFields=[
    ["Drama Hook",data.level.hook||""],["Drama Reveal",data.level.reveal||""],["Ending Text",data.level.ending?.endingLine||""],
    ...(data.clues||[]).map(cl=>[`Clue ${cl.id}`,cl.text||""])
  ];
  randomNamed.forEach(c=>{
    const re=new RegExp(`(^|[^A-Za-zÀ-ỹ0-9_])${String(c.name).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=$|[^A-Za-zÀ-ỹ0-9_])`,"i");
    textFields.forEach(([label,text])=>{if(re.test(String(text)))addErr("HARDCODED_RANDOM_NAME",`${label}: đang viết tên “${c.name}” trực tiếp. Hãy dùng {${c.id}} để random tên không bị sai.`)});
  });

  if(includeProduction){
    const av=validateAssetData();
    if(av.missing)addErr("ASSET_MISSING",`Có ${av.missing} asset thiếu Asset ID.`);
    if(av.dups.length)addErr("ASSET_DUP",`Asset ID bị trùng: ${av.dups.join(", ")}.`);

    const requestAssetIds=new Set(resolvedAssetRows().map(r=>r.assetId).filter(Boolean));
    const rt=buildRuntimeData();
    const runtimeAssetIds=new Set([rt.scene?.backgroundAssetId,rt.ending?.imageAssetId]);
    (rt.scene?.staticAssets||[]).forEach(x=>runtimeAssetIds.add(x.assetId));
    (rt.characters||[]).forEach(c=>{Object.values(c.assets||{}).forEach(id=>runtimeAssetIds.add(id));(c.reactionEvents||[]).forEach(ev=>(ev.steps||[]).forEach(st=>runtimeAssetIds.add(st.assetId)))});
    const missingFromArt=[...runtimeAssetIds].filter(id=>id&&!requestAssetIds.has(id));
    const unusedByRuntime=[...requestAssetIds].filter(id=>id&&!runtimeAssetIds.has(id));
    if(missingFromArt.length)addErr("ASSET_CONTRACT_DEV_TO_ART",`Dev JSON gọi asset chưa có trong Asset Request: ${missingFromArt.join(", ")}.`);
    if(unusedByRuntime.length)addErr("ASSET_CONTRACT_ART_TO_DEV",`Asset Request có asset mà Dev JSON không dùng: ${unusedByRuntime.join(", ")}.`);
    const endErrors=validateEndingData();endErrors.forEach(x=>addErr("ENDING",`Ending: ${x}.`));
    if(!String(data.level.ending?.imageSrc||"").trim())addWarn("ENDING_IMAGE","Chưa gắn Ending Image. Dev JSON vẫn reference Ending Asset ID, cần file ảnh thật khi handoff.");
    if(!String(data.level.art?.backgroundDescription||"").trim())addWarn("BG_DESC","Mô tả background đang trống.");
  }

  return {errors,warnings,production:includeProduction};
}
function checkItemHtml(item,kind){return `<div class="checkItem ${kind}"><b>${esc(item.code)}</b> · ${esc(item.text)}</div>`}
function renderPreflightCheck(result){
  const e=result.errors||[],w=result.warnings||[],production=!!result.production;
  const status=e.length?"CÒN LỖI":w.length?"ĐẠT · CÓ CẢNH BÁO":"ĐẠT TIÊU CHUẨN";
  const statusClass=e.length?"err":w.length?"warn":"ok";
  $("#checkLevelBody").innerHTML=`<div class="checkSummary"><span class="checkChip ${statusClass}">${production?"KIỂM TRA XUẤT BẢN":"KIỂM TRA THIẾT KẾ"} · ${status}</span><span class="checkChip err">${e.length} lỗi</span><span class="checkChip warn">${w.length} cảnh báo</span></div>
  <div class="checkSection"><h4>Lỗi Tool biết chắc</h4>${e.length?e.map(x=>checkItemHtml(x,"err")).join(""):'<div class="checkEmpty">✓ Không có lỗi blocking.</div>'}</div>
  <div class="checkSection"><h4>Cảnh báo để GD cân nhắc</h4>${w.length?w.map(x=>checkItemHtml(x,"warn")).join(""):'<div class="checkEmpty">✓ Không có warning.</div>'}</div>
  <div class="checkFoot">KIỂM TRA chỉ bắt lỗi dữ liệu/liên kết mà Tool biết chắc. <b>ĐẠT không có nghĩa màn chơi đã cuốn hút, đủ evidence hay đúng độ khó.</b>${production?" Kiểm tra xuất bản sẽ rà soát thêm Asset / Đoạn kết / bàn giao kỹ thuật.":""}</div>`;
}
function openPreflightCheck(){const r=runPreflightCheck(false);renderPreflightCheck(r);$("#checkOverlay").classList.add("show");return r}
function validateEndingData(){
  const e=data.level.ending||blankEnding(),errors=[];
  if(!String(e.endingLine||"").trim())errors.push("thiếu Ending Line");
  if(!String(e.verdictCta||"").trim())errors.push("thiếu Verdict CTA");
  if(wordCount(e.verdictCta)>3)errors.push("Verdict CTA phải tối đa 3 từ");
  return errors;
}
function downloadText(text,filename,type="text/plain;charset=utf-8"){
  const b=new Blob([text],{type}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function xmlEsc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[m]))}
function xlsxCol(n){let s="";for(;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s}
function xlsxCell(v,row,col,style=0){
  const ref=xlsxCol(col)+row;
  if(typeof v==="number"&&Number.isFinite(v))return `<c r="${ref}"${style?` s="${style}"`:""}><v>${v}</v></c>`;
  return `<c r="${ref}" t="inlineStr"${style?` s="${style}"`:""}><is><t xml:space="preserve">${xmlEsc(v)}</t></is></c>`;
}
function makeXlsxSheet(rows,widths=[],merges=[]){
  const cols=widths.length?`<cols>${widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join("")}</cols>`:"";
  const sheetRows=rows.map((row,ri)=>`<row r="${ri+1}"${ri===0?' ht="24" customHeight="1"':''}>${row.map((v,ci)=>xlsxCell(v,ri+1,ci+1,ri===0?1:0)).join("")}</row>`).join("");
  const mergeXml=merges.length?`<mergeCells count="${merges.length}">${merges.map(m=>`<mergeCell ref="${m}"/>`).join("")}</mergeCells>`:"";
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"/></sheetViews>${cols}<sheetData>${sheetRows}</sheetData>${mergeXml}</worksheet>`;
}
function crc32(bytes){
  if(!crc32.table){const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}crc32.table=t}
  let c=0xFFFFFFFF;for(const b of bytes)c=crc32.table[(c^b)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;
}
function u16(n){return new Uint8Array([n&255,(n>>>8)&255])}
function u32(n){return new Uint8Array([n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255])}
function concatBytes(parts){let len=parts.reduce((a,b)=>a+b.length,0),out=new Uint8Array(len),o=0;parts.forEach(b=>{out.set(b,o);o+=b.length});return out}
function zipStore(files){
  const enc=new TextEncoder(),locals=[],centrals=[];let offset=0;
  Object.entries(files).forEach(([name,content])=>{
    const n=enc.encode(name),d=typeof content==="string"?enc.encode(content):content,crc=crc32(d);
    const local=concatBytes([u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(d.length),u32(d.length),u16(n.length),u16(0),n,d]);
    locals.push(local);
    const central=concatBytes([u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(d.length),u32(d.length),u16(n.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),n]);
    centrals.push(central);offset+=local.length;
  });
  const centralSize=centrals.reduce((a,b)=>a+b.length,0),count=centrals.length;
  return concatBytes([...locals,...centrals,u32(0x06054b50),u16(0),u16(0),u16(count),u16(count),u32(centralSize),u32(offset),u16(0)]);
}
function exportAssetRequest(){
  save();
  const v=validateAssetData();
  if(v.missing||v.dups.length){toast(`Asset ID lỗi: ${v.missing?"thiếu "+v.missing:""}${v.dups.length?" · trùng "+v.dups.join(", "):""}`);return}
  const headers=["Asset ID","File","Group","Character","Gender","Age","State","Emoji","Tên biểu cảm","Symbol","Target","Gaze Clock","Description / Appearance","Artist Note","Tone màu","Export Mode","Reference"];
  const assetRows=[headers,...resolvedAssetRows().map(r=>[r.assetId,r.file,r.group,r.character,r.gender,r.age,r.state,r.expressionEmoji,r.expressionName,r.symbol,r.target,r.gaze,r.description,r.artistNote,r.tone,r.exportMode,r.reference])];
  const base=safeBaseName(data.level.id||"DRAMA_LEVEL"),sceneFile=`${base}_SCENE_LAYOUT.png`;
  const endingFile=`${data.level.ending?.imageAssetId||"ENDING01"}.png`;
  const sceneRows=[
    ["SCENE — START + SOLVED"],
    ["GD xuất Scene PNG (ZIP) ở Tool và DÁN 2 ẢNH vào tab này trước khi gửi Asset Request cho Art."],
    [""],
    ["Level ID",data.level.id||""],
    ["Version",data.level.version||"1.0"],
    ["Folder asset",data.level.id||""],
    ["Kích thước", "1080 × 1610 / ảnh"],
    ["START", "Chỉ Fixed + background/ảnh/shape được bật Hiện trong Play, gồm cả slot ? nếu có."],
    ["SOLVED", "Tất cả Fixed + Movable đúng chỗ; chỉ thể hiện bố cục, reaction cuối có thể phụ thuộc thứ tự chơi."],
    [""], [""], [""], [""], [""],
    ["", "DÁN ẢNH SCENE START VÀO DƯỚI NÀY", "DÁN ẢNH SCENE SOLVED VÀO DƯỚI NÀY"],
    [""],
    ...Array.from({length:33},()=>["", "", ""])
  ];
  const files={
    "[Content_Types].xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="ASSET REQUEST" sheetId="1" r:id="rId1"/><sheet name="SCENE START + SOLVED" sheetId="2" r:id="rId2"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
    "xl/worksheets/sheet1.xml":makeXlsxSheet(assetRows,[16,31,15,12,24,11,11,15,10,24,10,12,12,34,34,22,18,34]),
    "xl/worksheets/sheet2.xml":makeXlsxSheet(sceneRows,[32,90,90],["A1:C1","A2:C2","B8:C8","B9:C9"],[15])
  };
  const blob=new Blob([zipStore(files)],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${base}_ASSET_REQUEST.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast("Đã xuất Asset Request · nhớ gửi 2 Scene PNG");
}
function loadCanvasImage(src){return new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src})}
function canvasText(ctx,text,x,y,maxWidth,lineHeight){
  const words=String(text||"").split(/\s+/);let line="",yy=y;
  words.forEach(w=>{const t=line?line+" "+w:w;if(ctx.measureText(t).width>maxWidth&&line){ctx.fillText(line,x,yy);line=w;yy+=lineHeight}else line=t});if(line)ctx.fillText(line,x,yy);return yy;
}
function zipStore(files){
  const enc=new TextEncoder(),locals=[],centrals=[];let offset=0;
  Object.entries(files).forEach(([name,content])=>{
    const n=enc.encode(name),d=typeof content==="string"?enc.encode(content):content,crc=crc32(d);
    const local=concatBytes([u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(d.length),u32(d.length),u16(n.length),u16(0),n,d]);
    locals.push(local);
    const central=concatBytes([u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(d.length),u32(d.length),u16(n.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),n]);
    centrals.push(central);offset+=local.length;
  });
  const centralSize=centrals.reduce((a,b)=>a+b.length,0),count=centrals.length;
  return concatBytes([...locals,...centrals,u32(0x06054b50),u16(0),u16(0),u16(count),u16(count),u32(centralSize),u32(offset),u16(0)]);
}
function canvasRoundedPath(ctx,x,y,w,h,r){
  const radius=Math.max(0,Math.min(r,w/2,h/2));
  ctx.beginPath();ctx.moveTo(x+radius,y);ctx.lineTo(x+w-radius,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+radius);ctx.lineTo(x+w,y+h-radius);
  ctx.quadraticCurveTo(x+w,y+h,x+w-radius,y+h);ctx.lineTo(x+radius,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-radius);ctx.lineTo(x,y+radius);
  ctx.quadraticCurveTo(x,y,x+radius,y);ctx.closePath();
}
function drawQslotPng(ctx,o){
  const {x,y,w,h}=o;
  ctx.save();
  canvasRoundedPath(ctx,x,y,w,h,Math.min(w,h)*.24);
  ctx.fillStyle="#d9d2e7";ctx.fill();
  const pad=Math.min(w,h)*.08;
  canvasRoundedPath(ctx,x+pad,y+pad,w-2*pad,h-2*pad,Math.min(w,h)*.18);
  ctx.setLineDash([Math.max(4,Math.min(w,h)*.115),Math.max(3,Math.min(w,h)*.058)]);
  ctx.lineWidth=Math.max(2,Math.min(w,h)*.055);
  ctx.strokeStyle="#f7f5fb";ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle="#837892";ctx.textAlign="center";ctx.textBaseline="middle";
  const sz=Math.min(w,h);
  ctx.font=`900 ${Math.max(12,sz*.42)}px Arial`;ctx.fillText("?",x+w*.5,y+h*.53);
  ctx.font=`900 ${Math.max(8,sz*.25)}px Arial`;
  ctx.fillText("?",x+w*.27,y+h*.60);ctx.fillText("?",x+w*.73,y+h*.60);
  ctx.restore();
}
function drawSceneCharPng(ctx,c){
  ctx.save();
  ctx.beginPath();ctx.fillStyle="#fff";ctx.strokeStyle=c.type==="M"?"#ff6f96":"#7563c7";
  ctx.lineWidth=6;ctx.arc(c.x,c.y,30,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle="#342f3a";ctx.font="900 21px Arial";ctx.textAlign="center";
  ctx.fillText(c.id,c.x,c.y+7);
  ctx.font="700 19px Arial";ctx.fillText(c.name||"",c.x,c.y+56);
  ctx.restore();
}
function canvasAsPngBytes(canvas){
  return new Promise((resolve,reject)=>canvas.toBlob(async blob=>{
    if(!blob)return reject(Error("Không thể tạo PNG"));
    try{resolve(new Uint8Array(await blob.arrayBuffer()))}catch(e){reject(e)}
  },"image/png"));
}
function renderVectorPath(ctx, o){
  try {
    const svgD = generateSvgPathD(o);
    if(!svgD) return;
    const p2d = new Path2D(svgD);
    if(o.closed && o.fill && o.fill !== "transparent" && o.fill !== "none"){
      ctx.fillStyle = o.fill;
      ctx.fill(p2d);
    }
    ctx.lineWidth = o.strokeWidth || 3;
    ctx.strokeStyle = o.stroke || "#2563eb";
    ctx.globalAlpha = o.strokeOpacity !== undefined ? o.strokeOpacity : 1;
    if(o.strokeStyle === "dashed") ctx.setLineDash([8, 6]);
    else if(o.strokeStyle === "dotted") ctx.setLineDash([3, 4]);
    else ctx.setLineDash([]);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke(p2d);
  } catch(e) {
    console.warn("Lỗi vẽ vector path trên canvas:", e);
  }
}
function renderStarPath(ctx, cx, cy, spikes = 5, outerRadius = 50, innerRadius = 25){
  let rot = (Math.PI / 2) * 3;
  let x = cx, y = cy;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for(let i = 0; i < spikes; i++){
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}
function renderPolygonPath(ctx, cx, cy, sides = 6, radius = 50){
  ctx.beginPath();
  for(let i = 0; i < sides; i++){
    const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if(i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}
async function buildSceneCanvas(state){
  const canvas=document.createElement("canvas");canvas.width=1080;canvas.height=1610;
  const ctx=canvas.getContext("2d");
  ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
  const layers=sceneLayerItems().sort((a,b)=>(Number(a.obj.z)||0)-(Number(b.obj.z)||0));
  for(const layer of layers){
    const o=layer.obj;
    if(layer.type==="image"){
      const im=await loadCanvasImage(o.src);
      if(im){
        ctx.save();
        const cx = o.x + (o.w || 100) / 2;
        const cy = o.y + (o.h || 100) / 2;
        ctx.translate(cx, cy);
        if(o.rotation) ctx.rotate((o.rotation * Math.PI) / 180);
        if(o.flipH || o.flipV) ctx.scale(o.flipH ? -1 : 1, o.flipV ? -1 : 1);
        ctx.drawImage(im, -o.w / 2, -o.h / 2, o.w, o.h);
        ctx.restore();
      }
    }else{
      if(!o.visibleInPlay)continue;
      ctx.save();
      const cx = o.x + (o.w || 100) / 2;
      const cy = o.y + (o.h || 100) / 2;
      ctx.translate(cx, cy);
      if(o.rotation) ctx.rotate((o.rotation * Math.PI) / 180);
      if(o.flipH || o.flipV) ctx.scale(o.flipH ? -1 : 1, o.flipV ? -1 : 1);
      ctx.translate(-cx, -cy);
      ctx.lineWidth=o.strokeWidth||4;ctx.strokeStyle=o.stroke||"#655d69";ctx.fillStyle=o.fill||"#f4f1f6";
      if(o.type==="qslot")drawQslotPng(ctx,o);
      else if(o.type==="rect"){ctx.fillRect(o.x,o.y,o.w,o.h);ctx.strokeRect(o.x,o.y,o.w,o.h)}
      else if(o.type==="circle"){ctx.beginPath();ctx.ellipse(o.x+o.w/2,o.y+o.h/2,o.w/2,o.h/2,0,0,Math.PI*2);ctx.fill();ctx.stroke()}
      else if(o.type==="triangle"){ctx.beginPath();ctx.moveTo(o.x+o.w/2,o.y);ctx.lineTo(o.x+o.w,o.y+o.h);ctx.closePath();ctx.fill();ctx.stroke()}
      else if(o.type==="arrow"){
        const x1=o.x+(o.arrowXDir===1?0:o.w),x2=o.x+(o.arrowXDir===1?o.w:0),y1=o.y+(o.arrowYDir===1?0:o.h),y2=o.y+(o.arrowYDir===1?o.h:0);
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();const a=Math.atan2(y2-y1,x2-x1);
        ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-22*Math.cos(a-.45),y2-22*Math.sin(a-.45));ctx.lineTo(x2-22*Math.cos(a+.45),y2-22*Math.sin(a+.45));ctx.closePath();ctx.fillStyle=o.stroke||"#655d69";ctx.fill();
      }else if(o.type==="star"){
        renderStarPath(ctx,o.x+o.w/2,o.y+o.h/2,5,o.w/2,o.w/4);ctx.fill();ctx.stroke();
      }else if(o.type==="polygon"){
        renderPolygonPath(ctx,o.x+o.w/2,o.y+o.h/2,6,o.w/2);ctx.fill();ctx.stroke();
      }else if(o.type==="line"){
        ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(o.x+o.w,o.y+o.h);ctx.stroke();
      }else if((o.type==="path"||["pen","pencil","brush"].includes(o.type))&&Array.isArray(o.points)){
        renderVectorPath(ctx,o);
      }
      if(o.type!=="qslot"&&o.text){
        ctx.fillStyle=o.type==="text"?(o.stroke||"#514953"):(o.textColor||"#514953");
        ctx.font=`700 ${o.fontSize||28}px Arial`;ctx.textAlign="center";
        canvasText(ctx,o.text,o.x+o.w/2,o.y+Math.max(28,(o.fontSize||28)),Math.max(40,o.w-12),(o.fontSize||28)*1.15);
      }
      ctx.restore();
    }
  }
  sortedCharacters().filter(c=>state==="SOLVED"||c.type==="F").forEach(c=>drawSceneCharPng(ctx,c));
  return canvas;
}
async function exportScenePng(){
  try{
    const base=safeBaseName(data.level.id||"DRAMA_LEVEL");
    const startCanvas=await buildSceneCanvas("START");
    const solvedCanvas=await buildSceneCanvas("SOLVED");
    const files={
      [`${base}_SCENE_START.png`]:await canvasAsPngBytes(startCanvas),
      [`${base}_SCENE_SOLVED.png`]:await canvasAsPngBytes(solvedCanvas)
    };
    const blob=new Blob([zipStore(files)],{type:"application/zip"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);
    a.download=`${base}_SCENE_START_SOLVED.zip`;a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    toast("Đã xuất ZIP · Scene START + SOLVED");
  }catch(e){console.error(e);toast("Không xuất được Scene PNG · kiểm tra ảnh/layer")}
}


function projectSaveIdentity(){
  return `${String(data.level.id||"").trim()}|${String(data.level.version||"1.0").trim()}`;
}
function detachProjectFile(){projectFileHandle=null;lastSavedProjectIdentity=null;}
let lastSavedProjectIdentity=null;
async function saveProjectFile(forceNew=false){
  save();
  savePlayProgress();
  const editorData=deep(data);editorData.editorSchemaVersion="1.31";
  const json=JSON.stringify(editorData,null,2);
  const idPart=(data.level.id||"drama_level").replace(/[^\w\-]+/g,"_");
  const filename=`${idPart}_v${String(data.level.version||"1.0").replace(/[^\w.\-]+/g,"_")}.editor.json`;
  const identity=projectSaveIdentity();
  if(lastSavedProjectIdentity!==identity)detachProjectFile();

  if("showSaveFilePicker" in window){
    try{
      const handle=(!forceNew&&projectFileHandle)?projectFileHandle:await window.showSaveFilePicker({
        suggestedName:filename,
        types:[{description:"Drama Level JSON",accept:{"application/json":[".json"]}}]
      });
      const writable=await handle.createWritable();
      await writable.write(json);
      await writable.close();
      projectFileHandle=handle;
      lastSavedProjectIdentity=identity;
      toast(forceNew?"Đã lưu thành file mới":"Đã lưu Project");
      return;
    }catch(e){
      if(e?.name==="AbortError")return;
      console.warn("Save Project failed; downloading JSON instead",e);
    }
  }

  const blob=new Blob([json],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  detachProjectFile();
  toast("Đã tải Project JSON mới");
}

$("#saveBtn").onclick=()=>saveProjectFile(false);
$("#saveAsBtn").onclick=()=>saveProjectFile(true);
$("#exportBtn").onclick=()=>{
  const check=runPreflightCheck(true);
  if(check.errors.length){renderPreflightCheck(check);$("#checkOverlay").classList.add("show");toast(`CHECK LEVEL: còn ${check.errors.length} lỗi phải sửa`);return}
  const idPart=data.level.id||"drama_level";
  const ver=String(data.level.version||"1.0").replace(/[^A-Za-z0-9._-]+/g,"_");
  downloadText(JSON.stringify(buildRuntimeData(),null,2),`${idPart}_v${ver}.level.json`,"application/json");
  toast(check.warnings.length?`Đã xuất Dev JSON · ${check.warnings.length} cảnh báo`:`Đã xuất Dev JSON · KIỂM TRA ĐẠT`);
};
$("#assetRequestBtn").onclick=exportAssetRequest;
$("#scenePngBtn").onclick=exportScenePng;
function openProjectJsonText(text, filename){
  try{
    if(!text || typeof text !== "string") throw new Error("Tệp rỗng hoặc không có nội dung");
    const cleaned = text.replace(/^\uFEFF/, "").trim();
    if(!cleaned) throw new Error("Tệp không chứa dữ liệu JSON hợp lệ");

    playSession++;
    clearPlayProgress();
    projectFileHandle = null;

    let raw = JSON.parse(cleaned);

    if(raw?.schemaVersion && String(raw.schemaVersion).startsWith("drama-level-runtime")){
      const adapted = adaptRuntimeToEditor(raw);
      if(adapted){
        data = adapted;
        selected = { type: "level", id: "level" };
        mode = "edit";
        lastSnapshot = JSON.stringify(data);
        persistRaw();
        refreshImmediate();
        toast(`Đã nạp và chuyển đổi Dev JSON: ${filename || "runtime.json"}`);
        return true;
      } else {
        throw new Error("Không thể chuyển đổi cấu trúc Runtime JSON");
      }
    }

    if(raw?.ending){
      raw.level = raw.level || {};
      raw.level.ending = {
        ...blankEnding(),
        ...(raw.level.ending || {}),
        endingLine: raw.ending.endingLine ?? raw.level.ending?.endingLine ?? "",
        verdictCta: raw.ending.verdictCta ?? raw.level.ending?.verdictCta ?? "",
        imageAssetId: raw.ending.imageAssetId ?? raw.level.ending?.imageAssetId ?? "ENDING01",
        imageSrc: raw.ending.imageSrc ?? raw.level.ending?.imageSrc ?? "",
        rewardCoins: ENDING_REWARD_COINS,
        normalRewardCoins: ENDING_NORMAL_COINS
      };
    }

    data = normalize(raw);
    selected = { type: "level", id: "level" };
    mode = "edit";
    lastSnapshot = JSON.stringify(data);
    persistRaw();
    refreshImmediate();
    const endingNote = data.level.ending?.imageSrc ? " · có Ending Image" : "";
    toast(`Đã mở thành công: ${filename || "dự án JSON"}${endingNote}`);
    return true;
  }catch(err){
    console.error("Lỗi khi mở file JSON:", err);
    toast("Không thể mở file: " + (err?.message || "Định dạng JSON không hợp lệ"));
    return false;
  }
}
window.openProjectJsonText = openProjectJsonText;

$("#importFile").onchange = e => {
  const f = e.target.files && e.target.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = () => {
    openProjectJsonText(r.result, f.name);
  };
  r.onerror = () => {
    console.error("FileReader error:", r.error);
    toast("Lỗi đọc tệp từ thiết bị");
  };
  r.readAsText(f);
  e.target.value = "";
};

window.addEventListener("dragover", e => {
  if(e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")){
    e.preventDefault();
  }
});
window.addEventListener("drop", e => {
  if(!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return;
  const f = e.dataTransfer.files[0];
  if(f && (f.name.toLowerCase().endsWith(".json") || f.type === "application/json")){
    e.preventDefault();
    const r = new FileReader();
    r.onload = () => {
      openProjectJsonText(r.result, f.name);
    };
    r.onerror = () => {
      console.error("FileReader error on drop:", r.error);
      toast("Lỗi đọc tệp kéo thả");
    };
    r.readAsText(f);
  }
});

function loadSampleProject(sampleData,message){
  projectFileHandle=null;playSession++;clearPlayProgress();data=normalize(sampleData);selected={type:"level",id:"level"};mode="edit";multiSel.clear();save();refreshImmediate();toast(message);
}
$("#checkLevelBtn").onclick=openPreflightCheck;
$("#closeCheckLevel").onclick=()=>$("#checkOverlay").classList.remove("show");
$("#checkOverlay").addEventListener("pointerdown",e=>{if(e.target===$("#checkOverlay"))$("#checkOverlay").classList.remove("show")});
$("#sampleWeddingBtn").onclick=()=>loadSampleProject(sample(),"Đã load Sample Wedding · L001");
$("#sampleBirthdayBtn").onclick=()=>loadSampleProject(sampleBirthday(),"Đã load Sample Birthday Photo Booth · L003");
$("#resetBtn").onclick=()=>{if(!confirm("Reset trắng toàn bộ level hiện tại?"))return;projectFileHandle=null;playSession++;clearPlayProgress();data=normalize(blank());selected={type:"level",id:"level"};mode="edit";multiSel.clear();save();refreshImmediate();toast("Đã reset trắng hoàn toàn")};

$("#overlay").addEventListener("pointerdown",e=>{if(e.target===$("#overlay"))$("#overlay").classList.remove("show")});
$("#endingOverlay").addEventListener("pointerdown",e=>{if(e.target===$("#endingOverlay"))$("#endingOverlay").classList.remove("show")});
window.addEventListener("keydown",e=>{if(e.key==="Escape"){$("#overlay").classList.remove("show");$("#endingOverlay").classList.remove("show");$("#checkOverlay").classList.remove("show")}});

["endingBtn","scenePngBtn","assetRequestBtn","exportBtn"].forEach(id=>{const el=$("#"+id);if(el)el.addEventListener("click",()=>{$("#productionMenu")?.removeAttribute("open")})});
["sampleWeddingBtn","sampleBirthdayBtn"].forEach(id=>{const el=$("#"+id);if(el)el.addEventListener("click",()=>{$("#sampleMenu")?.removeAttribute("open")})});
["resetBtn","saveAsBtn"].forEach(id=>{const el=$("#"+id);if(el)el.addEventListener("click",()=>{$("#moreMenu")?.removeAttribute("open")})});

let canvasZoom = 1.0;
let canvasPan = {x: 0, y: 0};
let isSpaceDown = false;
let isPanning = false;
let panStart = {x: 0, y: 0};

function applyZoomPan(){
  const st=$("#stage");
  if(!st) return;
  st.style.transformOrigin = "center center";
  st.style.transform = `scale(${canvasZoom}) translate(${canvasPan.x}px, ${canvasPan.y}px)`;
  const zl=$("#zoomValue");
  if(zl) zl.textContent = Math.round(canvasZoom * 100) + "%";
}

let lastMouseStagePos = null;

function initZoomAndPan(){
  const zin=$("#zoomInBtn"), zout=$("#zoomOutBtn"), zreset=$("#zoomResetBtn");
  if(zin) zin.onclick = () => { canvasZoom = Math.min(2.5, +(canvasZoom + 0.15).toFixed(2)); applyZoomPan(); };
  if(zout) zout.onclick = () => { canvasZoom = Math.max(0.3, +(canvasZoom - 0.15).toFixed(2)); applyZoomPan(); };
  if(zreset) zreset.onclick = () => { canvasZoom = 1.0; canvasPan = {x: 0, y: 0}; applyZoomPan(); toast("Zoom: 100% (1:1)"); };
  
  window.addEventListener("keydown", e => {
    if(e.code === "Space" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)){
      if(!isSpaceDown){
        isSpaceDown = true;
        document.body.classList.add("spaceDown");
      }
    }
  });
  window.addEventListener("keyup", e => {
    if(e.code === "Space"){
      isSpaceDown = false;
      isPanning = false;
      document.body.classList.remove("spaceDown", "panning");
    }
  });
  
  const sw=$("#stageWrap") || $("#stage");
  if(sw){
    sw.addEventListener("wheel", e => {
      if(e.ctrlKey || e.metaKey || isSpaceDown){
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.08 : -0.08;
        canvasZoom = Math.min(2.5, Math.max(0.3, +(canvasZoom + delta).toFixed(2)));
        applyZoomPan();
      }
    }, { passive: false });

    sw.addEventListener("pointermove", e => {
      lastMouseStagePos = logical(e);
    });

    sw.addEventListener("pointerdown", e => {
      if(isSpaceDown || e.button === 1){
        isPanning = true;
        panStart = {x: e.clientX - canvasPan.x * canvasZoom, y: e.clientY - canvasPan.y * canvasZoom};
        document.body.classList.add("panning");
        e.preventDefault();
      } else if(e.button === 0 && e.target === sw){
        startMarquee(e);
      }
    });
    window.addEventListener("pointermove", e => {
      if(isPanning){
        canvasPan.x = (e.clientX - panStart.x) / canvasZoom;
        canvasPan.y = (e.clientY - panStart.y) / canvasZoom;
        applyZoomPan();
      }
    });
    window.addEventListener("pointerup", () => {
      if(isPanning){
        isPanning = false;
        document.body.classList.remove("panning");
      }
    });
  }

  document.addEventListener("click", e => {
    if(!e.target.closest(".topMenu")){
      document.querySelectorAll(".topMenu[open]").forEach(m => m.removeAttribute("open"));
    }
  });
}

function initChangelogModal(){
  const btn=$("#changelogBtn"), close=$("#closeChangelog"), overlay=$("#changelogOverlay");
  if(btn && overlay) btn.onclick = () => overlay.classList.add("show");
  if(close && overlay) close.onclick = () => overlay.classList.remove("show");
}

function alignSelectedObjects(dir){
  const items = [];
  multiSel.forEach(k => {
    const [type, id] = k.split(":");
    if(type === "image"){ const it = byImg(id); if(it) items.push(it); }
    else if(type === "annotation"){ const it = byAnn(id); if(it) items.push(it); }
  });
  if(items.length < 2) return;
  
  if(dir === "left"){
    const minX = Math.min(...items.map(it => it.x));
    items.forEach(it => it.x = minX);
  }else if(dir === "right"){
    const maxR = Math.max(...items.map(it => it.x + it.w));
    items.forEach(it => it.x = maxR - it.w);
  }else if(dir === "centerX"){
    const centers = items.map(it => it.x + it.w/2);
    const avgCenter = centers.reduce((a,b)=>a+b,0) / items.length;
    items.forEach(it => it.x = Math.round(avgCenter - it.w/2));
  }else if(dir === "top"){
    const minY = Math.min(...items.map(it => it.y));
    items.forEach(it => it.y = minY);
  }else if(dir === "bottom"){
    const maxB = Math.max(...items.map(it => it.y + it.h));
    items.forEach(it => it.y = maxB - it.h);
  }else if(dir === "centerY"){
    const centers = items.map(it => it.y + it.h/2);
    const avgCenter = centers.reduce((a,b)=>a+b,0) / items.length;
    items.forEach(it => it.y = Math.round(avgCenter - it.h/2));
  }
  save(); refreshImmediate(); toast("Đã căn lề các đối tượng");
}

function initThemeSystem(){
  const saved = localStorage.getItem("dramapuzzle_theme") || "dark";
  applyTheme(saved);
  const btn = $("#themeToggleBtn");
  if(btn){
    btn.onclick = () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      toast(next === "dark" ? "Đã bật Chế độ Tối (Obsidian Dark)" : "Đã bật Chế độ Sáng (Clean Studio Light)");
    };
  }
}
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("dramapuzzle_theme", theme);
  const icon = $("#themeIcon");
  if(icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
  const btn = $("#themeToggleBtn");
  if(btn) btn.title = theme === "dark" ? "Chuyển sang Giao diện Sáng" : "Chuyển sang Giao diện Tối";
}

window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".overlay.show, .changelogOverlay.show, .checkOverlay.show, .difficultyOverlay.show, .endingOverlay.show").forEach(el => el.classList.remove("show"));
  }
});
const dOverlay = $("#difficultyOverlay");
if(dOverlay){
  dOverlay.addEventListener("pointerdown", e => {
    if(e.target === dOverlay) dOverlay.classList.remove("show");
  });
}
const cOverlay = $("#changelogOverlay");
if(cOverlay){
  cOverlay.addEventListener("pointerdown", e => {
    if(e.target === cOverlay) cOverlay.classList.remove("show");
  });
}
const chkOverlay = $("#checkOverlay");
if(chkOverlay){
  chkOverlay.addEventListener("pointerdown", e => {
    if(e.target === chkOverlay) chkOverlay.classList.remove("show");
  });
}

function initDrawingLayer(){
  const canvas = $("#drawingCanvas");
  if(!canvas) return;

  canvas.addEventListener("pointerdown", e => {
    if(mode !== "edit") return;
    if(!["pencil", "brush", "pen"].includes(activeTool)) return;
    e.preventDefault();
    e.stopPropagation();

    const l = logical(e);
    const pt = { x: Math.round(l.x), y: Math.round(l.y) };

    if(activeTool === "pencil" || activeTool === "brush"){
      isFreehandDrawing = true;
      const cfg = drawState[activeTool];
      currentFreehandStroke = {
        type: activeTool,
        color: cfg.color,
        size: cfg.size,
        opacity: cfg.opacity,
        points: [pt]
      };
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.strokeStyle = cfg.color;
      ctx.lineWidth = cfg.size;
      ctx.globalAlpha = cfg.opacity;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(1, cfg.size / 2), 0, Math.PI * 2);
      ctx.fillStyle = cfg.color;
      ctx.fill();
      ctx.restore();
    } else if(activeTool === "pen"){
      if(penActivePoints.length >= 3){
        const firstPt = penActivePoints[0];
        const dist = Math.hypot(pt.x - firstPt.x, pt.y - firstPt.y);
        if(dist <= 16){
          const pts = [...penActivePoints];
          penActivePoints = [];
          penHoverPoint = null;
          isDraggingPenHandle = false;
          redrawDrawingCanvas();
          createPathAnnotation("pen", pts, {
            closed: true,
            stroke: drawState.pen.color,
            strokeWidth: drawState.pen.size,
            strokeOpacity: drawState.pen.opacity
          });
          toast("Đã khép kín đường vẽ bút mực");
          return;
        }
      }

      if(penActivePoints.length > 0){
        const lastPt = penActivePoints[penActivePoints.length - 1];
        const distToLast = Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y);
        if(distToLast <= 16){
          const hasOutgoingHandle = lastPt.cp2 && (lastPt.cp2.x !== lastPt.x || lastPt.cp2.y !== lastPt.y);
          if(hasOutgoingHandle){
            lastPt.cp2 = { x: lastPt.x, y: lastPt.y };
            isDraggingPenHandle = false;
            penHoverPoint = null;
            redrawDrawingCanvas();
            toast("Đã ngắt tay đòn cong · Bắt đầu góc nhọn");
            return;
          } else {
            if(penActivePoints.length >= 2){
              finishPenPath();
              return;
            }
          }
        }
      }

      const newPt = {
        x: pt.x,
        y: pt.y,
        cp1: { x: pt.x, y: pt.y },
        cp2: { x: pt.x, y: pt.y }
      };
      penActivePoints.push(newPt);
      isDraggingPenHandle = true;
      penHoverPoint = null;
      redrawDrawingCanvas();
    }
  });

  window.addEventListener("pointermove", e => {
    if(mode !== "edit") return;
    if(isFreehandDrawing && currentFreehandStroke){
      e.preventDefault();
      const l = logical(e);
      const pt = { x: Math.round(l.x), y: Math.round(l.y) };
      const prev = currentFreehandStroke.points[currentFreehandStroke.points.length - 1];
      currentFreehandStroke.points.push(pt);

      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.strokeStyle = currentFreehandStroke.color;
      ctx.lineWidth = currentFreehandStroke.size;
      ctx.globalAlpha = currentFreehandStroke.opacity;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      ctx.restore();
    } else if(activeTool === "pen" && penActivePoints.length > 0){
      const l = logical(e);
      const cur = { x: Math.round(l.x), y: Math.round(l.y) };

      if(isDraggingPenHandle){
        const activePt = penActivePoints[penActivePoints.length - 1];
        activePt.cp2 = { x: cur.x, y: cur.y };
        if(e.altKey){
        } else {
          activePt.cp1 = { x: Math.round(2 * activePt.x - cur.x), y: Math.round(2 * activePt.y - cur.y) };
        }
        redrawDrawingCanvas();
      } else {
        const st = $("#stage");
        const r = st.getBoundingClientRect();
        if(e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom){
          penHoverPoint = cur;
          redrawDrawingCanvas();
        }
      }
    }
  });

  window.addEventListener("pointerup", () => {
    if(isFreehandDrawing && currentFreehandStroke){
      isFreehandDrawing = false;
      if(currentFreehandStroke.points.length >= 2){
        createPathAnnotation(activeTool, currentFreehandStroke.points, {
          stroke: currentFreehandStroke.color,
          strokeWidth: currentFreehandStroke.size,
          strokeOpacity: currentFreehandStroke.opacity
        });
      }
      currentFreehandStroke = null;
      redrawDrawingCanvas();
    }
    if(isDraggingPenHandle && penActivePoints.length > 0){
      isDraggingPenHandle = false;
      const last = penActivePoints[penActivePoints.length - 1];
      if(Math.hypot(last.cp2.x - last.x, last.cp2.y - last.y) < 4){
        last.cp1 = { x: last.x, y: last.y };
        last.cp2 = { x: last.x, y: last.y };
      }
      redrawDrawingCanvas();
    }
  });

  canvas.addEventListener("dblclick", e => {
    if(activeTool === "pen"){
      e.preventDefault();
      e.stopPropagation();
      finishPenPath();
    }
  });
}

initThemeSystem();
initZoomAndPan();
initChangelogModal();
initDrawingLayer();
play=loadPlayProgress();
render();

window.data = data;
Object.defineProperty(window, "selected", { get: () => selected, set: v => { selected = v; } });
Object.defineProperty(window, "mode", { get: () => mode, set: v => { mode = v; } });
Object.defineProperty(window, "play", { get: () => play, set: v => { play = v; } });
Object.defineProperty(window, "activeTool", { get: () => activeTool, set: v => { setTool(v); } });
window.multiSel = multiSel;
window.drawState = drawState;
window.getPenActivePoints = () => penActivePoints;
window.redrawDrawingCanvas = redrawDrawingCanvas;
window.finishPenPath = finishPenPath;
window.cancelPenPath = cancelPenPath;
window.undoDrawingStroke = undoDrawingStroke;
window.clearDrawingStrokes = clearDrawingStrokes;
window.setTool = setTool;
window.exportScenePng = exportScenePng;
window.createPathAnnotation = createPathAnnotation;
window.save = save;
window.render = render;
window.renderLive = renderLive;
window.renderInspector = renderInspector;
window.buildSceneCanvas = buildSceneCanvas;
window.zipStore = zipStore;
window.reactionSettledStep = reactionSettledStep;
window.buildRuntimeData = buildRuntimeData;
window.detachProjectFile = detachProjectFile;
window.saveProjectFile = saveProjectFile;
window.replayShuffleNames = replayShuffleNames;
window.replayOriginalNames = replayOriginalNames;
window.replayLastShuffledNames = replayLastShuffledNames;
window.exportAssetRequest = exportAssetRequest;
window.makeXlsxSheet = makeXlsxSheet;
window.getProjectFileHandle = () => projectFileHandle;
window.renderEndingTab = renderEndingTab;
window.setEndingImageFile = setEndingImageFile;
window.exportEndingPng = exportEndingPng;
window.createAnnotation = createAnnotation;
window.duplicateAnnotation = duplicateAnnotation;
window.byAnn = byAnn;
window.refreshImmediate = refreshImmediate;
})();
