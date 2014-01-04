import commands

output = commands.getstatusoutput('transmission-remote localhost -l')[1]
lines = output.split('\n')

for l in lines[1:-1] :
    words = l.split()

    tid = words[0]
    status = words[4]

    if(status == 'Done') :
        commands.getstatusoutput('transmission-remote localhost -t{0} -r'.format(tid))
