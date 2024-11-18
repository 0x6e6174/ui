local Battery <const> = lgi.require("AstalBattery")

local battery <const> = Battery.get_default()

local icons <const> = {
  {"󰂎", "󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹"},
  {"󰢟", "󰢜", "󰂆", "󰂇", "󰂈", "󰢝", "󰂉", "󰢞", "󰂊", "󰂋", "󰂅"},
};

return Widget.Box({
  class_name = 'battery-container',
  children = {
    Widget.CircularProgress({
      class_name = 'battery-dial',
      rounded = false,
      inverted = false,
      start_at = -.25,
      end_at = .75,
      value = bind(battery, 'percentage'),
      child = Widget.Label({
        halign = "CENTER",
        hexpand = true,
        justify = 2,
        setup = function(self)
          self:hook(battery, 'notify::percentage', function(self, percentage)
            self.label = icons[battery:get_charging() and 1 or 2][math.floor(percentage*10)]
          end)
          self.label = icons[battery:get_charging() and 2 or 1][math.floor(battery:get_percentage()*10)]
        end
      })
    })
  }
})
