export function getDeviceId(): string {
  let id = localStorage.getItem('shrek_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('shrek_device_id', id);
  }
  return id;
}
