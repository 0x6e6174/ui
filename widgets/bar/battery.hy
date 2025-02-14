(import astal *)
(import astal.gtk3 *)

(.require-version gi "AstalBattery" "0.1")

(import gi.repository [AstalBattery :as Battery])

(let [
  battery (.get-default Battery)
  icons [
    ["󰂎" "󰁺" "󰁻" "󰁼" "󰁽" "󰁾" "󰁿" "󰂀" "󰂁" "󰂂" "󰁹"]
    ["󰢟" "󰢜" "󰂆" "󰂇" "󰂈" "󰢝" "󰂉" "󰢞" "󰂊" "󰂋" "󰂅"]]]
  (setv battery-dial (Widget.Box
    :class-name "battery-container"
    :children [
      (Widget.CircularProgress
        :class-name "battery-dial"
        :rounded False
        :inverted False
        :start-at -.25
        :end-at .75
        :value (bind battery "percentage")
        :child (Widget.Label
          :halign Gtk.Align.CENTER
          :hexpand True
          :justify 2
          :label (.transform (bind battery "percentage") (fn [percentage] (get (get icons (.get-charging battery)) (round (* percentage 10)))))))])))
