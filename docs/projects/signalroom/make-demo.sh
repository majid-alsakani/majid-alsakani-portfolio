#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")"
ffmpeg -y -hide_banner -loglevel error -loop 1 -i assets/preview.webp -vf "scale=960:-2:flags=lanczos,crop=960:540:(in_w-960)/2:min(150\,in_h-540),zoompan=z='min(zoom+0.0006,1.04)':d=180:s=960x540:fps=30" -t 6 -an -c:v libx264 -pix_fmt yuv420p -movflags +faststart assets/demo.mp4
