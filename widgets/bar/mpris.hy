(import astal *)
(import astal.gtk3 *)

(import math)

(.require-version gi "AstalMpris" "0.1")

(import gi.repository [AstalMpris :as Mpris])

(let [mpris (.get-default Mpris)]
  (setv mpris-controls
    (Widget.Stack
      :transition-type Gtk.StackTransitionType.SLIDE_UP_DOWN
      :transition-duration 125
      :children []
      :setup (fn [self]
        (.add-events self Gdk.EventMask.SCROLL_MASK)
        (.add-events self Gdk.EventMask.SMOOTH_SCROLL_MASK)
        
        (defn add-player [player]
          (.add-named self
            (Widget.Box
              :class-name "player"
              :vertical True
              :hexpand False
              :setup (fn [self] (.set-name self (.get-bus-name player)))
              :css (.transform (bind player "cover-art") (fn [cover-uri]
                (when cover-uri (return f"
                  background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(22, 22, 22, 0.925)), url(\"{cover-uri}\");
                  background-position: 50% 50%;
                  background-size: cover;
                "))
                (return "")))
              :children [
                (Widget.Box
                  :vertical True
                  :vexpand True
                  :valign Gtk.Align.CENTER
                  :halign Gtk.Align.END
                  :children [
                    (Widget.Button
                      :on-clicked (fn [#* _] (.previous player))
                      :child (Widget.Icon :icon "media-skip-backward-symbolic"))
                    (Widget.Button
                      :on-clicked (fn [#* _] (.play-pause player))
                      :child (Widget.Icon :icon (.transform (bind player "playback-status") (fn [status] 
                        (when (= status Mpris.PlaybackStatus.PLAYING)
                          (return "media-playback-pause-symbolic"))
                        (return "media-playback-start-symbolic")))))
                    (Widget.Button
                      :on-clicked (fn [#* _] (.next player))
                      :child (Widget.Icon :icon "media-skip-forward-symbolic"))])
                (Widget.Slider
                  :hexpand True
                  :class-name "media-progress"
                  :valign Gtk.Align.END
                  :halign Gtk.Align.START
                  :on-dragged (fn [self] (.set-position player (* (.get-value self) (.get-length player))))
                  :setup (fn [self]
                    (.poll (Variable) 500 (fn [#* _]
                      (when player
                        (.set-value self (/ (.get-position player) (.get-length player))))))))])
            (.get-bus-name player)))
        
        (for [player (.get-players mpris)] (add-player player))
        
        (.hook self mpris "player-added" (fn [self player]
          (add-player player)))
        
        (.hook self mpris "player-closed" (fn [self player]
          (.destroy (.get-named self (.get-bus-name player)))))
        
        (setv accumulated-delta-y 0)
        
        (.hook self self "scroll-event" (fn [_ event]
          (nonlocal accumulated-delta-y)
          (setv accumulated-delta-y (+ accumulated-delta-y (get (.get-scroll-deltas event) 2)))

          (when (> (abs accumulated-delta-y) 10)
            (.set-visible-child self (get (.get-children self) (% (+ (.index (lfor child (.get-children self) (.get-name child)) (.get-shown self)) (* 1 (round (/ accumulated-delta-y 10)))) (len (.get-children self)))))
            (setv accumulated-delta-y 0))))))))
