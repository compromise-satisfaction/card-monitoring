enchant();

function Game_load(width,height){
  game = new Game(width,height);
  game.fps = 60;
  game.onload = function(){
    switch(Glitch){
      case "ショート":
      case "擬似天変地異":
      case "居合いドロー":
        Play_Scene_Change(Start_YYY);
        break;
      case "監視生成":
        Play_Scene_Change(Monitoring_Scene);
        break;
      case "ゲーム特化":
        Big_Data.Talk_Data = Talk_Datas.ゲーム開始;
        Play_Scene_Change(Talk_Scene);
        break;
      case "キャンバステスト":
        game.replaceScene(Canvas());
        break;
      case "ムービーメーカー":
        Play_Scene_Change(Start_Scene);
        break;
    };
    return;
  };
  game.start();
};

function Log(Text){
  if(!Setting_Datas.テスト) return;
  console.log(Text);
  if(typeof(Text)!="string") Text = JSON.stringify(Text);
  Datas = {Y:50,テキスト:Text,カラー:"つむぎ",ターゲット:"ログ"};
  Text_Change(Datas);
  return;
};

var New_scene = false;
var Play_scenes = {前:[]};
var How_Scene = null;

function Play_Scene_Change(Scene,e){
  if(!Scene) e = "pop";
  if(e) How_Scene = e;
  else How_Scene = "replace";
  switch(How_Scene){
    case "replace":
      game.replaceScene(Scene());
      break;
    case "pop":
      game.popScene();
      Play_scenes.今 = Play_scenes.前[Play_scenes.前.length-1];
      Play_Scene = Play_scenes[Play_scenes.今];
      Play_scenes.前.pop();
      Create_Keys();
      break;
    default:
      How_Scene = "push";
      game.pushScene(Scene(e));
      break;
  };
  Size_change(width,height);
  return;
};

function Play_Scene_Set(Name){
  New_Scene = false;
  switch(How_Scene){
    case "push":
      Play_scenes.前.push(Play_scenes.今);
      break;
  };
  if(Play_scenes[Name]){
    Play_Scene = Play_scenes[Name];
    Play_scenes.今 = Name;
  }
  else{
    New_Scene = true;
    Play_Scene = new Scene();
    Play_scenes[Name] = Play_Scene;
    Play_scenes.今 = Name;
  };
  Create_Keys();
  Back.width = width;
  Back.height = width/16*9;
  Black.width = width;
  Black.height = width/16*9;
  Play_Scene.removeChild(Black);
  Play_Scene.addChild(Black);
  return(Play_Scene);
};

var Loading_Scene = function(){
  var scene = Play_Scene_Set("ローディング画面");
  if(!New_Scene) return scene;
  var Background = new Entity();
  
  Background._element = document.createElement("img");
  Background._element.src = "https://raw.githubusercontent.com/compromise-satisfaction/novel_game/gh-pages/画像/半透明(黒).png";
  Background.width = width;
  Background.height = height;
  var Loading = new Entity();
  Loading._element = document.createElement("img");
  Loading._element.src = Assets + "読み込み中.png";
  Loading.width = width;
  Loading.height = width/5;
  Loading.y = height/2 - Loading.height/2;
  scene.addChild(Background);
  scene.addChild(Loading);
  Loading.opacity = 0;
  scene.addEventListener("enterframe",function(){
    scene.removeChild(Black);
    if(Loading.tl.queue.length) return;
    if(Loading.opacity) Loading.tl.fadeOut(20);
    else Loading.tl.fadeIn(20);
  });
  return scene;
};

var Sounds = window.localStorage.getItem("Sounds");
Sounds = JSON.parse(Sounds);
if(!Sounds){
  Sounds = {
  };
};

