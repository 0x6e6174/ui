local workspaces <const> = require(... .. '.workspaces')

return Astal.Window({
  namespace = "bar",
  name = "bar",
  anchor = Astal.WindowAnchor.TOP + Astal.WindowAnchor.LEFT + Astal.WindowAnchor.RIGHT,
  exclusivity = "EXCLUSIVE",
  child = workspaces, 
})
