import sys
import json

print("Starting script execution")

try:
    from moviepy.editor import ImageSequenceClip
    print("Successfully imported ImageSequenceClip")
except ImportError as e:
    print(f"ImportError: {e}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"Unexpected error during import: {e}", file=sys.stderr)
    sys.exit(1)


def create_short(image_paths, output_path, fps=24):
    clip = ImageSequenceClip(image_paths, fps=fps)
    clip.write_videofile(output_path, codec='libx264')
    return output_path

if __name__ == "__main__":
    print("Creating short...")

    try:
        data = json.loads(sys.argv[1])
        print(f"Received data: {data}")

        image_paths = data.get("image_paths")
        output_path = data.get("output_path")
        print(f"Image paths: {image_paths}")
        print(f"Output path: {output_path}")

        result = create_short(image_paths, output_path)
        print(json.dumps({"video_path": result}))

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
