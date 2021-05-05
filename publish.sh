#!/bin/bash

npm install
dist_folder=dist
rm -rf $dist_folder
mkdir $dist_folder
mkdir $dist_folder/images
mkdir $dist_folder/vendor
mkdir $dist_folder/models

cp src/manifest.json $dist_folder
cp src/index.js $dist_folder
cp src/images/* $dist_folder/images/
cp src/models/* $dist_folder/models/
cp node_modules/jquery/dist/jquery.min.js $dist_folder/vendor/
cp node_modules/@tensorflow/tfjs/dist/tf.min.js  $dist_folder/vendor/
cp node_modules/@tensorflow/tfjs-core/dist/tf-core.min.js $dist_folder/vendor/
cp node_modules/@tensorflow/tfjs-converter/dist/tf-converter.min.js $dist_folder/vendor/
cp node_modules/@tensorflow/tfjs-backend-webgl/dist/tf-backend-webgl.min.js $dist_folder/vendor/
cp node_modules/@tensorflow-models/face-landmarks-detection/dist/face-landmarks-detection.min.js $dist_folder/vendor/

cd $dist_folder
zip -r ../chime-lie-to-me.zip .
