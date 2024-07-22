import sys
import json
from moviepy.editor import ImageSequenceClip, CompositeVideoClip, concatenate_videoclips, VideoClip
from moviepy.config import change_settings
from proglog import ProgressBarLogger

# Configure Moviepy to not output anything to stdout
# logging.basicConfig(stream=sys.stderr, level=logging.CRITICAL)  # Set logging to critical only

def add_fade_transition(clip1, clip2, duration=.25):
    clip1 = clip1.crossfadeout(duration)
    clip2 = clip2.crossfadein(duration)
    return concatenate_videoclips([clip1, clip2], method="compose")


def create_short(image_paths, output_path, fps=24):
    try:
        print("Creating short video...")

        # Duration each image should be displayed (excluding transition time)
        image_duration = 5  # seconds
        transition_duration = 1  # seconds
        
        clips = []
        print("Creating clips for each image...")
        for image_path in image_paths:
            # Create a clip for each image
            clip = ImageSequenceClip([image_path], durations=[image_duration])
            clips.append(clip)
        
        # Add transitions between clips
        final_clips = []
        print("Adding fade transitions between clips...")
        for i in range(len(clips) - 1):
            clip_with_transition = add_fade_transition(clips[i], clips[i + 1], duration=transition_duration)
            final_clips.append(clip_with_transition)
        
        # Handling the last clip without a transition
        final_clips.append(clips[-1])
        
        # Combining all clips into one video
        print("Concatenating clips into final video...")
        final_clip = concatenate_videoclips(final_clips, method="compose")

        # Writing the video file to the specified output path
        final_clip.write_videofile(output_path, fps=fps)

        # Indicate the start of the JSON output with a delimiter
        print("JSON_OUTPUT_START")
        return {"video_path": output_path}
    except Exception as e:
        print("JSON_OUTPUT_START")
        return {"error": str(e)}


if __name__ == "__main__":
    try:
        data = json.loads(sys.argv[1])
        image_paths = data.get("image_paths")
        output_path = data.get("output_path")
        result = create_short(image_paths, output_path)

    except Exception as e:
        print("JSON_OUTPUT_START")

        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
