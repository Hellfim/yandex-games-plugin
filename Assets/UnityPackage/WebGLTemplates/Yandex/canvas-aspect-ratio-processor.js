const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
canvas.style.height = "100%";
canvas.style.width = vh * ({{{WIDTH}}}/{{{HEIGHT}}}) + "px";