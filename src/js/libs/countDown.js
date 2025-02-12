export const setCountdown = (duration, dest, callback) => {
    let timeLeft = duration;

    function formatTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;

        let timeString = "";
        if (hours > 0) {
            timeString += `${String(hours).padStart(2, '0')}:`;
        }
        if (hours > 0 || minutes > 0) {
            timeString += `${String(minutes).padStart(2, '0')}:`;
        } else {
            timeString += "00:";
        }
        timeString += `${String(secs).padStart(2, '0')}`;

        return timeString;
    }

    function updateTimer() {
        dest.textContent = formatTime(timeLeft);
        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateTimer, 1000);
        } else {
            callback();
        }
    }

    updateTimer();
}