import machine
import time
import network
from umqtt.simple import MQTTClient
import wave
import math
import gc
import micropython as upy
from ftplib import FTP
import struct

adc = machine.ADC(machine.Pin(32))

wifi_ssid = "Redmi Note 10 Pro"
wifi_password = "anthony9"
mqtt_server = "192.168.35.92"
mqtt_topic = "test/topic"

last_ping = time.time()
ping_interval = 60
data_received = bytearray()

#Crée la connexion WiFi de l'ESP32 au serveur
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Connexion au WiFi...")
        wlan.connect(wifi_ssid, wifi_password)
        while not wlan.isconnected():
            pass
    print("Connecté au WiFi:", wlan.ifconfig())

#Fonction permettant l'envoie du fichier .wav en FTP
def send_file_via_ftp(filename):
    ftp = FTP('192.168.35.92')  
    ftp.login('anonymous', 'guest')  
    ftp.cwd('/')  # On se place à la racne du serveur
    with open(filename, 'rb') as fp: 
        ftp.storbinary(f'STOR {filename}', fp)
    ftp.quit()

#Fonction permettant l'envoi d'information propre au fichier créer durant l'enregistrement
def mqtt_publish(message):
    client = MQTTClient("esp32", mqtt_server, 1883)
    print(mqtt_topic, message)
    client.connect()
    client.publish(mqtt_topic, message)
    client.disconnect()

#Fonction qui sera lancée automatiquement lorsqu'un message sera reçu par l'abonnement
def sub_cb(topic, msg):
    global data_received
    print("Received message:", msg)
    data_received = msg

#Fonction qui permet l'abonnement MQTT en se connectant au serveur MQTT et attends un message
#Lorsque le message envoyé est start, l'enregistrement démarre. Le message stop arrête l'enregistrement
#Retourne la durée de l'enregistrement
def mqtt_subscribe():
    global data_received 
    
    client = MQTTClient("esp32", mqtt_server, 1883)
    client.set_callback(sub_cb)
    client.connect()
    client.subscribe(mqtt_topic)
    
    #Sort de la boucle quand le message reçu est stop
    while data_received.decode('utf-8').endswith('stop') == False:
        print("Waiting for message...")
        client.wait_msg()
        #Si le message reçu est start, commence l'enregistrement et répète la boucle
        if data_received.decode('utf-8').endswith('start'):
            duration = record_audio_to_wav("enregistrement.wav", 3)
        global last_ping
        if (time.time() - last_ping) >= ping_interval:
            client.ping()
            last_ping = time.time()
            now = time.localtime()
            print(f"Pinging MQTT Broker, last ping :: {now[0]}/{now[1]}/{now[2]} {now[3]}:{now[4]}:{now[5]}")
        time.sleep(1)
    return duration

#Fonction qui gère de chaque frame de l'audio
#Retourne l'amplitude
def sound_wave(frequency, num_seconds):
    i = 0
    for frame in range(round(num_seconds * 8000)):       
        time = frame / 8000
        amplitude = math.sin(2 * math.pi * frequency * time)
        yield amplitude

#Fonction qui enregistre l'audio
#Retourne la durée du l'audio
def record_audio_to_wav(filename, duration):
    adc = machine.ADC(machine.Pin(32))
    adc.atten(machine.ADC.ATTN_11DB)
    adc.width(machine.ADC.WIDTH_9BIT) 
    samples = bytearray()

    for amplitude in sound_wave(440, duration):
        sensor_value = adc.read()
        scaled_amplitude = amplitude * (sensor_value / 511) 
        
        # Convertir l'amplitude en un entier dans la plage de -32768 à 32767 (16 bits signés)
        scaled_amplitude = round(scaled_amplitude * 32767)
        
        # Ajouter l'échantillon à la liste des échantillons
        # Utilisez struct.pack pour convertir l'entier en format binaire sur 2 octets (int16)
        samples.extend(struct.pack('<h', scaled_amplitude))

    # Enregistrer les échantillons dans un fichier WAV
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(1)  # Mono
        wf.setsampwidth(2)  # Largeur de l'échantillon en octets (16 bits)
        wf.setframerate(8000)  # Taux d'échantillonnage
        wf.writeframes(samples)
    return duration


def main():
    gc.mem_free()
    #connect_wifi()
    print("Début de l'enregistrement!")
    #duration = mqtt_subscribe()
    duration = record_audio_to_wav("enregistrement.wav", 1.5)
    current_time = time.localtime()
    new_current_time = []
    for element in current_time:
        if element < 10:
            element = f"0{element}"
        new_current_time.append(element)
    current_date = f"{new_current_time[3]}:{new_current_time[4]}:{new_current_time[5]} {new_current_time[2]}/{new_current_time[1]}/{new_current_time[0]}"
    print("Durée de l'enregistrement:", duration, "secondes")
    print("Date de création du fichier: ", current_date)

    # Envoi des données via MQTT
    message = "Date de création du fichier: {},Durée de l'enregistrement: {} secondes".format(current_date, duration)
    #mqtt_publish(message)
    
    #Envoi du fichier en FTP
    #send_file_via_ftp("enregistrement.wav")

if __name__ == "__main__":
    main()

