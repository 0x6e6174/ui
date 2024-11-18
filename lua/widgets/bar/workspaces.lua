local Hyprland <const> = lgi.require("AstalHyprland")
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

          local function update()
            local workspaces = hypr:get_workspaces()
            for _,workspace in ipairs(workspaces) do
              if workspace:get_id() == i then
                local count = 0;

                for _ in pairs(workspace:get_clients()) do
                  count = count + 1
                end

                self:toggle_class_name('occupied', count > 0)
              end
            end
          end

          self:hook(hypr, 'client-moved', update)
          self:hook(hypr, 'notify::clients', update)
          self:hook(hypr, 'notify::workspaces', update)

          update()
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
  valign = 'CENTER',
  children = {
    workspace_row(1, 5),
    workspace_row(6, 10),
  }
})
