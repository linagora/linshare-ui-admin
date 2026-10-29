#!/usr/bin/env bash
#
# Stops the LinShare QA stack and deletes its data.
#
#   scripts/qa-environment/stop.sh
#
set -euo pipefail

source "$(dirname "$0")/common.sh"

compose --profile init down -v --remove-orphans
