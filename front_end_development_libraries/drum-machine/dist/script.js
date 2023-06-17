$(document).ready(function () {
  const actions = {
    keydown: "mousedown",
    keyup: "mouseup" };


  Object.keys(actions).forEach(action => {
    document.addEventListener(action, function (event) {
      switch (event.keyCode) {
        case 81:
          $("#tom-1").trigger(actions[action]);
          break;
        case 87:
          $("#tom-2").trigger(actions[action]);
          break;
        case 69:
          $("#tom-3").trigger(actions[action]);
          break;
        case 65:
          $("#open-hat").trigger(actions[action]);
          break;
        case 83:
          $("#crash").trigger(actions[action]);
          break;
        case 68:
          $("#ride").trigger(actions[action]);
          break;
        case 90:
          $("#closed-hat").trigger(actions[action]);
          break;
        case 88:
          $("#snare").trigger(actions[action]);
          break;
        case 67:
          $("#kick").trigger(actions[action]);
          break;
        default:
          break;}

    });
  });

  $("body").fadeIn(3000);
  $("body").css("display", "flex");
});

$(".clip").prop("volume", 0.5);

document.getElementById("volume-slider").addEventListener("input", action => {
  console.log(action.target.value);
  $(".clip").prop("volume", action.target.value * 0.01);
});

$("button").on("mousedown", function (eventObject) {
  $("#display").text(
  eventObject.target.id.
  replace(/-/, " ").
  replace(/^./, match => match.toUpperCase()));

  $(eventObject.target).css("border-style", "inset");
  let clip = document.getElementById(eventObject.target.innerText);
  //clip.currentTime = 0;
  clip.fastSeek(0);
  clip.play();
});
//$(eventObject.target).css("border-style", "outset");
$("button").on("mouseup", function (eventObject) {
  $(eventObject.target).css("border-style", "outset");
});