## Inspiration

The goal of this small project is to improve the developer experience while coding by deploying a tool to make it easier to comment one's code. Most of the code found on the internet has few lines of commentaries or none at all; this is due to how uncomfortable and time consuming it is for the coder to write those comments. With the solution we are presentng, we aim to transform the task of writting commentaries from something boring, repetitive and tiring to a more comfortable and helping task to do.


## What it does

This VS Code add-on uses speech recognition to transform the coder's verbal words into textual commentaries adapted and inserted to the code that is being developed.

## How we built it

The first step to start working on this project was to be able to use a Visual Code API, to accomplish this first point, a simple tutorial provided by Microsoft was followed (https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-sample). Then we started to explore some opensource projects to see how to integrate the VSCode API with speech recognition software like (https://github.com/lanly-dev/VSCode-VoiceCommands). Then we start experimenting with speech software recognition, with some offline solutios as well as some APIs to decide what was our better option. Then we implemented some scripts or apps to get the speech to text functionality and then link it to the extension. Finaly we prepared the extension to publish to the Visual Studio Code Marketplace.



## Challenges we ran into

One of the firsts challenges has been to implement the SpeechRecognition funcionality because the Telegram bot uses a type of audio file that is incompatible for the SpeechRecognition library and we needed to convert the files with the ffmpeg framework and we had difficulties to deploy a docker with this framework installed in it.
Also, another challenge was to read and understant the documentation of the API's and the functionalities of them that weren't in the documentation.

## Accomplishments that we're proud of

Being able to build the entire bot and all it's dependencies in a docker for an seamless deployment

## What we learned

Some members of the team hadn't worked with APIs and dockers before, so we learned about them. It was quite a challenge at first but finally we could understand them enough to work with as a team.
 
## What's next for SkyTelegram

Optimize the usage of the Skyscanner API so we can give a faster response, recognize a date and some preferencies from the user in order to offer a suitable flight, not only answer with the cheapest flight and
 bring translations, so the user can choose between many languages.