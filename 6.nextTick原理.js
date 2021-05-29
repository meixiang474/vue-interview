let cbs = [];
let pending = false;
function flush() {
  cbs.forEach((item) => item());
  cbs = [];
}

export function nextTick(cb) {
  cbs.push(cb);
  if (!pending) {
    pending = true;
    setTimeout(() => {
      flush();
      pending = false;
    }, 0);
  }
}
