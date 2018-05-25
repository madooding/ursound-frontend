FROM nginx:stable-alpine

# Copy nginx server configuration
WORKDIR /etc/nginx
ADD nginx.conf .


# Copy web app content
WORKDIR /usr/share/nginx/html

COPY dist/ .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
