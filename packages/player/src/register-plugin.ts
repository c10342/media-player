import ShortcutKey from "./plugins/shortcut-key";
import DomResizeObserver from "./plugins/resize-observer";
import { registerPlugin } from "./global-api/plugin";
import Plugin from "./plugins/plugin";
import { isMobile } from "@lin-media/utils";

const options = { init: true };

registerPlugin("Plugin", Plugin);

registerPlugin("DomResizeObserver", DomResizeObserver, options);

registerPlugin("ShortcutKey", ShortcutKey, { init: !isMobile() });
