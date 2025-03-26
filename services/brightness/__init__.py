from astal import read_file, write_file, gi

gi.require_version("GObject", "2.0")
gi.require_version("GUdev", "1.0")
from gi.repository import GObject, GUdev, GLib

class Brightness(GObject.Object):
    _brightness: float = 0 

    def __init__(self, device: str):
        super().__init__()

        self._device_name = device
        self._udev_client = GUdev.Client.new(["backlight"])
        self._udev_client.connect('uevent', self.on_uevent)

    def on_uevent(self, client, action, device):
        if device.get_name() != self._device_name:
            return

        self._brightness = self._get_brightness()
        self.notify('brightness')

    def _get_brightness(self):
        return self._get_current_brightness() / self._get_max_brightness()

    def _get_current_brightness(self):
        return int(read_file(f"/sys/class/backlight/{self._device_name}/brightness"))

    def _get_max_brightness(self):
        return int(read_file(f"/sys/class/backlight/{self._device_name}/max_brightness"))

    @GObject.Property(type=float)
    def brightness(self):
        return self._brightness

    @brightness.setter
    def brightness(self, value: float):
        if value < 0:
            value = 0

        elif value > 1:
            value = 1

        self._brightness = value
        GLib.file_set_contents_full(f"/sys/class/backlight/{self._device_name}/brightness", bytes(str(round(self._brightness * self._get_max_brightness())), 'utf-8'), GLib.FileSetContentsFlags.ONLY_EXISTING, 0o666)

    def get_brightness(self):
        return self._brightness

    def set_brightness(self, value):
        self.brightness = value
