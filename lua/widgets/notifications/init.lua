local notifd = lgi.require('AstalNotifd').get_default()
local pango = lgi.require('Pango')
local map = require("lua.lib").map
local popup_timeout_seconds = 3

local notification_icon = function(n)
	local icon = 'dialog-information-symbolic'

	if n.image then
		return Widget.Icon({
			class_name = 'icon image',
			css = 'background-image: url("' .. n.image .. '");'
				 .. 'background-size: contain;'
				 .. 'background-repeat: no-repeat;'
				 .. 'background-position: center;'
		})
	elseif lookup_icon(n.app_icon) then
		icon = n.app_icon
	end
	return Widget.Icon({ icon = icon, class_name = 'icon' })
end

local make_notification = function(n)
	local layout = Widget.Box({
		vertical = true,
		css = 'min-width: 200px; min-height: 50px;',
		children = {
			Widget.Box({
				children = {
					notification_icon(n),
					Widget.Box({
						vertical = true,
						children = {
							Widget.Label({
								class_name = 'title',
								label = n.summary,
								xalign = 0,
								max_width_chars = 32,
								justify = 0
							}),
							Widget.Label({
								class_name = 'body',
								label = n.body,
								xalign = 0,
								justify = 0,
								max_width_chars = 32,
								wrap = true,
								wrap_mode = pango.WrapMode.WORD_CHAR,
								use_markup = true
							})
						}
					})
				}
			}),
			Widget.ProgressBar({
				class_name = 'timeout-bar',
				hexpand = true,
				valign = 2,
				fraction = bind(Variable(1):poll(((n.expire_timeout > 0 and n.expire_timeout or popup_timeout_seconds) * 1000 + 255) // 100, function(prev)
					if prev > .01 then
						return prev - .01
					end
					return 0
				end)),
			})
		}
	})

	return Widget.Revealer({
		transition_type = 'SLIDE_DOWN',
		transition_duration = 250,
		class_name = 'notifications',
		child = Widget.Revealer({
			transition_type = 'SLIDE_LEFT',
			transition_duration = 250,
			child = layout,
			setup = function(self)
				self:hook(self, 'notify::reveal-child', function()
					if not self.reveal_child then timeout(250, function() self:get_parent():set_reveal_child(false) end) end
				end)
			end
		}),
		setup = function(self)
			self:hook(self, 'notify::reveal-child', function()
				if self.reveal_child then timeout(1, function() self:get_child():set_reveal_child(true) end) end
				timeout((n.expire_timeout > 0 and n.expire_timeout or popup_timeout_seconds) * 1000, function()
					self:get_child():set_reveal_child(false)
					timeout(self:get_child():get_transition_duration(), function()
						self:set_reveal_child(false)
						timeout(self:get_transition_duration(), function()
							self:destroy()
						end)
					end)
				end)
			end)
			timeout(0, function() self.reveal_child = true end)
		end
	})
end

return Widget.Window({
	namespace = 'notifications',
	name = 'notifications',
	anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
	exclusivity = 'EXCLUSIVE',
	margin_top = 5,
	child = Widget.Box({
		vertical = true,
		setup = function(self)
			self:hook(notifd, 'notified', function(self, n)
				local children = self:get_children()
				table.insert(children, make_notification(notifd:get_notification(n)))
				self:set_children(children)
				print(children)
			end)
		end
	})
})
