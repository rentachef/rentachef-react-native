#!/bin/zsh

echo "🧩 Stage: PRE-Xcode Build is activated .... "

cd .. && yarn add -D react-native-cli && react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle

echo "🎯 Stage: PRE-Xcode Build is DONE .... "

exit 0
