#!/usr/bin/env bash
#
# Starts the LinShare QA stack, under its own compose project, until stop.sh is called. Every
# UI is published on 127.0.0.1 and meant to be reached under its production name (the browser
# maps these names to the containers):
#   http://admin.linshare.local           admin UI           127.0.0.1:QA_ADMIN_PORT
#   http://user.linshare.local            user UI            127.0.0.1:QA_USER_PORT
#   http://upload-request.linshare.local  upload request UI  127.0.0.1:QA_UPLOAD_REQUEST_PORT
#   http://mail.linshare.local            Mailpit            127.0.0.1:QA_MAIL_PORT
#
#   scripts/qa-environment/build.sh     # once, and whenever the code under test changes
#   scripts/qa-environment/start.sh
#
# Accounts: root@localhost.localdomain / adminlinshare (super administrator); the users of the
# test LDAP in the domain top1, e.g. amy.wolsh@linshare.org, abbey.curry@linshare.org,
# peter.wilson@linshare.org / secret (see https://github.com/linagora/linshare-docker); mails
# to anyone else (guests, upload request recipients) land in Mailpit too.
#
# Seeded data: the upload request "QA seed" of amy.wolsh@linshare.org to guest1@linshare.org,
# whose invitation, with its link to the upload request UI, is in Mailpit.
#
set -euo pipefail

source "$(dirname "$0")/common.sh"

echo "==> Starting the stack as compose project '$QA_PROJECT'"
compose up -d

echo "==> Waiting for the backend"
for i in $(seq 1 120); do
  status="$(docker inspect -f '{{.State.Health.Status}}' "$(compose ps -aq backend)" 2>/dev/null || true)"
  [ "$status" = healthy ] && break
  state="$(docker inspect -f '{{.State.Status}}' "$(compose ps -aq backend)" 2>/dev/null || true)"
  if [ "$i" = 120 ] || [ "$state" = exited ] || [ "$state" = dead ]; then  # a crashed backend fails at once
    echo "The backend is not healthy ($status)" >&2
    compose logs --tail 100 backend >&2
    exit 1
  fi
  sleep 5
done

echo "==> Initialising LinShare (domains, LDAP, notification URLs)"
compose run --rm init

# wait_http <name> <url>
wait_http() {
  local name="$1" url="$2" i
  for i in $(seq 1 60); do
    if curl -fs -o /dev/null "$url"; then
      return
    fi
    sleep 2
  done
  echo "$name does not answer on $url" >&2
  compose logs --tail 50 >&2
  exit 1
}

wait_http "admin UI" "http://127.0.0.1:$QA_ADMIN_PORT/"
wait_http "user UI" "http://127.0.0.1:$QA_USER_PORT/"
wait_http "upload request UI" "http://127.0.0.1:$QA_UPLOAD_REQUEST_PORT/"
wait_http Mailpit "http://127.0.0.1:$QA_MAIL_PORT/"

echo "==> Seeding"
curl -fsS -o /dev/null -u amy.wolsh@linshare.org:secret \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -X POST "http://127.0.0.1:$QA_USER_PORT/linshare/webservice/rest/user/v2/upload_request_groups?collectiveMode=false" \
  -d '{"label": "QA seed", "contactList": ["guest1@linshare.org"], "body": "Please upload your files.",
       "maxFileCount": 5, "protectedByPassword": false, "enableNotification": true}'

echo "==> Ready: admin 127.0.0.1:$QA_ADMIN_PORT, user 127.0.0.1:$QA_USER_PORT," \
  "upload request 127.0.0.1:$QA_UPLOAD_REQUEST_PORT, Mailpit 127.0.0.1:$QA_MAIL_PORT"
