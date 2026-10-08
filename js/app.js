/* ==========================================================================
   DRAMA PUZZLE LEVEL EDITOR — CORE APPLICATION LOGIC (V1.35)
   Decoupled Modular Architecture
   ========================================================================== */

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
// Mở project cũ: emoji ngoài library 47 được quy về biểu cảm gần nhất.
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
function pickUniqueName(pool,used){
  const candidates=(NAME_POOLS[pool]||[]).filter(n=>!used.has(n));
  if(!candidates.length)return null;
  return candidates[Math.floor(Math.random()*candidates.length)];
}
function buildPlayNameMap(randomize){
  const map={},used=new Set();
  sortedCharacters().forEach(c=>{
    let name=c.name||c.id;
    if(randomize&&c.namePool&&c.namePool!=="KEEP"){
      const picked=pickUniqueName(c.namePool,used);
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
  return {level:{id:"",version:"1.0",hook:"",difficultyTarget:"",difficultySelf:"",difficultyAmbiguity:"",difficultyCombine:"",difficultyTested:false,reveal:"",revealWhen:[],revealParentClueId:"",truth:"",art:blankLevelArt(),ending:blankEnding()},images:[],characters:[],clues:[],annotations:[]};
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
  delete d.level.moves; // V1.27: 2 mạng là rule global, không còn data theo level.
  d.images=d.images||[];
  d.characters=d.characters||[];
  d.clues=d.clues||[];
  // V1.29: Scene Evidence metadata đã bỏ khỏi authoring. Giữ một mảng legacy không enumerable để project cũ không làm code cũ lỗi, nhưng Save Project không xuất field này.
  const legacySceneEvidence=Array.isArray(d.sceneEvidence)?d.sceneEvidence:[];
  delete d.sceneEvidence;
  Object.defineProperty(d,"sceneEvidence",{value:[],writable:true,configurable:true,enumerable:false});
  d.annotations=d.annotations||[];
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
  d.level.art.sceneItems=Array.isArray(d.level.art.sceneItems)?d.level.art.sceneItems:[];
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

  // V1.29: bỏ metadata chỉ phục vụ Solve Graph. Logic thật nằm ở clue parent/resolve, placement trigger và reaction trigger.
  d.characters.forEach(c=>{
    c.answerSet=true;
    c.appearance=c.appearance||[];
    delete c.sceneTag; // Scene Tag system removed in V1.15
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

    // Migrate V1.4 reaction data into Reaction Event -> Sequence.
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

    // V1.27: START không còn là Reaction. Project cũ được gộp state cuối START vào Initial State.
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

  // V1.28: type và prefix ID luôn đồng bộ, kể cả khi import project cũ.
  enforceCharacterTypeIdsInDataset(d);

  // V1.24.1: placement-trigger fields chỉ được phép tham chiếu Movable.
  // Project cũ có Fxx / ID lỗi sẽ được dọn ngay khi normalize để không tạo trigger ẩn trong data.
  const validMovableTriggerIds=new Set(d.characters.filter(c=>c.type==="M").map(c=>c.id));
  d.level.revealWhen=[...new Set((d.level.revealWhen||[]).filter(id=>validMovableTriggerIds.has(id)))];

  // Normalize scene art IDs after all imported data is available.
  d.level.art.sceneItems.forEach(item=>{
    if(item.exportMode==="BAKED_BG")item.assetId=d.level.art.backgroundAssetId;
    else if(!item.assetId){
      const prefix=item.exportMode==="FOREGROUND"?"FG":"OBJ";
      const used=new Set(d.level.art.sceneItems.map(x=>x.assetId).filter(Boolean));
      let n=1,id="";do{id=prefix+String(n++).padStart(2,"0")}while(used.has(id));item.assetId=id;
    }
  });

  // New clue schema:
  // Root is ACTIVE at START.
  // Child opens automatically when its direct parent resolves.
  // preOpen only decides LOCKED placeholder vs fully HIDDEN.
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

  // Main Drama Reveal có thể nằm dưới một clue như một reveal item đặc biệt.
  // Nếu parent cũ không còn tồn tại thì xóa để tránh dangling reference.
  if(d.level.revealParentClueId && !d.clues.some(cl=>cl.id===d.level.revealParentClueId))d.level.revealParentClueId="";

  d.annotations.forEach((a,idx)=>{
    a.type=a.type||"rect";
    a.x=Number(a.x)||100;a.y=Number(a.y)||100;
    a.w=Math.max(30,Number(a.w)||180);a.h=Math.max(24,Number(a.h)||100);
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
    a.z=Number(a.z)||20+idx;
  });

  normalizeSceneZData(d);
  return d;
}

let data=normalize((()=>{try{return JSON.parse(localStorage.getItem("dramaEditorV1_1"))}catch(e){return null}})()||blank());
let selected={type:"level",id:"level"}, mode="edit", play=null, ctxId=null, ctxType="image", activeTool="select";
let multiSel=new Set();
let wrapBoundaryEnabled = localStorage.getItem("dramaEditorWrapBoundary") !== "false";
window.data=data;window.selected=selected;window.multiSel=multiSel;window.createAnnotation=createAnnotation;window.refreshImmediate=()=>refreshImmediate();
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
    // Fixed không có SELF_PLACED. Giữ event nhưng bắt GD chọn lại trigger thay vì tự đoán.
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

  // Gaze hướng trái: đảo thứ tự để target nằm về phía mũi tên đang chỉ tới.
  // Ví dụ: nina ← 😘
  // Gaze hướng phải / hướng khác: 😄 → rose
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
  // PLAY mô phỏng player view: không hiện tên Target trong bubble.
  // Hướng trái đặt mũi tên trước icon; các hướng khác đặt sau icon.
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

  // The artifact preview sometimes waits until the next click before painting.
  // Force the same state through microtask + two event-loop paints.
  queueMicrotask(repaint);
  setTimeout(repaint,0);
  setTimeout(repaint,24);
}
refreshImmediate.seq=0;

function renderLists(){
  $("#levelCard").classList.toggle("sel",selected.type==="level");

  $("#imgList").innerHTML=data.images.map(i=>`<div class="card ${selected.type==="image"&&selected.id===i.id?"sel":""}" data-s="image:${i.id}"><b>${esc(i.name)}</b><div class="meta">z:${i.z}${i.locked?" · LOCKED":""}</div></div>`).join("");

  $("#charList").innerHTML=sortedCharacters().map(c=>`<div class="card ${selected.type==="char"&&selected.id===c.id?"sel":""}" data-s="char:${c.id}">
    <b><span class="pill ${c.type.toLowerCase()}">${c.type}</span> ${c.id} · ${esc(c.name)}</b>
    <div class="meta">${esc(c.role)}</div></div>`).join("");

  const roots=data.clues.filter(c=>!c.parent);
  $("#clueList").innerHTML=roots.map(c=>clueList(c)).join("");
  initClueReorderListeners();

  const rx=[];
  sortedCharacters().forEach(c=>(c.reactionEvents||[]).forEach((ev,i)=>rx.push({char:c,event:ev,index:i})));
  $("#reactionList").innerHTML=rx.length?rx.map(x=>`<div class="card ${selected.type==="reaction"&&selected.charId===x.char.id&&selected.eventId===x.event.id?"sel":""}" data-rx="${x.char.id}|${x.event.id}">
    <b>${x.char.id} · EVENT ${x.index+1} · ${x.event.steps.length} step</b>
    <div class="meta">WHEN: ${esc(triggerLabel(x.char,x.event))}</div>
    <div class="rxSeq">${esc(sequencePreview(x.event,x.char.id))}</div></div>`).join(""):'<div class="small">Chưa có Reaction Event.</div>';

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
  
  // Photoshop CSS Filters
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

    const fontPx=Math.max(8,a.fontSize/1080*st.clientWidth);
    const selectedNow=inEdit&&selected.type==="annotation"&&selected.id===a.id;

    if(a.type==="rect"||a.type==="circle"){
      el.style.background=a.fill;el.style.borderColor=a.stroke;
      if(a.type==="rect"&&a.radius){el.style.borderRadius=(a.radius||0)+"px";}
      if(a.strokeStyle){el.style.borderStyle=a.strokeStyle;}
      if(a.strokeWidth){el.style.borderWidth=(a.strokeWidth||3)+"px";}
      el.innerHTML=`<div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="triangle"){
      const sDash=a.strokeStyle==="dashed"?'stroke-dasharray="6,4"':(a.strokeStyle==="dotted"?'stroke-dasharray="2,3"':'');
      el.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><polygon points="50,4 96,96 4,96" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a.strokeWidth||3}" ${sDash} stroke-linejoin="round" vector-effect="non-scaling-stroke"></polygon></svg><div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="star"){
      const sDash=a.strokeStyle==="dashed"?'stroke-dasharray="6,4"':(a.strokeStyle==="dotted"?'stroke-dasharray="2,3"':'');
      el.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><polygon points="50,2 62,38 100,38 69,60 81,96 50,74 19,96 31,60 0,38 38,38" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a.strokeWidth||3}" ${sDash} stroke-linejoin="round" vector-effect="non-scaling-stroke"></polygon></svg><div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="polygon"){
      const sDash=a.strokeStyle==="dashed"?'stroke-dasharray="6,4"':(a.strokeStyle==="dotted"?'stroke-dasharray="2,3"':'');
      el.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none"><polygon points="50,3 93,26 93,74 50,97 7,74 7,26" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a.strokeWidth||3}" ${sDash} stroke-linejoin="round" vector-effect="non-scaling-stroke"></polygon></svg><div class="shapeLabel" ${selectedNow&&!a.locked?'contenteditable="true"':''} style="font-size:${fontPx}px;color:${a.textColor}">${esc(a.text||"")}</div>${inEdit?'<div class="noteResize"></div>':''}`;
    }else if(a.type==="line"){
      const sDash=a.strokeStyle==="dashed"?'stroke-dasharray="6,4"':(a.strokeStyle==="dotted"?'stroke-dasharray="2,3"':'');
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
      const strokeColor = selectedNow ? (multiSel.size > 1 ? "#10b981" : "#3b82f6") : (a.stroke || "#655d69");
      el.innerHTML=`<svg viewBox="0 0 ${w} ${h}" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none">
        <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${baseX.toFixed(1)}" y2="${baseY.toFixed(1)}" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round"></line>
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
          const val=prompt("Text note",a.text||"");
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
  $("#progress").textContent=mode==="play"?(play?.failed?"💔 HẾT MẠNG · CHƠI LẠI":`${Object.keys(play?.placed||{}).length}/${data.characters.filter(c=>c.type==="M").length} đúng`):"EDIT MODE";
  document.body.classList.toggle("play",mode==="play");
  $("#editBtn").classList.toggle("on",mode==="edit");
  $("#playBtn").classList.toggle("on",mode==="play");
  $("#playBtn").textContent=(mode==="edit"&&play)?"PLAY · TIẾP TỤC":"PLAY";
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

    // A locked child only becomes visible as a lock while its DIRECT parent is open.
    // Deeper descendants do not leak through a still-locked parent.
    if(!ps?.active||ps.done)return"";
    if(c.preOpen==="HIDDEN")return"";
    return `<div class="cl ${d?"child":""} locked">🔒 █████ ███</div>`;
  }

  const own=`<div class="cl ${d?"child":""} ${s.done?"done":""}">${s.done?"✓":"•"} ${esc(resolveTokens(c.text||"(draft)"))}</div>`;
  const children=data.clues.filter(x=>x.parent===c.id).map(k=>playClue(k,d+1)).join("");
  const reveal=data.level.revealParentClueId===c.id?playDramaReveal(d+1):"";
  return own+children+reveal;
}

// ==========================================
// Clue Tree Drag & Drop and Reordering
// ==========================================
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
  
  // Adopt target's parent level
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
  $("#liveClues").innerHTML=mode==="edit"?roots.map(c=>editClue(c,0)).join(""):roots.map(c=>playClue(c,0)).join("")+rootReveal;
  if(mode==="edit")$$("[data-live]").forEach(e=>e.onclick=()=>{selected={type:"clue",id:e.dataset.live};refreshImmediate()});
}

function renderTray(){
  const box=$("#trayRow");box.innerHTML="";
  const list=mode==="play"
    ? sortedCharacters(c=>c.type==="M"&&!play.placed[c.id])
    : sortedCharacters();

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
    box.appendChild(t);
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
    if(type==="annotation"){const a=byAnn(id);if(a)snapshot.push({type,id,obj:a,x:a.x,y:a.y})}
  });
  const mv=ev=>{
    const p=logical(ev),dx=p.x-start.x,dy=p.y-start.y;
    snapshot.forEach(s=>{
      s.obj.x=s.x+dx;s.obj.y=s.y+dy;
      const el=s.type==="char"
        ? document.querySelector(`.char[data-char-id="${s.id}"]`)
        : s.type==="image"
          ? document.querySelector(`.imgLayer[data-img-id="${s.id}"]`)
          : document.querySelector(`.noteObj[data-annotation-id="${s.id}"]`);
      if(el){el.style.left=(s.obj.x/1080*100)+"%";el.style.top=(s.obj.y/1610*100)+"%"}
    });
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

  // Alt + Drag: Duplicate image and drag the clone to new position!
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
    
    // Auto-Wrap Boundary (60% Hidden Threshold)
    if(wrapBoundaryEnabled){
      // Ngang: nếu khuất 60% sang trái (curX <= -0.6 * i.w) -> chuyển sang mép phải
      if(curX <= -0.6 * i.w){
        curX = 1080 - i.w;
        sx = curX; p.x = q.x;
      } else if(curX >= 1080 - 0.4 * i.w){
        // Nếu khuất 60% sang phải (curX >= 1080 - 0.4 * i.w) -> chuyển sang mép trái
        curX = 0;
        sx = curX; p.x = q.x;
      }
      
      // Dọc: nếu khuất 60% lên trên (curY <= -0.6 * i.h) -> chuyển sang mép dưới
      if(curY <= -0.6 * i.h){
        curY = 1610 - i.h;
        sy = curY; p.y = q.y;
      } else if(curY >= 1610 - 0.4 * i.h){
        // Nếu khuất 60% xuống dưới (curY >= 1610 - 0.4 * i.h) -> chuyển sang mép trên
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
      // Shift = khóa theo tỷ lệ gốc của ảnh. Chọn trục kéo chi phối để cảm giác resize tự nhiên.
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
  if(selected.type==="char")return wrapWithAlign(el=>charIns(el,byChar(selected.id)));
  if(selected.type==="clue")return wrapWithAlign(el=>clueIns(el,byClue(selected.id)));
  if(selected.type==="image")return wrapWithAlign(el=>imageIns(el,byImg(selected.id)));
  if(selected.type==="annotation")return wrapWithAlign(el=>annotationIns(el,byAnn(selected.id)));
  if(selected.type==="reaction")return wrapWithAlign(el=>reactionIns(el,selected.charId,selected.eventId));
  b.innerHTML="Chọn item.";
}

function levelIns(b){
  const art=data.level.art;
  b.innerHTML=`<div class="group col">
    <div class="row">
      <label style="flex:1">Level ID<input id="lid" value="${esc(data.level.id||"")}" placeholder="VD: L001"></label>
      <label style="flex:1">🟢 Độ khó GD dự định
        <select id="ldiffTarget">
          <option value="">-- Chọn --</option>
          <option value="EASY" ${data.level.difficultyTarget==="EASY"?"selected":""}>DỄ</option>
          <option value="MEDIUM" ${data.level.difficultyTarget==="MEDIUM"?"selected":""}>VỪA</option>
          <option value="HARD" ${data.level.difficultyTarget==="HARD"?"selected":""}>KHÓ</option>
        </select>
      </label>
    </div>
    <div class="small">Chọn độ khó dự định ngay từ đầu để GD thiết kế theo. TEST ĐỘ KHÓ chỉ là bước kiểm tra lại sau Full Play và không tự đổi mục tiêu này.</div>
    <label>🟢 Drama Hook<textarea id="lh" placeholder="Một câu gây tò mò / yêu cầu người chơi khám phá điều gì...">${esc(data.level.hook)}</textarea></label>
    <div class="tokenPreview"><b>Hook preview:</b> <span id="lhp">${esc(resolveTokens(data.level.hook,editNameMap()))}</span></div>
    <div class="small"><b>❤️❤️ 2 mạng cố định toàn game.</b> Chỉ mất 1 mạng khi thả Character vào một slot hợp lệ nhưng sai người; thả hụt ngoài slot không mất mạng. Đây là rule chung, GD không chỉnh theo từng level.</div>
    <label>🟡 Main Reveal<textarea id="lr">${esc(data.level.reveal)}</textarea></label>
    <div class="tokenPreview"><b>Reveal preview:</b> <span id="lrp">${esc(resolveTokens(data.level.reveal,editNameMap()))}</span></div>
    <label>🟡 Main Reveal khi</label><div id="lrw" class="checks">${placementTriggerChecks(data.level.revealWhen)}</div>
    <div class="small">Chỉ chọn <b>Movable (Mxx)</b>, vì Fixed đã có sẵn trên scene và không có placement event.</div>
    <label>🟡 Main Reveal nằm dưới Clue
      <select id="lrparent"><option value="">— Không có parent —</option>${(data.clues||[]).map(cl=>`<option value="${esc(cl.id)}" ${data.level.revealParentClueId===cl.id?"selected":""}>${esc(cl.id)}${cl.text?" · "+esc(cl.text.slice(0,48)):""}</option>`).join("")}</select>
    </label>
    <div class="small">Nếu Reveal là một nhánh/con của clue, chọn parent ở đây. UI Reveal (✓, sáng hơn, chữ lớn/màu khác, không gạch) là rule chung của game.</div>
    <label>🟡 Core Truth / Notes<textarea id="lt">${esc(data.level.truth)}</textarea></label>
    <div class="small">Player-facing text có thể dùng token như <b>{M01}</b>; khi random tên, token tự đổi theo Character ID.</div>
  </div>

  <details class="group prodDetails"><summary>PRODUCTION · BACKGROUND / ART INFO</summary><div class="prodDetailsBody col">
    <div class="row"><label style="width:120px">Version<input id="lver" value="${esc(data.level.version||"1.0")}" placeholder="1.0"></label><div class="spacer"></div><button class="btn" id="addSceneArt">+ Item</button></div>
    <label>🔵 Asset background chính<input id="bgAssetId" value="${esc(art.backgroundAssetId)}" readonly></label>
    <label>🔵 Mô tả background<textarea id="bgDesc">${esc(art.backgroundDescription)}</textarea></label>
    <label>🔵 Tone màu<input id="bgTone" value="${esc(art.tone)}" placeholder="VD: ấm, pastel, cưới ngoài trời..."></label>
    <label>Chỉ dẫn Reference<textarea id="bgRef">${esc(art.referenceNote)}</textarea></label>
    <label>🔵 Note riêng cho Artist<textarea id="bgArtist">${esc(art.artistNote)}</textarea></label>
    <div class="small">Reference Layers trên canvas + Scene PNG sẽ đi cùng Asset Request để Artist nhìn đúng bố cục.</div>
    <div id="sceneArtList">${(art.sceneItems||[]).map((it,i)=>`<div class="sceneArtItem" data-art-item="${it.id}">
      <div class="row" style="justify-content:space-between"><b>ITEM ${i+1}</b><span class="assetId">${esc(it.assetId||"")}</span></div>
      <label>🔵 Tên / phần cần vẽ<input data-art-name="${it.id}" value="${esc(it.name)}" placeholder="VD: bàn tiệc / bục cưới / giỏ hoa"></label>
      <label>🔵 Mô tả<textarea data-art-desc="${it.id}">${esc(it.description)}</textarea></label>
      <label>🔵 Cách xuất<select data-art-mode="${it.id}">
        <option value="BAKED_BG" ${it.exportMode==="BAKED_BG"?"selected":""}>Dính vào BG01</option>
        <option value="SEPARATE" ${it.exportMode==="SEPARATE"?"selected":""}>PNG riêng / Object</option>
        <option value="FOREGROUND" ${it.exportMode==="FOREGROUND"?"selected":""}>Foreground PNG riêng</option>
      </select></label>
      <label>🔵 Asset ID<input data-art-asset="${it.id}" value="${esc(it.assetId||"")}" ${it.exportMode==="BAKED_BG"?"readonly":""}></label>
      <label>🔵 Note Artist<input data-art-note="${it.id}" value="${esc(it.artistNote||"")}"></label>
      <button class="btn danger" data-art-delete="${it.id}">Xóa item</button>
    </div>`).join("")||'<div class="small">Chưa có item background/prop.</div>'}</div>
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
    <label>Mã (ID)<input id="ci" value="${c.id}"></label>
    <label>🟢 Tên tạm trong Edit<input id="cn" value="${esc(c.name)}"></label>
    <label>🟡 Kho tên khi Random
      <select id="cpool"><option value="KEEP">Giữ nguyên tên này</option><option value="MALE">Kho tên Nam</option><option value="FEMALE">Kho tên Nữ</option><option value="NEUTRAL">Kho tên Neutral</option></select>
    </label>
    <label>🟢 Vai trò / note nội bộ<input id="cr" value="${esc(c.role)}"></label>
    <div class="row">
<label style="flex:1">Loại<select id="ct"><option value="M">Movable</option><option value="F">Fixed</option></select></label>
<button class="btn ${c.flipH?'on':''}" id="cflipH" type="button" style="margin-top:18px" title="Lật hướng nhìn">⇄ Lật mặt (Flip)</button>
</div>
    <label>🟢 Ngoại hình / đặc điểm nhận diện<textarea id="ca">${esc(appearanceText(c))}</textarea></label>
    <div class="small">Enter = xuống dòng trong <b>cùng một tag</b>, không tạo tag mới.</div>
    <label>🟢 Biểu cảm ban đầu (START${c.type==="M"?" / Tray":""})<select id="cbaseexp">${emojiOptions(c.baseExpression,false)}</select></label>
    <div class="row"><label style="flex:1">🟢 Hướng mắt ban đầu<select id="cbasegaze">${GAZES.map(g=>`<option value="${g}" ${g===c.baseGaze?"selected":""}>${g==="AUTO"?"AUTO — theo Target":g==="NONE"?"NONE":g+" giờ"}</option>`).join("")}</select></label><label style="flex:1">Target nhìn<select id="cbasetarget">${opts(c.baseTarget,true)}</select></label></div>
    <div class="small"><b>AUTO</b> tự tính hướng từ vị trí Character tới Target. Initial State là information player thấy ngay từ START.</div>
    ${c.type==="M"?`<div class="small">Movable luôn có cả trên Scene và Tray trong Edit. <b>Vị trí trên Scene chính là đáp án.</b></div>`:""}
  </div>

  <div class="group"><div class="head" style="margin:0 0 4px"><b>RELATED · AUTO</b><span class="pill gameplay">${esc(c.id)}</span></div><div class="small">Chỉ để soi nhanh; Tool tự đọc dữ liệu đã có, GD không phải khai thêm.</div><div class="relSection"><small>Clue nhắc Character này</small>${incomingHtml}</div><div class="relSection"><small>Khi placement ${esc(c.id)} tham gia trigger</small>${outgoingHtml}</div></div>

  <details class="group prodDetails"><summary>PRODUCTION · CHARACTER ART</summary><div class="prodDetailsBody col">
    <div class="row"><label style="flex:1">Giới tính<select id="cgender"><option value="UNSPECIFIED">Chưa xác định</option><option value="MALE">Nam</option><option value="FEMALE">Nữ</option><option value="OTHER">Khác</option></select></label><label style="flex:1">Độ tuổi<input id="cage" value="${esc(c.age||"")}" placeholder="VD: 8 tuổi / 20-25 / trung niên"></label></div>
    <label>Base Asset ID<input id="cbaseasset" value="${esc(c.assetBaseId||"")}"></label>
    ${c.type==="M"?`<label>Tray Asset ID<input id="ctrayasset" value="${esc(c.assetTrayId||"")}"></label>`:""}
    <label>Note riêng cho Artist<textarea id="cartnote">${esc(c.artistNote||"")}</textarea></label>
    <div class="assetBox">${visualRows||'<span class="assetMuted">Chưa có asset state.</span>'}</div>
  </div></details>

  <div class="group"><div class="head" style="margin:0 0 6px"><b>Reaction Events</b><button class="btn" id="addEvent">+ Reaction</button></div><div class="timeline">${(c.reactionEvents||[]).map((ev,i)=>`<div class="stateCard" data-event="${ev.id}"><b>EVENT ${i+1} · ${ev.steps.length} step</b><div class="meta">WHEN: ${esc(triggerLabel(c,ev))}</div><div class="rxSeq">${esc(sequencePreview(ev,c.id))}</div></div>`).join("")||'<div class="small">Chưa có reaction.</div>'}</div></div>
  <button class="btn danger" id="cd">Xóa character</button>`;

  $("#ct").value=c.type;$("#cpool").value=c.namePool||"KEEP";$("#cgender").value=c.gender||"UNSPECIFIED";
  $("#ci").onchange=e=>{const old=c.id,n=e.target.value.trim().toUpperCase(),expectedPrefix=c.type;if(!new RegExp("^"+expectedPrefix+"\\d+$").test(n)){toast("Movable chỉ dùng mã Mxx, Fixed chỉ dùng mã Fxx");e.target.value=old;return}if(data.characters.some(x=>x!==c&&x.id===n)){toast("Mã trùng");e.target.value=old;return}c.id=n;remapCharacterAssetPrefix(c,old,n);remapCharacterIdEverywhereInDataset(data,old,n,c.type,c.type);selected.id=n;save();refreshImmediate()};
  $("#cn").oninput=e=>{c.name=e.target.value;save();$$(`[data-char-name="${c.id}"]`).forEach(n=>n.textContent=e.target.value)};$("#cn").onchange=()=>{renderLists();renderClues();renderLive()};
  $("#cpool").onchange=e=>{c.namePool=e.target.value;if(c.gender==="UNSPECIFIED")c.gender=inferGender({...c,gender:""});save();renderInspector()};
  $("#cr").oninput=e=>{c.role=e.target.value;save()};$("#cr").onchange=()=>renderLists();
  if($("#cflipH"))$("#cflipH").onclick=()=>{c.flipH=!c.flipH;save();refreshImmediate();renderInspector()};
$("#ct").onchange=e=>{const result=syncCharacterTypeId(c,e.target.value);selected.id=result.newId;save();refreshImmediate();toast(`${result.oldId} → ${result.newId} · ${c.type==="M"?"Movable":"Fixed"}${result.triggerReview?` · ${result.triggerReview} Reaction cần chọn lại trigger`:""}`)};
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
    <label>Mã clue
      <input value="${c.id}" readonly title="Mã tự đổi theo cấu trúc cha/con">
    </label>
    <div class="small">Mã clue tự cập nhật theo cây. Root = CL01, CL02…; child = CL01.1, CL01.2…</div>

    <label>🟡 Clue mẹ
      <select id="qp">
        <option value="">-- Root / không có mẹ --</option>
        ${parentOptions}
      </select>
    </label>

    ${isRoot
      ? `<div class="small"><b>🟢 Root clue:</b> có sẵn ngay từ START.</div>`
      : `<label>🟡 Trước khi mở<select id="qpre"><option value="LOCKED">Khóa — hiện ô khóa</option><option value="HIDDEN">Ẩn — không hiện gì</option></select></label>`
    }

    <label>🟢 Nội dung<textarea id="qt">${esc(c.text)}</textarea></label>

    <div class="row">
      <select id="tokenChar" style="flex:1">${opts("",true)}</select>
      <button class="btn" id="insertToken" style="white-space:nowrap">🟢 + Tên Character</button>
    </div>
    <button class="btn" id="tokenizeNames">Nhận diện tên tạm → token</button>
    <div class="small">Data lưu dạng <b>{M01}</b>; preview/player sẽ tự đổi thành tên hiện tại.</div>
    <div class="tokenPreview"><b>Preview:</b> <span id="cluePreview">${esc(resolveTokens(c.text,editNameMap()))}</span></div>

    <label>🟢 Clue hoàn tất khi (AND)</label>
    <div id="qrw" class="checks">${placementTriggerChecks(c.resolveWhen)}</div>
    <div class="small">Chỉ chọn <b>Movable (Mxx)</b>. Field này chỉ dùng để <b>tick/mờ clue</b> và mở clue con; không dùng để nói clue đang solve ai.</div>

    <div class="small">Clue con tự mở khi <b>clue mẹ hoàn tất</b>. FLOW tự đọc Parent + “Clue hoàn tất khi”, không cần khai thêm metadata.</div>
    <button class="btn" id="qchild">+ Clue con</button>
    <button class="btn danger" id="qd">Xóa clue</button>
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

    <label>Trigger (WHEN)
      <select id="evTrigger">
        ${c.type==="M"?'<option value="SELF_PLACED">Bản thân được đặt đúng</option>':""}
        <option value="CHAR_PLACED">Một Character khác được đặt đúng</option>
        <option value="ALL_PLACED">Nhiều Character đã được đặt đúng</option>
      </select>
    </label>

    <div id="triggerConfig"></div>

    <div class="small"><b>Reaction mới cắt sequence cũ</b> của cùng Character và chạy ngay.</div>

    <div class="head" style="margin-top:8px"><b>🟢 Sequence</b><button class="btn" id="addStep">+ Step</button></div>
    <div id="stepList"></div>

    <div class="row"><button class="btn" id="evUp">↑ Event</button><button class="btn" id="evDown">↓ Event</button></div>
    <button class="btn danger" id="evDelete">Xóa Reaction Event</button>
    <button class="btn" id="backChar">← Về Character</button>
  </div>`;

  $("#evTrigger").value=ev.triggerType;

  const renderTriggerConfig=()=>{
    const box=$("#triggerConfig");
    if(ev.triggerType==="CHAR_PLACED"){
      box.innerHTML=`<label>🟢 Character gây trigger<select id="evOne">${opts(ev.triggerChars?.[0]||"",true,movableFilter)}</select></label>`;
      $("#evOne").onchange=e=>{ev.triggerChars=e.target.value?[e.target.value]:[];save();renderLists();renderLogic()};
    }else if(ev.triggerType==="ALL_PLACED"){
      box.innerHTML=`<label>🟢 Các Character phải đã đặt đúng</label><div id="evMany" class="checks">${checks(ev.triggerChars||[],movableFilter)}</div>`;
      bindChecks($("#evMany"),a=>{ev.triggerChars=a;save();renderLists();renderLogic()});
    }else{
      box.innerHTML=`<div class="small">Trigger chính là ${c.id} được đặt đúng.</div>`;
    }
  };

  const renderSteps=()=>{
    $("#stepList").innerHTML=ev.steps.map((st,i)=>`<div class="stateCard" style="cursor:default;margin-bottom:7px">
      <div class="row" style="justify-content:space-between"><b>STEP ${i+1}</b></div><div class="meta">${reactionPreview(st,c.id)} · ${esc(gazeClockText(c.id,st))}</div>
      <label>🔵 Asset ID<input data-step-asset="${st.id}" value="${esc(st.assetId||"")}"></label>

      <div class="row">
        <label style="flex:1">🟢 Biểu cảm<select data-step-emotion="${st.id}">${emojiOptions(st.emotion)}</select></label>
        <label style="flex:1">🟢 Biểu tượng<select data-step-symbol="${st.id}">${symbolOptions(st.symbol)}</select></label>
      </div>

      <div class="row">
        <label style="flex:1">🟢 Hướng mắt<select data-step-gaze="${st.id}">${GAZES.map(g=>`<option value="${g}" ${g===st.gaze?"selected":""}>${g==="AUTO"?"AUTO — theo Target":g==="NONE"?"NONE":g+" giờ"}</option>`).join("")}</select></label>
        <label style="flex:1">🟢 Target nhìn<select data-step-target="${st.id}">${opts(st.target,true)}</select></label>
      </div>

      <div class="small"><b>AUTO</b> tự đo vị trí Source → Target và quy về hướng đồng hồ. Có thể chọn 1–12 giờ để override thủ công. Asset Request sẽ ghi hướng đồng hồ đã resolve.</div>

      <div class="row">
        <label style="flex:1">🟢 Thời gian (giây)<input data-step-duration="${st.id}" type="number" min="0.1" step="0.1" value="${st.duration}"></label>
        <label class="check" style="align-self:end;margin-bottom:4px"><input data-step-hold="${st.id}" type="checkbox" ${st.hold?"checked":""}> 🟢 Giữ lại</label>
      </div>

      <div class="row">
        <button class="btn" data-step-up="${st.id}">↑</button>
        <button class="btn" data-step-down="${st.id}">↓</button>
        <button class="btn danger" data-step-delete="${st.id}">Xóa step</button>
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
        if(ev.steps.length<=1){toast("Reaction Event phải có ít nhất 1 Step");return}
        ev.steps=ev.steps.filter(x=>x!==st);save();renderInspector();renderLists();
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
  $("#addStep").onclick=()=>{ev.steps.push(blankReactionStep());ensureCharacterAssetIds(c);save();renderInspector();renderLists()};
  $("#evUp").onclick=()=>{if(idx>0){[c.reactionEvents[idx-1],c.reactionEvents[idx]]=[c.reactionEvents[idx],c.reactionEvents[idx-1]];save();refreshImmediate()}};
  $("#evDown").onclick=()=>{if(idx<c.reactionEvents.length-1){[c.reactionEvents[idx+1],c.reactionEvents[idx]]=[c.reactionEvents[idx],c.reactionEvents[idx+1]];save();refreshImmediate()}};
  $("#evDelete").onclick=()=>{c.reactionEvents=c.reactionEvents.filter(x=>x!==ev);selected={type:"char",id:c.id};save();refreshImmediate()};
  $("#backChar").onclick=()=>{selected={type:"char",id:c.id};refreshImmediate()};
}

function imageIns(b,i){
  if(!i)return;
  b.innerHTML=`<div class="group col">
    <div><b>🟡 REFERENCE LAYER</b></div>
    <label>🟡 Tên layer<input id="in" value="${esc(i.name)}"></label>
    <div class="row"><label>🟡 X<input id="ix" type="number" value="${Math.round(i.x)}"></label><label>🟡 Y<input id="iy" type="number" value="${Math.round(i.y)}"></label></div>
    <div class="row"><label>🟡 W<input id="iw" type="number" value="${Math.round(i.w)}"></label><label>🟡 H<input id="ih" type="number" value="${Math.round(i.h)}"></label></div>
    
    <div class="head" style="margin-top:6px"><b>TRANSFORM & CÔNG CỤ</b></div>
    <div class="row">
      <button class="btn ${i.flipH?'on':''}" id="flipHImg" type="button" title="Lật đối xứng ngang (tâm ở giữa)">⇄ Flip H</button>
      <button class="btn ${i.flipV?'on':''}" id="flipVImg" type="button" title="Lật đối xứng dọc (tâm ở giữa)">⇅ Flip V</button>
      <button class="btn" id="rotResetImg" type="button" title="Góc 0°">0°</button>
      <button class="btn" id="centerCanvasImg" type="button" title="Căn giữa màn hình Canvas">Căn giữa</button>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn ${wrapBoundaryEnabled?'on':''}" id="toggleWrapBtn" type="button" style="width:100%" title="Tự động chuyển ảnh sang phía đối diện khi bị kéo khuất quá 60% biên Artboard">
        Cuộn viền Artboard (Wrap 60%): ${wrapBoundaryEnabled ? 'BẬT' : 'TẮT'}
      </button>
    </div>
    <div class="row" style="margin-top:4px">
      <label style="flex:1">Xoay (°)<input id="irot" type="number" min="0" max="360" value="${i.rotation||0}"></label>
      <button class="btn" id="rot90Img" type="button" style="margin-top:18px">+90°</button>
    </div>
    
    <label style="margin-top:4px">Độ mờ Opacity: <b id="iopText">${i.opacity!==undefined?i.opacity:100}%</b>
      <input id="iop" type="range" min="10" max="100" value="${i.opacity!==undefined?i.opacity:100}">
    </label>

    <div class="head" style="margin-top:6px"><b>HIỆU ỨNG & BỘ LỌC (FILTERS)</b></div>
    <div class="row">
      <label style="flex:1">Hòa trộn (Blend)
        <select id="iblend">
          <option value="normal" ${(!i.blendMode||i.blendMode==='normal')?'selected':''}>Normal</option>
          <option value="multiply" ${i.blendMode==='multiply'?'selected':''}>Multiply (Nhân tối)</option>
          <option value="screen" ${i.blendMode==='screen'?'selected':''}>Screen (Làm sáng)</option>
          <option value="overlay" ${i.blendMode==='overlay'?'selected':''}>Overlay (Phủ)</option>
          <option value="darken" ${i.blendMode==='darken'?'selected':''}>Darken</option>
          <option value="lighten" ${i.blendMode==='lighten'?'selected':''}>Lighten</option>
          <option value="color-dodge" ${i.blendMode==='color-dodge'?'selected':''}>Color Dodge</option>
          <option value="difference" ${i.blendMode==='difference'?'selected':''}>Difference (Đảo tương phản)</option>
        </select>
      </label>
      <label style="flex:1">Bóng đổ (Shadow)
        <select id="ishadow">
          <option value="none" ${(!i.shadow||i.shadow==='none')?'selected':''}>Không bóng</option>
          <option value="soft" ${i.shadow==='soft'?'selected':''}>Bóng đổ mềm</option>
          <option value="hard" ${i.shadow==='hard'?'selected':''}>Bóng khối sắc</option>
          <option value="glow" ${i.shadow==='glow'?'selected':''}>Neon Glow</option>
        </select>
      </label>
    </div>

    <label style="margin-top:4px">Bo góc Radius: <b id="iradText">${i.radius||0}px</b>
      <input id="irad" type="range" min="0" max="60" value="${i.radius||0}">
    </label>

    <label style="margin-top:4px">Độ sáng (Brightness): <b id="ibrightText">${i.brightness!==undefined?i.brightness:100}%</b>
      <input id="ibright" type="range" min="50" max="150" value="${i.brightness!==undefined?i.brightness:100}">
    </label>

    <label style="margin-top:4px">Tương phản (Contrast): <b id="icontrastText">${i.contrast!==undefined?i.contrast:100}%</b>
      <input id="icontrast" type="range" min="50" max="150" value="${i.contrast!==undefined?i.contrast:100}">
    </label>

    <label style="margin-top:4px">Bão hòa màu (Saturation): <b id="isatText">${i.saturate!==undefined?i.saturate:100}%</b>
      <input id="isat" type="range" min="0" max="200" value="${i.saturate!==undefined?i.saturate:100}">
    </label>

    <label style="margin-top:4px">Làm mờ (Blur): <b id="iblurText">${i.blur||0}px</b>
      <input id="iblur" type="range" min="0" max="15" value="${i.blur||0}">
    </label>

    <div class="row" style="margin-top:6px">
      <button class="btn smBtn ${i.grayscale===100?'on':''}" id="filterBwBtn" type="button">Đen trắng</button>
      <button class="btn smBtn ${i.sepia===100?'on':''}" id="filterSepiaBtn" type="button">Sepia</button>
      <button class="btn smBtn ${i.invert===100?'on':''}" id="filterInvertBtn" type="button">Invert</button>
      <button class="btn smBtn danger" id="resetFiltersBtn" type="button">Reset</button>
    </div>

    <div class="head" style="margin-top:8px"><b>Thao tác lớp</b></div>
    <label class="row"><input id="il" type="checkbox" style="width:auto" ${i.locked?"checked":""}> Lock</label>
    <div class="row"><button class="btn" id="dupImg" type="button">Duplicate</button><button class="btn" id="imgFront" type="button">Front</button><button class="btn" id="imgBack" type="button">Back</button></div>
    <div class="row"><button class="btn" id="imgForward" type="button">Forward</button><button class="btn" id="imgBackward" type="button">Backward</button></div>
    <div class="small">Ảnh và shape/text dùng chung thứ tự layer.</div>
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
    save();refreshImmediate();renderInspector();toast("Đã căn giữa Canvas 1080x1610");
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
    save();refreshImmediate();renderInspector();toast("Đã reset bộ lọc ảnh");
  };

  $("#dupImg").onclick=()=>duplicateImage(i);
  $("#imgFront").onclick=()=>{moveSceneLayer("image",i,"front");save();refreshImmediate()};
  $("#imgBack").onclick=()=>{moveSceneLayer("image",i,"back");save();refreshImmediate()};
  $("#imgForward").onclick=()=>{moveSceneLayer("image",i,"forward");save();refreshImmediate()};
  $("#imgBackward").onclick=()=>{moveSceneLayer("image",i,"backward");save();refreshImmediate()};
}

function annotationIns(b,a){
  if(!a)return;
  const isText=a.type==="text";
  const isArrow=a.type==="arrow";
  const typeName={rect:"RECTANGLE (FIGMA)",circle:"CIRCLE (FIGMA)",triangle:"TRIANGLE (FIGMA)",star:"STAR 5-POINT (FIGMA)",polygon:"POLYGON 6-SIDE (FIGMA)",line:"LINE VECTOR (FIGMA)",arrow:"ARROW",text:"TEXT NOTE"}[a.type]||a.type.toUpperCase();

  b.innerHTML=`<div class="group col">
    <div><b style="font-size:11px">🟡 ${typeName}</b></div>

    ${isText
      ? `<label>🟡 Nội dung<textarea id="anText">${esc(a.text)}</textarea></label>`
      : `<label>Chữ trong hình (tùy chọn)<textarea id="anText" placeholder="Để trống nếu không cần chữ">${esc(a.text||"")}</textarea></label>`
    }
    <label>🟡 Font size<input id="anFont" type="number" min="8" max="160" value="${a.fontSize}"></label>

    ${isText
      ? `<label>🟡 Màu chữ<input id="anTextColor" type="color" value="${a.stroke}"></label>`
      : `<label>🟡 Màu chữ<input id="anTextColor" type="color" value="${a.textColor}"></label>`
    }

    ${!isText&&!isArrow?`<label>🟡 Fill<input id="anFill" type="color" value="${a.fill}"></label>`:""}
    ${!isText?`<label>🟡 ${isArrow?"Màu mũi tên":"Stroke"}<input id="anStroke" type="color" value="${a.stroke}"></label>
    ${!isText&&!isArrow?`
      <label>Độ dày viền (Stroke Width)<input id="anStrokeWidth" type="number" min="1" max="20" value="${a.strokeWidth||3}"></label>
      <label>Kiểu viền (Stroke Style)
        <select id="anStrokeStyle">
          <option value="solid" ${(a.strokeStyle||'solid')==='solid'?'selected':''}>Nét liền (Solid)</option>
          <option value="dashed" ${a.strokeStyle==='dashed'?'selected':''}>Nét đứt (Dashed)</option>
          <option value="dotted" ${a.strokeStyle==='dotted'?'selected':''}>Chấm bi (Dotted)</option>
        </select>
      </label>
      ${a.type==='rect'?`<label>Bo góc (Corner Radius: <span id="anRadiusVal">${a.radius||0}px</span>)<input id="anRadius" type="range" min="0" max="60" value="${a.radius||0}"></label>`:''}
    `:''}`:""}
    ${isArrow?`<label>🟡 Độ dày<input id="anStrokeWidth" type="number" min="1" max="20" value="${a.strokeWidth}"></label>
    <label>Hướng mũi tên</label>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:6px;">
      <button class="btn ${a.arrowXDir===1&&a.arrowYDir===0?'active':''}" id="dirR" type="button" title="Sang phải">➡ Phải</button>
      <button class="btn ${a.arrowXDir===-1&&a.arrowYDir===0?'active':''}" id="dirL" type="button" title="Sang trái">⬅ Trái</button>
      <button class="btn ${a.arrowXDir===0&&a.arrowYDir===1?'active':''}" id="dirD" type="button" title="Xuống dưới">⬇ Xuống</button>
      <button class="btn ${a.arrowXDir===0&&a.arrowYDir===-1?'active':''}" id="dirU" type="button" title="Lên trên">⬆ Lên</button>
      <button class="btn ${a.arrowXDir===1&&a.arrowYDir===1?'active':''}" id="dirDR" type="button" title="Chéo xuống-phải">↘ X.Phải</button>
      <button class="btn ${a.arrowXDir===-1&&a.arrowYDir===1?'active':''}" id="dirDL" type="button" title="Chéo xuống-trái">↙ X.Trái</button>
      <button class="btn ${a.arrowXDir===1&&a.arrowYDir===-1?'active':''}" id="dirUR" type="button" title="Chéo lên-phải">↗ L.Phải</button>
      <button class="btn ${a.arrowXDir===-1&&a.arrowYDir===-1?'active':''}" id="dirUL" type="button" title="Chéo lên-trái">↖ L.Trái</button>
    </div>
    <button class="btn" id="anFlipArrow" type="button" style="margin-bottom:8px">⇄ Đảo ngược hướng (180°)</button>`:""}

    <div class="row"><label>🟡 X<input id="anX" type="number" value="${Math.round(a.x)}"></label><label>🟡 Y<input id="anY" type="number" value="${Math.round(a.y)}"></label></div>
    <div class="row"><label>🟡 W<input id="anW" type="number" value="${Math.round(a.w)}"></label><label>🟡 H<input id="anH" type="number" value="${Math.round(a.h)}"></label></div>

    <label class="row"><input id="anLock" type="checkbox" style="width:auto" ${a.locked?"checked":""}> Lock</label>
    <label class="row"><input id="anShowPlay" type="checkbox" style="width:auto" ${a.visibleInPlay?"checked":""}> Hiện trong Play</label>

    <div class="row">
      <button class="btn" id="anDup">Duplicate</button>
      <button class="btn" id="anFront">Front</button>
      <button class="btn" id="anBack">Back</button>
    </div>
    <div class="row">
      <button class="btn" id="anForward">Forward</button>
      <button class="btn" id="anBackward">Backward</button>
    </div>

    <div class="small">Shape / arrow có thể cho hiện trong Play. Text note riêng cũng có tùy chọn hiện hoặc ẩn trong Play. Double click shape để gõ chữ trực tiếp.</div>
    <button class="btn danger" id="anDelete">Xóa</button>
  </div>`;

  $("#anText").oninput=e=>{
    a.text=e.target.value;save();
    const n=document.querySelector(`[data-annotation-id="${a.id}"] ${isText?".noteText":".shapeLabel"}`);
    if(n){
      n.textContent=a.text;
      if(isArrow){
        n.style.display=a.text?"block":"none";
      }
    }
  };
  $("#anFont").oninput=e=>{a.fontSize=Math.max(8,+e.target.value||28);save();refreshImmediate()};
  $("#anTextColor").oninput=e=>{
    if(isText)a.stroke=e.target.value;else a.textColor=e.target.value;
    save();refreshImmediate();
  };
  if($("#anFill"))$("#anFill").oninput=e=>{a.fill=e.target.value;save();refreshImmediate()};
  if($("#anStroke"))$("#anStroke").oninput=e=>{a.stroke=e.target.value;save();refreshImmediate()};
  if($("#anStrokeWidth"))$("#anStrokeWidth").oninput=e=>{a.strokeWidth=Math.max(1,+e.target.value||4);save();refreshImmediate()};
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
  ["anX","anY","anW","anH"].forEach(id=>$("#"+id).onchange=geom);

  $("#anLock").onchange=e=>{a.locked=e.target.checked;save();refreshImmediate()};
  $("#anShowPlay").onchange=e=>{a.visibleInPlay=e.target.checked;save();refreshImmediate()};
  $("#anDup").onclick=()=>duplicateAnnotation(a);
  $("#anFront").onclick=()=>{moveSceneLayer("annotation",a,"front");save();refreshImmediate()};
  $("#anBack").onclick=()=>{moveSceneLayer("annotation",a,"back");save();refreshImmediate()};
  $("#anForward").onclick=()=>{moveSceneLayer("annotation",a,"forward");save();refreshImmediate()};
  $("#anBackward").onclick=()=>{moveSceneLayer("annotation",a,"backward");save();refreshImmediate()};
  $("#anDelete").onclick=()=>{data.annotations=data.annotations.filter(x=>x!==a);normalizeSceneZData();multiSel.delete("annotation:"+a.id);selected={type:"level",id:"level"};save();refreshImmediate()};
}

function setTool(tool){
  activeTool=tool;
  $$(".toolBtn").forEach(b=>b.classList.toggle("active",b.dataset.tool===tool));
  $("#stage").style.cursor=tool==="select"?"default":(tool==="text"?"text":"crosshair");
}
$$(".toolBtn").forEach(b=>b.onclick=()=>setTool(b.dataset.tool));

function createAnnotation(type,x,y,w,h,extra={}){
  const a={
    id:uid("AN_"),type,x,y,
    w:Math.max(type==="text"?120:(type==="line"?60:40),w),h:Math.max(type==="text"?40:(type==="line"?10:40),h),
    fill:type==="line"?"transparent":"#f4f1f6",stroke:"#655d69",text:type==="text"?"Note":"",
    textColor:"#514953",fontSize:28,strokeWidth:4,radius:0,strokeStyle:"solid",
    arrowXDir:extra.arrowXDir||1,arrowYDir:extra.arrowYDir||1,
    locked:false,visibleInPlay:(type==="text"?false:true),z:10+sceneLayerItems().length
  };
  data.annotations.push(a);normalizeSceneZData();
  multiSel.clear();multiSel.add("annotation:"+a.id);selected={type:"annotation",id:a.id};
  save();setTool("select");refreshImmediate();return a;
}
function duplicateAnnotation(a){
  const copy={...deep(a),id:uid("AN_"),x:a.x+28,y:a.y+28,locked:false,visibleInPlay:!!a.visibleInPlay,z:10+sceneLayerItems().length};
  data.annotations.push(copy);normalizeSceneZData();
  multiSel.clear();multiSel.add("annotation:"+copy.id);selected={type:"annotation",id:copy.id};
  save();refreshImmediate();toast("Đã duplicate shape/text");
}
function moveAnnotation(e,a,el){
  if(activeTool!=="select"||a.locked)return;
  const key="annotation:"+a.id;
  if(e.shiftKey){e.preventDefault();e.stopPropagation();if(multiSel.has(key))multiSel.delete(key);else multiSel.add(key);selected={type:"annotation",id:a.id};refreshImmediate();return}
  if(!multiSel.has(key)){multiSel.clear();multiSel.add(key)}
  selected={type:"annotation",id:a.id};
  if(multiSel.size>1)return moveSelectionGroup(e,key);
  e.preventDefault();e.stopPropagation();const p=logical(e),sx=a.x,sy=a.y;
  const mv=ev=>{const q=logical(ev);a.x=sx+q.x-p.x;a.y=sy+q.y-p.y;el.style.left=(a.x/1080*100)+"%";el.style.top=(a.y/1610*100)+"%"};
  const up=()=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);save();refreshImmediate()};
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}
function resizeAnnotation(e,a,el){
  e.preventDefault();e.stopPropagation();const p=logical(e),sw=a.w,sh=a.h;
  const mv=ev=>{const q=logical(ev);a.w=Math.max(20,sw+q.x-p.x);a.h=Math.max(20,sh+q.y-p.y);el.style.width=(a.w/1080*100)+"%";el.style.height=(a.h/1610*100)+"%"};
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

  // Keep object relationships before changing IDs.
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

  // Refresh parent IDs after every clue has its new ID.
  data.clues.forEach(c=>{
    const p=parentObj.get(c);
    c.parent=p?p.id:null;
  });

  // selected clue follows the same object if possible
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
  // Render ngay để UI chắc chắn đang ở EDIT trước khi xử lý ảnh async.
  renderLive();
}

function forcePaintReference(){
  // Một số preview/webview chỉ repaint ảnh data URL sau interaction tiếp theo.
  // Ép 2 frame + 1 tick repaint để ảnh xuất hiện ngay trong EDIT.
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

  // Cách mới: KHÔNG chờ FileReader rồi mới vẽ.
  // Tạo blob URL và add layer vào model ngay lập tức để ảnh hiện ngay trong EDIT.
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

  // Render đúng layer mới ngay, tránh chờ full rerender.
  multiSel.clear();multiSel.add("image:"+obj.id);
  const st=$("#stage");
  st.appendChild(createImageLayer(obj));
  renderLists();renderInspector();renderLogic();
  void st.offsetHeight;
  toast("Đã thêm ảnh vào EDIT Canvas");

  // Khi biết kích thước thật thì fit lại, nhưng không đổi mode.
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

  // Sau đó mới convert sang data URL để Save/Export được.
  const rd=new FileReader();
  rd.onload=()=>{
    obj.src=rd.result;
    delete obj._blob;
    save();

    // Chỉ thay src của đúng ảnh hiện tại, KHÔNG render lại cả app.
    const imgEl=document.querySelector(`.imgLayer[data-img-id="${obj.id}"] img`);
    if(imgEl) imgEl.src=obj.src;

    URL.revokeObjectURL(blobUrl);
  };
  rd.onerror=()=>{
    // Ảnh vẫn đang hiện bằng blob URL; chỉ cảnh báo việc lưu.
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
  // Paste trong ENDING là dữ liệu của Ending Image / text field, tuyệt đối không tạo Reference Layer trên scene.
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
  const type=activeTool;if(!["rect","circle","triangle","star","polygon","line","arrow","text"].includes(type))return;
  e.preventDefault();e.stopPropagation();
  const st=$("#stage"),start=logical(e),rect=st.getBoundingClientRect();
  if(type==="text"){
    createAnnotation("text",start.x,start.y,260,70);
    return;
  }
  const ghost=document.createElement("div");ghost.className="drawGhost";st.appendChild(ghost);
  let last={x:start.x,y:start.y};
  const mv=ev=>{
    last=logical(ev);const x=Math.min(start.x,last.x),y=Math.min(start.y,last.y),w=Math.abs(last.x-start.x),h=Math.abs(last.y-start.y);
    ghost.style.left=(x/1080*100)+"%";ghost.style.top=(y/1610*100)+"%";ghost.style.width=(w/1080*100)+"%";ghost.style.height=(h/1610*100)+"%";
  };
  const up=()=>{
    window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);ghost.remove();
    const dx=last.x-start.x, dy=last.y-start.y;
    const absX=Math.abs(dx), absY=Math.abs(dy);
    const x=Math.min(start.x,last.x), y=Math.min(start.y,last.y);
    const w=Math.max(type==="arrow"?(absX<20?40:60):60, absX);
    const h=Math.max(type==="arrow"?(absY<20?40:30):60, absY);
    let extra={};
    if(type==="arrow"){
      let xdir=1, ydir=1;
      if(absY<20 && absX>=25){
        xdir=dx>=0?1:-1; ydir=0;
      }else if(absX<20 && absY>=25){
        xdir=0; ydir=dy>=0?1:-1;
      }else{
        xdir=dx>=0?1:-1; ydir=dy>=0?1:-1;
      }
      extra={arrowXDir:xdir, arrowYDir:ydir};
    }
    createAnnotation(type,x,y,w,h,extra);
  };
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);
}

function startMarquee(e){
  if(mode!=="edit"||e.button!==0)return;
  if(e.target.closest(".char,.imgLayer,.resize,.noteObj,.noteResize"))return;
  if(activeTool!=="select")return startDrawTool(e);
  const st=$("#stage"),rect=st.getBoundingClientRect();
  const sx=e.clientX-rect.left,sy=e.clientY-rect.top;
  let moved=false;
  const m=document.createElement("div");m.className="marquee";m.style.left=sx+"px";m.style.top=sy+"px";m.style.width="0px";m.style.height="0px";st.appendChild(m);

  const mv=ev=>{
    moved=true;
    const x=Math.max(0,Math.min(rect.width,ev.clientX-rect.left)),y=Math.max(0,Math.min(rect.height,ev.clientY-rect.top));
    const l=Math.min(sx,x),t=Math.min(sy,y),w=Math.abs(x-sx),h=Math.abs(y-sy);
    m.style.left=l+"px";m.style.top=t+"px";m.style.width=w+"px";m.style.height=h+"px";
  };
  const up=ev=>{
    window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);
    const x=Math.max(0,Math.min(rect.width,ev.clientX-rect.left)),y=Math.max(0,Math.min(rect.height,ev.clientY-rect.top));
    const l=Math.min(sx,x),t=Math.min(sy,y),r=Math.max(sx,x),b=Math.max(sy,y);
    m.remove();
    if(!e.shiftKey)multiSel.clear();
    if(moved&&Math.abs(x-sx)>4&&Math.abs(y-sy)>4){
      data.characters.forEach(c=>{
        const cx=c.x/1080*rect.width,cy=c.y/1610*rect.height;
        if(cx>=l&&cx<=r&&cy>=t&&cy<=b)multiSel.add("char:"+c.id);
      });
      data.images.forEach(i=>{
        const cx=(i.x+i.w/2)/1080*rect.width,cy=(i.y+i.h/2)/1610*rect.height;
        if(cx>=l&&cx<=r&&cy>=t&&cy<=b)multiSel.add("image:"+i.id);
      });
      data.annotations.forEach(a=>{
        const cx=(a.x+a.w/2)/1080*rect.width,cy=(a.y+a.h/2)/1610*rect.height;
        if(cx>=l&&cx<=r&&cy>=t&&cy<=b)multiSel.add("annotation:"+a.id);
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
  if(e.key==="Escape"&&mode==="edit"){
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
function freshPlay(nameMap,namesRandomized=false,nameGeneration=0){
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
    nameGeneration:Number(nameGeneration)||0
  };
  data.clues.forEach(c=>play.state[c.id]={active:!c.parent,done:false});
  evalRun(null,true);
  savePlayProgress();
}

function startPlay(){
  mode="play";
  playSession++;

  // Reset zoom & pan to ensure stage is 100% visible and centered
  canvasZoom = 1.0;
  canvasPan = {x: 0, y: 0};
  if(typeof applyZoomPan === 'function'){
    applyZoomPan();
  }

  // If there is an unfinished Play session, simply resume it.
  if(!play){
    freshPlay(editNameMap(),false,0);
  }else{
    savePlayProgress();
  }
  refreshImmediate();
}
function stopPlay(){
  // Pause Play; do NOT destroy progress.
  // Incrementing playSession cancels any pending timed reaction callbacks,
  // while the current visible reaction state itself is kept.
  playSession++;
  savePlayProgress();
  mode="edit";
  refreshImmediate();
}
function replaySameNames(){
  const sameMap=play?.nameMap?{...play.nameMap}:editNameMap();
  const randomized=!!play?.namesRandomized;
  const generation=Number(play?.nameGeneration)||0;
  mode="play";
  freshPlay(sameMap,randomized,generation);
  refreshImmediate();
  toast("Chơi lại từ đầu · giữ nguyên tên");
}
function replayShuffleNames(){
  const nextGeneration=(Number(play?.nameGeneration)||0)+1;
  mode="play";
  freshPlay(buildPlayNameMap(true),true,nextGeneration);
  refreshImmediate();
  toast("Chơi lại từ đầu · đã đảo tên");
}
$("#playBtn").onclick=startPlay;
$("#editBtn").onclick=stopPlay;
$("#replayBtn").onclick=replaySameNames;
$("#shuffleReplayBtn").onclick=replayShuffleNames;

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
  return `<div class="flowSection"><h4>START · Information có sẵn</h4><div class="flowGrid">${rootHtml}</div><div class="small" style="margin-top:7px">Initial expression / gaze và visual trên Scene cũng có sẵn từ START; FLOW không bắt GD khai metadata “giúp solve ai”.</div></div><div class="flowSection"><h4>Clue mở theo Parent</h4><div class="flowGrid">${childHtml}</div></div><div class="flowSection"><h4>Reaction Trigger</h4><div class="flowGrid">${rx.join("")||'<div class="small">Không có Reaction Event.</div>'}</div></div><div class="flowSection"><h4>Main Reveal</h4><div class="flowGrid">${reveal}</div></div><div class="flowSection"><h4>Completion</h4><div class="flowCard"><span class="flowTag start">WIN</span><b>Tất cả Movable đúng</b><div class="meta">${esc(movable.join(" + ")||"Chưa có Movable")}</div></div></div><div class="sgGraphHint"><b>FLOW chỉ thể hiện state/trigger mà Tool biết chắc.</b> Nó không kết luận player đã đủ evidence hay level khó/dễ. Dùng Play + Proof / Swap / Remove để kiểm suy luận.</div>`;
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
  $("#endingPreviewImage").innerHTML=e.imageSrc?`<img src="${esc(e.imageSrc)}" alt="Ending preview">`:'<div class="endImagePlaceholder">ENDING IMAGE<br>4:3 HORIZONTAL</div>';
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
  if(!file||!file.type.startsWith("image/"))return;
  const r=new FileReader();
  r.onload=()=>{
    data.level.ending.imageSrc=r.result;
    const persisted=save();
    renderEndingTab();
    toast(persisted===false?"Đã gắn Ending Image · nhớ bấm Lưu project":"Đã gắn + lưu Ending Image vào project data");
  };
  r.onerror=()=>toast("Không đọc được Ending Image");
  r.readAsDataURL(file);
}
$("#endingImageFile").onchange=e=>setEndingImageFile(e.target.files?.[0]);
$("#endingImagePaste").addEventListener("paste",e=>{
  const item=[...(e.clipboardData?.items||[])].find(x=>x.type?.startsWith("image/"));
  if(!item)return;
  e.preventDefault();
  e.stopPropagation();
  setEndingImageFile(item.getAsFile());
});
$("#clearEndingImage").onclick=()=>{data.level.ending.imageSrc="";save();renderEndingTab()};
async function exportEndingPng(){
  const e=data.level.ending;if(!e.imageSrc){toast("Chưa có Ending Image");return}const blob=await (await fetch(e.imageSrc)).blob();const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${e.imageAssetId||"ENDING01"}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("Đã xuất Ending PNG");
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
  rows.push({assetId:ending.imageAssetId||"ENDING01",file:`Ending/${ending.imageAssetId||"ENDING01"}.png`,group:"ENDING",character:"",gender:"",age:"",state:"ENDING",expressionEmoji:"",expressionName:"",symbol:"",target:"",gaze:"",description:ending.imageBrief||"",artistNote:"",tone:"",exportMode:"ENDING 4:3",reference:""});
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
  // V1.27 DEV JSON: chỉ giữ dữ liệu runtime thật sự cần.
  // Art Request mô tả asset; Dev JSON chỉ reference Asset ID + logic khi nào dùng asset đó.
  const roundPos=v=>Math.round((Number(v)||0)*1000)/1000;
  const levelNumber=(()=>{const m=String(data.level.id||"").match(/(\d+)/);return m?Number(m[1]):null})();

  const chars=sortedCharacters().map(c=>{
    ensureCharacterAssetIds(c);
    const baseAssetId=runtimeBaseAssetId(c);
    const events=(c.reactionEvents||[]).map(ev=>{
      const whenPlaced=runtimeWhenPlaced(c,ev);
      const sourceSteps=(ev.steps||[]);
      const steps=sourceSteps.map(st=>({assetId:st.assetId,duration:Number(st.duration)||0.6}));
      const last=sourceSteps[sourceSteps.length-1];
      // Runtime mới: step cuối tự giữ. Nếu authoring cũ đặt hold=false, thêm BASE làm step cuối.
      if(last && !last.hold && steps[steps.length-1]?.assetId!==baseAssetId)steps.push({assetId:baseAssetId});
      return {whenPlaced,steps};
    });
    return {
      id:c.id,
      type:c.type==="M"?"MOVABLE":"FIXED",
      namePool:c.namePool||"KEEP",
      ...((c.namePool||"KEEP")==="KEEP"?{fixedName:c.name||c.id}:{}),
      ...(c.type==="M"?{correctPosition:{x:roundPos(c.x),y:roundPos(c.y)}}:{position:{x:roundPos(c.x),y:roundPos(c.y)}}),
      assets:{
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
    schemaVersion:"drama-level-runtime-2.2",
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

  // Player-facing text phải dùng token nếu character có random name pool.
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
  const status=e.length?"CÒN LỖI":w.length?"PASS · CÓ WARNING":"PASS";
  const statusClass=e.length?"err":w.length?"warn":"ok";
  $("#checkLevelBody").innerHTML=`<div class="checkSummary"><span class="checkChip ${statusClass}">${production?"PRODUCTION CHECK":"DESIGN CHECK"} · ${status}</span><span class="checkChip err">${e.length} lỗi</span><span class="checkChip warn">${w.length} warning</span></div>
  <div class="checkSection"><h4>Lỗi Tool biết chắc</h4>${e.length?e.map(x=>checkItemHtml(x,"err")).join(""):'<div class="checkEmpty">✓ Không có lỗi blocking.</div>'}</div>
  <div class="checkSection"><h4>Warning để GD review</h4>${w.length?w.map(x=>checkItemHtml(x,"warn")).join(""):'<div class="checkEmpty">✓ Không có warning.</div>'}</div>
  <div class="checkFoot">CHECK chỉ bắt lỗi data/reference mà Tool biết chắc. <b>PASS không có nghĩa level đã hay, đủ evidence hay đúng độ khó.</b>${production?" Production Check mới kiểm thêm Asset / Ending / handoff.":""}</div>`;
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
    ["SCENE LAYOUT + ENDING IMAGE"],
    ["GD: Dán cả 2 ảnh vào tab này trước khi gửi Asset Request cho Artist: (1) Scene Layout PNG và (2) Ending Image PNG."],
    [""],
    ["Level ID",data.level.id||""],
    ["Version",data.level.version||"1.0"],
    ["Folder asset",data.level.id||""],
    ["SCENE LAYOUT — File cần dán",sceneFile],
    ["Kích thước chuẩn","1080 × 1610"],
    ["Ghi chú","Ảnh Scene Layout để Artist nhìn đúng bố cục, vị trí nhân vật, object, foreground và các note trên scene."],
    [""],
    ["DÁN ẢNH SCENE LAYOUT PNG VÀO KHU VỰC BÊN DƯỚI"],
    [""],
    [""],
    [""],
    ["ENDING IMAGE"],
    ["GD: Dán ảnh ending đã gen/import trong tab ENDING vào đây để Artist/Dev nhìn đúng hình recap cuối màn."],
    ["ENDING — File cần dán",endingFile],
    ["Tỷ lệ chuẩn","4:3 ngang"],
    ["Ghi chú","Ảnh recap drama cuối màn. Đây là ảnh dùng trong popup DRAMA SOLVED!, không phải ảnh Scene Layout."],
    [""],
    ["DÁN ENDING IMAGE PNG VÀO KHU VỰC BÊN DƯỚI"]
  ];
  const files={
    "[Content_Types].xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="ASSET REQUEST" sheetId="1" r:id="rId1"/><sheet name="SCENE + ENDING" sheetId="2" r:id="rId2"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml":`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
    "xl/worksheets/sheet1.xml":makeXlsxSheet(assetRows,[16,31,15,12,24,11,11,15,10,24,10,12,12,34,34,22,18,34]),
    "xl/worksheets/sheet2.xml":makeXlsxSheet(sceneRows,[32,84],["A1:B1","A2:B2","A11:B11","A15:B15","A16:B16","A21:B21"])
  };
  const blob=new Blob([zipStore(files)],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${base}_ASSET_REQUEST.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast("Đã xuất Asset Request XLSX · tab 2 có Scene Layout + Ending Image");
}
function loadCanvasImage(src){return new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src})}
function canvasText(ctx,text,x,y,maxWidth,lineHeight){
  const words=String(text||"").split(/\s+/);let line="",yy=y;
  words.forEach(w=>{const t=line?line+" "+w:w;if(ctx.measureText(t).width>maxWidth&&line){ctx.fillText(line,x,yy);line=w;yy+=lineHeight}else line=t});if(line)ctx.fillText(line,x,yy);return yy;
}
async function exportScenePng(){
  const canvas=document.createElement("canvas");canvas.width=1080;canvas.height=1610;const ctx=canvas.getContext("2d");ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
  const layers=sceneLayerItems().sort((a,b)=>(Number(a.obj.z)||0)-(Number(b.obj.z)||0));
  for(const layer of layers){
    const o=layer.obj;
    if(layer.type==="image"){
      const im=await loadCanvasImage(o.src);if(im)ctx.drawImage(im,o.x,o.y,o.w,o.h);
    }else{
      ctx.save();ctx.lineWidth=o.strokeWidth||4;ctx.strokeStyle=o.stroke||"#655d69";ctx.fillStyle=o.fill||"#f4f1f6";
      if(o.type==="rect"){ctx.fillRect(o.x,o.y,o.w,o.h);ctx.strokeRect(o.x,o.y,o.w,o.h)}
      else if(o.type==="circle"){ctx.beginPath();ctx.ellipse(o.x+o.w/2,o.y+o.h/2,o.w/2,o.h/2,0,0,Math.PI*2);ctx.fill();ctx.stroke()}
      else if(o.type==="triangle"){ctx.beginPath();ctx.moveTo(o.x+o.w/2,o.y);ctx.lineTo(o.x+o.w,o.y+o.h);ctx.lineTo(o.x,o.y+o.h);ctx.closePath();ctx.fillStyle=o.fill;ctx.fill();if(o.stroke){ctx.strokeStyle=o.stroke;ctx.lineWidth=o.strokeWidth||3;ctx.lineJoin="round";ctx.stroke();}ctx.stroke()}
      else if(o.type==="arrow"){
        const pad=8;
        const x1=o.arrowXDir===0?o.x+o.w/2:(o.arrowXDir===1?o.x+pad:o.x+o.w-pad);
        const x2=o.arrowXDir===0?o.x+o.w/2:(o.arrowXDir===1?o.x+o.w-pad:o.x+pad);
        const y1=o.arrowYDir===0?o.y+o.h/2:(o.arrowYDir===1?o.y+pad:o.y+o.h-pad);
        const y2=o.arrowYDir===0?o.y+o.h/2:(o.arrowYDir===1?o.y+o.h-pad:o.y+pad);
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
        const a=Math.atan2(y2-y1,x2-x1);
        ctx.beginPath();ctx.moveTo(x2,y2);
        ctx.lineTo(x2-22*Math.cos(a-.45),y2-22*Math.sin(a-.45));
        ctx.lineTo(x2-22*Math.cos(a+.45),y2-22*Math.sin(a+.45));
        ctx.closePath();ctx.fillStyle=o.stroke||"#655d69";ctx.fill();
      }
      if(o.text){ctx.fillStyle=o.textColor||"#514953";ctx.font=`700 ${o.fontSize||28}px Arial`;ctx.textAlign="center";canvasText(ctx,o.text,o.x+o.w/2,o.y+Math.max(28,(o.fontSize||28)),Math.max(40,o.w-12),(o.fontSize||28)*1.15)}
      ctx.restore();
    }
  }
  sortedCharacters().forEach(c=>{
    ctx.save();ctx.beginPath();ctx.fillStyle="#fff";ctx.strokeStyle=c.type==="M"?"#ff6f96":"#7563c7";ctx.lineWidth=6;ctx.arc(c.x,c.y,30,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle="#342f3a";ctx.font="900 24px Arial";ctx.textAlign="center";ctx.fillText(c.id,c.x,c.y+8);ctx.font="700 20px Arial";ctx.fillText(c.name||"",c.x,c.y+56);
    ctx.restore();
  });
  canvas.toBlob(blob=>{if(!blob){toast("Không xuất được Scene PNG");return}const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${safeBaseName(data.level.id||"DRAMA_LEVEL")}_SCENE_LAYOUT.png`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("Đã xuất Scene PNG")},"image/png");
}

async function saveProjectFile(){
  save();
  savePlayProgress();
  const editorData=deep(data);editorData.editorSchemaVersion="1.29";
  const json=JSON.stringify(editorData,null,2);
  const idPart=(data.level.id||"drama_level").replace(/[^\w\-]+/g,"_");
  const filename=`${idPart}_v${String(data.level.version||"1.0").replace(/[^\w.\-]+/g,"_")}.editor.json`;

  try{
    if("showSaveFilePicker" in window){
      if(!projectFileHandle){
        projectFileHandle=await window.showSaveFilePicker({
          suggestedName:filename,
          types:[{description:"Drama Level JSON",accept:{"application/json":[".json"]}}]
        });
      }
      const writable=await projectFileHandle.createWritable();
      await writable.write(json);
      await writable.close();
      toast("Đã lưu project");
      return;
    }
  }catch(e){
    if(e?.name==="AbortError")return;
  }

  const blob=new Blob([json],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast("Đã lưu project thành JSON");
}
$("#saveBtn").onclick=saveProjectFile;
$("#exportBtn").onclick=()=>{
  const check=runPreflightCheck(true);
  if(check.errors.length){renderPreflightCheck(check);$("#checkOverlay").classList.add("show");toast(`CHECK LEVEL: còn ${check.errors.length} lỗi phải sửa`);return}
  const idPart=data.level.id||"drama_level";
  const ver=String(data.level.version||"1.0").replace(/[^A-Za-z0-9._-]+/g,"_");
  downloadText(JSON.stringify(buildRuntimeData(),null,2),`${idPart}_v${ver}.level.json`,"application/json");
  toast(check.warnings.length?`Đã xuất Dev JSON · ${check.warnings.length} warning`:`Đã xuất Dev JSON · CHECK PASS`);
};
$("#assetRequestBtn").onclick=exportAssetRequest;
$("#scenePngBtn").onclick=exportScenePng;
$("#importFile").onchange=e=>{
  const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{
    playSession++;clearPlayProgress();
    const raw=JSON.parse(r.result);
    // Runtime JSON chỉ chứa dữ liệu Dev. Khi import lại Tool, khôi phục phần runtime có thể khôi phục;
    // dữ liệu Art/authoring đã chủ động bỏ khỏi Dev JSON sẽ không thể tự sinh lại.
    if(raw?.schemaVersion==="drama-level-runtime-2.0"){
      toast("Đây là Dev JSON V2, không phải file Project. Hãy import .editor.json để làm tiếp.");
      e.target.value="";
      return;
    }
    if(raw?.schemaVersion==="drama-level-runtime-1.0"){
      raw.level=raw.level||{};
      raw.level.art={...blankLevelArt(),backgroundAssetId:raw.scene?.backgroundAssetId||"BG01"};
      raw.characters=(raw.characters||[]).map(c=>({
        ...c,
        assetBaseId:c.assets?.base||`${c.id}_BASE`,
        assetTrayId:c.type==="M"?(c.assets?.tray||`${c.id}_TRAY`):"",
        reactionEvents:(c.reactionEvents||[]).map(ev=>({
          ...ev,steps:(ev.steps||[]).map(st=>({id:uid("ST_"),...st}))
        }))
      }));
      raw.clues=(raw.clues||[]).map(cl=>({...cl}));
    }
    // Production/Runtime JSON để ending ở top-level; Editor JSON để ở level.ending. Migrate về một nguồn dữ liệu chung.
    if(raw?.ending){
      raw.level=raw.level||{};
      raw.level.ending={...blankEnding(),...(raw.level.ending||{}),
        endingLine:raw.ending.endingLine??raw.level.ending?.endingLine??"",
        verdictCta:raw.ending.verdictCta??raw.level.ending?.verdictCta??"",
        imageAssetId:raw.ending.imageAssetId??raw.level.ending?.imageAssetId??"ENDING01",
        imageSrc:raw.ending.imageSrc??raw.level.ending?.imageSrc??"",
        rewardCoins:ENDING_REWARD_COINS,normalRewardCoins:ENDING_NORMAL_COINS
      };
    }
    data=normalize(raw);selected={type:"level",id:"level"};mode="edit";lastSnapshot=JSON.stringify(data);persistRaw();refreshImmediate();toast("Đã nhập JSON"+(data.level.ending?.imageSrc?" · có Ending Image":""));
  }catch(_){toast("JSON lỗi")}};
  r.readAsText(f);
};

// SAMPLE: giữ riêng các level mẫu để GD mở nhanh khi train / tham khảo.
function loadSampleProject(sampleData,message){
  playSession++;clearPlayProgress();data=normalize(sampleData);selected={type:"level",id:"level"};mode="edit";multiSel.clear();save();refreshImmediate();toast(message);
}
$("#checkLevelBtn").onclick=openPreflightCheck;
$("#closeCheckLevel").onclick=()=>$("#checkOverlay").classList.remove("show");
$("#checkOverlay").addEventListener("pointerdown",e=>{if(e.target===$("#checkOverlay"))$("#checkOverlay").classList.remove("show")});
$("#sampleWeddingBtn").onclick=()=>loadSampleProject(sample(),"Đã load Sample Wedding · L001");
$("#sampleBirthdayBtn").onclick=()=>loadSampleProject(sampleBirthday(),"Đã load Sample Birthday Photo Booth · L003");
$("#resetBtn").onclick=()=>{if(!confirm("Reset trắng toàn bộ level hiện tại?"))return;playSession++;clearPlayProgress();data=normalize(blank());selected={type:"level",id:"level"};mode="edit";multiSel.clear();save();refreshImmediate();toast("Đã reset trắng hoàn toàn")};

$("#overlay").addEventListener("pointerdown",e=>{if(e.target===$("#overlay"))$("#overlay").classList.remove("show")});
$("#endingOverlay").addEventListener("pointerdown",e=>{if(e.target===$("#endingOverlay"))$("#endingOverlay").classList.remove("show")});
window.addEventListener("keydown",e=>{if(e.key==="Escape"){$("#overlay").classList.remove("show");$("#endingOverlay").classList.remove("show");$("#checkOverlay").classList.remove("show")}});


["endingBtn","scenePngBtn","assetRequestBtn","exportBtn"].forEach(id=>{const el=$("#"+id);if(el)el.addEventListener("click",()=>{$("#productionMenu")?.removeAttribute("open")})});
["sampleWeddingBtn","sampleBirthdayBtn"].forEach(id=>{const el=$("#"+id);if(el)el.addEventListener("click",()=>{$("#sampleMenu")?.removeAttribute("open")})});
["resetBtn"].forEach(id=>{const el=$("#"+id);if(el)el.addEventListener("click",()=>{$("#moreMenu")?.removeAttribute("open")})});

// V1.30 Zoom, Pan & Smart Align Engine
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
    // Ctrl + Wheel / Wheel zoom
    sw.addEventListener("wheel", e => {
      if(e.ctrlKey || e.metaKey || isSpaceDown){
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.08 : -0.08;
        canvasZoom = Math.min(2.5, Math.max(0.3, +(canvasZoom + delta).toFixed(2)));
        applyZoomPan();
      }
    }, { passive: false });

    // Track mouse position over stage for cursor paste / placement
    sw.addEventListener("pointermove", e => {
      lastMouseStagePos = logical(e);
    });

    sw.addEventListener("pointerdown", e => {
      if(isSpaceDown || e.button === 1){
        isPanning = true;
        panStart = {x: e.clientX - canvasPan.x * canvasZoom, y: e.clientY - canvasPan.y * canvasZoom};
        document.body.classList.add("panning");
        e.preventDefault();
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

  // Close top menus on outside click
  document.addEventListener("click", e => {
    if(!e.target.closest(".topMenu")){
      document.querySelectorAll(".topMenu[open]").forEach(m => m.removeAttribute("open"));
    }
  });
}

// Changelog Modal
function initChangelogModal(){
  const btn=$("#changelogBtn"), close=$("#closeChangelog"), overlay=$("#changelogOverlay");
  if(btn && overlay) btn.onclick = () => overlay.classList.add("show");
  if(close && overlay) close.onclick = () => overlay.classList.remove("show");
}

// Smart Align Multi-Selection
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


// ==========================================
// Theme Management & Studio Modal Shortcuts
// ==========================================
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

// Global Modal Shortcuts: Esc to close & Backdrop click
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

initThemeSystem();
initZoomAndPan();
initChangelogModal();
play=loadPlayProgress();
render();
})();
