# Lie to Me Google Chrome Extension

## Introduction

Google Chrome extension for the web version of Amazon Chime, which adds machine learning to recognize facial expressions

## Features

* Extension recognizes the following expressions: `angry`, `disgust`, `fear`, `happy`, `neutral`, `sad`, `surprise`
* Functionality can be activated by pressing `Lie to Me` button below the video of the target person during video conference call

## Content Attribution

* TensorFlow.js library and packages for detecting facial landmarks by [TenserFlow](https://github.com/tensorflow)
* TensorFlow Expression Model and usage example by [Raphael Mun](https://github.com/raphaelmun)
* Icons made by [Freepik](https://www.flaticon.com)

## Install from the Chrome Marketplace

Currently this extension is not available in Chrome Marketplace

## Install Locally

1. Clone this repository to your computer
2. Build files required for the extension:

    ``` shell
    ./publish.sh
    ```

3. Open `Chrome Menu -> More Tools -> Extensions`
4. Enable `Developer mode`
5. Press `Load unpacked` and select path to `dist` folder in your repository, for example:

    ``` shell
    /Users/<your-username>/Projects/ashkue/extension-chime-lie-to-me/dist
    ```

    ![alt Load Chrome Extension](https://raw.githubusercontent.com/ashkue/extension-chime-lie-to-me/master/readme-load-local.png)