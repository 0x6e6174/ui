const battery = await Service.import('battery')

const battery_dial = Widget.CircularProgress({
    className: 'battery-dial',
    rounded: false,
    inverted: false,
    startAt: 0.75,
    value: battery.bind('percent').as(p => p / 100),
    child: Widget.Label({
        className: "dial-icon",
        hexpand: true,
        setup: (self) => {
            self.hook(battery, (self) => {
                console.log(battery)
                const icons = [
                    ["󰂎", "󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹"],
                    ["󰢟", "󰢜", "󰂆", "󰂇", "󰂈", "󰢝", "󰂉", "󰢞", "󰂊", "󰂋", "󰂅"],
                ];
                self.label = icons[Number(battery.charging)][Math.floor(battery.percent / 10)];
                self.tooltip_text = 'Battery ' + String(battery.percent) + '%';
            });
        }
    }),
    setup: (self) => {
        self.hook(battery, (self) => {
            if (battery.percent <= 30 && battery.charging === false) {
                self.toggleClassName("battery-low", true);
            } else {
                self.toggleClassName("battery-low", false);
            }
        });
    }
});

export {
    battery_dial
}

