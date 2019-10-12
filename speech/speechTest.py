#!/usr/bin/env python3

# NOTE: this example requires PyAudio because it uses the Microphone class

import speech_recognition as sr
import sys

lang = sys.argv[1]

r = sr.Recognizer()
with sr.Microphone() as source:                # use the default microphone as the audio source
    r.adjust_for_ambient_noise(source)         # listen for 1 second to calibrate the energy threshold for ambient noise levels
    audio = r.listen(source)                   # now when we listen, the energy threshold is already set to a good value, and we can reliably catch speech right away

input()

try:
    print(r.recognize_google(audio, language=lang))    # recognize speech using Google Speech Recognition
except sr.UnknownValueError:
    sys.stderr.write("Google Speech Recognition could not understand audio")
except sr.RequestError as e:
    sys.stderr.write("Could not request results from Google Speech Recognition service; {0}".format(e))
sys.stdout.flush()

                                         # call the stop function to stop the background thread

# # obtain audio from the microphone
# r = sr.Recognizer()
# while 1:
#     with sr.Microphone() as source:
#         print("Say something!")
        
#         audio = r.listen(source)

#         try:
#         # for testing purposes, we're just using the default API key
#         # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
#         # instead of `r.recognize_google(audio)`
#             print("Google Speech Recognition thinks you said:  " + r.recognize_google(audio))
#         except sr.UnknownValueError:
#             print("Google Speech Recognition could not understand audio")
#         except sr.RequestError as e:
#             print("Could not request results from Google Speech Recognition service; {0}".format(e))



        # # recognize speech using Sphinx
        # try:
        #     print("Sphinx thinks you said " + r.recognize_sphinx(audio))
        # except sr.UnknownValueError:
        #     print("Sphinx could not understand audio")
        # except sr.RequestError as e:
        #     print("Sphinx error; {0}".format(e))