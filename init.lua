require("lua.globals")

local bar <const> = require('lua.widgets.bar')

local App <const> = astal.App

local scss <const> = "./style/style.scss"
local css <const> = "./style/style.css"

astal.exec(string.format("sassc %s %s", scss, css))

App:start({
  css = css,
  main = function()
    bar:show_all()
  end,
})
