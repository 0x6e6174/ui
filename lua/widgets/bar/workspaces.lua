local Hyprland <const> = astal.require("AstalHyprland")
local map, sequence = require('lua.lib').map, require('lua.lib').sequence

local hypr = Hyprland.get_default()

local map, sequence = require('lua.lib').map, require('lua.lib').sequence

local hypr = Hyprland.get_default()

local function workspace_row(start, stop)
  return Widget.Box({
    children = map(sequence(start, stop), function(i)
      return Widget.Button({
        setup = function(self)
          self:hook(hypr, 'notify::focused-workspace', function(self, workspace)
            self:toggle_class_name('focused', workspace:get_id() == i)
          end)
          self:hook(hypr, 'notify::workspaces', function(self, workspaces)
            map(workspaces, function(workspace)
              if workspace:get_id() == i then
                -- ick 
                local count = 0
                for _ in ipairs(workspace:get_clients()) do
                  count = count + 1
                end
                self:toggle_class_name('occupied', workspace:get_id() == i and count > 0)
              end
            end)
          end)
        end,
        on_click_release = function()
          hypr:message_async(string.format("dispatch workspace %d", i))
        end
      })
    end)
  })
end

return Widget.Box({
  class_name = 'workspaces',
  vertical = true,
  hexpand = false,
  halign = 'START',
  children = {
    workspace_row(1, 5),
    workspace_row(6, 10),
  }
})
