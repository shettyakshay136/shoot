#!/bin/bash

# KYC Flow Terminal Logger
# Usage: ./watch-kyc-logs.sh

echo "=========================================="
echo "KYC Flow Terminal Logger"
echo "=========================================="
echo ""
echo "This script shows terminal logs from:"
echo "  - KYC Modal interactions"
echo "  - API requests and responses"
echo "  - DigiLocker callback handling"
echo "  - Deep link parameters"
echo "  - Storage updates"
echo ""
echo "Press Ctrl+C to stop"
echo ""
echo "Make sure adb is connected:"
adb devices
echo ""
echo "Starting logcat filter..."
echo "=========================================="
echo ""

adb logcat | grep -E "\[KYC|API REQUEST|API RESPONSE|API ERROR|\[DigiLocker|Storage|Redirect"
