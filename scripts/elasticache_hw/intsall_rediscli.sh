#!/bin/bash
cd /home/ec2-user
sudo amazon-linux-extras install epel -y
sudo yum install gcc jemalloc-devel openssl-devel tcl tcl-devel -y
sudo wget http://download.redis.io/redis-stable.tar.gz
sudo tar xvzf redis-stable.tar.gz
cd redis-stable
sudo make BUILD_TLS=yes
echo 'export PATH=$PATH:/home/ec2-user/redis-stable/src' >> ~/.bashrc 
source ~/.bash_profile
redis-cli --version