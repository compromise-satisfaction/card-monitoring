enchant();

function Game_load(width,height){
  var game = new Game(width,height);
  game.fps = 60;
  game.onload = function(){

    var Start_Scene = function(){
      var Scenes = new Scene();

      var B = 3;
      var BGMs = [];
      var Buttons = [];

      function BGM_make(N){
        var I = BGMs.length;
        BGMs[I] = document.createElement("audio");
        BGMs[I].src = N + ".m4a";
        BGMs[I].addEventListener("ended",function(e){
          BGMs[I].currentTime = 0;
          BGMs[I].play();
          return;
        });
        return;
      };

      function BGM_Button_Set(N){
        BGM_make(N);
        Button_Set(0,N,"-");
        Button_Set(1,N,"停止");
        Button_Set(2,N,"+");
        return;
      };

      function Button_Set(X,Y,T){
        X *= width/3;
        var I = Buttons.length;
        Buttons[I] = new Entity();
        Buttons[I].moveTo(X,height/10*Y);
        Buttons[I].width = width/3;
        Buttons[I].height = height/10;
        Buttons[I]._element = document.createElement("input");
        Buttons[I]._element.type = "submit";
        Buttons[I]._element.N = Y - 1;
        Buttons[I]._element.value = T;
        Buttons[I]._style["font-size"] = height/15;
        Buttons[I].backgroundColor = "buttonface";
        Scenes.addChild(Buttons[I]);
        Buttons[I]._element.onclick = function(e){
          switch(this.value){
            case "+":
              BGMs[this.N].volume = BGMs[this.N].volume + 0.1;
              if(BGMs[this.N].volume > 1) BGMs[this.N].volume = 1;
              break;
            case "-":
              BGMs[this.N].volume = BGMs[this.N].volume - 0.1;
              if(BGMs[this.N].volume < 0) BGMs[this.N].volume = 0;
              break;
            case "再生":
              this.value = "停止";
              window.localStorage.setItem("曲",this.N);
              break;
            case "停止":
              this.value = "再生";
              break;
          };
          return;
        };
      };

      for(var I = 1; I <= B; I++) BGM_Button_Set(I);

      return(Scenes);
    };

    game.replaceScene(Start_Scene());
    return;
  };
  game.start();
};
