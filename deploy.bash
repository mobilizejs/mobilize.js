#!/bin/bash
# 
# Simple script to make dev releases
#
# Usage. ./release-trunk.sh ~/path/to/cdn/application [google account name]
#

if [ "$1" == "" ] ; then
        echo "Need target folder"
        exit 1
fi

if [ "$2" != "" ] ; then
    ACCOUNT=$2
else
    ACCOUNT=""
fi

TARGET=$1

LOCAL_APPCFG=$HOME/google_appengine/appcfg.py

if [ -f $LOCAL_APPCFG ] ; then
        APPCFG=$LOCAL_APPCFG
else
        APPCFG=appcfg.py # Global appengine installation
fi

cd docs
sh genapidoc.sh
cd manual
make html
cd ../..
./release.py -d $TARGET/releases trunk

# Use stored App Engine credentials or ask password
if [ "$ACCOUNT" != "" ]; then
    $APPCFG -e $ACCOUNT update $TARGET
else
    $APPCFG update $TARGET
fi
