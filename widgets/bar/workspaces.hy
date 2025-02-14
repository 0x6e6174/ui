(import astal *)
(import astal.gtk3 *)

(.require-version gi "AstalHyprland" "0.1")

(import gi.repository [AstalHyprland :as Hyprland])


(let [
  hyprland (.get-default Hyprland)
  workspace-row (fn [start stop]
    (Widget.Box
      :children (lfor i (range start stop)
        (Widget.Button
        :class-name "workspace"
        :attribute (+ i 1)
        :on-clicked (fn [self] (.message-async hyprland f"dispatch workspace {self.attribute}"))
        :setup (fn [self]
          (.hook self hyprland "notify::focused-workspace" (fn [self, w] (.toggle-class-name self "focused" (= (.get-id w) self.attribute))))
          (defn update [#* _]
            (let [workspace (.get-workspace hyprland self.attribute)]
              (when (!= workspace None)
                (.toggle-class-name self "occupied" (< 0 (len (.get-clients workspace)))))))

          (.hook self hyprland "notify::workspaces" update)
          (.hook self hyprland "notify::clients" update)
          (.hook self hyprland "client-moved" update)
          (update)
          
          (when (= (.get-id (.get-focused-workspace hyprland)) self.attribute)
            (.toggle-class-name self "focused")))))))]

  (setv workspaces (Widget.Box
    :class_name "workspaces"
    :vertical True
    :hexpand False
    :halign Gtk.Align.START
    :valign Gtk.Align.CENTER
    :children [
      (workspace-row 0 5)
      (workspace-row 5 10)])))
