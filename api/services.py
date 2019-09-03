from django.template.loader import render_to_string
from xhtml2pdf import pisa
from io import BytesIO
import base64
import qrcode


class PDFService:
    def __init__(self, template):
        self.template = template

    def create(self, context):
        html = render_to_string(self.template, context)
        buffered = BytesIO()
        pisa.CreatePDF(html, dest=buffered)
        return base64.b64encode(buffered.getvalue()).decode("utf-8")


class QrService:
    def __init__(self):
        pass

    def create(self, value):
        buffered = BytesIO()
        image = qrcode.make(value)
        image.save(buffered, format="JPEG")
        return base64.b64encode(buffered.getvalue()).decode("utf-8")
