#!/bin/bash 

echo "Creating the cluster with EC2 instance type"

aws ecs create-cluster --cluster-name testing-nmap --region us-east-1
aws ecs update-cluster-settings --cluster testing-nmap --settings name=containerInsights,value=enabled

echo "attach the task defination to it"

aws ecs register-task-definition --cli-input-json file://$HOME/testing-flan/flan-scan/server/report-scanner/testing-nmap.json

echo "running the task using the task definaions"

aws ecs run-task --cluster testing-nmap --task-definition testing-nmap:1 --count 1
