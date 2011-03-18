#!/bin/bash
# 
# Simple script to make dev releases
#
# Usage. ./release-trunk.sh ~/path/to/cdn/application
#

if [ "$1" == "" ] ; then
        echo "Need target folder"
        exit 1
fi

S

TARGET=$1

LOCAL_APPCFG=$HOME/google_appengine/appcfg.py

if [ -f $LOCAL_APPCFG ] ; then
        APPCFG=$LOCAL_APPCFG
else
        APPCFG=appcfg.py # Global appengine installation
fi

cd docs
sh genapidocs.sh
cd manual
make html
cd ../..
./release.py -d $TARGET/releases trunk

$APPCFG update $TARGET

