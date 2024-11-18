require("lua.globals")

local bar <const> = require('lua.widgets.bar')

local scss <const> = "./style/style.scss"
local css <const> = "./style/style.css"

exec(string.format("sassc %s %s", scss, css))

App:start({
  css = css,
  main = function()
    bar:show_all()
  end,
})
