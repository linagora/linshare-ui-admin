#!/bin/bash
set -e
set -x

l_version=$(grep version package.json | cut -d'"' -f4)
l_output="linshare-ui-admin-${l_version}.tar.bz2"

echo "INFO: Cleaning ..."
rm -fr linshare-ui-admin
rm -fr linshare-ui-admin-*
echo "INFO: Building ..."
grunt build
echo "INFO: Packaging..."
mv dist linshare-ui-admin
tar cjf linshare-ui-admin-${l_version}.tar.bz2 linshare-ui-admin
echo "INFO: Done"

