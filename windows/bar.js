import { battery_dial } from '../widgets/battery.js'
import { volume_dial } from '../widgets/volume.js'
import { brightness_dial } from '../widgets/brightness.js'
import { hyprworkspaces } from '../widgets/hyprworkspaces.js'
import { mpd_bar_controls } from '../widgets/mpd.js'
// import { systray } from '../widgets/systray.js'

import { bar_clock} from '../widgets/clock.js'

import { MenuWidget } from './menu.js'
import { reveal_launcher, launcher } from './launcher.js'

export const FakeBar = Widget.Window({
    name: 'FakeBar',
    exclusivity: 'exclusive',
    anchor: ['left'],
    margins: [0, 35],
    child: Widget.Box({css: 'min-width: 1px;'})
})

let reveal_menu = Variable(false)
let reveal_menu_button = Variable(false)

const MenuRevealButton = Widget.Box({
    children: [
        Widget.Button({
            vexpand: false,
            vpack: 'center',
            className: 'menu-visibility-button',
            'on-primary-click': (self) => reveal_menu.value = !reveal_menu.value,
            child: Widget.Icon({
                icon: reveal_menu.bind().as(reveal => !reveal ? 'go-next-symbolic' : 'go-previous-symbolic')
            })
        })
    ]
})

const BarTopWidget = Widget.Box({
    vertical: true,
    vpack: 'start',
    children: [
        Widget.Box({
            className: 'dial-container',
            vertical: true,
            spacing: 8,
            children: [
                battery_dial,
                volume_dial,
                brightness_dial
            ]
        }),
        Widget.Box({
            css: 'margin-left: 35px; margin-right: 35px'
        })
    ]
})

const BarMiddleWidget = Widget.Box({
    children: [
        Widget.EventBox({
            'on-hover': () => reveal_menu_button.value = true,
            child: Widget.Box({
                css: 'min-width: 1px; min-height: 40px;'
            })
        }),
        hyprworkspaces
    ]
})

const BarEndWidget = Widget.Box({
    vertical: true,
    vpack: 'end',
    children: [
        // systray, 
        mpd_bar_controls,
        bar_clock
    ]
})

const BarWidget = Widget.CenterBox({
    homogeneous: false,
    vertical: true, 
    spacing: 10,
    startWidget: BarTopWidget,
    centerWidget: BarMiddleWidget,
    endWidget: BarEndWidget
})

const MenuButtonRevealer = Widget.Revealer({
    revealChild: reveal_menu_button.bind(),
    transition: 'slide_right',
    child: MenuRevealButton
})

const MenuRevealer = Widget.Revealer({
    revealChild: reveal_menu.bind(),
    transition: 'slide_right',
    transitionDuration: 500,
    child: MenuWidget,
})

const LauncherRevealer = Widget.Revealer({
    revealChild: reveal_launcher.bind(),
    transition: 'slide_right',
    transitionDuration: 500,
    child: launcher,
})

export const Bar = Widget.Window({
    name: 'status-bar',
    exclusivity: 'ignore',
    keymode: reveal_launcher.bind().as(v => v ? 'exclusive' : 'on-demand'),
    anchor: ['top', 'left', 'bottom'],
    child: Widget.Overlay({
        'pass-through': true,
        overlay: Widget.Box({
            children: [
                Widget.EventBox({
                    'on-hover': () => reveal_menu_button.value = true,
                    'on-hover-lost': () => reveal_menu_button.value = false,
                    child: Widget.Box({
                        css: 'margin-right: 4px;',
                        children: [MenuButtonRevealer]
                    })
                }),
            ]
        }),
        child: Widget.Box({
            children: [
                LauncherRevealer,
                MenuRevealer,
                BarWidget
            ]
        })
    })
})

export {
    reveal_menu, 
    reveal_launcher
}
