import xml.etree.cElementTree as ET
import simplejson as json
from cloudant.client import Cloudant
USERNAME = '0e02ede9-86ba-497d-b352-8217aec97af2-bluemix'
PASSWORD = '34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79'
uri = 'http://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com'
client = Cloudant(USERNAME, PASSWORD, url = uri )
client.connect()
my_database = client['fleeter']

root = ET.Element("root")

loopCounter = 0
for part in my_database:
    #print str(part['precip_hrly'])
    if str(part['precip_hrly']) == 'None':
        part['precip_hrly'] = 0



    if str(part['TweetScore']) == 'None':
        part['TweetScore'] = 0
    if str(part['wspd']) == 'None':
        part['wspd'] = 0

    if str(part['pressure']) == 'None':
        part['pressure'] = 0
    if str(part['feels_like']) == 'None':
        part['feels_like'] = 0
    if str(part['wdir_cardinal']) == 'None':
        part['wdir_cardinal'] = 0
    print part['temp']
    if str(part['temp']) == 'None':
        part['temp'] = 0
        print part['temp']
    loopCounter += 1
    if loopCounter > 500:
        break
loopCounter = 0
for part in my_database:
    doc = ET.SubElement(root, "doc")
    ET.SubElement(doc, "Score").text = str(part['TweetScore'])
    ET.SubElement(doc, "wspd").text = str(part['wspd'])
    #ET.SubElement(doc, "precip_hrly").text = str(part['precip_hrly'])
    #ET.SubElement(doc, "pressure").text = str(part['pressure'])
    ET.SubElement(doc, "clds").text = str(part['clds'])
    ET.SubElement(doc, "feels_like").text = str(part['feels_like'])
    ET.SubElement(doc, "wx_phrase").text = str(part['wx_phrase'])
    ET.SubElement(doc, "wdir_cardinal").text = str(part['wdir_cardinal'])
    ET.SubElement(doc, "temp").text = str(part['temp'])

    ET.SubElement(doc, "heat_index").text = str(part['heat_index'])
    loopCounter += 1
    if loopCounter > 500:
        break

tree = ET.ElementTree(root)
tree.write("weatherSentiment.xml")
client.disconnect()
