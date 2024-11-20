local Mpris <const> = lgi.require("AstalMpris")
local mpris = Mpris.get_default()
local map = require('lua.lib').map

return Widget.Stack({
  transition_type = 'SLIDE_UP_DOWN',
  transition_duration = 125,
  children = {},
  setup = function(self)
    self:add_events(Gdk.EventMask.SCROLL_MASK);
    self:add_events(Gdk.EventMask.SMOOTH_SCROLL_MASK);

    local function add_player(player)
      self:add_named(
        Widget.Box({
          class_name = 'player',
          vertical = true,
          hexpand = false,
          setup = function(self) self['name'] = player:get_bus_name() end,
          css = bind(player, 'cover-art'):as(
            function(coverart)
              if coverart then 
                return 
                'background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(22, 22, 22, 0.9)), url("' .. coverart .. '");'
                .. 'background-position: 50% 50%; background-size: cover'
              else 
                return ''
              end
            end),
          children = {
            Widget.Box({
              vertical = true,
              hexpand = true,
              valign = 'CENTER',
              halign = 'END',
              children = {
                Widget.Button({
                  on_click = function() player:previous() end,
                  child = Widget.Icon({ icon = 'media-skip-backward-symbolic' })
                }),
                Widget.Button({
                  on_click = function() player:play_pause() end,
                  child = Widget.Icon({
                    icon = bind(player, 'playback-status'):as(function(status)
                      return (player:get_playback_status() == 'PLAYING' and 'media-playback-pause-symbolic' or 'media-playback-start-symbolic')
                    end)
                  })
                }),
                Widget.Button({
                  on_click = function() player:next() end,
                  child = Widget.Icon({ icon = 'media-skip-forward-symbolic' })
                })
              }
            }),
            Widget.Slider({
              hexpand = true,
              class_name = 'music-progress',
              valign = 'END',
              halign = 'START',
              -- for some reason, this is broken
              on_change_value = function(self) player:set_position(self:get_value() * player:get_length()) end,
              setup = function(self)
                Variable():poll(500, function()
                  if player == nil then return end
                  self:set_value(player:get_position() / player:get_length())
                end)
              end,
            })
          }
        }),
        player:get_bus_name()
      )
    end

    map(mpris:get_players(), add_player)

    self:hook(mpris, 'player-added', function(self, player)
      add_player(player)
    end)

    self:hook(mpris, 'player-closed', function(self, player)
      print('remove player', player:get_bus_name())
      self:get_named(player:get_bus_name()):destroy()
    end)

    local accumulated_delta_y = 0

    self:hook(self, 'scroll-event', function(_, event)
      local children = self:get_children()
      local current_child = self:get_visible_child()
      local _, delta_y = event:get_scroll_deltas()
      local index

      accumulated_delta_y = accumulated_delta_y + delta_y

      for i, child in ipairs(children) do 
        if child == current_child then
          index = i
        end
      end

      if math.abs(accumulated_delta_y) > 10 then
        self:set_visible_child(children[(index + math.floor(accumulated_delta_y / 10)) % #children + 1])
        accumulated_delta_y = 0
      end
    end)
  end
})
