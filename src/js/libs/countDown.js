export const setCountdown = (props) => {
  const {
    duration: initialDuration = 0,
    dest = null,
    onFinish,
    onUpdate,
  } = props;

  let timeLeft = Math.max(0, Math.floor(initialDuration));
  let timerId = null;

  function resolveDest() {
    if (!dest) return null;
    if (typeof dest === "string") return document.querySelector(dest);
    if (dest instanceof Node) return dest;
    return null;
  }
  const destNode = resolveDest();

  function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [minutes, secs].map((v) => String(v).padStart(2, "0")).join(":");
  }

  function render() {
    if (destNode) destNode.textContent = formatTime(timeLeft);
  }

  function start(startFrom = timeLeft) {
    if (timerId !== null) return;

    timeLeft = Math.max(0, Math.floor(startFrom));
    render();
    if (typeof onUpdate === "function") onUpdate(timeLeft);

    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        if (typeof onUpdate === "function") onUpdate(timeLeft);
        render();
      } else {
        stop();
        if (typeof onFinish === "function") onFinish();
      }
    }, 1000);
  }

  function stop() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function restart(newDuration = initialDuration) {
    stop();
    timeLeft = Math.max(0, Math.floor(newDuration));
    start();
  }

  return {
    start,
    stop,
    restart,
    getTimeLeft: () => timeLeft,
  };
};
