(() => {
  // Respaldo EN EL TELÉFONO (nunca sale de acá): sólo se devuelven nombres y longitudes.
  const sb = document.cookie.split('; ').filter((c) => c.startsWith('sb-'));
  const bk = Object.fromEntries(sb.map((c) => { const i = c.indexOf('='); return [c.slice(0, i), c.slice(i + 1)]; }));
  localStorage.setItem('__bk_sb', JSON.stringify(bk));
  for (const n of Object.keys(bk)) document.cookie = `${n}=roto; path=/; max-age=3600; samesite=lax`;
  return { respaldadas: Object.keys(bk), longitudes: Object.values(bk).map((v) => v.length) };
})()
