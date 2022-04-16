import ShortcutKey from "./plugins/shortcut-key";
import DomResizeObserver from "./plugins/resize-observer";
import { registerPlugin } from "./global-api/plugin";

const options = { init: true };

registerPlugin("DomResizeObserver", DomResizeObserver, options);

registerPlugin("ShortcutKey", ShortcutKey, options);