function CSS(a,b,c,d){
  var css = [];
  if(!c) c = 4;
  if(!d) d = 8;
  if(a){
    for(var K = 1; K < c; K++){
      for(var J = 1; J < c; J++) css[css.length] = [  J + "px  " + K + "px 0 " + a];
      for(var J = 1; J < c; J++) css[css.length] = [- J + "px  " + K + "px 0 " + a];
      for(var J = 1; J < c; J++) css[css.length] = [  J + "px -" + K + "px 0 " + a];
      for(var J = 1; J < c; J++) css[css.length] = [- J + "px -" + K + "px 0 " + a];
    };  
  };
  if(b){
    for(var K = 1; K < d; K++){
      for(var J = 1; J < d; J++) css[css.length] = [  J + "px  " + K + "px 0 " + b];
      for(var J = 1; J < d; J++) css[css.length] = [- J + "px  " + K + "px 0 " + b];
      for(var J = 1; J < d; J++) css[css.length] = [  J + "px -" + K + "px 0 " + b];
      for(var J = 1; J < d; J++) css[css.length] = [- J + "px -" + K + "px 0 " + b];
    };
  };
  return(css);
};

function Move_Scale_XY(XY,S,WH){
  WH /= 2; 
  return(XY - (WH - WH * S));
};

function Rand(N){
  return(Math.floor(Math.random()*(N)));
};

var Play_Scene = null;
var Create_Data = {};
var Big_Data = {Menu:[]};

var Selects = [];
function Create_Select(X,Y,W,H,V,VV){
   var I = Selects.length;
   Selects[I] = new Entity();
   Selects[I].moveTo(X,Y);
   Selects[I].width = W;
   Selects[I].height = H;
   Selects[I]._element = document.createElement("select");
   Selects[I]._element.style.fontSize = VV;
   Option = [];
   for (var J = 0; J < V.length; J++){
     Option[J] = document.createElement("option");
     Option[J].text = V[J][0];
     Option[J].value = V[J][1];
     Option[J].selected = V[J][2];
     Selects[I]._element.appendChild(Option[J]);
   };
   Play_Scene.addChild(Selects[I]);
   return(Selects[I]);
 };

var Buttons = [];
var Key_s = {};
function Create_Button(X,Y,W,H,V,VV,Key){
  var I = Buttons.length;
  Buttons[I] = new Button(V,"light",W,H);
  Buttons[I].moveTo(X,Y);
  Buttons[I].width = W;
  Buttons[I].height = H;
  Buttons[I]._element = document.createElement("input");
  Buttons[I]._element.type = "submit";
  Buttons[I]._element.value = V;
  Buttons[I]._element.Number = I;
  Buttons[I].backgroundColor = "buttonface";
  Buttons[I]._style["font-size"] = VV;
  Buttons[I].初期 = {X:X,Y:Y,Y:Y,W:W,H:H};
  if(Key) Key_s["Key"+Key] = Buttons[I];
  Play_Scene.addChild(Buttons[I]);
  All_Object.push(Buttons[I]);
  return(Buttons[I]);
};

var BGM = null;
function Create_BGM(C,D){
  if(!D) D = {};
  var BGM = document.createElement("audio");//サウンド
  BGM.src = C;
  if(D.L) BGM.ループ = D.L;
  if(D.V) BGM.volume = D.V;
  BGM.addEventListener("ended",function(e){
    if(!BGM.ループ) BGM.ループ = 0;
    BGM.currentTime = BGM.ループ;
    BGM.play();
  });
  return(BGM);
};

var SEs = {};
function Create_SE(C,N,V){
  if(!V) V = 0.1;
  if(N){
    if(SEs[N]){
      console.log(N);
      return(SEs[N]);
    };
    SEs[N] = document.createElement("audio");//サウンド
    SEs[N].src = C;
    SEs[N].volume = V;
    //SEs[N].play();
    return(SEs[N]);
  };
  if(SEs[C]) return(SEs[C]);
  SEs[C] = document.createElement("audio");//サウンド
  SEs[C].src = C;
  SEs[C].volume = V;
  SEs[C].play();
  return(SEs[C]);
};

function Sound_Stop(SE){
  if(typeof(SE)=="string"){
    if(SEs[SE]) SE = SEs[SE];
    else return;
  };
  SE.pause();
  SE.currentTime = 0;
  return;
};

