#!/usr/bin/env bash
# Evidence motion renderer: builds silent 720p clips from verified product screenshots using FFmpeg only.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS="$ROOT/docs"
OUT="$DOCS/assets/motion"
mkdir -p "$OUT"

render_clip() {
  local input="$1"
  local output="$2"
  local foreground_filter="$3"
  local scan_color="$4"

  ffmpeg -y -loop 1 -framerate 30 -i "$input" -t 7 \
    -filter_complex "
      [0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,gblur=sigma=26[bg];
      [0:v]${foreground_filter},format=rgba[foreground];
      [bg][foreground]overlay=x='(W-w)/2+sin(t*0.72)*10':y='(H-h)/2+cos(t*0.46)*4':eval=frame[scene];
      [scene]drawbox=x=0:y='mod(t*126,720)':w=1280:h=2:color=${scan_color}@0.58:t=fill,
      drawbox=x='mod(t*190,1280)':y=0:w=2:h=720:color=0xff9368@0.16:t=fill,
      drawgrid=width=160:height=180:thickness=1:color=0x9dc0ff@0.045,
      format=yuv420p[v]" \
    -map "[v]" -an -c:v libx264 -preset slow -crf 25 -movflags +faststart -pix_fmt yuv420p "$output"
}

render_clip \
  "$DOCS/assets/case-studies/joobea/banner.jpg" \
  "$OUT/joobea-signal-motion.mp4" \
  "scale=1130:-2" \
  "0x7eabff"

render_clip \
  "$DOCS/assets/projects/sini-dashboard.jpg" \
  "$OUT/sini-progress-motion.mp4" \
  "scale=-2:625" \
  "0xffb36d"

render_clip \
  "$DOCS/assets/projects/omni-command-center.webp" \
  "$OUT/omni-orchestration-motion.mp4" \
  "scale=940:-2" \
  "0x75b5ff"

for clip in "$OUT"/*.mp4; do
  echo "Rendered: $clip"
  ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,duration -of default=noprint_wrappers=1 "$clip"
done
