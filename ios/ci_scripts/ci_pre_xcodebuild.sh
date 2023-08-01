#!/bin/zsh

echo "🧩 Stage: PRE-Xcode Build is activated .... "

cd .. && brew install react-native-cli && react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle

echo "🎯 Stage: PRE-Xcode Build is DONE .... "

exit 0
