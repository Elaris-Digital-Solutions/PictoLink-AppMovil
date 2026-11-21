(() => {
  const bk = JSON.parse(localStorage.getItem('__bk_sb') || '{}');
  for (const [n, v] of Object.entries(bk)) document.cookie = `${n}=${v}; path=/; max-age=34560000; samesite=lax`;
  localStorage.removeItem('__bk_sb');
  return { restauradas: Object.keys(bk), respaldoBorrado: localStorage.getItem('__bk_sb') === null };
})()
