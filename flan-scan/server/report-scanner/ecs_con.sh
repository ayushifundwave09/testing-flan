#!/bin/bash 

echo "Creating the cluster with EC2 instance type"

aws ecs create-cluster --cluster-name testing-nmap --region us-east-1

echo "attach the task defination to it"

aws ecs register-task-definition --cli-input-json file:flan-scan/server/report-scanner/testing-nmap.json

#aws ecs list-task-definitions

aws ecs run-task --cluster testing-nmap --task-definition testing-nmap:1 --count 1
