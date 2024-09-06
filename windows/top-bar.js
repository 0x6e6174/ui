import { hyprworkspaces_grid } from '../widgets/hyprworkspaces.js'
import { volume_slider } from '../widgets/volume.js'
import { brightness_slider } from '../widgets/brightness.js'
import { battery_dial } from '../widgets/battery.js'
import { horizontal_clock } from '../widgets/clock.js'
import { active_window } from '../widgets/hypractive.js'
import { media } from '../widgets/mpris.js'

export const FakeBar = Widget.Window({
    name: 'FakeBar',
    exclusivity: 'exclusive',
    anchor: ['left', 'top', 'right'],
    margins: [35, 0],
    child: Widget.Box({css: 'min-height: 1px;'})
})

const left_box = Widget.Box({
    className: 'left', 
    hpack: 'start',
    children: [
        hyprworkspaces_grid,
        media
    ]
})

const middle_box = Widget.Box({
    className: 'middle', 
    hpack: 'center',
    children: [
        active_window
    ]
})

const right_box = Widget.Box({
    className: 'right',
    hpack: 'end',
    children: [
        Widget.Box({
            className: 'sliderbox',
            vertical: true, 
            children: [
                volume_slider, 
                brightness_slider
            ]
        }),
        Widget.Box({
                className: 'battery-container', 
                children: [battery_dial]
            }),
            Widget.Separator({vertical: true}),
            horizontal_clock
        ]
})

const bar = Widget.Box({
    className: 'bar', 
    children: [
        left_box,
        middle_box,
        right_box
    ]
})

export const Bar = Widget.Window({
    name: 'status-bar',
    exclusivity: 'ignore',
    // margins: [5, 5, 5, 5],
    anchor: ['left', 'top', 'right'],
    child: bar 
})
