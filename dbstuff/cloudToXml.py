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
things = []
things.append('wspd')
things.append('TweetScore')
things.append('precip_hrly')
things.append('pressure')
things.append('clds')
things.append('feels_like')
things.append('wx_phrase')
things.append('temp')
things.append('wdir_cardinal')
things.append('heat_index')

breakThing = 0
for part in my_database:
    doc = ET.SubElement(root, "doc")
    for attribute in things:
        if str(part[attribute]) == 'None' or part['TweetScore'] == 0:
            breakThing = 69
            break
    if breakThing == 69:
        print "break"
        breakThing = 0
        continue


    for attribute in things:
        ET.SubElement(doc, attribute).text = str(part[attribute])
    loopCounter += 1
    if loopCounter > 5000:
        break

tree = ET.ElementTree(root)
tree.write("weatherSentiment.xml")
client.disconnect()
