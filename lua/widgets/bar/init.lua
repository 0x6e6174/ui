local workspaces <const> = require(... .. '.workspaces')
local clock <const> = require(... .. '.clock')
local battery <const> = require(... .. '.battery')
local volume <const> = require(... .. '.volume')
local brightness <const> = require(... .. '.brightness')

return Astal.Window({
  namespace = "bar",
  name = "bar",
  anchor = Astal.WindowAnchor.TOP + Astal.WindowAnchor.LEFT + Astal.WindowAnchor.RIGHT,
  exclusivity = "EXCLUSIVE",
  child = Widget.CenterBox({
    start_widget = Widget.Box({
      class_name = 'left',
      children = {
        workspaces,
      }
    }),
    center_widget = Widget.Box({}),
    end_widget = Widget.Box({
      class_name = 'right',
      halign = 'END',
      children = {
        Widget.Box({
          class_name = 'sliders',
          vertical = true,
          children = {
            volume,
            brightness
          }
        }),
        battery,
        Gtk.Separator({}),
        clock
      }
    }),
  })
})
