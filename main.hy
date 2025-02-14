(import astal *)
(import astal.gtk3 *)

(import glob [glob])

(import widgets)

(defn compile-scss []
  (exec "sass style/style.scss style/style.css"))

;; (defn watch-style []
;;   (lfor file (glob "./style/**" :recursive True)
;;     (when (not (in ".css" file)) (monitor-file file (fn [_, op] (when (= op 1) (print file op) (compile-scss) (.apply-css App "./style/style.css")))))))

(compile-scss)

(.start App 
  :main (fn []
    ;; (.show-all widgets.bar)
    ;; (.add-window App widgets.bar)
    (.show-all widgets.notifications)
    (.add-window App widgets.notifications))
  :instance-name "hy-test"
  :css "./style/style.css")
