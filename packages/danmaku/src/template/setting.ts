interface AreaListItem {
  label: string;
  position: string;
  checked?: boolean;
}

interface SwitchListItem {
  label: string;
  className: string;
  open: boolean;
}
interface ProgressListItem {
  label: string;
  wrapperClassName: string;
  progressClassName: string;
  ballClassName: string;
}
interface Params {
  areaList: AreaListItem[];
  showArea: string;
  switchList: SwitchListItem[];
  progressList: ProgressListItem[];
}

function getAreaListHtml(areaList: AreaListItem[], showArea: string) {
  return `
    <div class="danmaku-setting-area">
    <div class="danmaku-setting-label">${showArea}</div>
    <div class="danmaku-area">
    ${areaList
      .map((value) => {
        return `
        <span
          class="danmaku-area-span ${
            value.checked ? "danmaku-radio-checked" : ""
          } "
          data-position="${value.position}"
        >
          <span class="danmaku-radio"></span>
          <span>${value.label}</span>
        </span>
        `;
      })
      .join("")}
    </div>
  </div>
    `;
}

function getSwitchListHtml(switchList: SwitchListItem[]) {
  return switchList
    .map((value) => {
      return `
        <div class="danmaku-setting-item">
            <span class="danmaku-setting-label">${value.label}</span>
            <div
            class="danmaku-setting-text ${
              value.open ? "danmaku-setting-open" : "danmaku-setting-close"
            } ${value.className}"
            ></div>
        </div>
        `;
    })
    .join("");
}

function getProgressListHtml(progressList: ProgressListItem[]) {
  return progressList
    .map((value) => {
      return `
        <div class="danmaku-setting-item">
            <span class="danmaku-setting-label">${value.label}</span>
            <div class="danmaku-progress ${value.wrapperClassName}">
            <div class="danmaku-played ${value.progressClassName}">
                <span class="danmaku-ball ${value.ballClassName}"></span>
            </div>
            </div>
        </div>
        `;
    })
    .join("");
}

export default function getSettingHtml({
  areaList,
  showArea,
  switchList,
  progressList
}: Params) {
  return `
    <span class="player-icon-item danmaku-icon-setting danmaku-icon-item"></span>
    <div class="danmaku-float-container">
        ${getAreaListHtml(areaList, showArea)}
        ${getSwitchListHtml(switchList)}
        ${getProgressListHtml(progressList)}
    </div>
    `;
}
