#!/usr/bin/env bash
# Signal Noir home reel: creates a silent composite intro from the three verified product motion studies.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MOTION="$ROOT/docs/assets/motion"

ffmpeg -y \
  -i "$MOTION/joobea-signal-motion.mp4" \
  -i "$MOTION/sini-progress-motion.mp4" \
  -i "$MOTION/omni-orchestration-motion.mp4" \
  -filter_complex "
    [0:v]trim=duration=3,setpts=PTS-STARTPTS[a];
    [1:v]trim=duration=3,setpts=PTS-STARTPTS[b];
    [2:v]trim=duration=3,setpts=PTS-STARTPTS[c];
    [a][b]xfade=transition=fadeblack:duration=0.55:offset=2.45[ab];
    [ab][c]xfade=transition=fadeblack:duration=0.55:offset=4.90,drawgrid=width=160:height=180:thickness=1:color=0x9dc0ff@0.04,format=yuv420p[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf 24 -movflags +faststart \
  "$MOTION/signal-noir-home-reel.mp4"

ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,duration -of default=noprint_wrappers=1 "$MOTION/signal-noir-home-reel.mp4"
