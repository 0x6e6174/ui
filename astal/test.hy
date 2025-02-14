(import astalify [Label Box])
(import binding *)
(import app [App])

(import gi)
(.require_version gi "Astal" "3.0")

(import gi.repository [Astal])

(.start App (dict 
   :main (fn []
             (setv test (Astal.Window
                :child (Box
                        :vertical True
                        :children [
                                   (Label :label "aoeu")
                                   (Label :label "asdf")])))
             (.show_all test)
             (.add_window App test))
   :instance_name "aoeu"))
