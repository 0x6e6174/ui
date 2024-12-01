require("lua.globals")

local bar = require('lua.widgets.bar')
local notifications = require('lua.widgets.notifications')

local scss = "./style/style.scss"
local css = "./style/style.css"

exec(string.format("sassc %s %s", scss, css))

exec('pkill -f /usr/bin/mpDris2; mpDris2')

App:start({
  css = css,
  main = function()
    bar:show_all()
    notifications:show_all()
  end,
})
