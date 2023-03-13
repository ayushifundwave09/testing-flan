#!/bin/bash 


## Chceking and updting the ECR Image 


ECR_Repository=$(aws ecr create-repository --repository-name testing-flan --image-scanning-configuration scanOnPush=true --region us-east-1 2>&1)

status=$?
if [ $status -eq 0 ];then
	echo "successfully created the ECR Repository"
	ECR_REGISTRY=$(aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 424190030866.dkr.ecr.us-east-1.amazonaws.com)
        
        docker build flan-scan/server/report-scanner -t testing-flan:latest -f flan-scan/server/report-scanner/Dockerfile
	docker tag testing-flan:latest 424190030866.dkr.ecr.us-east-1.amazonaws.com/testing-flan:latest
	docker push 424190030866.dkr.ecr.us-east-1.amazonaws.com/testing-flan:latest
else 
	echo "your repo is already there"

        check_image=$(aws ecr describe-images --repository-name testing-flan --region us-east-1 2>&1)

	if [ $? -eq 0 ];then
		echo "image are already there"
	else 
		 ECR_REGISTRY=$(aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 424190030866.dkr.ecr.us-east-1.amazonaws.com)
        
        docker build flan-scan/server/report-scanner -f flan-scan/server/report-scanner/Dockerfile -t testing-flan:latest
        docker tag testing-flan:latest 424190030866.dkr.ecr.us-east-1.amazonaws.com/testing-flan:latest
        docker push 424190030866.dkr.ecr.us-east-1.amazonaws.com/testing-flan:latest

	fi 
fi

