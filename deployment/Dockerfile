# 基础镜像
FROM nginx:1.21.1
# 作者
MAINTAINER hexiaohuo@teleinfo.cn
# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" > /etc/timezone
# 项目路径
COPY dist /usr/share/nginx/html
COPY deployment/nginx.conf /etc/nginx/nginx.conf

