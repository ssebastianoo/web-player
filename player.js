const songs = [
  {
    title: 'Kanye West - All Mine',
    src: './songs/Kanye West - All Mine.mp3',
  },
  {
    title: 'Mac Miller - The Spins',
    src: './songs/Mac Miller - The Spins.mp3',
  },
  {
    title: 'Linkin Park - In the End',
    src: './songs/Linkin Park - In the End.flac',
  },
  {
    title: 'MGMT - Electric Feel (Justice Remix)',
    src: './songs/MGMT - Electric Feel (Justice Remix).mp3',
  },
];

let currentSong = 0;
const audio = new Audio(songs[currentSong].src);
audio.controls = true;
audio.autoplay = true;
audio.preload = 'auto';
let started = false;

const id = 'b59a2567b-45a2-4ce9-93b2-bf82f0bb5c22';

const player = document.createElement('div');
player.className = `${id}_player`;

const playerHTML = `
  <div class="${id}_cover">
    <p id="${id}_musicSymbol">🎵</p>
    <p id="${id}_songTitle">${songs[currentSong].title}</p>
  </div>
  <div class="${id}_controls">
    <div class="${id}_playback-container ${id}_line">
      <p id="${id}_previous">⏪</p>
      <p id="${id}_pause">⏸️</p>
      <p id="${id}_next">⏩</p>
    </div>
    <div class="${id}_volume-container ${id}_line">
      <p>🔇</p>
      <input id="${id}_volume" type="range" min="0" max="100" value="50">
      <p>🔊</p>
    </div>
  </div>
  <div class="${id}_timeline ${id}_line">
    <code id="${id}_currentTime">0:00</code>
    <input class="${id}_time" type="range" min="1" max="100" value="50">
    <code id="${id}_duration">0:00</code>
  </div>
`;

player.innerHTML = playerHTML;

const style = document.createElement('style');
const mainColor = '#a36dde';
const accentColor = '#8856bf';
const textColor = '#fff';

style.innerHTML = `

@keyframes ${id}_slideIn {
  to {
    transform: translateX(0);
  }
}

.${id}_player {
  width: 150px;
  background-color: rgba(83, 84, 84, 0.5);
  backdrop-filter: blur(3px);
  padding: 10px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue",sans-serif;
  color: ${textColor};
  position: fixed;
  bottom: 20px;
  right: 20px;
  transform: translateX(200%);
  user-select: none;
  z-index: 999;
  height: 115px;
  transition: height 0.5s cubic-bezier(0.08,0.82,0.17,1);
}

.${id}_player p {
  margin: 0;
}

.${id}_cover {
  background-color: ${mainColor};
  width: 100%;
  height: 90px;  
  display: flex;
  align-items: flex-end;
  border-radius: 5px;
  position: relative;
}

#${id}_musicSymbol {
  font-size: 22px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#${id}_songTitle {
  padding: 6px 8px;
  font-size: 11px;
}

.${id}_line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.${id}_timeline code {
  font-size: 11px;
}

.${id}_player input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  margin: 0;
  background: ${accentColor};
  accent-color: ${mainColor};
  height: 8px;
  border-radius: 20px;
}

@keyframes ${id}_appear {
  to {
    opacity: 1;
  }
}

.${id}_controls {
  display: none;
  opacity: 0;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.${id}_controls p {
  font-size: 13px;
}

.${id}_controls .${id}_playback-container p {
  cursor: pointer;
}

.${id}_player:hover {
  height: 168px;
}

.${id}_player:hover .${id}_controls {
  animation: ${id}_appear 0.5s ease forwards;
}
`;

function setTime(e) {
  isMouseDown = false;
  audio.currentTime = e.target.value;
}

let isMouseDown = false;

// make a function to transform song seconds into readable time
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${minutes}:${formattedSeconds}`;
}

window.addEventListener('load', () => {
  document.head.appendChild(style);
  document.body.appendChild(player);
  audio.volume = 0.3;
  audio.play();
  const input = player.querySelector(`.${id}_time`);
  const songTitle = player.querySelector(`#${id}_songTitle`);
  const currentTime = player.querySelector(`#${id}_currentTime`);
  const duration = player.querySelector(`#${id}_duration`);
  const playIcon = player.querySelector(`#${id}_pause`);
  const volume = player.querySelector(`#${id}_volume`);
  volume.value = audio.volume * 100;

  if (
    localStorage.getItem('currentSong') &&
    localStorage.getItem('currentTime') &&
    localStorage.getItem('volume')
  ) {
    currentSong = localStorage.getItem('currentSong');
    audio.src = songs[currentSong].src;
    audio.currentTime = localStorage.getItem('currentTime');
    songTitle.innerText = songs[currentSong].title;
    audio.volume = localStorage.getItem('volume');
    volume.value = audio.volume * 100;
    audio.load();
  }

  const tryPlay = setInterval(() => {
    if (!started) {
      audio.play();
      if (!audio.paused) {
        started = true;
        playIcon.innerText = '⏯️';
        player.animate([{ transform: 'translateX(0)' }], {
          duration: 700,
          easing: 'cubic-bezier(0.08,0.82,0.17,1)',
          fill: 'forwards',
        });
      }
    } else {
      clearInterval(tryPlay);
    }
  }, 300);

  input.addEventListener('input', () => {
    isMouseDown = true;
  });
  input.addEventListener('change', setTime);

  setInterval(() => {
    currentTime.innerText = formatTime(audio.currentTime);
    duration.innerText = formatTime(audio.duration);
    if (!isMouseDown) {
      input.value = audio.currentTime;
      input.max = audio.duration;

      if (audio.currentTime >= audio.duration) {
        if (currentSong < songs.length - 1) {
          currentSong++;
        } else {
          currentSong = 0;
        }
        audio.src = songs[currentSong].src;
        songTitle.innerText = songs[currentSong].title;

        audio.currentTime = 0;
        input.max = audio.duration;
        audio.load();
      }
    }
  }, 300);

  setInterval(() => {
    localStorage.setItem('currentSong', currentSong);
    localStorage.setItem('currentTime', audio.currentTime);
    localStorage.setItem('volume', audio.volume);
  }, 1000);

  volume.addEventListener('input', () => {
    audio.volume = volume.value / 100;
  });

  let alreadyQuit = false;

  player.addEventListener('mouseover', () => {
    alreadyQuit = false;

    setTimeout(() => {
      if (!alreadyQuit) {
        player.querySelector(`.${id}_controls`).style.display = 'flex';
      }
    }, 100);
  });

  player.addEventListener('mouseleave', () => {
    alreadyQuit = true;
    player.querySelector(`.${id}_controls`).style.display = 'none';
  });

  playIcon.addEventListener('click', (e) => {
    if (audio.paused) {
      e.target.innerText = '⏯️';
      audio.play();
    } else {
      e.target.innerText = '⏸️';
      audio.pause();
    }
  });

  player.querySelector(`#${id}_previous`).addEventListener('click', () => {
    if (currentSong > 0) {
      currentSong--;
    } else {
      currentSong = songs.length - 1;
    }
    audio.src = songs[currentSong].src;
    songTitle.innerText = songs[currentSong].title;

    audio.currentTime = 0;
    input.max = audio.duration;
    audio.load();
  });

  player.querySelector(`#${id}_next`).addEventListener('click', () => {
    if (currentSong < songs.length - 1) {
      currentSong++;
    } else {
      currentSong = 0;
    }
    audio.src = songs[currentSong].src;
    songTitle.innerText = songs[currentSong].title;

    audio.currentTime = 0;
    input.max = audio.duration;
    audio.load();
  });
});
