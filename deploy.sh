#! /bin/bash

path=`pwd`

echo "svn up project"
svn up /root/workspace/com.mmj.pet/

echo "shutdown tomcat app"
ps aux|grep tomcat |grep -v grep|grep tomcat|awk '{print $2}'|xargs kill -9

echo "delete webapps"
rm -rf /data/run/tomcat/webapps/*
rm -rf target/*

echo 'cd '$path',and mevan install package,bulid war'
echo 'cp $JAVA_HOME/jre/lib/ext/sunjce_provider.jar to src/main/webapp/WEB-INF/lib'
cp $JAVA_HOME/jre/lib/ext/sunjce_provider.jar $path/src/main/webapp/WEB-INF/lib/
which mvn
mvn clean && mvn install package -Dmaven.test.skip=true

echo "copy ROOT.war to webapps"
cp target/mmj.war /data/run/tomcat/webapps/ROOT.war 

echo "start tomcat"
/data/run/tomcat/bin/startup.sh
sleep 70

echo "chown nobody"
chown -R nobody:nobody /data/run/tomcat/webapps/*

echo "watch logs"
tail -f /data/run/tomcat/webapps/ROOT/logs/web.log
