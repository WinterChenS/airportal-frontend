FROM nginx
COPY dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/cert/cert.pem /etc/nginx/cert/cert.pem
COPY nginx/cert/cert.key /etc/nginx/cert/cert.key