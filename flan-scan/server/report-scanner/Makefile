build :
	docker build --no-cache -t ayushifundwave/nmap_scan -f Dockerfile .

container_name = flan_$(shell date +'%s')

start:
	service docker start

html:
	docker run --rm --name $(container_name) -v shared:/shared -e format=html ayushifundwave/nmap_scan

