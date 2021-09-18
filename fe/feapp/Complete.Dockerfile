FROM nginx:1.19.4
COPY nginx.conf /etc/nginx/nginx.conf
COPY /dist/feapp /usr/share/nginx/html
