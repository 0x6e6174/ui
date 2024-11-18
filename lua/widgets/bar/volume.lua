local wp <const> = lgi.require("AstalWp").get_default()

local endpoint = wp:get_audio():get_default_speaker()

return Widget.Box({
  class_name = 'volume-slider',
  children = {
    Widget.Button({
      child = Widget.Icon({
        icon = bind(endpoint, "volume-icon"),
      }),
      on_clicked = function()
        endpoint:set_mute(not endpoint:get_mute())
      end
    }),
    Widget.Slider({
      class_name = 'volume-slider',
      hexpand = true,
      draw_value = false,
      value = bind(endpoint, 'volume'),
      on_value_changed = function(self)
        endpoint:set_volume(self.value)
      end
    })
  }
})
