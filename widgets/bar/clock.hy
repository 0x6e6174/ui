(import astal *)
(import astal.gtk3 *)
(import datetime)

(let [
  time (.poll (Variable "") 1000 (fn [_] (. datetime datetime (now) (strftime "%d %b %H:%M:%S"))) (fn [out] out))
  unix-seconds (.poll (Variable "") 1000 (fn [_] (. datetime datetime (now) (strftime "%s"))) (fn [out] out))]
  (setv clock (Widget.Box
    :class-name "clock"
    :vertical True
    :valign Gtk.Align.CENTER
    :children [
      (Widget.Label
        :halign Gtk.Align.START
        :label (bind time))
      (Widget.Label
        :halign Gtk.Align.START
        :label (bind unix-seconds))])))

