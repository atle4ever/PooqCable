import commands
import os
import shutil
import time
import config

import logging

# logger settting
logger = logging.getLogger('CONVERTER')
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s %(levelname)s %(name)s %(message)s')

fh = logging.FileHandler('log')
fh.setFormatter(formatter)
logger.addHandler(fh)

ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

while True:
    logger.info("Let's go!!!")

    for root, dirs, files in os.walk(config.DOWNLOAD_DIR):
        for f in files:
            logger.debug('check: {0}'.format(f))

            # TODO: skip not mp4 files
            if f.endswith('.mp4') == False: continue
    
            if f.startswith('C_'): continue # converted file
            if 'C_' + f in files: continue # already converted
            
            # check if its audio is AAC
            fullPath = os.path.join(root, f)
            output = commands.getoutput('avprobe "{0}"'.format(fullPath))
            logger.debug('avprobe result: {0}'.format(output))
            if output.find('Audio: aac') > -1 :
                continue
    
            # not video files
            if output.find('Invalid data found when processing input') > -1 :
                continue
    
            # convert
            convFile = 'C_' + f
            tempFilePath = os.path.join('temp', convFile)
            convFilePath = os.path.join(root, convFile)
            logger.info('conversion start')
            output = commands.getoutput('avconv -i "{0}" -strict experimental -map 0:0 -codec copy -map 0:1 -acodec aac "{1}"'.format(fullPath, tempFilePath))
            shutil.move(tempFilePath, convFilePath)
            logger.info('conversion end')

    # wait 10min
    logger.info('Sleep.. Zzz')
    time.sleep(10 * 60)
