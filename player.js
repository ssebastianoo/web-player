class WebPlayer {
  constructor(options = {}) {
    this.songs = options.songs || [];
    this.mainColor = options.mainColor || '#a36dde';
    this.accentColor = options.accentColor || '#8856bf';
    this.textColor = options.textColor || '#fff';

    this.id = 'b59a2567b-45a2-4ce9-93b2-bf82f0bb5c22';
    this.currentSong = 0;
    this.player = this.createPlayer();
    this.style = this.createStyle();
    this.audio = this.craeteAudio();
    this.input = this.player.querySelector(`.${this.id}_time`);
    this.songTitle = this.player.querySelector(`#${this.id}_songTitle`);
    this.currentTime = this.player.querySelector(`#${this.id}_currentTime`);
    this.duration = this.player.querySelector(`#${this.id}_duration`);
    this.playIcon = this.player.querySelector(`#${this.id}_pause`);
    this.volume = this.player.querySelector(`#${this.id}_volume`);
    this.volume.value = this.audio.volume * 100;
    this.started = false;
  }

  createPlayer() {
    const player = document.createElement('div');
    player.className = `${this.id}_player`;

    const playerHTML = `
        <div class="${this.id}_cover">
            <p id="${this.id}_musicSymbol">🎵</p>
            <p id="${this.id}_songTitle">${
      this.songs[this.currentSong].title
    }</p>
        </div>
        <div class="${this.id}_controls">
            <div class="${this.id}_playback-container ${this.id}_line">
            <p id="${this.id}_previous">⏪</p>
            <p id="${this.id}_pause">⏸️</p>
            <p id="${this.id}_next">⏩</p>
            </div>
            <div class="${this.id}_volume-container ${this.id}_line">
            <p>🔇</p>
            <input id="${
              this.id
            }_volume" type="range" min="0" max="100" value="50">
            <p>🔊</p>
            </div>
        </div>
        <div class="${this.id}_timeline ${this.id}_line">
            <code id="${this.id}_currentTime">0:00</code>
            <input class="${
              this.id
            }_time" type="range" min="1" max="100" value="50">
            <code id="${this.id}_duration">0:00</code>
        </div>
    `;
    player.innerHTML = playerHTML;
    return player;
  }

  createStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes ${this.id}_slideIn {
        to {
            transform: translateX(0);
        }
        }

        .${this.id}_player {
        width: 150px;
        background-color: rgba(83, 84, 84, 0.5);
        backdrop-filter: blur(3px);
        padding: 10px;
        border-radius: 7px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue",sans-serif;
        color: ${this.textColor};
        position: fixed;
        bottom: 20px;
        right: 20px;
        transform: translateX(200%);
        user-select: none;
        z-index: 999;
        height: 115px;
        transition: height 0.5s cubic-bezier(0.08,0.82,0.17,1);
        }

        .${this.id}_player p {
        margin: 0;
        }

        .${this.id}_cover {
        background-color: ${this.mainColor};
        width: 100%;
        height: 90px;  
        display: flex;
        align-items: flex-end;
        border-radius: 5px;
        position: relative;
        }

        #${this.id}_musicSymbol {
        font-size: 22px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        }

        #${this.id}_songTitle {
        padding: 6px 8px;
        font-size: 11px;
        }

        .${this.id}_line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        }

        .${this.id}_timeline code {
        font-size: 11px;
        }

        .${this.id}_player input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        margin: 0;
        background: ${this.accentColor};
        accent-color: ${this.mainColor};
        height: 8px;
        border-radius: 20px;
        }

        @keyframes ${this.id}_appear {
        to {
            opacity: 1;
        }
        }

        .${this.id}_controls {
        display: none;
        opacity: 0;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
        }

        .${this.id}_controls p {
        font-size: 13px;
        }

        .${this.id}_controls .${this.id}_playback-container p {
        cursor: pointer;
        }

        .${this.id}_player:hover {
        height: 168px;
        }

        .${this.id}_player:hover .${this.id}_controls {
        animation: ${this.id}_appear 0.5s ease forwards;
        }
    `;
    return style;
  }

  craeteAudio() {
    const audio = new Audio(this.songs[this.currentSong].src);
    audio.volume = 0.3;
    audio.preload = 'auto';
    return audio;
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
  }

  sync() {
    if (
      localStorage.getItem('currentSong') &&
      localStorage.getItem('currentTime') &&
      localStorage.getItem('volume')
    ) {
      this.currentSong = localStorage.getItem('currentSong');
      this.audio.src = this.songs[this.currentSong].src;
      this.audio.currentTime = localStorage.getItem('currentTime');
      this.songTitle.innerText = this.songs[this.currentSong].title;
      this.audio.volume = localStorage.getItem('volume');
      this.volume.value = this.audio.volume * 100;
      this.audio.load();
    }
  }

  setup() {
    document.head.appendChild(this.style);
    document.body.appendChild(this.player);
    this.sync();
    this.audio.play();
    this.audio.autoplay = true;

    const tryPlay = setInterval(() => {
      if (!this.started) {
        this.audio.play();
        if (!this.audio.paused) {
          this.started = true;
          this.playIcon.innerText = '⏯️';
          this.player.animate([{ transform: 'translateX(0)' }], {
            duration: 700,
            easing: 'cubic-bezier(0.08,0.82,0.17,1)',
            fill: 'forwards',
          });
        }
      } else {
        clearInterval(tryPlay);
      }
    }, 300);

    let isMouseDown = false;

    this.input.addEventListener('input', () => {
      this.isMouseDown = true;
    });

    this.input.addEventListener('change', (e) => {
      this.isMouseDown = false;
      this.audio.currentTime = e.target.value;
    });

    setInterval(() => {
      this.currentTime.innerText = this.formatTime(this.audio.currentTime);
      this.duration.innerText = this.formatTime(this.audio.duration);

      if (!isMouseDown) {
        this.input.value = this.audio.currentTime;
        this.input.max = this.audio.duration;

        if (this.audio.currentTime >= this.audio.duration) {
          if (this.currentSong < this.songs.length - 1) {
            this.currentSong++;
          } else {
            this.currentSong = 0;
          }
          this.audio.src = this.songs[this.currentSong].src;
          this.songTitle.innerText = this.songs[this.currentSong].title;

          this.audio.currentTime = 0;
          this.input.max = this.audio.duration;
          this.audio.load();
        }
      }
    }, 300);

    setInterval(() => {
      localStorage.setItem('currentSong', this.currentSong);
      localStorage.setItem('currentTime', this.audio.currentTime);
      localStorage.setItem('volume', this.audio.volume);
    }, 1000);

    this.volume.addEventListener('input', () => {
      this.audio.volume = this.volume.value / 100;
    });

    let alreadyQuit = false;

    this.player.addEventListener('mouseover', () => {
      alreadyQuit = false;

      setTimeout(() => {
        if (!alreadyQuit) {
          this.player.querySelector(`.${this.id}_controls`).style.display =
            'flex';
        }
      }, 100);
    });

    this.player.addEventListener('mouseleave', () => {
      alreadyQuit = true;
      this.player.querySelector(`.${this.id}_controls`).style.display = 'none';
    });

    this.playIcon.addEventListener('click', (e) => {
      if (this.audio.paused) {
        e.target.innerText = '⏯️';
        this.audio.play();
      } else {
        e.target.innerText = '⏸️';
        this.audio.pause();
      }
    });

    this.player
      .querySelector(`#${this.id}_previous`)
      .addEventListener('click', () => {
        if (this.currentSong > 0) {
          this.currentSong--;
        } else {
          this.currentSong = this.songs.length - 1;
        }
        this.audio.src = this.songs[this.currentSong].src;
        this.songTitle.innerText = this.songs[this.currentSong].title;

        this.audio.currentTime = 0;
        this.input.max = this.audio.duration;
        this.audio.load();
      });

    this.player
      .querySelector(`#${this.id}_next`)
      .addEventListener('click', () => {
        if (this.currentSong < this.songs.length - 1) {
          this.currentSong++;
        } else {
          this.currentSong = 0;
        }
        this.audio.src = this.songs[this.currentSong].src;
        this.songTitle.innerText = this.songs[this.currentSong].title;

        this.audio.currentTime = 0;
        this.input.max = this.audio.duration;
        this.audio.load();
      });
  }
}
