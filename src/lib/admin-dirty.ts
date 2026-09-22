type Listener = () => void;

const dirtyKeys = new Set<string>();
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!dirtyKeys.size) return;
  event.preventDefault();
  event.returnValue = "";
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", handleBeforeUnload);
}

export function setAdminDirty(key: string, dirty: boolean) {
  if (dirty) dirtyKeys.add(key);
  else dirtyKeys.delete(key);
  emit();
}

export function clearAdminDirty() {
  if (!dirtyKeys.size) return;
  dirtyKeys.clear();
  emit();
}

export function hasAdminDirty() {
  return dirtyKeys.size > 0;
}

export function getAdminDirtyKeys() {
  return [...dirtyKeys];
}

export function subscribeAdminDirty(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
