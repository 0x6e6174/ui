(import astal *)
(import astal.gtk3 *)

(.require-version gi "AstalNotifd" "0.1")
(.require-version gi "Pango" "1.0")

(import gi.repository [AstalNotifd Pango])

(let [
  ProgressBar (astalify Gtk.ProgressBar)
  notifd (.get-default AstalNotifd)
  notification-timeout 3
  notification-icon (fn [notification]
    (cond 
      (.get-image notification) (Widget.Box
        :class-name "icon image"
        :css f"
          background-image: url(\"{(.get-image notification)}\");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;")
      (. Astal Icon (lookup-icon (.get-app-icon notification))) (Widget.Icon 
        :icon (.get-app-icon notification)
        :class-name "icon")
      True (Widget.Icon
        :icon "dialog-information-symbolic"
        :class-name "icon")))
  
  make-notification (fn [notification]
    (let [
      layout (Widget.Button
        :on-clicked (fn [self] (. self (get-parent) (set-reveal-child False)))
        :child (Widget.Box
          :children [
            (Widget.Box
              :vertical True
              :css "min-width: 200px; min-height 50px;;"
              :children [
                (Widget.Box
                  :children [
                    (notification-icon notification)
                    (Widget.Box 
                      :vertical True
                      :children [
                        (Widget.Label
                          :class-name "title"
                          :label (str (.get-summary notification))
                          :xalign 0
                          :justify 0
                          :ellipsize Pango.EllipsizeMode.END
                          )
                        (Widget.Label
                          :class-name "body"
                          :label (str (.get-body notification))
                          :xalign 0
                          :justify 0
                          :wrap True
                          :wrap-mode Pango.WrapMode.WORD_CHAR
                          :use-markup True
                          )])])
                (ProgressBar
                  :class-name "timeout-bar"
                  :hexpand True
                  :valign 2
                  :fraction (bind (.poll (Variable 1) (// (+ (* (or (max (.get-expire-timeout notification) 0) notification-timeout) 1000) 250) 100) (fn [prev]
                    (when (> prev .02)
                      (return (- prev .01)))
                    (return 0)))))])
            (Widget.Box :class-name f"urgency-indicator {(.get-urgency notification)}")]))]
      
      (Widget.Revealer
        :transition-type Gtk.RevealerTransitionType.SLIDE_DOWN
        :transition-duration 250
        :class-name "notifications"
        :child (Widget.Revealer
          :transition-type Gtk.RevealerTransitionType.SLIDE_DOWN
          :transition-duration 250
          :child layout
          :setup (fn [self]
            (.hook self self "notify::reveal-child" (fn [#* _]
              (when (not (.get-reveal-child self))
                (timeout 250 (fn [] (. self (get-parent) (set-reveal-child False)))))))))
        :setup (fn [self]
          (.hook self self "notify::reveal-child" (fn [self revealed?]
            (when revealed?
              (when (.get-reveal-child self) (timeout 1 (fn [] (. self (get-child) (set-reveal-child True)))))
              (timeout (* 1000 (or (max (.get-expire-timeout notification) 0) notification-timeout)) (fn []
                (. self (get-child) (set-reveal-child False))
                (timeout (. self (get-child) (get-transition-duration)) (fn []
                  (.set-reveal-child self False)
                  (timeout (.get-transition-duration self) (fn []
                    (.destroy self))))))))))

          (.set-reveal-child self True)))))]
  
  (setv notifications (Widget.Window
    :namespace "notifications"
    :name "notifications"
    :anchor (| Astal.WindowAnchor.TOP Astal.WindowAnchor.RIGHT)
    :exclusivity Astal.Exclusivity.EXCLUSIVE
    :margin-top 5
    :child (Widget.Box
      :vertical True
      :setup (fn [self]
        (.hook self notifd "notified" (fn [self notification _]
          (let [children (.get-children self)]
            (.add self (make-notification (.get-notification notifd notification)))))))))))
