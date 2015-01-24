#!/usr/bin/env bash

# <!-- iOS 7.0+ -->
# <!-- iPhone / iPod Touch -->
inkscape -f icon.svg -e ios/icon-60.png -w 60 -h 60
inkscape -f icon.svg -e ios/icon-60@2x.png -w 120 -h 120
inkscape -f icon.svg -e ios/icon-60@3x.png -w 180 -h 180

# <!-- iPad -->
inkscape -f icon.svg -e ios/icon-76.png -w 76 -h 76
inkscape -f icon.svg -e ios/icon-76@2x.png -w 152 -h 152

# <!-- iOS 6.1 -->
# <!-- Spotlight Icon -->
inkscape -f icon.svg -e ios/icon-40.png -w 40 -h 40
inkscape -f icon.svg -e ios/icon-40@2x.png -w 80 -h 80

# <!-- iPhone / iPod Touch -->
inkscape -f icon.svg -e ios/icon.png -w 57 -h 57
inkscape -f icon.svg -e ios/icon@2x.png -w 114 -h 114

# <!-- iPad -->
inkscape -f icon.svg -e ios/icon-72.png -w 72 -h 72
inkscape -f icon.svg -e ios/icon-72@2x.png -w 144 -h 144

# <!-- iPhone Spotlight and Settings Icon -->
inkscape -f icon.svg -e ios/icon-small.png -w 29 -h 29
inkscape -f icon.svg -e ios/icon-small@2x.png -w 58 -h 58

# <!-- iPad Spotlight and Settings Icon -->
inkscape -f icon.svg -e ios/icon-50.png -w 50 -h 50
inkscape -f icon.svg -e ios/icon-50@2x.png -w 100 -h 100
