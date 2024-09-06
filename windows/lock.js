import { show_notification_popups } from './notifications.js'

// TODO:  const { Gdk, GtkSessionLock } = imports.gi;
const { authenticateUser, exec } = Utils

export const show_lock = Variable(false)
const lock_ready = Variable(false)

const username = Variable()

const password_entry = Widget.Entry({
    visibility: false,
    xalign: 0.5,
    onAccept: (self) => {
        authenticateUser(username.value, self.text)
            .then(() => {
                show_lock.value = false
                exec('rm /tmp/lock-pixelated.png')
                show_notification_popups.value = true
            })
            .catch(() => self.text = '')
        self.text = ''
        username_entry.text = ''
        username_entry.grab_focus()
    },
    setup: self => self.text = ''
})

const username_entry = Widget.Entry({
    xalign: 0.5,
    onAccept: (self) => {
        username.value = self.text
        password_entry.grab_focus()
    },
})

const login_container = Widget.Box({
    child: Widget.Box({
        className: lock_ready.bind().as(b => b ? 'lock-ready' : 'lock'),
        vpack: 'center', 
        hpack: 'center',
        hexpand: 'true',
        vertical: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Widget.Box({className: 'img'}),
                Widget.Box({
                    vertical: true, 
                    children: [
                        username_entry, 
                        password_entry
                    ]
                })
            ]
        })
    }),
    setup: self => self.hook(show_lock, () => {
        self.css = 'min-width: 2560px; min-height: 1600px; background: url("/tmp/lock-pixelated.png");'
        lock_ready.value = true
    })
})

export const Lock = Widget.Window({
    name: 'lock',
    visible: show_lock.bind().as(b => {
        if (b) {
            exec(`bash -c "grim - | convert - -scale 12.5% -scale 800% -filter point /tmp/lock-pixelated.png"`)
            show_notification_popups.value = false
        }
        return b
    }),
    exclusivity: 'ignore',
    keymode: 'exclusive',
    child: login_container,
})
