#!/bin/sh

rm -rf /usr/share/frontend/*

rsync -auv /var/www/frontend/dist/ /usr/share/frontend
