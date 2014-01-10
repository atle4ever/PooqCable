###
# remove complete torrents via transmission's remote control
###

import commands

# get list of torrents
output = commands.getstatusoutput('transmission-remote localhost -l')[1]
lines = output.split('\n')

for l in lines[1:-1] :
    words = l.split()

    tid = words[0]
    status = words[4]

    if(status == 'Done') :
        # remove complete torrent
        commands.getstatusoutput('transmission-remote localhost -t{0} -r'.format(tid))

        # TODO: send e-mail notification
