## Inspiration

Our goal is to improve the experience of the developers. Most of the code around the Internet isn't properly commented because it is a hassle to write comments. To solve this issue we have developed this extension. 

## What it does

It searches for the next flight to the cities indicated to the Telegram bot via text or via a voice note. 

## How we built it

We used python as a programing lenguage, and a bunch of libraries and dependances like the [Telegram Python wrapper](https://python-telegram-bot.org) for the Telegram bot comunication, the [SpeechRecognition](https://pypi.org/project/SpeechRecognition/)  library for the speech function, the [AudioSegment wrapper](https://pypi.org/project/audiosegment/) for transform audio files to be compatible with the differents libraries and ffmpeg framework as a dependence of AudioSegment. Also we used Hidora to host the application.

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