
Flan Scan is a lightweight network vulnerability scanner. With Flan Scan you can easily find open ports on your network, identify services and their version, and get a list of 
relevant CVEs affecting your network.
Flan Scan is a wrapper over Nmap and the vulners script which turns Nmap into a full-fledged network vulnerability scanner. Flan Scan makes it easy to deploy Nmap locally within a container, push results to the cloud,
and deploy the scanner on Kubernetes.

So, in the project we are genereating the reports for every ips that we have added in the folder shared/ips.txt. So we have made an script file which is
build_report.sh which is creating the reports for every server and keeping those reports in a folder called /shared/reports/<date-of-runnig-script>.

After creating he folder with reports files in it, it will upload all the files with the folder to the s3 bucket. And created am index.html which is listing
all the files on web browser in the listing format along with the creation date and time.

Now for the authentication purpose, made our s3 bucket private and created an lambda fucntion which is fetching the s3 bucket data resources through the 
lambda function url.
Also added some authentication headers so that only authorized users can access the s3 bucket data resources.

So for this process , you have to follow some steps:

  Getting started : 
  
  1) Clone this repository

  2) But first have docker setup:
     Check from the command :
     
     # systemctl status docker            // it should show the docker status as active.
     
  3) Pull the image from the github container registry that has all the setup to generate the reports of the servers that we have in the folder 
       /shared/ips.txt
       
       # docker pull ghcr.io/ayushifundwave09/monitoring/vulnerabilityreport_scanimage:latest
       
  4) while creating this image, I have passed my AWS Account ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY id, you can pass yours so that you can easily upload the report file
      to s3 bucket 
     Here is the command for this :
     
     # docker build --build-arg aws_access_key_id=<aws_access_key_id> --build-arg aws_secret_access_key=<aws_secret_access_key_id> -t <image-name> .
     
  5) Now after building the docker images , we can check on our local system enviornment running docker container. 
     Here is the command for this :
       
      # docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock -v shared:/app/shared <image-name> 
![Uploading nmap.png…]()
      
      And it will give you such type of output :
      
      ![nmap](https://user-images.githubusercontent.com/122795008/219347584-644dc122-26ef-40e9-b4ae-38dccd3fbef5.png)
      
  6) So, now our docker container is perfectly fine and is in working state and also uploading files to s3. Now try Go to s3 bucket console and enable the
     website hosting  and try to access the files. It should show to you like this.
     
     ![s3](https://user-images.githubusercontent.com/122795008/219348669-8a384ccd-88f9-4a18-95ac-edfff88a5444.png)
![s3](https://user-images.githubusercontent.com/122795008/219348697-d7810dd9-4d6e-4237-aef2-7abc12e9ee8f.png)



  
     

