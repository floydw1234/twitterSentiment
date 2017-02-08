import simplejson as json
from cloudant.client import Cloudant
USERNAME = '0e02ede9-86ba-497d-b352-8217aec97af2-bluemix'
PASSWORD = '34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79'
uri = 'http://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com'
client = Cloudant(USERNAME, PASSWORD, url = uri )
# or using url
# client = Cloudant(USERNAME, PASSWORD, url='https://acct.cloudant.com')

# Connect to the server
client.connect()
my_database = client['fleeter']

avgTEMPLN5 = 0
avgTEMPBetN50 = 0
avgTEMP0 = 0
avgTEMPBet05 = 0
avgTEMPG5 = 0

avgPRESSLN5 = 0
avgPRESSBetN50 = 0
avgPRESS0 = 0
avgPRESSBet05 = 0
avgPRESSG5 = 0

avgWSPDLN5 = 0
avgWSPDBetN50 = 0
avgWSPD0 = 0
avgWSPDBet05 = 0
avgWSPDG5 = 0

avgHRLYPRECLN5 = 0
avgHRLYPRECBetN50 = 0
avgHRLYPREC0 = 0
avgHRLYPRECBet05 = 0
avgHRLYPRECG5 = 0

counterLN5 = 0
counterBN50 = 0
counter0 = 0
counterB05 = 0
counterG5 = 0

weather = ['temp', 'pressure','precip_hrly','wspd']

for document in my_database:
    for cond in weather:
        if str(document[cond]) == 'None':
            document[cond] = 0
    #print document['temp']

    if document['TweetScore'] < -2:
        avgTEMPLN5 += int(document['temp'])
        avgPRESSLN5 += int(document['pressure'])

        avgHRLYPRECLN5 += int(document['precip_hrly'])
        avgWSPDLN5 += int(document['wspd'])
        counterLN5 += 1
    elif document['TweetScore'] > -2 and document['TweetScore'] < 0:
        avgTEMPBetN50 += int(document['temp'])
        avgPRESSBetN50 += int(document['pressure'])

        avgHRLYPRECBetN50 += int(document['precip_hrly'])
        avgWSPDBetN50 += int(document['wspd'])
        counterBN50 += 1
    elif document['TweetScore'] == 0:
        avgTEMP0 += int(document['temp'])
        avgPRESS0 += int(document['pressure'])

        avgHRLYPREC0 += int(document['precip_hrly'])
        avgWSPD0 += int(str(document['wspd']))
        counter0 += 1
    elif document['TweetScore'] < 2 and document['TweetScore'] > 0:
        avgTEMPBet05 += int(document['temp'])
        avgPRESSBet05 += document['pressure']

        avgHRLYPRECBet05 += document['precip_hrly']
        avgWSPDBet05 += document['wspd']
        counterB05 += 1
    elif document['TweetScore'] > 2 :
        avgTEMPG5 += document['temp']
        avgPRESSG5 += document['pressure']

        avgHRLYPRECG5 += document['precip_hrly']
        avgWSPDG5 += document['wspd']
        counterG5 += 1




avgTEMPLN5 = avgTEMPLN5/counterLN5
avgTEMPBetN50 = avgTEMPBetN50/counterBN50
avgTEMP0 = avgTEMP0/counter0
avgTEMPBet05 = avgTEMPBet05/counterB05
avgTEMPG5 = avgTEMPG5/counterG5

avgPRESSLN5 = avgPRESSLN5/counterLN5
avgPRESSBetN50 = avgPRESSBetN50/counterBN50
avgPRESS0 = avgPRESS0/counter0
avgPRESSBet05 = avgPRESSBet05/counterB05
avgPRESSG5 = avgPRESSG5/counterG5

avgWSPDLN5 = avgWSPDLN5/counterLN5
avgWSPDBetN50 = avgWSPDBetN50/counterBN50
avgWSPD0 = avgWSPD0/counter0
avgWSPDBet05 = avgWSPDBet05/counterB05
avgWSPDG5 = avgWSPDG5/counterG5

avgHRLYPRECLN5 = avgHRLYPRECLN5/counterLN5
avgHRLYPRECBetN50 = avgHRLYPRECBetN50/counterBN50
avgHRLYPREC0 = avgHRLYPREC0/counter0
avgHRLYPRECBet05 = avgHRLYPRECBet05/counterB05
avgHRLYPRECG5 = avgHRLYPRECG5/counterG5



dataArray = []

data1 = {
    'label': 'Temp',
    'avgTempln5': avgTEMPLN5,
    'avgTempb50': avgTEMPBetN50,
    'avgTemp0': avgTEMP0,
    'avgTempb05': avgTEMPBet05,
    'avgTempg5': avgTEMPG5
}

dataArray.append(data1)
data2 = {
    'label': 'Pressure',
    'avgPressln5': avgPRESSLN5,
    'avgPressb50': avgPRESSBetN50,
    'avgPress0': avgPRESS0,
    'avgPressb05': avgPRESSBet05,
    'avgPressg5' : avgPRESSG5

}
dataArray.append(data2)
data3 = {
    'label': 'Precip_hrly',
    'avgphrlyprecln5': avgHRLYPRECLN5,
    'avgphrlyprecb50': avgHRLYPRECBetN50,
    'avgphrlyprec0': avgHRLYPRECBet05,
    'avgphrlyprecb05': avgHRLYPREC0,
    'avgphrlyprecg5': avgHRLYPRECG5
}
dataArray.append(data3)
data4 = {
    'label': 'Wspd',
    'avgWspdln5': avgWSPDLN5,
    'avgWspdb50': avgWSPDBetN50,
    'avgWSPD0' : avgWSPD0,
    'avgWspd0b05': avgWSPD0,
    'avgWspdg5': avgWSPDBet05

}
dataArray.append(data4)


client.delete_database('fleeter_avg')
my_database = client.create_database('fleeter_avg')
my_database = client['fleeter_avg']

for data in dataArray:
    my_document = my_database.create_document(data)
    if my_document.exists():
        print 'stored document'





# Disconnect from the server
client.disconnect()
