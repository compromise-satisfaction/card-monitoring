enchant();

function Game_load(width,height){
  game = new Game(width,height);
  game.fps = 60;
  game.onload = function(){
    Play_Scene_Change(Monitoring_Scene);
    return;
  };
  game.start();
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

var New_scene = false;
var Play_scenes = {前:[]};
var How_Scene = null;

var Loading_Scene = function(){
  var scene = Play_Scene_Set("ローディング画面");
  if(!New_Scene) return scene;
  var Background = new Entity();

  Background._element = document.createElement("img");
  Background._element.src = "https://raw.githubusercontent.com/compromise-satisfaction/novel_game/gh-pages/画像/半透明(黒).png";
  Background.width = width;
  Background.height = height;
  var Loading = new Label();
  Loading.text = "読み込み中";
  Loading.y = (height - width/Loading.text.length) / 2;
  Loading.font = width/Loading.text.length + "px 'Arial'";
  Loading.width = width;
  Loading._style.color = "#7f7fff";
  scene.addChild(Background);
  scene.addChild(Loading);
  Loading.opacity = 0;

  scene.addEventListener("enterframe",function(){
    scene.removeChild(Black);
    Loading.opacity = 0.5 + Math.sin(game.frame * 0.15) * 0.3;
  });
  return scene;
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
  return(Play_Scene);
};

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

var Monitoring_Scene = function(){
  var scene = Play_Scene_Set("監視");
  if(!New_Scene) return scene;

  var Movie = false;
  var B_Size = width/5;

  var BGMs = 5;

  var BGM2 = document.createElement("audio");
  BGM2.N = window.localStorage.getItem("曲");
  window.localStorage.setItem("曲",BGM2.N+1);
  if(!BGM2.N||BGM2.N>BGMs) BGM2.N = 1;
  BGM2.src = BGM2.N + ".m4a";

  BGM2.addEventListener("ended",function(e){
    if(BGM2.N==BGMs) BGM2.N = 0;
    BGM2.N++;
    window.localStorage.setItem("曲",BGM2.N);
    BGM2.src = BGM2.N + ".m4a";
    BGM2.currentTime = 0;
    BGM2.play();
    return;
  });

  var B_Black = Create_Image(0,0,width,height,"https://raw.githubusercontent.com/compromise-satisfaction/Saved/master/画像/背景/半透明(黒).png");
  var Kokuban = Create_Image(0,0,width,height,"https://2.bp.blogspot.com/-Cmvu1wHYjQk/UOFKCAktHsI/AAAAAAAAKDs/29TPBCRpLv4/s1600/bunbougu_kokuban.png");
  var S_B = Create_Button(0,0,B_Size,B_Size,"開始",B_Size/2);
  var A_B = Create_Button(width-B_Size,0,B_Size,B_Size,"更新",B_Size/2);
  var T_B = Create_Button(width-B_Size,height-B_Size,B_Size,B_Size,"時間",B_Size/2);
  var Text_Area = new Entity();
  Text_Area.moveTo(B_Size,0);
  Text_Area.width = width - B_Size*2;
  Text_Area.height = height;
  Text_Area._element = document.createElement("textarea");
  Text_Area._element.type = "textarea";
  Text_Area._element.placeholder = "テキスト";
  Text_Area._element.style.fontSize = width/20;

  var URL = "https://script.google.com/macros/s/AKfycbwi6ekqJT9R4EB4hcX5bJ-UwZ_1SMYVVwRCsA6VAZxhVGmx--cV/exec";
  var Options = {
    method: "post",
    body:JSON.stringify({タイプ:"スプレッドシート",ID:"1pwVkckXJIevaj2M3bQ7_uwOr_WBep2UDs2K89IdXWqE",名前:"データ"})
  };

  function Values_Set(Datas){
    for(var I = 0; I < Datas.length; I++) Datas[I] = JSON.parse(Datas[I].データ);
    return(Datas);
  };

  S_B._element.onclick = function(e){
    TIME = 60;
    TTT = TIME;
    LINE_Texts = [];
    Movie = true;
    scene.removeChild(B_Black);
    scene.removeChild(Kokuban);
    scene.removeChild(S_B);
    scene.removeChild(A_B);
    scene.removeChild(T_B);
    scene.removeChild(Text_Area);
    BGM2.play();
    for(var I = 0; I < Z_TEXT.length; I++) scene.addChild(Z_TEXT[I]);
    if(Text_Area._element.value.match(/^\d+$/)) TIME = Text_Area._element.value * 1;
    return;
  };

  A_B._element.onclick = function(e){
    game.pushScene(Loading_Scene());
    fetch(URL,Options).then(res => res.json()).then(result => {
      Card_Datas = Values_Set(result);
      window.localStorage.setItem("カードデータ",JSON.stringify(Card_Datas));
      delete result;
      game.popScene();

      Temp = 0;
      Text_Area._element.value = "";
      for(var I = 0; I < Card_Datas.length; I++){
        if(I) if(Card_Datas[I].カード名==Card_Datas[I-1].カード名) continue;
        Temp++;
        Text_Area._element.value += "\n《" + Card_Datas[I].カード名 + "》";
      };
      Text_Area._element.value = Temp + "枚" + Text_Area._element.value;

      for(var I = 0; I < Card_Datas.length; I++){
        TEXT_LLL.数 = 0;
        for(var J = 0; J < Card_Datas[I].変更内容.length; J++){
        TEXT_LLL.数 += Card_Datas[I].変更内容[J][1].length;
        };
        if(TEXT_LLL.最大 < TEXT_LLL.数) TEXT_LLL.最大 = TEXT_LLL.数;
      };
      for(var I = TEXT_TEXT.lenght; I < TEXT_LLL.最大; I++) TEXT_TEXT.push(Text(0,0,PX.変更内容));
    });
    return;
  };

  T_B._element.onclick = function(e){
    if(Text_Area.表示){
      Text_Area.表示 = false;
      scene.removeChild(Text_Area);
    }
    else{
      Text_Area.表示 = true;
      scene.addChild(Text_Area);
    };
    return;
  };

  Card_Datas = window.localStorage.getItem("カードデータ");
  if(!Card_Datas) Card_Datas = "{}";

  if(Card_Datas != "{}"){
    Temp = 0;
    Card_Datas = JSON.parse(Card_Datas);
    for(var I = 0; I < Card_Datas.length; I++){
      if(I) if(Card_Datas[I].カード名==Card_Datas[I-1].カード名) continue;
      Temp++;
      Text_Area._element.value += "\n《" + Card_Datas[I].カード名 + "》";
    };
    Text_Area._element.value = Temp + "枚" + Text_Area._element.value;
  };

  var Z_TEXT = [];
  function Text(x,y,f){
    var Text = new Sprite();
    Text._element = document.createElement("measureText");
    Text._style.font  = f + "px " + Font;
    Text.opacity = 0;
    Text.moveTo(x,y);
    Z_TEXT.push(Text);
    return(Text);
  };

  var Font = "serif";
  //Font = "df隷書体";

  var PX = {};
  PX.ルビ = height/20;
  PX.前回収録 = PX.ルビ*0.8;
  PX.カード名 = height/15;
  PX.変更箇所 = height/20;
  PX.変更内容 = height/33;
  var X = {};
  X.ルビ = width/50;
  X.カード名 = width/50;
  X.変更内容 = width/18;
  X.変更内容表示 = X.変更内容;
  var Y = {};
  Y.ルビ = height/25;
  Y.カード名 = height/25*2.5;
  Y.前回収録 = height/25*5.5;
  Y.変更箇所 = height/25*10;
  Y.変更内容 = height/25*12;
  Y.変更内容表示 = Y.変更内容;

  var RUBI = Text(X.ルビ,Y.ルビ,PX.ルビ);
  var NAME = Text(X.カード名,Y.カード名,PX.カード名);
  var ZENKAI = Text(X.変更内容,Y.前回収録,PX.ルビ*0.8);
  var ZENKAI_P = Text(X.変更内容,Y.前回収録+PX.ルビ*1.2,PX.前回収録);
  var ZENKAIHI = Text(X.変更内容,Y.前回収録+PX.ルビ*2.4,PX.ルビ*0.8);
  var HENKOU = Text(X.変更内容,Y.変更箇所,PX.変更箇所);
  var TEXT_TEXT = [];

  var TEXT_LLL = {最大:0};
  for(var I = 0; I < Card_Datas.length; I++){
    if(Card_Datas == "{}") break;
    TEXT_LLL.数 = 0;
    for(var J = 0; J < Card_Datas[I].変更内容.length; J++){
      TEXT_LLL.数 += Card_Datas[I].変更内容[J][1].length;
    };
    if(TEXT_LLL.最大 < TEXT_LLL.数) TEXT_LLL.最大 = TEXT_LLL.数;
  };

  for(var I = 0; I < TEXT_LLL.最大; I++) TEXT_TEXT.push(Text(0,0,PX.変更内容));

  var Target_Text = null;
  var Before_Text = null;
  var B_Before_Text = null;

  function Reset(){
    var c = document.createElement("canvas").getContext("2d");
    c.font = Target_Text._style.font;
    var d = null;
    if(X.変更内容表示==X.変更内容){
      switch(Target_Text._element.textContent){
        case "：":
        case "ー":
        case ")":
        case "）":
        case "」":
        case "、":
        case "。":
          d = c.measureText(Before_Text._element.textContent);
          X.変更内容表示 += d.width;
          Target_Text.X = X.変更内容表示;
          Before_Text.X = X.変更内容;
          Before_Text.Y = Y.変更内容表示;
          switch(Before_Text._element.textContent){
            case "：":
            case "ー":
            case ")":
            case "）":
            case "」":
            case "、":
            case "。":
              d = c.measureText(B_Before_Text._element.textContent);
              Before_Text.X = X.変更内容表示;
              X.変更内容表示 += d.width;
              Target_Text.X = X.変更内容表示;
              B_Before_Text.X = X.変更内容;
              B_Before_Text.Y = Y.変更内容表示;
              break;
          };
          break;
      };
    };
    if(Target_Text._element.textContent=="\n") d = {width:0};
    else d = c.measureText(Target_Text._element.textContent);
    X.変更内容表示 += d.width;
    if(X.変更内容表示>(width-X.変更内容)-PX.変更内容*2){
      X.変更内容表示=X.変更内容;
      Y.変更内容表示+=PX.変更内容*1.5;
    };
    B_Before_Text = Before_Text;
    Before_Text = Target_Text;
    return;
  };

  var TIME = 60;
  var SSS = 0;
  var TTT = 0;
  var C_S = 0;
  var J_J = {削除:0,追加:0,改行削除:0,改行追加:0};
  var Values = [];
  var Temp = null;
  var Display_Text1 = [];
  var Display_Text2 = [];
  var TEXT_J = 0;

  var LINE_Texts = [];
  var Start_Time = null;

  var Send_Text = "※公式カードデータベース(50音順)の内容です。\n実物のカードとは改行などが異なる場合があります。";

  function Move(){
    if(!C_S&&!SSS) Start_Time = new Date();
    var Datas = Card_Datas[C_S];
    if(!Datas){
      C_S = 0;
      Movie = false;
      Start_Time = Start_Time.getTime();
      Start_Time = (Start_Time - Start_Time%1000)/1000;
      Send_Text = "※公式カードデータベース(50音順)の内容です。\n実物のカードとは改行などが異なる場合があります。";

      for(var I = 0; I < LINE_Texts.length; I++){
        if(Card_Name!=LINE_Texts[I].カード名){
          Card_Name = LINE_Texts[I].カード名;
          Send_Text += "\n\n《" + LINE_Texts[I].カード名 + "》";
        };
        LINE_Texts[I].時間 = LINE_Texts[I].時間.getTime();
        LINE_Texts[I].時間 = (LINE_Texts[I].時間 - LINE_Texts[I].時間%1000)/1000;
        LINE_Texts[I].時間 = LINE_Texts[I].時間 - Start_Time;
        if(LINE_Texts[I].時間<10) LINE_Texts[I].時間 = "00:0" + LINE_Texts[I].時間;
        else{
          if(LINE_Texts[I].時間<60) LINE_Texts[I].時間 = "00:" + LINE_Texts[I].時間;
          else{
            LINE_Texts[I].時間 = {分:(LINE_Texts[I].時間-LINE_Texts[I].時間%60)/60,秒:LINE_Texts[I].時間%60};
            if(LINE_Texts[I].時間.分<10) LINE_Texts[I].時間.分 = "0" + LINE_Texts[I].時間.分;
            if(LINE_Texts[I].時間.秒<10) LINE_Texts[I].時間.秒 = "0" + LINE_Texts[I].時間.秒;
            LINE_Texts[I].時間 = LINE_Texts[I].時間.分 + ":" + LINE_Texts[I].時間.秒;
          };
        };
        Send_Text += "\n" + LINE_Texts[I].時間;
        Send_Text += " " + LINE_Texts[I].場所;
      };
      console.log(Send_Text);
      BGM2.pause();
      Text_Area._element.value = Send_Text;
      for(var I = 0; I < Z_TEXT.length; I++) scene.removeChild(Z_TEXT[I]);
      scene.addChild(B_Black);
      scene.addChild(Kokuban);
      scene.addChild(S_B);
      scene.addChild(A_B);
      scene.addChild(T_B);
      navigator.clipboard.writeText(Send_Text);
      return;
    };
    Change_P = Card_Datas[C_S].変更箇所;
    Card_Name = Card_Datas[C_S].カード名;
    switch(SSS){
      case 0:
        if(Datas.ルビ==Datas.カード名) Datas.ルビ = "";
        RUBI._element.textContent = Datas.ルビ;
        NAME._element.textContent = Datas.カード名;
        ZENKAI._element.textContent = "前回の収録 " + Datas.前回収録.日付;
        ZENKAI_P._element.textContent = Datas.前回収録.名前;
        ZENKAIHI._element.textContent = "前回の収録から" + Datas.前回収録.日数;
        HENKOU._element.textContent = "旧" + Datas.変更箇所;

        Values = [];
        J_J = {削除:0,追加:0,改行削除:0,改行追加:0};

        for(var I = 0; I < Datas.変更内容.length; I++){
          Temp = Datas.変更内容[I];
          switch(Temp[0]){
            case  1:
              for(var J = 0; J < Temp[1].length; J++){
                J_J.追加++;
                if(Temp[1][J]=="\n") J_J.改行追加++;
                if(Temp[1][J]!="　") Values.push(["加",Temp[1][J]]);
                else{
                  Values.push(["加"," "]);
                  Values.push(["加"," "]);
                };
              };
              break;
            case  0:
              for(var J = 0; J < Temp[1].length; J++) Values.push(["定",Temp[1][J]]);
              break;
            case -1:
              for(var J = 0; J < Temp[1].length; J++){
                J_J.削除++;
                if(Temp[1][J]=="\n") J_J.改行削除++;
                Values.push(["消",Temp[1][J]]);
              };
              break;
          };
        };

        TEXT_J = 0;
        Display_Text1 = [];
        X.変更内容表示 = X.変更内容;
        Y.変更内容表示 = Y.変更内容;

        for(var I = 0; I < TEXT_TEXT.length; I++){
          TEXT_TEXT[I]._element.textContent = "";
          TEXT_TEXT[I]._style.background = "transparent";
        };

        for(var I = 0; I < Values.length; I++){
          if(Values[I][0]!="加"){
            if(Values[I][1] == "\n"){
              if(X.変更内容表示 != X.変更内容){
                X.変更内容表示  = X.変更内容;
                Y.変更内容表示 += PX.変更内容*1.5;
              };
            };
            Display_Text1.push(TEXT_TEXT[TEXT_J]);
            Target_Text = TEXT_TEXT[TEXT_J];
            Target_Text.X = X.変更内容表示;
            Target_Text.Y = Y.変更内容表示;
            Target_Text._element.textContent = Values[I][1];
            if(Values[I][0]=="消") Target_Text._style.background = "lightblue";
            TEXT_J++;
            Reset();
          };
        };

        if(J_J.改行削除) J_J.削除 -= J_J.改行削除;
        HENKOU._element.textContent = "旧" + Datas.変更箇所 + " 削除文字数:" + J_J.削除;
        if(J_J.改行削除) HENKOU._element.textContent += " 削除改行数:" + J_J.改行削除;

        for(var I = 0; I < Display_Text1.length; I++){
          Display_Text1[I].moveTo(Display_Text1[I].X,Display_Text1[I].Y);
          Display_Text1[I].tl.fadeIn(TIME);
        };

        RUBI.tl.fadeIn(TIME);
        NAME.tl.fadeIn(TIME);
        ZENKAI.tl.fadeIn(TIME);
        ZENKAI_P.tl.fadeIn(TIME);
        ZENKAIHI.tl.fadeIn(TIME);
        HENKOU.tl.fadeIn(TIME);
        TTT = TIME;

        break;
      case 1:
        HENKOU.tl.fadeOut(TIME);
        for(var I = 0; I < Display_Text1.length; I++){
          if(Display_Text1[I]._style.background == "lightblue") Display_Text1[I].tl.fadeOut(TIME);
        };
        break;
      case 2:
        Display_Text2 = [];
        X.変更内容表示 = X.変更内容;
        Y.変更内容表示 = Y.変更内容;
        for(var I = 0; I < Values.length; I++){
          if(Values[I][0]!="消"){
            if(Values[I][1] == "\n"){
              if(X.変更内容表示 != X.変更内容){
                X.変更内容表示  = X.変更内容;
                Y.変更内容表示 += PX.変更内容*1.5;
              };
            };
            if(Values[I][0]=="加"){
              Target_Text = TEXT_TEXT[TEXT_J];
              Target_Text._style.background = "lightpink";
              TEXT_J++;
            }
            else{
              while(Display_Text1[0]._style.background == "lightblue") Display_Text1.shift();
              Target_Text = Display_Text1[0];
              Display_Text1.shift();
            };
            Target_Text.X = X.変更内容表示;
            Target_Text.Y = Y.変更内容表示;
            Target_Text._element.textContent = Values[I][1];
            Display_Text2.push(Target_Text);
            Reset();
          };
        };
        for(var I = 0; I < Display_Text2.length; I++) Display_Text2[I].tl.moveTo(Display_Text2[I].X,Display_Text2[I].Y,TIME);
        break;
      case 3:
        if(J_J.改行追加) J_J.追加 -= J_J.改行追加;
        HENKOU._element.textContent = "新" + Datas.変更箇所 + " 追加文字数:" + J_J.追加;
        if(J_J.改行追加) HENKOU._element.textContent += " 追加改行数:" + J_J.改行追加;
        for(var I = 0; I < Display_Text2.length; I++) Display_Text2[I].tl.fadeIn(TIME);
        HENKOU.tl.fadeIn(TIME);
        TTT = TIME;
        break;
      case 4:
        for(var I = 0; I < Display_Text2.length; I++) Display_Text2[I].tl.fadeOut(TIME);
        C_S++;
        SSS = 0;
        if(!Card_Datas[C_S]){
          TTT = TIME;
          RUBI.tl.fadeOut(TIME);
          NAME.tl.fadeOut(TIME);
          ZENKAI.tl.fadeOut(TIME);
          ZENKAI_P.tl.fadeOut(TIME);
          ZENKAIHI.tl.fadeOut(TIME);
          HENKOU.tl.fadeOut(TIME);
          return;
        };
        if(Datas.カード名!=Card_Datas[C_S].カード名){
          RUBI.tl.fadeOut(TIME);
          NAME.tl.fadeOut(TIME);
          ZENKAI.tl.fadeOut(TIME);
          ZENKAI_P.tl.fadeOut(TIME);
          ZENKAIHI.tl.fadeOut(TIME);
        };
        HENKOU.tl.fadeOut(TIME);
        return;
    };
    SSS++;
    return;
  };

  scene.addEventListener("touchstart",function(e){
     TIME = 6;
     return;
  });

  scene.addEventListener("enterframe",function(e){
    if(!Movie) return;
    //if(Display_Text1[0]) if(Display_Text1[0].tl.queue.length) return;
    //if(Display_Text2[0]) if(Display_Text2[0].tl.queue.length) return;
    for(var I = 0; I < Z_TEXT.length; I++) if(Z_TEXT[I].tl.queue.length) return;
    if(TTT==TIME){
      switch(SSS){
        case 1:
          LINE_Texts.push({カード名:Card_Name});
          LINE_Texts[LINE_Texts.length-1].場所 = "旧" + Change_P;
          LINE_Texts[LINE_Texts.length-1].時間 = new Date();
          break;
        case 4:
          LINE_Texts.push({カード名:Card_Name});
          LINE_Texts[LINE_Texts.length-1].場所 = "新" + Change_P;
          LINE_Texts[LINE_Texts.length-1].時間 = new Date();
          break;
      };
    };
    if(TTT){
      TTT--;
      return;
    };
    Move();
    width = 2130;
    height = 1198;
    Size_change(width,height);
    return;
  });

  return scene;
};
