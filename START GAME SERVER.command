#!/bin/bash
pkill -f "http.server" 2>/dev/null
pkill -f "WEBrick" 2>/dev/null
sleep 1
echo "Starting Football Royal server..."
python3 -m http.server 3000 --directory /Users/ekg/Desktop/Footyquiz
