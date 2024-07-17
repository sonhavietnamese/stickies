import logging
from fastapi import FastAPI
import inngest
import inngest.fast_api
import requests
from rembg import remove, new_session
import base64
from io import BytesIO
from PIL import Image

inngest_client = inngest.Inngest(
    app_id="service-remove-background",
    logger=logging.getLogger("uvicorn"),
)

MODEL_NAME = "u2net"
session = new_session(MODEL_NAME)


app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@inngest_client.create_function(
   fn_id="remove-background",
   trigger=inngest.TriggerEvent(event="service/remove-background"),
)
async def remove_background(ctx: inngest.Context, step: inngest.Step) -> str:
    base64_image = ctx.event.data["base64_image"]

    padding_len = len(base64_image) % 4
    base64_image += "=" * padding_len

    try:
        img_data = base64.b64decode(base64_image)
    except base64.binascii.Error as e:
        return {"image": None, "error": "Invalid base64 format. Image must be a valid base64 encoded string."}

    img = Image.open(BytesIO(img_data))
    img_resized = img.resize((512, 512))
#     Step 1

    output_removed = remove(img_resized, session=session, only_mask=False)
    buffered = BytesIO()
    output_removed.save(buffered, format="PNG")
    return {"base64_image": base64.b64encode(buffered.getvalue()).decode()}


inngest.fast_api.serve(app, inngest_client, [remove_background])
