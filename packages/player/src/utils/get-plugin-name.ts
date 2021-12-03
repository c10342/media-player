export default function getPluginName(ctor: any): string {
  return ctor.pluginName || ctor.name;
}
