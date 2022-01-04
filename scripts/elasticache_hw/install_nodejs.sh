#!/bin/bash
pwd_initial=$PWD
cd /home/ec2-user
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
source ~/.bash_profile
source ~/.bashrc
cd $pwd_initial