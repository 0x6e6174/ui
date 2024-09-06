const { exec, execAsync } = Utils;

import Brightness from '../services/brightness.js'

const brightness_dial = Widget.EventBox({
    className: 'eventbox-hide-pointer',
    'on-primary-click': () => {execAsync('hyprshade toggle blue-light-filter')},
    'on-scroll-up': () => {Brightness.screen += 0.01},
    'on-scroll-down': () => {Brightness.screen -= 0.01},
    child: Widget.CircularProgress({
        rounded: false,
        className: 'brightness-dial',
        inverted: false, 
        startAt: 0.75,
        value: Brightness.bind('screen'),
        child: Widget.Label({
            className: "dial-icon",
            hexpand: true,
            hpack: 'center',
            setup: (self) => {
                self.hook(Brightness, (self => {
                    const brightness = Brightness.screen * 100;

                    self.label = ["󰃚", "󰃛", "󰃜", "󰃝", "󰃞", "󰃟", "󰃠"][Math.floor(brightness/15)]
                    self.tooltip_text = `Brightness ${Math.floor(brightness)}%`;
                }))
            }
        })
    })
})

const brightness_slider = Widget.Box({
    className: 'brightness',
    children: [
        Widget.Button({
            on_clicked: () => execAsync('hyprshade toggle blue-light-filter'),
            child: Widget.Icon().hook(Brightness, self => {
                const brightness = Brightness.screen * 100;
                const icon = [
                    [80, 'display-brightness-high-symbolic'],
                    [50, 'display-brightness-medium-symbolic'],
                    [20, 'display-brightness-low-symbolic'],
                    [0, 'display-brightness-off-symbolic']
                ].find(([threshold]) => brightness >= threshold)?.[1];

                self.icon = icon;
                self.tooltip_text = `Brightness ${Math.floor(brightness)}%`;
            }),
        }),
        Widget.Slider({
            className: 'slider',
            hexpand: true,
            drawValue: false,
            onChange: ({ value }) => Brightness.screen = value,
            value: Brightness.bind('screen'),
        })
    ]
});

export {
    brightness_dial,
    brightness_slider
}
