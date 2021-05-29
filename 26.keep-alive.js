export default {
  name: "keep-alive",
  abstract: true, // 不会有父子关心
  props: {
    include: [String, RegExp, Array],
    exlude: [String, RegExp, Array],
    max: [String, Number],
  },
  created() {
    this.cache = Object.create(null);
    this.keys = [];
  },
  destroyed() {
    for (let key in this.cache) {
      this.cache[key] = null;
    }
    this.keys = [];
  },
  mounted() {
    this.$watch("include", (val) => {
      pruneCache(this, (name) => matches(val, name));
    });
    this.$watch("exclude", (val) => {
      pruneCache(this, (name) => !matches(val, name));
    });
  },
  render() {
    const slot = this.$slots.default;
    const vnode = getFirstComponentChild(slot);
    const componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      const name = getComponentChild(slot);
      const { include, exclude } = this;
      // 不需要缓存
      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        return vnode;
      }
      const { cache, keys } = this;
      const key =
        vnode.key == null
          ? componentOptions.Ctor.cid +
            (componentOptions.tag ? `::${componentOptions.tag}` : "")
          : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // lru
        remove(keys, key);
        keys.push(key);
      } else {
        // 缓存组件
        cache[key] = vnode;
        keys.push(key);
        if (this.max && keys.length > parseInt(this.max)) {
          // 超过max则删除第一个
          this.cache[keys[0]] = null;
          this.keys.shift();
        }
      }
      // 给子组件标识，为了让组件走缓存
      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0]);
  },
};
