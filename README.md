PooqCable
=========

# download torrent files
0,10,20,30,40,50 * * * * cd /home/sjkim/PooqCableProd; casperjs collect.js

# remove torrents from transmission
5,35 * * * * cd /home/sjkim/PooqCableProd; python transmission.py
