
FOR /F "tokens=* USEBACKQ" %%F IN (`findstr "name" "package.json"`) DO (
SET appname=%%F
)
set appname=%appname:"name": "=%
set appname=%appname:",=%

FOR /F "tokens=* USEBACKQ" %%F IN (`findstr "version" "package.json"`) DO (
SET vers=%%F
)
set vers=%vers:"version": "=%
set vers=%vers:",=%


cmd /c "npm run-script build"

robocopy build ..\%appname%export /mir /xd .git /xf CNAME

git tag "v%vers%"
git push origin master "v%vers%"

pushd "..\%appname%export"
git add -A
git commit -m "v%vers% rebuild"
git tag "v%vers%"
git push origin master "v%vers%"
popd