function Sound_Play(SE,V){
  if(!V) V = 0.2;
  if(typeof(SE)=="string"){
    if(SEs[SE]) SE = SEs[SE];
    else{
      SE = Create_SE(SE,false,V);
      return;
    };
  };
  SE.currentTime = 0;
  SE.volume = V;
  SE.play();
  return;
};

var All_Object = [];

var Images = [];
var Back = new Entity();
Back._element = document.createElement("img");
Back._element.src = G_D + "novel_game/gh-pages/画像/透明.png";

var Black = new Entity();
Black._element = document.createElement("img");
Black._element.src = G_D + "novel_game/gh-pages/画像/黒.png";

var White = new Entity();
White._element = document.createElement("img");
White._element.src = G_D + "novel_game/gh-pages/画像/白.png";

function Create_Image(X,Y,W,H,C){
  var I = Images.length;
  Images[I] = new Entity();
  Images[I].moveTo(X,Y);
  Images[I].width = W;
  Images[I].height = H;
  Images[I]._element = document.createElement("img");
  Images[I]._element.src = C;
  Images[I].初期 = {X:X,Y:Y,Y:Y,W:W,H:H};
  Play_Scene.addChild(Images[I]);
  All_Object.push(Images[I]);
  return(Images[I]);
};

function Array_Shuffle(Array){
  var Temp = [];
  var I = 0;
  while(Array.length){
    I = Math.floor(Math.random()*(Array.length));
    Temp.push(Array[I]);
    Array.splice(I,1);
  };
  while(Temp.length){
    I = Math.floor(Math.random()*(Temp.length));
    Array.push(Temp[I]);
    Temp.splice(I,1);
  };
  return(Array);
};

var Text_Areas = [];
function Create_Text_Area(X,Y,W,H,V,P,VV){
  var I = Text_Areas.length;
  Text_Areas[I] = new Entity();
  Text_Areas[I].moveTo(X,Y);
  Text_Areas[I].width = W;
  Text_Areas[I].height = H;
  Text_Areas[I]._element = document.createElement("input");
  Text_Areas[I]._element.type = "textarea";
  Text_Areas[I]._element.value = V;
  Text_Areas[I]._element.placeholder = P;
  Text_Areas[I]._element.style.fontSize = VV;
  Play_Scene.addChild(Text_Areas[I]);
  return(Text_Areas[I]);
};

var Videos = [];
function Create_Video(X,Y,W,H,C,A,L,M){
  var I = Videos.length;
  Videos[I] = new Entity();
  Videos[I].moveTo(X,Y);
  Videos[I].width = W;
  Videos[I].height = H;
  Videos[I]._element = document.createElement("video");
  Videos[I]._element.src = C;
  Videos[I]._element.loop = L;
  Videos[I]._element.muted = M;
  Videos[I]._element.autoplay = A;
  Videos[I].初期 = {X:X,Y:Y,Y:Y,W:W,H:H};
  Videos[I].scale(0,0);
  Videos[I].動画 = true;
  if(false){
    Videos[I]._element.addEventListener("ended",function(e){
      this._element.src = "https://cdn.glitch.global/b64fe3b9-288e-47b5-9bf5-ef5ae094931e/アーニャ.mp4";
      this._element.currentTime = 0;
      this._element.play();
      return;
    });
  };
  Play_Scene.addChild(Videos[I]);
  All_Object.push(Videos[I]);
  return(Videos[I]);
};

function Create_Youtube(X,Y,W,H,C){
  var Video = new Entity();
  var I = Videos.length;
  Videos[I] = new Entity();
  Videos[I].moveTo(X,Y);
  Videos[I].width = W;
  Videos[I].height = H;
  Videos[I].visible =  true;
  Videos[I]._element = document.createElement("div");
  Videos[I]._element.innerHTML = C;
  Videos[I].初期 = {X:X,Y:Y,Y:Y,W:W,H:H};
  Videos[I].動画 = true;
  if(false){
    Videos[I]._element.addEventListener("ended",function(e){
      this._element.src = "https://cdn.glitch.global/b64fe3b9-288e-47b5-9bf5-ef5ae094931e/アーニャ.mp4";
      this._element.currentTime = 0;
      this._element.play();
      return;
    });
  };
  Play_Scene.addChild(Videos[I]);
  All_Object.push(Videos[I]);
  return(Videos[I]);
};

