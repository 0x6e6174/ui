local datetime = Variable(0):poll(1000, "date +'%d %b %H:%M:%S'", function(out, _) return out end)
local unix_seconds = Variable(0):poll(1000, "date +'%s'", function(out, _) return out end)

return Widget.Box({
  class_name = 'clock',
  vertical = true,
  valign = 'CENTER',
  children = {
    Widget.Label({
      halign = 'START',
      label = bind(datetime, 'value')
    }),
    Widget.Label({
      halign = 'START',
      label = bind(unix_seconds, 'value')
    })
  }
})
