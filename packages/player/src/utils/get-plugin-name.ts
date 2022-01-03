import { PLUGINNAME } from "@lin-media/utils";

export default function getPluginName(ctor: any): string {
  return ctor[PLUGINNAME] || ctor.name;
}
