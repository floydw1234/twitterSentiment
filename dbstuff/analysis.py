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
        avgTEMPLN5 += document['temp']
        avgPRESSLN5 += document['pressure']

        avgHRLYPRECLN5 += document['precip_hrly']
        avgWSPDLN5 += document['wspd']
        counterLN5 += 1
    elif document['TweetScore'] > -2 and document['TweetScore'] < 0:
        avgTEMPBetN50 += document['temp']
        avgPRESSBetN50 += document['pressure']

        avgHRLYPRECBetN50 += document['precip_hrly']
        avgWSPDBetN50 += document['wspd']
        counterBN50 += 1
    elif document['TweetScore'] == 0:
        avgTEMP0 += document['temp']
        avgPRESS0 += document['pressure']

        avgHRLYPREC0 += document['precip_hrly']
        avgWSPD0 += document['wspd']
        counter0 += 1
    elif document['TweetScore'] < 2 and document['TweetScore'] > 0:
        avgTEMPBet05 += document['temp']
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


#float("{0:.3f}".format(

avgTEMPLN5 = float("{0:.3f}".format(avgTEMPLN5/counterLN5))
avgTEMPBetN50 = float("{0:.3f}".format(avgTEMPBetN50/counterBN50))
avgTEMP0 = float("{0:.3f}".format(avgTEMP0/counter0))
avgTEMPBet05 = float("{0:.3f}".format(avgTEMPBet05/counterB05))
avgTEMPG5 = float("{0:.3f}".format(avgTEMPG5/counterG5))

avgPRESSLN5 = float("{0:.3f}".format(avgPRESSLN5/counterLN5))
avgPRESSBetN50 = float("{0:.3f}".format(avgPRESSBetN50/counterBN50))
avgPRESS0 = float("{0:.3f}".format(avgPRESS0/counter0))
avgPRESSBet05 = float("{0:.3f}".format(avgPRESSBet05/counterB05))
avgPRESSG5 = float("{0:.3f}".format(avgPRESSG5/counterG5))

avgWSPDLN5 = float("{0:.3f}".format(avgWSPDLN5/counterLN5))
avgWSPDBetN50 = float("{0:.3f}".format(avgWSPDBetN50/counterBN50))
avgWSPD0 = float("{0:.3f}".format(avgWSPD0/counter0))
avgWSPDBet05 = float("{0:.3f}".format(avgWSPDBet05/counterB05))
avgWSPDG5 = float("{0:.3f}".format(avgWSPDG5/counterG5))

avgHRLYPRECLN5 = float("{0:.3f}".format(avgHRLYPRECLN5/counterLN5))
avgHRLYPRECBetN50 = float("{0:.3f}".format(avgHRLYPRECBetN50/counterBN50))
avgHRLYPREC0 = float("{0:.3f}".format(avgHRLYPREC0/counter0))
avgHRLYPRECBet05 = float("{0:.3f}".format(avgHRLYPRECBet05/counterB05))
avgHRLYPRECG5 = float("{0:.3f}".format(avgHRLYPRECG5/counterG5))



dataArray = []

data1 = {
    'label': 'Temp',
    'ln5': avgTEMPLN5,
    'b50': avgTEMPBetN50,
    'e0': avgTEMP0,
    'b05': avgTEMPBet05,
    'g5': avgTEMPG5
}


data2 = {
    'label': 'Pressure',
    'ln5': avgPRESSLN5,
    'b50': avgPRESSBetN50,
    'e0': avgPRESS0,
    'b05': avgPRESSBet05,
    'g5' : avgPRESSG5

}

data3 = {
    'label': 'Precip_hrly',
    'ln5': avgHRLYPRECLN5,
    'b50': avgHRLYPRECBetN50,
    'e0': avgHRLYPRECBet05,
    'b05': avgHRLYPREC0,
    'g5': avgHRLYPRECG5
}

data4 = {
    'label': 'Wspd',
    'ln5': avgWSPDLN5,
    'b50': avgWSPDBetN50,
    'e0' : avgWSPD0,
    'b05': avgWSPD0,
    'g5': avgWSPDBet05
}
dataArray.append(data2)
dataArray.append(data4)
dataArray.append(data3)
dataArray.append(data1)


#client.delete_database('fleeter_avg')
#my_database = client.create_database('fleeter_avg')
my_database = client['fleeter_avg']

'''
for data in dataArray:
    my_document = my_database.create_document(data)
    if my_document.exists():
        print 'stored document'
'''
i = 0
for document in my_database:
    document['ln5'] = dataArray[i]['ln5']
    document['b50'] = dataArray[i]['b50']
    document['e0'] = dataArray[i]['e0']
    document['b05'] = dataArray[i]['b05']
    document['g5'] = dataArray[i]['g5']
    document.save()
    i += 1






# Disconnect from the server
client.disconnect()
