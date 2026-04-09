@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%
set WRAPPER_JAR=.mvn\wrapper\maven-wrapper.jar
"%JAVA_HOME%\bin\java.exe" -Dmaven.multiModuleProjectDirectory=. -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
