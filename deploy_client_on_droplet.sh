#!/bin/bash

rm -rf ~/www/2ths1m/ggj23/*
rsync -r --no-links client/* ~/www/2ths1m/ggj23/
#cp -Hr client/* ~/www/2ths1m/ggj23/.
cp -r common ~/www/2ths1m/ggj23/.
