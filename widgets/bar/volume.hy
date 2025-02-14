(import astal *)
(import astal.gtk3 *)

(.require-version gi "AstalWp" "0.1")

(import gi.repository [AstalWp])

(let [
  endpoint (. AstalWp (get-default) (get-audio) (get-default-speaker))]
  (setv volume (Widget.Box
    :class-name "volume-slider"
    :children [
      (Widget.Button
        :child (Widget.Icon :icon (bind endpoint "volume-icon"))
        :on-clicked (fn [#* _] (.set-mute endpoint (not (.get-mute endpoint)))))
      (Widget.Slider
        :class-name "volume-slider"
        :hexpand True
        :draw-value False
        :value (bind endpoint "volume")
        :on-dragged (fn [self] 
          (.set-volume endpoint (.get-value self))))])))
