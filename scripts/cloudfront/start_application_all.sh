#!/bin/bash
echo $PWD
source $PWD/intsall_nodejs.sh
bash $PWD/kill_process_with_8080.sh
bash $PWD/start_application.sh
