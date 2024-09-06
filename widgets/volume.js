const { exec, execAsync } = Utils 

const audio = await Service.import('audio')

const volume_dial = Widget.EventBox({
    className: 'eventbox-hide-pointer',
    'on-scroll-up': () => {audio.speaker.volume += 0.01},
    'on-scroll-down': () => {audio.speaker.volume -= 0.01},
    'on-primary-click': () => {audio.speaker.is_muted = !audio.speaker.is_muted},
    child: Widget.CircularProgress({
        className: 'volume-dial',
        rounded: false,
        inverted: false, 
        startAt: 0.75,
        value: audio.speaker.bind('volume'),
        child: Widget.Icon({
            className: "dial-icon",
            hexpand: true,
            setup: (self) => {
                self.hook(audio, (self => {
                    const vol = audio.speaker.volume * 100;
                    const icon = [
                        [101, 'overamplified'],
                        [67, 'high'],
                        [34, 'medium'],
                        [1, 'low'],
                        [0, 'muted'],
                    ].find(([threshold]) => threshold <= vol)?.[1];

                    self.icon = `audio-volume-${icon}-symbolic`;
                    self.tooltip_text = `Volume ${Math.floor(vol)}%`;
                }))
            }
        })
    })
})

const volume_slider = Widget.Box({
    className: 'volume',
    children: [
        Widget.Button({
            on_clicked: () => audio.speaker.is_muted = !audio.speaker.is_muted,
            child: Widget.Icon().hook(audio.speaker, self => {
                const vol = audio.speaker.volume * 100;
                const icon = [
                    [101, 'overamplified'],
                    [67, 'high'],
                    [34, 'medium'],
                    [1, 'low'],
                    [0, 'muted'],
                ].find(([threshold]) => threshold <= vol)?.[1];

                self.icon = `audio-volume-${icon}-symbolic`;
                self.tooltip_text = `Volume ${Math.floor(vol)}%`;
            }),
        }),
        Widget.Slider({
            className: 'slider',
            hexpand: true,
            drawValue: false,
            onChange: ({ value }) => audio['speaker'].volume = value,
        value: audio['speaker'].bind('volume'),
        })
    ]
})

export {
    volume_dial,
    volume_slider
}
