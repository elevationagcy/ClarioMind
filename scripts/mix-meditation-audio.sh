#!/usr/bin/env bash

# Mix meditation narrations with background music using ffmpeg
# Ensures narration is clear and prominent, music is subtle background

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎵 Meditation Audio Mixer${NC}"
echo "================================"
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ ffmpeg is not installed${NC}"
    echo "Install it with: brew install ffmpeg"
    exit 1
fi

# Directories
INPUT_DIR="public/music"
OUTPUT_DIR="public/music/mixed"
BACKGROUND_MUSIC="$INPUT_DIR/meditation-music-368634.mp3"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Check if background music exists
if [ ! -f "$BACKGROUND_MUSIC" ]; then
    echo -e "${RED}❌ Background music not found: $BACKGROUND_MUSIC${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Processing 4 meditation files...${NC}"
echo ""

# Process each narration with its name
process_meditation() {
    local num=$1
    local name=$2
    local NARRATION="$INPUT_DIR/${num}.mp3"
    local OUTPUT="$OUTPUT_DIR/${name}-meditation.mp3"
    
    if [ ! -f "$NARRATION" ]; then
        echo -e "${RED}❌ Narration not found: $NARRATION${NC}"
        return 1
    fi
    
    echo -e "${GREEN}🎙️ Processing: ${name} (${num}.mp3)${NC}"
    
    # Get duration of narration
    local DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$NARRATION")
    echo "   Duration: ${DURATION}s"
    
    # Calculate fade out start time (duration - 5 seconds)
    local FADE_OUT_START=$(echo "$DURATION - 5" | bc)
    echo "   Fade out starts at: ${FADE_OUT_START}s"
    
    # Mix narration with background music
    # - Narration at 100% volume
    # - Background music at 25% volume, fades in/out
    # - Background loops if needed to match narration length
    # - High quality output (320kbps)
    
    ffmpeg -i "$NARRATION" -stream_loop -1 -i "$BACKGROUND_MUSIC" \
        -filter_complex "\
            [1:a]volume=0.25,afade=t=in:st=0:d=3,afade=t=out:st=${FADE_OUT_START}:d=5[music]; \
            [0:a]volume=1.0[narration]; \
            [music][narration]amix=inputs=2:duration=first:dropout_transition=2[out]" \
        -map "[out]" \
        -b:a 320k \
        -ar 48000 \
        -ac 2 \
        -t "$DURATION" \
        -y \
        "$OUTPUT" \
        2>&1 | grep -v "Streamcopy requested" || true
    
    if [ -f "$OUTPUT" ]; then
        local SIZE=$(du -h "$OUTPUT" | cut -f1)
        echo -e "   ${GREEN}✅ Created: ${OUTPUT}${NC}"
        echo -e "   Size: ${SIZE}"
    else
        echo -e "   ${RED}❌ Failed to create output${NC}"
    fi
    
    echo ""
}

# Process all meditations
process_meditation 1 "grounding"
process_meditation 2 "breath-awareness"
process_meditation 3 "self-compassion"
process_meditation 4 "stress-release"

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ All meditations mixed successfully!${NC}"
echo ""
echo -e "${YELLOW}📁 Output files in: $OUTPUT_DIR${NC}"
ls -lh "$OUTPUT_DIR"/*.mp3 2>/dev/null || echo "No files found"
echo ""
echo -e "${YELLOW}📤 Next step: Run upload script to send to Supabase${NC}"

