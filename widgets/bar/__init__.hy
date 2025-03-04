(import astal.gtk3 *)
(import astal *)

(import .workspaces [workspaces])
(import .mpris [mpris-controls])
(import .clock [clock])
(import .battery [battery-dial])
(import .volume [volume])
(import .brightness [brightness])

(setv bar (Widget.Window
  :namespace "bar"
  :name "bar"
  :anchor (| Astal.WindowAnchor.TOP Astal.WindowAnchor.LEFT Astal.WindowAnchor.RIGHT)
  :exclusivity Astal.Exclusivity.EXCLUSIVE
  :child (Widget.CenterBox
    :start-widget (Widget.Box
      :class-name "left"
      :children [
        workspaces
        mpris-controls])
    :end-widget (Widget.Box
      :class-name "right"
      :halign Gtk.Align.END
      :children [
        (Widget.Box
          :class-name "sliders"
          :vertical True
          :children [
            volume
            brightness])
        battery-dial
        ((astalify Gtk.Separator))
        clock]))))
