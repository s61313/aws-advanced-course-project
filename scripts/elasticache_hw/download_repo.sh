#!/bin/bash
repo_url=$1
repo_branch=$2
cd /home/ec2-user
git clone $repo_url
git checkout $repo_branch
git branch

# bash download_repo http://your.repo.com exercise_initial
