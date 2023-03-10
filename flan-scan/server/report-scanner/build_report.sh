#!/bin/bash 


aws s3 cp flan-scan/server/report-scanner/shared/combined.txt s3://ayushibucket123
aws s3api get-object --bucket ayushibucket123 --key combined.txt /app/shared/combined.txt
file1="/app/shared/combined.txt"
file2="/app/shared/ips.txt"
mkdir -p /app/shared/reports/$(date +%Y-%m-%d)

while IFS= read -r line
do 
   ip=$(nslookup $line | grep "Address" | awk '{print $2}' | sed -n 2p)
   domain=$line
   echo $ip > $file2
  
   cd /app
   make html
   cd /app/shared/reports
   
   for file in *.html
   do 
	   mv $file "$(date +%Y-%m-%d)/$domain.$ip.html"
      	   cd ..
	   aws s3 sync reports s3://mydemobuket

   done
done < $file1   
