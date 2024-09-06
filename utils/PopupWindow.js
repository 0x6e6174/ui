export default ({
      name,
      child,
      transition = "slide_up",
      transitionDuration = 250,
      ...props
}) => {
    const reveal = Variable(false)
    const window = Widget.Window({
        name,
        visible: false,
        ...props,

        child: Widget.Box({
            css: `min-height: 2px;
                min-width: 2px;`,
            child: Widget.Revealer({
                transition,
                transitionDuration,
                hexpand: true,
                vexpand: true,
                child: child,
                revealChild: reveal.bind() 
            }),
        }),
    });

    return window, reveal;
}
