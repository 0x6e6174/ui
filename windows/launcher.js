const Applications = await Service.import("applications")

const reveal_launcher = Variable(false)

function appItem(app) {
    return Widget.Button({
        className: 'entry',
        onClicked: () => {
            reveal_launcher.value = false
            app.launch()
        },
        attribute: { app },
        child: Widget.Box([
            Widget.Icon({
                icon: app.icon_name || '',
                size: 42,
            }),
            Widget.Label({
                className: 'app-title',
                label: app.name, 
                xalign: 0, 
                vpack: 'center', 
                truncate: 'end'
            })
        ])
    })
}

function _launcher() {
    let applications = Applications.query('').map(appItem)

    const list = Widget.Box({
        vertical: true, 
        children: applications, 
        spacing: 12
    })

    function repopulate() { 
        applications = Applications.query('').map(appItem)
        list.children = applications
    }

    const entry = Widget.Box({
        className: 'search',
        children: [
            Widget.Icon({
                icon: 'edit-find-symbolic',
                size: 42,
            }),
            Widget.Entry({
                hexpand: true, 
                className: 'search',
                on_accept: () => {
                   applications.filter((item) => item.visible)[0]?.attribute.app.launch()
                    reveal_launcher.value = false
                },
                on_change: ({ text }) => applications.forEach(item => {
                    item.visible = item.attribute.app.match(text ?? '')
                })
            })
        ]
    })

    return Widget.Box({
        vertical: true, 
        className: 'launcher',
        children: [
            entry, 
            Widget.Scrollable({
                hscroll: 'never',
                vexpand: true, 
                hexpand: true,
                child: list
            })
        ],
        setup: self => self.hook(reveal_launcher, () => {
            entry.text = ''
            if (reveal_launcher.value) {
                repopulate()
                console.log('nya')
                entry.text = ''
                entry.grab_focus()
            }
        }, "changed")
    })
}

const launcher = _launcher()

export {
    reveal_launcher, 
    launcher
}
