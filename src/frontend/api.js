export async function api(action, data) {
  const res = await fetch('/api', {
    method: 'POST',
    body: JSON.stringify({action, data}),
  });
  return res.json();
}

export async function upload(data) {
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: data,
  });
  return res.json();
}
