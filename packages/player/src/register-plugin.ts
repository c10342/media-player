import ShortcutKey from "./plugins/shortcut-key";
import DomResizeObserver from "./plugins/resize-observer";
import { registerPlugin } from "./global-api/plugin";
import Plugin from "./plugins/plugin";

const options = { init: true };

registerPlugin("Plugin", Plugin);

registerPlugin("DomResizeObserver", DomResizeObserver, options);

registerPlugin("ShortcutKey", ShortcutKey, options);
