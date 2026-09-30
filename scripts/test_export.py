"""The portable prototype must contain every module without external scripts."""
import html
import importlib.util
from pathlib import Path
import tempfile
import unittest


class ExportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        spec = importlib.util.spec_from_file_location("export_concept", Path(__file__).with_name("export-concept.py"))
        cls.builder = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.builder)

    def test_nested_modules_are_inlined_and_unicode_preserved(self):
        self.assertTrue(callable(getattr(self.builder, "expand_includes", None)), "Include expansion is required for a portable HTML file")
        with tempfile.TemporaryDirectory() as directory:
            assets = Path(directory)
            (assets / "view.html").write_text('<script><!-- include:model.js --></script><h2>구매 비교</h2>')
            (assets / "model.js").write_text('const label = "식물";')
            self.assertEqual(self.builder.expand_includes('<!-- include:view.html -->', assets), '<script>const label = "식물";</script><h2>구매 비교</h2>')

    def test_cycle_and_outside_path_cannot_be_bundled(self):
        self.assertTrue(callable(getattr(self.builder, "expand_includes", None)))
        with tempfile.TemporaryDirectory() as directory:
            assets = Path(directory)
            (assets / "cycle.html").write_text('<!-- include:cycle.html -->')
            with self.assertRaises(ValueError):
                self.builder.expand_includes('<!-- include:cycle.html -->', assets)
            with self.assertRaises(ValueError):
                self.builder.expand_includes('<!-- include:../outside.js -->', assets)

    def test_export_is_repeatable_and_preserves_shell(self):
        self.assertTrue(callable(getattr(self.builder, "render_document", None)))
        frame = '<html><script>const bundledIcon = 1;</script><!-- PLANTORY_FRAGMENT_START -->old<!-- PLANTORY_FRAGMENT_END --></html>'
        shell = '<html><iframe srcdoc="' + html.escape(frame) + '"></iframe></html>'
        with tempfile.TemporaryDirectory() as directory:
            assets = Path(directory)
            result = self.builder.render_document('<h1>식물 & 화분</h1>', shell, assets)
            self.assertIn('const bundledIcon = 1;', html.unescape(result))
            self.assertIn('<h1>식물 & 화분</h1>', html.unescape(result))
            self.assertEqual(result, self.builder.render_document('<h1>식물 & 화분</h1>', result, assets))


if __name__ == "__main__":
    unittest.main()
