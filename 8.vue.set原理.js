export function set(target, key, val) {
  if (Array.isArray(target) && typeof key === "number") {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val); // 数组使用splice来触发更新
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = target.__ob__;
  if (!ob) {
    // target不是响应式的
    target[key] = val;
    return val;
  }
  // 将val定义成响应式
  defineReactive(ob.value, key, val);
  // 手动触发一次更新
  ob.dep.notify();
  return val;
}
