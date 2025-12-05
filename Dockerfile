#FROM  10.1.27.43/common:nginx
FROM 10.1.16.211:8005/support/nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/hbt-nextgen /usr/share/nginx/html
