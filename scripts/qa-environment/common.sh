# Shared by build.sh, start.sh and stop.sh. Not meant to be run on its own.
#
# The UI under test is built from this working tree (Dockerfile.ui) on top of its published
# image, so it is served by the same httpd configuration as in production. The rest of the
# LinShare stack runs from published images: the backend, its PostgreSQL and MongoDB, the test
# LDAP directory, the init container (domains, LDAP connection, notification URLs), the two
# other UIs, and Mailpit, which catches every mail the backend sends.
#
# Nothing is published but on 127.0.0.1, on ports of their own.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# The UI of this repository: linshare-ui-admin, linshare-ui-user or linshare-ui-upload-request
QA_UI=linshare-ui-admin
# How the Maven build (pom.xml) installs and builds it
QA_UI_INSTALL="yarn install"
QA_UI_BUILD="yarn run build"
QA_PROJECT="${QA_PROJECT:-linshare-ui-admin-qa}"
export QA_ADMIN_PORT="${QA_ADMIN_PORT:-19200}"
export QA_USER_PORT="${QA_USER_PORT:-19201}"
export QA_UPLOAD_REQUEST_PORT="${QA_UPLOAD_REQUEST_PORT:-19202}"
export QA_MAIL_PORT="${QA_MAIL_PORT:-19203}"

# Version of the published LinShare images
export LINSHARE_VERSION="${LINSHARE_VERSION:-6.5}"

# The image of each UI: the one under test is built by build.sh, the others are published
export QA_IMAGE_UI_ADMIN="linagora/linshare-ui-admin:$LINSHARE_VERSION"
export QA_IMAGE_UI_USER="linagora/linshare-ui-user:$LINSHARE_VERSION"
export QA_IMAGE_UI_UPLOAD_REQUEST="linagora/linshare-ui-upload-request:$LINSHARE_VERSION"
QA_IMAGE="$QA_PROJECT-ui"
case "$QA_UI" in
  linshare-ui-admin) QA_IMAGE_UI_ADMIN="$QA_IMAGE" ;;
  linshare-ui-user) QA_IMAGE_UI_USER="$QA_IMAGE" ;;
  linshare-ui-upload-request) QA_IMAGE_UI_UPLOAD_REQUEST="$QA_IMAGE" ;;
esac

for arg in "$@"; do
  echo "Unknown argument: $arg" >&2
  exit 1
done

compose() {
  docker compose -p "$QA_PROJECT" -f "$SCRIPT_DIR/docker-compose.qa.yml" "$@"
}
