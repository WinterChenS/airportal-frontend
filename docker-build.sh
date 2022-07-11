#!/bin/bash

if [ X$1 = X ]; then
        read -p "请输入镜像版本号(按回车默认latest)：" version
else
        version=$1
fi

if [ X$version = X ]; then
version=latest
fi

echo -e "\n"
echo "------------------------"
echo "镜像版本为：$version"
echo "------------------------"


npm install &&

npm run build &&

docker build -t airportal-frontend . &&

docker tag airportal-frontend:latest winterchen/airportal-frontend:$version &&

docker push winterchen/airportal-frontend:$version
echo "[上传完成]"