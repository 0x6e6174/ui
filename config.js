const { execAsync } = Utils

// import { reveal_menu, reveal_launcher, Bar, FakeBar } from './windows/bar.js'
import { Bar, FakeBar } from './windows/top-bar.js' 
import { NotificationPopups } from './windows/notifications.js'
import { Lock, show_lock } from './windows/lock.js'

execAsync('mpDris2')

Utils.monitorFile(
    `./style/style.scss`,

    function() {
        const scss = `./style/style.scss`

        const css = `./style/style.css`

        Utils.exec(`sassc ${scss} ${css}`)
        App.resetCss()
        App.applyCss(css)
    },
)

App.addIcons('/usr/share/icons/Papirus/symbolic/status')

App.config({
    windows: [
        Lock,
        FakeBar,
        Bar, 
        NotificationPopups,
    ],
    style: './style/style.css',
    icons: './icons'
})

Object.defineProperty(globalThis, "lock", {
    get() {
        show_lock.value = true
    }
})



/*
Object.defineProperty(globalThis, "swipeRight", {
    get() {
        if (reveal_menu.value) {
            reveal_launcher.value = true
        } else {
            reveal_menu.value = true
        }
    }
})

Object.defineProperty(globalThis, "swipeLeft", {
    get() {
        if (reveal_launcher.value) {
            reveal_launcher.value = false
        } else {
            reveal_menu.value = false
        }
    }
})*/
