import machine
import time
import network
from umqtt.simple import MQTTClient
import wave
import math
import gc
import micropython as upy
from ftplib import FTP

adc = machine.ADC(machine.Pin(32))

wifi_ssid = "Redmi Note 10 Pro"
wifi_password = "anthony9"
mqtt_server = "192.168.35.92"
mqtt_topic = "test/topic"

last_ping = time.time()
ping_interval = 60
data_received = bytearray()

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Connexion au WiFi...")
        wlan.connect(wifi_ssid, wifi_password)
        while not wlan.isconnected():
            pass
    print("Connecté au WiFi:", wlan.ifconfig())

def send_file_via_ftp(filename):
    ftp = FTP('192.168.35.92')
    ftp.login()
    ftp.retrlines('LIST') 
    with open(filename, 'wb') as fp:
        ftp.retrbinary('RETR enregistrement', fp.write)

def mqtt_publish(message):
    client = MQTTClient("esp32", mqtt_server, 1883)
    print(mqtt_topic, message)
    client.connect()
    client.publish(mqtt_topic, message)
    client.disconnect()
 
def sub_cb(topic, msg):
    global data_received  # Indiquer que vous utilisez la variable globale
    print("Received message:", msg)
    data_received = msg  # Mettre à jour la variable avec les données reçues
    
def mqtt_subscribe():
    global data_received  # Indiquer que vous utilisez la variable globale
    
    client = MQTTClient("esp32", mqtt_server, 1883)
    client.set_callback(sub_cb)
    client.connect()
    client.subscribe(mqtt_topic)
    
    while True:
        print("Waiting for message...")
        client.wait_msg()
        
        if data_received.decode('utf-8').endswith('start'):
            record_audio_to_wav("enregistrement.wav")
        elif data_received.decode('utf-8').endswith('stop'):
            break  # Sortir de la boucle si le message est "Stop"
        
        global last_ping
        if (time.time() - last_ping) >= ping_interval:
            client.ping()
            last_ping = time.time()
            now = time.localtime()
            print(f"Pinging MQTT Broker, last ping :: {now[0]}/{now[1]}/{now[2]} {now[3]}:{now[4]}:{now[5]}")
        time.sleep(1)


def sound_wave(frequency):
    i = 0
    while True:
        amplitude = next(sound_wave_generator(frequency))
        yield amplitude

def sound_wave_generator(frequency):
    i = 0
    while True:
        time = i / 8000
        amplitude = math.sin(2 * math.pi * frequency * time)
        yield amplitude
        i += 1

def record_audio_to_wav(filename):
    adc = machine.ADC(machine.Pin(32))
    adc.atten(machine.ADC.ATTN_11DB)
    adc.width(machine.ADC.WIDTH_9BIT) 

    samples = bytearray()

    while True:
        amplitude = next(sound_wave(440))  # Obtenir l'amplitude du prochain échantillon

        sensor_value = adc.read()
        scaled_amplitude = amplitude * (sensor_value / 511) 
        
        # Convertir l'amplitude en un entier dans la plage de 0 à 255
        scaled_amplitude = round((scaled_amplitude + 1) / 2 * 255)
        
        # Ajouter l'échantillon à la liste des échantillons
        samples.append(scaled_amplitude & 0xFF)  # Conserver uniquement les 8 bits de poids faible
        
        # Vérifier si un message "Stop" a été reçu
        if data_received.decode('utf-8').endswith('stop'):
            break  # Sortir de la boucle si le message est "Stop"

    # Enregistrer les échantillons dans un fichier WAV
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(1)  # Mono
        wf.setsampwidth(1)  # Largeur de l'échantillon en octets (8 bits)
        wf.setframerate(8000)  # Taux d'échantillonnage
        wf.writeframes(samples)



# Fonction principale
def main():
    
    print(upy.mem_info())
    connect_wifi()
    duration = mqtt_subscribe()
    print(data_received)

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
    mqtt_publish(message)
    send_file_via_ftp("enregistrement.wav")

# Exécuter le programme
if __name__ == "__main__":
    main()