//Label作成
//ここからラベル

var Px = HHHHH/24 + "px IP A Pゴシック";
var Labels = {};
var Collars = {ずんだもん:"c0fc8a",めたん:"f78bd2",つむぎ:"e6ccb1",ひまり:"a59c92",その他:"yellow"};
var L_width = document.createElement('canvas').getContext('2d');
L_width.font = Px;

function Text_make(I){
  Labels[I] = new Sprite();
  Labels[I]._element = document.createElement("measureText");
  Labels[I].Px = Px;
  Labels[I]._style.color = "white";
  Labels[I].X = WWWWW / 2;
  Labels[I].Y = HHHHH - 400;
  Labels[I]._style["text-shadow"] = CSS("#000000","#FFFFFF");
  return(Labels[I]);
};

function Text_Change(Datas){
  if(Datas.全消去){
    Temp = Object.keys(Labels);
    for(var I = 0; I < Temp.length; I++) Play_Scene.removeChild(Labels[Temp[I]]);
    return;
  };
  var Text = Datas.テキスト;
  if(!Text) Text = "";
  var Label = Labels[Datas.ターゲット];
  if(!Label) Label = Text_make(Datas.ターゲット);
  Play_Scene.removeChild(Label);
  if(Datas.X!=null) Label.X = Datas.X;
  if(Datas.Y!=null) Label.Y = Datas.Y;
  if(Datas.カラー){
    if(Collars[Datas.カラー]) Label._style.color = Collars[Datas.カラー];
    else Label._style.color = Datas.カラー;
  };
  if(Datas.シャドウ){
    Label._style["text-shadow"] =
    CSS(Datas.シャドウ[0],Datas.シャドウ[1],Datas.シャドウ[2],Datas.シャドウ[3]);
  };
  if(Datas.座標){
    switch(Datas.座標){
      case "右":
      case "左":
      case "中心":
        Label.座標 = Datas.座標;
        break;
      default:
        delete Label.座標;
        break;
    };
  };
  if(!Label.座標) Label.座標 = "中心";
  if(Datas.フォント) Label.Px = Datas.フォント;
  L_width.font = Label.Px;
  Label._style.font = Label.Px;
  if(Datas.W) Label.W = Datas.W;
  if(Label.W) Label.width = Label.W;
  else Label.width = L_width.measureText(Text).width + 10;
  Label._element.textContent = Text;
  Label.x = Label.X;
  Label.y = Label.Y - Label.Px.match(/\d+/)[0]*0.5;
  switch(Label.座標){
    case "右":
      Label.x -= Label.width;
      break;
    case "中心":
      Label.x -= Label.width / 2;
      break;
  };
  Label.opacity = 1;
  Play_Scene.addChild(Label);
  return;
};

//Label作成
//ここまでラベル

//ここからキーボード

var C_B = false;
var S_B = false;
var X_B = false;
var Pad_L = false;

