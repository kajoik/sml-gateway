setInterval(() => {
  const value = Math.round(Math.random() * 4000);
  process.send?.({ ts: Date.now(), value, source: "random" });
}, 1000);
