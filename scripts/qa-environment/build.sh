#!/usr/bin/env bash
#
# Builds the image of the UI under test from the working tree, and pulls the others.
#
#   scripts/qa-environment/build.sh     # once, and whenever the code under test changes
#
set -euo pipefail

source "$(dirname "$0")/common.sh"

echo "==> Building $QA_IMAGE ($QA_UI of the working tree)"
docker build --quiet -f "$SCRIPT_DIR/Dockerfile.ui" \
  --build-arg "BASE_IMAGE=linagora/$QA_UI:$LINSHARE_VERSION" \
  --build-arg "UI=$QA_UI" \
  --build-arg "INSTALL_CMD=$QA_UI_INSTALL" \
  --build-arg "BUILD_CMD=$QA_UI_BUILD" \
  -t "$QA_IMAGE" "$REPO_DIR"

echo "==> Pulling the other images"
compose --profile init config --images | grep -vx "$QA_IMAGE" | sort -u | while read -r image; do
  docker pull --quiet "$image" >/dev/null
done
