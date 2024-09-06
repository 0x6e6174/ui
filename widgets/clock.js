const { exec, execAsync } = Utils;

const bar_clock = Widget.Box({
    className: 'clock',
    vpack: 'end',
    vertical: true,
    setup: (self) => {
        var month_and_date, hours_and_minutes, seconds;
        self.poll(1000, self => {
            execAsync("date +'%m/%d %H:%M %S'").then((time) => {
                [month_and_date, hours_and_minutes, seconds] = time.split(' ');
            });
            self.children = [
                Widget.Label({
                    className: 'datetime',
                    label: month_and_date
                }),
                Widget.Label({
                    className: 'datetime',
                    label: hours_and_minutes
                }),
                Widget.Label({
                    className: 'datetime',
                    label: seconds
                }),
            ]
        })
    }
})


const horizontal_clock = Widget.Box({
    className: 'clock',
    vpack: 'center',
    vertical: true,
    setup: (self) => {
        var date_time, unix_seconds;
        self.poll(1000, self => {
            execAsync("date +'%d %b %H:%M:%S %s'").then((time) => {
                let parts = time.split(' ');
                date_time = `${parts[0]} ${parts[1]} ${parts[2]}`;
                unix_seconds = parts[3];
            });
            self.children = [
                Widget.Label({
                    className: 'datetime',
                    label: date_time
                }),
                Widget.Label({
                    hpack: 'start',
                    className: 'datetime',
                    label: unix_seconds
                })
            ];
        });
    }
});

export {
    bar_clock,
    horizontal_clock
}
