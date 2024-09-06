const { Gtk } = imports.gi;

import Mpd from '../services/mpd.js';
import MarqueeLabel from './marqueeLabel.js'

const Mpris = await Service.import("mpris");

const AspectFrame = Widget.subclass(Gtk.AspectFrame);

function lengthString(length) {
  return (
    `${Math.floor(length / 60)
      .toString()
      .padStart(2, "0")}:` +
    `${Math.floor(length % 60)
      .toString()
      .padStart(2, "0")}`
  );
}

const albumCover = Widget.Box({
    className: "cover",
    setup: (self) => self.hook(Mpris, () => {
        const mpd = Mpris.getPlayer("mpd");
        self.css = `background-image: url("${mpd?.coverPath}");`;
    }),
});

const positionLabel = Widget.Label({
    className: 'position-label',
    setup: (self) => self.poll(500, () => {
        Mpd.send("status")
        .then((msg) => {
          const elapsed = msg?.match(/elapsed: (\d+\.\d+)/)?.[1];
          self.label = `${lengthString(elapsed || 0)} / ${lengthString(Mpd.duration || 0)}`;
        })
        .catch((error) => logError(error));
    }),
});

const positionSlider = Widget.Slider({
    className: 'position',
    vpack: 'end',
    drawValue: false,
    onChange: ({ value }) => {
        Mpd.seekCur(value * Mpd.duration);
    },
    setup: (self) => {
        self.poll(500, () => {
            Mpd.send("status")
            .then((msg) => {
                const elapsed = msg?.match(/elapsed: (\d+\.\d+)/)?.[1];
                self.value = elapsed / Mpd.duration || 0;
            })
            .catch((error) => logError(error));
        });
    },
});

const songTitle = Widget.Box({
    className: 'title',
    children: [
        new MarqueeLabel({
            heightRequest: 30,
            widthRequest: 350,
            scrollSpeed: 1,
            label: 'No Title',
            setup: (self) => {
                self.hook(Mpd, () => {
                    self.label = `${Mpd.Title || "No Title"}`;
                });
            },
        })
    ]
})

const songArtist = Widget.Box({
    className: 'artist',
    children: [
        new MarqueeLabel({
            heightRequest: 30,
            widthRequest: 350,
            scrollSpeed: 1,
            label: 'No Artist',
            setup: (self) => {
                self.hook(Mpd, () => {
                    self.label = `${Mpd.Artist || "No Artist"}`;
                });
            },
        })
    ]
})

const mediaControls = Widget.Box()

const mpd_controls = () => Widget.CenterBox({
    className: 'mpd-controls',
    hpack: 'center',
    hexpand: true,
    startWidget: Widget.Button({
        hpack: 'start',
        className: 'button',
        onClicked: () => Mpd.previous(),
        child: Widget.Icon('media-skip-backward-symbolic')
    }),
    centerWidget: Widget.Button({
        hpack: 'center',
        className: 'button',
        onClicked: () => Mpd.playPause(),
        child: Widget.Icon({
            setup: self => self.hook(Mpd, () => (Mpd.state === 'play') 
                ? self.icon = 'media-playback-pause-symbolic'
                : self.icon = 'media-playback-start-symbolic')
            })
    }),
    endWidget: Widget.Button({
        hpack: 'end',
        className: 'button',
        onClicked: () => Mpd.next(),
        child: Widget.Icon('media-skip-forward-symbolic')
    })
})

export const mpd_bar_controls = mpd_controls()

export const mpd_menu_controls = Widget.Box({
    className: 'mpd-controls',
    children: [
        albumCover,
        Widget.Box({
            vertical: true,
            hpack: 'end',
            children: [
                Widget.Box({
                    vertical: true,
                    children: [
                        songTitle,
                        songArtist
                    ]
                }),
                mpd_controls(),
                positionLabel,
                positionSlider
            ]
        })
    ]
})

export const cover_with_controls = Widget.Box({
    className: 'cover',
    hexpand: true,
    vexpand: true,
    child: Widget.Box({
        className: "cover",
        vertical: true,
        children: [
            mpd_controls(),
            Widget.Slider({
                vpack: 'end',
                className: 'progress-bar',
                drawValue: false,
                hexpand: false,
                onChange: ({ value }) => Mpd.seekCur(value * Mpd.duration),
                setup: (self) => {
                    self.poll(500, () => {
                        Mpd.send("status")
                        .then((msg) => {
                            const elapsed = msg?.match(/elapsed: (\d+\.\d+)/)?.[1];
                            self.value = elapsed / Mpd.duration || 0;
                        })
                        .catch((error) => logError(error));
                    });
                },
            })
        ],
        setup: (self) =>
        self.hook(Mpris, () => {
            const mpd = Mpris.getPlayer("mpd");
            self.css = `background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${mpd?.coverPath}"); min-height: 60px; min-width: 250px; background-position: 50% 50%; background-size: cover; border: 5px solid #161616`;
        })
    })
})
