function createEvent(eventName: string) {
  const event = document.createEvent("HTMLEvents");
  event.initEvent(eventName, false, false);
  return event;
}

HTMLMediaElement.prototype.pause = function () {
  this.dispatchEvent(createEvent("pause"));
};

HTMLMediaElement.prototype.play = function () {
  this.dispatchEvent(createEvent("play"));
  return Promise.resolve();
};

HTMLMediaElement.prototype.canPlayType = function () {
  return "maybe";
};
