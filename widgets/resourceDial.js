const { Gio, GioUnix } = imports.gi;

export const resource_dial = (label, icon, timeout, command, transformer) => {
    let poll = Variable(100, {
        poll: [timeout, command, v => Number(v)]
    })

    return Widget.Box({
        className: 'dial-parent',
        children: [
            Widget.CircularProgress({
                startAt: 0.75,
                className: 'resource-dial',
                value: poll.bind().as(v => transformer(v)),
                tooltipText: poll.bind().as(v => label(v)),
                child: Widget.Icon({
                    className: 'dial-icon', 
                    icon: icon
                }),
            })
        ]
    })   
}

