const hyprland = await Service.import('hyprland')


const goto_workspace = (ws) => hyprland.messageAsync(`dispatch workspace ${ws}`)

const hyprworkspaces = Widget.EventBox({
    onScrollUp: () => goto_workspace('+1'),
    onScrollDown: () => goto_workspace('-1'),
    child: Widget.Box({
        vertical: true,
        className: 'workspace-container',
        children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Widget.Button({
            className: 'ws-norm',
            attribute: i,
            child: Widget.Label(String(i)),
            onClicked: () => goto_workspace(i),
            setup: self => self.hook(hyprland, self => self.attribute == hyprland.active.workspace.id ? 
                self.toggleClassName('ws-active', true) 
                : self.toggleClassName('ws-active', false))
        })),

        setup: self => self.hook(hyprland, () => self.children.forEach(btn => {
            btn.visible = hyprland.workspaces.some(ws => ws.id === btn.attribute);
        })),
    }),
})

function workspace_row(start, length) {
    return Widget.Box({
        vpack: 'center',
        hpack: 'center',
        className: 'workspace-row',
        children: Array.from({ length: length }, (_, i) => i + 1 + start).map(i => Widget.Button({
            className: 'workspace', 
            attribute: i, 
            onClicked: () => goto_workspace(i), 
            setup: self => {
                self.hook(hyprland, self => {
                    self.attribute == hyprland.active.workspace.id ? self.toggleClassName('focused', true) : self.toggleClassName('focused', false)
                    hyprland.workspaces.map(w => w.id).includes(self.attribute) ? self.toggleClassName('occupied', true) : self.toggleClassName('occupied', false)
                })    
            }
        }))
    })
}

const hyprworkspaces_grid = Widget.Box({
    className: 'workspaces',
    vertical: true,
    children: [
        workspace_row(0, 5),
        workspace_row(5, 5)
    ]
})

export {
    hyprworkspaces,
    hyprworkspaces_grid
}
