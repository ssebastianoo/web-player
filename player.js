class WebPlayer {
  constructor(options = {}) {
    this.songs = options.songs || [];
    this.mainColor = options.mainColor || '#a36dde';
    this.accentColor = options.accentColor || '#8856bf';
    this.textColor = options.textColor || '#fff';
    this.element = document.querySelector(options.element);
    this.images = options.images;

    this.currentSong = 0;
    this.audio = this.createAudio();
    this.started = false;
    this.paused = false;
  }

  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  createAudio() {
    const audio = new Audio(this.songs[this.currentSong].src);
    audio.volume = 0.1;
    audio.preload = 'auto';
    return audio;
  }

  sync() {
    if (
      localStorage.getItem('currentSong') &&
      localStorage.getItem('currentTime')
    ) {
      this.currentSong = localStorage.getItem('currentSong');
      this.audio.src = this.songs[this.currentSong].src;
      this.audio.currentTime = localStorage.getItem('currentTime');
      this.audio.load();
    }

    if (localStorage.getItem('paused') === 'true') {
      this.paused = localStorage.getItem('paused');
      this.element.querySelector('img').src = this.images[1];
    }
  }

  setup() {
    this.sync();
    this.audio.autoplay = true;

    if (!this.paused) {
      this.audio.play();
      const tryPlay = setInterval(() => {
        if (!this.started) {
          this.audio.play();
          if (!this.audio.paused) {
            this.started = true;
          }
        } else {
          clearInterval(tryPlay);
        }
      }, 300);
    } else {
      this.audio.pause();
    }

    setInterval(() => {
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
    }, 300);

    setInterval(() => {
      localStorage.setItem('currentSong', this.currentSong);
      localStorage.setItem('currentTime', this.audio.currentTime);
      localStorage.setItem('volume', this.audio.volume);
    }, 1000);

    this.element.addEventListener('click', (e) => {
      this.element.animate([{ scale: '1' }, { scale: '0.8' }, { scale: '1' }], {
        duration: 300,
        easing: 'cubic-bezier(0.08,0.82,0.17,1)',
        fill: 'forwards',
      });
      if (this.audio.paused) {
        this.audio.play();

        this.element.querySelector('img').src = this.images[0];
        localStorage.setItem('paused', false);
      } else {
        this.audio.pause();
        this.element.querySelector('img').src = this.images[1];
        localStorage.setItem('paused', true);
      }
    });
  }
}
