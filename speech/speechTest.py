#!/usr/bin/env python3

# NOTE: this example requires PyAudio because it uses the Microphone class

import speech_recognition as sr
import sys

def callback(recognizer, audio):                          # this is called from the background thread
    try:
        print(recognizer.recognize_google(audio))  # received audio data, now need to recognize it
        sys.stdout.flush()
    except LookupError:
        print("Oops! Didn't catch that")
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
r = sr.Recognizer()
m = sr.Microphone()
with m as source: r.adjust_for_ambient_noise(source)      # we only need to calibrate once, before we start listening
stop_listening = r.listen_in_background(m, callback)

import time
sys.stdin.read(1)
stop_listening()                                          # call the stop function to stop the background thread


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