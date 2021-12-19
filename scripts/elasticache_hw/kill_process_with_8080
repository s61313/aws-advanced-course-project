#!/bin/bash
pid_to_kill=$(eval sudo lsof -t -i:8080)
echo 'check if any process is using port 8080...'
if [ -n "${pid_to_kill}" ]
then 
    echo 'kill' $pid_to_kill 'process'
    sudo kill $pid_to_kill
else
    echo 'no process found'	
fi


