###
#Description: Periodically check videos and convert if need
###

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

fh = logging.FileHandler('convert.log')
fh.setFormatter(formatter)
logger.addHandler(fh)

ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

while True:
    logger.info("Let's go!!!")

    stats = []
    for root, dirs, files in os.walk(config.DOWNLOAD_DIR):
        for f in files:
            fullPath = os.path.join(root, f)

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

            # collect file's stats - modified time, size, full path
            size = os.path.getsize(fullPath)
            mtime = os.path.getmtime(fullPath)
            logger.debug('check: {0}, size: {1}, mtime: {2}'.format(f, size, mtime))
            stats.append( [mtime, fullPath, size] )
            
            if f.startswith(prefix): # converted file
                logger.debug('Converted file')
                continue
            
            if prefix + name + '.mp4' in files: # already converted
                logger.debug("It's already converted")
                continue 
            
            # check if its audio is AAC
            fullPath = os.path.join(root, f)
            output = commands.getoutput('avprobe "{0}"'.format(fullPath))
            logger.debug('avprobe result: {0}'.format(output))
            if output.find('Audio: aac') > -1 :
                logger.debug("Its audio format: AAC")
                continue
    
            # not video files
            if output.find('Invalid data found when processing input') > -1 :
                logger.error("invalid video")
                continue
    
            # convert and move
            convFile = prefix + name + '.mp4'
            tempFilePath = os.path.join('temp', convFile)
            convFilePath = os.path.join(root, convFile)

            logger.info('conversion start')
            output = commands.getoutput('avconv -i "{0}" -strict experimental -map 0:0 -vcodec {2} -map 0:1 -acodec aac {3} "{1}"'.format(fullPath, tempFilePath, vcodec, outputOpt))
            logger.info('conversion end')

            shutil.move(tempFilePath, convFilePath)

    # check max quota
    sizeSum = 0
    stats.sort(reverse=True)
    for stat in stats:
        sizeSum += stat[2]

        if(sizeSum > 300 * 1024 * 1024 * 1024):
            logger.debug('Remove file: {0}'.format(stat[1]))
            os.remove(stat[1])

    # wait 10min
    logger.info('Sleep.. Zzz')
    time.sleep(10 * 60)
