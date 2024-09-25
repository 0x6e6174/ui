const Notifications = await Service.import('notifications')
const { Pango } = imports.gi;

Notifications.popupTimeout = 3000;

function notification_icon({ app_entry, app_icon, image }) {
    if (image) {
        return Widget.Box({
            css: `background-image: url("${image}");`
                + 'background-size: contain;'
                + 'background-repeat: no-repeat;'
                + 'background-position: center;',
        })
    }

    let icon = 'dialog-information-symbolic'
    if (Utils.lookUpIcon(app_icon))
        icon = app_icon

    if (app_entry && Utils.lookUpIcon(app_entry))
        icon = app_entry

    return Widget.Box({
        child: Widget.Icon(icon),
    })
}

const notification = (n) => {
    const icon = Widget.Box({
        vpack: 'center',
        hpack: 'start',
        class_name: 'icon',
        child: notification_icon(n),
    })

    const title = Widget.Label({
        className: 'title', 
        label: n.summary, 
        xalign: 0,
        maxWidthChars: 40,
        justify: 'left',
    })

    const body = Widget.Label({
        className: 'body',
        label: n.body,
        xalign: 0, 
        justification: 'left', 
        maxWidthChars: 26,
        wrap: true,
        wrapMode: Pango.WrapMode.WORD_CHAR, 
        useMarkup: true,
    })

    const actions = Widget.Box({
        class_name: "actions",
        children: n.actions.map(({ id, label }) => Widget.Button({
            class_name: "action-button",
            on_clicked: () => {
                n.invoke(id)
                n.dismiss()
            },
            hexpand: true,
            child: Widget.Label(label),
        })),
    })

    // const buttons = Widget.Box({
    //     hpack: 'end', 
    //     children: [
    //         Widget.Button({
    //             className: 'button',
    //             onClicked: () => n.dismiss(),
    //             child: Widget.Label('')
    //         })        
    //     ]
    // })

    const timeout_progress = Widget.ProgressBar({
        className: 'timeout-bar',
        hexpand: true, 
        vpack: 'end',
        value: 1, 
        setup: (self) => {
            self.poll(n.timeout/100, () => {
                if (self.value > 0.01) {
                    self.value = self.value - .01
                }
                else { n.dismiss() } // Notifications.forceTimeout doesn't work for notifications that are bugged.
            }) 
        }
    })

    const layout = Widget.Button({
        child: Widget.Box({
            children: [ 
                Widget.Box({
                    className: 'notification',
                    vertical: true, 
                    children: [
                        Widget.Box([
                            icon,
                            Widget.Box({
                                vertical: true, 
                                children: [
                                    title, body
                                ]
                            })
                        ]),
                        actions,
                        timeout_progress
                    ]
                }),
                Widget.Box({
                    vexpand: false,
                    classNames: ['urgency-indicator', n.urgency]
                })
            ]
        }),
        onPrimaryClick: n.dismiss,
    })

    return Widget.Revealer({
        className: 'revealer', 
        attribute: { id: n.id }, 
        vpack: 'start', 
        transition: 'slide_down',
        transitionDuration: 250, 
        setup: (self) => {
            Utils.timeout(1, () => self.set_reveal_child(true));
            self.on('notify::reveal-child', () => {
                if (self.reveal_child) Utils.timeout(125, () => self.child.set_reveal_child(true))
            })
        },
        child: Widget.Revealer({
            className: 'revealer',
            hpack: 'end', 
            transition: 'slide_left', 
            transitionDuration: 250, 
            setup: (self) => self.on('notify::reveal-child', () => {
                if (!self.reveal_child) Utils.timeout(250, () => self.parent.set_reveal_child(false))
            }),
            child: layout
        })
    })
}

export const show_notification_popups = Variable(true)
export const NotificationPopups = Widget.Window({
    visible: show_notification_popups.bind(),
    name: 'notifications', 
    anchor: ['top', 'right'],
    layer: 'overlay',
    margins: [15, 0, 0, 0],
    child: Widget.Box({
        className: 'notifications', 
        vertical: true, 
        widthRequest: 2, 
        heightRequest: 2, 
        children: Notifications.popups.map(notification),
        setup: (self) => self.hook(Notifications, (_, id) => {
            if (!id || Notifications.dnd) return; 

            const n = Notifications.getNotification(id)

            if (!n) return; 

            self.children = [...self.children, notification(n)]
        }, 'notified')
        .hook(Notifications, (_, id) => {
            if (!id) return; 

            const n = self.children.find(
                (child) => child.attribute.id === id, 
            )

            if (!n) return; 

            n.child.set_reveal_child(false) 

            Utils.timeout(n.child.transition_duration, () => n.destroy())
        }, 'dismissed')
    })
})

