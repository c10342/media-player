import MediaPlayer from "@lin-media/player";

const setoptionsButton = document.querySelector(".setoptions");

const destroyoptionsButton = document.querySelector(".destroyoptions");

const playButton = document.querySelector(".play");

const pauseButton = document.querySelector(".pause");

const seekButton = document.querySelector(".seek");

const setNoticeButton = document.querySelector(".setNotice");

const switchQualityButton = document.querySelector(".switchQuality");

const setSpeedButton = document.querySelector(".setSpeed");

const setVolumeButton = document.querySelector(".setVolume");

const toggleButton = document.querySelector(".toggle");

const fullscreenButton = document.querySelector(".fullscreen");

const videoElementButton = document.querySelector(".videoElement");

const currentTimeButton = document.querySelector(".currentTime");

const durationButton = document.querySelector(".duration");

const volumeButton = document.querySelector(".volume");

const pausedButton = document.querySelector(".paused");

const destroyButton = document.querySelector(".destroy");

function addEventListener(player: MediaPlayer) {
  setoptionsButton?.addEventListener("click", () => {
    // (player as any).setBarView('https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg');
    // (player as any).highlight.set(highlightList);
    // (player as any).screenshot.snapshot();
    // speedList[0].label = "123";
    // console.log(speedList, player.options);
  });
  destroyoptionsButton?.addEventListener("click", () => {
    (player as any).preview.destroyPreview();
  });

  playButton?.addEventListener("click", function () {
    player.play();
  });

  pauseButton?.addEventListener("click", function () {
    player.pause();
  });

  seekButton?.addEventListener("click", function () {
    player.seek(100);
  });

  setNoticeButton?.addEventListener("click", function () {
    player.setNotice("你好", 1000);
  });

  switchQualityButton?.addEventListener("click", function () {
    player.switchDefinition(1);
  });
  setSpeedButton?.addEventListener("click", function () {
    player.setSpeed(1.7);
  });
  setVolumeButton?.addEventListener("click", function () {
    player.setVolume(0.8);
  });
  toggleButton?.addEventListener("click", function () {
    player.toggle();
  });
  fullscreenButton?.addEventListener("click", function () {
    player.requestFullscreen("web");
  });
  videoElementButton?.addEventListener("click", function () {
    console.log(player.videoElement);
  });
  currentTimeButton?.addEventListener("click", function () {
    console.log(player.currentTime);
  });
  durationButton?.addEventListener("click", function () {
    console.log(player.duration);
  });
  volumeButton?.addEventListener("click", function () {
    console.log(player.volume);
  });
  pausedButton?.addEventListener("click", function () {
    console.log(player.paused);
  });

  destroyButton?.addEventListener("click", function () {
    player.destroy();
  });
}

export default addEventListener;
