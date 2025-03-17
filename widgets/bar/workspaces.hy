(import astal *)
(import astal.gtk3 *)

(.require-version gi "AstalNiri" "0.1")

(import gi.repository [AstalNiri :as Niri])

(let [
  Niri (.get-default Niri)
  workspace-row (fn [start stop]
    (Widget.Box
      :children (lfor i (range start stop)
        (Widget.Button
        :class-name "workspace"
        :attribute (+ i 1)
        :on-clicked (fn [self] (exec-async f"niri msg action focus-workspace {self.attribute}"))
        :setup (fn [self]

          (.hook self Niri "workspace-activated" (fn [_ w __] 
            (when w
              (.toggle-class-name self "focused" (= (.get-id (. Niri (get-workspace w))) self.attribute)))))

          (defn update [#* _]
            (let [workspace (.get-workspace Niri self.attribute)]
              (when (!= workspace None)
                (.toggle-class-name self "occupied" (< 0 (len (lfor window (. Niri (get-windows))
                  :if (= (.get-workspace-id window) (.get-id workspace))
                    window)))))))

          (.hook self Niri "workspaces-changed" update)
          (.hook self Niri "window-opened" update)
          (.hook self Niri "window-changed" update)
          (.hook self Niri "window-closed" update)

          (idle update)
          
          (idle (fn [] (when (= (.get-id (.get-focused-workspace Niri)) self.attribute)
            (.toggle-class-name self "focused")))))))))]

  (setv workspaces (Widget.Box
    :class_name "workspaces"
    :vertical True
    :hexpand False
    :halign Gtk.Align.START
    :valign Gtk.Align.CENTER
    :children [
      (workspace-row 0 5)
      (workspace-row 5 10)])))
