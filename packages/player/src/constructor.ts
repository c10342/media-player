import Template from "./js/template";
import { PlayerOptions } from "./types";
import {
  isArray,
  isUndef,
  checkData,
  EventEmit,
  isMobile
} from "@lin-media/utils";
import VideoPlayer from "./component/video-player";
import VideoPlayButton from "./component/video-play-button";
import VideoTime from "./component/video-time";
import VideoProgress from "./component/video-progress";
import VideoFullscreen from "./component/video-fullscreen";
import VideoLoading from "./component/video-loading";
import VideoVolume from "./component/video-volume";
import VideoSpeed from "./component/video-speed";
import VideoTip from "./component/video-tip";
import VideoControls from "./component/video-controls";
import MobilePlayButton from "./component/mobile-play-button";
import ShortcutKey from "./js/shortcut-key";
import { FullScreenTypeEnum } from "./config/enum";
import { PlayerEvents } from "./config/event";

class PlayerConstructor extends EventEmit {
  options: PlayerOptions;
  templateInstance: Template;
  private videoPlayerInstance: VideoPlayer | null;
  private playButtonInstance: VideoPlayButton | null;
  private videoTimeInstance: VideoTime | null;
  private videoProgressInstance: VideoProgress | null;
  private videoFullscreenInstance: VideoFullscreen | null;
  private videoLoadingInstance: VideoLoading | null;
  private videoVolumeInstance: VideoVolume | null;
  private videoSpeedInstance: VideoSpeed | null;
  private videoTipInstance: VideoTip | null;
  private videoControlsInstance: VideoControls | null;
  private shortcutKeyInstance: ShortcutKey | null;
  private mobilePlayButtonInstance: MobilePlayButton | null;
  isMobile = isMobile();
  constructor(options: PlayerOptions) {
    super();
    // 参数
    this.options = options;
    // 初始化模板，dom那些
    this.initTemplate();
    // 控制条上放的提示组件
    this.initVideoTip();
    // 初始化video相关东西
    this.initVideoPlayer();
    // 初始化控制条控制播放/暂停的组件
    this.initVideoPlayButton();
    // 初始化时间（当前时间/总时间），即音量控制组件右边那个东西
    this.initVideoTime();
    // 初始化进度条组件
    this.initVideoProgress();
    // 初始化全屏组件
    this.initVideoFullscreen();
    // 初始化loading组件
    this.initVideoLoading();
    // 初始化音量控制组件
    this.initVideoVolume();
    // 初始化倍数组件
    this.initVideoSpeed();
    // 初始化控制条组件
    this.initVideoControls();
    // 初始化快捷键
    this.initShortcutKey();
    // 初始化移动端播放按钮
    this.initMobilePlayButton();
  }

  private initTemplate() {
    this.templateInstance = new Template(this);
  }

  private initVideoTip() {
    this.videoTipInstance = new VideoTip(this);
  }

  private initVideoPlayer() {
    this.videoPlayerInstance = new VideoPlayer(this);
  }

  private initVideoPlayButton() {
    if (!this.isMobile) {
      this.playButtonInstance = new VideoPlayButton(this);
    }
  }

  private initMobilePlayButton() {
    if (this.isMobile) {
      this.mobilePlayButtonInstance = new MobilePlayButton(this);
    }
  }

  private initVideoTime() {
    if (!this.options.live) {
      this.videoTimeInstance = new VideoTime(this);
    }
  }

  private initVideoProgress() {
    if (!this.options.live) {
      this.videoProgressInstance = new VideoProgress(this);
    }
  }

  private initVideoFullscreen() {
    this.videoFullscreenInstance = new VideoFullscreen(this);
  }

  private initVideoLoading() {
    this.videoLoadingInstance = new VideoLoading(this);
  }

  private initVideoVolume() {
    if (!this.isMobile) {
      this.videoVolumeInstance = new VideoVolume(this);
    }
  }

  private initVideoSpeed() {
    const speedList = this.options.speedList;
    if (!this.options.live && isArray(speedList) && speedList.length > 0) {
      this.videoSpeedInstance = new VideoSpeed(this);
    }
  }

  private initVideoControls() {
    this.videoControlsInstance = new VideoControls(this);
  }

  private initShortcutKey() {
    const { hotkey } = this.options;
    if (hotkey) {
      this.shortcutKeyInstance = new ShortcutKey(this);
    }
  }

  // 销毁的时候需要把这些实例都设置成null，防止内存泄露
  private resetData() {
    this.videoPlayerInstance = null;
    this.playButtonInstance = null;
    this.videoTimeInstance = null;
    this.videoProgressInstance = null;
    this.videoFullscreenInstance = null;
    this.videoLoadingInstance = null;
    this.videoVolumeInstance = null;
    (this.templateInstance as any) = null;
    this.videoSpeedInstance = null;
    this.shortcutKeyInstance = null;
    this.videoControlsInstance = null;
    this.videoTipInstance = null;
  }

  // 移除元素
  private removeElement() {
    const containerElement = this.templateInstance.containerElement;
    (this.options.el as HTMLElement).removeChild(containerElement);
  }
  // 播放
  play() {
    this.videoElement?.play();
  }
  // 暂停
  pause() {
    this.videoElement?.pause();
  }
  // 跳转时间点
  seek(time: number) {
    if (!this.options.live) {
      const videoElement = this.videoElement;
      if (!isUndef(time) && !isUndef(videoElement)) {
        videoElement.currentTime = time;
      }
    }
  }
  // 设置提示
  setNotice(text: string, time?: number) {
    this.videoTipInstance?.setNotice(text, time);
  }
  // 切换清晰度
  switchDefinition(index: number) {
    this.videoPlayerInstance?.switchDefinition(index);
  }
  // 设置视频播放倍数
  setSpeed(playbackRate: number) {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement)) {
      playbackRate = checkData(playbackRate, 0, 2);
      videoElement.playbackRate = playbackRate;
    }
  }
  // 设置视频播放音量
  setVolume(volume: number) {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement)) {
      volume = checkData(volume, 0, 1);
      videoElement.volume = volume;
    }
  }
  // 切换视频播放状态
  toggle() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
  // video标签
  get videoElement() {
    return this.templateInstance?.videoElement;
  }
  // 视频是否处于暂停
  get paused() {
    return this.videoElement?.paused;
  }
  // 视频当前时间
  get currentTime() {
    return this.videoElement?.currentTime || 0;
  }
  // 视频总时间
  get duration() {
    return this.videoElement?.duration || 0;
  }
  // 音量
  get volume() {
    return this.videoElement?.volume ?? 1;
  }

  // 全屏
  get fullScreen() {
    return {
      request: (type: string) => {
        if (type === FullScreenTypeEnum.web) {
          this.videoFullscreenInstance?.enterWebFullscreen();
        } else if (type === FullScreenTypeEnum.browser) {
          this.videoFullscreenInstance?.enterBrowserFullScreen();
        }
      },
      cancel: (type: string) => {
        if (type === FullScreenTypeEnum.web) {
          this.videoFullscreenInstance?.exitWebFullscreen();
        } else if (type === FullScreenTypeEnum.browser) {
          this.videoFullscreenInstance?.exitBrowserFullscreen();
        }
      }
    };
  }
  // 销毁播放器
  destroy() {
    // 广播destroy事件，让各组件内部自行处理
    this.$emit(PlayerEvents.DESTROY);
    // 移除所有事件
    this.clear();
    // 移除元素
    this.removeElement();
    // 重置所有数据
    this.resetData();
  }
}

export default PlayerConstructor;
