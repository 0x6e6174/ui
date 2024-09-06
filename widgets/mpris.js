const { Gtk, Gdk } = imports.gi;
const Mpris = await Service.import('mpris')

const media_controls = (player) => Widget.CenterBox({
    className: 'media-controls',
    hpack: 'center',
    hexpand: true,
    startWidget: Widget.Button({
        hpack: 'start',
        className: 'button',
        onClicked: () => player.previous(),
        child: Widget.Icon('media-skip-backward-symbolic')
    }),
    centerWidget: Widget.Button({
        hpack: 'center',
        className: 'button',
        onClicked: () => player.playPause(),
        child: Widget.Icon({
            setup: self => self.hook(Mpris, () => (player.playBackStatus === 'Playing') 
                ? self.icon = 'media-playback-pause-symbolic'
                : self.icon = 'media-playback-start-symbolic')
        })
    }),
    endWidget: Widget.Button({
        hpack: 'end',
        className: 'button',
        onClicked: () => player.next(),
        child: Widget.Icon('media-skip-forward-symbolic')
    })
})

const cover_with_controls = (player) => Widget.Box({
    className: "media",
    children: [
        Widget.Box({
            vertical: true,
            children: [
                media_controls(player),
                Widget.Slider({
                    vpack: 'end',
                    className: 'progress-bar',
                    drawValue: false,
                    hexpand: false,
                    onChange: ({ value }) => {player.position = (value * player.length)},
                    setup: self => self.poll(500, self => {
                        if (!player) return
                        self.value = player.position/player.length
                    })
                })
            ],
        }),
    ],
    setup: (self) => {
        self.hook(Mpris, () => {
            self.queue_draw()
            self.css = `background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${player.coverPath}"); min-height: 60px; min-width: 250px; background-position: 50% 50%; background-size: cover; border: 5px solid #161616`;
        })
    },
});


export const players = Widget.Stack({
    transition: "slide_up_down",
    transitionDuration: 125,
    children: {},
    setup: (self) => {
        self.add_events(Gdk.EventMask.SCROLL_MASK);
        self.add_events(Gdk.EventMask.SMOOTH_SCROLL_MASK);

        let currentDeltaY = 0;

        self.on("scroll-event", (_, event) => {
            const childNames = Object.keys(self.children);

            const length = Object.keys(self.children).length

            const prevChild = childNames[((n)=>n>=0?n:length-1)((childNames.indexOf(self.get_visible_child_name()) - 1) % length)];
            const nextChild = childNames[(childNames.indexOf(self.get_visible_child_name()) + 1) % length];

            const deltaY = event.get_scroll_deltas()[2];

            currentDeltaY += deltaY;

            if (currentDeltaY > 10 && prevChild) {
                self.set_visible_child_name(prevChild);
                currentDeltaY = 0;
            }
            if (currentDeltaY < -10 && nextChild) {
                self.set_visible_child_name(nextChild);
                currentDeltaY = 0;
            }
            console.log(self.children)
        });

        self.hook(Mpris, (_, name) => {
            if (!name) return;
            self.add_named(cover_with_controls(Mpris.getPlayer(name)), name);
        }, "player-added");
        self.hook(Mpris, (_, name) => {
            if (!name) return;

            self.get_child_by_name(name).destroy();
            delete children[name]
            console.log('destroyed')
        }, "player-closed");
    },
});

export const media = Widget.Revealer({
    revealChild: Mpris.bind("players").as((players) => players.length > 0),
    transition: "slide_up",
    transitionDuration: 125,
    child: players,
});
