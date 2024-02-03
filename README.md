# Add music to your website!

An easy to use widget to add music to your website with a simple script, you can see a demo [here](https://player.gir8.it)

![Widget Screenshot](https://raw.githubusercontent.com/ssebastianoo/web-player/main/screenshot.png)

## Usage

```
 <script src="https://cdn.jsdelivr.net/gh/ssebastianoo/web-player@main/player.js"></script>
    <script>
      const player = new WebPlayer({
        songs: [
          {
            title: 'Kanye West - All Mine',
            src: './songs/Kanye West - All Mine.mp3',
          },
          {
            title: 'Mac Miller - The Spins',
            src: './songs/Mac Miller - The Spins.mp3',
          }
        ],
      });
      player.setup();
    </script>
```
