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

            # check extension
            name, ext = os.path.splitext(f)
            if ext == '.avi':
                vcodec = 'libx264'
                outputOpt = '-s 720x480'
                prefix = 'C_450p_'
            elif ext == '.mp4':
                vcodec = 'copy'
                outputOpt = ''
                prefix = 'C_'
            else: 
                logger.error('unsupported ext: {0}'.format(ext))
                continue

            if f.startswith(prefix): continue # converted file
            if prefix + name + '.mp4' in files: continue # already converted
            
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
            convFile = prefix + name + '.mp4'
            tempFilePath = os.path.join('temp', convFile)
            convFilePath = os.path.join(root, convFile)
            logger.info('conversion start')
            output = commands.getoutput('avconv -i "{0}" -strict experimental -map 0:0 -vcodec {2} -map 0:1 -acodec aac {3} "{1}"'.format(fullPath, tempFilePath, vcodec, outputOpt))
            shutil.move(tempFilePath, convFilePath)
            logger.info('conversion end')

    # wait 10min
    logger.info('Sleep.. Zzz')
    time.sleep(10 * 60)
