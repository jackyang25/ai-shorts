import sys
import json
from moviepy.editor import ImageSequenceClip
from moviepy.config import change_settings
import logging

# Configure Moviepy to not output anything to stdout
logging.basicConfig(stream=sys.stderr, level=logging.CRITICAL)  # Set logging to critical only

def create_short(image_paths, output_path, fps=24):
    try:
        clip = ImageSequenceClip(image_paths, fps=fps)
        # Set logger to none and disable progress bar
        clip.write_videofile(output_path, codec='libx264', logger=None, verbose=False)
        return {"video_path": output_path}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        data = json.loads(sys.argv[1])
        image_paths = data.get("image_paths")
        output_path = data.get("output_path")

        result = create_short(image_paths, output_path)
        print(json.dumps(result))  # This should now only output JSON
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
