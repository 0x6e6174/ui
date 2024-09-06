const hyprland = await Service.import('hyprland')

const active_window = Widget.Label({
    className: 'active-window',
    label: '',//hyprland.bind('active').as(c => c.client.title),
})

export {
    active_window
}
