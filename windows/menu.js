import { mpd_menu_controls } from '../widgets/mpd.js'
import { resource_dial } from '../widgets/resourceDial.js'

export const MenuWidget = Widget.Box({
    vertical: true,
    className: 'Menu',
    children: [
        mpd_menu_controls,
        Widget.Box({
            children: [
                resource_dial(
                    (v) => `cpu: ${v}%`,
                    'microchip-solid',
                    1000,
                    "bash -c \"top -bn1 | grep 'Cpu(s)' | awk '{print \$2 + \$4}'\"",
                    v => v/100
                ),
                resource_dial(
                    (v) => `mem: ${Math.round(100*v/31396)}%`,
                    'memory-solid',
                    1000,
                    "bash -c \"free -m | grep Mem | awk '{print $3}'\"",
                    v => v/31396
                ),
                resource_dial(
                    (v) => `igpu: ${v}%`,
                    'expansion-card',
                    1000,
                    "bash -c \"cat /sys/class/drm/card1/device/gpu_busy_percent\"",
                    v => v/100
                ),
                resource_dial(
                    (v) => `fan: ${v}rpm`,
                    'fan',
                    1000,
                    "bash -c \"sudo ectool pwmgetfanrpm | awk '{a+=\$4} END {print a/2}'\"",
                    v => v/5000
                ),
                resource_dial(
                    (v) => `temp (cpu): ${v}`,
                    'thermometer',
                    1000,
                    "bash -c \"sudo ectool temps all | grep -E 'cpu' | awk '{print \$5}'\"",
                    v => v/100
                ),
            ]
        })
    ]
})
