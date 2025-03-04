(import astal *)
(import astal.gtk3 *)
(import services.brightness [Brightness])
(import math [floor])

(import gi.repository [AstalWp])

(let [
  backlight (Brightness "amdgpu_bl1")]
  (setv brightness (Widget.Box
    :class-name "brightness-slider"
    :children [
      (Widget.Button
        :child (Widget.Icon :icon (bind backlight "brightness" (fn [brightness]
          f"display-brightness-{(get ["off" "low" "medium" "high" "high"] (floor (/ (* brightness 100) 25)))}-symbolic"))))
      (Widget.Slider
        :class-name "brightness-slider"
        :hexpand True
        :draw-value False
        :value (bind backlight "brightness")
        :on-dragged (fn [self] 
          (. backlight (set-brightness (.get-value self)))))])))
