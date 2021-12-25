#!/bin/bash
echo $PWD
bash $PWD/intsall_nodejs.sh
bash $PWD/kill_process_with_8080.sh
bash $PWD/start_application.sh