function Create_Keys(){
  switch(Play_scenes.今){
    default:
      return;
    case "店":
    case "横":
    case "出口":
    case "背景":
    case "会話":
    case "設定":
    case "投げる":
    case "調べる":
    case "ワープ":
    case "メニュー":
    case "メニュー会話":
      break;      
  };
  if(Pad_L){
    White.y = width/16*9;
    White.width = width;
    White.height = width/16*9;
    //Play_Scene.removeChild(White);
    Play_Scene.addChild(White);
    Play_Scene.addChild(Pad_L);
    Play_Scene.addChild(X_B);
    Play_Scene.addChild(C_B);
    Play_Scene.addChild(S_B);
    Play_Scene.addChild(D_B);
    return;
  };
  Pad_L = new Pad(G_D + "Adventure/gh-pages/image/pad.png",width/2);
  Pad_L.y = width/16*9*2-width/2;
  Play_Scene.addChild(Pad_L);
  X_B = Create_Button(width/2,width/16*9*2-width/4,width/4,width/4,"X",180,"X");
  C_B = Create_Button(width-width/4,width/16*9*2-width/4,width/4,width/4,"C",180,"C");
  S_B = Create_Button(width-width/2,width/16*9*2-width/2,width/4,width/4,"S",180,"S");
  D_B = Create_Button(width-width/4,width/16*9*2-width/2,width/4,width/4,"D",180,"D");
  return;
};

var Down_Keys = {};

window.addEventListener("keydown",function(e){
  if(Down_Keys[e.code]) return;
  Down_Keys[e.code] = true;
  if(Key_s[e.code]){
    Key = Key_s[e.code];
    Key._applyTheme(Key.theme.active);
    Key.pressed = true;
    Key.y = Key.original_Y + 1;
  };
  if(e.code=="KeyP"){
    game.popScene();
    console.log("popScene");    
  };
  if(e.code=="KeyF") console.log(Flags);
  if(e.code=="KeyJ"){
    Big_Data.調査開始 = [];
    Big_Data.調査何もない = Data_Set("何もない");
    Big_Data.調査終了後 = Data_Set("店内");
    Bouningen_Images.停止 = Assets + "若菜.png";
    Bouningen_Images.歩く = Assets + "若菜.gif";
    Bouningen_Images.走る = Assets + "若菜.gif";
    Setting_Datas.テスト = true;
    Setting_Datas.判定 = G_D + "novel_game/gh-pages/画像/半透明(赤).png";
    Play_Scene_Change(Investigate_Scene);
  };
  return;
});

window.addEventListener("keyup",function(e){
  delete Down_Keys[e.code];
  if(Key_s[e.code]){
    Key = Key_s[e.code];
    Key._applyTheme(Key.theme.normal);
    Key.pressed = false;
    Key.y = Key.original_Y - 1;
  };
  return;
});

function Pad_Check(P,E){
  var Result = true;
  if(P._element.src == G_D + "Adventure/gh-pages/image/pad.png") Result = false;
  switch(E){
    case "上下":
      if(P.rotation&&P.rotation!=180) Result = false;
      break;
    case "左右":
      if(P.rotation!=270&&P.rotation!=90) Result = false;
      break;
    case "無":
      Result = !Result;
      break;
    case "上":
    case "↑":
      if(P.rotation) Result = false;
      break;
    case "下":
    case "↓":
      if(P.rotation!=180) Result = false;
      break;
    case "左":
    case "←":
      if(P.rotation!=270) Result = false;
      break;
    case "右":
    case "→":
      if(P.rotation!=90) Result = false;
      break;
  };
  return(Result);
};

function Pad_keydown_Image(Pads){
  Clock_Move();
  Pads._element.src = G_D + "Adventure/gh-pages/image/pad.png";
  if(game.input.up&&!game.input.down&&!game.input.left&&!game.input.right){
    Pads.rotation = 0;
    Pads._element.src = G_D + "Adventure/gh-pages/image/pad_keydown.png";
  };
  if(!game.input.up&&game.input.down&&!game.input.left&&!game.input.right){
    Pads.rotation = 180;
    Pads._element.src = G_D + "Adventure/gh-pages/image/pad_keydown.png";
  };
  if(!game.input.up&&!game.input.down&&game.input.left&&!game.input.right){
    Pads.rotation = 270;
    Pads._element.src = G_D + "Adventure/gh-pages/image/pad_keydown.png";
  };
  if(!game.input.up&&!game.input.down&&!game.input.left&&game.input.right){
    Pads.rotation = 90;
    Pads._element.src = G_D + "Adventure/gh-pages/image/pad_keydown.png";
  };
  return;
};