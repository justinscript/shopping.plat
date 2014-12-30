#! /bin/bash

path=`pwd`

echo 'cd '$path',and mevan install package,bulid  war'
echo 'cp $JAVA_HOME/jre/lib/ext/sunjce_provider.jar to src/main/webapp/WEB-INF/lib'
cp $JAVA_HOME/jre/lib/ext/sunjce_provider.jar $path/src/main/webapp/WEB-INF/lib/
which mvn
mvn clean && mvn install package -Dmaven.test.skip=true
