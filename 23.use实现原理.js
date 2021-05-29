Vue.use = function (plugin) {
  const installedPlugins =
    this._installedPlugins || (this._installedPlugins = []);

  // 如果已经use过插件，直接返回
  if (installedPlugins.indexOf(plugin) > -1) return this;

  const args = arguments.slice(1);
  args.unshift(this);

  if (typeof plugin.install === "function") {
    plugin.install.apply(plugin, args);
  } else if (typeof plugin === "function") {
    plugin.apply(plugin, args);
  }

  installedPlugins.push(plugin);
  return this;
};
