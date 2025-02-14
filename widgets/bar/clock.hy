(import astal *)
(import astal.gtk3 *)

(let [
  datetime (.poll (Variable "") 1000 "date +'%d %b %H:%M:%S'" (fn [out _] out))
  unix-seconds (.poll (Variable "") 1000 "date +%s" (fn [out _] out))]
  (setv clock (Widget.Box
    :class-name "clock"
    :vertical True
    :valign Gtk.Align.CENTER
    :children [
      (Widget.Label
        :halign Gtk.Align.START
        :label (bind datetime))
      (Widget.Label
        :halign Gtk.Align.START
        :label (bind unix-seconds))])))

